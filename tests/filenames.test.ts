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
import { applyFileNameTemplate, baseNameFromUrl, buildFileNameTokens, resolveExtension, sanitizeFileName } from '../src/utils/filenames';
import { DEFAULT_IMAGE_EXTENSIONS } from '../src/settings/defaults';

describe('sanitizeFileName', () => {
    it('removes characters that are illegal in a vault path', () => {
        expect(sanitizeFileName('a/b:c*d?e"f<g>h|i[j]k#l^m')).toBe('abcdefghijklm');
    });

    it('collapses whitespace and trims dots', () => {
        expect(sanitizeFileName('  ..a   b..  ')).toBe('a b');
    });

    it('falls back to a usable name when everything is stripped', () => {
        expect(sanitizeFileName('///')).toBe('pasted-image');
    });

    it('caps very long names', () => {
        expect(sanitizeFileName('x'.repeat(200)).length).toBe(80);
    });
});

describe('baseNameFromUrl', () => {
    it('takes the last path segment without its extension', () => {
        expect(baseNameFromUrl('https://example.com/a/b/photo.png')).toBe('photo');
    });

    it('decodes percent escapes', () => {
        expect(baseNameFromUrl('https://example.com/my%20photo.png')).toBe('my photo');
    });

    it('returns null when the path is empty', () => {
        expect(baseNameFromUrl('https://example.com/')).toBeNull();
    });

    it('returns null for input that is not a URL', () => {
        expect(baseNameFromUrl('nonsense')).toBeNull();
    });

    it('returns null for a data URI rather than using its payload', () => {
        expect(baseNameFromUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUg')).toBeNull();
    });
});

describe('resolveExtension', () => {
    it('prefers the content type', () => {
        expect(resolveExtension('image/png', 'https://example.com/a.jpg', DEFAULT_IMAGE_EXTENSIONS)).toBe('png');
    });

    it('normalises jpeg to jpg', () => {
        expect(resolveExtension('image/jpeg', 'https://example.com/a', DEFAULT_IMAGE_EXTENSIONS)).toBe('jpg');
    });

    it('ignores content type parameters', () => {
        expect(resolveExtension('image/png; charset=binary', 'https://example.com/a', DEFAULT_IMAGE_EXTENSIONS)).toBe('png');
    });

    it('falls back to the URL extension', () => {
        expect(resolveExtension(undefined, 'https://example.com/a.webp', DEFAULT_IMAGE_EXTENSIONS)).toBe('webp');
    });

    it('rejects a response that is not an image', () => {
        expect(resolveExtension('text/html', 'https://example.com/a', DEFAULT_IMAGE_EXTENSIONS)).toBeNull();
    });

    it('rejects an extension that is not in the allow list', () => {
        expect(resolveExtension('image/png', 'https://example.com/a.png', ['jpg'])).toBeNull();
    });

    it('accepts a bare file name as well as a URL', () => {
        expect(resolveExtension('', 'image.png', DEFAULT_IMAGE_EXTENSIONS)).toBe('png');
    });

    it('trusts the clipboard file name over a differently typed source URL', () => {
        // Safari decodes a page's .webp into a PNG on the clipboard; the bytes are PNG
        expect(resolveExtension('', 'image.png', DEFAULT_IMAGE_EXTENSIONS)).toBe('png');
        expect(resolveExtension('image/png', 'photo.webp', DEFAULT_IMAGE_EXTENSIONS)).toBe('png');
    });
});

describe('applyFileNameTemplate', () => {
    const tokens = buildFileNameTokens('https://www.example.com/pics/holiday.png', new Date(2026, 7, 12, 9, 5, 3));

    it('builds tokens from the URL and clock', () => {
        expect(tokens).toMatchObject({ name: 'holiday', host: 'example.com', date: '2026-08-12', time: '090503' });
    });

    it('expands known tokens', () => {
        expect(applyFileNameTemplate('{{date}} {{name}} from {{host}}', tokens)).toBe('2026-08-12 holiday from example.com');
    });

    it('leaves unknown tokens in place so a typo is visible', () => {
        expect(applyFileNameTemplate('{{nope}}', tokens)).toBe('{{nope}}');
    });

    it('sanitizes the expanded result', () => {
        expect(applyFileNameTemplate('a/b {{name}}', tokens)).toBe('ab holiday');
    });
});
