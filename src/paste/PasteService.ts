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
import { frontmatterRanges, normalizeInvisibleCharacters, straightenDashes, straightenQuotes } from '../transforms/typography';
import { applyCommaPlacement } from '../transforms/textProcessing';
import type { TextCommaPlacement } from '../transforms/textProcessing';
import { cleanTerminalText } from '../transforms/terminalText';
import { rebaseListPaste } from '../transforms/listPaste';
import { applyTextSnippets } from '../transforms/snippets';
import { cleanPdfText } from '../transforms/pdfText';
import type { PdfCleanupOptions } from '../transforms/pdfText';
import { buildUrlCleanupOptions, cleanUrlsInText, httpUrlRanges } from '../transforms/urlCleanup';
import { htmlHasImages, imageReferenceRanges, imageSourcesFromHtml } from './imageReferences';
import { parseCommaList } from '../settings/normalize';
import type { ImageEmbedChoice } from '../modals/ImageEmbedModal';
import {
    extractFrontmatterBlock,
    isInsideFrontmatterBlock,
    isInsideVerbatimContext,
    notePasteOverride,
    resolveImageSize,
    resolveNameProperty
} from './noteOptions';
import { format, plural, strings } from '../i18n';
import { baseNameFromPath, buildFileNameTokens, expandFileNameTemplate, resolveExtension } from '../utils/filenames';
import type { FileNameTokens } from '../utils/filenames';
import { IMAGE_EXTENSIONS } from '../settings/constants';
import { MAX_IMAGE_BYTES } from './ImageService';
import type { ImageNamingContext, ImageService } from './ImageService';
import { escapeLinkDestination, escapeLinkTitle, isObviousImageUrl, standaloneWebUrl } from './LinkTitleService';
import type { LinkTitleService } from './LinkTitleService';
import { logError } from '../utils/logger';
import { showNotice } from '../utils/notices';
import type { BetterPasteSettings, TextSnippet } from '../settings/types';

/** How far before the recorded offset to look when re-finding text the user may have shifted. */
const REALIGN_WINDOW = 512;

/** Surrounding text kept to distinguish a pasted occurrence from an older identical one. */
const RANGE_CONTEXT = 64;

/** Delay before the title-fetch notice appears, so a quick fetch never flashes it. */
const TITLE_PROGRESS_DELAY_MS = 500;

/** Editor state that identifies one inserted range while network or vault work is pending. */
interface AsyncPasteRange {
    startOffset: number;
    inserted: string;
    valueBefore: string;
    valueAfter: string;
    beforeContext: string;
    afterContext: string;
}

/** One title-fetch notice and its pending show timer. The notice is null until the show delay passes. */
interface TitleProgressNotice {
    notice: Notice | null;
    timer: number;
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

/**
 * True when [start, end) sits in an empty frontmatter value slot: on a line inside the
 * block, after "key: " or a "- " sequence item, with nothing but whitespace behind it.
 * Checked when the paste is claimed and again before the downloaded link is written,
 * because a value typed beside the address during the download changes what the slot
 * holds, and rewriting only the address would corrupt the YAML around it.
 */
function isFrontmatterValueSlot(content: string, start: number, end: number): boolean {
    if (!isInsideFrontmatterBlock(content, start) || !isInsideFrontmatterBlock(content, end)) return false;

    const lineStart = content.lastIndexOf('\n', start - 1) + 1;
    const newlineIndex = content.indexOf('\n', start);
    const lineEnd = newlineIndex < 0 ? content.length : newlineIndex;
    if (end > lineEnd || content.slice(end, lineEnd).trim() !== '') return false;
    return /^[ \t]*(?:-|[^#].*?:)[ \t]+$/.test(content.slice(lineStart, start));
}

/** Builds a link from selected text, unless the selection is the pasted address itself. */
function linkFromSelection(selection: string, clipboardText: string, url: string): string | null {
    if (!selection.trim() || selection === clipboardText || selection === url) return null;
    return `[${escapeLinkTitle(selection)}](${escapeLinkDestination(url)})`;
}

/** True when the clipboard carries exactly one image file. */
export function isSingleImageFile(files: FileList | readonly File[]): boolean {
    const list = Array.from(files);
    if (list.length !== 1) return false;
    if (list[0].type.toLowerCase().startsWith('image/')) return true;
    // A file copied from a file manager can carry a blank or generic type while keeping
    // its image extension, so the name answers when the type says nothing
    return resolveExtension(list[0].type, list[0].name || '', IMAGE_EXTENSIONS) !== null;
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

/** Asks the user which size and class this paste's embeds should get. */
export type ImageOptionsPrompt = (sizes: readonly string[] | null, classes: readonly string[] | null) => Promise<ImageEmbedChoice | null>;

/** Shows the PDF cleanup dialog for the selection and resolves with the picks, or null on cancel. */
export type PdfOptionsPrompt = (text: string) => Promise<PdfCleanupOptions | null>;

/** A stored embed choice is honoured only while its value is still one of the options. */
function embedChoice(choice: string, options: readonly string[]): string {
    if (choice === 'ask') return options.length > 0 ? 'ask' : '';
    return options.includes(choice) ? choice : '';
}

/** Applies the paste rules to editor content, both on paste and from the plugin's commands. */
export class PasteService {
    private readonly getSettings: () => BetterPasteSettings;
    private readonly images: ImageService;
    private readonly titles: LinkTitleService;
    private readonly promptImageOptions: ImageOptionsPrompt;
    private readonly promptPdfOptions: PdfOptionsPrompt;
    /** Set on unload, so awaited work that is still in flight stops touching the editor. */
    private disposed = false;
    /** Ranges still awaiting work, kept aligned when another pending paste is rewritten. */
    private readonly pendingRanges = new Set<AsyncPasteRange>();
    /** Title progress notices still visible, kept so unload can dismiss them immediately. */
    private readonly titleProgressNotices = new Set<TitleProgressNotice>();

    constructor(
        getSettings: () => BetterPasteSettings,
        images: ImageService,
        titles: LinkTitleService,
        promptImageOptions: ImageOptionsPrompt = () => Promise.resolve(null),
        promptPdfOptions: PdfOptionsPrompt = () => Promise.resolve(null)
    ) {
        this.getSettings = getSettings;
        this.images = images;
        this.titles = titles;
        this.promptImageOptions = promptImageOptions;
        this.promptPdfOptions = promptPdfOptions;
    }

    /** Called from the plugin's onunload. */
    dispose(): void {
        this.disposed = true;
        this.pendingRanges.clear();
        for (const progress of this.titleProgressNotices) this.hideTitleProgress(progress);
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

        // Async work tracks one inserted range. Leave multi-selection pastes to Obsidian so
        // every cursor receives the native paste instead of only one range being rewritten.
        if (editor.listSelections().length !== 1) return false;

        // A note can opt out, or opt in while automatic cleanup is off. Explicit commands
        // deliberately ignore this: if the user asks for the rules by name, they get them.
        const content = editor.getValue();
        if (!this.automaticPasteEnabled(content, settings)) return false;

        const clipboard = event.clipboardData;
        if (!clipboard) return false;

        // Markdown code and frontmatter are left verbatim. Pasting terminal output into a
        // fence is an act of preservation, so rejoining its lines there would destroy the
        // thing the user was protecting. The one exception is an image address pasted into
        // an empty frontmatter value, which is saved like a body paste.
        if (isInsideVerbatimContext(content, editor.posToOffset(editor.getCursor('from')))) {
            return this.claimFrontmatterImagePaste(clipboard, editor, info, content);
        }

        const html = clipboard.getData('text/html');

        if (clipboard.files.length > 0) {
            // Obsidian owns multi-file pastes. This path only handles one bitmap.
            if (!isSingleImageFile(clipboard.files)) return false;

            // Two clipboard shapes reach this branch. Safari's "Copy image" puts the bitmap
            // AND an <img> tag on the clipboard, and Obsidian prefers the HTML there, which
            // turns a copied picture into an external link; that is a web image, so the
            // saving toggle governs it. A bare nameless bitmap, such as a screenshot, is
            // local content and is always taken over, to run it through the file name
            // format and any size or class; it gets the same name Obsidian would give it,
            // so a default setup pastes identically to the app.
            const file = clipboard.files[0];
            if (htmlHasImages(html)) {
                if (!settings.imageEnabled) return false;
            } else {
                // A bitmap the save would reject stays with Obsidian: taking it over
                // suppresses the native paste, and without an HTML flavour there is no
                // URL to fall back on, so the failed save would swallow the screenshot
                if (resolveExtension(file.type, file.name || '', IMAGE_EXTENSIONS) === null || file.size > MAX_IMAGE_BYTES) return false;
                // A file with a real name of its own was copied from a file manager, and
                // Obsidian's handler resolves its path, linking an image that is already
                // in the vault instead of duplicating it. It is only claimed when a size
                // or class has to be applied, which is what this plugin always did.
                const ownName = baseNameFromPath(file.name || '');
                if (ownName !== null && ownName.toLowerCase() !== 'image' && !this.decoratesEmbeds(editor)) return false;
                if (!this.namesClipboardImage(file, editor, info, settings)) return false;
            }

            void this.pasteClipboardImage(clipboard, editor, info, html);
            return true;
        }

        if (html && html.trim() && !isPreformattedHtml(html)) {
            this.scheduleRichPostProcess(editor, info);
            return false;
        }

        const plain = clipboard.getData('text/plain');
        if (!plain) return false;

        const result = runTextPipeline(plain, settings);
        const valueBefore = editor.getValue();
        const startOffset = editor.posToOffset(editor.getCursor('from'));
        const endOffset = editor.posToOffset(editor.getCursor('to'));
        const rebased = settings.listNesting ? rebaseListPaste(result.text, valueBefore, startOffset, endOffset) : null;
        const needsImages = this.images.hasWork(result.text);
        const needsTitle = this.titles.hasWork(result.text);
        // A rebase takes the paste over on its own, even when the text rules changed nothing
        if (rebased === null && !result.changed && !needsImages && !needsTitle) return false;

        const targetFile = info.file;
        const selectedLink = needsTitle ? linkFromSelection(editor.getSelection(), plain, result.text) : null;
        const inserted = selectedLink ?? rebased ?? result.text;
        editor.replaceSelection(inserted);
        // An earlier paste may still be downloading; its snapshots must learn about this
        // insert, otherwise its rewrite is abandoned as stale when it completes
        this.realignPendingRanges(null, startOffset, valueBefore.slice(startOffset, endOffset), inserted);
        const range = asyncPasteRange(startOffset, inserted, valueBefore, editor.getValue());

        if (needsImages) void this.runImagePass(editor, info, targetFile, () => targetFile?.path ?? '', range);
        else if (needsTitle && selectedLink === null) void this.runTitlePass(editor, info, targetFile, range);

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
        html: string
    ): Promise<void> {
        const targetFile = info.file;
        const fromOffset = editor.posToOffset(editor.getCursor('from'));
        const toOffset = editor.posToOffset(editor.getCursor('to'));
        // The document is untouched at this point, because the default paste was
        // suppressed. The complete value is kept so an equal-length edit cannot make stale
        // offsets look safe after the vault write finishes.
        const valueBefore = editor.getValue();
        const file = clipboard.files[0];
        const sources = imageSourcesFromHtml(html);
        const naming = this.imageNaming(editor);

        const { size, cssClass } = await this.resolveEmbedOptions(editor);
        let stored: { embed: string; file: TFile } | null = null;

        try {
            stored = await this.images.saveClipboardImage(file, sources[0] ?? '', () => targetFile?.path ?? '', size, cssClass, naming);
        } catch (error) {
            logError('Could not save a pasted image', error);
        }
        const embed = stored?.embed ?? null;

        // Nothing was saved, so fall back to linking the original picture rather than
        // swallowing the paste entirely.
        const source = sources[0] ?? '';
        const text = embed ?? (source ? `![${size ?? ''}](${source})` : '');

        if (!this.canEdit(info, targetFile)) {
            // The view moved on, so the embed has no note to land in and the saved
            // file would survive as an unreferenced attachment
            if (stored) void this.images.discardFiles([stored.file]);
            return;
        }

        if (!text) {
            // Nothing to insert and the default paste was already suppressed, so this is
            // the one path where staying quiet would lose the clipboard silently
            this.reportImageFailures(1, { insertedNothing: true });
            return;
        }

        if (editor.getValue() === valueBefore) {
            editor.replaceRange(text, editor.offsetToPos(fromOffset), editor.offsetToPos(toOffset));
            editor.setCursor(editor.offsetToPos(fromOffset + text.length));
            this.realignPendingRanges(null, fromOffset, valueBefore.slice(fromOffset, toOffset), text);
        } else {
            // The document changed while the image was being written, so the recorded
            // offsets are stale. When the paste spot with its surroundings still exists
            // exactly once, the embed goes there, so typing elsewhere in the note does
            // not pull the image away from where it was pasted. Otherwise it follows
            // the cursor, which is where the user is typing.
            const value = editor.getValue();
            const selection = valueBefore.slice(fromOffset, toOffset);
            const needle =
                valueBefore.slice(Math.max(0, fromOffset - RANGE_CONTEXT), fromOffset) +
                selection +
                valueBefore.slice(toOffset, toOffset + RANGE_CONTEXT);
            const first = needle.length > 0 ? value.indexOf(needle) : -1;
            const unique = first >= 0 && value.indexOf(needle, first + 1) < 0;

            if (unique) {
                const start = first + Math.min(fromOffset, RANGE_CONTEXT);
                editor.replaceRange(text, editor.offsetToPos(start), editor.offsetToPos(start + selection.length));
                this.realignPendingRanges(null, start, selection, text);
            } else {
                const cursor = editor.getCursor();
                const offset = editor.posToOffset(cursor);
                editor.replaceRange(text, cursor, cursor);
                this.realignPendingRanges(null, offset, '', text);
            }
        }

        if (embed === null) this.reportImageFailures(1);
    }

    /** Command handler: pastes the clipboard's plain text through the full rule pipeline. */
    async pasteProcessed(editor: Editor, info: MarkdownView | MarkdownFileInfo): Promise<void> {
        const targetFile = info.file;
        const valueAtInvocation = editor.getValue();
        const fromOffset = editor.posToOffset(editor.getCursor('from'));
        const toOffset = editor.posToOffset(editor.getCursor('to'));
        const clipboardText = await this.readClipboardText();
        if (clipboardText === null || !this.canEdit(info, targetFile)) return;

        const settings = this.getSettings();
        const result = runTextPipeline(clipboardText, settings);
        const valueBefore = editor.getValue();
        // The rebase needs the destination as it was aimed at, so an edit made while the
        // clipboard was being read leaves the paste unrebased rather than misindented
        const rebased =
            settings.listNesting && valueBefore === valueAtInvocation
                ? rebaseListPaste(result.text, valueAtInvocation, fromOffset, toOffset)
                : null;
        const needsImages = this.images.hasWork(result.text);
        const needsTitle = this.titles.hasWork(result.text);
        const invocationSelection = valueAtInvocation.slice(fromOffset, toOffset);
        const selectedLink =
            needsTitle && valueBefore === valueAtInvocation ? linkFromSelection(invocationSelection, clipboardText, result.text) : null;
        const inserted = selectedLink ?? rebased ?? result.text;
        const startOffset = this.insertAfterClipboardRead(editor, valueAtInvocation, fromOffset, toOffset, inserted);
        const range = asyncPasteRange(startOffset, inserted, valueBefore, editor.getValue());

        if (needsImages) {
            await this.runImagePass(editor, info, targetFile, () => targetFile?.path ?? '', range);
            return;
        }

        if (needsTitle && selectedLink === null) await this.runTitlePass(editor, info, targetFile, range);
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
        this.applyToSelection(editor, selection => runTextPipeline(selection, this.getSettings()));
    }

    /** Command handler: applies one stored snippet to the current selection. */
    runSnippet(editor: Editor, snippet: TextSnippet): void {
        const selection = editor.getSelection();
        // A single selection only: getSelection reads one text, but replaceSelection
        // would write that text into every cursor's range
        if (!selection || editor.listSelections().length > 1) {
            new Notice(format(strings.notices.prefix, { message: strings.notices.selectTextFirst }));
            return;
        }

        this.applyToSelection(editor, selection => applyTextSnippets(selection, [{ ...snippet, enabled: true }]));
    }

    /**
     * Command handler: cleans terminal output in the current selection. Runs on demand
     * rather than on every paste, because rejoining and dedenting are guesses that only
     * the user can confirm fit what was copied.
     */
    cleanTerminalSelection(editor: Editor): void {
        this.applyToSelection(editor, selection =>
            cleanTerminalText(selection, { terminalRejoin: 'indented', terminalBullets: 'markdown' })
        );
    }

    /**
     * Command handler: cleans PDF text in the current selection, behind a dialog that
     * previews the result and offers the situational cleanups. A dialog rather than
     * settings, because a page number cannot be told from content
     * without seeing the text.
     */
    async cleanPdfSelection(editor: Editor): Promise<void> {
        const selection = editor.getSelection();
        // A single selection only: the dialog previews one text, but replaceSelection
        // would write that text into every cursor's range
        if (!selection || editor.listSelections().length > 1) {
            new Notice(format(strings.notices.prefix, { message: strings.notices.selectTextFirst }));
            return;
        }

        const options = await this.promptPdfOptions(selection);
        if (options === null || this.disposed) return;
        // The dialog blocks typing, but sync or a popout can still rewrite the note
        // while it is open, and replacing a changed selection would destroy that edit.
        // The notice tells the user to reselect and run the command again.
        if (editor.getSelection() !== selection) {
            new Notice(format(strings.notices.prefix, { message: strings.notices.selectTextFirst }));
            return;
        }

        const result = cleanPdfText(selection, options);
        if (!result.changed) {
            new Notice(format(strings.notices.prefix, { message: strings.notices.nothingToClean }));
            return;
        }

        editor.replaceSelection(result.text);
    }

    /** Command handler: places commas next to closing quotes in the current selection. */
    placeCommas(editor: Editor, placement: TextCommaPlacement): void {
        this.applyToSelection(editor, selection => applyCommaPlacement(selection, placement));
    }

    /** Replaces the selection with a transform's output, with the shared notices. */
    private applyToSelection(editor: Editor, transform: (selection: string) => { text: string; changed: boolean }): void {
        const selection = editor.getSelection();
        if (!selection) {
            new Notice(format(strings.notices.prefix, { message: strings.notices.selectTextFirst }));
            return;
        }

        const result = transform(selection);
        if (!result.changed) {
            new Notice(format(strings.notices.prefix, { message: strings.notices.nothingToClean }));
            return;
        }

        editor.replaceSelection(result.text);
    }

    /**
     * Measures the range Obsidian inserted for a rich paste, then cleans URLs and pulls
     * remote images into the vault. Runs after the native handler so the measurement sees
     * the converted Markdown.
     */
    private scheduleRichPostProcess(editor: Editor, info: MarkdownView | MarkdownFileInfo): void {
        const settings = this.getSettings();
        if (
            !settings.textInvisible &&
            !settings.textQuotes &&
            !settings.textDashes &&
            !settings.linkEnabled &&
            !settings.imageEnabled &&
            !settings.textSnippets.some(snippet => snippet.enabled)
        )
            return;

        const targetFile = info.file;
        const startOffset = editor.posToOffset(editor.getCursor('from'));
        const valueBefore = editor.getValue();
        const lengthBefore = valueBefore.length;
        const selectionLength = editor.getSelection().length;
        const prefixBefore = valueBefore.slice(0, startOffset);
        const suffixBefore = valueBefore.slice(startOffset + selectionLength);

        window.setTimeout(() => {
            const valueAfter = editor.getValue();
            // A pending rewrite finishing inside this window would skew the length
            // arithmetic below, so the paste is only measured against a document that
            // changed nowhere except the replaced selection
            if (!valueAfter.startsWith(prefixBefore) || !valueAfter.endsWith(suffixBefore)) return;
            const insertedLength = valueAfter.length - (lengthBefore - selectionLength);
            if (insertedLength <= 0 || !this.canEdit(info, targetFile)) return;

            const inserted = valueAfter.slice(startOffset, startOffset + insertedLength);
            const range = asyncPasteRange(startOffset, inserted, valueBefore, valueAfter);
            void this.processRichRange(editor, info, targetFile, () => targetFile?.path ?? '', range);
        }, 0);
    }

    /** Cleans URLs and downloads images inside a freshly pasted rich-content range. */
    private async processRichRange(
        editor: Editor,
        info: MarkdownView | MarkdownFileInfo,
        targetFile: TFile | null,
        targetPath: () => string,
        range: AsyncPasteRange
    ): Promise<void> {
        this.pendingRanges.add(range);
        const settings = this.getSettings();
        let imagesFailed = 0;
        let text = range.inserted;

        // Content copied out of a browser arrives as HTML, which is how most people paste
        // an assistant's answer. Without this the character rules would never see it.
        if (settings.textInvisible) text = normalizeInvisibleCharacters(text, httpUrlRanges(text)).text;
        if (settings.textDashes) text = straightenDashes(text, httpUrlRanges(text)).text;
        if (settings.textQuotes) text = straightenQuotes(text, httpUrlRanges(text)).text;

        if (settings.linkEnabled) {
            // Same protection as the plain-text pipeline: an image reference keeps its
            // query whether or not it is downloaded, since a signed link needs it, and
            // frontmatter URLs are data
            const protect = [...imageReferenceRanges(text), ...frontmatterRanges(text)];
            text = cleanUrlsInText(text, buildUrlCleanupOptions(settings), protect).text;
        }

        text = applyTextSnippets(text, settings.textSnippets).text;

        let downloadedFiles: TFile[] = [];
        if (this.images.hasWork(text)) {
            try {
                const naming = this.imageNaming(editor);
                const embedOptions = await this.resolveEmbedOptions(editor);
                const result = await this.images.materializeImages(text, targetPath, embedOptions.size, embedOptions.cssClass, naming);
                text = result.text;
                imagesFailed = result.failed;
                downloadedFiles = result.files;
            } catch (error) {
                logError('Image download failed', error);
            }
        }

        try {
            if (!this.canEdit(info, targetFile)) {
                void this.images.discardFiles(downloadedFiles);
                return;
            }
            if (text !== range.inserted && !this.replaceRange(editor, range, text)) {
                // The pasted range is gone or was edited, so nothing references the
                // downloads and they must not linger as orphaned attachments
                void this.images.discardFiles(downloadedFiles);
            }
            this.reportImageFailures(imagesFailed);
        } finally {
            this.pendingRanges.delete(range);
        }
    }

    /** Downloads images inside an already-inserted range and swaps in the vault embeds. */
    private async runImagePass(
        editor: Editor,
        info: MarkdownView | MarkdownFileInfo,
        targetFile: TFile | null,
        targetPath: () => string,
        range: AsyncPasteRange
    ): Promise<void> {
        this.pendingRanges.add(range);
        try {
            let failed = 0;
            try {
                const naming = this.imageNaming(editor);
                const embedOptions = await this.resolveEmbedOptions(editor);
                const result = await this.images.materializeImages(
                    range.inserted,
                    targetPath,
                    embedOptions.size,
                    embedOptions.cssClass,
                    naming
                );
                if (!this.canEdit(info, targetFile)) {
                    void this.images.discardFiles(result.files);
                    return;
                }
                failed = result.failed;
                if (result.text !== range.inserted && !this.replaceRange(editor, range, result.text)) {
                    // The pasted range is gone or was edited, so nothing references the
                    // downloads and they must not linger as orphaned attachments
                    void this.images.discardFiles(result.files);
                }
            } catch (error) {
                logError('Image download failed', error);
            }

            if (!this.canEdit(info, targetFile)) return;
            this.reportImageFailures(failed);
        } finally {
            this.pendingRanges.delete(range);
        }
    }

    /** Fetches the title for one already-inserted web address and turns it into a Markdown link. */
    private async runTitlePass(
        editor: Editor,
        info: MarkdownView | MarkdownFileInfo,
        targetFile: TFile | null,
        range: AsyncPasteRange
    ): Promise<void> {
        this.pendingRanges.add(range);
        const progress = this.showTitleProgress();
        try {
            const link = await this.titles.materializeTitle(range.inserted);
            if (!this.canEdit(info, targetFile)) return;

            if (link === null) {
                this.hideTitleProgress(progress);
                showNotice(format(strings.notices.prefix, { message: strings.notices.titleFailed }), { variant: 'warning' });
            } else {
                // The address must still stand alone: a character that would extend a
                // URL on either side means the user reshaped it during the fetch, and
                // linking only the pasted half would tear their address apart
                const extendsUrl = (char: string | undefined): boolean => char !== undefined && !/[\s<>"`\\\u201C\u201D]/.test(char);
                const standalone = (value: string, offset: number): boolean =>
                    !extendsUrl(value[offset - 1]) && !extendsUrl(value[offset + range.inserted.length]);
                this.replaceRange(editor, range, link, standalone);
            }
        } finally {
            this.hideTitleProgress(progress);
            this.pendingRanges.delete(range);
        }
    }

    /**
     * Claims a paste of exactly one image address into an empty frontmatter value, after
     * "key: " or a "- " sequence item with nothing else on the line. Anywhere else in
     * frontmatter the YAML around the paste could break, so the paste stays native.
     * Obsidian Bases reads a cover image from such a property, and a saved copy works
     * offline where the web address does not.
     */
    private claimFrontmatterImagePaste(
        clipboard: DataTransfer,
        editor: Editor,
        info: MarkdownView | MarkdownFileInfo,
        content: string
    ): boolean {
        if (clipboard.files.length > 0) return false;

        const url = standaloneWebUrl(clipboard.getData('text/plain').trim());
        if (url === null || !isObviousImageUrl(url) || !this.images.hasWork(url)) return false;

        const from = editor.posToOffset(editor.getCursor('from'));
        const to = editor.posToOffset(editor.getCursor('to'));
        if (!isFrontmatterValueSlot(content, from, to)) return false;

        const targetFile = info.file;
        editor.replaceSelection(url);
        this.realignPendingRanges(null, from, content.slice(from, to), url);
        void this.runFrontmatterImagePass(editor, info, targetFile, asyncPasteRange(from, url, content, editor.getValue()));
        return true;
    }

    /**
     * Downloads the image address pasted into a frontmatter value and swaps it for a
     * quoted plain wikilink, the shape a property accepts: an embed does not work there,
     * and size and class suffixes would change the link's display text instead. The
     * address is already inserted, so a failed download simply leaves it standing.
     */
    private async runFrontmatterImagePass(
        editor: Editor,
        info: MarkdownView | MarkdownFileInfo,
        targetFile: TFile | null,
        range: AsyncPasteRange
    ): Promise<void> {
        this.pendingRanges.add(range);
        try {
            let files: TFile[] = [];
            try {
                const result = await this.images.materializeImages(
                    range.inserted,
                    () => targetFile?.path ?? '',
                    null,
                    null,
                    this.imageNaming(editor)
                );
                files = result.files;
            } catch (error) {
                logError('Image download failed', error);
            }

            if (!this.canEdit(info, targetFile)) {
                void this.images.discardFiles(files);
                return;
            }
            if (files.length === 0) {
                this.reportImageFailures(1);
                return;
            }

            // The address must still fill its whole value slot, not just stand between
            // its neighbouring characters: text typed anywhere on the line during the
            // download means the slot changed, and rewriting only the address would
            // corrupt the YAML around it
            const slotIntact = (value: string, offset: number): boolean =>
                isFrontmatterValueSlot(value, offset, offset + range.inserted.length);
            const link = this.images.propertyLink(files[0], targetFile?.path ?? '');
            if (!this.replaceRange(editor, range, link, slotIntact)) {
                void this.images.discardFiles(files);
            }
        } finally {
            this.pendingRanges.delete(range);
        }
    }

    /** Shows a spinner notice for title work, delayed so a quick fetch never flashes it. */
    private showTitleProgress(): TitleProgressNotice {
        const progress: TitleProgressNotice = { notice: null, timer: 0 };
        progress.timer = window.setTimeout(() => {
            if (!this.titleProgressNotices.has(progress)) return;
            const message = format(strings.notices.prefix, { message: strings.notices.fetchingTitle });
            progress.notice = showNotice(message, { timeout: 0, variant: 'loading' });
        }, TITLE_PROGRESS_DELAY_MS);

        this.titleProgressNotices.add(progress);
        return progress;
    }

    /** Stops and dismisses a title-fetch progress notice. */
    private hideTitleProgress(progress: TitleProgressNotice): void {
        if (!this.titleProgressNotices.delete(progress)) return;
        window.clearTimeout(progress.timer);
        progress.notice?.hide();
    }

    /**
     * Replaces inserted text after awaited work. The recorded offset is used while everything
     * before it is unchanged. Otherwise nearby context distinguishes it from older copies.
     */
    private replaceRange(
        editor: Editor,
        range: AsyncPasteRange,
        next: string,
        boundary?: (value: string, offset: number) => boolean
    ): boolean {
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

            // Every recorded context must match. Accepting one side alone would let an
            // older duplicate of the pasted text qualify after the paste was undone,
            // and the pending rewrite would then land on content the user never pasted.
            const contextual = candidates.filter(candidate => {
                const beforeMatches =
                    beforeContext.length === 0 || value.slice(Math.max(0, candidate - beforeContext.length), candidate) === beforeContext;
                const afterMatches =
                    afterContext.length === 0 ||
                    value.slice(candidate + inserted.length, candidate + inserted.length + afterContext.length) === afterContext;
                return beforeMatches && afterMatches;
            });
            const safe = range.valueBefore.includes(inserted) ? contextual : candidates;
            if (safe.length === 1) offset = safe[0];
        }
        if (offset < 0) return false;
        if (boundary && !boundary(value, offset)) return false;

        const cursorOffset = editor.posToOffset(editor.getCursor());
        const cursorWasInRange = cursorOffset >= offset && cursorOffset <= offset + inserted.length;

        editor.replaceRange(next, editor.offsetToPos(offset), editor.offsetToPos(offset + inserted.length));
        this.realignPendingRanges(range, offset, inserted, next);

        if (cursorWasInRange) editor.setCursor(editor.offsetToPos(offset + next.length));
        return true;
    }

    /**
     * Applies an edit to the snapshots held by other pending paste operations, both when a
     * pending rewrite completes and when a new paste inserts text while others still wait.
     */
    private realignPendingRanges(completed: AsyncPasteRange | null, offset: number, previous: string, next: string): void {
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
            this.realignPendingRanges(null, fromOffset, valueAtInvocation.slice(fromOffset, toOffset), text);
            return fromOffset;
        }

        // Clipboard permission can leave the command waiting while the user edits. Insert at
        // the current head without deleting a selection made after the command was invoked.
        const cursor = editor.getCursor();
        const offset = editor.posToOffset(cursor);
        editor.replaceRange(text, cursor, cursor);
        this.realignPendingRanges(null, offset, '', text);
        return offset;
    }

    /** Reads plain text from the system clipboard, reporting failures as a notice. */
    private async readClipboardText(): Promise<string | null> {
        try {
            const text = await navigator.clipboard.readText();
            return text.length > 0 ? text : null;
        } catch (error) {
            logError('Could not read the clipboard', error);
            new Notice(format(strings.notices.prefix, { message: strings.notices.clipboardFailed }));
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
     * True when the file name format can produce a name for this bare clipboard image.
     * The template is expanded synchronously here because taking the paste over
     * suppresses the native handler; the caller has already checked the file itself is
     * storable. A value this note cannot supply, such as a missing property, keeps the
     * paste native instead of inventing a name.
     */
    private namesClipboardImage(file: File, editor: Editor, info: MarkdownView | MarkdownFileInfo, settings: BetterPasteSettings): boolean {
        const tokens: FileNameTokens = {
            ...buildFileNameTokens('', file.name || undefined),
            noteName: baseNameFromPath(info.file?.path ?? ''),
            property: this.imageNaming(editor).property
        };
        return expandFileNameTemplate(settings.imageNameTemplate, tokens, new Date()) !== null;
    }

    /** Naming values read when the paste happens, so a slow download cannot see later edits. */
    private imageNaming(editor: Editor): ImageNamingContext {
        const frontmatter = this.frontmatterOf(editor.getValue());
        return { property: (key: string) => resolveNameProperty(frontmatter, key), now: new Date() };
    }

    /** True when the note or the embed settings add a size or class to saved embeds. */
    private decoratesEmbeds(editor: Editor): boolean {
        const settings = this.getSettings();
        if (this.imageSizeFor(editor) !== null) return true;
        if (embedChoice(settings.imageSizeChoice, parseCommaList(settings.imageSizeOptions)) !== '') return true;
        return embedChoice(settings.imageClassChoice, parseCommaList(settings.imageClassOptions)) !== '';
    }

    /**
     * The size and class this paste applies to saved image embeds, opening the dialog once
     * when a choice says to ask. Closing the dialog without applying decorates nothing.
     */
    private async resolveEmbedOptions(editor: Editor): Promise<ImageEmbedChoice> {
        const settings = this.getSettings();
        const noteSize = this.imageSizeFor(editor);
        const sizes = parseCommaList(settings.imageSizeOptions);
        const classes = parseCommaList(settings.imageClassOptions);
        const sizeChoice = embedChoice(settings.imageSizeChoice, sizes);
        const classChoice = embedChoice(settings.imageClassChoice, classes);

        // The note's own width property is the more specific request, so it wins and its
        // half of the dialog is skipped
        let size = noteSize ?? (sizeChoice === 'ask' ? null : sizeChoice || null);
        let cssClass = classChoice === 'ask' ? null : classChoice || null;

        const askSizes = noteSize === null && sizeChoice === 'ask' ? sizes : null;
        const askClasses = classChoice === 'ask' ? classes : null;
        if (askSizes || askClasses) {
            const picked = await this.promptImageOptions(askSizes, askClasses);
            if (picked) {
                if (askSizes) size = picked.size;
                if (askClasses) cssClass = picked.cssClass;
            }
        }

        return { size, cssClass };
    }

    /**
     * True when the settings allow automatic paste handling in this note.
     *
     * The note property overrides the global setting in both directions, so it is read even
     * when automatic cleanup is off: that is exactly when a note asking to be cleaned has
     * something to say. A note that asks for nothing follows the global setting.
     */
    private automaticPasteEnabled(content: string, settings: BetterPasteSettings): boolean {
        const override = notePasteOverride(this.frontmatterOf(content), settings.noteProperty);

        if (override === 'off') return false;
        return override !== null || settings.autoClean;
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

    /** Reports images that could not be saved, because silence would leave a note that looks complete. */
    private reportImageFailures(failed: number, options: { insertedNothing?: boolean } = {}): void {
        if (failed === 0) return;
        const images = plural(strings.notices.imagesFailed, failed);
        // A screenshot has no link to fall back to, so say what actually happened
        const message = format(options.insertedNothing ? strings.notices.imagesFailedNothingPasted : strings.notices.imagesFailedLinkKept, {
            images
        });
        new Notice(format(strings.notices.prefix, { message }));
    }
}
