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
import { cleanAiText, normalizeInvisibleCharacters, replacePunctuation } from '../src/transforms/aiText';

const ON = { aiTextPlainPunctuation: true };
const PLAIN_OFF = { aiTextPlainPunctuation: false };

// Written as escapes so this file stays plain ASCII
const NBSP = '\u00A0';
const NARROW_NBSP = '\u202F';
const ZWSP = '\u200B';
const ZWJ = '\u200D';
const ZWNJ = '\u200C';
const SOFT_HYPHEN = '\u00AD';
const WORD_JOINER = '\u2060';
const MONGOLIAN_VOWEL_SEPARATOR = '\u180E';
const BOM = '\uFEFF';
const RLO = '\u202E';
const LRE = '\u202A';
const PDF = '\u202C';
const EM_DASH = '\u2014';
const EN_DASH = '\u2013';

describe('cleanAiText: punctuation', () => {
    it('replaces an em dash with a hyphen', () => {
        expect(cleanAiText(`a ${EM_DASH} b`, ON).text).toBe('a - b');
    });

    it('replaces an en dash with a hyphen', () => {
        expect(cleanAiText(`2020${EN_DASH}2024`, ON).text).toBe('2020-2024');
    });

    it('leaves punctuation alone when that is switched off', () => {
        expect(cleanAiText(`a ${EM_DASH} b`, PLAIN_OFF).text).toBe(`a ${EM_DASH} b`);
        expect(cleanAiText('\u201Chello\u201D', PLAIN_OFF).text).toBe('\u201Chello\u201D');
    });

    it('straightens curly double quotes', () => {
        expect(cleanAiText('\u201Chello\u201D', ON).text).toBe('"hello"');
        expect(cleanAiText('\u201Elow\u201C', ON).text).toBe('"low"');
    });

    it('straightens curly single quotes and the curly apostrophe', () => {
        expect(cleanAiText('\u2018hi\u2019', ON).text).toBe("'hi'");
        expect(cleanAiText('don\u2019t', ON).text).toBe("don't");
    });

    it('leaves guillemets alone, being real quotation marks in several languages', () => {
        expect(cleanAiText('\u00ABbonjour\u00BB', ON).text).toBe('\u00ABbonjour\u00BB');
    });

    it('leaves straight quotes and hyphens alone', () => {
        expect(cleanAiText(`a "b" 'c' well-known`, ON).text).toBe(`a "b" 'c' well-known`);
    });

    it('leaves an ordinary hyphen alone', () => {
        expect(cleanAiText('well-known', ON).text).toBe('well-known');
    });

    it('reports that punctuation was replaced', () => {
        expect(replacePunctuation(`a ${EM_DASH} b`).changed).toBe(true);
        expect(replacePunctuation('\u201Cq\u201D').changed).toBe(true);
        expect(replacePunctuation(`a - b "q"`).changed).toBe(false);
    });

    it('leaves punctuation inside Markdown code alone', () => {
        const input = ['`\u201Cinline\u201D`', '```text', '\u201Cquoted\u201D\u2014value', '```', '\u201Cprose\u201D'].join('\n');
        expect(replacePunctuation(input).text).toBe(
            ['`\u201Cinline\u201D`', '```text', '\u201Cquoted\u201D\u2014value', '```', '"prose"'].join('\n')
        );
    });

    it('does not create Markdown blocks from line-leading long dashes', () => {
        expect(replacePunctuation('\u2014 A sentence').text).toBe('\\- A sentence');
        expect(replacePunctuation('\u2014\u2014\u2014').text).toBe('\\---');
    });
});

describe('cleanAiText: invisible characters', () => {
    it('turns a no-break space into an ordinary space', () => {
        expect(cleanAiText(`10${NBSP}MB`, ON).text).toBe('10 MB');
        expect(cleanAiText(`a${NARROW_NBSP}b`, ON).text).toBe('a b');
    });

    it('removes zero-width and formatting characters', () => {
        expect(cleanAiText(`a${ZWSP}b${SOFT_HYPHEN}c${BOM}d`, ON).text).toBe('abcd');
    });

    it('removes bidirectional overrides', () => {
        expect(cleanAiText(`a${RLO}b`, ON).text).toBe('ab');
    });

    it('keeps the zero-width joiner, which holds emoji together', () => {
        // Stripping the joiner would break a family emoji into separate people
        const family = `\u{1F468}${ZWJ}\u{1F469}${ZWJ}\u{1F467}`;
        expect(cleanAiText(family, ON).text).toBe(family);
    });

    it('keeps the direction marks that make mixed Arabic and Latin render correctly', () => {
        // Same reasoning as the zero-width joiner: invisible, but load-bearing
        const LRM = '\u200E';
        const ISOLATE = '\u2067';
        expect(cleanAiText(`a${LRM}b${ISOLATE}c`, ON).text).toBe(`a${LRM}b${ISOLATE}c`);
    });

    it('keeps invisible characters that still carry text semantics', () => {
        expect(cleanAiText(`a${WORD_JOINER}b${MONGOLIAN_VOWEL_SEPARATOR}c`, ON).text).toBe(`a${WORD_JOINER}b${MONGOLIAN_VOWEL_SEPARATOR}c`);
        expect(cleanAiText(`a${LRE}b${PDF}c`, ON).text).toBe(`a${LRE}b${PDF}c`);
    });

    it('keeps the ideographic space, which is the word space in CJK text', () => {
        expect(cleanAiText('\u7530\u4E2D\u3000\u592A\u90CE', ON).text).toBe('\u7530\u4E2D\u3000\u592A\u90CE');
    });

    it('keeps the zero-width non-joiner, which is a letter in some scripts', () => {
        expect(cleanAiText(`a${ZWNJ}b`, ON).text).toBe(`a${ZWNJ}b`);
    });

    it('cleans invisible characters even when dash replacement is off', () => {
        expect(cleanAiText(`a${ZWSP}b`, PLAIN_OFF).text).toBe('ab');
    });

    it('reports that characters were removed', () => {
        expect(normalizeInvisibleCharacters(`a${ZWSP}b`).changed).toBe(true);
        expect(normalizeInvisibleCharacters('ab').changed).toBe(false);
    });

    it('leaves punctuation to the separate pass', () => {
        // The two halves run either side of the terminal rule, so they must stay separable
        expect(normalizeInvisibleCharacters(`a ${EM_DASH} b`).text).toBe(`a ${EM_DASH} b`);
        expect(normalizeInvisibleCharacters('\u201Cq\u201D').text).toBe('\u201Cq\u201D');
    });
});

describe('cleanAiText', () => {
    it('reports no change for text that needs none', () => {
        const result = cleanAiText('Ordinary text, nothing to do.', ON);
        expect(result.changed).toBe(false);
        expect(result.text).toBe('Ordinary text, nothing to do.');
    });

    it('leaves newlines and tabs alone', () => {
        expect(cleanAiText('a\n\tb', ON).text).toBe('a\n\tb');
    });

    it('handles a realistic assistant paragraph', () => {
        const input = `The result${NBSP}${EM_DASH}${NBSP}which nobody expected${NBSP}${EM_DASH}${NBSP}was fine.${ZWSP}`;
        expect(cleanAiText(input, ON).text).toBe('The result - which nobody expected - was fine.');
    });
});
