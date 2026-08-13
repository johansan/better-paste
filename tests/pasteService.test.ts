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
import { PasteService } from '../src/paste/PasteService';
import type { ImageService } from '../src/paste/ImageService';
import type { LinkTitleService } from '../src/paste/LinkTitleService';
import { findImageReferences, replaceImageReferences } from '../src/paste/imageReferences';
import { DEFAULT_SETTINGS } from '../src/settings/defaults';
import type { BetterPasteSettings } from '../src/settings/types';
import { FakeEditor, fakeClipboardEvent, fakeFile } from './stubs/editor';
import type { MarkdownFileInfo, MarkdownView } from 'obsidian';

const INFO = { file: { path: 'Notes/Test.md' } } as unknown as MarkdownView | MarkdownFileInfo;

/** Records what the paste handler asked the image service to save. */
interface SavedClipboardImages {
    file: File;
    source: string;
    sourcePath: string;
    size: string | null;
}

/** Image service double that resolves every reference to a predictable embed. */
function fakeImages(settings: BetterPasteSettings, failing = false, saved?: SavedClipboardImages[]): ImageService {
    return {
        hasWork: (text: string) => settings.imagesEnabled && findImageReferences(text, settings).length > 0,
        materializeImages: async (text: string, _sourcePath: string, size: string | null = null) => {
            const references = findImageReferences(text, settings);
            if (failing) return { text, downloaded: 0, failed: references.length };
            const suffix = size ? `|${size}` : '';
            const embeds = new Map(references.map((reference, index) => [reference.index, `![[image-${index}.png${suffix}]]`]));
            return { text: replaceImageReferences(text, references, embeds), downloaded: embeds.size, failed: 0 };
        },
        saveClipboardImage: async (file: File, source: string, sourcePath: string, size: string | null = null) => {
            saved?.push({ file, source, sourcePath, size });
            if (failing) return null;
            // Name the saved file after the source picture, as the real service does
            const base = source ? (source.split('/').pop() ?? file.name).replace(/\.[a-z0-9]+$/i, '') : file.name;
            return `![[${base}.png${size ? `|${size}` : ''}]]`;
        },
        dispose: () => undefined
    } as unknown as ImageService;
}

/** Title service double that resolves a standalone web address to a predictable link. */
function fakeTitles(settings: BetterPasteSettings): LinkTitleService {
    const hasWork = (text: string): boolean =>
        settings.fetchLinkTitles &&
        /^https?:\/\/\S+$/i.test(text) &&
        !/\.(?:png|jpe?g|gif|webp|svg|avif|bmp|heic|tiff|ico)(?:[?#]|$)/i.test(text);

    return {
        hasWork,
        materializeTitle: async (text: string) => (hasWork(text) ? `[Example page](${text})` : null),
        dispose: () => undefined
    } as unknown as LinkTitleService;
}

function build(overrides: Partial<BetterPasteSettings> = {}, failing = false) {
    const settings: BetterPasteSettings = { ...DEFAULT_SETTINGS, showNotices: false, ...overrides };
    const saved: SavedClipboardImages[] = [];
    const service = new PasteService(() => settings, fakeImages(settings, failing, saved), fakeTitles(settings));
    return { settings, service, saved };
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
        const { service } = build();
        const editor = selecting('start OLD end', 'OLD');
        const event = fakeClipboardEvent({ plain: 'https://example.com/a?utm_source=x' });

        service.handleEditorPaste(event, editor.asEditor(), INFO);
        expect(editor.getValue()).toBe('start https://example.com/a end');
    });

    it('unwraps terminal output on paste', () => {
        const { service } = build();
        const editor = new FakeEditor('');
        const plain = [
            '• A bullet line that is comfortably past the sixty character wrap threshold and',
            '  continues on the next line.'
        ].join('\n');

        service.handleEditorPaste(fakeClipboardEvent({ plain }), editor.asEditor(), INFO);
        expect(editor.getValue()).toBe(
            '• A bullet line that is comfortably past the sixty character wrap threshold and continues on the next line.'
        );
    });

    it('does nothing when automatic processing is off', () => {
        const { service } = build({ interceptPaste: false });
        const editor = new FakeEditor('');
        const event = fakeClipboardEvent({ plain: 'https://example.com/a?utm_source=x' });

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(false);
        expect(editor.getValue()).toBe('');
    });

    it('leaves bitmap clipboard data to Obsidian', () => {
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
        expect(saved[0].sourcePath).toBe('Notes/Test.md');
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
        const { service } = build({}, true);
        const editor = new FakeEditor('');

        service.handleEditorPaste(safariEvent(), editor.asEditor(), INFO);
        await settle();
        expect(editor.getValue()).toBe('![](https://www.tokentek.ai/_astro/gaia-2026-talk.J2oaR4rx_sdIoa.webp)');
    });

    it('leaves a plain bitmap paste with no HTML to Obsidian', () => {
        const { service } = build();
        const editor = new FakeEditor('');
        const event = fakeClipboardEvent({ files: [fakeFile('image.png', 'image/png')] });

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(false);
        expect(editor.getValue()).toBe('');
    });

    it('leaves a non-image file paste to Obsidian', () => {
        const { service } = build();
        const editor = new FakeEditor('');
        const event = fakeClipboardEvent({ html: '<p>a note</p>', files: [fakeFile('notes.pdf', 'application/pdf')] });

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(false);
    });

    it('leaves the paste alone when image handling is off', () => {
        const { service } = build({ imagesEnabled: false });
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

    it('leaves a screenshot to Obsidian when the note asks for no width', () => {
        const { service } = build();
        const editor = new FakeEditor('---\ntitle: Notes\n---\n\n');
        const event = fakeClipboardEvent({ files: [fakeFile('image.png', 'image/png')] });

        expect(service.handleEditorPaste(event, editor.asEditor(), INFO)).toBe(false);
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

describe('handleEditorPaste: link titles', () => {
    it('leaves a standalone URL to Obsidian when title fetching is off', () => {
        const { service } = build({ fetchLinkTitles: false, urlEnabled: false, trimPaste: false });
        const editor = new FakeEditor('');

        expect(service.handleEditorPaste(fakeClipboardEvent({ plain: 'https://example.com/page' }), editor.asEditor(), INFO)).toBe(false);
    });

    it('inserts the URL immediately and replaces it with a titled link', async () => {
        const { service } = build({ fetchLinkTitles: true, urlEnabled: false });
        const editor = new FakeEditor('');

        expect(service.handleEditorPaste(fakeClipboardEvent({ plain: 'https://example.com/page' }), editor.asEditor(), INFO)).toBe(true);
        expect(editor.getValue()).toBe('https://example.com/page');
        await settle();

        expect(editor.getValue()).toBe('[Example page](https://example.com/page)');
    });

    it('finds the pasted URL after the user continues typing beside an older copy', async () => {
        const { service } = build({ fetchLinkTitles: true, urlEnabled: false });
        const url = 'https://example.com/page';
        const editor = new FakeEditor(`${url}\n`);

        service.handleEditorPaste(fakeClipboardEvent({ plain: url }), editor.asEditor(), INFO);
        editor.replaceSelection(' notes');
        await settle();

        expect(editor.getValue()).toBe(`${url}\n[Example page](${url}) notes`);
    });

    it('fetches the title for the cleaned address', async () => {
        const { service } = build({ fetchLinkTitles: true });
        const editor = new FakeEditor('');

        service.handleEditorPaste(fakeClipboardEvent({ plain: 'https://example.com/page?utm_source=news' }), editor.asEditor(), INFO);
        await settle();

        expect(editor.getValue()).toBe('[Example page](https://example.com/page)');
    });

    it('does not fetch a title for prose containing a URL', () => {
        const { service } = build({ fetchLinkTitles: true, urlEnabled: false, trimPaste: false });
        const editor = new FakeEditor('');

        expect(service.handleEditorPaste(fakeClipboardEvent({ plain: 'See https://example.com/page' }), editor.asEditor(), INFO)).toBe(
            false
        );
    });

    it('leaves an image URL to image handling', async () => {
        const { service } = build({ fetchLinkTitles: true });
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

    it('does no work when both rich-content rules are off', async () => {
        const { service } = build({ urlEnabled: false, imagesEnabled: false });
        const editor = new FakeEditor('');

        await pasteRich(service, editor, RICH_HTML, '[link](https://example.com/b?utm_source=x)');

        expect(editor.getValue()).toBe('[link](https://example.com/b?utm_source=x)');
    });

    it('still cleans AI typography when the other rich-content rules are off', async () => {
        const { service } = build({ urlEnabled: false, imagesEnabled: false });
        const editor = new FakeEditor('');

        await pasteRich(service, editor, '<p>quoted</p>', '“quoted”');

        expect(editor.getValue()).toBe('"quoted"');
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

describe('explicit paste commands', () => {
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
        const editor = new FakeEditor('---\nbetter-paste: false\n---\n\n');

        expect(service.handleEditorPaste(fakeClipboardEvent({ plain: TRACKED }), editor.asEditor(), INFO)).toBe(false);
        expect(editor.getValue()).toBe('---\nbetter-paste: false\n---\n\n');
    });

    it('still processes a note whose property says yes', () => {
        const { service } = build();
        const editor = new FakeEditor('---\nbetter-paste: true\n---\n\n');

        expect(service.handleEditorPaste(fakeClipboardEvent({ plain: TRACKED }), editor.asEditor(), INFO)).toBe(true);
        expect(editor.getValue()).toBe('---\nbetter-paste: true\n---\n\nhttps://example.com/a');
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
        const document = '---\nbetter-paste: false\n---\n\nhttps://example.com/a?utm_source=x';
        const editor = selecting(document, 'https://example.com/a?utm_source=x');

        service.cleanSelection(editor.asEditor());
        expect(editor.getValue()).toBe('---\nbetter-paste: false\n---\n\nhttps://example.com/a');
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
