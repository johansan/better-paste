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

import type { BetterPasteSettings } from '../settings/types';
import { markdownCodeRanges, overlapsRange } from './markdownRanges';
import { httpUrlRanges } from './urlCleanup';
import type { ProtectedRange } from './urlCleanup';

/** Subset of settings this rule reads, so tests can build one without a full settings object. */
export type AiTextOptions = Pick<BetterPasteSettings, 'aiTextPlainPunctuation'>;

/*
 * Every pattern is built from escape strings rather than literal characters, because the
 * whole point of this rule is that these characters are invisible or easily confused in
 * a source file.
 */

/** Em dash and en dash, both of which AI assistants use where a writer would type a hyphen. */
const DASHES = new RegExp('[\\u2013\\u2014]', 'g');

/**
 * Curly double quotes, including the low-9 form German uses as an opening quote.
 *
 * The guillemets « » are deliberately absent: they are the ordinary quotation marks of
 * French, Russian and several other languages, so replacing them would not be tidying up
 * after an assistant, it would be rewriting correctly set text.
 */
const DOUBLE_QUOTES = new RegExp('[\\u201C\\u201D\\u201E\\u201F]', 'g');

/**
 * Curly single quotes. U+2019 matters most of the three: it is the character assistants
 * and web pages use for an apostrophe, so "don\u2019t" becomes "don't".
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

export interface AiTextResult {
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
export function normalizeInvisibleCharacters(input: string, protect: readonly ProtectedRange[] = []): AiTextResult {
    const text = input.replace(NORMALIZED_CHARACTERS, (match, offset: number) => {
        if (overlapsRange(protect, offset, offset + match.length)) return match;
        return EXOTIC_SPACE.test(match) ? ' ' : '';
    });
    return { text, changed: text !== input };
}

/**
 * Turns typographic punctuation into its plain ASCII equivalent: em and en dashes become
 * hyphens, curly quotes become straight ones.
 *
 * Runs after the terminal rule, not before it. A hyphen is a list marker, so converting
 * a leading long dash to a hyphen first would make the terminal rule read that line as a bullet:
 * it would refuse to rejoin the wrapped paragraph and would render the sentence as a list
 * item. Doing it last means the dash is still a dash while line structure is decided.
 */
export function replacePunctuation(input: string, protect: readonly ProtectedRange[] = []): AiTextResult {
    const protectedRanges = [...markdownCodeRanges(input), ...protect];
    const outsideCode = (match: string, offset: number, replacement: string): string =>
        overlapsRange(protectedRanges, offset, offset + match.length) ? match : replacement;

    let text = input
        .replace(DASHES, (match, offset: number) => outsideCode(match, offset, '-'))
        .replace(DOUBLE_QUOTES, (match, offset: number) => outsideCode(match, offset, '"'))
        .replace(SINGLE_QUOTES, (match, offset: number) => outsideCode(match, offset, "'"));

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

/**
 * Both halves of the rule in one pass, for the settings preview and for content that has
 * no line structure left to protect.
 */
export function cleanAiText(input: string, options: AiTextOptions): AiTextResult {
    const characters = normalizeInvisibleCharacters(input, httpUrlRanges(input));
    const text = options.aiTextPlainPunctuation
        ? replacePunctuation(characters.text, httpUrlRanges(characters.text)).text
        : characters.text;
    return { text, changed: text !== input };
}
