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
import { titleProviderRequest } from '../src/paste/titleProviders';

function requestUrl(address: string): string | null {
    return titleProviderRequest(new URL(address))?.url ?? null;
}

afterEach(() => {
    vi.unstubAllGlobals();
});

describe('titleProviderRequest', () => {
    it('builds a YouTube request for videos, short links and Shorts', () => {
        expect(requestUrl('https://www.youtube.com/watch?v=m2maDNtho7Y')).toBe(
            `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent('https://www.youtube.com/watch?v=m2maDNtho7Y')}`
        );
        expect(requestUrl('https://youtu.be/m2maDNtho7Y')).toContain('youtube.com/oembed');
        expect(requestUrl('https://m.youtube.com/shorts/aqz-KE-bpKQ')).toContain('youtube.com/oembed');
    });

    it('builds a Reddit request for posts and comment permalinks only', () => {
        expect(requestUrl('https://www.reddit.com/r/ObsidianMD/comments/1vqs7dr/better_paste/')).toBe(
            `https://www.reddit.com/oembed?url=${encodeURIComponent('https://www.reddit.com/r/ObsidianMD/comments/1vqs7dr/better_paste/')}`
        );
        expect(requestUrl('https://old.reddit.com/r/ObsidianMD/comments/1vqs7dr/comment/p4a440m/')).toContain('reddit.com/oembed');
        expect(requestUrl('https://www.reddit.com/r/ObsidianMD/')).toBeNull();
    });

    it('builds a TikTok request for videos and profiles', () => {
        expect(requestUrl('https://www.tiktok.com/@scout2015/video/6718335390845095173')).toBe(
            `https://www.tiktok.com/oembed?url=${encodeURIComponent('https://www.tiktok.com/@scout2015/video/6718335390845095173')}`
        );
        expect(requestUrl('https://www.tiktok.com/@scout2015')).toContain('tiktok.com/oembed');
    });

    it('builds a Loom request for share pages only', () => {
        expect(requestUrl('https://www.loom.com/share/981c06eada22476088cb5fe462a6b955')).toBe(
            `https://www.loom.com/v1/oembed?url=${encodeURIComponent('https://www.loom.com/share/981c06eada22476088cb5fe462a6b955')}`
        );
        expect(requestUrl('https://www.loom.com/looms/videos')).toBeNull();
    });

    it.each([
        ['stackexchange.com', '/q/123456', '123456'],
        ['diy.stackexchange.com', '/questions/331790/a-question', '331790'],
        ['meta.stackexchange.com', '/q/456789', '456789'],
        ['stackoverflow.com', '/questions/11227809/why-is-processing-a-sorted-array-faster', '11227809'],
        ['meta.stackoverflow.com', '/q/12345/discussion', '12345'],
        ['pt.stackoverflow.com', '/questions/67890/pergunta', '67890'],
        ['superuser.com', '/q/23456', '23456'],
        ['serverfault.com', '/questions/34567/server-question', '34567'],
        ['askubuntu.com', '/q/45678/ubuntu-question', '45678'],
        ['stackapps.com', '/questions/56789/app-question', '56789'],
        ['mathoverflow.net', '/q/67890', '67890']
    ])('builds a Stack Exchange API request for %s%s', (hostname, path, questionId) => {
        expect(requestUrl(`https://${hostname}${path}`)).toBe(`https://api.stackexchange.com/2.3/questions/${questionId}?site=${hostname}`);
    });

    it('leaves non-question Stack Exchange paths to the page fetch', () => {
        expect(requestUrl('https://stackoverflow.com/')).toBeNull();
        expect(requestUrl('https://stackoverflow.com/questions/tagged/typescript')).toBeNull();
        expect(requestUrl('https://stackoverflow.com/questions/not-a-number/title')).toBeNull();
        expect(requestUrl('https://stackoverflow.com/questions/123abc/title')).toBeNull();
        expect(requestUrl('https://stackoverflow.com/q/not-a-number')).toBeNull();
        expect(requestUrl('https://stackoverflow.com/a/11227809')).toBeNull();
    });

    it('leaves other sites to the page fetch', () => {
        expect(requestUrl('https://example.com/watch?v=abc')).toBeNull();
        expect(requestUrl('https://notyoutube.com/watch?v=abc')).toBeNull();
        expect(requestUrl('https://redd.it/1vqs7dr')).toBeNull();
        expect(requestUrl('https://notstackoverflow.com/questions/123/title')).toBeNull();
    });
});

describe('provider response parsing', () => {
    it('reads and normalises an oEmbed title field', () => {
        const provider = titleProviderRequest(new URL('https://www.youtube.com/watch?v=abc'));
        expect(provider?.titleFromResponse('{"title":"  A \\n title "}')).toBe('A title');
    });

    it('rejects oEmbed bodies without a usable title', () => {
        const provider = titleProviderRequest(new URL('https://www.youtube.com/watch?v=abc'));
        expect(provider?.titleFromResponse('{"title":42}')).toBeNull();
        expect(provider?.titleFromResponse('{"title":"   "}')).toBeNull();
        expect(provider?.titleFromResponse('{"html":"<a>x</a>"}')).toBeNull();
        expect(provider?.titleFromResponse('not json')).toBeNull();
        expect(provider?.titleFromResponse('null')).toBeNull();
    });

    it('decodes entities and normalises a Stack Exchange title', () => {
        const encoded = '  What does if __name__ == &quot;__main__&quot;:\n do? &amp; why?  ';
        vi.stubGlobal(
            'DOMParser',
            class {
                parseFromString(source: string, type: string) {
                    expect(source).toBe(encoded);
                    expect(type).toBe('text/html');
                    return { body: { textContent: '  What does if __name__ == "__main__":\n do? & why?  ' } };
                }
            }
        );

        const provider = titleProviderRequest(new URL('https://stackoverflow.com/questions/419163/what-does-if-name-main-do'));
        expect(provider?.titleFromResponse(JSON.stringify({ items: [{ title: encoded }] }))).toBe(
            'What does if __name__ == "__main__": do? & why?'
        );
    });

    it('rejects Stack Exchange bodies without a usable first item title', () => {
        const provider = titleProviderRequest(new URL('https://stackoverflow.com/q/419163'));
        expect(provider?.titleFromResponse('{"items":[]}')).toBeNull();
        expect(provider?.titleFromResponse('{"items":[{}]}')).toBeNull();
        expect(provider?.titleFromResponse('{"items":[{"title":42}]}')).toBeNull();
        expect(provider?.titleFromResponse('{"items":[{"title":"   "}]}')).toBeNull();
        expect(provider?.titleFromResponse('{"items":null}')).toBeNull();
        expect(provider?.titleFromResponse('not json')).toBeNull();
    });
});
