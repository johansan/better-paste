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
import {
    applyFileNameTemplate,
    assembleFileName,
    baseNameFromPath,
    baseNameFromUrl,
    buildFileNameTokens,
    counterPattern,
    expandFileNameTemplate,
    pastedImageName,
    resolveExtension,
    sanitizeFileName
} from '../src/utils/filenames';
import { IMAGE_EXTENSIONS } from '../src/settings/constants';

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

    it('cleans the edge again after truncating', () => {
        expect(sanitizeFileName(`${'a'.repeat(79)}.${'b'.repeat(10)}`)).toBe('a'.repeat(79));
    });

    it('does not split a Unicode code point while truncating', () => {
        const name = `${'a'.repeat(79)}\u{1F600}more`;
        expect(sanitizeFileName(name)).toBe(`${'a'.repeat(79)}\u{1F600}`);
    });

    it('avoids Windows device names', () => {
        expect(sanitizeFileName('CON')).toBe('_CON');
        expect(sanitizeFileName('com1')).toBe('_com1');
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
        expect(resolveExtension('image/png', 'https://example.com/a.jpg', IMAGE_EXTENSIONS)).toBe('png');
    });

    it('normalises jpeg to jpg', () => {
        expect(resolveExtension('image/jpeg', 'https://example.com/a', IMAGE_EXTENSIONS)).toBe('jpg');
    });

    it('ignores content type parameters', () => {
        expect(resolveExtension('image/png; charset=binary', 'https://example.com/a', IMAGE_EXTENSIONS)).toBe('png');
    });

    it('falls back to the URL extension', () => {
        expect(resolveExtension(undefined, 'https://example.com/a.webp', IMAGE_EXTENSIONS)).toBe('webp');
    });

    it('rejects a response that is not an image', () => {
        expect(resolveExtension('text/html', 'https://example.com/a', IMAGE_EXTENSIONS)).toBeNull();
        expect(resolveExtension('text/html', 'https://example.com/error.png', IMAGE_EXTENSIONS)).toBeNull();
    });

    it('falls back to the URL for a generic binary response', () => {
        expect(resolveExtension('application/octet-stream', 'https://example.com/a.png', IMAGE_EXTENSIONS)).toBe('png');
    });

    it('rejects an extension that is not in the allow list', () => {
        expect(resolveExtension('image/png', 'https://example.com/a.png', ['jpg'])).toBeNull();
    });

    it('accepts a bare file name as well as a URL', () => {
        expect(resolveExtension('', 'image.png', IMAGE_EXTENSIONS)).toBe('png');
    });

    it('trusts the clipboard file name over a differently typed source URL', () => {
        // Safari decodes a page's .webp into a PNG on the clipboard; the bytes are PNG
        expect(resolveExtension('', 'image.png', IMAGE_EXTENSIONS)).toBe('png');
        expect(resolveExtension('image/png', 'photo.webp', IMAGE_EXTENSIONS)).toBe('png');
    });
});

describe('applyFileNameTemplate', () => {
    const now = new Date(2026, 7, 12, 9, 5, 3);
    const tokens = buildFileNameTokens('https://www.example.com/pics/holiday.png');

    it('builds the source name token from the URL', () => {
        expect(tokens).toEqual({ name: 'holiday' });
    });

    it('expands the source name and Moment date syntax', () => {
        expect(applyFileNameTemplate('{{name}}-YYYY-MM-DD', tokens, now)).toBe('holiday-2026-08-12');
    });

    it('leaves unknown tokens in place so a typo is visible', () => {
        expect(applyFileNameTemplate('{{nope}}', tokens, now)).toBe('{{nope}}');
    });

    it('sanitizes the expanded result', () => {
        expect(applyFileNameTemplate('[copy]/{{name}}', tokens, now)).toBe('copyholiday');
    });
});

describe('expandFileNameTemplate', () => {
    const now = new Date(2026, 7, 12, 9, 5, 3);
    const tokens = {
        ...buildFileNameTokens('https://www.example.com/pics/holiday.png'),
        noteName: 'Trip report',
        property: (key: string) => (key === 'attachName' || key === 'attach name' ? 'shots' : null)
    };

    it('expands the note name token', () => {
        expect(applyFileNameTemplate('{{noteName}}-YYYY', tokens, now)).toBe('Trip report-2026');
    });

    it('expands a property token, including a key with spaces', () => {
        expect(applyFileNameTemplate('{{property:attachName}}', tokens, now)).toBe('shots');
        expect(applyFileNameTemplate('{{property:attach name}}', tokens, now)).toBe('shots');
    });

    it('reports an unavailable value as null', () => {
        expect(expandFileNameTemplate('{{property:missing}}', tokens, now)).toBeNull();
        expect(expandFileNameTemplate('{{noteName}}', { name: 'x' }, now)).toBeNull();
    });

    it('keeps a property value from breaking the date formatting', () => {
        const bracketed = { ...tokens, property: () => '[WIP] hero' };
        expect(applyFileNameTemplate('{{property:x}}-YYYY', bracketed, now)).toBe('WIP hero-2026');
    });

    it('splits the template around its counter', () => {
        expect(expandFileNameTemplate('{{noteName}}-{{counter:2}}', tokens, now)).toEqual({
            segments: ['Trip report-', ''],
            counterWidths: [2]
        });
    });

    it('accepts a counter-only template and a note name without letters', () => {
        expect(applyFileNameTemplate('{{counter}}', tokens, now)).toBe('1');
        expect(applyFileNameTemplate('{{noteName}}-{{counter}}', { ...tokens, noteName: '\u{1F600}' }, now)).toBe('\u{1F600}-1');
    });

    it('caps the counter pad width', () => {
        expect(expandFileNameTemplate('shot-{{counter:300}}', tokens, now)?.counterWidths).toEqual([6]);
    });

    it('literalizes a mistyped token instead of feeding it to Moment', () => {
        expect(applyFileNameTemplate('{{proprty:key}}', tokens, now)).toBe('{{proprtykey}}');
        expect(applyFileNameTemplate('{{counter:}}', tokens, now)).toBe('{{counter}}');
    });

    it('reserves room for the counter when capping a long name', () => {
        const long = { ...tokens, noteName: 'x'.repeat(120) };
        const expanded = expandFileNameTemplate('{{noteName}}-{{counter}}', long, now);
        expect(expanded?.segments[0].length).toBe(76);
        expect(expanded ? assembleFileName(expanded, 123).length : 0).toBeLessThanOrEqual(80);
    });
});

describe('assembleFileName and counterPattern', () => {
    const expanded = { segments: ['Trip report-', ''], counterWidths: [2] };

    it('writes the padded number into the counter slot', () => {
        expect(assembleFileName(expanded, 7)).toBe('Trip report-07');
        expect(assembleFileName({ segments: ['shot'], counterWidths: [] })).toBe('shot');
    });

    it('matches existing names regardless of case, capturing the number', () => {
        const pattern = counterPattern(expanded);
        expect(pattern.exec('Trip report-12')?.[1]).toBe('12');
        expect(pattern.exec('trip REPORT-3')?.[1]).toBe('3');
        expect(pattern.exec('Trip report-12 1')).toBeNull();
    });

    it('keeps timestamp-named files out of the sequence', () => {
        const pattern = counterPattern({ segments: ['Pasted image ', ''], counterWidths: [0] });
        expect(pattern.exec('Pasted image 3')?.[1]).toBe('3');
        expect(pattern.exec('Pasted image 20260818232550')).toBeNull();
    });

    it('escapes a Windows device name completed by the counter digit', () => {
        expect(assembleFileName({ segments: ['com', ''], counterWidths: [0] }, 1)).toBe('_com1');
    });
});

describe('pastedImageName', () => {
    it('matches the name Obsidian gives a clipboard bitmap', () => {
        expect(pastedImageName(new Date(2026, 7, 13, 14, 5, 6))).toBe('Pasted image 20260813140506');
    });
});

describe('baseNameFromPath', () => {
    it('takes the file name without folders or extension', () => {
        expect(baseNameFromPath('Notes/Trip report.md')).toBe('Trip report');
    });

    it('returns null for an empty path', () => {
        expect(baseNameFromPath('')).toBeNull();
    });
});
