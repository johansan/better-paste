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

import { afterEach, describe, expect, it, vi } from 'vitest';
import type { RequestUrlResponse } from 'obsidian';
import {
    composeTitledLink,
    escapeLinkTitle,
    formatTitledLink,
    isObviousImageUrl,
    LinkTitleService,
    obsidianUrlTitle,
    standaloneWebUrl,
    standaloneWebUrlLines
} from '../src/paste/LinkTitleService';
import { LINK_TITLE_MAX_PARALLEL } from '../src/settings/constants';
import { DEFAULT_SETTINGS } from '../src/settings/defaults';

afterEach(() => {
    vi.unstubAllGlobals();
});

function response(overrides: Partial<RequestUrlResponse> = {}): RequestUrlResponse {
    return {
        status: 200,
        headers: { 'content-type': 'text/html; charset=utf-8' },
        arrayBuffer: new ArrayBuffer(0),
        json: null,
        text: '<title>Example</title>',
        ...overrides
    };
}

describe('link title candidates', () => {
    it('derives note titles from standalone Obsidian open URLs', () => {
        expect(obsidianUrlTitle('obsidian://open?vault=Notes&file=My%20Note')).toEqual({
            title: 'My Note',
            url: 'obsidian://open?vault=Notes&file=My%20Note'
        });
        expect(obsidianUrlTitle('obsidian://open?vault=Notes&file=Folder%2FMy%20Note')).toEqual({
            title: 'My Note',
            url: 'obsidian://open?vault=Notes&file=Folder%2FMy%20Note'
        });
        expect(obsidianUrlTitle('obsidian://open?file=Folder%2FA%20%26%20B')).toEqual({
            title: 'A & B',
            url: 'obsidian://open?file=Folder%2FA%20%26%20B'
        });
        expect(obsidianUrlTitle('obsidian://open?file=A%20%5Bnote%5D')).toEqual({
            title: 'A [note]',
            url: 'obsidian://open?file=A%20%5Bnote%5D'
        });
        expect(obsidianUrlTitle('obsidian://open?vault=Notes&file=My%20Note%23Heading')).toEqual({
            title: 'My Note',
            url: 'obsidian://open?vault=Notes&file=My%20Note%23Heading'
        });
        expect(obsidianUrlTitle('obsidian://open?file=Folder%2FMy%20Note%23%5Eabc123')).toEqual({
            title: 'My Note',
            url: 'obsidian://open?file=Folder%2FMy%20Note%23%5Eabc123'
        });
        expect(obsidianUrlTitle('obsidian://open?file=Folder%2FMy%20Note.md')).toEqual({
            title: 'My Note',
            url: 'obsidian://open?file=Folder%2FMy%20Note.md'
        });
    });

    it('rejects incomplete or non-open Obsidian URLs', () => {
        expect(obsidianUrlTitle('obsidian://open?vault=Notes')).toBeNull();
        expect(obsidianUrlTitle('obsidian://open?file=')).toBeNull();
        expect(obsidianUrlTitle('obsidian://open?file=%23Heading')).toBeNull();
        expect(obsidianUrlTitle('obsidian://search?query=x')).toBeNull();
        expect(obsidianUrlTitle('https://example.com/?file=Note')).toBeNull();
        expect(obsidianUrlTitle('obsidian://open?file=My%20Note extra')).toBeNull();
        expect(obsidianUrlTitle('not a URL')).toBeNull();
    });

    it('accepts only one complete web address', () => {
        expect(standaloneWebUrl('https://example.com/page')).toBe('https://example.com/page');
        expect(standaloneWebUrl('See https://example.com/page')).toBeNull();
        expect(standaloneWebUrl('file:///tmp/a')).toBeNull();
    });

    it('recognises image paths without making a request', () => {
        expect(isObviousImageUrl('https://example.com/photo_(1).PNG?size=2')).toBe(true);
        expect(isObviousImageUrl('https://www.dropbox.com/scl/fi/id/photo.jpg?rlkey=secret&dl=0')).toBe(false);
        expect(isObviousImageUrl('https://www.dropbox.com/scl/fi/id/photo.jpg?raw=1')).toBe(true);
        expect(isObviousImageUrl('https://www.dropbox.com/scl/fi/id/photo.jpg?dl=1')).toBe(true);
        expect(isObviousImageUrl('https://dl.dropbox.com/scl/fi/id/photo.jpg')).toBe(true);
        expect(isObviousImageUrl('https://www.dropbox.com/scl/fo/id/token/sub/photo.jpg?dl=0')).toBe(false);
        expect(isObviousImageUrl('https://example.com/article')).toBe(false);
    });

    it('detects only URL-line batches and preserves their whitespace', () => {
        expect(standaloneWebUrlLines('https://a.com\n\n  https://b.com  ')).toEqual([
            { url: 'https://a.com', leading: '', trailing: '' },
            { url: 'https://b.com', leading: '  ', trailing: '  ' }
        ]);
        expect(standaloneWebUrlLines('https://a.com\n')).toEqual([{ url: 'https://a.com', leading: '', trailing: '' }]);
        expect(standaloneWebUrlLines('https://a.com')).toBeNull();
        expect(standaloneWebUrlLines('https://a.com\nSome prose')).toBeNull();
        expect(standaloneWebUrlLines('https://a.com\nhttps://example.com/image.png')).toBeNull();
        expect(standaloneWebUrlLines('> https://a.com\n> https://b.com')).toBeNull();
        expect(standaloneWebUrlLines('> https://a.com\n>\n> >  https://b.com  ', { allowBlockQuotes: true })).toEqual([
            { url: 'https://a.com', leading: '> ', trailing: '' },
            { url: 'https://b.com', leading: '> >  ', trailing: '  ' }
        ]);
    });

    it('escapes Markdown in a page title', () => {
        expect(escapeLinkTitle('A [page] with *markup* | notes')).toBe('A \\[page\\] with \\*markup\\* \\| notes');
    });

    it('formats the final Markdown before snippets run', () => {
        expect(formatTitledLink('A [page]', 'https://example.com/a(b)')).toBe('[A \\[page\\]](https://example.com/a%28b%29)');
    });

    it('rewrites only the escaped label of a finished Markdown link', () => {
        const source = formatTitledLink('A [page]', 'https://example.com/a(b)');

        expect(composeTitledLink(source, source.replace('\\[page\\]', 'document'))).toBe('[A document](https://example.com/a%28b%29)');
        expect(composeTitledLink(source, source.replace('https:', 'http:'))).toBe(source);
    });
});

describe('LinkTitleService', () => {
    it('fetches an HTML title and returns its raw parts', async () => {
        const settings = { ...DEFAULT_SETTINGS, linkTitles: true };
        const service = new LinkTitleService(
            () => settings,
            async () => response({ text: '<title>A page</title>' }),
            html => (/A page/.test(html) ? 'A page' : null)
        );

        expect(await service.materializeTitle('https://example.com/page')).toEqual({
            title: 'A page',
            url: 'https://example.com/page'
        });
    });

    it('rejects a site name as the title of a specific page', async () => {
        const settings = { ...DEFAULT_SETTINGS, linkTitles: true };
        const service = new LinkTitleService(
            () => settings,
            async () => response({ text: '<title>Reddit</title>' }),
            () => 'Reddit'
        );

        expect(await service.materializeTitle('https://www.reddit.com/r/ObsidianMD/comments/example')).toBeNull();
        expect(await service.materializeTitle('https://www.reddit.com/')).toEqual({
            title: 'Reddit',
            url: 'https://www.reddit.com/'
        });
    });

    it('leaves non-HTML responses alone', async () => {
        const settings = { ...DEFAULT_SETTINGS, linkTitles: true };
        const service = new LinkTitleService(
            () => settings,
            async () => response({ headers: { 'Content-Type': 'application/pdf' } }),
            () => 'Wrong title'
        );

        expect(await service.materializeTitle('https://example.com/file')).toBeNull();
    });

    it('does no work while the setting is off', () => {
        const settings = { ...DEFAULT_SETTINGS, linkTitles: false };
        const service = new LinkTitleService(
            () => settings,
            async () => response(),
            () => 'A page'
        );
        expect(service.hasWork('https://example.com/page')).toBe(false);
        expect(service.hasBatchWork('https://a.com\nhttps://b.com')).toBe(false);
    });

    it('fetches a batch in order, reuses duplicates and keeps failures null', async () => {
        const settings = { ...DEFAULT_SETTINGS, linkTitles: true };
        const gets: string[] = [];
        const service = new LinkTitleService(
            () => settings,
            async request => {
                const url = typeof request === 'string' ? request : request.url;
                if ((typeof request === 'string' ? 'GET' : request.method) === 'GET') gets.push(url);
                return response({ status: url.includes('fail') ? 500 : 200 });
            },
            () => 'Title'
        );

        const results = await service.materializeTitles('https://a.com/page\nhttps://fail.com/page\nhttps://a.com/page');
        expect(results).toEqual([{ title: 'Title', url: 'https://a.com/page' }, null, { title: 'Title', url: 'https://a.com/page' }]);
        expect(gets).toEqual(['https://a.com/page', 'https://fail.com/page']);
    });

    it('bounds batch concurrency and starts no requests after disposal', async () => {
        const settings = { ...DEFAULT_SETTINGS, linkTitles: true };
        let active = 0;
        let peak = 0;
        const releases: (() => void)[] = [];
        const service = new LinkTitleService(
            () => settings,
            async request => {
                if (typeof request !== 'string' && request.method === 'HEAD') return response();
                active += 1;
                peak = Math.max(peak, active);
                await new Promise<void>(resolve => releases.push(resolve));
                active -= 1;
                return response();
            },
            () => 'Title'
        );
        const urls = Array.from({ length: LINK_TITLE_MAX_PARALLEL + 2 }, (_, index) => `https://example.com/${index}`).join('\n');
        const batch = service.materializeTitles(urls);
        await vi.waitFor(() => expect(active).toBe(LINK_TITLE_MAX_PARALLEL));
        service.dispose();
        releases.splice(0).forEach(release => release());
        const results = await batch;

        expect(peak).toBe(LINK_TITLE_MAX_PARALLEL);
        expect(results?.filter(result => result !== null)).toHaveLength(0);
        expect(releases).toHaveLength(0);
    });

    it('takes the title from a site provider before fetching the page', async () => {
        const settings = { ...DEFAULT_SETTINGS, linkTitles: true };
        const requests: string[] = [];
        const service = new LinkTitleService(
            () => settings,
            async request => {
                requests.push(typeof request === 'string' ? request : request.url);
                return response({
                    headers: { 'content-type': 'application/json' },
                    text: '{"title":"A video"}'
                });
            },
            () => null
        );

        const pasted = 'https://www.youtube.com/watch?v=m2maDNtho7Y';
        expect(await service.materializeTitle(pasted)).toEqual({ title: 'A video', url: pasted });
        expect(requests).toEqual([`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(pasted)}`]);
    });

    it('uses the Stack Exchange provider response parser for question titles', async () => {
        const settings = { ...DEFAULT_SETTINGS, linkTitles: true };
        const requests: string[] = [];
        const encoded = 'What does if __name__ == &quot;__main__&quot;: do?';
        vi.stubGlobal(
            'DOMParser',
            class {
                parseFromString(source: string, type: string) {
                    expect(source).toBe(encoded);
                    expect(type).toBe('text/html');
                    return { body: { textContent: 'What does if __name__ == "__main__": do?' } };
                }
            }
        );
        const service = new LinkTitleService(
            () => settings,
            async request => {
                requests.push(typeof request === 'string' ? request : request.url);
                return response({
                    headers: { 'content-type': 'application/json' },
                    text: JSON.stringify({ items: [{ title: encoded }] })
                });
            },
            () => null
        );

        const pasted = 'https://diy.stackexchange.com/questions/331790/a-question';
        expect(await service.materializeTitle(pasted)).toEqual({
            title: 'What does if __name__ == "__main__": do?',
            url: pasted
        });
        expect(requests).toEqual(['https://api.stackexchange.com/2.3/questions/331790?site=diy.stackexchange.com']);
    });

    it('falls back to the page fetch when the provider fails', async () => {
        const settings = { ...DEFAULT_SETTINGS, linkTitles: true };
        const service = new LinkTitleService(
            () => settings,
            async request => {
                const url = typeof request === 'string' ? request : request.url;
                if (url.includes('/oembed')) return response({ status: 404, text: '' });
                return response({ text: '<title>A channel</title>' });
            },
            html => (/A channel/.test(html) ? 'A channel' : null)
        );

        expect(await service.materializeTitle('https://www.youtube.com/@SomeChannel')).toEqual({
            title: 'A channel',
            url: 'https://www.youtube.com/@SomeChannel'
        });
    });

    it('falls back to the page fetch when the provider answer has no title', async () => {
        const settings = { ...DEFAULT_SETTINGS, linkTitles: true };
        const service = new LinkTitleService(
            () => settings,
            async request => {
                const url = typeof request === 'string' ? request : request.url;
                if (url.includes('/oembed')) return response({ text: '{"html":"<blockquote></blockquote>"}' });
                return response({ text: '<title>A page</title>' });
            },
            html => (/A page/.test(html) ? 'A page' : null)
        );

        expect(await service.materializeTitle('https://www.youtube.com/watch?v=abc')).toEqual({
            title: 'A page',
            url: 'https://www.youtube.com/watch?v=abc'
        });
    });

    it('keeps Markdown characters raw in a provider title', async () => {
        const settings = { ...DEFAULT_SETTINGS, linkTitles: true };
        const service = new LinkTitleService(
            () => settings,
            async () => response({ text: '{"title":"A [page] with *markup*"}' }),
            () => null
        );

        expect(await service.materializeTitle('https://www.youtube.com/watch?v=abc')).toEqual({
            title: 'A [page] with *markup*',
            url: 'https://www.youtube.com/watch?v=abc'
        });
    });

    it.each([
        ['filename*', `attachment; filename="Wrong.docx"; filename*=UTF-8''AI%20notes.docx`, 'AI notes.docx'],
        ['filename* with whitespace', `attachment; filename*=UTF-8''evil%0A%23%20Heading.txt`, 'evil # Heading.txt'],
        ['quoted filename', 'attachment; filename="AI notes.docx"', 'AI notes.docx'],
        ['unquoted filename', 'attachment; filename=AI-notes.docx', 'AI-notes.docx']
    ])('reads a Dropbox %s content disposition', async (_case, disposition, title) => {
        const settings = { ...DEFAULT_SETTINGS, linkTitles: true };
        const requests: unknown[] = [];
        const service = new LinkTitleService(
            () => settings,
            async request => {
                requests.push(request);
                return response({ headers: { 'content-disposition': disposition }, text: '' });
            },
            () => null
        );
        const pasted = 'https://www.dropbox.com/scl/fi/id/cosmetic-name.docx?rlkey=secret&dl=0&tracking=ignored';

        expect(await service.materializeTitle(pasted)).toEqual({ title, url: pasted });
        expect(requests).toEqual([
            { url: 'https://dl.dropboxusercontent.com/scl/fi/id/cosmetic-name.docx?rlkey=secret', method: 'HEAD', throw: false }
        ]);
    });

    it.each([
        ['https://www.dropbox.com/scl/fi/id/AI-notes.docx?rlkey=secret&dl=0', 'AI-notes.docx'],
        ['https://www.dropbox.com/scl/fi/id/evil%0A%23%20Heading.txt?dl=0', 'evil # Heading.txt'],
        ['https://dropbox.com/scl/fi/id/bad%ZZname.jpg?rlkey=secret', 'bad%ZZname.jpg']
    ])('uses the Dropbox path name when its file request fails', async (pasted, title) => {
        const settings = { ...DEFAULT_SETTINGS, linkTitles: true };
        const requests: unknown[] = [];
        const service = new LinkTitleService(
            () => settings,
            async request => {
                requests.push(request);
                return response({ status: 403, text: '' });
            },
            () => 'Dropbox'
        );

        expect(await service.materializeTitle(pasted)).toEqual({ title, url: pasted });
        expect(requests).toHaveLength(1);
    });

    it('does not fetch a Dropbox page after a terminal folder request fails', async () => {
        const settings = { ...DEFAULT_SETTINGS, linkTitles: true };
        const requests: unknown[] = [];
        const service = new LinkTitleService(
            () => settings,
            async request => {
                requests.push(request);
                return response({ status: 403, text: '' });
            },
            () => 'Dropbox'
        );
        const pasted = 'https://dl.dropbox.com/scl/fo/id/token?rlkey=wrong&dl=0';

        expect(await service.materializeTitle(pasted)).toBeNull();
        expect(requests).toEqual([{ url: 'https://www.dropbox.com/scl/fo/id/token?rlkey=wrong&dl=1', method: 'HEAD', throw: false }]);
    });

    it('strips the zip suffix from a Dropbox folder title', async () => {
        const settings = { ...DEFAULT_SETTINGS, linkTitles: true };
        const service = new LinkTitleService(
            () => settings,
            async () => response({ headers: { 'content-disposition': 'attachment; filename="Project.zip"' }, text: '' }),
            () => null
        );
        const pasted = 'https://www.dropbox.com/sh/id/token/subpath?dl=0';

        expect(await service.materializeTitle(pasted)).toEqual({ title: 'Project', url: pasted });
    });

    it('fetches mixed Dropbox and ordinary URLs in one batch', async () => {
        const settings = { ...DEFAULT_SETTINGS, linkTitles: true };
        const service = new LinkTitleService(
            () => settings,
            async request => {
                const url = typeof request === 'string' ? request : request.url;
                if (url.startsWith('https://dl.dropboxusercontent.com/')) {
                    return response({ headers: { 'content-disposition': 'attachment; filename="Photo.jpg"' }, text: '' });
                }
                return response({ text: '<title>Ordinary page</title>' });
            },
            html => (/Ordinary page/.test(html) ? 'Ordinary page' : null)
        );
        const dropbox = 'https://www.dropbox.com/scl/fi/id/photo.jpg?rlkey=secret&dl=0';
        const ordinary = 'https://example.com/page';

        expect(await service.materializeTitles(`${dropbox}\n${ordinary}`)).toEqual([
            { title: 'Photo.jpg', url: dropbox },
            { title: 'Ordinary page', url: ordinary }
        ]);
    });

    it('discards a provider response that arrives after disposal', async () => {
        const settings = { ...DEFAULT_SETTINGS, linkTitles: true };
        const requests: string[] = [];
        let finishRequest: (value: RequestUrlResponse) => void = () => undefined;
        const pending = new Promise<RequestUrlResponse>(resolve => {
            finishRequest = resolve;
        });
        const service = new LinkTitleService(
            () => settings,
            request => {
                requests.push(typeof request === 'string' ? request : request.url);
                return pending;
            },
            () => 'A page'
        );

        const title = service.materializeTitle('https://www.youtube.com/watch?v=abc');
        service.dispose();
        finishRequest(response({ text: '{"title":"A video"}' }));

        expect(await title).toBeNull();
        expect(requests).toHaveLength(1);
    });

    it('discards a response that arrives after disposal', async () => {
        const settings = { ...DEFAULT_SETTINGS, linkTitles: true };
        let finishRequest: (value: RequestUrlResponse) => void = () => undefined;
        const pending = new Promise<RequestUrlResponse>(resolve => {
            finishRequest = resolve;
        });
        const service = new LinkTitleService(
            () => settings,
            () => pending,
            () => 'A page'
        );

        const title = service.materializeTitle('https://example.com/page');
        service.dispose();
        finishRequest(response());

        expect(await title).toBeNull();
    });
});
