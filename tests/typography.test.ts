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
import { normalizeInvisibleCharacters, straightenDashes, straightenQuotes } from '../src/transforms/typography';
import { httpUrlRanges } from '../src/transforms/urlCleanup';

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
const quotes = (text: string): string => straightenQuotes(text, httpUrlRanges(text)).text;
const dashes = (text: string): string => straightenDashes(text, httpUrlRanges(text)).text;
const clean = (text: string): string => normalizeInvisibleCharacters(text, httpUrlRanges(text)).text;

describe('straightenDashes', () => {
    it('replaces an em dash with a hyphen', () => {
        expect(dashes(`a ${EM_DASH} b`)).toBe('a - b');
    });

    it('replaces an en dash with a hyphen, including in a range', () => {
        expect(dashes(`2020${EN_DASH}2024`)).toBe('2020-2024');
    });

    it('leaves an ordinary hyphen alone', () => {
        expect(dashes('well-known')).toBe('well-known');
    });

    it('reports that dashes were replaced', () => {
        expect(straightenDashes(`a ${EM_DASH} b`).changed).toBe(true);
        expect(straightenDashes('a - b').changed).toBe(false);
    });

    it('does not create Markdown blocks from line-leading long dashes', () => {
        expect(straightenDashes('\u2014 A sentence').text).toBe('\\- A sentence');
        expect(straightenDashes('\u2014\u2014\u2014').text).toBe('\\---');
    });

    it('does not create a list item from a blockquoted attribution', () => {
        expect(straightenDashes('> \u2014 Author').text).toBe('> \\- Author');
    });

    it('escapes the leading dash of a dash-space-dash line, not the second one', () => {
        expect(straightenDashes('\u2013 \u2013 x').text).toBe('\\- - x');
    });

    it('escapes a dash converted right after a list marker, which would nest a list', () => {
        expect(straightenDashes('- \u2014 Author').text).toBe('- \\- Author');
        expect(straightenDashes('1. \u2014 note').text).toBe('1. \\- note');
    });

    it('escapes a two-dash line, which would underline the paragraph above', () => {
        expect(straightenDashes('Best regards\n\u2014\u2014\nJohan').text).toBe('Best regards\n\\--\nJohan');
    });

    it('escapes across CRLF line endings', () => {
        expect(straightenDashes('Intro\r\n\u2014\u2014\u2014\r\nOutro').text).toBe('Intro\r\n\\---\r\nOutro');
    });

    it('leaves link targets alone, because a changed dash is a different note', () => {
        expect(dashes(`See [[2013${EN_DASH}14 Premier League]] now ${EN_DASH} really`)).toBe(
            `See [[2013${EN_DASH}14 Premier League]] now - really`
        );
        expect(dashes(`[season](notes/2013${EN_DASH}14 season.md)`)).toBe(`[season](notes/2013${EN_DASH}14 season.md)`);
    });

    it('converts a reference label on both sides, keeping the reference matched', () => {
        expect(dashes(`See [guide][2013${EN_DASH}14].\n\n[2013${EN_DASH}14]: notes/season.md`)).toBe(
            'See [guide][2013-14].\n\n[2013-14]: notes/season.md'
        );
    });

    it('leaves the destination of a definition alone', () => {
        expect(dashes(`[foo]: notes/2013${EN_DASH}14.md "t"`)).toBe(`[foo]: notes/2013${EN_DASH}14.md "t"`);
    });

    it('repairs a long dash in math, which a hyphen makes a valid minus again', () => {
        expect(dashes(`$x ${EN_DASH} y$`)).toBe('$x - y$');
    });

    it('leaves a leading frontmatter block alone', () => {
        expect(dashes(`---\ntitle: 2013${EN_DASH}14\n---\na ${EN_DASH} b`)).toBe(`---\ntitle: 2013${EN_DASH}14\n---\na - b`);
        // Obsidian does not accept YAML's three-dot closer, so such a block is body text
        expect(dashes(`---\ntitle: 2013${EN_DASH}14\n...\na ${EN_DASH} b`)).toBe('---\ntitle: 2013-14\n...\na - b');
    });

    it('covers a destination past a balanced parenthesis', () => {
        expect(dashes(`[x](Notes/(Draft)/2013${EN_DASH}14.md)`)).toBe(`[x](Notes/(Draft)/2013${EN_DASH}14.md)`);
    });

    it('leaves dashes inside Markdown code alone', () => {
        const input = ['`a ${EM} b`'.replace('${EM}', EM_DASH), '```text', `x ${EM_DASH} y`, '```', `c ${EM_DASH} d`].join('\n');
        expect(dashes(input)).toBe(['`a ${EM} b`'.replace('${EM}', EM_DASH), '```text', `x ${EM_DASH} y`, '```', 'c - d'].join('\n'));
    });

    it('leaves dashes inside URLs alone', () => {
        const input = `![photo](https://example.com/Foo${EM_DASH}Bar.png)`;
        expect(dashes(input)).toBe(input);
    });

    it('leaves dashes inside HTML attributes alone', () => {
        expect(dashes(`<img src="a${EM_DASH}b.png"> then ${EM_DASH} prose`)).toBe(`<img src="a${EM_DASH}b.png"> then - prose`);
    });
});

describe('straightenQuotes', () => {
    it('straightens curly double quotes', () => {
        expect(quotes('\u201Chello\u201D')).toBe('"hello"');
        expect(quotes('\u201Elow\u201C')).toBe('"low"');
    });

    it('straightens curly single quotes and the curly apostrophe', () => {
        expect(quotes('\u2018hi\u2019')).toBe("'hi'");
        expect(quotes('don\u2019t')).toBe("don't");
    });

    it('leaves guillemets alone, being real quotation marks in several languages', () => {
        expect(quotes('\u00ABbonjour\u00BB')).toBe('\u00ABbonjour\u00BB');
    });

    it('leaves straight quotes alone', () => {
        expect(quotes(`a "b" 'c'`)).toBe(`a "b" 'c'`);
    });

    it('reports that quotes were straightened', () => {
        expect(straightenQuotes('\u201Cq\u201D').changed).toBe(true);
        expect(straightenQuotes('"q"').changed).toBe(false);
    });

    it('leaves quotes inside Markdown code alone', () => {
        const input = ['`\u201Cinline\u201D`', '```text', '\u201Cquoted\u201D value', '```', '\u201Cprose\u201D'].join('\n');
        expect(quotes(input)).toBe(['`\u201Cinline\u201D`', '```text', '\u201Cquoted\u201D value', '```', '"prose"'].join('\n'));
    });

    it('leaves quotes inside a callout code fence alone', () => {
        const input = ['> [!note]', '> ```text', '> \u201Cquoted\u201D text', '> ```'].join('\n');
        expect(quotes(input)).toBe(input);
    });

    it('leaves quotes inside URLs alone', () => {
        const input = '![photo](https://example.com/Don\u2019t.png)';
        expect(quotes(input)).toBe(input);
    });

    it('leaves a wikilink target alone, because a changed quote is a different note', () => {
        expect(quotes('[[Don\u2019t Panic]] and don\u2019t stop')).toBe("[[Don\u2019t Panic]] and don't stop");
    });

    it('leaves a local destination path alone while repairing its title', () => {
        expect(quotes('![cover](Attachments/O\u2019Reilly.png) and don\u2019t')).toBe("![cover](Attachments/O\u2019Reilly.png) and don't");
        expect(quotes('[a](O\u2019Reilly.png \u201Ctitle\u201D)')).toBe('[a](O\u2019Reilly.png "title")');
        expect(quotes('[Book](Notes/(Draft)/O\u2019Reilly.md)')).toBe('[Book](Notes/(Draft)/O\u2019Reilly.md)');
    });

    it('converts a reference label on both sides, keeping the reference matched', () => {
        expect(quotes('See [guide][Don\u2019t].\n\n[Don\u2019t]: Notes/Guide.md')).toBe("See [guide][Don't].\n\n[Don't]: Notes/Guide.md");
    });

    it('leaves the destination of a definition alone', () => {
        expect(quotes('[foo]: Notes/O\u2019Reilly.md')).toBe('[foo]: Notes/O\u2019Reilly.md');
    });

    it('repairs a curly-quoted link title, which straight quotes make valid again', () => {
        expect(quotes('[Docs](https://example.com \u201CRead more\u201D)')).toBe('[Docs](https://example.com "Read more")');
    });

    it('repairs a curled prime in math', () => {
        expect(quotes('$f\u2019(x)$')).toBe("$f'(x)$");
    });

    it('leaves a leading frontmatter block alone', () => {
        expect(quotes('---\ntitle: Don\u2019t\n---\nDon\u2019t')).toBe("---\ntitle: Don\u2019t\n---\nDon't");
        expect(quotes('---\ntitle: Don\u2019t\n...\nDon\u2019t')).toBe("---\ntitle: Don't\n...\nDon't");
    });

    it('leaves an HTML attribute value alone, being part of a path', () => {
        expect(quotes('<img src="Attachments/O\u2019Reilly.png"> and \u201chi\u201d')).toBe(
            '<img src="Attachments/O\u2019Reilly.png"> and "hi"'
        );
    });

    it('leaves a curly quote nested inside a straight-quoted title alone', () => {
        const single = "[g](https://example.com/g 'It\u2019s here') now";
        expect(quotes(single)).toBe(single);
        const double = '[art](https://example.com/a "He said \u201Chi\u201D there") now';
        expect(quotes(double)).toBe(double);
    });

    it('protects a frontmatter-only paste whose closer carries trailing whitespace', () => {
        expect(quotes('---\ntitle: Don\u2019t\n--- ')).toBe('---\ntitle: Don\u2019t\n--- ');
    });

    it('protects frontmatter behind a leading blank line, which trim later removes', () => {
        expect(quotes('\n---\ntitle: Don\u2019t\n---\nDon\u2019t')).toBe("\n---\ntitle: Don\u2019t\n---\nDon't");
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

    it('leaves a no-break space inside a link target alone, being part of the name', () => {
        expect(clean(`[[Project${NBSP}Alpha]] and 10${NBSP}MB`)).toBe(`[[Project${NBSP}Alpha]] and 10 MB`);
        expect(clean(`[Project](Notes/Project${NBSP}Alpha.md)`)).toBe(`[Project](Notes/Project${NBSP}Alpha.md)`);
        expect(clean(`[Book](Notes/(Draft)/Project${NBSP}Alpha.md)`)).toBe(`[Book](Notes/(Draft)/Project${NBSP}Alpha.md)`);
        expect(clean(`<img src="Project${NBSP}Alpha.png"> and 10${NBSP}MB`)).toBe(`<img src="Project${NBSP}Alpha.png"> and 10 MB`);
    });

    it('protects frontmatter behind a leading BOM, which this pass itself removes', () => {
        expect(clean(`${BOM}---\naliases: Project${NBSP}Alpha\n---\nBody`)).toBe(`---\naliases: Project${NBSP}Alpha\n---\nBody`);
    });

    it('still cleans inside code, where an invisible character is the classic pasted bug', () => {
        expect(clean('```js\nconst a${ZWSP} = 1;\n```'.replace('${ZWSP}', ZWSP))).toBe('```js\nconst a = 1;\n```');
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
        expect(dashes(clean(input))).toBe('The result - which nobody expected - was fine.');
    });
});
