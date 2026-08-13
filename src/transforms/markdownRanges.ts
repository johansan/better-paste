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

export interface TextRange {
    start: number;
    end: number;
}

interface FenceDelimiter {
    marker: '`' | '~';
    length: number;
    rest: string;
}

/** Returns the delimiter on a possible fenced code line. */
function fenceDelimiterOf(line: string): FenceDelimiter | null {
    const match = /^ {0,3}(`{3,}|~{3,})(.*)$/.exec(line);
    if (!match) return null;

    const marker: '`' | '~' = match[1].startsWith('`') ? '`' : '~';
    const rest = match[2];
    if (marker === '`' && rest.includes('`')) return null;
    return { marker, length: match[1].length, rest };
}

/** A closing fence uses the opening marker, is at least as long, and has no info string. */
function closesFence(line: string, opening: FenceDelimiter): boolean {
    const candidate = fenceDelimiterOf(line);
    return (
        candidate !== null &&
        candidate.marker === opening.marker &&
        candidate.length >= opening.length &&
        candidate.rest.trim().length === 0
    );
}

/** True when the character at `index` is escaped by an odd run of backslashes. */
function isEscaped(text: string, index: number): boolean {
    let slashes = 0;
    for (let cursor = index - 1; cursor >= 0 && text[cursor] === '\\'; cursor--) slashes += 1;
    return slashes % 2 === 1;
}

/** Adds same-line backtick code spans to `ranges`. */
function collectInlineCode(line: string, lineStart: number, ranges: TextRange[]): void {
    for (let index = 0; index < line.length; index++) {
        if (line[index] !== '`' || isEscaped(line, index)) continue;

        let length = 1;
        while (line[index + length] === '`') length += 1;

        let search = index + length;
        let closed = false;
        while (search < line.length) {
            const candidate = line.indexOf('`', search);
            if (candidate < 0) break;

            let candidateLength = 1;
            while (line[candidate + candidateLength] === '`') candidateLength += 1;

            if (!isEscaped(line, candidate) && candidateLength === length) {
                const end = candidate + candidateLength;
                ranges.push({ start: lineStart + index, end: lineStart + end });
                index = end - 1;
                closed = true;
                break;
            }

            search = candidate + candidateLength;
        }

        if (!closed) index += length - 1;
    }
}

/**
 * Ranges whose contents Markdown renders as code. Fenced blocks and same-line backtick
 * spans are protected so cleanup rules do not rewrite examples, commands, or source text.
 */
export function markdownCodeRanges(text: string): TextRange[] {
    const ranges: TextRange[] = [];
    let lineStart = 0;
    let fence: { delimiter: FenceDelimiter; start: number } | null = null;

    while (lineStart <= text.length) {
        const newline = text.indexOf('\n', lineStart);
        const lineEnd = newline < 0 ? text.length : newline;
        const line = text.slice(lineStart, lineEnd).replace(/\r$/, '');

        if (fence !== null) {
            if (closesFence(line, fence.delimiter)) {
                ranges.push({ start: fence.start, end: newline < 0 ? lineEnd : lineEnd + 1 });
                fence = null;
            }
        } else {
            const opening = fenceDelimiterOf(line);
            if (opening) fence = { delimiter: opening, start: lineStart };
            else collectInlineCode(line, lineStart, ranges);
        }

        if (newline < 0) break;
        lineStart = newline + 1;
    }

    if (fence !== null) ranges.push({ start: fence.start, end: text.length });
    return ranges;
}

/** True when two half-open text ranges overlap. */
export function overlapsRange(ranges: readonly TextRange[], start: number, end: number): boolean {
    return ranges.some(range => start < range.end && end > range.start);
}
