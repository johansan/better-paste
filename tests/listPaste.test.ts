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
import { rebaseListPaste } from '../src/transforms/listPaste';

/** Runs the rebase with the cursor at the | marker, which is removed before the call. */
function paste(pasted: string, document: string): string | null {
    const offset = document.indexOf('|');
    return rebaseListPaste(pasted, document.replace('|', ''), offset, offset)?.inserted ?? null;
}

describe('rebaseListPaste', () => {
    it('rebases a four-space subtree onto an empty tab-indented item', () => {
        const copied = '- [ ] BULLET 1\n    - [ ] 1.1\n    - [ ] 1.2\n        - [ ] 1.2.1';
        const result = paste(copied, '- main\n\t- sub\n\t\t- |');

        expect(result).toBe('[ ] BULLET 1\n\t\t\t- [ ] 1.1\n\t\t\t- [ ] 1.2\n\t\t\t\t- [ ] 1.2.1');
    });

    it('rebases a tab subtree onto a space-indented item using the note step', () => {
        const copied = '- a\n\t- b';
        const result = paste(copied, '- main\n  - sub\n    - |');

        expect(result).toBe('a\n      - b');
    });

    it('keeps the destination marker for the root of an ordered paste', () => {
        expect(paste('- a\n\t- b', '1. first\n\t1. |')).toBe('a\n\t\t- b');
    });

    it('keeps ordered markers and their literal numbers on child lines', () => {
        expect(paste('1. a\n    3) b', '- item\n\t- |')).toBe('a\n\t\t3) b');
    });

    it('keeps a second root as a sibling of the destination item', () => {
        expect(paste('- a\n- b', '- main\n\t- |')).toBe('a\n\t- b');
    });

    it('carries the destination marker onto every root, numbering ordered ones onward', () => {
        expect(paste('- a\n- b\n- c', '1. one\n2. |')).toBe('a\n3. b\n4. c');
        expect(paste('1. a\n2. b', '- main\n- |')).toBe('a\n- b');
        expect(paste('- a\n- [x] b', '1. |')).toBe('a\n2. [x] b');
    });

    it('indents children of a renumbered root past its marker', () => {
        expect(paste('- a\n- b\n    - b1', '9. |')).toBe('a\n10. b\n    - b1');
    });

    it('keeps the pasted checkbox when the destination item is plain', () => {
        expect(paste('- [x] a\n\t- [ ] b', '- |')).toBe('[x] a\n\t- [ ] b');
    });

    it('drops the pasted checkbox when the destination already has one in the same state', () => {
        expect(paste('- [ ] a\n\t- [x] b', '- [ ] |')).toBe('a\n\t- [x] b');
    });

    it('replaces the destination checkbox when the pasted state differs', () => {
        const document = '- [ ] ';
        const result = rebaseListPaste('- [x] a\n- [x] b', document, document.length, document.length);

        // The replacement starts at the checkbox, so both tasks keep their copied state
        expect(result).toEqual({ inserted: '[x] a\n- [x] b', from: 2 });
    });

    it('inserts below a destination item that already has content, as its children', () => {
        const result = paste('- a\n\t- b', '- main\n\t- sub|');

        expect(result).toBe('\n\t\t- a\n\t\t\t- b');
    });

    it('passes blank lines through, keeping a loose list loose', () => {
        expect(paste('- a\n\n\t- b', '- main\n\t- |')).toBe('a\n\n\t\t- b');
    });

    it('keeps a trailing newline from a line copy', () => {
        expect(paste('- a\n\t- b\n', '- main\n\t- |')).toBe('a\n\t\t- b\n');
    });

    it('tolerates CRLF line endings', () => {
        expect(paste('- a\r\n\t- b', '- main\n\t- |')).toBe('a\n\t\t- b');
    });

    it('follows the source step when the destination is at the margin', () => {
        expect(paste('- a\n    - b', '- |')).toBe('a\n    - b');
        expect(paste('- a\n\t- b', '- |')).toBe('a\n\t- b');
    });

    it('indents children past a wide ordered destination marker', () => {
        expect(paste('- a\n    - b', '100. |')).toBe('a\n        - b');
        expect(paste('- a\n\t- b', '1. x\n\t100. |')).toBe('a\n\t\t\t- b');
    });

    it('indents grandchildren past a wide ordered marker inside the paste', () => {
        expect(paste('1. a\n    100. b\n        - c', '- |')).toBe('a\n    100. b\n            - c');
    });

    it('reads depth per branch, so content-aligned steps of different widths stay siblings', () => {
        const copied = '1. alpha\n   - note a\n10. tenth\n    - note t';
        expect(paste(copied, '- item\n\t- |')).toBe('alpha\n\t\t- note a\n\t- tenth\n\t\t- note t');
        expect(paste('- a\n  - a1\n- b\n    - b1', '- x\n\t- |')).toBe('a\n\t\t- a1\n\t- b\n\t\t- b1');
    });

    it('keeps spaces for the step behind a space-indented destination', () => {
        // A tab behind two spaces stops at column four, short of the ordered marker
        expect(paste('- a\n\t- b', 'Shopping:\n  1. |')).toBe('a\n      - b');
    });

    it('leaves a root from a different list family unconverted', () => {
        expect(paste('- a\n1. b', '- |')).toBe('a\n1. b');
    });

    it('declines a clipboard containing a horizontal rule', () => {
        expect(paste('- - -\n- item', '1. |')).toBeNull();
        expect(paste('- item\n* * *', '- |')).toBeNull();
    });

    it('normalises an irregular source against its smallest step', () => {
        const copied = '- a\n        - b\n            - c\n                - d';
        expect(paste(copied, '- main\n\t- |')).toBe('a\n\t\t- b\n\t\t\t- c\n\t\t\t\t- d');
    });

    it('replaces a selected item text with the pasted tree', () => {
        const document = '- main\n\t- old text';
        const start = document.indexOf('old');
        const result = rebaseListPaste('- a\n\t- b', document, start, document.length);

        expect(result).toEqual({ inserted: 'a\n\t\t- b', from: start });
    });

    it('declines a clipboard that is not purely a list', () => {
        expect(paste('Intro\n- a', '- |')).toBeNull();
        expect(paste('- a\nprose line', '- |')).toBeNull();
        expect(paste('- a\n\t- b', '')).toBeNull();
    });

    it('declines a single item and an empty clipboard', () => {
        expect(paste('- a', '- |')).toBeNull();
        expect(paste('- a\n', '- |')).toBeNull();
        expect(paste('', '- |')).toBeNull();
    });

    it('declines a clipboard whose first line is blank or above its siblings', () => {
        expect(paste('\n- a\n\t- b', '- |')).toBeNull();
        expect(paste('\t- a\n- b', '- |')).toBeNull();
    });

    it('declines when the cursor is not on a list item', () => {
        expect(paste('- a\n\t- b', 'Some prose |')).toBeNull();
        expect(paste('- a\n\t- b', '# Heading |')).toBeNull();
    });

    it('declines when text follows the cursor on the destination line', () => {
        expect(paste('- a\n\t- b', '- before | after')).toBeNull();
    });

    it('declines when the cursor sits inside the marker', () => {
        expect(paste('- a\n\t- b', '- main\n\t|- sub')).toBeNull();
    });

    it('declines a selection that spans lines', () => {
        const document = '- main\n\t- sub\n\t- more';
        expect(rebaseListPaste('- a\n\t- b', document, document.indexOf('sub'), document.length)).toBeNull();
    });
});
