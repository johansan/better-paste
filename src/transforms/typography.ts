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

import type { TextDashStyle, TextQuoteStyle } from '../settings/types';
import { markdownCodeRanges, overlapsRange } from './markdownRanges';
import type { ProtectedRange } from './urlCleanup';

/*
 * Every pattern and replacement is built from escape strings rather than literal
 * characters, because the whole point of these rules is that the characters are invisible
 * or easily confused in a source file.
 */

/** Em dash and en dash, both replaced by a hyphen in the hyphen style. */
const DASHES = new RegExp('[\\u2013\\u2014]', 'g');

/**
 * Curly double quotes, including the low-9 form German uses as an opening quote.
 *
 * The guillemets « » are deliberately absent: they are the ordinary quotation marks of
 * French, Russian and several other languages, so replacing them would not be tidying up
 * pasted text, it would be rewriting correctly set text.
 */
const DOUBLE_QUOTES = new RegExp('[\\u201C\\u201D\\u201E\\u201F]', 'g');

/**
 * Curly single quotes. U+2019 matters most of the three: it is the character assistants
 * and web pages use for an apostrophe, so "don’t" becomes "don't".
 */
const SINGLE_QUOTES = new RegExp('[\\u2018\\u2019\\u201A\\u201B]', 'g');

/**
 * Spaces that are not the ordinary space: no-break, narrow no-break, figure, punctuation,
 * and the en/em/thin/hair quad family. All become a plain space.
 *
 * The ideographic space U+3000 is left alone: it is the normal word space in CJK text and
 * is a full character wide, so swapping it for an ASCII space changes the layout of a
 * sentence that was set correctly.
 */
const EXOTIC_SPACE = new RegExp('[\\u00A0\\u1680\\u2000-\\u200A\\u202F\\u205F]');

/**
 * Every character handled by the invisible-character pass. Bidirectional overrides are
 * included because they can make text render in an order unrelated to its source. Direction
 * marks, embeddings and isolates are kept because they carry meaning in mixed-direction text.
 * The zero-width joiner and non-joiner are also kept because they hold emoji and letters
 * together in scripts where removing them would corrupt the text.
 */
const NORMALIZED_CHARACTERS = new RegExp('[\\u00A0\\u1680\\u2000-\\u200A\\u202F\\u205F\\u00AD\\u200B\\uFEFF\\u202D\\u202E]', 'g');

/**
 * A dash acting as a separator between words: a hyphen or en dash set off by single
 * spaces, or an em dash with or without them. An em dash is always a separator, but a
 * hyphen or en dash without spaces joins a compound or a range and is left alone.
 */
const DASH_SEPARATOR = new RegExp(' [-\\u2013] | ?\\u2014 ?', 'g');

const EM_DASH = '\u2014';
const EN_DASH = '\u2013';

/** Blockquote markers and indentation, everything a line may hold before its content starts. */
const LINE_PREFIX = new RegExp('^(?: {0,3}>[ \\t]?)* {0,3}$');

/** Characters after which a straight quote opens rather than closes. */
const OPENS_AFTER = new RegExp('[\\s([{\\u2018\\u201C\\u2013\\u2014-]');

export interface TypographyResult {
    text: string;
    changed: boolean;
}

/**
 * Replaces the characters that look ordinary but are not: exotic spaces become plain
 * spaces, selected zero-width characters and bidirectional overrides are dropped.
 *
 * Runs before the other text rules, because a no-break space is not whitespace to a
 * regular expression. Leaving one in place would defeat the terminal rule's blank-line
 * and indentation detection.
 */
export function normalizeInvisibleCharacters(input: string, protect: readonly ProtectedRange[] = []): TypographyResult {
    const text = input.replace(NORMALIZED_CHARACTERS, (match, offset: number) => {
        if (overlapsRange(protect, offset, offset + match.length)) return match;
        return EXOTIC_SPACE.test(match) ? ' ' : '';
    });
    return { text, changed: text !== input };
}

/**
 * Converts quotation marks and apostrophes to the chosen style.
 *
 * Runs after the structural rules like the dash rule, and before the comma rule, which
 * recognizes straight and curly closing quotes alike.
 */
export function applyQuoteStyle(input: string, style: TextQuoteStyle, protect: readonly ProtectedRange[] = []): TypographyResult {
    if (style === 'none') return { text: input, changed: false };

    const protectedRanges = [...markdownCodeRanges(input), ...protect];
    const outsideCode = (match: string, offset: number, replacement: string): string =>
        overlapsRange(protectedRanges, offset, offset + match.length) ? match : replacement;

    if (style === 'straight') {
        const text = input
            .replace(DOUBLE_QUOTES, (match, offset: number) => outsideCode(match, offset, '"'))
            .replace(SINGLE_QUOTES, (match, offset: number) => outsideCode(match, offset, "'"));
        return { text, changed: text !== input };
    }

    // Each replacement is one UTF-16 unit for one, so every offset stays valid for the
    // protected ranges and for the context checks of the single-quote pass below
    let text = input.replace(/"/g, (match, offset: number) => {
        const opening = offset === 0 || OPENS_AFTER.test(input[offset - 1]);
        return outsideCode(match, offset, opening ? '\u201C' : '\u201D');
    });

    text = text.replace(/'/g, (match, offset: number) => {
        const previous = text[offset - 1];
        // An apostrophe inside or at the end of a word, and a decade such as '90s
        if (previous !== undefined && /[\p{L}\p{N}]/u.test(previous)) return outsideCode(match, offset, '\u2019');
        if (/^\d\ds\b/.test(text.slice(offset + 1, offset + 5))) return outsideCode(match, offset, '\u2019');

        const opening = previous === undefined || OPENS_AFTER.test(previous);
        return outsideCode(match, offset, opening ? '\u2018' : '\u2019');
    });

    return { text, changed: text !== input };
}

/**
 * Converts dashes to the chosen style.
 *
 * Runs after the terminal rule, not before it. A hyphen is a list marker, so converting
 * a leading long dash to a hyphen first would make the terminal rule read that line as a
 * bullet: it would refuse to rejoin the wrapped paragraph and would render the sentence
 * as a list item. Doing it last means the dash is still a dash while line structure is
 * decided.
 */
export function applyDashStyle(input: string, style: TextDashStyle, protect: readonly ProtectedRange[] = []): TypographyResult {
    if (style === 'none') return { text: input, changed: false };
    if (style === 'hyphen') return replaceDashesWithHyphens(input, protect);

    const protectedRanges = [...markdownCodeRanges(input), ...protect];
    const separator = style === 'en' ? ` ${EN_DASH} ` : style === 'em' ? EM_DASH : ` ${EM_DASH} `;
    const dash = style === 'en' ? EN_DASH : EM_DASH;

    // True when the line holds nothing but blockquote markers before this offset, so a
    // spaced hyphen that is really a list marker is never rewritten
    const startsLine = (offset: number): boolean => {
        const lineStart = input.lastIndexOf('\n', offset - 1) + 1;
        return LINE_PREFIX.test(input.slice(lineStart, offset));
    };

    const text = input.replace(DASH_SEPARATOR, (match, offset: number) => {
        if (overlapsRange(protectedRanges, offset, offset + match.length)) return match;

        const before = input[offset - 1];
        const after = input[offset + match.length];
        const between = before !== undefined && after !== undefined && !/\s/.test(before) && !/\s/.test(after) && !startsLine(offset);
        if (between) return separator;

        // An em dash at the start or end of a line, such as a quote attribution, keeps
        // its spacing and only swaps the character. A hyphen there is structure, not prose.
        return match.includes(EM_DASH) ? match.replace(EM_DASH, dash) : match;
    });

    return { text, changed: text !== input };
}

/** Turns em and en dashes into hyphens, including the ones that join ranges. */
function replaceDashesWithHyphens(input: string, protect: readonly ProtectedRange[]): TypographyResult {
    const protectedRanges = [...markdownCodeRanges(input), ...protect];

    let text = input.replace(DASHES, (match, offset: number) =>
        overlapsRange(protectedRanges, offset, offset + match.length) ? match : '-'
    );

    // A long dash at the start of a line is prose. Escaping the replacement keeps it from
    // becoming a list item or thematic break when Obsidian renders the Markdown.
    const sourceLines = input.split('\n');
    text = text
        .split('\n')
        .map((line, index) => {
            if (!/^(?: {0,3}>[ \t]?)* {0,3}[\u2013\u2014]/.test(sourceLines[index] ?? '')) return line;
            if (!/^(?: {0,3}>[ \t]?)* {0,3}(?:-(?:[ \t]|$)|-{3,}[ \t]*$)/.test(line)) return line;
            return line.replace(/^((?: {0,3}>[ \t]?)* {0,3})-/, '$1\\-');
        })
        .join('\n');

    return { text, changed: text !== input };
}
