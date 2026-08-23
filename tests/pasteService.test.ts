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

import { describe, expect, it, vi } from 'vitest';
import { PasteService, isSingleImageFile } from '../src/paste/PasteService';
import type { ImageService } from '../src/paste/ImageService';
import { standaloneWebUrlLines } from '../src/paste/LinkTitleService';
import type { LinkTitleService, StandaloneWebUrlLinesOptions } from '../src/paste/LinkTitleService';
import { findImageReferences, replaceImageReferences } from '../src/paste/imageReferences';
import type { ImageEmbedChoice } from '../src/modals/ImageEmbedModal';
import { DEFAULT_SETTINGS } from '../src/settings/defaults';
import type { BetterPasteSettings, TextSnippet } from '../src/settings/types';
import { FakeEditor, fakeClipboardEvent, fakeFile } from './stubs/editor';
import { Notice } from './stubs/obsidian';
import type { Editor, MarkdownFileInfo, MarkdownView } from 'obsidian';

const INFO = { file: { path: 'Notes/Test.md' } } as unknown as MarkdownView | MarkdownFileInfo;

/** One enabled URL snippet, run on the fetched titled link. */
function urlSnippet(...rules: string[]): TextSnippet {
    return { id: 'url-snippet', name: 'URL snippet', rules, enabled: true };
}

/** Records what the paste handler asked the image service to save. */
interface SavedClipboardImages {
    file: File;
    source: string;
    sourcePath: string;
    size: string | null;
    cssClass: string | null;
    naming?: { property: (key: string) => string | null; now: Date };
}

/** The embed suffix the real service produces: class as a subpath, size in the alias slot. */
function embedSuffix(size: string | null, cssClass: string | null): string {
    return `${cssClass ? `#${cssClass}` : ''}${size ? `|${size}` : ''}`;
}

/** Image service double that resolves every reference to a predictable embed. */
function fakeImages(settings: BetterPasteSettings, failing = false, saved?: SavedClipboardImages[]): ImageService {
    return {
        hasWork: (text: string) => settings.imageMode !== 'off' && findImageReferences(text).length > 0,
        materializeImages: async (text: string, _sourcePath: string, size: string | null = null, cssClass: string | null = null) => {
            const references = findImageReferences(text);
            if (failing) return { text, downloaded: 0, failed: references.length, files: [] };
            const suffix = embedSuffix(size, cssClass);
            const embeds = new Map(references.map((reference, index) => [reference.index, `![[image-${index}.png${suffix}]]`]));
            const files = references.map((_, index) => ({ path: `image-${index}.png` }));
            return { text: replaceImageReferences(text, references, embeds), downloaded: embeds.size, failed: 0, files };
        },
        propertyLink: (file: { path: string }) => `"[[${file.path}]]"`,
        saveClipboardImage: async (
            file: File,
            source: string,
            sourcePath: string,
            size: string | null = null,
            cssClass: string | null = null,
            naming?: { property: (key: string) => string | null; now: Date }
        ) => {
            saved?.push({ file, source, sourcePath, size, cssClass, naming });
            if (failing) return null;
            // Name the saved file after the source picture, as the real service does
            const base = source ? (source.split('/').pop() ?? file.name).replace(/\.[a-z0-9]+$/i, '') : file.name;
            const embed = settings.fileMode === 'link' ? `[[${base}.png]]` : `![[${base}.png${embedSuffix(size, cssClass)}]]`;
            return { embed, file: { path: `${base}.png` } };
        },
        discardFiles: async () => undefined,
        dispose: () => undefined
    } as unknown as ImageService;
}

/** Title service double that resolves a standalone web address to a predictable link. */
function fakeTitles(settings: BetterPasteSettings, fetched: string[], pageTitle = 'Example page'): LinkTitleService {
    const hasWork = (text: string): boolean =>
        settings.linkTitles &&
        /^https?:\/\/\S+$/i.test(text) &&
        !/\.(?:png|jpe?g|gif|webp|svg|avif|bmp|heic|tiff|ico)(?:[?#]|$)/i.test(text);

    return {
        hasWork,
        hasBatchWork: (text: string) => settings.linkTitles && !hasWork(text) && standaloneWebUrlLines(text) !== null,
        materializeTitle: async (text: string) => {
            fetched.push(text);
            return hasWork(text) ? { title: pageTitle, url: text } : null;
        },
        materializeTitles: async (text: string, options?: StandaloneWebUrlLinesOptions) => {
            const urls = standaloneWebUrlLines(text, options)?.map(line => line.url) ?? [];
            return Promise.all(
                urls.map(async url => {
                    fetched.push(url);
                    return hasWork(url) ? { title: pageTitle, url } : null;
                })
            );
        },
        dispose: () => undefined
    } as unknown as LinkTitleService;
}

/** Dialog double: records what was asked and answers with a fixed pick. */
interface PromptDouble {
    response: ImageEmbedChoice | null;
    calls: { sizes: readonly string[] | null; classes: readonly string[] | null }[];
}

function build(overrides: Partial<BetterPasteSettings> = {}, failing = false, prompt?: PromptDouble, pageTitle = 'Example page') {
    const settings: BetterPasteSettings = { ...DEFAULT_SETTINGS, imageMode: 'download', ...overrides };
    const saved: SavedClipboardImages[] = [];
    const fetchedTitles: string[] = [];
    const nativeFilePastes: { files: readonly File[]; editor: Editor }[] = [];
    const service = new PasteService(
        () => settings,
        fakeImages(settings, failing, saved),
        fakeTitles(settings, fetchedTitles, pageTitle),
        async (sizes, classes) => {
            prompt?.calls.push({ sizes, classes });
            return prompt?.response ?? null;
        },
        undefined,
        (files, editor) => nativeFilePastes.push({ files, editor })
    );
    return { settings, service, saved, fetchedTitles, nativeFilePastes };
}

/** Lets queued timers and download promises settle. */
async function settle(): Promise<void> {
    for (let i = 0; i < 5; i++) await new Promise(resolve => setTimeout(resolve, 0));
}

/** Editor with `selected` highlighted, so tests never hand-count offsets. */
function selecting(doc: string, selected: string): FakeEditor {
    const start = doc.indexOf(selected);
    return new FakeEditor(doc, start, start + selected.length);
}

describe('handleEditorPaste: plain text', () => {
    it('takes over and inserts the cleaned text', () => {
        const { service } = build();
        const editor = new FakeEditor('');
        const event = fakeClipboardEvent({ plain: 'See https://example.com/a?utm_source=x' });

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(true);
        expect(editor.getValue()).toBe('See https://example.com/a');
    });

    it('declines when nothing would change, letting Obsidian paste normally', () => {
        const { service } = build();
        const editor = new FakeEditor('');
        const event = fakeClipboardEvent({ plain: 'nothing to do here' });

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(false);
        expect(editor.getValue()).toBe('');
    });

    it('replaces the selection rather than appending', () => {
        const { service } = build({ linkTitles: false });
        const editor = selecting('start OLD end', 'OLD');
        const event = fakeClipboardEvent({ plain: 'https://example.com/a?utm_source=x' });

        service.handleEditorPaste(event, editor.asEditor(), INFO);
        expect(editor.getValue()).toBe('start https://example.com/a end');
    });

    it('rebases a pasted list onto the list item at the cursor', () => {
        const { service } = build();
        const doc = '- main\n\t- sub\n\t\t- ';
        const editor = new FakeEditor(doc, doc.length);
        const event = fakeClipboardEvent({ plain: '- [ ] A\n    - [ ] A1\n        - [ ] A1a' });

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(true);
        expect(editor.getValue()).toBe('- main\n\t- sub\n\t\t- [ ] A\n\t\t\t- [ ] A1\n\t\t\t\t- [ ] A1a');
    });

    it('replaces the destination checkbox when pasted tasks carry a different state', () => {
        const { service } = build();
        const doc = '- [ ] ';
        const editor = new FakeEditor(doc, doc.length);
        const event = fakeClipboardEvent({ plain: '- [x] done one\n- [x] done two' });

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(true);
        expect(editor.getValue()).toBe('- [x] done one\n- [x] done two');
    });

    it('rebases through the paste command as well', async () => {
        const { service } = build();
        const doc = '- main\n\t- ';
        const editor = new FakeEditor(doc, doc.length);
        vi.stubGlobal('navigator', { clipboard: { readText: async () => '- A\n    - A1' } });

        try {
            await service.pasteProcessed(editor.asEditor(), INFO);
            expect(editor.getValue()).toBe('- main\n\t- A\n\t\t- A1');
        } finally {
            vi.unstubAllGlobals();
        }
    });

    it('skips the rebase when the note changed during the clipboard read', async () => {
        const { service } = build({ textTrim: false });
        const doc = '- main\n\t- ';
        const editor = new FakeEditor(doc, doc.length);
        let finishRead: (text: string) => void = () => undefined;
        const clipboardText = new Promise<string>(resolve => {
            finishRead = resolve;
        });
        vi.stubGlobal('navigator', { clipboard: { readText: () => clipboardText } });

        try {
            const paste = service.pasteProcessed(editor.asEditor(), INFO);
            editor.setSelection(0, 0);
            editor.replaceSelection('edit ');
            finishRead('- A\n    - A1');
            await paste;

            // The destination the rebase was aimed at is gone, so the text lands flat
            expect(editor.getValue()).toContain('- A\n    - A1');
        } finally {
            vi.unstubAllGlobals();
        }
    });

    it('downloads an image inside a rebased list at its rebased position', async () => {
        const { service } = build();
        const doc = '- main\n\t- ';
        const editor = new FakeEditor(doc, doc.length);
        const event = fakeClipboardEvent({ plain: '- https://example.com/cat.png\n- item' });

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(true);
        await settle();

        expect(editor.getValue()).toBe('- main\n\t- ![[image-0.png]]\n\t- item');
    });

    it('pastes a list unchanged when list nesting is off', () => {
        const { service } = build({ listNesting: false, textTrim: false });
        const doc = '- main\n\t- ';
        const editor = new FakeEditor(doc, doc.length);
        const event = fakeClipboardEvent({ plain: '- A\n    - A1' });

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(false);
        expect(editor.getValue()).toBe(doc);
    });

    it('continues a clean multi-line paste inside a block quote', () => {
        const { service } = build();
        const editor = new FakeEditor('> ');
        const event = fakeClipboardEvent({ plain: 'First paragraph\n\nSecond paragraph' });

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(true);
        expect(editor.getValue()).toBe('> First paragraph\n>\n> Second paragraph');
    });

    it('pastes multi-line text natively when quote continuation is off', () => {
        const { service } = build({ quoteContinuation: false });
        const doc = '> ';
        const editor = new FakeEditor(doc);
        const event = fakeClipboardEvent({ plain: 'First paragraph\n\nSecond paragraph' });

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(false);
        expect(editor.getValue()).toBe(doc);
    });

    it('continues a block quote through the paste command', async () => {
        const { service } = build();
        const editor = new FakeEditor('> ');
        vi.stubGlobal('navigator', { clipboard: { readText: async () => 'First paragraph\n\nSecond paragraph' } });

        try {
            await service.pasteProcessed(editor.asEditor(), INFO);
            expect(editor.getValue()).toBe('> First paragraph\n>\n> Second paragraph');
        } finally {
            vi.unstubAllGlobals();
        }
    });

    it('skips quote continuation when the note changed during the clipboard read', async () => {
        const { service } = build({ textTrim: false });
        const editor = new FakeEditor('> ');
        let finishRead: (text: string) => void = () => undefined;
        const clipboardText = new Promise<string>(resolve => {
            finishRead = resolve;
        });
        vi.stubGlobal('navigator', { clipboard: { readText: () => clipboardText } });

        try {
            const paste = service.pasteProcessed(editor.asEditor(), INFO);
            editor.setSelection(0, 0);
            editor.replaceSelection('edit ');
            finishRead('First\nSecond');
            await paste;

            expect(editor.getValue()).toBe('edit First\nSecond> ');
        } finally {
            vi.unstubAllGlobals();
        }
    });

    it('keeps the cursor inside a quote after a trailing line break when edge trimming is off', () => {
        const { service } = build({ textTrim: false });
        const editor = new FakeEditor('> ');
        const event = fakeClipboardEvent({ plain: 'First\n' });

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(true);
        expect(editor.getValue()).toBe('> First\n>');
        expect(editor.getCursor()).toEqual({ line: 1, ch: 1 });
    });

    it('downloads an image URL inside a continued block quote', async () => {
        const { service } = build();
        const editor = new FakeEditor('> ');
        const event = fakeClipboardEvent({ plain: 'First\nhttps://example.com/cat.png' });

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(true);
        await settle();

        expect(editor.getValue()).toBe('> First\n> ![[image-0.png]]');
    });

    it('leaves a multi-cursor paste to Obsidian', () => {
        const { service } = build();
        const editor = new FakeEditor('first\nsecond');
        vi.spyOn(editor, 'listSelections').mockReturnValue([
            { anchor: { line: 0, ch: 0 }, head: { line: 0, ch: 0 } },
            { anchor: { line: 1, ch: 0 }, head: { line: 1, ch: 0 } }
        ]);

        const handled = service.handleEditorPaste(fakeClipboardEvent({ plain: 'https://example.com/cat.png' }), editor.asEditor(), INFO);

        expect(handled).toBe(false);
        expect(editor.getValue()).toBe('first\nsecond');
    });

    it('cleans terminal output only through its command, not on paste', () => {
        const { service } = build();
        const editor = new FakeEditor('');
        const plain = [
            '• A bullet line that is comfortably past the sixty character wrap threshold and',
            '  continues on the next line.'
        ].join('\n');

        // The paste needs no rule, so the service leaves it to the default handler
        expect(service.handleEditorPaste(fakeClipboardEvent({ plain }), editor.asEditor(), INFO)).toBe(false);

        const pasted = new FakeEditor(plain);
        pasted.setSelection(0, plain.length);
        service.cleanTerminalSelection(pasted.asEditor());
        expect(pasted.getValue()).toBe(
            '- A bullet line that is comfortably past the sixty character wrap threshold and continues on the next line.'
        );
    });

    it('does nothing when automatic processing is off', () => {
        const { service } = build({ autoClean: false });
        const editor = new FakeEditor('');
        const event = fakeClipboardEvent({ plain: 'https://example.com/a?utm_source=x' });

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(false);
        expect(editor.getValue()).toBe('');
    });

    it('leaves a named image file with accompanying text to Obsidian', () => {
        const { service } = build();
        const editor = new FakeEditor('');
        const event = fakeClipboardEvent({ plain: 'https://example.com/a?utm_source=x', fileCount: 1 });

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(false);
        expect(editor.getValue()).toBe('');
    });

    it('treats a terminal <pre> payload as plain text', () => {
        const { service } = build();
        const editor = new FakeEditor('');
        const event = fakeClipboardEvent({
            plain: 'https://example.com/a?utm_source=x',
            html: '<pre><span style="color:#fff">https://example.com/a?utm_source=x</span></pre>'
        });

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(true);
        expect(editor.getValue()).toBe('https://example.com/a');
    });

    it('leaves a standalone browser code block to Obsidian', () => {
        const { service } = build();
        const editor = new FakeEditor('');
        const event = fakeClipboardEvent({ plain: 'const x = 1;\n', html: '<pre><code>const x = 1;</code></pre>' });

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(false);
        expect(editor.getValue()).toBe('');
    });
});

describe('handleEditorPaste: Safari copy image', () => {
    // The exact clipboard Safari produces for "Copy image": an <img> tag pointing at the
    // page's .webp, plus the decoded bitmap as a PNG file. Trimmed of its style attribute.
    const SAFARI_HTML =
        '<head><meta charset="UTF-8"></head>' +
        '<img src="https://www.tokentek.ai/_astro/gaia-2026-talk.J2oaR4rx_sdIoa.webp" ' +
        'srcset="/_astro/gaia-2026-talk.J2oaR4rx_ZR6PvP.webp 480w, /_astro/gaia-2026-talk.J2oaR4rx_Z1XRRpv.webp 768w" ' +
        'alt="Johan Sanneblad talar om agentisk utveckling" sizes="(max-width: 56rem) 100vw, 50vw" ' +
        'loading="lazy" width="2000" height="1333" class="rounded">' +
        '<br class="Apple-interchange-newline">';

    function safariEvent(): ClipboardEvent {
        return fakeClipboardEvent({ html: SAFARI_HTML, files: [fakeFile('image.png', 'image/png')] });
    }

    it('takes over instead of letting Obsidian insert an external link', async () => {
        const { service } = build();
        const editor = new FakeEditor('');

        expect(service.handleEditorPaste(safariEvent(), editor.asEditor(), INFO)).toBe(true);
        await settle();
        expect(editor.getValue()).toBe('![[gaia-2026-talk.J2oaR4rx_sdIoa.png]]');
    });

    it('saves the clipboard bitmap rather than downloading the source URL', async () => {
        const { service, saved } = build();
        const editor = new FakeEditor('');

        service.handleEditorPaste(safariEvent(), editor.asEditor(), INFO);
        await settle();

        expect(saved).toHaveLength(1);
        expect(saved[0].file.type).toBe('image/png');
        expect(saved[0].source).toBe('https://www.tokentek.ai/_astro/gaia-2026-talk.J2oaR4rx_sdIoa.webp');
        const sourcePath = saved[0].sourcePath;
        expect(typeof sourcePath === 'function' ? sourcePath() : sourcePath).toBe('Notes/Test.md');
    });

    it('saves clipboard bytes and inserts the vault embed in link mode', async () => {
        const { service, saved } = build({ imageMode: 'link', imageSizeChoice: '400' });
        const editor = new FakeEditor('');
        const noticeCount = Notice.instances.length;

        expect(service.handleEditorPaste(safariEvent(), editor.asEditor(), INFO)).toBe(true);
        await settle();

        expect(saved).toHaveLength(1);
        expect(Notice.instances).toHaveLength(noticeCount);
        expect(editor.getValue()).toBe('![[gaia-2026-talk.J2oaR4rx_sdIoa.png|400]]');
    });

    it('decodes the source URL when a link-mode byte save fails', async () => {
        const html =
            "<meta charset='utf-8'><img src=\"https://static.bonniernews.se/ba/" +
            'b199b344-6661-4663-90b8-6496bcea47f3.jpeg?' +
            'crop=3200%2C1600%2Cx0%2Cy100&amp;auto=webp&amp;width=620&amp;quality=70"/>';
        const event = fakeClipboardEvent({ html, files: [fakeFile('image.png', 'image/png')] });
        const { service, saved } = build({ imageMode: 'link' }, true);
        const editor = new FakeEditor('');

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(true);
        await settle();

        expect(saved).toHaveLength(1);
        expect(editor.getValue()).toBe(
            '![](https://static.bonniernews.se/ba/b199b344-6661-4663-90b8-6496bcea47f3.jpeg?' +
                'crop=3200%2C1600%2Cx0%2Cy100&auto=webp&width=620&quality=70)'
        );
    });

    it('saves a source whose address and alt text need Markdown escaping', async () => {
        const html = '<img src="https://example.com/a (b.png" alt="A [cat] | photo">';
        const event = fakeClipboardEvent({ html, files: [fakeFile('image.png', 'image/png')] });
        const { service, saved } = build({ imageMode: 'link', imageSizeChoice: '400' });
        const editor = new FakeEditor('');

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(true);
        await settle();

        expect(saved).toHaveLength(1);
        expect(editor.getValue()).toBe('![[a (b.png|400]]');
    });

    it('ignores srcset so only the real source is used', async () => {
        const { service, saved } = build();
        service.handleEditorPaste(safariEvent(), new FakeEditor('').asEditor(), INFO);
        await settle();
        expect(saved[0].source).toBe('https://www.tokentek.ai/_astro/gaia-2026-talk.J2oaR4rx_sdIoa.webp');
    });

    it('replaces the selection the paste was aimed at', async () => {
        const { service } = build();
        const editor = selecting('start OLD end', 'OLD');

        service.handleEditorPaste(safariEvent(), editor.asEditor(), INFO);
        await settle();
        expect(editor.getValue()).toBe('start ![[gaia-2026-talk.J2oaR4rx_sdIoa.png]] end');
    });

    it('falls back to linking the picture when it cannot be saved', async () => {
        const html = '<img src="https://example.com/a (b).png">';
        const event = fakeClipboardEvent({ html, files: [fakeFile('image.png', 'image/png')] });
        const { service } = build({}, true);
        const editor = new FakeEditor('');
        const noticeCount = Notice.instances.length;

        service.handleEditorPaste(event, editor.asEditor(), INFO);
        await settle();
        expect(editor.getValue()).toBe('![](https://example.com/a%20%28b%29.png)');
        expect(Notice.instances).toHaveLength(noticeCount + 1);
        expect(Notice.instances[noticeCount].message).toBe('Better Paste: 1 image could not be saved, the original link was kept');
    });

    it('reports a failed byte save for a data URI in link mode', async () => {
        const html = '<img src="data:image/png;base64,AA==">';
        const event = fakeClipboardEvent({ html, files: [fakeFile('image.png', 'image/png')] });
        const { service } = build({ imageMode: 'link' }, true);
        const editor = new FakeEditor('');
        const noticeCount = Notice.instances.length;

        service.handleEditorPaste(event, editor.asEditor(), INFO);
        await settle();

        expect(Notice.instances).toHaveLength(noticeCount + 1);
        expect(Notice.instances[noticeCount].message).toBe('Better Paste: 1 image could not be saved, the original link was kept');
    });

    it('takes over a plain bitmap paste with no HTML', async () => {
        const { service, saved } = build();
        const editor = new FakeEditor('');
        const event = fakeClipboardEvent({ files: [fakeFile('image.png', 'image/png')] });

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(true);
        await settle();
        expect(saved).toHaveLength(1);
        expect(editor.getValue()).toContain('![[');
    });

    it('leaves a non-image file paste to Obsidian', () => {
        const { service } = build();
        const editor = new FakeEditor('');
        const event = fakeClipboardEvent({ html: '<p>a note</p>', files: [fakeFile('notes.pdf', 'application/pdf')] });

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(false);
    });

    it('leaves the paste alone when image handling is off', () => {
        const { service } = build({ imageMode: 'off' });
        const editor = new FakeEditor('');

        expect(service.handleEditorPaste(safariEvent(), editor.asEditor(), INFO)).toBe(false);
        expect(editor.getValue()).toBe('');
    });

    it('leaves a multi-file paste to Obsidian', () => {
        const { service } = build();
        const editor = new FakeEditor('');
        const event = fakeClipboardEvent({
            html: '<img src="https://example.com/one.png"><img src="https://example.com/two.png">',
            files: [fakeFile('image.png', 'image/png'), fakeFile('image2.png', 'image/png')]
        });

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(false);
        expect(editor.getValue()).toBe('');
    });
});

describe('isSingleImageFile', () => {
    it('accepts a blank type when the file name has an image extension', () => {
        expect(isSingleImageFile([fakeFile('photo.png', '')])).toBe(true);
        expect(isSingleImageFile([fakeFile('notes.pdf', '')])).toBe(false);
    });
});

describe('handleEditorPaste: pasted file links', () => {
    it('arms the native rewrite for a PDF while leaving the paste to Obsidian', () => {
        const file = fakeFile('Document.pdf', 'application/pdf');
        const { service, nativeFilePastes } = build({ fileMode: 'link' });
        const editor = new FakeEditor('');

        expect(service.handleEditorPaste(fakeClipboardEvent({ files: [file] }), editor.asEditor(), INFO)).toBe(false);
        expect(nativeFilePastes).toEqual([{ files: [file], editor: editor.asEditor() }]);
    });

    it('does not arm the native rewrite in the default preview mode', () => {
        const { service, nativeFilePastes } = build();

        expect(
            service.handleEditorPaste(
                fakeClipboardEvent({ files: [fakeFile('Document.pdf', 'application/pdf')] }),
                new FakeEditor('').asEditor(),
                INFO
            )
        ).toBe(false);
        expect(nativeFilePastes).toHaveLength(0);
    });

    it('arms the native rewrite when automatic cleanup is off or the cursor is in code', () => {
        const file = fakeFile('Document.pdf', 'application/pdf');
        const disabled = build({ fileMode: 'link', autoClean: false });
        const inCode = build({ fileMode: 'link' });

        expect(disabled.service.handleEditorPaste(fakeClipboardEvent({ files: [file] }), new FakeEditor('').asEditor(), INFO)).toBe(false);
        expect(inCode.service.handleEditorPaste(fakeClipboardEvent({ files: [file] }), new FakeEditor('`code`', 3).asEditor(), INFO)).toBe(
            false
        );

        expect(disabled.nativeFilePastes).toHaveLength(1);
        expect(inCode.nativeFilePastes).toHaveLength(1);
    });

    it('keeps the preview in a note whose property opts out of paste handling', () => {
        const content = '---\nbp: false\n---\n\n';
        const { service, nativeFilePastes } = build({ fileMode: 'link' });
        const editor = new FakeEditor(content, content.length);

        expect(
            service.handleEditorPaste(fakeClipboardEvent({ files: [fakeFile('Document.pdf', 'application/pdf')] }), editor.asEditor(), INFO)
        ).toBe(false);
        expect(nativeFilePastes).toHaveLength(0);
    });

    it('leaves named images and multi-file pastes to the native rewrite', () => {
        const named = fakeFile('photo.png', 'image/png');
        const document = fakeFile('Document.pdf', 'application/pdf');
        const { service, nativeFilePastes } = build({ fileMode: 'link', imageSizeChoice: '400' });
        const editor = new FakeEditor('');

        expect(service.handleEditorPaste(fakeClipboardEvent({ files: [named] }), editor.asEditor(), INFO)).toBe(false);
        expect(service.handleEditorPaste(fakeClipboardEvent({ files: [named, document] }), editor.asEditor(), INFO)).toBe(false);

        expect(nativeFilePastes.map(paste => paste.files)).toEqual([[named], [named, document]]);
    });

    it('inserts a direct link for a clipboard bitmap without asking for embed options', async () => {
        const prompt: PromptDouble = { response: { size: '400', cssClass: 'invert' }, calls: [] };
        const { service, saved } = build(
            { fileMode: 'link', imageSizeChoice: 'ask', imageClassChoice: 'ask', imageClassOptions: 'invert' },
            false,
            prompt
        );
        const editor = new FakeEditor('');
        const event = fakeClipboardEvent({
            html: '<img src="https://example.com/photo.webp" alt="A photo">',
            files: [fakeFile('image.png', 'image/png')]
        });

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(true);
        await settle();

        expect(prompt.calls).toHaveLength(0);
        expect(saved).toMatchObject([{ size: null, cssClass: null }]);
        expect(editor.getValue()).toBe('[[photo.png]]');
    });

    it('keeps visible text when removing the preview marker from a fallback web link', async () => {
        const { service } = build({ fileMode: 'link' }, true);
        const editor = new FakeEditor('');
        const event = fakeClipboardEvent({
            html: '<img src="https://example.com/photo.png" alt="A photo">',
            files: [fakeFile('image.png', 'image/png')]
        });

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(true);
        await settle();

        expect(editor.getValue()).toBe('[A photo](https://example.com/photo.png)');
    });
});

describe('handleEditorDrop: native attachments', () => {
    function drop(files: readonly File[] | null): DragEvent {
        return { dataTransfer: files === null ? null : { files } } as unknown as DragEvent;
    }

    it('arms file drops in link mode', () => {
        const file = fakeFile('photo.png', 'image/png');
        const link = build({ fileMode: 'link' });
        const editor = new FakeEditor('');

        link.service.handleEditorDrop(drop([file]), editor.asEditor(), INFO);

        expect(link.nativeFilePastes).toHaveLength(1);
    });

    it('does not arm without files, with default behavior, or when the note opts out', () => {
        const defaults = build();
        const optedOut = build({ fileMode: 'link' });
        const editor = new FakeEditor('---\nbp: false\n---\n');

        defaults.service.handleEditorDrop(drop(null), editor.asEditor(), INFO);
        defaults.service.handleEditorDrop(drop([]), editor.asEditor(), INFO);
        defaults.service.handleEditorDrop(drop([fakeFile('photo.png', 'image/png')]), editor.asEditor(), INFO);
        optedOut.service.handleEditorDrop(drop([fakeFile('photo.png', 'image/png')]), editor.asEditor(), INFO);

        expect(defaults.nativeFilePastes).toHaveLength(0);
        expect(optedOut.nativeFilePastes).toHaveLength(0);
    });
});

describe('handleEditorPaste: clipboard image naming', () => {
    const naming: Partial<BetterPasteSettings> = {
        imageNameTemplate: '{{noteName}}-{{counter}}'
    };

    function screenshotEvent(file = fakeFile('image.png', 'image/png')): ClipboardEvent {
        return fakeClipboardEvent({ files: [file] });
    }

    it('takes over a bare screenshot and names it from the template', async () => {
        const { service, saved } = build(naming);
        const editor = new FakeEditor('');

        expect(service.handleEditorPaste(screenshotEvent(), editor.asEditor(), INFO)).toBe(true);
        await settle();

        expect(saved).toHaveLength(1);
        expect(editor.getValue()).toContain('![[');
    });

    it('keeps the paste native when the template needs a property the note lacks', () => {
        const { service } = build({ ...naming, imageNameTemplate: '{{property:attachName}}-{{counter}}' });
        const editor = new FakeEditor('');

        expect(service.handleEditorPaste(screenshotEvent(), editor.asEditor(), INFO)).toBe(false);
    });

    it('takes over when the note supplies the template property, handing it to the save', async () => {
        const { service, saved } = build({ ...naming, imageNameTemplate: '{{property:attachName}}-{{counter}}' });
        const editor = new FakeEditor('---\nattachName: shots\n---\n');

        expect(service.handleEditorPaste(screenshotEvent(), editor.asEditor(), INFO)).toBe(true);
        await settle();
        expect(saved[0].naming?.property('attachName')).toBe('shots');
    });

    it('leaves a file with its own name to Obsidian, unless a size or class applies', async () => {
        const named = () => screenshotEvent(fakeFile('photo.png', 'image/png'));
        const editor = new FakeEditor('');

        expect(build(naming).service.handleEditorPaste(named(), editor.asEditor(), INFO)).toBe(false);
        expect(build({ ...naming, imageSizeChoice: '400' }).service.handleEditorPaste(named(), editor.asEditor(), INFO)).toBe(true);
        await settle();
    });

    it('keeps the paste native for an oversized or unsupported file', () => {
        const { service } = build(naming);
        const editor = new FakeEditor('');
        const oversized = { name: 'big.png', type: 'image/png', size: 51 * 1024 * 1024 } as File;

        expect(service.handleEditorPaste(screenshotEvent(oversized), editor.asEditor(), INFO)).toBe(false);
        expect(service.handleEditorPaste(screenshotEvent(fakeFile('image.jxl', 'image/jxl')), editor.asEditor(), INFO)).toBe(false);
    });

    it('takes over a screenshot even when web image saving is off', async () => {
        const { service, saved } = build({ ...naming, imageMode: 'off' });
        const editor = new FakeEditor('');

        expect(service.handleEditorPaste(screenshotEvent(), editor.asEditor(), INFO)).toBe(true);
        await settle();
        expect(saved).toHaveLength(1);
    });

    it('keeps a decorated but oversized bare bitmap native as well', () => {
        const { service } = build({ imageSizeChoice: '400' });
        const editor = new FakeEditor('');
        const oversized = { name: 'big.png', type: 'image/png', size: 51 * 1024 * 1024 } as File;

        expect(service.handleEditorPaste(screenshotEvent(oversized), editor.asEditor(), INFO)).toBe(false);
    });

    it('still takes over an oversized Safari copy, whose HTML offers a link fallback', () => {
        const { service } = build({ imageSizeChoice: '400' }, true);
        const editor = new FakeEditor('');
        const oversized = { name: 'big.png', type: 'image/png', size: 51 * 1024 * 1024 } as File;
        const event = fakeClipboardEvent({ html: '<img src="https://example.com/big.png">', files: [oversized] });

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(true);
    });
});

describe('image width from frontmatter', () => {
    const SAFARI_HTML = '<img src="https://example.com/photo.webp" alt="a photo">';

    function safariEvent(): ClipboardEvent {
        return fakeClipboardEvent({ html: SAFARI_HTML, files: [fakeFile('image.png', 'image/png')] });
    }

    /** A note whose frontmatter asks for a width, with the cursor at the end. */
    function noteAsking(width: string): FakeEditor {
        return new FakeEditor(`---\nimage-width: ${width}\n---\n\n`);
    }

    it('sizes a clipboard bitmap to the width the note asks for', async () => {
        const { service } = build();
        const editor = noteAsking('400');

        service.handleEditorPaste(safariEvent(), editor.asEditor(), INFO);
        await settle();
        expect(editor.getValue()).toBe('---\nimage-width: 400\n---\n\n![[photo.png|400]]');
    });

    it('passes a width and height through', async () => {
        const { service, saved } = build();
        service.handleEditorPaste(safariEvent(), noteAsking('400x300').asEditor(), INFO);
        await settle();
        expect(saved[0].size).toBe('400x300');
    });

    it('sizes a downloaded image too', async () => {
        const { service } = build();
        const editor = noteAsking('250');
        const event = fakeClipboardEvent({ plain: 'https://example.com/cat.png' });

        service.handleEditorPaste(event, editor.asEditor(), INFO);
        await settle();
        expect(editor.getValue()).toBe('---\nimage-width: 250\n---\n\n![[image-0.png|250]]');
    });

    it('sizes images pulled out of rich content', async () => {
        const { service } = build();
        const editor = noteAsking('120');

        const handled = service.handleEditorPaste(
            fakeClipboardEvent({ html: '<p>x</p><img src="https://example.com/a.png">', plain: '' }),
            editor.asEditor(),
            INFO
        );
        expect(handled).toBe(false);
        editor.replaceSelection('![](https://example.com/a.png)');
        await settle();

        expect(editor.getValue()).toBe('---\nimage-width: 120\n---\n\n![[image-0.png|120]]');
    });

    it('takes over a plain screenshot paste so the width still applies', async () => {
        const { service, saved } = build();
        const editor = noteAsking('400');
        const event = fakeClipboardEvent({ files: [fakeFile('image.png', 'image/png')] });

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(true);
        await settle();
        expect(saved[0].size).toBe('400');
    });

    it('takes over a screenshot without adding a width when the note asks for none', async () => {
        const { service, saved } = build();
        const editor = new FakeEditor('---\ntitle: Notes\n---\n\n');
        const event = fakeClipboardEvent({ files: [fakeFile('image.png', 'image/png')] });

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(true);
        await settle();
        expect(saved[0].size).toBeNull();
    });

    it('applies no width when the note has no frontmatter', async () => {
        const { service, saved } = build();
        service.handleEditorPaste(safariEvent(), new FakeEditor('').asEditor(), INFO);
        await settle();
        expect(saved[0].size).toBeNull();
    });

    it('ignores the property when the feature is switched off', async () => {
        const { service, saved } = build({ imageSizeProperty: '' });
        service.handleEditorPaste(safariEvent(), noteAsking('400').asEditor(), INFO);
        await settle();
        expect(saved[0].size).toBeNull();
    });

    it('honours a renamed property', async () => {
        const { service, saved } = build({ imageSizeProperty: 'bildbredd' });
        const editor = new FakeEditor('---\nbildbredd: 640\n---\n\n');

        service.handleEditorPaste(safariEvent(), editor.asEditor(), INFO);
        await settle();
        expect(saved[0].size).toBe('640');
    });

    it('ignores a value that is not a usable size', async () => {
        const { service, saved } = build();
        service.handleEditorPaste(safariEvent(), noteAsking('very wide').asEditor(), INFO);
        await settle();
        expect(saved[0].size).toBeNull();
    });

    it('sizes the fallback link when the image cannot be saved', async () => {
        const { service } = build({}, true);
        const editor = noteAsking('400');

        service.handleEditorPaste(safariEvent(), editor.asEditor(), INFO);
        await settle();
        expect(editor.getValue()).toBe('---\nimage-width: 400\n---\n\n![400](https://example.com/photo.webp)');
    });
});

describe('handleEditorPaste: images in plain text', () => {
    it('downloads a pasted image URL and embeds the local copy', async () => {
        const { service } = build();
        const editor = new FakeEditor('');
        const event = fakeClipboardEvent({ plain: 'https://example.com/cat.png' });

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(true);
        await settle();
        expect(editor.getValue()).toBe('![[image-0.png]]');
    });

    it('leaves a pasted image URL alone when image saving is off', () => {
        const { service } = build({ imageMode: 'off' });
        const editor = new FakeEditor('');
        const event = fakeClipboardEvent({ plain: 'https://example.com/cat.png' });

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(false);
        expect(editor.getValue()).toBe('');
    });

    it('keeps the original URL when the download fails', async () => {
        const { service } = build({}, true);
        const editor = new FakeEditor('');
        const event = fakeClipboardEvent({ plain: 'https://example.com/cat.png' });

        service.handleEditorPaste(event, editor.asEditor(), INFO);
        await settle();
        expect(editor.getValue()).toBe('https://example.com/cat.png');
    });

    it('inserts at the right place when text precedes the paste', async () => {
        const { service } = build();
        const editor = new FakeEditor('intro\n\n', 7);
        const event = fakeClipboardEvent({ plain: 'https://example.com/cat.png' });

        service.handleEditorPaste(event, editor.asEditor(), INFO);
        await settle();
        expect(editor.getValue()).toBe('intro\n\n![[image-0.png]]');
    });

    it('replaces the pasted occurrence when the same URL already exists and the user keeps typing', async () => {
        const { service } = build();
        const url = 'https://example.com/cat.png';
        const editor = new FakeEditor(`${url}\n`);

        service.handleEditorPaste(fakeClipboardEvent({ plain: url }), editor.asEditor(), INFO);
        editor.replaceSelection(' notes');
        await settle();

        expect(editor.getValue()).toBe(`${url}\n![[image-0.png]] notes`);
    });

    it('replaces two identical image URLs pasted before either download finishes', async () => {
        const { service } = build();
        const url = 'https://example.com/cat.png';
        const editor = new FakeEditor('');

        service.handleEditorPaste(fakeClipboardEvent({ plain: url }), editor.asEditor(), INFO);
        editor.replaceSelection('\n');
        service.handleEditorPaste(fakeClipboardEvent({ plain: url }), editor.asEditor(), INFO);
        await settle();

        expect(editor.getValue()).toBe('![[image-0.png]]\n![[image-0.png]]');
    });
});

describe('image embed options', () => {
    const SAFARI_HTML = '<img src="https://example.com/photo.webp" alt="a photo">';
    const bitmapEvent = (): ClipboardEvent => fakeClipboardEvent({ html: SAFARI_HTML, files: [fakeFile('image.png', 'image/png')] });
    const imageUrlEvent = (): ClipboardEvent => fakeClipboardEvent({ plain: 'https://example.com/pic.png' });

    it('applies the chosen size to a downloaded image', async () => {
        const { service } = build({ imageSizeChoice: '600' });
        const editor = new FakeEditor('');

        service.handleEditorPaste(imageUrlEvent(), editor.asEditor(), INFO);
        await settle();
        expect(editor.getValue()).toBe('![[image-0.png|600]]');
    });

    it('takes over a plain bitmap paste for the chosen class', async () => {
        const { service, saved } = build({ imageClassChoice: 'invert', imageClassOptions: 'invert, invertW' });
        const editor = new FakeEditor('');
        // Without a class to apply this clipboard would be left to Obsidian
        const event = fakeClipboardEvent({ files: [fakeFile('image.png', 'image/png')] });

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(true);
        await settle();
        expect(saved[0].cssClass).toBe('invert');
        expect(editor.getValue()).toContain('#invert]]');
    });

    it('lets the note width override the chosen size', async () => {
        const { service, saved } = build({ imageSizeChoice: '600' });
        const editor = new FakeEditor('---\nimage-width: 300\n---\n\n');

        service.handleEditorPaste(bitmapEvent(), editor.asEditor(), INFO);
        await settle();
        expect(saved[0].size).toBe('300');
    });

    it('asks once and applies the picked size and class', async () => {
        const prompt: PromptDouble = { response: { size: '800', cssClass: 'invertW' }, calls: [] };
        const { service } = build({ imageSizeChoice: 'ask', imageClassChoice: 'ask', imageClassOptions: 'invert, invertW' }, false, prompt);
        const editor = new FakeEditor('');

        service.handleEditorPaste(imageUrlEvent(), editor.asEditor(), INFO);
        await settle();
        expect(prompt.calls).toEqual([{ sizes: ['200', '400', '600'], classes: ['invert', 'invertW'] }]);
        expect(editor.getValue()).toBe('![[image-0.png#invertW|800]]');
    });

    it('asks for size and class when link mode saves a clipboard bitmap', async () => {
        const prompt: PromptDouble = { response: { size: '400', cssClass: 'invert' }, calls: [] };
        const { service } = build(
            { imageMode: 'link', imageSizeChoice: 'ask', imageClassChoice: 'ask', imageClassOptions: 'invert' },
            false,
            prompt
        );
        const editor = new FakeEditor('');

        service.handleEditorPaste(bitmapEvent(), editor.asEditor(), INFO);
        await settle();

        expect(prompt.calls).toEqual([{ sizes: ['200', '400', '600'], classes: ['invert'] }]);
        expect(editor.getValue()).toBe('![[photo.png#invert|400]]');
    });

    it('applies nothing when the dialog is dismissed', async () => {
        const prompt: PromptDouble = { response: null, calls: [] };
        const { service } = build({ imageSizeChoice: 'ask' }, false, prompt);
        const editor = new FakeEditor('');

        service.handleEditorPaste(imageUrlEvent(), editor.asEditor(), INFO);
        await settle();
        expect(prompt.calls).toHaveLength(1);
        expect(editor.getValue()).toBe('![[image-0.png]]');
    });

    it('ignores a choice whose value is no longer offered', async () => {
        const prompt: PromptDouble = { response: { size: '999', cssClass: null }, calls: [] };
        const { service } = build({ imageSizeChoice: '999' }, false, prompt);
        const editor = new FakeEditor('');

        service.handleEditorPaste(imageUrlEvent(), editor.asEditor(), INFO);
        await settle();
        expect(prompt.calls).toHaveLength(0);
        expect(editor.getValue()).toBe('![[image-0.png]]');
    });

    it('skips the size half of the dialog when the note sets the width', async () => {
        const prompt: PromptDouble = { response: { size: null, cssClass: 'invert' }, calls: [] };
        const { service, saved } = build({ imageSizeChoice: 'ask', imageClassChoice: 'ask', imageClassOptions: 'invert' }, false, prompt);
        const editor = new FakeEditor('---\nimage-width: 300\n---\n\n');

        service.handleEditorPaste(bitmapEvent(), editor.asEditor(), INFO);
        await settle();
        expect(prompt.calls).toEqual([{ sizes: null, classes: ['invert'] }]);
        expect(saved[0].size).toBe('300');
        expect(saved[0].cssClass).toBe('invert');
    });
});

describe('handleEditorPaste: link titles', () => {
    const obsidianUrl = 'obsidian://open?vault=Notes&file=Folder%2FMy%20Note';

    it('inserts a titled link for a standalone Obsidian open URL', () => {
        const { service } = build({ linkTitles: true, linkEnabled: false });
        const editor = new FakeEditor('');

        expect(service.handleEditorPaste(fakeClipboardEvent({ plain: obsidianUrl }), editor.asEditor(), INFO)).toBe(true);
        expect(editor.getValue()).toBe(`[My Note](${obsidianUrl})`);
    });

    it('leaves an Obsidian open URL native when title fetching is off', () => {
        const { service } = build({ linkTitles: false, linkEnabled: false, textTrim: false });
        const editor = new FakeEditor('');

        expect(service.handleEditorPaste(fakeClipboardEvent({ plain: obsidianUrl }), editor.asEditor(), INFO)).toBe(false);
        expect(editor.getValue()).toBe('');
    });

    it('uses the selection as the Obsidian URL label', () => {
        const { service } = build({ linkTitles: true, linkEnabled: false });
        const editor = selecting('Before selected text after', 'selected text');

        expect(service.handleEditorPaste(fakeClipboardEvent({ plain: obsidianUrl }), editor.asEditor(), INFO)).toBe(true);
        expect(editor.getValue()).toBe(`Before [selected text](${obsidianUrl}) after`);
    });

    it('applies URL snippets to an Obsidian URL link', () => {
        const { service } = build({
            linkTitles: true,
            linkEnabled: false,
            urlSnippets: [urlSnippet('s/My Note/Named note/')]
        });
        const editor = new FakeEditor('');

        service.handleEditorPaste(fakeClipboardEvent({ plain: obsidianUrl }), editor.asEditor(), INFO);
        expect(editor.getValue()).toBe(`[Named note](${obsidianUrl})`);
    });

    it('inserts a titled Obsidian URL through paste processed', async () => {
        const { service } = build({ linkTitles: true, linkEnabled: false });
        const editor = new FakeEditor('');
        vi.stubGlobal('navigator', { clipboard: { readText: async () => obsidianUrl } });

        try {
            await service.pasteProcessed(editor.asEditor(), INFO);
            expect(editor.getValue()).toBe(`[My Note](${obsidianUrl})`);
        } finally {
            vi.unstubAllGlobals();
        }
    });

    it('leaves other Obsidian actions native', () => {
        const { service } = build({ linkTitles: true, linkEnabled: false, textTrim: false });
        const editor = new FakeEditor('');

        expect(service.handleEditorPaste(fakeClipboardEvent({ plain: 'obsidian://search?query=x' }), editor.asEditor(), INFO)).toBe(false);
        expect(editor.getValue()).toBe('');
    });

    it('rewrites URL lines continued inside a block quote', async () => {
        const { service, fetchedTitles } = build({ linkTitles: true, linkEnabled: false });
        const editor = new FakeEditor('> ', 2);

        expect(service.handleEditorPaste(fakeClipboardEvent({ plain: 'https://a.com\nhttps://b.com' }), editor.asEditor(), INFO)).toBe(
            true
        );
        await settle();

        expect(fetchedTitles).toEqual(['https://a.com', 'https://b.com']);
        expect(editor.getValue()).toBe('> [Example page](https://a.com)\n> [Example page](https://b.com)');
    });

    it('preserves a quoted blank line inside a URL batch', async () => {
        const { service } = build({ linkTitles: true, linkEnabled: false });
        const editor = new FakeEditor('> ', 2);

        service.handleEditorPaste(fakeClipboardEvent({ plain: 'https://a.com\n\nhttps://b.com' }), editor.asEditor(), INFO);
        await settle();

        expect(editor.getValue()).toBe('> [Example page](https://a.com)\n>\n> [Example page](https://b.com)');
    });

    it('does not treat clipboard-authored quote lines as a URL batch', () => {
        const { service, fetchedTitles } = build({ linkTitles: true, linkEnabled: false, textTrim: false });
        const editor = new FakeEditor('');

        expect(service.handleEditorPaste(fakeClipboardEvent({ plain: '> https://a.com\n> https://b.com' }), editor.asEditor(), INFO)).toBe(
            false
        );
        expect(fetchedTitles).toEqual([]);
    });

    it('rewrites URL lines while preserving indentation and blank lines', async () => {
        const { service } = build({ linkTitles: true, linkEnabled: false, textTrim: false });
        const editor = new FakeEditor('');
        const pasted = '  https://a.com/page  \n\nhttps://b.com/page';

        expect(service.handleEditorPaste(fakeClipboardEvent({ plain: pasted }), editor.asEditor(), INFO)).toBe(true);
        await settle();

        expect(editor.getValue()).toBe('  [Example page](https://a.com/page)  \n\n[Example page](https://b.com/page)');
    });

    it('rewrites URL lists while preserving their markers', async () => {
        const { service } = build({ linkTitles: true, linkEnabled: false });
        const editor = new FakeEditor('');
        const pasted = '1. https://a.com/page\n2. https://b.com/page\n- [ ] https://c.com/page';

        expect(service.handleEditorPaste(fakeClipboardEvent({ plain: pasted }), editor.asEditor(), INFO)).toBe(true);
        await settle();

        expect(editor.getValue()).toBe(
            '1. [Example page](https://a.com/page)\n2. [Example page](https://b.com/page)\n- [ ] [Example page](https://c.com/page)'
        );
    });

    it('applies URL snippets to every titled link in a batch', async () => {
        const { service } = build({
            linkTitles: true,
            linkEnabled: false,
            urlSnippets: [urlSnippet('s/Example page/Page/')]
        });
        const editor = new FakeEditor('');

        service.handleEditorPaste(fakeClipboardEvent({ plain: 'https://a.com/page\nhttps://b.com/page' }), editor.asEditor(), INFO);
        await settle();

        expect(editor.getValue()).toBe('[Page](https://a.com/page)\n[Page](https://b.com/page)');
    });

    it('keeps failed batch URLs bare and reports one count notice', async () => {
        const settings: BetterPasteSettings = { ...DEFAULT_SETTINGS, linkTitles: true, linkEnabled: false };
        const titles = {
            hasWork: () => false,
            hasBatchWork: () => true,
            materializeTitles: async () => [{ title: 'First', url: 'https://a.com' }, null],
            dispose: () => undefined
        } as unknown as LinkTitleService;
        const service = new PasteService(() => settings, fakeImages(settings), titles);
        const editor = new FakeEditor('');
        const noticeCount = Notice.instances.length;

        service.handleEditorPaste(fakeClipboardEvent({ plain: 'https://a.com\nhttps://b.com' }), editor.asEditor(), INFO);
        await settle();

        expect(editor.getValue()).toBe('[First](https://a.com)\nhttps://b.com');
        expect(Notice.instances.slice(noticeCount).map(notice => notice.message)).toContain('Better Paste: could not fetch 1 title');
    });

    it('skips a batch rewrite after an edit inside the pasted range', async () => {
        const settings: BetterPasteSettings = { ...DEFAULT_SETTINGS, linkTitles: true, linkEnabled: false };
        let finish: (value: ({ title: string; url: string } | null)[]) => void = () => undefined;
        const pending = new Promise<({ title: string; url: string } | null)[]>(resolve => {
            finish = resolve;
        });
        const titles = {
            hasWork: () => false,
            hasBatchWork: () => true,
            materializeTitles: () => pending,
            dispose: () => undefined
        } as unknown as LinkTitleService;
        const service = new PasteService(() => settings, fakeImages(settings), titles);
        const pasted = 'https://a.com\nhttps://b.com';
        const editor = new FakeEditor('');

        service.handleEditorPaste(fakeClipboardEvent({ plain: pasted }), editor.asEditor(), INFO);
        editor.setSelection(8, 8);
        editor.replaceSelection('edited-');
        finish([
            { title: 'First', url: 'https://a.com' },
            { title: 'Second', url: 'https://b.com' }
        ]);
        await pending;
        await settle();

        expect(editor.getValue()).toBe('https://edited-a.com\nhttps://b.com');
    });

    it('guards only URL-shaped edges while a batch title fetch is pending', async () => {
        const run = async (pasted: string, editOffset: number, typed: string): Promise<string> => {
            const settings: BetterPasteSettings = { ...DEFAULT_SETTINGS, linkTitles: true, linkEnabled: false, textTrim: false };
            let finish: (value: { title: string; url: string }[]) => void = () => undefined;
            const pending = new Promise<{ title: string; url: string }[]>(resolve => {
                finish = resolve;
            });
            const titles = {
                hasWork: () => false,
                hasBatchWork: () => true,
                materializeTitles: () => pending,
                dispose: () => undefined
            } as unknown as LinkTitleService;
            const service = new PasteService(() => settings, fakeImages(settings), titles);
            const editor = new FakeEditor('');

            service.handleEditorPaste(fakeClipboardEvent({ plain: pasted }), editor.asEditor(), INFO);
            editor.setSelection(editOffset, editOffset);
            editor.replaceSelection(typed);
            finish([
                { title: 'First', url: 'https://a.com' },
                { title: 'Second', url: 'https://b.com' }
            ]);
            await pending;
            await settle();
            return editor.getValue();
        };

        const urls = 'https://a.com\nhttps://b.com';
        expect(await run(urls, urls.length, '/docs')).toBe(`${urls}/docs`);
        expect(await run(urls, 0, 'prefix-')).toBe(`prefix-${urls}`);

        const withNewline = `${urls}\n`;
        expect(await run(withNewline, withNewline.length, 'Following line')).toBe(
            '[First](https://a.com)\n[Second](https://b.com)\nFollowing line'
        );
    });

    it('rewrites a URL-line batch through paste processed', async () => {
        const { service } = build({ linkTitles: true, linkEnabled: false });
        const editor = new FakeEditor('');
        vi.stubGlobal('navigator', { clipboard: { readText: async () => 'https://a.com\nhttps://b.com' } });

        try {
            await service.pasteProcessed(editor.asEditor(), INFO);
            expect(editor.getValue()).toBe('[Example page](https://a.com)\n[Example page](https://b.com)');
        } finally {
            vi.unstubAllGlobals();
        }
    });

    it('rewrites a URL-line batch through paste processed inside a block quote', async () => {
        const { service } = build({ linkTitles: true, linkEnabled: false });
        const editor = new FakeEditor('> ', 2);
        vi.stubGlobal('navigator', { clipboard: { readText: async () => 'https://a.com\nhttps://b.com' } });

        try {
            await service.pasteProcessed(editor.asEditor(), INFO);
            expect(editor.getValue()).toBe('> [Example page](https://a.com)\n> [Example page](https://b.com)');
        } finally {
            vi.unstubAllGlobals();
        }
    });

    it('replaces a selection with a batch without using it as a label', async () => {
        const { service } = build({ linkTitles: true, linkEnabled: false });
        const editor = selecting('Before selected text after', 'selected text');

        service.handleEditorPaste(fakeClipboardEvent({ plain: 'https://a.com\nhttps://b.com' }), editor.asEditor(), INFO);
        await settle();

        expect(editor.getValue()).toBe('Before [Example page](https://a.com)\n[Example page](https://b.com) after');
    });

    it('leaves a standalone URL to Obsidian when title fetching is off', () => {
        const { service } = build({ linkTitles: false, linkEnabled: false, textTrim: false });
        const editor = new FakeEditor('');

        expect(service.handleEditorPaste(fakeClipboardEvent({ plain: 'https://example.com/page' }), editor.asEditor(), INFO)).toBe(false);
    });

    it('inserts the URL immediately and replaces it with a titled link', async () => {
        const { service } = build({ linkTitles: true, linkEnabled: false });
        const editor = new FakeEditor('');

        expect(service.handleEditorPaste(fakeClipboardEvent({ plain: 'https://example.com/page' }), editor.asEditor(), INFO)).toBe(true);
        expect(editor.getValue()).toBe('https://example.com/page');
        await settle();

        expect(editor.getValue()).toBe('[Example page](https://example.com/page)');
    });

    it('does not fetch a title inside an existing Markdown link destination', async () => {
        const { service, fetchedTitles } = build({ linkTitles: true });
        const prefix = '[Title](';
        const editor = new FakeEditor(`${prefix})`, prefix.length);

        expect(
            service.handleEditorPaste(fakeClipboardEvent({ plain: 'https://example.com/page?utm_source=news' }), editor.asEditor(), INFO)
        ).toBe(true);
        await settle();

        expect(editor.getValue()).toBe('[Title](https://example.com/page)');
        expect(fetchedTitles).toEqual([]);
    });

    it('does not use a selected Markdown link destination as a new link label', async () => {
        const { service, fetchedTitles } = build({ linkTitles: true });
        const editor = selecting('[Title](https://old.example)', 'https://old.example');

        service.handleEditorPaste(fakeClipboardEvent({ plain: 'https://example.com/page?utm_source=news' }), editor.asEditor(), INFO);
        await settle();

        expect(editor.getValue()).toBe('[Title](https://example.com/page)');
        expect(fetchedTitles).toEqual([]);
    });

    it('does not fetch a title inside a Markdown link through paste processed', async () => {
        const { service, fetchedTitles } = build({ linkTitles: true, linkEnabled: false });
        const prefix = '[Title](';
        const editor = new FakeEditor(`${prefix})`, prefix.length);
        vi.stubGlobal('navigator', { clipboard: { readText: async () => 'https://example.com/page' } });

        try {
            await service.pasteProcessed(editor.asEditor(), INFO);
            expect(editor.getValue()).toBe('[Title](https://example.com/page)');
            expect(fetchedTitles).toEqual([]);
        } finally {
            vi.unstubAllGlobals();
        }
    });

    it('removes the GitHub repository tail from a fetched pull request title', async () => {
        const url = 'https://github.com/obsidian-tasks-group/obsidian-tasks/pull/123';
        const title = 'Improve documentation · obsidian-tasks-group/obsidian-tasks · GitHub';
        const rule = String.raw`s| · [^·\]]+ · GitHub(?=\]\(https://github\.com/)||`;
        const { service } = build({ linkTitles: true, linkEnabled: false, urlSnippets: [urlSnippet(rule)] }, false, undefined, title);
        const editor = new FakeEditor('');

        service.handleEditorPaste(fakeClipboardEvent({ plain: url }), editor.asEditor(), INFO);
        await settle();

        expect(editor.getValue()).toBe(`[Improve documentation](${url})`);
    });

    it('shortens a pull request title only when its finished link points to GitHub', async () => {
        const title = 'Improve documentation by Clare Macrae · Pull Request #123 · obsidian-tasks-group/obsidian-tasks · GitHub';
        const rule = String.raw`s| by .+ · Pull Request #(\d+) · [^·\]]+ · GitHub(?=\]\(https://github\.com/)| (#$1)|`;
        const { service } = build({ linkTitles: true, linkEnabled: false, urlSnippets: [urlSnippet(rule)] }, false, undefined, title);
        const github = 'https://github.com/obsidian-tasks-group/obsidian-tasks/pull/123';
        const other = 'https://example.com/pull/123';
        const githubEditor = new FakeEditor('');
        const otherEditor = new FakeEditor('');

        service.handleEditorPaste(fakeClipboardEvent({ plain: github }), githubEditor.asEditor(), INFO);
        service.handleEditorPaste(fakeClipboardEvent({ plain: other }), otherEditor.asEditor(), INFO);
        await settle();

        expect(githubEditor.getValue()).toBe(`[Improve documentation (#123)](${github})`);
        expect(otherEditor.getValue()).toBe(`[${title}](${other})`);
    });

    it('truncates a long fetched title while keeping its tail', async () => {
        const url = 'https://x.com/firefox/status/1864357060860891158';
        const title = 'Firefox on X: Um apparently it is national cookie day? Our total cookie protection feature stops you / X';
        const rule = String.raw`s|^\[(.{30}).* (/ X)\]|[$1… $2]|`;
        const { service } = build({ linkTitles: true, linkEnabled: false, urlSnippets: [urlSnippet(rule)] }, false, undefined, title);
        const editor = new FakeEditor('');

        service.handleEditorPaste(fakeClipboardEvent({ plain: url }), editor.asEditor(), INFO);
        await settle();

        expect(editor.getValue()).toBe(`[Firefox on X: Um apparently it… / X](${url})`);
    });

    it('runs URL snippets on the escaped Markdown that reaches the note', async () => {
        const url = 'https://example.com/a(b)';
        const rule = String.raw`s/\\\[page\\\]/document/`;
        const { service } = build({ linkTitles: true, linkEnabled: false, urlSnippets: [urlSnippet(rule)] }, false, undefined, 'A [page]');
        const editor = new FakeEditor('');

        service.handleEditorPaste(fakeClipboardEvent({ plain: url }), editor.asEditor(), INFO);
        await settle();

        expect(editor.getValue()).toBe('[A document](https://example.com/a%28b%29)');
    });

    it('keeps a text snippet away from the fetched link', async () => {
        const snippet: TextSnippet = { id: 'plain', name: 'Plain', rules: ['s/Example/Changed/'], enabled: true };
        const { service } = build({ linkTitles: true, linkEnabled: false, textSnippets: [snippet] });
        const editor = new FakeEditor('');

        service.handleEditorPaste(fakeClipboardEvent({ plain: 'https://example.com/page' }), editor.asEditor(), INFO);
        await settle();

        expect(editor.getValue()).toBe('[Example page](https://example.com/page)');
    });

    it('keeps a disabled URL snippet away from the fetched link', async () => {
        const snippet: TextSnippet = { ...urlSnippet('s/Example/Changed/'), enabled: false };
        const { service } = build({ linkTitles: true, linkEnabled: false, urlSnippets: [snippet] });
        const editor = new FakeEditor('');

        service.handleEditorPaste(fakeClipboardEvent({ plain: 'https://example.com/page' }), editor.asEditor(), INFO);
        await settle();

        expect(editor.getValue()).toBe('[Example page](https://example.com/page)');
    });

    it('keeps a URL snippet away from ordinary pasted text', () => {
        const { service } = build({ linkTitles: false, linkEnabled: false, urlSnippets: [urlSnippet('s/GitHub - //')] });
        const editor = new FakeEditor('');
        const event = fakeClipboardEvent({ plain: 'GitHub - a phrase worth keeping' });

        // Declined, so Obsidian pastes the phrase untouched
        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(false);
        expect(editor.getValue()).toBe('');
    });

    it('keeps the unmodified titled link when a rule empties its label', async () => {
        const { service } = build({ linkTitles: true, linkEnabled: false, urlSnippets: [urlSnippet('s/Example page//')] });
        const editor = new FakeEditor('');

        service.handleEditorPaste(fakeClipboardEvent({ plain: 'https://example.com/page' }), editor.asEditor(), INFO);
        await settle();

        expect(editor.getValue()).toBe('[Example page](https://example.com/page)');
    });

    it('keeps the unmodified titled link when a rule deletes its wrapper', async () => {
        const rule = String.raw`s/^\[[^]]*\]//`;
        const { service } = build({ linkTitles: true, linkEnabled: false, urlSnippets: [urlSnippet(rule)] });
        const editor = new FakeEditor('');

        service.handleEditorPaste(fakeClipboardEvent({ plain: 'https://example.com/page' }), editor.asEditor(), INFO);
        await settle();

        expect(editor.getValue()).toBe('[Example page](https://example.com/page)');
    });

    it('keeps the unmodified titled link when a rule changes its destination', async () => {
        const { service } = build({ linkTitles: true, linkEnabled: false, urlSnippets: [urlSnippet('s/https:/http:/')] });
        const editor = new FakeEditor('');

        service.handleEditorPaste(fakeClipboardEvent({ plain: 'https://example.com/page' }), editor.asEditor(), INFO);
        await settle();

        expect(editor.getValue()).toBe('[Example page](https://example.com/page)');
    });

    it('keeps the unmodified titled link when a rule creates a multiline label', async () => {
        const rule = String.raw`s/x/y\n\n# Notes/`;
        const { service } = build({ linkTitles: true, linkEnabled: false, urlSnippets: [urlSnippet(rule)] });
        const editor = new FakeEditor('');

        service.handleEditorPaste(fakeClipboardEvent({ plain: 'https://example.com/page' }), editor.asEditor(), INFO);
        await settle();

        expect(editor.getValue()).toBe('[Example page](https://example.com/page)');
    });

    it('inserts the normal titled link when URL snippets leave the finished link unchanged', async () => {
        const { service } = build({ linkTitles: true, linkEnabled: false, urlSnippets: [urlSnippet('s/Not here/Gone/')] });
        const editor = new FakeEditor('');

        service.handleEditorPaste(fakeClipboardEvent({ plain: 'https://example.com/page' }), editor.asEditor(), INFO);
        await settle();

        expect(editor.getValue()).toBe('[Example page](https://example.com/page)');
    });

    it('fetches a title in a tab-indented nested list item', async () => {
        const { service } = build({ linkTitles: true, linkEnabled: false });
        const doc = '- item\n\t- ';
        const editor = new FakeEditor(doc, doc.length);

        expect(service.handleEditorPaste(fakeClipboardEvent({ plain: 'https://example.com/page' }), editor.asEditor(), INFO)).toBe(true);
        await settle();

        expect(editor.getValue()).toBe('- item\n\t- [Example page](https://example.com/page)');
    });

    it('shows title fetching progress and keeps the URL without running snippets when fetching fails', async () => {
        vi.useFakeTimers();
        const settings: BetterPasteSettings = {
            ...DEFAULT_SETTINGS,
            linkTitles: true,
            linkEnabled: false,
            urlSnippets: [urlSnippet('s/https:/broken:/')]
        };
        let finishTitleFetch: (result: { title: string; url: string } | null) => void = () => undefined;
        const titleResult = new Promise<{ title: string; url: string } | null>(resolve => {
            finishTitleFetch = resolve;
        });
        const titles = {
            hasWork: (text: string) => /^https?:\/\/\S+$/i.test(text),
            hasBatchWork: () => false,
            materializeTitle: () => titleResult,
            dispose: () => undefined
        } as unknown as LinkTitleService;
        const service = new PasteService(() => settings, fakeImages(settings), titles);
        const editor = new FakeEditor('');
        const noticeCount = Notice.instances.length;
        const url = 'https://example.com/page';

        try {
            service.handleEditorPaste(fakeClipboardEvent({ plain: url }), editor.asEditor(), INFO);

            expect(editor.getValue()).toBe(url);
            expect(Notice.instances).toHaveLength(noticeCount);

            await vi.advanceTimersByTimeAsync(500);
            expect(Notice.instances).toHaveLength(noticeCount + 1);
            const progress = Notice.instances[noticeCount];
            expect(progress.message).toBe('Better Paste: fetching title...');
            expect(progress.duration).toBe(0);
            expect(progress.hidden).toBe(false);

            finishTitleFetch(null);
            await titleResult;
            await Promise.resolve();

            expect(editor.getValue()).toBe(url);
            expect(progress.hidden).toBe(true);
            expect(Notice.instances).toHaveLength(noticeCount + 2);
            expect(Notice.instances[noticeCount + 1].message).toBe('Better Paste: could not fetch the title.');
        } finally {
            service.dispose();
            vi.useRealTimers();
        }
    });

    it('never shows the progress notice when the title arrives quickly', async () => {
        const { service } = build({ linkTitles: true, linkEnabled: false });
        const editor = new FakeEditor('');
        const noticeCount = Notice.instances.length;

        service.handleEditorPaste(fakeClipboardEvent({ plain: 'https://example.com/page' }), editor.asEditor(), INFO);
        await settle();

        expect(editor.getValue()).toBe('[Example page](https://example.com/page)');
        const messages = Notice.instances.slice(noticeCount).map(notice => notice.message);
        expect(messages.some(message => message.includes('fetching title'))).toBe(false);
    });

    it('uses selected text as the link label without fetching a title or running URL snippets', async () => {
        const { service, fetchedTitles } = build({
            linkTitles: true,
            linkEnabled: false,
            urlSnippets: [urlSnippet('s/documentation/changed/')]
        });
        const editor = selecting('Read the documentation next', 'documentation');
        const url = 'https://example.com/page';

        expect(service.handleEditorPaste(fakeClipboardEvent({ plain: url }), editor.asEditor(), INFO)).toBe(true);
        expect(editor.getValue()).toBe(`Read the [documentation](${url}) next`);
        await settle();

        expect(fetchedTitles).toEqual([]);
    });

    it('keeps a URL extension typed while its title is being fetched', async () => {
        const settings: BetterPasteSettings = { ...DEFAULT_SETTINGS, linkTitles: true, linkEnabled: false };
        let finishTitleFetch: (result: { title: string; url: string }) => void = () => undefined;
        const titleResult = new Promise<{ title: string; url: string }>(resolve => {
            finishTitleFetch = resolve;
        });
        const titles = {
            hasWork: (text: string) => /^https?:\/\/\S+$/i.test(text),
            hasBatchWork: () => false,
            materializeTitle: () => titleResult,
            dispose: () => undefined
        } as unknown as LinkTitleService;
        const service = new PasteService(() => settings, fakeImages(settings), titles);
        const editor = new FakeEditor('');
        const url = 'https://example.com/page';

        service.handleEditorPaste(fakeClipboardEvent({ plain: url }), editor.asEditor(), INFO);
        editor.replaceSelection('/docs');
        finishTitleFetch({ title: 'Example page', url });
        await titleResult;
        await settle();

        expect(editor.getValue()).toBe(`${url}/docs`);
    });

    it('fetches a title when the selection is the pasted URL itself', async () => {
        const { service, fetchedTitles } = build({ linkTitles: true, linkEnabled: false });
        const url = 'https://example.com/page';
        const editor = selecting(url, url);

        service.handleEditorPaste(fakeClipboardEvent({ plain: url }), editor.asEditor(), INFO);
        await settle();

        expect(editor.getValue()).toBe(`[Example page](${url})`);
        expect(fetchedTitles).toEqual([url]);
    });

    it('finds the pasted URL after the user continues typing beside an older copy', async () => {
        const { service } = build({ linkTitles: true, linkEnabled: false });
        const url = 'https://example.com/page';
        const editor = new FakeEditor(`${url}\n`);

        service.handleEditorPaste(fakeClipboardEvent({ plain: url }), editor.asEditor(), INFO);
        editor.replaceSelection(' notes');
        await settle();

        expect(editor.getValue()).toBe(`${url}\n[Example page](${url}) notes`);
    });

    it('fetches the title for the cleaned address', async () => {
        const { service } = build({ linkTitles: true });
        const editor = new FakeEditor('');

        service.handleEditorPaste(fakeClipboardEvent({ plain: 'https://example.com/page?utm_source=news' }), editor.asEditor(), INFO);
        await settle();

        expect(editor.getValue()).toBe('[Example page](https://example.com/page)');
    });

    it('does not fetch a title for prose containing a URL', () => {
        const { service } = build({ linkTitles: true, linkEnabled: false, textTrim: false });
        const editor = new FakeEditor('');

        expect(service.handleEditorPaste(fakeClipboardEvent({ plain: 'See https://example.com/page' }), editor.asEditor(), INFO)).toBe(
            false
        );
    });

    it('leaves an image URL to image handling', async () => {
        const { service } = build({ linkTitles: true });
        const editor = new FakeEditor('');

        service.handleEditorPaste(fakeClipboardEvent({ plain: 'https://example.com/cat.png' }), editor.asEditor(), INFO);
        await settle();

        expect(editor.getValue()).toBe('![[image-0.png]]');
    });
});

describe('handleEditorPaste: rich content', () => {
    /** Runs the rich path the way Obsidian does: our handler first, then the native insert. */
    async function pasteRich(service: PasteService, editor: FakeEditor, html: string, converted: string): Promise<void> {
        const handled = service.handleEditorPaste(fakeClipboardEvent({ html, plain: '' }), editor.asEditor(), INFO);
        expect(handled).toBe(false);
        editor.replaceSelection(converted);
        await settle();
    }

    const RICH_HTML = '<p>text</p><img src="https://example.com/a.png"><a href="https://example.com/b?utm_source=x">link</a>';

    it('cleans URLs and downloads images in the range Obsidian inserted', async () => {
        const { service } = build();
        const editor = new FakeEditor('');

        await pasteRich(service, editor, RICH_HTML, 'text ![](https://example.com/a.png) [link](https://example.com/b?utm_source=x)');

        expect(editor.getValue()).toBe('text ![[image-0.png]] [link](https://example.com/b)');
    });

    it('continues converted rich content inside a block quote', async () => {
        const { service } = build();
        const editor = new FakeEditor('> ');
        const html = '<h3>Fixed</h3><ul><li>Fixed <strong>bold text</strong></li></ul>';

        await pasteRich(service, editor, html, '### Fixed\n\n- Fixed **bold text**');

        expect(editor.getValue()).toBe('> ### Fixed\n>\n> - Fixed **bold text**');
    });

    it('leaves converted rich content unquoted when quote continuation is off', async () => {
        const { service } = build({
            quoteContinuation: false,
            textInvisible: false,
            textQuotes: false,
            textDashes: false,
            linkEnabled: false,
            imageMode: 'off'
        });
        const editor = new FakeEditor('> ');

        await pasteRich(service, editor, '<p>First</p><p>Second</p>', 'First\n\nSecond');

        expect(editor.getValue()).toBe('> First\n\nSecond');
    });

    it('only touches the pasted range, leaving surrounding text alone', async () => {
        const { service } = build();
        const existing = 'before https://example.com/keep?utm_source=x after\n\n';
        const editor = new FakeEditor(existing);

        await pasteRich(service, editor, RICH_HTML, '[link](https://example.com/b?utm_source=x)');

        expect(editor.getValue()).toBe(`${existing}[link](https://example.com/b)`);
    });

    it('replaces the selection the paste overwrote', async () => {
        const { service } = build();
        const editor = selecting('start OLD end', 'OLD');

        await pasteRich(service, editor, RICH_HTML, '[link](https://example.com/b?utm_source=x)');

        expect(editor.getValue()).toBe('start [link](https://example.com/b) end');
    });

    it('abandons the edit when the pasted text is gone', async () => {
        const { service } = build();
        const editor = new FakeEditor('');

        const handled = service.handleEditorPaste(fakeClipboardEvent({ html: RICH_HTML, plain: '' }), editor.asEditor(), INFO);
        expect(handled).toBe(false);
        editor.replaceSelection('![](https://example.com/a.png)');

        // The user undoes the paste and types something else before the download finishes
        editor.replaceRange('unrelated', { line: 0, ch: 0 }, { line: 0, ch: 30 });
        await settle();

        expect(editor.getValue()).toBe('unrelated');
    });

    it('does no work when the rich-content rules are off', async () => {
        const { service } = build({ linkEnabled: false, imageMode: 'off', quoteContinuation: false });
        const editor = new FakeEditor('');

        await pasteRich(service, editor, RICH_HTML, '[link](https://example.com/b?utm_source=x)');

        expect(editor.getValue()).toBe('[link](https://example.com/b?utm_source=x)');
    });

    it('still cleans AI typography when the other rich-content rules are off', async () => {
        const { service } = build({ linkEnabled: false, imageMode: 'off', textQuotes: true });
        const editor = new FakeEditor('');

        await pasteRich(service, editor, '<p>quoted</p>', '“quoted”');

        expect(editor.getValue()).toBe('"quoted"');
    });

    it('applies text processing to rich content when the other rules are off', async () => {
        const { service } = build({
            textInvisible: false,
            linkEnabled: false,
            imageMode: 'off',
            textQuotes: true
        });
        const editor = new FakeEditor('');

        await pasteRich(service, editor, '<p>curly</p>', 'He called it “finished” then left.');

        expect(editor.getValue()).toBe('He called it "finished" then left.');
    });

    it('applies custom snippets to rich browser content', async () => {
        const { service } = build({
            textInvisible: false,
            linkEnabled: false,
            imageMode: 'off',
            textSnippets: [
                {
                    id: 'citations',
                    name: 'Remove Perplexity citations',
                    rules: [String.raw`s/\[\d+\]//g`],
                    enabled: true
                }
            ]
        });
        const editor = new FakeEditor('');

        await pasteRich(service, editor, '<p>Answer [1]</p>', 'Answer [1]');

        expect(editor.getValue()).toBe('Answer ');
    });
});

describe('surviving an edit during the image write', () => {
    const SAFARI_HTML = '<img src="https://example.com/photo.webp">';

    it('does not overwrite text the user typed while the image was saving', async () => {
        const { service } = build();
        const editor = new FakeEditor('');
        const event = fakeClipboardEvent({ html: SAFARI_HTML, files: [fakeFile('image.png', 'image/png')] });

        service.handleEditorPaste(event, editor.asEditor(), INFO);
        // The vault write is in flight; the user keeps typing
        editor.replaceSelection('typed while waiting');
        await settle();

        expect(editor.getValue()).toContain('typed while waiting');
        expect(editor.getValue()).toContain('photo.png');
    });

    it('does not trust stale offsets after an equal-length edit', async () => {
        const { service } = build();
        const editor = selecting('OLD', 'OLD');
        const event = fakeClipboardEvent({ html: SAFARI_HTML, files: [fakeFile('image.png', 'image/png')] });

        service.handleEditorPaste(event, editor.asEditor(), INFO);
        editor.replaceRange('NEW', { line: 0, ch: 0 }, { line: 0, ch: 3 });
        await settle();

        expect(editor.getValue()).toBe('NEW![[photo.png]]');
    });

    it('stops touching the editor once the plugin is unloaded', async () => {
        const { service } = build();
        const editor = new FakeEditor('');
        const event = fakeClipboardEvent({ html: SAFARI_HTML, files: [fakeFile('image.png', 'image/png')] });

        service.handleEditorPaste(event, editor.asEditor(), INFO);
        service.dispose();
        await settle();

        expect(editor.getValue()).toBe('');
    });

    it('does not insert a clipboard image after the view switches notes', async () => {
        const { service } = build();
        const editor = new FakeEditor('');
        const originalFile = { path: 'Notes/Original.md' };
        let currentFile = originalFile;
        const info = {
            get file() {
                return currentFile;
            }
        } as unknown as MarkdownView | MarkdownFileInfo;

        service.handleEditorPaste(
            fakeClipboardEvent({ html: SAFARI_HTML, files: [fakeFile('image.png', 'image/png')] }),
            editor.asEditor(),
            info
        );
        currentFile = { path: 'Notes/Other.md' };
        await settle();

        expect(editor.getValue()).toBe('');
    });

    it('does not finish a URL replacement once the plugin is unloaded', async () => {
        const { service } = build();
        const editor = new FakeEditor('');

        service.handleEditorPaste(fakeClipboardEvent({ plain: 'https://example.com/cat.png' }), editor.asEditor(), INFO);
        service.dispose();
        await settle();

        expect(editor.getValue()).toBe('https://example.com/cat.png');
    });

    it('does not replace an older identical URL after the new paste is removed', async () => {
        const { service } = build();
        const url = 'https://example.com/cat.png';
        const existing = `${url}\n`;
        const editor = new FakeEditor(existing);

        service.handleEditorPaste(fakeClipboardEvent({ plain: url }), editor.asEditor(), INFO);
        editor.replaceRange('', editor.offsetToPos(existing.length), editor.offsetToPos(existing.length + url.length));
        await settle();

        expect(editor.getValue()).toBe(existing);
    });
});

describe('a second paste while the first is still downloading', () => {
    /** Image service double whose downloads complete only when the test says so. */
    function deferredImages(settings: BetterPasteSettings) {
        const pending: Array<() => void> = [];
        const images = {
            hasWork: (text: string) => settings.imageMode !== 'off' && findImageReferences(text).length > 0,
            materializeImages: (text: string) =>
                new Promise(resolve => {
                    pending.push(() => {
                        const references = findImageReferences(text);
                        const embeds = new Map(references.map((reference, index) => [reference.index, `![[image-${index}.png]]`]));
                        resolve({ text: replaceImageReferences(text, references, embeds), downloaded: embeds.size, failed: 0 });
                    });
                }),
            saveClipboardImage: async () => null,
            dispose: () => undefined
        } as unknown as ImageService;
        return { images, pending };
    }

    /** Flushes microtasks only, so queued timers do not fire. */
    async function flushMicrotasks(): Promise<void> {
        for (let i = 0; i < 20; i++) await Promise.resolve();
    }

    const URL = 'https://example.com/cat.png';

    it('rewrites both pastes when the second lands earlier in the note', async () => {
        const settings: BetterPasteSettings = { ...DEFAULT_SETTINGS, imageMode: 'download' };
        const { images, pending } = deferredImages(settings);
        const service = new PasteService(() => settings, images, fakeTitles(settings, []));
        const doc = 'top\n\nbottom\n';
        const editor = new FakeEditor(doc, doc.length);

        service.handleEditorPaste(fakeClipboardEvent({ plain: URL }), editor.asEditor(), INFO);
        await flushMicrotasks();
        // The user clicks onto the empty line above and pastes the same URL again
        editor.setSelection(4, 4);
        service.handleEditorPaste(fakeClipboardEvent({ plain: URL }), editor.asEditor(), INFO);
        await flushMicrotasks();

        // The first paste's download completes first, below the newly inserted text
        pending[0]();
        await settle();
        pending[1]();
        await settle();

        expect(editor.getValue()).toBe('top\n![[image-0.png]]\nbottom\n![[image-0.png]]');
    });

    it('skips the rich measurement when a pending rewrite lands inside its timer window', async () => {
        const settings: BetterPasteSettings = { ...DEFAULT_SETTINGS };
        const { images, pending } = deferredImages(settings);
        const service = new PasteService(() => settings, images, fakeTitles(settings, []));
        const editor = new FakeEditor('');

        service.handleEditorPaste(fakeClipboardEvent({ plain: URL }), editor.asEditor(), INFO);
        await flushMicrotasks();
        editor.replaceSelection('\n');

        // A rich paste is declined to Obsidian, which inserts the converted Markdown
        const converted = '[link](https://example.com/b?utm_source=x) text';
        service.handleEditorPaste(
            fakeClipboardEvent({ html: '<p>x</p><a href="https://example.com/b">link</a>' }),
            editor.asEditor(),
            INFO
        );
        editor.replaceSelection(converted);

        // The first download completes before the measurement timer fires, shifting the
        // baseline. The rich pass must skip rather than process a mis-measured range.
        pending[0]();
        await flushMicrotasks();
        await settle();

        expect(editor.getValue()).toBe(`![[image-0.png]]\n${converted}`);
    });
});

describe('explicit paste commands', () => {
    it('uses the invocation selection as a URL label without fetching a title', async () => {
        const { service, fetchedTitles } = build({ linkTitles: true, linkEnabled: false });
        const editor = selecting('Read the documentation next', 'documentation');
        const url = 'https://example.com/page';
        vi.stubGlobal('navigator', { clipboard: { readText: async () => url } });

        try {
            await service.pasteProcessed(editor.asEditor(), INFO);
            expect(editor.getValue()).toBe(`Read the [documentation](${url}) next`);
            expect(fetchedTitles).toEqual([]);
        } finally {
            vi.unstubAllGlobals();
        }
    });

    it('does not paste after the service is disposed during a clipboard read', async () => {
        const { service } = build();
        const editor = new FakeEditor('unchanged');
        let finishRead: (text: string) => void = () => undefined;
        const clipboardText = new Promise<string>(resolve => {
            finishRead = resolve;
        });
        vi.stubGlobal('navigator', { clipboard: { readText: () => clipboardText } });

        try {
            const paste = service.pasteRaw(editor.asEditor(), INFO);
            service.dispose();
            finishRead('new text');
            await paste;
            expect(editor.getValue()).toBe('unchanged');
        } finally {
            vi.unstubAllGlobals();
        }
    });

    it('does not delete a selection made while clipboard permission is pending', async () => {
        const { service } = build();
        const editor = selecting('start OLD keep', 'OLD');
        let finishRead: (text: string) => void = () => undefined;
        const clipboardText = new Promise<string>(resolve => {
            finishRead = resolve;
        });
        vi.stubGlobal('navigator', { clipboard: { readText: () => clipboardText } });

        try {
            const paste = service.pasteRaw(editor.asEditor(), INFO);
            editor.setSelection('start OLD '.length, 'start OLD keep'.length);
            finishRead('NEW');
            await paste;
            expect(editor.getValue()).toBe('start NEW keep');
        } finally {
            vi.unstubAllGlobals();
        }
    });
});

describe('leaving a paste alone', () => {
    const TRACKED = 'https://example.com/a?utm_source=x';

    it('skips a note that opts out with the disable property', () => {
        const { service } = build();
        const editor = new FakeEditor('---\nbp: false\n---\n\n');

        expect(service.handleEditorPaste(fakeClipboardEvent({ plain: TRACKED }), editor.asEditor(), INFO)).toBe(false);
        expect(editor.getValue()).toBe('---\nbp: false\n---\n\n');
    });

    it('still processes a note whose property says yes', () => {
        const { service } = build();
        const editor = new FakeEditor('---\nbp: true\n---\n\n');

        expect(service.handleEditorPaste(fakeClipboardEvent({ plain: TRACKED }), editor.asEditor(), INFO)).toBe(true);
        expect(editor.getValue()).toBe('---\nbp: true\n---\n\nhttps://example.com/a');
    });

    it('cleans a note that opts in while automatic cleanup is off', () => {
        // The property overrides the global setting in both directions, so this is the one
        // case where a note is cleaned even though nothing else is
        const { service } = build({ autoClean: false });
        const editor = new FakeEditor('---\nbp: true\n---\n\n');

        expect(service.handleEditorPaste(fakeClipboardEvent({ plain: TRACKED }), editor.asEditor(), INFO)).toBe(true);
        expect(editor.getValue()).toBe('---\nbp: true\n---\n\nhttps://example.com/a');
    });

    it('does not let a note opt in to pasting inside a code fence', () => {
        // Opting in overrides the global setting, not the protection of code
        const { service } = build({ autoClean: false });
        const content = '---\nbp: true\n---\n\n```sh\n';
        const editor = new FakeEditor(content);

        expect(service.handleEditorPaste(fakeClipboardEvent({ plain: TRACKED }), editor.asEditor(), INFO)).toBe(false);
        expect(editor.getValue()).toBe(content);
    });

    it('skips a paste landing inside a code fence', () => {
        // Pasting terminal output into a fence is an act of preservation; rejoining its
        // lines there would destroy the thing being preserved
        const { service } = build();
        const editor = new FakeEditor('Notes\n\n```sh\n');

        expect(service.handleEditorPaste(fakeClipboardEvent({ plain: TRACKED }), editor.asEditor(), INFO)).toBe(false);
        expect(editor.getValue()).toBe('Notes\n\n```sh\n');
    });

    it('skips a paste landing inside a code fence in a callout', () => {
        const { service } = build();
        const content = '> [!note]\n> ```text\n> ';
        const editor = new FakeEditor(content);

        expect(service.handleEditorPaste(fakeClipboardEvent({ plain: TRACKED }), editor.asEditor(), INFO)).toBe(false);
        expect(editor.getValue()).toBe(content);
    });

    it('skips a URL paste inside inline code', async () => {
        const { service, fetchedTitles } = build({ linkTitles: true, linkEnabled: false, textTrim: false });
        const url = 'https://example.com/page';
        const editor = new FakeEditor('Use ``', 'Use `'.length);

        const handled = service.handleEditorPaste(fakeClipboardEvent({ plain: url }), editor.asEditor(), INFO);
        if (!handled) editor.replaceSelection(url);
        await settle();

        expect(handled).toBe(false);
        expect(editor.getValue()).toBe(`Use \`${url}\``);
        expect(fetchedTitles).toEqual([]);
    });

    it('skips a URL paste on an indented code line', async () => {
        const { service, fetchedTitles } = build({ linkTitles: true, linkEnabled: false, textTrim: false });
        const url = 'https://example.com/page';
        const editor = new FakeEditor('    ');

        const handled = service.handleEditorPaste(fakeClipboardEvent({ plain: url }), editor.asEditor(), INFO);
        if (!handled) editor.replaceSelection(url);
        await settle();

        expect(handled).toBe(false);
        expect(editor.getValue()).toBe(`    ${url}`);
        expect(fetchedTitles).toEqual([]);
    });

    it('processes again once the fence has closed', () => {
        const { service } = build();
        const editor = new FakeEditor('Notes\n\n```sh\nls\n```\n\n');

        expect(service.handleEditorPaste(fakeClipboardEvent({ plain: TRACKED }), editor.asEditor(), INFO)).toBe(true);
    });

    it('skips a paste inside the frontmatter block', () => {
        const { service } = build();
        const editor = new FakeEditor('---\ntitle: ', '---\ntitle: '.length);
        // The note closes its block further down, past the cursor
        const withBody = new FakeEditor('---\ntitle: \n---\n\nBody', '---\ntitle: '.length);

        expect(service.handleEditorPaste(fakeClipboardEvent({ plain: TRACKED }), withBody.asEditor(), INFO)).toBe(false);
        expect(service.handleEditorPaste(fakeClipboardEvent({ plain: TRACKED }), editor.asEditor(), INFO)).toBe(true);
    });

    it('does not leave a disabled note alone when the command is used explicitly', () => {
        // An explicit command means the user asked for the rules by name, so the property
        // must not suppress it. The selection is real, or this would pass vacuously.
        const { service } = build();
        const document = '---\nbp: false\n---\n\nhttps://example.com/a?utm_source=x';
        const editor = selecting(document, 'https://example.com/a?utm_source=x');

        service.cleanSelection(editor.asEditor());
        expect(editor.getValue()).toBe('---\nbp: false\n---\n\nhttps://example.com/a');
    });
});

describe('cleanSelection', () => {
    it('cleans the selected text in place', () => {
        const { service } = build();
        const editor = selecting('keep https://example.com/a?utm_source=x keep', 'https://example.com/a?utm_source=x');

        service.cleanSelection(editor.asEditor());
        expect(editor.getValue()).toBe('keep https://example.com/a keep');
    });

    it('leaves the document alone when there is no selection', () => {
        const { service } = build();
        const editor = new FakeEditor('unchanged', 0, 0);

        service.cleanSelection(editor.asEditor());
        expect(editor.getValue()).toBe('unchanged');
    });
});

describe('runSnippet', () => {
    it('runs a disabled snippet against the selected text', () => {
        const { service } = build();
        const editor = selecting('keep cat here', 'cat');

        service.runSnippet(editor.asEditor(), {
            id: 'rename-cat',
            name: 'Rename cat',
            rules: ['s/cat/dog/g'],
            enabled: false
        });

        expect(editor.getValue()).toBe('keep dog here');
    });

    it('rewrites a selected link label without allowing its destination to change', () => {
        const { service } = build();
        const source = '[A \\[page\\]](https://example.com/a%28b%29)';
        const labelEditor = selecting(source, source);
        const destinationEditor = selecting(source, source);

        service.runSnippet(
            labelEditor.asEditor(),
            {
                id: 'rename-page',
                name: 'Rename page',
                rules: [String.raw`s/\\\[page\\\]/document/`],
                enabled: true
            },
            true
        );
        service.runSnippet(
            destinationEditor.asEditor(),
            {
                id: 'change-protocol',
                name: 'Change protocol',
                rules: ['s/https:/http:/'],
                enabled: true
            },
            true
        );

        expect(labelEditor.getValue()).toBe('[A document](https://example.com/a%28b%29)');
        expect(destinationEditor.getValue()).toBe(source);
    });

    it('refuses multiple selections before replacing text', () => {
        const { service } = build();
        const editor = selecting('cat\nbird', 'cat');
        vi.spyOn(editor, 'listSelections').mockReturnValue([
            { anchor: { line: 0, ch: 0 }, head: { line: 0, ch: 3 } },
            { anchor: { line: 1, ch: 0 }, head: { line: 1, ch: 4 } }
        ]);
        const replaceSelection = vi.spyOn(editor, 'replaceSelection');
        const noticeCount = Notice.instances.length;

        service.runSnippet(editor.asEditor(), {
            id: 'rename-cat',
            name: 'Rename cat',
            rules: ['s/cat/dog/g'],
            enabled: true
        });

        expect(replaceSelection).not.toHaveBeenCalled();
        expect(editor.getValue()).toBe('cat\nbird');
        expect(Notice.instances).toHaveLength(noticeCount + 1);
        expect(Notice.instances[noticeCount].message).toBe('Better Paste: select some text first');
    });
});

describe('handleEditorPaste: image URL in frontmatter', () => {
    const URL = 'https://example.com/pic.png';
    const urlEvent = (): ClipboardEvent => fakeClipboardEvent({ plain: URL });

    it('saves the image and writes a quoted plain wikilink', async () => {
        const { service } = build();
        const doc = '---\ncover: \n---\n\nBody';
        const editor = new FakeEditor(doc, '---\ncover: '.length);

        expect(service.handleEditorPaste(urlEvent(), editor.asEditor(), INFO)).toBe(true);
        expect(editor.getValue()).toBe(`---\ncover: ${URL}\n---\n\nBody`);
        await settle();

        expect(editor.getValue()).toBe('---\ncover: "[[image-0.png]]"\n---\n\nBody');
    });

    it('fills a sequence item under a property', async () => {
        const { service } = build();
        const doc = '---\ncovers:\n  - \n---\n';
        const editor = new FakeEditor(doc, '---\ncovers:\n  - '.length);

        expect(service.handleEditorPaste(urlEvent(), editor.asEditor(), INFO)).toBe(true);
        await settle();

        expect(editor.getValue()).toBe('---\ncovers:\n  - "[[image-0.png]]"\n---\n');
    });

    it('replaces a selected existing value', async () => {
        const { service } = build();
        const editor = selecting('---\ncover: https://old.example.com/old.png\n---\n', 'https://old.example.com/old.png');

        expect(service.handleEditorPaste(urlEvent(), editor.asEditor(), INFO)).toBe(true);
        await settle();

        expect(editor.getValue()).toBe('---\ncover: "[[image-0.png]]"\n---\n');
    });

    it('keeps the address when the download fails', async () => {
        const { service } = build({}, true);
        const doc = '---\ncover: \n---\n';
        const editor = new FakeEditor(doc, '---\ncover: '.length);
        const noticeCount = Notice.instances.length;

        expect(service.handleEditorPaste(urlEvent(), editor.asEditor(), INFO)).toBe(true);
        await settle();

        expect(editor.getValue()).toBe(`---\ncover: ${URL}\n---\n`);
        expect(Notice.instances[noticeCount].message).toBe('Better Paste: 1 image could not be saved, the original link was kept');
    });

    it('keeps the address and discards the file when the user typed in the slot during the download', async () => {
        const settings: BetterPasteSettings = { ...DEFAULT_SETTINGS, imageMode: 'download' };
        let finishDownload: (result: unknown) => void = () => undefined;
        const discarded: unknown[] = [];
        const images = {
            hasWork: () => true,
            materializeImages: () =>
                new Promise(resolve => {
                    finishDownload = resolve;
                }),
            propertyLink: (file: { path: string }) => `"[[${file.path}]]"`,
            discardFiles: async (files: unknown[]) => {
                discarded.push(...files);
            },
            dispose: () => undefined
        } as unknown as ImageService;
        const service = new PasteService(() => settings, images, fakeTitles(settings, []));
        const doc = '---\ncover: \n---\n';
        const editor = new FakeEditor(doc, '---\ncover: '.length);

        expect(service.handleEditorPaste(fakeClipboardEvent({ plain: URL }), editor.asEditor(), INFO)).toBe(true);
        editor.replaceSelection(' caption');
        finishDownload({ text: '![[image-0.png]]', downloaded: 1, failed: 0, files: [{ path: 'image-0.png' }] });
        await settle();

        expect(editor.getValue()).toBe(`---\ncover: ${URL} caption\n---\n`);
        expect(discarded).toEqual([{ path: 'image-0.png' }]);
    });

    it('stays native in the middle of an existing value', () => {
        const { service } = build();
        const doc = '---\ncover: existing value\n---\n';
        const editor = new FakeEditor(doc, '---\ncover: existing'.length);

        expect(service.handleEditorPaste(urlEvent(), editor.asEditor(), INFO)).toBe(false);
        expect(editor.getValue()).toBe(doc);
    });

    it('stays native for a URL that is not an image', () => {
        const { service } = build();
        const doc = '---\ncover: \n---\n';
        const editor = new FakeEditor(doc, '---\ncover: '.length);

        expect(service.handleEditorPaste(fakeClipboardEvent({ plain: 'https://example.com/page' }), editor.asEditor(), INFO)).toBe(false);
        expect(editor.getValue()).toBe(doc);
    });

    it('stays native when image saving is off', () => {
        const { service } = build({ imageMode: 'off' });
        const doc = '---\ncover: \n---\n';
        const editor = new FakeEditor(doc, '---\ncover: '.length);

        expect(service.handleEditorPaste(urlEvent(), editor.asEditor(), INFO)).toBe(false);
    });

    it('stays native when the note opts out', () => {
        const { service } = build();
        const doc = '---\nbp: false\ncover: \n---\n';
        const editor = new FakeEditor(doc, '---\nbp: false\ncover: '.length);

        expect(service.handleEditorPaste(urlEvent(), editor.asEditor(), INFO)).toBe(false);
    });

    it('stays native on the frontmatter delimiter lines', () => {
        const { service } = build();
        const doc = '---\ncover: \n---\n';
        const editor = new FakeEditor(doc, doc.indexOf('\n'));

        expect(service.handleEditorPaste(urlEvent(), editor.asEditor(), INFO)).toBe(false);
    });
});
