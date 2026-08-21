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

import { describe, expect, it } from 'vitest';
import type { RequestUrlResponse } from 'obsidian';
import {
    composeTitledLink,
    escapeLinkTitle,
    formatTitledLink,
    isObviousImageUrl,
    LinkTitleService,
    standaloneWebUrl
} from '../src/paste/LinkTitleService';
import { DEFAULT_SETTINGS } from '../src/settings/defaults';

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
    it('accepts only one complete web address', () => {
        expect(standaloneWebUrl('https://example.com/page')).toBe('https://example.com/page');
        expect(standaloneWebUrl('See https://example.com/page')).toBeNull();
        expect(standaloneWebUrl('file:///tmp/a')).toBeNull();
    });

    it('recognises image paths without making a request', () => {
        expect(isObviousImageUrl('https://example.com/photo_(1).PNG?size=2')).toBe(true);
        expect(isObviousImageUrl('https://example.com/article')).toBe(false);
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
