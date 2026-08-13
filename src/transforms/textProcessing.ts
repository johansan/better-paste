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

import { markdownCodeRanges, overlapsRange } from './markdownRanges';
import type { TextCommaPlacement } from '../settings/types';

export interface TextProcessingResult {
    text: string;
    changed: boolean;
}

/** Places commas consistently next to closing straight or curly double quotes. */
export function applyCommaPlacement(input: string, placement: TextCommaPlacement): TextProcessingResult {
    if (placement === 'none') return { text: input, changed: false };

    const protectedRanges = markdownCodeRanges(input);
    const pattern = placement === 'inside' ? /["\u201D],/g : /,["\u201D]/g;
    const text = input.replace(pattern, (match, offset: number) => {
        if (overlapsRange(protectedRanges, offset, offset + match.length)) return match;
        return placement === 'inside' ? `,${match[0]}` : `${match[1]},`;
    });

    return { text, changed: text !== input };
}
