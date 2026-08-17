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
import { titleFromProviderResponse, titleProviderRequest } from '../src/paste/titleProviders';

describe('titleProviderRequest', () => {
    it('builds a YouTube request for videos, short links and Shorts', () => {
        expect(titleProviderRequest(new URL('https://www.youtube.com/watch?v=m2maDNtho7Y'))).toBe(
            `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent('https://www.youtube.com/watch?v=m2maDNtho7Y')}`
        );
        expect(titleProviderRequest(new URL('https://youtu.be/m2maDNtho7Y'))).toContain('youtube.com/oembed');
        expect(titleProviderRequest(new URL('https://m.youtube.com/shorts/aqz-KE-bpKQ'))).toContain('youtube.com/oembed');
    });

    it('builds a Reddit request for posts and comment permalinks only', () => {
        expect(titleProviderRequest(new URL('https://www.reddit.com/r/ObsidianMD/comments/1vqs7dr/better_paste/'))).toBe(
            `https://www.reddit.com/oembed?url=${encodeURIComponent('https://www.reddit.com/r/ObsidianMD/comments/1vqs7dr/better_paste/')}`
        );
        expect(titleProviderRequest(new URL('https://old.reddit.com/r/ObsidianMD/comments/1vqs7dr/comment/p4a440m/'))).toContain(
            'reddit.com/oembed'
        );
        expect(titleProviderRequest(new URL('https://www.reddit.com/r/ObsidianMD/'))).toBeNull();
    });

    it('builds a TikTok request for videos and profiles', () => {
        expect(titleProviderRequest(new URL('https://www.tiktok.com/@scout2015/video/6718335390845095173'))).toBe(
            `https://www.tiktok.com/oembed?url=${encodeURIComponent('https://www.tiktok.com/@scout2015/video/6718335390845095173')}`
        );
        expect(titleProviderRequest(new URL('https://www.tiktok.com/@scout2015'))).toContain('tiktok.com/oembed');
    });

    it('builds a Loom request for share pages only', () => {
        expect(titleProviderRequest(new URL('https://www.loom.com/share/981c06eada22476088cb5fe462a6b955'))).toBe(
            `https://www.loom.com/v1/oembed?url=${encodeURIComponent('https://www.loom.com/share/981c06eada22476088cb5fe462a6b955')}`
        );
        expect(titleProviderRequest(new URL('https://www.loom.com/looms/videos'))).toBeNull();
    });

    it('leaves other sites to the page fetch', () => {
        expect(titleProviderRequest(new URL('https://example.com/watch?v=abc'))).toBeNull();
        expect(titleProviderRequest(new URL('https://notyoutube.com/watch?v=abc'))).toBeNull();
        expect(titleProviderRequest(new URL('https://redd.it/1vqs7dr'))).toBeNull();
    });
});

describe('titleFromProviderResponse', () => {
    it('reads and normalises the title field', () => {
        expect(titleFromProviderResponse('{"title":"  A \\n title "}')).toBe('A title');
    });

    it('rejects bodies without a usable title', () => {
        expect(titleFromProviderResponse('{"title":42}')).toBeNull();
        expect(titleFromProviderResponse('{"title":"   "}')).toBeNull();
        expect(titleFromProviderResponse('{"html":"<a>x</a>"}')).toBeNull();
        expect(titleFromProviderResponse('not json')).toBeNull();
        expect(titleFromProviderResponse('null')).toBeNull();
    });
});
