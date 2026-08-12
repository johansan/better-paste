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
import type { Editor, MarkdownFileInfo, MarkdownView } from 'obsidian';
import { runTextPipeline } from '../transforms';
import { cleanUrlsInText } from '../transforms/urlCleanup';
import { htmlHasImages, imageSourcesFromHtml } from './imageReferences';
import { extractFrontmatterBlock, resolveImageSize } from './imageSize';
import type { ImageService } from './ImageService';
import { logError } from '../utils/logger';
import type { BetterPasteSettings } from '../settings/types';

/** How far before the recorded offset to look when re-finding text the user may have shifted. */
const REALIGN_WINDOW = 512;

/** Summary of everything a single paste changed, used to build the notice. */
interface PasteSummary {
    terminalCleaned: boolean;
    urlsCleaned: number;
    imagesDownloaded: number;
    imagesFailed: number;
}

/** True when the clipboard carries at least one file and every file is an image. */
export function onlyImageFiles(files: FileList | readonly File[]): boolean {
    const list = Array.from(files);
    return list.length > 0 && list.every(file => file.type.toLowerCase().startsWith('image/'));
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
    return /<pre\b/i.test(html);
}

/** Applies the paste rules to editor content, both on paste and from the plugin's commands. */
export class PasteService {
    private readonly getSettings: () => BetterPasteSettings;
    private readonly images: ImageService;

    constructor(getSettings: () => BetterPasteSettings, images: ImageService) {
        this.getSettings = getSettings;
        this.images = images;
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

        const clipboard = event.clipboardData;
        if (!clipboard) return false;

        const html = clipboard.getData('text/html');

        if (clipboard.files.length > 0) {
            // Mixed pastes are left alone so a non-image attachment is never dropped
            if (!settings.imagesEnabled || !onlyImageFiles(clipboard.files)) return false;

            // Two reasons to take over a bitmap paste. Safari's "Copy image" puts the bitmap
            // AND an <img> tag on the clipboard, and Obsidian prefers the HTML there, which
            // turns a copied picture into an external link. And when the note asks for a
            // specific image width, only this plugin knows to apply it. Otherwise Obsidian's
            // own handler already stores the bitmap correctly and is left to do so.
            const size = this.imageSizeFor(editor);
            if (!htmlHasImages(html) && size === null) return false;

            void this.pasteClipboardImages(clipboard, editor, info, html, size);
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
        if (!result.changed && !needsImages) return false;

        const startOffset = editor.posToOffset(editor.getCursor('from'));
        editor.replaceSelection(result.text);

        const summary: PasteSummary = {
            terminalCleaned: result.terminalCleaned,
            urlsCleaned: result.urlsCleaned,
            imagesDownloaded: 0,
            imagesFailed: 0
        };

        if (needsImages) void this.runImagePass(editor, info, startOffset, result.text, summary);
        else this.notify(summary);

        return true;
    }

    /**
     * Saves clipboard bitmaps into the vault and inserts embeds for them. The range to fill
     * is measured before the first await so the insert lands where the paste was aimed, even
     * though the vault write is asynchronous.
     */
    private async pasteClipboardImages(
        clipboard: DataTransfer,
        editor: Editor,
        info: MarkdownView | MarkdownFileInfo,
        html: string,
        size: string | null
    ): Promise<void> {
        const fromOffset = editor.posToOffset(editor.getCursor('from'));
        const toOffset = editor.posToOffset(editor.getCursor('to'));
        const files = Array.from(clipboard.files);
        const sources = imageSourcesFromHtml(html);

        const summary: PasteSummary = { terminalCleaned: false, urlsCleaned: 0, imagesDownloaded: 0, imagesFailed: 0 };
        let embeds: string[] = [];

        try {
            const result = await this.images.saveClipboardImages(files, sources, this.sourcePathOf(info), size);
            embeds = result.embeds;
            summary.imagesDownloaded = result.embeds.length;
            summary.imagesFailed = result.failed;
        } catch (error) {
            logError('Could not save a pasted image', error);
        }

        // Nothing was saved, so fall back to linking the original pictures rather than
        // swallowing the paste entirely.
        const text =
            embeds.length > 0
                ? embeds.join('\n')
                : sources
                      .filter(Boolean)
                      .map(source => `![${size ?? ''}](${source})`)
                      .join('\n');
        if (!text) return;

        editor.replaceRange(text, editor.offsetToPos(fromOffset), editor.offsetToPos(toOffset));
        editor.setCursor(editor.offsetToPos(fromOffset + text.length));

        this.notify(summary);
    }

    /** Command handler: pastes the clipboard's plain text through the full rule pipeline. */
    async pasteProcessed(editor: Editor, info: MarkdownView | MarkdownFileInfo): Promise<void> {
        const clipboardText = await this.readClipboardText();
        if (clipboardText === null) return;

        const result = runTextPipeline(clipboardText, this.getSettings());
        const startOffset = editor.posToOffset(editor.getCursor('from'));
        editor.replaceSelection(result.text);

        const summary: PasteSummary = {
            terminalCleaned: result.terminalCleaned,
            urlsCleaned: result.urlsCleaned,
            imagesDownloaded: 0,
            imagesFailed: 0
        };

        if (!this.images.hasWork(result.text)) {
            this.notify(summary);
            return;
        }

        await this.runImagePass(editor, info, startOffset, result.text, summary);
    }

    /** Command handler: pastes the clipboard's plain text with no transforms applied. */
    async pasteRaw(editor: Editor): Promise<void> {
        const clipboardText = await this.readClipboardText();
        if (clipboardText === null) return;
        editor.replaceSelection(clipboardText);
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
            terminalCleaned: result.terminalCleaned,
            urlsCleaned: result.urlsCleaned,
            imagesDownloaded: 0,
            imagesFailed: 0
        });
    }

    /**
     * Measures the range Obsidian inserted for a rich paste, then cleans URLs and pulls
     * remote images into the vault. Runs after the native handler so the measurement sees
     * the converted Markdown.
     */
    private scheduleRichPostProcess(editor: Editor, info: MarkdownView | MarkdownFileInfo): void {
        const settings = this.getSettings();
        if (!settings.urlEnabled && !settings.imagesEnabled) return;

        const startOffset = editor.posToOffset(editor.getCursor('from'));
        const lengthBefore = editor.getValue().length;
        const selectionLength = editor.getSelection().length;

        window.setTimeout(() => {
            const valueAfter = editor.getValue();
            const insertedLength = valueAfter.length - (lengthBefore - selectionLength);
            if (insertedLength <= 0) return;

            const inserted = valueAfter.slice(startOffset, startOffset + insertedLength);
            void this.processRichRange(editor, info, startOffset, inserted);
        }, 0);
    }

    /** Cleans URLs and downloads images inside a freshly pasted rich-content range. */
    private async processRichRange(
        editor: Editor,
        info: MarkdownView | MarkdownFileInfo,
        startOffset: number,
        inserted: string
    ): Promise<void> {
        const settings = this.getSettings();
        const summary: PasteSummary = { terminalCleaned: false, urlsCleaned: 0, imagesDownloaded: 0, imagesFailed: 0 };

        let text = inserted;

        if (settings.urlEnabled) {
            const cleaned = cleanUrlsInText(text, settings);
            text = cleaned.text;
            summary.urlsCleaned = cleaned.count;
        }

        if (this.images.hasWork(text)) {
            try {
                const result = await this.images.materializeImages(text, this.sourcePathOf(info), this.imageSizeFor(editor));
                text = result.text;
                summary.imagesDownloaded = result.downloaded;
                summary.imagesFailed = result.failed;
            } catch (error) {
                logError('Image download failed', error);
            }
        }

        if (text !== inserted) this.replaceRange(editor, startOffset, inserted, text);
        this.notify(summary);
    }

    /** Downloads images inside an already-inserted range and swaps in the vault embeds. */
    private async runImagePass(
        editor: Editor,
        info: MarkdownView | MarkdownFileInfo,
        startOffset: number,
        inserted: string,
        summary: PasteSummary
    ): Promise<void> {
        try {
            const result = await this.images.materializeImages(inserted, this.sourcePathOf(info), this.imageSizeFor(editor));
            summary.imagesDownloaded = result.downloaded;
            summary.imagesFailed = result.failed;
            if (result.text !== inserted) this.replaceRange(editor, startOffset, inserted, result.text);
        } catch (error) {
            logError('Image download failed', error);
        }

        this.notify(summary);
    }

    /**
     * Replaces `expected` with `next` at `startOffset`. The text is re-located first because
     * downloads are asynchronous and the user may have typed in the meantime; when it can no
     * longer be found the edit is abandoned rather than applied to the wrong place.
     */
    private replaceRange(editor: Editor, startOffset: number, expected: string, next: string): void {
        const value = editor.getValue();

        let offset = value.startsWith(expected, startOffset) ? startOffset : -1;
        if (offset < 0) offset = value.indexOf(expected, Math.max(0, startOffset - REALIGN_WINDOW));
        if (offset < 0) return;

        const cursorOffset = editor.posToOffset(editor.getCursor());
        const cursorWasInRange = cursorOffset >= offset && cursorOffset <= offset + expected.length;

        editor.replaceRange(next, editor.offsetToPos(offset), editor.offsetToPos(offset + expected.length));

        if (cursorWasInRange) editor.setCursor(editor.offsetToPos(offset + next.length));
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

        const block = extractFrontmatterBlock(editor.getValue());
        if (block === null) return null;

        try {
            return resolveImageSize(parseYaml(block), property);
        } catch {
            // Frontmatter that is mid-edit will not parse, which is not worth reporting
            return null;
        }
    }

    /** Path of the note being edited, used to resolve relative attachment locations. */
    private sourcePathOf(info: MarkdownView | MarkdownFileInfo): string {
        return info.file?.path ?? '';
    }

    /** Shows a one-line summary of what the paste changed, when notices are enabled. */
    private notify(summary: PasteSummary): void {
        if (!this.getSettings().showNotices) return;

        const parts: string[] = [];
        if (summary.terminalCleaned) parts.push('cleaned up terminal text');
        if (summary.urlsCleaned > 0) parts.push(`cleaned ${summary.urlsCleaned} URL${summary.urlsCleaned === 1 ? '' : 's'}`);
        if (summary.imagesDownloaded > 0) {
            parts.push(`saved ${summary.imagesDownloaded} image${summary.imagesDownloaded === 1 ? '' : 's'}`);
        }
        if (summary.imagesFailed > 0) {
            parts.push(`${summary.imagesFailed} image${summary.imagesFailed === 1 ? '' : 's'} could not be downloaded`);
        }

        if (parts.length === 0) return;
        new Notice(`Better Paste: ${parts.join(', ')}`);
    }
}
