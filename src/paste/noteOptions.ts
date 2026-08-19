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

/*
 * Per-note settings, read from a note's frontmatter, and the check for whether the cursor
 * is somewhere the paste rules must keep their hands off.
 *
 * Frontmatter is parsed from the editor's current text rather than from the metadata
 * cache, so a property the user just typed takes effect on the very next paste.
 */

import { getFrontMatterInfo } from 'obsidian';
import { BLOCKQUOTE_PREFIX, markdownCodeRanges } from '../transforms/markdownRanges';

/** Accepts "400", "400x300", "400 x 300" and the multiplication sign variant. */
const SIZE_PATTERN = /^(\d+)(?:\s*[x×]\s*(\d+))?$/i;

/**
 * Values that switch the plugin off for a note, and values that switch it on.
 *
 * A boolean is the documented form, because Obsidian fixes a property's type from the
 * first value entered and a checkbox is the shape this property wants. The strings are
 * accepted as well so a property already typed as text still answers.
 */
const FALSEY = new Set(['false', 'off', 'no', '0', 'disabled']);
const TRUTHY = new Set(['true', 'on', 'yes', '1', 'enabled']);

/** True when a line closes a frontmatter block. Obsidian accepts only ---, not YAML's ... */
function isFrontmatterEnd(line: string): boolean {
    return line.trimEnd() === '---';
}

/**
 * Index of the line closing the note's frontmatter, or -1 when it has none.
 * Obsidian only recognises frontmatter that opens on the very first line and is closed.
 */
function frontmatterEndLine(lines: readonly string[]): number {
    if (lines[0]?.trimEnd() !== '---') return -1;
    for (let index = 1; index < lines.length; index++) {
        if (isFrontmatterEnd(lines[index])) return index;
    }
    // An unterminated block is a thematic break, or is still being typed
    return -1;
}

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

/** True when the cursor splits matching backtick runs inserted as an empty code span. */
function isBetweenPairedBackticks(line: string, cursor: number): boolean {
    let left = 0;
    while (line[cursor - left - 1] === '`') left += 1;

    let right = 0;
    while (line[cursor + right] === '`') right += 1;
    if (left === 0 || left !== right) return false;

    let slashes = 0;
    for (let index = cursor - left - 1; index >= 0 && line[index] === '\\'; index--) slashes += 1;
    return slashes % 2 === 0;
}

/**
 * True when an insertion point is inside same-line or block Markdown code.
 *
 * Indentation alone cannot make the call: a tab-indented line is a nested list item when
 * a list item stands above it and indented code otherwise. The shared document parser
 * decides, so pastes into nested lists are processed while code keeps its protection,
 * and the transforms agree with this check about which lines are code.
 */
function isInsideLineCode(body: string, lineStart: number, line: string, cursor: number): boolean {
    if (isBetweenPairedBackticks(line, cursor)) return true;

    // An opening fence line changes state only after its newline
    if (fenceDelimiterOf(line) !== null) return false;

    // The parser reads a whitespace-only line as blank, but the paste is about to give
    // it content, so it is classified as if it already had some: pasting after a lone
    // four-space indent creates indented code, while pasting after a tab under a list
    // item continues the list. Blockquote markers are stripped first so a quoted
    // indent gets the same treatment.
    const lineEnd = lineStart + line.length;
    const stripped = line.replace(BLOCKQUOTE_PREFIX, '');
    const indented = /^(?: {4}|\t)/.test(stripped);
    const probed = indented && stripped.trim() === '';
    const text = probed ? body.slice(0, lineEnd) + 'x' : body;
    const end = probed ? lineEnd + 1 : lineEnd;

    const offset = lineStart + cursor;
    for (const range of markdownCodeRanges(text)) {
        // A range covering the whole line is block code only when it reaches past the
        // line or the line is indented: an indented code line, or the content of a
        // fence nested in a list item. Appending at such a line's end is still a paste
        // into code, so only the position before the line stays outside. A backtick
        // span that happens to fill the line stays inline, where the position after
        // the closing backtick is already outside the code.
        if (range.start <= lineStart && end <= range.end && (indented || range.start < lineStart || range.end > end)) {
            return cursor > 0;
        }
        if (offset > range.start && offset < range.end) return true;
    }
    return false;
}

/**
 * True when the cursor sits inside the body of a closed frontmatter block, between the
 * delimiter lines. Uses Obsidian's own reading of the syntax so the answer matches what
 * the app treats as frontmatter.
 */
export function isInsideFrontmatterBlock(content: string, cursorOffset: number): boolean {
    const info = getFrontMatterInfo(content);
    return info.exists && cursorOffset >= info.from && cursorOffset <= info.to;
}

/** Extracts the YAML text of a note's frontmatter block, or null when there is none. */
export function extractFrontmatterBlock(content: string): string | null {
    // Cheap rejection before splitting a potentially large note
    if (!content.startsWith('---')) return null;

    const lines = content.split('\n');
    const end = frontmatterEndLine(lines);
    return end < 0 ? null : lines.slice(1, end).join('\n');
}

/**
 * Converts a frontmatter value into the size suffix Obsidian understands in an embed,
 * or null when the value is missing or not a usable size.
 */
export function normalizeImageSize(value: unknown): string | null {
    if (typeof value === 'number') {
        const rounded = Math.round(value);
        return Number.isFinite(value) && rounded > 0 ? String(rounded) : null;
    }

    if (typeof value !== 'string') return null;

    const match = SIZE_PATTERN.exec(value.trim());
    if (!match) return null;

    const width = Number(match[1]);
    if (width <= 0) return null;

    if (match[2] === undefined) return String(width);

    const height = Number(match[2]);
    return height > 0 ? `${width}x${height}` : null;
}

/** Looks up a property by name, ignoring case, as Obsidian's own property UI does. */
function readProperty(frontmatter: unknown, property: string): unknown {
    const wanted = property.trim().toLowerCase();
    if (!wanted) return undefined;
    if (typeof frontmatter !== 'object' || frontmatter === null) return undefined;

    const record = frontmatter as Record<string, unknown>;
    const key = Object.keys(record).find(candidate => candidate.toLowerCase() === wanted);
    return key === undefined ? undefined : record[key];
}

/** Reads the configured size property out of parsed frontmatter. */
export function resolveImageSize(frontmatter: unknown, property: string): string | null {
    return normalizeImageSize(readProperty(frontmatter, property));
}

/**
 * Reads a property as text for use in a file name: a non-empty string or a finite
 * number. Anything else, booleans, arrays and dates included, has no place in a file
 * name and reads as missing.
 */
export function resolveNameProperty(frontmatter: unknown, property: string): string | null {
    const value = readProperty(frontmatter, property);
    if (typeof value === 'number') return Number.isFinite(value) ? String(value) : null;
    if (typeof value !== 'string') return null;
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
}

/** What a note asks for, overriding the global setting in that direction. */
export type NotePasteOverride = 'on' | 'off';

/**
 * Reads a note's override of automatic cleanup, or null when the note does not ask for one.
 *
 * Off serves notes that are deliberately verbatim: logs, transcripts, scratchpads. On is
 * the other direction, letting one note be cleaned while automatic cleanup is switched off
 * everywhere else.
 *
 * An unrecognised value means no opinion rather than off, so a note written for a later
 * version follows the global setting instead of silently going unprocessed here.
 */
export function notePasteOverride(frontmatter: unknown, property: string): NotePasteOverride | null {
    const value = readProperty(frontmatter, property);
    if (value === false) return 'off';
    if (value === true) return 'on';
    // An unquoted "bp: 0" parses as a number, not a string
    if (value === 0) return 'off';
    if (value === 1) return 'on';

    if (typeof value !== 'string') return null;
    const normalized = value.trim().toLowerCase();
    if (FALSEY.has(normalized)) return 'off';
    return TRUTHY.has(normalized) ? 'on' : null;
}

/**
 * True when the cursor sits inside Markdown code or the frontmatter block.
 *
 * Pasting into Markdown code is a deliberate act of preservation, so applying text rules
 * there would destroy the very thing the user was protecting.
 *
 * Takes the whole note rather than only the text before the cursor: whether a frontmatter
 * block is closed can only be answered by looking past the cursor, and an unterminated
 * "---" on line 1 is a thematic break rather than an open block.
 */
export function isInsideVerbatimContext(content: string, cursorOffset: number): boolean {
    const lines = content.split('\n');
    const frontmatterEnd = frontmatterEndLine(lines);

    let offset = 0;
    let bodyStart = 0;
    let fence: FenceDelimiter | null = null;

    for (let index = 0; index < lines.length; index++) {
        const lineEnd = offset + lines[index].length;
        const inFrontmatter = frontmatterEnd >= 0 && index <= frontmatterEnd;
        if (inFrontmatter) bodyStart = lineEnd + 1;

        if (cursorOffset <= lineEnd) {
            if (inFrontmatter || fence !== null) return true;
            // The document parser only sees the body, because a fence-shaped line in a
            // YAML value would otherwise open a phantom code block over the whole note
            return isInsideLineCode(content.slice(bodyStart), offset - bodyStart, lines[index], cursorOffset - offset);
        }

        // Fence state changes after the cursor check, so a cursor on the opening line is not
        // yet inside the block while one on the closing line still is.
        if (!inFrontmatter) {
            if (fence === null) fence = fenceDelimiterOf(lines[index]);
            else if (closesFence(lines[index], fence)) fence = null;
        }
        offset = lineEnd + 1;
    }

    return fence !== null;
}
