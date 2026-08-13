/*
 * Better Paste - Plugin for Obsidian
 * Copyright (c) 2026 Johan Sanneblad
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Notice, parseYaml } from 'obsidian';
import type { Editor, MarkdownFileInfo, MarkdownView, TFile } from 'obsidian';
import { runTextPipeline } from '../transforms';
import { cleanAiText } from '../transforms/aiText';
import { buildUrlCleanupOptions, cleanUrlsInText } from '../transforms/urlCleanup';
import { htmlHasImages, imageReferenceRanges, imageSourcesFromHtml } from './imageReferences';
import { extractFrontmatterBlock, isInsideVerbatimContext, isPasteDisabledForNote, resolveImageSize } from './noteOptions';
import { DISABLE_PROPERTY } from '../settings/constants';
import type { ImageService } from './ImageService';
import { escapeLinkTitle } from './LinkTitleService';
import type { LinkTitleService } from './LinkTitleService';
import { logError } from '../utils/logger';
import type { BetterPasteSettings } from '../settings/types';

/** How far before the recorded offset to look when re-finding text the user may have shifted. */
const REALIGN_WINDOW = 512;

/** Surrounding text kept to distinguish a pasted occurrence from an older identical one. */
const RANGE_CONTEXT = 64;

/** Summary of everything a single paste changed, used to build the notice. */
interface PasteSummary {
    aiTextCleaned: boolean;
    terminalCleaned: boolean;
    urlsCleaned: number;
    imagesDownloaded: number;
    imagesFailed: number;
    linkTitlesFetched: number;
}

/** Editor state that identifies one inserted range while network or vault work is pending. */
interface AsyncPasteRange {
    startOffset: number;
    inserted: string;
    valueBefore: string;
    valueAfter: string;
    beforeContext: string;
    afterContext: string;
}

function asyncPasteRange(startOffset: number, inserted: string, valueBefore: string, valueAfter: string): AsyncPasteRange {
    return {
        startOffset,
        inserted,
        valueBefore,
        valueAfter,
        beforeContext: valueAfter.slice(Math.max(0, startOffset - RANGE_CONTEXT), startOffset),
        afterContext: valueAfter.slice(startOffset + inserted.length, startOffset + inserted.length + RANGE_CONTEXT)
    };
}

/** Builds a link from selected text, unless the selection is the pasted address itself. */
function linkFromSelection(selection: string, clipboardText: string, url: string): string | null {
    if (!selection.trim() || selection === clipboardText || selection === url) return null;
    return `[${escapeLinkTitle(selection)}](${url})`;
}

/** True when the clipboard carries exactly one image file. */
export function isSingleImageFile(files: FileList | readonly File[]): boolean {
    const list = Array.from(files);
    return list.length === 1 && list[0].type.toLowerCase().startsWith('image/');
}

/**
 * True when the clipboard HTML is a styled dump of terminal output rather than real rich
 * content. Terminals put a <pre> block on the clipboard alongside the plain text; treating
 * that as plain text lets the terminal cleanup rule run on it.
 */
export function isPreformattedHtml(html: string): boolean {
    if (/<img\b/i.test(html)) return false;
    if (/<a\b[^>]*\bhref\s*=/i.test(html)) return false;
    if (/<table\b/i.test(html)) return false;
    if (/<pre\b[^>]*>\s*<code\b/i.test(html)) return false;

    // A terminal clipboard contains only its pre block plus wrappers and metadata. A web
    // article may contain a pre block beside prose, which must keep Obsidian's rich conversion.
    const content = html.replace(/<head\b[\s\S]*?<\/head\s*>/gi, '');
    if (!/<pre\b/i.test(content)) return false;

    const outsidePre = content
        .replace(/<pre\b[\s\S]*?<\/pre\s*>/gi, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<[^>]*>/g, '')
        .replace(/&(?:nbsp|#160|#xA0);/gi, '')
        .trim();
    return outsidePre.length === 0;
}

/** Applies the paste rules to editor content, both on paste and from the plugin's commands. */
export class PasteService {
    private readonly getSettings: () => BetterPasteSettings;
    private readonly images: ImageService;
    private readonly titles: LinkTitleService;
    /** Set on unload, so awaited work that is still in flight stops touching the editor. */
    private disposed = false;
    /** Ranges still awaiting work, kept aligned when another pending paste is rewritten. */
    private readonly pendingRanges = new Set<AsyncPasteRange>();

    constructor(getSettings: () => BetterPasteSettings, images: ImageService, titles: LinkTitleService) {
        this.getSettings = getSettings;
        this.images = images;
        this.titles = titles;
    }

    /** Called from the plugin's onunload. */
    dispose(): void {
        this.disposed = true;
        this.pendingRanges.clear();
        this.images.dispose();
        this.titles.dispose();
    }

    /**
     * Handles Obsidian's editor-paste event, returning true when this plugin inserted the
     * content itself and the default paste must be suppressed.
     *
     * Plain text is transformed and inserted here. Rich content is left to Obsidian's own
     * HTML-to-Markdown conversion and post-processed afterwards, which keeps the plugin from
     * having to reimplement that conversion.
     */
    handleEditorPaste(event: ClipboardEvent, editor: Editor, info: MarkdownView | MarkdownFileInfo): boolean {
        const settings = this.getSettings();
        if (!settings.interceptPaste) return false;

        // A note or Markdown code can opt out. Explicit commands deliberately ignore this:
        // if the user asks for the rules by name, they get them.
        if (this.shouldLeaveAlone(editor)) return false;

        const clipboard = event.clipboardData;
        if (!clipboard) return false;

        const html = clipboard.getData('text/html');

        if (clipboard.files.length > 0) {
            // Obsidian owns multi-file pastes. This path only handles one bitmap, either to
            // avoid the HTML flavour or apply a note-specific width.
            if (!settings.imagesEnabled || !isSingleImageFile(clipboard.files)) return false;

            // Two reasons to take over a bitmap paste. Safari's "Copy image" puts the bitmap
            // AND an <img> tag on the clipboard, and Obsidian prefers the HTML there, which
            // turns a copied picture into an external link. And when the note asks for a
            // specific image width, only this plugin knows to apply it. Otherwise Obsidian's
            // own handler already stores the bitmap correctly and is left to do so.
            const size = this.imageSizeFor(editor);
            if (!htmlHasImages(html) && size === null) return false;

            void this.pasteClipboardImage(clipboard, editor, info, html, size);
            return true;
        }

        if (html && html.trim() && !isPreformattedHtml(html)) {
            this.scheduleRichPostProcess(editor, info);
            return false;
        }

        const plain = clipboard.getData('text/plain');
        if (!plain) return false;

        const result = runTextPipeline(plain, settings);
        const needsImages = this.images.hasWork(result.text);
        const needsTitle = this.titles.hasWork(result.text);
        if (!result.changed && !needsImages && !needsTitle) return false;

        const targetFile = info.file;
        const targetPath = targetFile?.path ?? '';
        const valueBefore = editor.getValue();
        const startOffset = editor.posToOffset(editor.getCursor('from'));
        const selectedLink = needsTitle ? linkFromSelection(editor.getSelection(), plain, result.text) : null;
        const inserted = selectedLink ?? result.text;
        editor.replaceSelection(inserted);
        const range = asyncPasteRange(startOffset, inserted, valueBefore, editor.getValue());

        const summary: PasteSummary = {
            aiTextCleaned: result.aiTextCleaned,
            terminalCleaned: result.terminalCleaned,
            urlsCleaned: result.urlsCleaned,
            imagesDownloaded: 0,
            imagesFailed: 0,
            linkTitlesFetched: 0
        };

        if (needsImages) void this.runImagePass(editor, info, targetFile, targetPath, range, summary);
        else if (needsTitle && selectedLink === null) void this.runTitlePass(editor, info, targetFile, range, summary);
        else this.notify(summary);

        return true;
    }

    /**
     * Saves a clipboard bitmap into the vault and inserts its embed. The range to fill
     * is measured before the first await so the insert lands where the paste was aimed, even
     * though the vault write is asynchronous.
     */
    private async pasteClipboardImage(
        clipboard: DataTransfer,
        editor: Editor,
        info: MarkdownView | MarkdownFileInfo,
        html: string,
        size: string | null
    ): Promise<void> {
        const targetFile = info.file;
        const targetPath = targetFile?.path ?? '';
        const fromOffset = editor.posToOffset(editor.getCursor('from'));
        const toOffset = editor.posToOffset(editor.getCursor('to'));
        // The document is untouched at this point, because the default paste was
        // suppressed. The complete value is kept so an equal-length edit cannot make stale
        // offsets look safe after the vault write finishes.
        const valueBefore = editor.getValue();
        const file = clipboard.files[0];
        const sources = imageSourcesFromHtml(html);

        const summary: PasteSummary = {
            aiTextCleaned: false,
            terminalCleaned: false,
            urlsCleaned: 0,
            imagesDownloaded: 0,
            imagesFailed: 0,
            linkTitlesFetched: 0
        };
        let embed: string | null = null;

        try {
            embed = await this.images.saveClipboardImage(file, sources[0] ?? '', targetPath, size);
            if (embed) summary.imagesDownloaded = 1;
            else summary.imagesFailed = 1;
        } catch (error) {
            summary.imagesFailed = 1;
            logError('Could not save a pasted image', error);
        }

        // Nothing was saved, so fall back to linking the original picture rather than
        // swallowing the paste entirely.
        const source = sources[0] ?? '';
        const text = embed ?? (source ? `![${size ?? ''}](${source})` : '');

        if (!this.canEdit(info, targetFile)) return;

        if (!text) {
            // Nothing to insert and the default paste was already suppressed, so this is
            // the one path where staying quiet would lose the clipboard silently
            this.notify(summary, { insertedNothing: true });
            return;
        }

        if (editor.getValue() === valueBefore) {
            editor.replaceRange(text, editor.offsetToPos(fromOffset), editor.offsetToPos(toOffset));
            editor.setCursor(editor.offsetToPos(fromOffset + text.length));
        } else {
            // The document changed while the image was being written, so the recorded range
            // is stale. Insert at the head without deleting the user's current selection.
            const cursor = editor.getCursor();
            editor.replaceRange(text, cursor, cursor);
        }

        this.notify(summary);
    }

    /** Command handler: pastes the clipboard's plain text through the full rule pipeline. */
    async pasteProcessed(editor: Editor, info: MarkdownView | MarkdownFileInfo): Promise<void> {
        const targetFile = info.file;
        const targetPath = targetFile?.path ?? '';
        const valueAtInvocation = editor.getValue();
        const fromOffset = editor.posToOffset(editor.getCursor('from'));
        const toOffset = editor.posToOffset(editor.getCursor('to'));
        const clipboardText = await this.readClipboardText();
        if (clipboardText === null || !this.canEdit(info, targetFile)) return;

        const result = runTextPipeline(clipboardText, this.getSettings());
        const valueBefore = editor.getValue();
        const needsImages = this.images.hasWork(result.text);
        const needsTitle = this.titles.hasWork(result.text);
        const invocationSelection = valueAtInvocation.slice(fromOffset, toOffset);
        const selectedLink =
            needsTitle && valueBefore === valueAtInvocation ? linkFromSelection(invocationSelection, clipboardText, result.text) : null;
        const inserted = selectedLink ?? result.text;
        const startOffset = this.insertAfterClipboardRead(editor, valueAtInvocation, fromOffset, toOffset, inserted);
        const range = asyncPasteRange(startOffset, inserted, valueBefore, editor.getValue());

        const summary: PasteSummary = {
            aiTextCleaned: result.aiTextCleaned,
            terminalCleaned: result.terminalCleaned,
            urlsCleaned: result.urlsCleaned,
            imagesDownloaded: 0,
            imagesFailed: 0,
            linkTitlesFetched: 0
        };

        if (needsImages) {
            await this.runImagePass(editor, info, targetFile, targetPath, range, summary);
            return;
        }

        if (!needsTitle || selectedLink !== null) {
            this.notify(summary);
            return;
        }

        await this.runTitlePass(editor, info, targetFile, range, summary);
    }

    /** Command handler: pastes the clipboard's plain text with no transforms applied. */
    async pasteRaw(editor: Editor, info: MarkdownView | MarkdownFileInfo): Promise<void> {
        const targetFile = info.file;
        const valueAtInvocation = editor.getValue();
        const fromOffset = editor.posToOffset(editor.getCursor('from'));
        const toOffset = editor.posToOffset(editor.getCursor('to'));
        const clipboardText = await this.readClipboardText();
        if (clipboardText === null || !this.canEdit(info, targetFile)) return;
        this.insertAfterClipboardRead(editor, valueAtInvocation, fromOffset, toOffset, clipboardText);
    }

    /** Command handler: applies the text rules to the current selection. */
    cleanSelection(editor: Editor): void {
        const selection = editor.getSelection();
        if (!selection) {
            new Notice('Better Paste: select some text first');
            return;
        }

        const result = runTextPipeline(selection, this.getSettings());
        if (!result.changed) {
            new Notice('Better Paste: nothing to clean up');
            return;
        }

        editor.replaceSelection(result.text);
        this.notify({
            aiTextCleaned: result.aiTextCleaned,
            terminalCleaned: result.terminalCleaned,
            urlsCleaned: result.urlsCleaned,
            imagesDownloaded: 0,
            imagesFailed: 0,
            linkTitlesFetched: 0
        });
    }

    /**
     * Measures the range Obsidian inserted for a rich paste, then cleans URLs and pulls
     * remote images into the vault. Runs after the native handler so the measurement sees
     * the converted Markdown.
     */
    private scheduleRichPostProcess(editor: Editor, info: MarkdownView | MarkdownFileInfo): void {
        const settings = this.getSettings();
        if (!settings.aiTextEnabled && !settings.urlEnabled && !settings.imagesEnabled) return;

        const targetFile = info.file;
        const targetPath = targetFile?.path ?? '';
        const startOffset = editor.posToOffset(editor.getCursor('from'));
        const valueBefore = editor.getValue();
        const lengthBefore = valueBefore.length;
        const selectionLength = editor.getSelection().length;

        window.setTimeout(() => {
            const valueAfter = editor.getValue();
            const insertedLength = valueAfter.length - (lengthBefore - selectionLength);
            if (insertedLength <= 0 || !this.canEdit(info, targetFile)) return;

            const inserted = valueAfter.slice(startOffset, startOffset + insertedLength);
            const range = asyncPasteRange(startOffset, inserted, valueBefore, valueAfter);
            void this.processRichRange(editor, info, targetFile, targetPath, range);
        }, 0);
    }

    /** Cleans URLs and downloads images inside a freshly pasted rich-content range. */
    private async processRichRange(
        editor: Editor,
        info: MarkdownView | MarkdownFileInfo,
        targetFile: TFile | null,
        targetPath: string,
        range: AsyncPasteRange
    ): Promise<void> {
        this.pendingRanges.add(range);
        const settings = this.getSettings();
        const summary: PasteSummary = {
            aiTextCleaned: false,
            terminalCleaned: false,
            urlsCleaned: 0,
            imagesDownloaded: 0,
            imagesFailed: 0,
            linkTitlesFetched: 0
        };

        let text = range.inserted;

        // Content copied out of a browser arrives as HTML, which is how most people paste
        // an assistant's answer. Without this the character rule would never see it.
        if (settings.aiTextEnabled) {
            const cleaned = cleanAiText(text, settings);
            summary.aiTextCleaned = cleaned.changed;
            text = cleaned.text;
        }

        if (settings.urlEnabled) {
            // Same protection as the plain-text pipeline: an image about to be fetched
            // keeps its query, since a signed link needs it
            const protect = settings.imagesEnabled ? imageReferenceRanges(text, settings) : [];
            const cleaned = cleanUrlsInText(text, buildUrlCleanupOptions(settings), protect);
            text = cleaned.text;
            summary.urlsCleaned = cleaned.count;
        }

        if (this.images.hasWork(text)) {
            try {
                const result = await this.images.materializeImages(text, targetPath, this.imageSizeFor(editor));
                text = result.text;
                summary.imagesDownloaded = result.downloaded;
                summary.imagesFailed = result.failed;
            } catch (error) {
                logError('Image download failed', error);
            }
        }

        try {
            if (!this.canEdit(info, targetFile)) return;
            if (text !== range.inserted && !this.replaceRange(editor, range, text)) summary.imagesDownloaded = 0;
            this.notify(summary);
        } finally {
            this.pendingRanges.delete(range);
        }
    }

    /** Downloads images inside an already-inserted range and swaps in the vault embeds. */
    private async runImagePass(
        editor: Editor,
        info: MarkdownView | MarkdownFileInfo,
        targetFile: TFile | null,
        targetPath: string,
        range: AsyncPasteRange,
        summary: PasteSummary
    ): Promise<void> {
        this.pendingRanges.add(range);
        try {
            try {
                const result = await this.images.materializeImages(range.inserted, targetPath, this.imageSizeFor(editor));
                if (!this.canEdit(info, targetFile)) return;
                summary.imagesDownloaded = result.downloaded;
                summary.imagesFailed = result.failed;
                if (result.text !== range.inserted && !this.replaceRange(editor, range, result.text)) summary.imagesDownloaded = 0;
            } catch (error) {
                logError('Image download failed', error);
            }

            if (!this.canEdit(info, targetFile)) return;
            this.notify(summary);
        } finally {
            this.pendingRanges.delete(range);
        }
    }

    /** Fetches the title for one already-inserted web address and turns it into a Markdown link. */
    private async runTitlePass(
        editor: Editor,
        info: MarkdownView | MarkdownFileInfo,
        targetFile: TFile | null,
        range: AsyncPasteRange,
        summary: PasteSummary
    ): Promise<void> {
        this.pendingRanges.add(range);
        try {
            const link = await this.titles.materializeTitle(range.inserted);
            if (!this.canEdit(info, targetFile)) return;

            if (link !== null && this.replaceRange(editor, range, link)) summary.linkTitlesFetched = 1;
            this.notify(summary);
        } finally {
            this.pendingRanges.delete(range);
        }
    }

    /**
     * Replaces inserted text after awaited work. The recorded offset is used while everything
     * before it is unchanged. Otherwise nearby context distinguishes it from older copies.
     */
    private replaceRange(editor: Editor, range: AsyncPasteRange, next: string): boolean {
        const value = editor.getValue();
        const { startOffset, inserted, beforeContext, afterContext } = range;

        const originalPrefix = range.valueAfter.slice(0, startOffset);
        let offset = value.startsWith(originalPrefix) && value.startsWith(inserted, startOffset) ? startOffset : -1;
        if (offset < 0) {
            const searchFrom = Math.max(0, startOffset - REALIGN_WINDOW);
            const searchTo = Math.min(value.length, startOffset + REALIGN_WINDOW);
            const candidates: number[] = [];

            for (let candidate = value.indexOf(inserted, searchFrom); candidate >= 0 && candidate <= searchTo;) {
                candidates.push(candidate);
                candidate = value.indexOf(inserted, candidate + inserted.length);
            }

            const contextual = candidates.filter(candidate => {
                const beforeMatches =
                    beforeContext.length > 0 && value.slice(Math.max(0, candidate - beforeContext.length), candidate) === beforeContext;
                const afterMatches =
                    afterContext.length > 0 &&
                    value.slice(candidate + inserted.length, candidate + inserted.length + afterContext.length) === afterContext;
                return beforeMatches || afterMatches;
            });
            const safe = range.valueBefore.includes(inserted) ? contextual : candidates;
            if (safe.length === 1) offset = safe[0];
        }
        if (offset < 0) return false;

        const cursorOffset = editor.posToOffset(editor.getCursor());
        const cursorWasInRange = cursorOffset >= offset && cursorOffset <= offset + inserted.length;

        editor.replaceRange(next, editor.offsetToPos(offset), editor.offsetToPos(offset + inserted.length));
        this.realignPendingRanges(range, offset, inserted, next);

        if (cursorWasInRange) editor.setCursor(editor.offsetToPos(offset + next.length));
        return true;
    }

    /** Applies a completed rewrite to the snapshots held by other pending paste operations. */
    private realignPendingRanges(completed: AsyncPasteRange, offset: number, previous: string, next: string): void {
        const delta = next.length - previous.length;

        for (const range of this.pendingRanges) {
            if (range === completed || range.valueAfter.slice(offset, offset + previous.length) !== previous) continue;

            range.valueAfter = range.valueAfter.slice(0, offset) + next + range.valueAfter.slice(offset + previous.length);
            if (offset + previous.length <= range.startOffset) range.startOffset += delta;
            range.beforeContext = range.valueAfter.slice(Math.max(0, range.startOffset - RANGE_CONTEXT), range.startOffset);
            range.afterContext = range.valueAfter.slice(
                range.startOffset + range.inserted.length,
                range.startOffset + range.inserted.length + RANGE_CONTEXT
            );
        }
    }

    /** Inserts command text at the invocation range unless the note changed during clipboard access. */
    private insertAfterClipboardRead(
        editor: Editor,
        valueAtInvocation: string,
        fromOffset: number,
        toOffset: number,
        text: string
    ): number {
        if (editor.getValue() === valueAtInvocation) {
            editor.replaceRange(text, editor.offsetToPos(fromOffset), editor.offsetToPos(toOffset));
            editor.setCursor(editor.offsetToPos(fromOffset + text.length));
            return fromOffset;
        }

        // Clipboard permission can leave the command waiting while the user edits. Insert at
        // the current head without deleting a selection made after the command was invoked.
        const cursor = editor.getCursor();
        const offset = editor.posToOffset(cursor);
        editor.replaceRange(text, cursor, cursor);
        return offset;
    }

    /** Reads plain text from the system clipboard, reporting failures as a notice. */
    private async readClipboardText(): Promise<string | null> {
        try {
            const text = await navigator.clipboard.readText();
            return text.length > 0 ? text : null;
        } catch (error) {
            logError('Could not read the clipboard', error);
            new Notice('Better Paste: could not read the clipboard');
            return null;
        }
    }

    /**
     * Reads the image width the current note asks for, or null when it asks for none.
     *
     * Parsed from the editor's own text rather than the metadata cache, so a property the
     * user just typed takes effect on the very next paste.
     */
    private imageSizeFor(editor: Editor): string | null {
        const property = this.getSettings().imageSizeProperty;
        if (!property.trim()) return null;
        return resolveImageSize(this.frontmatterOf(editor.getValue()), property);
    }

    /**
     * True when an automatic paste must be left completely alone: the note carries the
     * disable property, or the cursor sits inside a code fence or the frontmatter block.
     * Pasting terminal output into a fence is an act of preservation, so rejoining its
     * lines there would destroy the thing the user was protecting.
     */
    private shouldLeaveAlone(editor: Editor): boolean {
        // One read of the document serves both checks; this runs on every paste
        const content = editor.getValue();
        if (isPasteDisabledForNote(this.frontmatterOf(content), DISABLE_PROPERTY)) return true;

        return isInsideVerbatimContext(content, editor.posToOffset(editor.getCursor('from')));
    }

    /** Parses the note's frontmatter from the editor buffer, or null when there is none. */
    private frontmatterOf(content: string): unknown {
        const block = extractFrontmatterBlock(content);
        if (block === null) return null;

        try {
            return parseYaml(block);
        } catch {
            // Frontmatter that is mid-edit will not parse, which is not worth reporting
            return null;
        }
    }

    /** True when an awaited operation still belongs to the same open note. */
    private canEdit(info: MarkdownView | MarkdownFileInfo, targetFile: TFile | null): boolean {
        return !this.disposed && info.file === targetFile;
    }

    /** Shows a one-line summary of what the paste changed, when notices are enabled. */
    private notify(summary: PasteSummary, options: { insertedNothing?: boolean } = {}): void {
        // A failure is reported whether or not the user asked for notices: it is the one
        // case where silence would leave them with a note they think is complete.
        if (summary.imagesFailed > 0) {
            const count = summary.imagesFailed;
            const what = `${count} image${count === 1 ? '' : 's'} could not be saved`;
            // A screenshot has no link to fall back to, so say what actually happened
            new Notice(
                options.insertedNothing
                    ? `Better Paste: ${what}, so nothing was pasted. The clipboard still has it.`
                    : `Better Paste: ${what}, the original link was kept`
            );
        }

        if (!this.getSettings().showNotices) return;

        const parts: string[] = [];
        if (summary.aiTextCleaned) parts.push('tidied AI text');
        if (summary.terminalCleaned) parts.push('cleaned up terminal text');
        if (summary.urlsCleaned > 0) parts.push(`cleaned ${summary.urlsCleaned} URL${summary.urlsCleaned === 1 ? '' : 's'}`);
        if (summary.imagesDownloaded > 0) {
            parts.push(`saved ${summary.imagesDownloaded} image${summary.imagesDownloaded === 1 ? '' : 's'}`);
        }
        if (summary.linkTitlesFetched > 0) parts.push('fetched a link title');
        if (parts.length === 0) return;
        new Notice(`Better Paste: ${parts.join(', ')}`);
    }
}
