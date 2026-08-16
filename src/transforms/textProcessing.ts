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
import { markdownSyntaxRanges } from './typography';

/** Placement of a comma next to a closing double quotation mark. */
export type TextCommaPlacement = 'inside' | 'outside';

export interface TextProcessingResult {
    text: string;
    changed: boolean;
}

/** Places commas consistently next to closing straight or curly double quotes. */
export function applyCommaPlacement(input: string, placement: TextCommaPlacement): TextProcessingResult {
    // A comma next to a quote inside frontmatter, a wikilink or other syntax is data
    // punctuation, not prose style
    const protectedRanges = [...markdownCodeRanges(input), ...markdownSyntaxRanges(input)];
    const pattern = placement === 'inside' ? /["\u201D],/g : /,["\u201D]/g;
    const text = input.replace(pattern, (match, offset: number) => {
        if (overlapsRange(protectedRanges, offset, offset + match.length)) return match;
        // The move is only safe when quoted prose ends right before the match: for
        // inside mode the quote must close a word, for outside mode the comma must
        // follow one. Anything else, such as a quoted separator ", ", a quoted comma
        // "," or an empty "", is content and stays exactly where it is. Digits do not
        // count as prose, because a straight quote after a number is usually an inch
        // mark (the 27" model) or an attribute value (width="10"), not a quotation.
        if (!/[\p{L}\p{M}]/u.test(input[offset - 1] ?? '')) return match;

        // The move happens only when a plain space follows, which is how the
        // quotation sits mid-sentence in prose. Anything else is data: a quote or
        // comma means CSV fields, a tab means a TSV row, a word means a missing
        // space in front of a new quotation, and a line end means a CSV row or a
        // pretty-printed JSON line.
        if (input[offset + match.length] !== ' ') return match;

        // A quote or bracket behind the space reads as another value in single-line
        // JSON, such as {"name":"Anna", "city":"Berg"}, just as well as an
        // enumeration of quoted words, so the comma stays put
        if (/["“”[{]/.test(input[offset + match.length + 1] ?? '')) return match;

        // A straight quote is directionless, so it only closes a quotation when an
        // earlier quote on the line opened one. Without that the match sits at a
        // field start, as in: name," John Smith",age
        const quote = placement === 'inside' ? match[0] : match[1];
        if (quote === '"') {
            let opened = false;
            for (let i = input.lastIndexOf('\n', offset - 1) + 1; i < offset; i++) {
                if (input[i] === '"') opened = !opened;
            }
            if (!opened) return match;
        }
        return placement === 'inside' ? `,${match[0]}` : `${match[1]},`;
    });

    return { text, changed: text !== input };
}
