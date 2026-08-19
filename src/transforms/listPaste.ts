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
 * Rebase of a pasted list onto the list item at the cursor.
 *
 * A copied list carries the indentation of the place it came from, so pasted as is into
 * another list its items keep that absolute indentation and the tree falls apart. When
 * the clipboard is nothing but list items and the paste lands on a list item, the pasted
 * lines are reindented relative to the destination instead, so the tree keeps its shape.
 *
 * This is a document transform: the result depends on the destination note, which is
 * passed in as text and offsets, so the rule itself stays pure.
 */

import { indentWidthOf } from './markdownRanges';

/** A list item line split into its parts. Marker and checkbox keep their trailing space. */
interface ListItemLine {
    indent: string;
    marker: string;
    checkbox: string;
    content: string;
}

/** A list item: indentation, bullet or ordered marker, optional checkbox, content. */
const ITEM_PATTERN = /^([ \t]*)((?:[-*+]|\d{1,9}[.)])[ \t]+)(\[.\][ \t]+)?(.*)$/;

/** A horizontal rule, which ITEM_PATTERN would otherwise read as a list item. */
const THEMATIC_BREAK = /^[ \t]*(?:(?:-[ \t]*){3,}|(?:\*[ \t]*){3,}|(?:_[ \t]*){3,})$/;

function parseItem(line: string): ListItemLine | null {
    const match = ITEM_PATTERN.exec(line);
    if (!match) return null;
    return { indent: match[1], marker: match[2], checkbox: match[3] ?? '', content: match[4] };
}

/** The list family a marker belongs to: its bullet character, or its ordered delimiter. */
function markerFamily(marker: string): string {
    return marker.replace(/^\d+/, '').trim();
}

/**
 * One indentation step in the destination's own style. The destination indent answers
 * directly when it uses tabs. For spaces, the nearest line above whose indent is a
 * proper prefix of the destination's supplies the step. Otherwise the source's own step
 * is kept, and a tab stands in when even the source is flat.
 */
function destinationUnit(
    noteText: string,
    destLineStart: number,
    destIndent: string,
    sourceItems: readonly ListItemLine[],
    unitWidth: number
): string {
    if (destIndent.includes('\t')) return '\t';

    if (destIndent.length > 0) {
        let lineEndAbove = destLineStart - 1;
        while (lineEndAbove >= 0) {
            const startAbove = lineEndAbove === 0 ? 0 : noteText.lastIndexOf('\n', lineEndAbove - 1) + 1;
            const item = parseItem(noteText.slice(startAbove, lineEndAbove));
            if (item === null) break;
            if (item.indent.length < destIndent.length && destIndent.startsWith(item.indent)) return destIndent.slice(item.indent.length);
            lineEndAbove = startAbove - 1;
        }

        // The destination indents with spaces, and a tab behind them would stop at the
        // next tab stop instead of adding four columns, so the step stays in spaces
        return ' '.repeat(unitWidth > 0 ? unitWidth : 4);
    }

    if (sourceItems.some(item => item.indent.includes('\t'))) return '\t';
    return unitWidth > 0 ? ' '.repeat(unitWidth) : '\t';
}

/**
 * Reindents a pasted list relative to the list item at the cursor, or returns null when
 * the paste is not one this rule claims, leaving it to be inserted unchanged.
 *
 * The rule only takes a clipboard that is entirely list items, at least two of them,
 * with the first item as the shallowest, pasted onto a list item line with nothing but
 * whitespace after the cursor. An empty destination item receives the first pasted
 * item as its own content, so the destination's marker decides the root. A destination
 * with content receives the whole pasted tree as its children on the following lines.
 */
export interface RebasedListPaste {
    /** The text to write over the note from `from` to the selection end. */
    inserted: string;
    /** Usually the selection start; earlier when the destination's checkbox is replaced. */
    from: number;
}

export function rebaseListPaste(pasted: string, noteText: string, selectionStart: number, selectionEnd: number): RebasedListPaste | null {
    const lines = pasted.split(/\r?\n/);
    if (lines.length < 2 || lines[0].trim() === '') return null;

    // Blank lines pass through, keeping loose lists loose. Any other non-item line
    // means the clipboard is mixed content, which this rule must not reindent.
    const parsedLines: (ListItemLine | null)[] = [];
    let itemCount = 0;
    for (const line of lines) {
        if (line.trim() === '') {
            parsedLines.push(null);
            continue;
        }
        if (THEMATIC_BREAK.test(line)) return null;
        const item = parseItem(line);
        if (item === null) return null;
        parsedLines.push(item);
        itemCount += 1;
    }
    if (itemCount < 2) return null;

    const items = parsedLines.filter((item): item is ListItemLine => item !== null);
    const first = items[0];

    // Depth from a stack of ancestor widths, the way Markdown itself nests: wider than
    // the last item is one level deeper, a repeated width rejoins that ancestor's
    // level. Branches may use different step widths, as content-aligned lists do, so a
    // width ranks nothing globally. An item shallower than the first would need a place
    // outside the destination subtree, so the rule declines there.
    const stack: number[] = [];
    const depths = new Map<ListItemLine, number>();
    // The smallest step between a parent and its child, kept as the fallback unit
    let unitWidth = 0;
    for (const item of items) {
        const width = indentWidthOf(item.indent);
        while (stack.length > 0 && width < stack[stack.length - 1]) stack.pop();
        if (stack.length === 0 && item !== first) return null;
        if (stack.length > 0 && width === stack[stack.length - 1]) {
            depths.set(item, stack.length - 1);
            continue;
        }
        if (stack.length > 0) {
            const gap = width - stack[stack.length - 1];
            if (unitWidth === 0 || gap < unitWidth) unitWidth = gap;
        }
        depths.set(item, stack.length);
        stack.push(width);
    }
    const depthOf = (item: ListItemLine): number => depths.get(item) ?? 0;

    const lineStart = selectionStart === 0 ? 0 : noteText.lastIndexOf('\n', selectionStart - 1) + 1;
    const newlineIndex = noteText.indexOf('\n', selectionStart);
    const lineEnd = newlineIndex < 0 ? noteText.length : newlineIndex;
    if (selectionEnd > lineEnd) return null;

    const dest = parseItem(noteText.slice(lineStart, lineEnd));
    if (dest === null) return null;

    const prefixLength = dest.indent.length + dest.marker.length + dest.checkbox.length;
    if (selectionStart - lineStart < prefixLength) return null;
    if (noteText.slice(selectionEnd, lineEnd).trim() !== '') return null;

    const emptyItem = noteText.slice(lineStart + prefixLength, selectionStart).trim() === '';
    const unit = destinationUnit(noteText, lineStart, dest.indent, items, unitWidth);
    const unitColumns = unit === '\t' ? 4 : unit.length;
    // A child's content must start past its parent's marker, so a wide marker such as
    // "100. " needs more than one four-column step before the child
    const stepsPast = (marker: string): number => Math.max(1, Math.ceil(marker.length / unitColumns));

    const out: string[] = [];
    // Indent per depth, each entry set when its parent is emitted
    const indents: string[] = [];
    const emit = (item: ListItemLine, depth: number, marker = item.marker): void => {
        for (let level = 1; level <= depth; level++) {
            if (indents[level] === undefined) indents[level] = indents[level - 1] + unit;
        }
        const indent = indents[depth];
        out.push(indent + marker + item.checkbox + item.content);
        indents.length = depth + 1;
        indents[depth + 1] = indent + unit.repeat(stepsPast(marker));
    };

    let from = selectionStart;
    if (emptyItem) {
        // The first item becomes the destination item's content, so the destination's
        // marker decides the root and a bullet pasted onto "1. " stays ordered. When
        // both carry a checkbox in different states the pasted state wins, reaching
        // back over the destination's checkbox, because tasks copied in one state must
        // not land in mixed ones. Otherwise the destination's checkbox stands.
        if (dest.checkbox !== '' && first.checkbox !== '' && first.checkbox !== dest.checkbox) {
            from = lineStart + dest.indent.length + dest.marker.length;
            out.push(first.checkbox + first.content);
        } else {
            out.push((dest.checkbox === '' ? first.checkbox : '') + first.content);
        }
        indents[0] = dest.indent;
        indents[1] = dest.indent + unit.repeat(stepsPast(dest.marker));

        // Further roots from the first root's list follow the destination's marker as
        // well, because mixing marker families at one level splits the list in two. An
        // ordered destination numbers them onward from its own value. A root from a
        // different family stays itself: the clipboard held two adjacent lists, and
        // joining them would merge what the source kept separate.
        const ordered = /^(\d{1,9})([.)])([ \t]+)$/.exec(dest.marker);
        let rootNumber = ordered ? Number(ordered[1]) : 0;
        const firstFamily = markerFamily(first.marker);
        const rootMarker = (item: ListItemLine): string => {
            if (markerFamily(item.marker) !== firstFamily) return item.marker;
            if (!ordered) return dest.marker;
            rootNumber += 1;
            return `${rootNumber}${ordered[2]}${ordered[3]}`;
        };

        for (const line of parsedLines.slice(1)) {
            if (line === null) out.push('');
            else if (depthOf(line) === 0) emit(line, 0, rootMarker(line));
            else emit(line, depthOf(line));
        }
    } else {
        // The destination item already has content, so the pasted tree becomes its
        // children, starting on the next line with every marker kept.
        out.push('');
        indents[0] = dest.indent + unit.repeat(stepsPast(dest.marker));
        for (const line of parsedLines) {
            if (line === null) out.push('');
            else emit(line, depthOf(line));
        }
    }

    return { inserted: out.join('\n'), from };
}
