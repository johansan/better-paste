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
import { frontmatterRanges } from './typography';
import { markdownCodeRanges, overlapsRange } from './markdownRanges';
import { LIST_MARKERS, MIN_WRAP_WIDTH, WRAP_TOLERANCE } from '../settings/constants';

/** How the cleanup treats line breaks and bullet characters. */
export interface TerminalCleanupOptions {
    /** 'indented' joins a line only when it is indented further than the paragraph start. */
    terminalRejoin: 'indented' | 'any' | 'never';
    /** 'markdown' rewrites bullets such as \u2022 into Markdown list items. */
    terminalBullets: 'preserve' | 'markdown';
}

/** Markdown constructs that always begin their own block and never continue the previous paragraph. */
const NUMBERED_LIST = /^\s*\d{1,9}[.)]\s/;
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
export function inferWrapWidth(lines: readonly string[]): number {
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
    if (lengths.length < 2) return MIN_WRAP_WIDTH;

    // Spread would blow the argument limit on a large pasted log
    const longest = lengths.reduce((max, length) => (length > max ? length : max), 0);
    const nearLongest = lengths.filter(length => length >= longest - WRAP_TOLERANCE).length;
    if (nearLongest < 2) return MIN_WRAP_WIDTH;

    return Math.max(MIN_WRAP_WIDTH, longest - WRAP_TOLERANCE);
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

/** Converts terminal bullets without rewriting Markdown code or frontmatter values. */
function convertMarkdownBullets(text: string): string {
    const protectedRanges = [...markdownCodeRanges(text), ...frontmatterRanges(text)];
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
            previous.trimEnd().length >= wrapWidth &&
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
function renderParagraph(paragraph: Paragraph, preserveIndent: boolean): string {
    if (paragraph.verbatim) return paragraph.lines.join('\n');

    const first = paragraph.lines[0];
    const joined = paragraph.lines.map((line, index) => (index === 0 ? line.trimEnd() : line.trim())).join(' ');

    // In the never mode the line breaks are the layout, so what is left of the indentation
    // after the shared dedent is content too
    if (preserveIndent) return joined;

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
    const wrapWidth = inferWrapWidth(lines);

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
        // Converting bullets is a separate, explicit request, so it still applies. The
        // whitespace work does not.
        if (options.terminalBullets !== 'markdown') return { text: input, changed: false };
        const converted = convertMarkdownBullets(input);
        return { text: converted, changed: converted !== input };
    }

    const rendered = paragraphs.map(paragraph => renderParagraph(paragraph, preserveIndent));

    let output = rendered.join('\n');

    if (options.terminalBullets === 'markdown') output = convertMarkdownBullets(output);

    return { text: output, changed: output !== input };
}
