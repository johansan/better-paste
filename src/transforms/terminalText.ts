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
import type { BetterPasteSettings } from '../settings/types';

/** Subset of settings the terminal cleaner reads, so tests can build one without a full settings object. */
export type TerminalCleanupOptions = Pick<
    BetterPasteSettings,
    | 'terminalUnwrapLines'
    | 'terminalRequireIndent'
    | 'terminalMinWrapWidth'
    | 'terminalDedent'
    | 'terminalStripAnsi'
    | 'terminalCollapseBlankLines'
    | 'terminalTrimTrailingWhitespace'
    | 'terminalPreserveCodeBlocks'
    | 'terminalBulletMode'
    | 'terminalListMarkers'
>;

/** Markdown constructs that always begin their own block and never continue the previous paragraph. */
const NUMBERED_LIST = /^\s*\d{1,9}[.)]\s/;
const HEADING = /^\s{0,3}#{1,6}(\s|$)/;
const BLOCKQUOTE = /^\s{0,3}>/;
const FENCE = /^\s*(?:```|~~~)/;
const TABLE_ROW = /^\s*\|/;
const THEMATIC_BREAK = /^\s{0,3}(?:-{3,}|\*{3,}|_{3,})\s*$/;
const FRONTMATTER_DELIMITER = /^---\s*$/;

/** Markdown treats four or more leading spaces as an indented code block. */
const INDENTED_CODE_WIDTH = 4;

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

/**
 * Returns the bullet marker a line starts with, or null. A marker only counts when it is
 * followed by whitespace, so "-1 degree" and "*emphasis*" are not mistaken for list items.
 */
function listMarkerOf(line: string, markers: readonly string[]): string | null {
    const body = line.slice(leadingWhitespace(line).length);
    for (const marker of markers) {
        if (!marker) continue;
        if (body.startsWith(marker) && /\s/.test(body.charAt(marker.length))) return marker;
    }
    return null;
}

/** True when the line opens a Markdown block that must not be merged into the previous paragraph. */
function startsNewBlock(line: string, markers: readonly string[]): boolean {
    if (listMarkerOf(line, markers) !== null) return true;
    if (NUMBERED_LIST.test(line)) return true;
    if (HEADING.test(line)) return true;
    if (BLOCKQUOTE.test(line)) return true;
    if (FENCE.test(line)) return true;
    if (TABLE_ROW.test(line)) return true;
    if (THEMATIC_BREAK.test(line)) return true;
    if (FRONTMATTER_DELIMITER.test(line)) return true;
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
function toMarkdownBullet(line: string, markers: readonly string[]): string {
    const marker = listMarkerOf(line, markers);
    if (marker === null || marker === '-' || marker === '*' || marker === '+') return line;

    const indent = leadingWhitespace(line);
    const body = line.slice(indent.length + marker.length).replace(/^\s+/, '');
    return `${indent}- ${body}`;
}

interface Paragraph {
    /** Lines belonging to this paragraph, in order. */
    lines: string[];
    /** True when the paragraph is inside a fenced code block and must pass through untouched. */
    verbatim: boolean;
}

/**
 * Groups lines into paragraphs. A paragraph continues across a line break only when the
 * previous line looks hard wrapped: long enough to have hit the terminal's wrap column,
 * and followed by a line that does not open a new Markdown block.
 */
function groupParagraphs(lines: readonly string[], options: TerminalCleanupOptions): Paragraph[] {
    const markers = options.terminalListMarkers;
    const paragraphs: Paragraph[] = [];
    let current: Paragraph | null = null;
    let insideFence = false;

    for (const line of lines) {
        const fenceToggle = FENCE.test(line);

        if (isBlank(line) && !insideFence) {
            current = null;
            paragraphs.push({ lines: [line], verbatim: true });
            continue;
        }

        if (insideFence) {
            // Everything between fences is copied verbatim, including the closing fence
            paragraphs.push({ lines: [line], verbatim: true });
            if (fenceToggle) insideFence = false;
            continue;
        }

        if (fenceToggle && options.terminalPreserveCodeBlocks) {
            current = null;
            insideFence = true;
            paragraphs.push({ lines: [line], verbatim: true });
            continue;
        }

        const previous = current?.lines[current.lines.length - 1];
        const first = current?.lines[0];

        const continues =
            current !== null &&
            previous !== undefined &&
            first !== undefined &&
            !startsNewBlock(line, markers) &&
            previous.trimEnd().length >= options.terminalMinWrapWidth &&
            (!options.terminalRequireIndent || indentWidth(line) > indentWidth(first));

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

    const markers = options.terminalListMarkers;
    const first = paragraph.lines[0];

    const joined = options.terminalUnwrapLines
        ? paragraph.lines.map((line, index) => (index === 0 ? line.trimEnd() : line.trim())).join(' ')
        : paragraph.lines.join('\n');

    if (!options.terminalDedent) return joined;

    // A residual indent below the code-block threshold is wrapping decoration, not structure
    const isStructural = listMarkerOf(first, markers) !== null || NUMBERED_LIST.test(first);
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
    let text = input.replace(/\r\n?/g, '\n');

    if (options.terminalStripAnsi) text = stripAnsi(text);

    let lines = text.split('\n');

    if (options.terminalTrimTrailingWhitespace) lines = lines.map(line => line.replace(/[ \t]+$/, ''));
    if (options.terminalDedent) lines = dedent(lines);

    const rendered = groupParagraphs(lines, options).map(paragraph => renderParagraph(paragraph, options));

    let output = rendered.join('\n');

    if (options.terminalCollapseBlankLines) output = output.replace(/\n{3,}/g, '\n\n');

    if (options.terminalBulletMode === 'markdown') {
        output = output
            .split('\n')
            .map(line => toMarkdownBullet(line, options.terminalListMarkers))
            .join('\n');
    }

    return { text: output, changed: output !== input };
}
