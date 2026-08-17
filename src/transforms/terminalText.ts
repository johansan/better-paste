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

import { stripAnsi } from './ansi';
import { frontmatterRanges, linkSyntaxRanges } from './typography';
import { markdownCodeRanges, overlapsRange } from './markdownRanges';
import { LIST_MARKERS, MIN_WRAP_WIDTH, WRAP_TOLERANCE } from '../settings/constants';

/** How the cleanup treats line breaks and bullet characters. */
export interface TerminalCleanupOptions {
    /** 'indented' joins a line only when it is indented further than the paragraph start. */
    terminalRejoin: 'indented' | 'any' | 'never';
    /** 'markdown' rewrites bullets such as \u2022 into Markdown list items. */
    terminalBullets: 'preserve' | 'markdown';
    /** Repairs words that a PDF layout hyphenated at a line end when the lines rejoin. */
    mergeHyphens?: boolean;
    /** Collapses the space runs that justified PDF text leaves between words. */
    collapseSpaces?: boolean;
    /** Lower bound for the inferred wrap column. Defaults to the terminal floor. */
    minWrapWidth?: number;
    /**
     * Leaves lines between $$ delimiters verbatim, because they are Obsidian math. Off
     * for terminal output, where $$ is the shell's process id rather than a delimiter.
     */
    protectMath?: boolean;
}

/** Markdown constructs that always begin their own block and never continue the previous paragraph. */
const NUMBERED_LIST = /^\s*\d{1,9}[.)]\s/;
/** An enumerator such as (a), (12), [3] or c), which begins its own item in PDF lists. */
const ENUMERATOR = /^\s*(?:\([a-z0-9]{1,4}\)|\[\d{1,4}\]|[a-z0-9]{1,4}\))\s/i;
const HEADING = /^\s{0,3}#{1,6}(\s|$)/;
const BLOCKQUOTE = /^\s{0,3}>/;
const TABLE_ROW = /^\s*\|/;
const THEMATIC_BREAK = /^\s{0,3}(?:-{3,}|\*{3,}|_{3,})\s*$/;
const FRONTMATTER_DELIMITER = /^---\s*$/;
/** A setext underline, which turns the line above it into a heading. */
const SETEXT_UNDERLINE = /^ {0,3}(?:=+|-+)[ \t]*$/;

/** Markdown treats four or more leading spaces as an indented code block. */
const INDENTED_CODE_WIDTH = 4;

interface FenceDelimiter {
    marker: '`' | '~';
    length: number;
    rest: string;
}

/** Returns the delimiter on a possible fence line. */
function fenceDelimiterOf(line: string): FenceDelimiter | null {
    const match = /^(?: {0,3}>[ \t]?)* {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
    if (!match) return null;

    const marker: '`' | '~' = match[1].startsWith('`') ? '`' : '~';
    const rest = match[2];
    if (marker === '`' && rest.includes('`')) return null;
    return { marker, length: match[1].length, rest };
}

/** A closing fence must use the opening marker, be at least as long, and have no info string. */
function closesFence(line: string, opening: FenceDelimiter): boolean {
    const candidate = fenceDelimiterOf(line);
    return (
        candidate !== null &&
        candidate.marker === opening.marker &&
        candidate.length >= opening.length &&
        candidate.rest.trim().length === 0
    );
}

/** Returns the literal leading whitespace of a line. */
function leadingWhitespace(line: string): string {
    const match = /^[ \t]*/.exec(line);
    return match ? match[0] : '';
}

/** Returns the visual indent width of a line, counting a tab as four columns. */
function indentWidth(line: string): number {
    let width = 0;
    for (const char of leadingWhitespace(line)) {
        width += char === '\t' ? INDENTED_CODE_WIDTH : 1;
    }
    return width;
}

function isBlank(line: string): boolean {
    return line.trim().length === 0;
}

/** True when Markdown renders the line ending as an intentional hard break. */
function hasMarkdownHardBreak(line: string): boolean {
    return / {2,}$|\\$/.test(line);
}

/**
 * True when the line ends with a word or number broken at the margin: a letter or a
 * digit, then an ASCII hyphen, a soft hyphen or one of the hyphen forms PDF fonts emit
 * (U+2010, U+FE63, U+FF0D). The non-breaking hyphen U+2011 is deliberately absent,
 * because its meaning is that the word must not break there. Requiring a letter, a
 * digit or a combining mark in front keeps thematic breaks and stray dashes out,
 * because "---" is a rule and not a broken word. The mark counts because it always
 * sits on a letter, and some scripts keep it separate even after normalization.
 */
export function endsHyphenated(line: string): boolean {
    return /[\p{L}\d\p{M}][-\u00AD\u2010\uFE63\uFF0D]$/u.test(line.trimEnd());
}

/**
 * True when the line's last word carries a web address, with a scheme or as the bare
 * www form PDFs print. Such a line never rejoins: a space join buries the break inside
 * the address, and a bare join could fuse an address that really ended there with the
 * next word, so the break stays visible.
 */
function endsWithUrl(line: string): boolean {
    const trimmed = line.trimEnd();
    return /:\/\/\S*$/.test(trimmed) || /(^|\s)www\.\S+$/i.test(trimmed);
}

/**
 * Block math spans, from a line holding only $$ to its closing line. An unclosed
 * opener protects nothing, so a stray $$ cannot swallow the rest of the text.
 */
function dollarMathRanges(text: string): { start: number; end: number }[] {
    const ranges: { start: number; end: number }[] = [];
    let offset = 0;
    let openStart = -1;
    for (const line of text.split('\n')) {
        if (line.trim() === '$$') {
            if (openStart < 0) {
                openStart = offset;
            } else {
                ranges.push({ start: openStart, end: offset + line.length });
                openStart = -1;
            }
        }
        offset += line.length + 1;
    }
    return ranges;
}

/**
 * Joins two prose fragments across a removed break. A break after a web address stays
 * visible, because a space join buries it and a bare join could fuse an address that
 * really ended there with the next word. After a digit a hyphen is content, a range or
 * a compound such as 10-20 or 5-fold, so it stays and only the break goes. After a
 * letter it is the layout's own when the word resumes in lowercase, so it goes; before
 * a capital it belongs to a compound such as Navier-Stokes or RNA-Seq, so it also
 * stays, because a false join is harder to spot than a kept hyphen. An en or em dash
 * set tight against its word keeps that style, and the scripts that write without
 * spaces join bare. Everything else joins with one space.
 */
export function joinFragments(previous: string, fragment: string): string {
    if (endsWithUrl(previous)) return `${previous}\n${fragment}`;
    if (endsHyphenated(previous)) {
        const afterDigit = /\d[-\u00AD\u2010\uFE63\uFF0D]$/u.test(previous);
        const brokenWord = !afterDigit && /^\p{Ll}/u.test(fragment);
        return brokenWord ? previous.slice(0, -1) + fragment : previous + fragment;
    }
    if (/\S[\u2013\u2014]$/.test(previous)) return previous + fragment;
    if (CJK_TAIL.test(previous) && CJK_HEAD.test(fragment)) return previous + fragment;
    return `${previous} ${fragment}`;
}

/**
 * Scripts and their punctuation that wrap without spaces: Thai, then CJK symbols, kana,
 * Han and fullwidth forms. Hangul is absent because Korean spaces its words.
 */
const CJK_TAIL = /[\u0E00-\u0E7F\u3000-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF]$/;
const CJK_HEAD = /^[\u0E00-\u0E7F\u3000-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF]/;

/**
 * Collapses runs of spaces between words, which justified PDF text leaves behind. Runs
 * at a line start are indentation and runs at a line end are Markdown hard breaks, so
 * only runs between visible characters collapse. Code, frontmatter and link targets
 * keep their spacing: there the runs are content, and one space fewer in a wikilink
 * silently points it at a different note. The overlap test covers the spaces alone,
 * so a run that merely follows a code span still collapses.
 */
function collapseSpaceRuns(text: string, protectMath: boolean): string {
    const protectedRanges = [
        ...markdownCodeRanges(text),
        ...frontmatterRanges(text),
        ...linkSyntaxRanges(text),
        ...(protectMath ? dollarMathRanges(text) : [])
    ];
    return text.replace(/(\S) {2,}(?=\S)/g, (match, before: string, offset: number) =>
        overlapsRange(protectedRanges, offset + 1, offset + match.length) ? match : `${before} `
    );
}

/**
 * Works out the column the terminal wrapped at, from the text itself.
 *
 * A terminal breaks every long line at the same column, so wrapped lines cluster just
 * below it. When at least two lines sit near the longest one, that length is taken as the
 * wrap column. A single long line is an outlier rather than evidence, so the conservative
 * floor is used instead, which also covers text that was never wrapped at all.
 *
 * This replaces asking the user for a threshold they cannot know: the answer depends on
 * how wide their terminal window happened to be when they copied.
 */
export function inferWrapWidth(lines: readonly string[], floor: number = MIN_WRAP_WIDTH): number {
    // Fenced content is copied verbatim, so a long JSON line inside a log dump must not
    // drag the threshold above the prose the user actually wants rejoined
    const prose: string[] = [];
    let fence: FenceDelimiter | null = null;
    for (const line of lines) {
        if (fence === null) {
            const opening = fenceDelimiterOf(line);
            if (opening) {
                fence = opening;
                continue;
            }
            if (!isBlank(line)) prose.push(line);
            continue;
        }
        if (closesFence(line, fence)) fence = null;
    }

    const lengths = prose.map(line => line.trimEnd().length);
    if (lengths.length < 2) return floor;

    // Spread would blow the argument limit on a large pasted log
    const longest = lengths.reduce((max, length) => (length > max ? length : max), 0);
    const nearLongest = lengths.filter(length => length >= longest - WRAP_TOLERANCE).length;
    if (nearLongest < 2) return floor;

    return Math.max(floor, longest - WRAP_TOLERANCE);
}

/**
 * Returns the bullet marker a line starts with, or null. A marker only counts when it is
 * followed by whitespace, so "-1 degree" and "*emphasis*" are not mistaken for list items.
 */
function listMarkerOf(line: string): string | null {
    const body = line.slice(linePrefixOf(line).length);
    for (const marker of LIST_MARKERS) {
        if (body.startsWith(marker) && /\s/.test(body.charAt(marker.length))) return marker;
    }
    return null;
}

/** Leading whitespace and blockquote markers, kept verbatim when rewriting the line. */
function linePrefixOf(line: string): string {
    const match = /^(?: {0,3}>[ \t]?)*[ \t]*/.exec(line);
    return match ? match[0] : '';
}

/**
 * True when the line is a heading, possibly behind list or blockquote markers in any
 * order and depth. Stripping too much only prevents a rejoin, so the prefix match stays
 * permissive rather than modelling exact container nesting.
 */
function isHeadingLine(line: string): boolean {
    return HEADING.test(line.replace(/^(?: {0,3}(?:>[ \t]?|[-*+][ \t]+|\d{1,9}[.)][ \t]+))*[ \t]*/, ''));
}

/** True when the line opens a Markdown block that must not be merged into the previous paragraph. */
function startsNewBlock(line: string): boolean {
    if (listMarkerOf(line) !== null) return true;
    if (NUMBERED_LIST.test(line)) return true;
    if (ENUMERATOR.test(line)) return true;
    if (HEADING.test(line)) return true;
    if (BLOCKQUOTE.test(line)) return true;
    if (fenceDelimiterOf(line) !== null) return true;
    if (TABLE_ROW.test(line)) return true;
    if (THEMATIC_BREAK.test(line)) return true;
    if (FRONTMATTER_DELIMITER.test(line)) return true;
    // Joining a setext underline onto the line above erases the heading it makes
    if (SETEXT_UNDERLINE.test(line)) return true;
    if (indentWidth(line) >= INDENTED_CODE_WIDTH) return true;
    return false;
}

/**
 * Removes the longest leading whitespace prefix shared by every non-blank line.
 * Relative indentation between lines is preserved.
 */
export function dedent(lines: readonly string[]): string[] {
    const prefixes = lines.filter(line => !isBlank(line)).map(line => leadingWhitespace(line));
    if (prefixes.length === 0) return [...lines];

    let common = prefixes[0];
    for (const prefix of prefixes) {
        while (common.length > 0 && !prefix.startsWith(common)) {
            common = common.slice(0, -1);
        }
        if (common.length === 0) break;
    }

    if (common.length === 0) return [...lines];
    return lines.map(line => (isBlank(line) ? line : line.slice(common.length)));
}

/**
 * Rewrites a non-Markdown bullet character to a Markdown list dash, preserving indentation.
 * Lines that already use '-', '*' or '+' are left alone.
 */
function toMarkdownBullet(line: string): string {
    const marker = listMarkerOf(line);
    if (marker === null || marker === '-' || marker === '*' || marker === '+') return line;

    const prefix = linePrefixOf(line);
    const body = line.slice(prefix.length + marker.length).replace(/^\s+/, '');
    return `${prefix}- ${body}`;
}

/** Converts terminal bullets without rewriting Markdown code, math or frontmatter values. */
function convertMarkdownBullets(text: string, protectMath: boolean): string {
    const protectedRanges = [...markdownCodeRanges(text), ...frontmatterRanges(text), ...(protectMath ? dollarMathRanges(text) : [])];
    let offset = 0;

    return text
        .split('\n')
        .map(line => {
            const start = offset;
            offset += line.length + 1;
            return overlapsRange(protectedRanges, start, start + 1) ? line : toMarkdownBullet(line);
        })
        .join('\n');
}

interface Paragraph {
    /** Lines belonging to this paragraph, in order. */
    lines: string[];
    /** True when the paragraph is inside a fenced code block and must pass through untouched. */
    verbatim: boolean;
}

/**
 * Groups lines into paragraphs. A paragraph continues across a line break only when the
 * previous line looks hard wrapped: long enough to have reached the terminal's wrap column,
 * and followed by a line that does not open a new Markdown block.
 */
function groupParagraphs(lines: readonly string[], options: TerminalCleanupOptions, wrapWidth: number): Paragraph[] {
    const rejoin = options.terminalRejoin;
    const requireIndent = rejoin === 'indented';
    const paragraphs: Paragraph[] = [];
    let current: Paragraph | null = null;
    let fence: FenceDelimiter | null = null;
    let math = false;

    // A leading frontmatter block is data: rejoining a long value line with the key
    // below it would silently merge two YAML entries into one. Blank lines before the
    // block count as leading, because the trim rule removes them later, which turns the
    // block into real frontmatter once it lands in a note.
    let consumed = 0;
    let opener = 0;
    while (opener < lines.length && isBlank(lines[opener])) opener += 1;
    // Up to three leading spaces count too, because the trim rule removes them later
    if (lines[opener] !== undefined && /^ {0,3}---\s*$/.test(lines[opener])) {
        while (consumed <= opener) {
            paragraphs.push({ lines: [lines[consumed]], verbatim: true });
            consumed += 1;
        }
        while (consumed < lines.length) {
            const line = lines[consumed];
            paragraphs.push({ lines: [line], verbatim: true });
            consumed += 1;
            if (FRONTMATTER_DELIMITER.test(line)) break;
        }
    }

    for (const line of lines.slice(consumed)) {
        // Everything inside a math block is a formula, where a rejoin or a bullet
        // rewrite would change its meaning
        if (math) {
            paragraphs.push({ lines: [line], verbatim: true });
            if (line.trim() === '$$') math = false;
            continue;
        }

        if (isBlank(line) && fence === null) {
            current = null;
            // Runs of blank lines collapse here rather than over the rendered text,
            // because a fence's interior blank lines never reach this branch and must
            // survive exactly as pasted
            const last = paragraphs[paragraphs.length - 1];
            const lastIsBlank = last !== undefined && last.verbatim && last.lines.length === 1 && isBlank(last.lines[0]);
            if (!lastIsBlank) paragraphs.push({ lines: [line], verbatim: true });
            continue;
        }

        if (fence !== null) {
            // Everything between fences is copied verbatim, including the closing fence
            paragraphs.push({ lines: [line], verbatim: true });
            if (closesFence(line, fence)) fence = null;
            continue;
        }

        if (options.protectMath === true && line.trim() === '$$') {
            current = null;
            math = true;
            paragraphs.push({ lines: [line], verbatim: true });
            continue;
        }

        const opening = fenceDelimiterOf(line);
        if (opening) {
            current = null;
            fence = opening;
            paragraphs.push({ lines: [line], verbatim: true });
            continue;
        }

        // A hard break is content rather than terminal wrapping. Keep the marker and stop
        // the following indented line from being joined onto it.
        if (hasMarkdownHardBreak(line)) {
            current = null;
            paragraphs.push({ lines: [line], verbatim: true });
            continue;
        }

        // A separator row or setext underline is complete in itself, also inside a
        // blockquote. Absorbing the next line would fabricate a heading out of two blocks.
        const unquoted = line.replace(/^(?: {0,3}>[ \t]?)+/, '');
        if (THEMATIC_BREAK.test(unquoted) || SETEXT_UNDERLINE.test(unquoted)) {
            current = null;
            paragraphs.push({ lines: [line], verbatim: true });
            continue;
        }

        const previous = current ? current.lines[current.lines.length - 1] : undefined;
        const first = current ? current.lines[0] : undefined;

        const continues =
            rejoin !== 'never' &&
            current !== null &&
            previous !== undefined &&
            first !== undefined &&
            // A heading is complete in itself; absorbing an indented line would swallow
            // a paragraph into it. Nested list or blockquote prefixes are looked through.
            !isHeadingLine(first) &&
            !startsNewBlock(line) &&
            !(options.mergeHyphens === true && endsWithUrl(previous)) &&
            // A trailing hyphen is wrap evidence on its own: a layout hyphenates a word
            // only when the line has reached the margin, so the width check would reject
            // exactly the narrow-column lines that need the repair most.
            (previous.trimEnd().length >= wrapWidth || (options.mergeHyphens === true && endsHyphenated(previous))) &&
            (!requireIndent || indentWidth(line) > indentWidth(first));

        if (continues && current) {
            current.lines.push(line);
        } else {
            current = { lines: [line], verbatim: false };
            paragraphs.push(current);
        }
    }

    return paragraphs;
}

/**
 * Joins a paragraph's hard-wrapped lines into one line and drops the leftover indentation
 * that terminal output puts in front of prose. Indentation is kept for list items, which
 * use it for nesting, and for indented code blocks.
 */
function renderParagraph(paragraph: Paragraph, options: TerminalCleanupOptions): string {
    if (paragraph.verbatim) return paragraph.lines.join('\n');

    const first = paragraph.lines[0];

    let joined = first.trimEnd();
    for (const line of paragraph.lines.slice(1)) {
        const fragment = line.trim();
        if (options.mergeHyphens !== true) {
            joined = `${joined} ${fragment}`;
        } else if (joined.endsWith('\u00AD')) {
            // A soft hyphen exists only to mark the wrap point, so it goes no matter
            // what follows
            joined = joined.slice(0, -1) + fragment;
        } else {
            joined = joinFragments(joined, fragment);
        }
    }

    // In the never mode the line breaks are the layout, so what is left of the indentation
    // after the shared dedent is content too
    if (options.terminalRejoin === 'never') return joined;

    // A residual indent below the code-block threshold is wrapping decoration, not structure
    const isStructural = listMarkerOf(first) !== null || NUMBERED_LIST.test(first);
    if (isStructural || indentWidth(first) >= INDENTED_CODE_WIDTH) return joined;

    return joined.replace(/^[ \t]+/, '');
}

export interface TerminalCleanupResult {
    text: string;
    changed: boolean;
}

/**
 * Cleans text copied out of a terminal: strips escape sequences, removes the shared
 * indentation, and rejoins paragraphs that the terminal hard wrapped at its window width.
 */
export function cleanTerminalText(input: string, options: TerminalCleanupOptions): TerminalCleanupResult {
    const normalized = input.replace(/\r\n?/g, '\n');
    const text = stripAnsi(normalized);
    const hadEscapes = text !== normalized;

    const lines = dedent(text.split('\n'));
    const wrapWidth = inferWrapWidth(lines, options.minWrapWidth);

    const preserveIndent = options.terminalRejoin === 'never';
    const paragraphs = groupParagraphs(lines, options, wrapWidth);

    // Dedenting, trimming and collapsing blank lines are only wanted on text that came
    // from a terminal. Nothing here identifies itself as terminal output unless it
    // carried escape sequences or was actually rejoined, and applying them anyway would
    // quietly flatten pasted code, nested lists and Markdown's two-space line breaks.
    // The "never" mode is the exception: choosing it is an explicit request to strip and
    // dedent without rejoining anything.
    const rejoined = paragraphs.some(paragraph => !paragraph.verbatim && paragraph.lines.length > 1);

    if (!preserveIndent && !hadEscapes && !rejoined) {
        // Converting bullets and collapsing space runs are separate, explicit requests,
        // so they still apply. The dedent and trim work does not.
        let converted = input;
        if (options.terminalBullets === 'markdown') converted = convertMarkdownBullets(converted, options.protectMath === true);
        if (options.collapseSpaces === true) converted = collapseSpaceRuns(converted, options.protectMath === true);
        return { text: converted, changed: converted !== input };
    }

    const rendered = paragraphs.map(paragraph => renderParagraph(paragraph, options));

    let output = rendered.join('\n');

    if (options.terminalBullets === 'markdown') output = convertMarkdownBullets(output, options.protectMath === true);
    if (options.collapseSpaces === true) output = collapseSpaceRuns(output, options.protectMath === true);

    return { text: output, changed: output !== input };
}
