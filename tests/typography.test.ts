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
import { applyDashStyle, applyQuoteStyle, normalizeInvisibleCharacters } from '../src/transforms/typography';
import { httpUrlRanges } from '../src/transforms/urlCleanup';
import type { TextDashStyle, TextQuoteStyle } from '../src/settings/types';

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

/** Applies a rule the way the pipeline does, with pasted URLs protected. */
const quotes = (text: string, style: TextQuoteStyle): string => applyQuoteStyle(text, style, httpUrlRanges(text)).text;
const dashes = (text: string, style: TextDashStyle): string => applyDashStyle(text, style, httpUrlRanges(text)).text;
const clean = (text: string): string => normalizeInvisibleCharacters(text, httpUrlRanges(text)).text;

describe('applyDashStyle: hyphens', () => {
    it('replaces an em dash with a hyphen', () => {
        expect(dashes(`a ${EM_DASH} b`, 'hyphen')).toBe('a - b');
    });

    it('replaces an en dash with a hyphen, including in a range', () => {
        expect(dashes(`2020${EN_DASH}2024`, 'hyphen')).toBe('2020-2024');
    });

    it('leaves dashes alone when the style is no change', () => {
        expect(dashes(`a ${EM_DASH} b`, 'none')).toBe(`a ${EM_DASH} b`);
    });

    it('leaves an ordinary hyphen alone', () => {
        expect(dashes('well-known', 'hyphen')).toBe('well-known');
    });

    it('reports that dashes were replaced', () => {
        expect(applyDashStyle(`a ${EM_DASH} b`, 'hyphen').changed).toBe(true);
        expect(applyDashStyle('a - b', 'hyphen').changed).toBe(false);
    });

    it('does not create Markdown blocks from line-leading long dashes', () => {
        expect(applyDashStyle('\u2014 A sentence', 'hyphen').text).toBe('\\- A sentence');
        expect(applyDashStyle('\u2014\u2014\u2014', 'hyphen').text).toBe('\\---');
    });

    it('does not create a list item from a blockquoted attribution', () => {
        expect(applyDashStyle('> \u2014 Author', 'hyphen').text).toBe('> \\- Author');
    });
});

describe('applyDashStyle: en and em dashes', () => {
    it('turns a spaced hyphen into a spaced en dash', () => {
        expect(dashes('progress - finally', 'en')).toBe(`progress ${EN_DASH} finally`);
    });

    it('turns a spaced hyphen into a closed em dash', () => {
        expect(dashes('progress - finally', 'em')).toBe(`progress${EM_DASH}finally`);
    });

    it('turns a spaced hyphen into a spaced em dash', () => {
        expect(dashes('progress - finally', 'em-spaced')).toBe(`progress ${EM_DASH} finally`);
    });

    it('converts an em dash regardless of its spacing', () => {
        expect(dashes(`word${EM_DASH}word`, 'en')).toBe(`word ${EN_DASH} word`);
        expect(dashes(`word ${EM_DASH} word`, 'en')).toBe(`word ${EN_DASH} word`);
        expect(dashes(`word ${EM_DASH} word`, 'em')).toBe(`word${EM_DASH}word`);
        expect(dashes(`word${EM_DASH}word`, 'em-spaced')).toBe(`word ${EM_DASH} word`);
    });

    it('converts a spaced en dash but leaves an unspaced range alone', () => {
        expect(dashes(`a ${EN_DASH} b`, 'em')).toBe(`a${EM_DASH}b`);
        expect(dashes(`1990${EN_DASH}1995`, 'em')).toBe(`1990${EN_DASH}1995`);
    });

    it('leaves compounds, ranges and flags alone', () => {
        expect(dashes('well-known', 'em')).toBe('well-known');
        expect(dashes('2020-2024', 'en')).toBe('2020-2024');
        expect(dashes('npm install --save-dev', 'em')).toBe('npm install --save-dev');
    });

    it('leaves list markers alone', () => {
        expect(dashes('- item', 'em')).toBe('- item');
        expect(dashes(' - item', 'em')).toBe(' - item');
        expect(dashes('> - item', 'em')).toBe('> - item');
    });

    it('only swaps the character in a line-leading attribution dash', () => {
        expect(dashes(`${EM_DASH} Author`, 'en')).toBe(`${EN_DASH} Author`);
        expect(dashes(`> ${EM_DASH} Author`, 'em')).toBe(`> ${EM_DASH} Author`);
    });

    it('leaves dashes inside Markdown code alone', () => {
        const input = ['```text', 'a - b', '```', 'c - d'].join('\n');
        expect(dashes(input, 'em')).toBe(['```text', 'a - b', '```', `c${EM_DASH}d`].join('\n'));
        expect(dashes('`a - b`', 'en')).toBe('`a - b`');
    });

    it('leaves dashes inside URLs alone', () => {
        const input = `![photo](https://example.com/Foo${EM_DASH}Bar.png)`;
        expect(dashes(input, 'hyphen')).toBe(input);
        expect(dashes(input, 'en')).toBe(input);
    });

    it('reports that dashes were converted', () => {
        expect(applyDashStyle('a - b', 'em').changed).toBe(true);
        expect(applyDashStyle(`a${EM_DASH}b`, 'em').changed).toBe(false);
    });
});

describe('applyQuoteStyle: straight', () => {
    it('straightens curly double quotes', () => {
        expect(quotes('\u201Chello\u201D', 'straight')).toBe('"hello"');
        expect(quotes('\u201Elow\u201C', 'straight')).toBe('"low"');
    });

    it('straightens curly single quotes and the curly apostrophe', () => {
        expect(quotes('\u2018hi\u2019', 'straight')).toBe("'hi'");
        expect(quotes('don\u2019t', 'straight')).toBe("don't");
    });

    it('leaves guillemets alone, being real quotation marks in several languages', () => {
        expect(quotes('\u00ABbonjour\u00BB', 'straight')).toBe('\u00ABbonjour\u00BB');
    });

    it('leaves straight quotes alone', () => {
        expect(quotes(`a "b" 'c'`, 'straight')).toBe(`a "b" 'c'`);
    });

    it('leaves quotes alone when the style is no change', () => {
        expect(quotes('\u201Chello\u201D', 'none')).toBe('\u201Chello\u201D');
    });

    it('leaves quotes inside Markdown code alone', () => {
        const input = ['`\u201Cinline\u201D`', '```text', '\u201Cquoted\u201D value', '```', '\u201Cprose\u201D'].join('\n');
        expect(quotes(input, 'straight')).toBe(
            ['`\u201Cinline\u201D`', '```text', '\u201Cquoted\u201D value', '```', '"prose"'].join('\n')
        );
    });

    it('leaves quotes inside a callout code fence alone', () => {
        const input = ['> [!note]', '> ```text', '> \u201Cquoted\u201D text', '> ```'].join('\n');
        expect(quotes(input, 'straight')).toBe(input);
    });

    it('leaves quotes inside URLs alone', () => {
        const input = '![photo](https://example.com/Don\u2019t.png)';
        expect(quotes(input, 'straight')).toBe(input);
    });
});

describe('applyQuoteStyle: curly', () => {
    it('curls a double-quoted phrase', () => {
        expect(quotes('"Fine," she said.', 'curly')).toBe('\u201CFine,\u201D she said.');
    });

    it('curls the apostrophe', () => {
        expect(quotes("Don't stop.", 'curly')).toBe('Don\u2019t stop.');
        expect(quotes("the dogs' bones", 'curly')).toBe('the dogs\u2019 bones');
    });

    it('curls a single-quoted phrase', () => {
        expect(quotes("'hi there'", 'curly')).toBe('\u2018hi there\u2019');
    });

    it('uses the closing form for a decade', () => {
        expect(quotes("the '90s", 'curly')).toBe('the \u201990s');
    });

    it('opens after a bracket, a newline and a nested quote', () => {
        expect(quotes('("yes")', 'curly')).toBe('(\u201Cyes\u201D)');
        expect(quotes('"a"\n"b"', 'curly')).toBe('\u201Ca\u201D\n\u201Cb\u201D');
        expect(quotes(`"'nested'"`, 'curly')).toBe('\u201C\u2018nested\u2019\u201D');
    });

    it('leaves quotes that are already curly alone', () => {
        expect(quotes('\u201CFine,\u201D she said.', 'curly')).toBe('\u201CFine,\u201D she said.');
    });

    it('leaves quotes inside Markdown code alone', () => {
        expect(quotes('`"code"`', 'curly')).toBe('`"code"`');
        const fenced = ['```json', '{"key": "value"}', '```'].join('\n');
        expect(quotes(fenced, 'curly')).toBe(fenced);
    });

    it('leaves an apostrophe inside a URL alone', () => {
        const input = "See https://example.com/Don't.png now";
        expect(quotes(input, 'curly')).toBe(input);
    });

    it('reports that quotes were curled', () => {
        expect(applyQuoteStyle('"q"', 'curly').changed).toBe(true);
        expect(applyQuoteStyle('plain', 'curly').changed).toBe(false);
    });
});

describe('normalizeInvisibleCharacters', () => {
    it('turns a no-break space into an ordinary space', () => {
        expect(clean(`10${NBSP}MB`)).toBe('10 MB');
        expect(clean(`a${NARROW_NBSP}b`)).toBe('a b');
    });

    it('removes zero-width and formatting characters', () => {
        expect(clean(`a${ZWSP}b${SOFT_HYPHEN}c${BOM}d`)).toBe('abcd');
    });

    it('removes bidirectional overrides', () => {
        expect(clean(`a${RLO}b`)).toBe('ab');
    });

    it('keeps the zero-width joiner, which holds emoji together', () => {
        // Stripping the joiner would break a family emoji into separate people
        const family = `\u{1F468}${ZWJ}\u{1F469}${ZWJ}\u{1F467}`;
        expect(clean(family)).toBe(family);
    });

    it('keeps the direction marks that make mixed Arabic and Latin render correctly', () => {
        // Same reasoning as the zero-width joiner: invisible, but load-bearing
        const LRM = '\u200E';
        const ISOLATE = '\u2067';
        expect(clean(`a${LRM}b${ISOLATE}c`)).toBe(`a${LRM}b${ISOLATE}c`);
    });

    it('keeps invisible characters that still carry text semantics', () => {
        expect(clean(`a${WORD_JOINER}b${MONGOLIAN_VOWEL_SEPARATOR}c`)).toBe(`a${WORD_JOINER}b${MONGOLIAN_VOWEL_SEPARATOR}c`);
        expect(clean(`a${LRE}b${PDF}c`)).toBe(`a${LRE}b${PDF}c`);
    });

    it('keeps the ideographic space, which is the word space in CJK text', () => {
        expect(clean('\u7530\u4E2D\u3000\u592A\u90CE')).toBe('\u7530\u4E2D\u3000\u592A\u90CE');
    });

    it('keeps the zero-width non-joiner, which is a letter in some scripts', () => {
        expect(clean(`a${ZWNJ}b`)).toBe(`a${ZWNJ}b`);
    });

    it('leaves targeted invisible characters inside URLs alone', () => {
        const input = 'https://example.com/foo\u200Bbar';
        expect(clean(input)).toBe(input);
    });

    it('reports that characters were removed', () => {
        expect(normalizeInvisibleCharacters(`a${ZWSP}b`).changed).toBe(true);
        expect(normalizeInvisibleCharacters('ab').changed).toBe(false);
    });

    it('leaves dashes and quotes to the separate rules', () => {
        // The rules run on either side of the terminal rule, so they must stay separable
        expect(normalizeInvisibleCharacters(`a ${EM_DASH} b`).text).toBe(`a ${EM_DASH} b`);
        expect(normalizeInvisibleCharacters('\u201Cq\u201D').text).toBe('\u201Cq\u201D');
    });

    it('leaves newlines and tabs alone', () => {
        expect(clean('a\n\tb')).toBe('a\n\tb');
    });

    it('handles a realistic assistant paragraph', () => {
        const input = `The result${NBSP}${EM_DASH}${NBSP}which nobody expected${NBSP}${EM_DASH}${NBSP}was fine.${ZWSP}`;
        expect(dashes(clean(input), 'hyphen')).toBe('The result - which nobody expected - was fine.');
    });
});
