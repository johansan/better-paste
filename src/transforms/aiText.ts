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
const EXOTIC_SPACES = new RegExp('[\\u00A0\\u1680\\u2000-\\u200A\\u202F\\u205F]', 'g');

/**
 * Characters that occupy no width and carry no meaning in a note: soft hyphen, Mongolian
 * vowel separator, zero-width space, word joiner, and the byte order mark.
 *
 * The zero-width joiner and non-joiner are deliberately NOT here. They look equally
 * invisible but they are load-bearing: the joiner is what holds a multi-part emoji
 * together, and both are ordinary letters-level content in Persian, Arabic and the Indic
 * scripts. Stripping them would corrupt text rather than tidy it.
 */
const INVISIBLE = new RegExp('[\\u00AD\\u180E\\u200B\\u2060\\uFEFF]', 'g');

/**
 * The deprecated bidirectional embeddings and overrides. Unicode itself has retired these
 * in favour of the isolates, and an override can make text render in an order that has
 * nothing to do with what it says.
 *
 * The direction marks U+200E and U+200F and the isolates U+2066-U+2069 are deliberately
 * NOT here, for the same reason as the zero-width joiner above: they are what makes mixed
 * Arabic or Hebrew and Latin text render in the right order. Removing them would corrupt
 * the display of correctly written text.
 */
const BIDI_CONTROLS = new RegExp('[\\u202A-\\u202E]', 'g');

export interface AiTextResult {
    text: string;
    changed: boolean;
}

/**
 * Replaces the characters that look ordinary but are not: exotic spaces become plain
 * spaces, zero-width and direction-control characters are dropped.
 *
 * Runs before the other text rules, because a no-break space is not whitespace to a
 * regular expression. Leaving one in place would defeat the terminal rule's blank-line
 * and indentation detection.
 */
export function normalizeInvisibleCharacters(input: string): AiTextResult {
    const text = input.replace(EXOTIC_SPACES, ' ').replace(INVISIBLE, '').replace(BIDI_CONTROLS, '');
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
export function replacePunctuation(input: string): AiTextResult {
    const text = input.replace(DASHES, '-').replace(DOUBLE_QUOTES, '"').replace(SINGLE_QUOTES, "'");
    return { text, changed: text !== input };
}

/**
 * Both halves of the rule in one pass, for the settings preview and for content that has
 * no line structure left to protect.
 */
export function cleanAiText(input: string, options: AiTextOptions): AiTextResult {
    const characters = normalizeInvisibleCharacters(input);
    const text = options.aiTextPlainPunctuation ? replacePunctuation(characters.text).text : characters.text;
    return { text, changed: text !== input };
}
