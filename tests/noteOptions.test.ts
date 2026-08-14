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
    extractFrontmatterBlock,
    isInsideVerbatimContext,
    notePasteOverride,
    normalizeImageSize,
    resolveImageSize
} from '../src/paste/noteOptions';

describe('extractFrontmatterBlock', () => {
    it('reads the block at the top of a note', () => {
        expect(extractFrontmatterBlock('---\nbp-image-width: 400\n---\n\nBody text')).toBe('bp-image-width: 400');
    });

    it('reads a block with several properties', () => {
        expect(extractFrontmatterBlock('---\ntitle: Notes\nbp-image-width: 400\n---\n')).toBe('title: Notes\nbp-image-width: 400');
    });

    it('accepts the "..." terminator', () => {
        expect(extractFrontmatterBlock('---\nbp-image-width: 400\n...\nBody')).toBe('bp-image-width: 400');
    });

    it('handles an empty block', () => {
        expect(extractFrontmatterBlock('---\n---\nBody')).toBe('');
    });

    it('handles Windows line endings', () => {
        expect(extractFrontmatterBlock('---\r\nbp-image-width: 400\r\n---\r\nBody')).toBe('bp-image-width: 400\r');
    });

    it('returns null when there is no frontmatter', () => {
        expect(extractFrontmatterBlock('Just a note.')).toBeNull();
    });

    it('ignores a rule that is not on the first line', () => {
        expect(extractFrontmatterBlock('Some text\n---\nbp-image-width: 400\n---')).toBeNull();
    });

    it('returns null while the block is still unterminated', () => {
        expect(extractFrontmatterBlock('---\nbp-image-width: 400\n')).toBeNull();
    });
});

describe('normalizeImageSize', () => {
    it('accepts a plain number', () => {
        expect(normalizeImageSize(400)).toBe('400');
        expect(normalizeImageSize('400')).toBe('400');
    });

    it('accepts a width and height', () => {
        expect(normalizeImageSize('400x300')).toBe('400x300');
        expect(normalizeImageSize('400 x 300')).toBe('400x300');
        expect(normalizeImageSize('400×300')).toBe('400x300');
    });

    it('rounds a fractional number', () => {
        expect(normalizeImageSize(399.6)).toBe('400');
        expect(normalizeImageSize(0.4)).toBeNull();
    });

    it('rejects values that are not sizes', () => {
        expect(normalizeImageSize('wide')).toBeNull();
        expect(normalizeImageSize('50%')).toBeNull();
        expect(normalizeImageSize('-40')).toBeNull();
        expect(normalizeImageSize(0)).toBeNull();
        expect(normalizeImageSize(true)).toBeNull();
        expect(normalizeImageSize(null)).toBeNull();
        expect(normalizeImageSize(undefined)).toBeNull();
        expect(normalizeImageSize('')).toBeNull();
    });
});

describe('resolveImageSize', () => {
    it('reads the configured property', () => {
        expect(resolveImageSize({ 'bp-image-width': 400 }, 'bp-image-width')).toBe('400');
    });

    it('matches the property name regardless of case', () => {
        expect(resolveImageSize({ 'Bp-Image-Width': 400 }, 'bp-image-width')).toBe('400');
    });

    it('ignores other properties', () => {
        expect(resolveImageSize({ title: 'Notes', width: 999 }, 'bp-image-width')).toBeNull();
    });

    it('returns null when the feature is switched off', () => {
        expect(resolveImageSize({ 'bp-image-width': 400 }, '')).toBeNull();
    });

    it('returns null for missing frontmatter', () => {
        expect(resolveImageSize(null, 'bp-image-width')).toBeNull();
        expect(resolveImageSize('not an object', 'bp-image-width')).toBeNull();
    });
});

describe('notePasteOverride', () => {
    it('reads a boolean, which is the documented form', () => {
        expect(notePasteOverride({ bp: false }, 'bp')).toBe('off');
        expect(notePasteOverride({ bp: true }, 'bp')).toBe('on');
    });

    it('reads an unquoted number, which YAML parses as a number rather than a string', () => {
        expect(notePasteOverride({ bp: 0 }, 'bp')).toBe('off');
        expect(notePasteOverride({ bp: 1 }, 'bp')).toBe('on');
    });

    it('reads the written forms, so a property already typed as text still answers', () => {
        for (const value of ['false', 'off', 'no', '0', 'disabled', 'OFF', ' off ']) {
            expect(notePasteOverride({ bp: value }, 'bp'), value).toBe('off');
        }
        for (const value of ['true', 'on', 'yes', '1', 'enabled', 'ON', ' on ']) {
            expect(notePasteOverride({ bp: value }, 'bp'), value).toBe('on');
        }
    });

    it('treats an unrecognised value as no opinion, so a later version degrades to the global setting', () => {
        expect(notePasteOverride({ bp: 'text' }, 'bp')).toBeNull();
        expect(notePasteOverride({ bp: 2 }, 'bp')).toBeNull();
        expect(notePasteOverride({ bp: ['off'] }, 'bp')).toBeNull();
    });

    it('returns null when the note says nothing', () => {
        expect(notePasteOverride({ title: 'Notes' }, 'bp')).toBeNull();
        expect(notePasteOverride(null, 'bp')).toBeNull();
        expect(notePasteOverride({ bp: false }, '')).toBeNull();
    });
});

describe('isInsideVerbatimContext', () => {
    /** Places the cursor at the marker, which is removed before the check. */
    function atCursor(document: string): boolean {
        const offset = document.indexOf('|');
        return isInsideVerbatimContext(document.replace('|', ''), offset);
    }

    it('is false in ordinary prose', () => {
        expect(atCursor('Some notes\n\nMore |notes\n')).toBe(false);
    });

    it('is true inside a fenced code block', () => {
        expect(atCursor('Intro\n\n```sh\n$ ls\n|\n```\n')).toBe(true);
    });

    it('is true inside an inline code span', () => {
        expect(atCursor('Run `curl |here` in a shell')).toBe(true);
        expect(atCursor('Use ``a ` character |here`` in a shell')).toBe(true);
        expect(atCursor('Use `|` in a shell')).toBe(true);
    });

    it('is false immediately after an inline code span', () => {
        expect(atCursor('Run `curl here`| in a shell')).toBe(false);
    });

    it('is true on an indented code line', () => {
        expect(atCursor('Intro\n\n    curl |here\n')).toBe(true);
        expect(atCursor('Intro\n\n\tgrep |here\n')).toBe(true);
    });

    it('is false after the fence closes', () => {
        expect(atCursor('Intro\n\n```sh\n$ ls\n```\n\n|')).toBe(false);
    });

    it('handles several fences', () => {
        expect(atCursor('```\na\n```\ntext\n```\n|\n```\n')).toBe(true);
        expect(atCursor('```\na\n```\ntext\n```\nb\n```\n|')).toBe(false);
    });

    it('recognises a tilde fence', () => {
        expect(atCursor('~~~\n|code\n~~~\n')).toBe(true);
    });

    it('recognises a fenced code block inside a callout', () => {
        expect(atCursor('> [!note]\n> ```sh\n> |code\n> ```\n')).toBe(true);
    });

    it('requires a closing fence to use the same marker', () => {
        expect(atCursor('```js\n~~~\n|code\n```\n')).toBe(true);
    });

    it('requires a closing fence to be at least as long as the opening fence', () => {
        expect(atCursor('````js\n```\n|code\n````\n')).toBe(true);
    });

    it('is true inside frontmatter the note actually closes', () => {
        expect(atCursor('---\ntitle: |\n---\n\nBody')).toBe(true);
    });

    it('is false after frontmatter closes', () => {
        expect(atCursor('---\ntitle: Notes\n---\n\n|')).toBe(false);
    });

    it('treats an unterminated rule on line 1 as a thematic break, not open frontmatter', () => {
        // Otherwise every paste in such a note is silently skipped, with nothing to explain it
        expect(atCursor('---\n\nSome intro |text\n')).toBe(false);
    });

    it('does not treat a thematic break in the body as frontmatter', () => {
        expect(atCursor('Intro\n\n---\n\nMore |text\n')).toBe(false);
    });

    it('is not fooled by an inline code span at the start of a line', () => {
        expect(atCursor('```json``` is the fence we use\n\n|Body')).toBe(false);
    });

    it('ignores an indented block that is not a fence', () => {
        expect(atCursor('Intro\n\n    ```\n\n|Body')).toBe(false);
    });

    it('is false on the opening fence line itself', () => {
        expect(atCursor('Intro\n\n```sh|\ncode\n```\n')).toBe(false);
    });
});
