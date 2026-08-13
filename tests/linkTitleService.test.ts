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
import { escapeLinkTitle, isObviousImageUrl, LinkTitleService, standaloneWebUrl } from '../src/paste/LinkTitleService';
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
});

describe('LinkTitleService', () => {
    it('fetches an HTML title and returns a Markdown link', async () => {
        const settings = { ...DEFAULT_SETTINGS, fetchLinkTitles: true };
        const service = new LinkTitleService(
            () => settings,
            async () => response({ text: '<title>A page</title>' }),
            html => (/A page/.test(html) ? 'A page' : null)
        );

        expect(await service.materializeTitle('https://example.com/page')).toBe('[A page](https://example.com/page)');
    });

    it('leaves non-HTML responses alone', async () => {
        const settings = { ...DEFAULT_SETTINGS, fetchLinkTitles: true };
        const service = new LinkTitleService(
            () => settings,
            async () => response({ headers: { 'Content-Type': 'application/pdf' } }),
            () => 'Wrong title'
        );

        expect(await service.materializeTitle('https://example.com/file')).toBeNull();
    });

    it('does no work while the setting is off', () => {
        const service = new LinkTitleService(
            () => DEFAULT_SETTINGS,
            async () => response(),
            () => 'A page'
        );
        expect(service.hasWork('https://example.com/page')).toBe(false);
    });

    it('discards a response that arrives after disposal', async () => {
        const settings = { ...DEFAULT_SETTINGS, fetchLinkTitles: true };
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
