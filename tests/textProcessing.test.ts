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
import { applyCommaPlacement } from '../src/transforms/textProcessing';

describe('applyCommaPlacement', () => {
    it('moves a comma outside a closing straight quote', () => {
        expect(applyCommaPlacement('He called it "finished," then left.', 'outside').text).toBe('He called it "finished", then left.');
    });

    it('moves a comma outside a closing curly quote', () => {
        expect(applyCommaPlacement('He called it “finished,” then left.', 'outside').text).toBe('He called it “finished”, then left.');
    });

    it('moves a comma inside a closing quote', () => {
        expect(applyCommaPlacement('He called it "finished", then left.', 'inside').text).toBe('He called it "finished," then left.');
    });

    it('leaves commas in Markdown code alone', () => {
        const input = ['`"value,"`', '```text', '"value,"', '```'].join('\n');
        expect(applyCommaPlacement(input, 'outside').text).toBe(input);
    });

    it('does nothing in the default mode', () => {
        const input = 'He called it "finished," then left.';
        expect(applyCommaPlacement(input, 'none')).toEqual({ text: input, changed: false });
    });
});
