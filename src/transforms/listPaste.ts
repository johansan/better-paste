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

/** Rejects thematic breaks because their opening shape also matches ITEM_PATTERN. */
export function isListItemLine(line: string): boolean {
    return ITEM_PATTERN.test(line) && !THEMATIC_BREAK.test(line);
}

function parseItem(line: string): ListItemLine | null {
    const match = ITEM_PATTERN.exec(line);
    if (!match) return null;
    return { indent: match[1], marker: match[2], checkbox: match[3] ?? '', content: match[4] };
}

/** The list family a marker belongs to: its bullet character, or its ordered delimiter. */
function markerFamily(marker: string): string {
    return marker.replace(/^\d+/, '').trim();
}

/** The first non-blank line after `lineEnd`, or null at the end of the note. */
function lineBelow(noteText: string, lineEnd: number): string | null {
    let start = lineEnd + 1;
    while (start <= noteText.length) {
        const newlineIndex = noteText.indexOf('\n', start);
        const stop = newlineIndex < 0 ? noteText.length : newlineIndex;
        const line = noteText.slice(start, stop);
        if (line.trim() !== '') return line;
        if (newlineIndex < 0) break;
        start = newlineIndex + 1;
    }
    return null;
}

/**
 * One indentation step in the destination's own style. The destination indent answers
 * directly when it uses tabs. The destination's own first child is the most direct
 * evidence and comes next, because the pasted lines land right above the existing
 * children, whose depth must survive. Then the nearest line above whose indent is a
 * proper prefix of the destination's supplies the step. Otherwise the source's own step
 * is kept, and a tab stands in when even the source is flat.
 */
function destinationUnit(
    noteText: string,
    destLineStart: number,
    destLineEnd: number,
    destIndent: string,
    sourceItems: readonly ListItemLine[],
    unitWidth: number
): string {
    if (destIndent.includes('\t')) return '\t';

    const below = lineBelow(noteText, destLineEnd);
    if (below !== null) {
        const item = parseItem(below);
        if (item !== null && item.indent.length > destIndent.length && item.indent.startsWith(destIndent)) {
            const suffix = item.indent.slice(destIndent.length);
            return suffix.includes('\t') ? '\t' : suffix;
        }
    }

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

    // Depth from a stack of ancestors, the way Markdown itself nests: a child starts at
    // or past its parent's content indent (indent plus marker), anything shallower down
    // to the level's own indent is a sibling, and shallower still climbs the stack.
    // Branches may use different step widths, as content-aligned lists do, so a width
    // ranks nothing globally, and a one-space sibling wobble stays a sibling. An item
    // shallower than the first would need a place outside the destination subtree, so
    // the rule declines there.
    const stack: { width: number; content: number }[] = [];
    const depths = new Map<ListItemLine, number>();
    // An empty item anchors its children one column past the bare marker, ignoring
    // trailing padding, which is Markdown's empty-item rule
    const contentIndentOf = (item: ListItemLine): number =>
        item.content === '' && item.checkbox === '' ? item.marker.trimEnd().length + 1 : item.marker.length;
    // The smallest step between a parent and its child, kept as the fallback unit
    let unitWidth = 0;
    for (const item of items) {
        const width = indentWidthOf(item.indent);
        while (stack.length > 0 && width < stack[stack.length - 1].width) stack.pop();
        if (stack.length === 0 && item !== first) return null;
        const top = stack[stack.length - 1];
        if (top !== undefined && width < top.content) {
            depths.set(item, stack.length - 1);
            top.content = width + contentIndentOf(item);
            continue;
        }
        if (top !== undefined) {
            const gap = width - top.width;
            if (unitWidth === 0 || gap < unitWidth) unitWidth = gap;
        }
        depths.set(item, stack.length);
        stack.push({ width, content: width + contentIndentOf(item) });
    }
    const depthOf = (item: ListItemLine): number => depths.get(item) ?? 0;

    const lineStart = selectionStart === 0 ? 0 : noteText.lastIndexOf('\n', selectionStart - 1) + 1;
    const newlineIndex = noteText.indexOf('\n', selectionStart);
    const lineEnd = newlineIndex < 0 ? noteText.length : newlineIndex;
    if (selectionEnd > lineEnd) return null;

    // A spaced horizontal rule such as "- - -" parses as an item but is a divider, and
    // claiming a paste there would file the list under it as indented code
    const destLine = noteText.slice(lineStart, lineEnd);
    if (THEMATIC_BREAK.test(destLine)) return null;
    const dest = parseItem(destLine);
    if (dest === null) return null;

    const prefixLength = dest.indent.length + dest.marker.length + dest.checkbox.length;
    if (selectionStart - lineStart < prefixLength) return null;
    if (noteText.slice(selectionEnd, lineEnd).trim() !== '') return null;

    const emptyItem = noteText.slice(lineStart + prefixLength, selectionStart).trim() === '';
    const unit = destinationUnit(noteText, lineStart, lineEnd, dest.indent, items, unitWidth);

    // True when the destination item already has lines of its own below, whose depth
    // relative to the pasted tail must survive the paste
    const followingLine = lineBelow(noteText, lineEnd);
    const hasChildBelow = followingLine !== null && indentWidthOf(followingLine) > indentWidthOf(dest.indent);

    // A child of a padded empty item such as "-   " sits one column past the bare
    // marker. Filling the item re-anchors its children at the padded content indent,
    // where they no longer reach, so such a paste stays flat.
    if (
        emptyItem &&
        hasChildBelow &&
        followingLine !== null &&
        indentWidthOf(followingLine) < indentWidthOf(dest.indent) + dest.marker.length
    ) {
        return null;
    }
    const unitColumns = unit === '\t' ? 4 : unit.length;
    // A child's content must start past its parent's marker but within three columns
    // of it, so the step both clears a wide marker such as "100. " and is capped: a
    // wide source-derived unit under a narrow emitted marker would otherwise push the
    // child past the nesting window and out of the list. Tab steps always land inside
    // the window, so only space steps need the cap.
    const stepPast = (marker: string): string => {
        const steps = Math.max(1, Math.ceil(marker.length / unitColumns));
        if (unit === '\t') return unit.repeat(steps);
        return ' '.repeat(Math.min(unitColumns * steps, marker.length + 3));
    };

    const out: string[] = [];
    // Indent per depth, each entry set when its parent is emitted
    const indents: string[] = [];
    const emit = (item: ListItemLine, depth: number, marker = item.marker, checkbox = item.checkbox): void => {
        for (let level = 1; level <= depth; level++) {
            if (indents[level] === undefined) indents[level] = indents[level - 1] + unit;
        }
        const indent = indents[depth];
        out.push(indent + marker + checkbox + item.content);
        indents.length = depth + 1;
        indents[depth + 1] = indent + stepPast(marker);
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
        indents[1] = dest.indent + stepPast(dest.marker);

        // Further roots from the first root's list follow the destination's marker as
        // well, because mixing marker families at one level splits the list in two. An
        // ordered destination numbers them onward from its own value. A root from a
        // different family stays itself only while that also differs from the
        // destination's family: the clipboard held two adjacent lists, and where the
        // families collide the renderer merges them anyway, so converting keeps the
        // written numbers matching the rendered ones.
        const ordered = /^(\d{1,9})([.)])([ \t]+)$/.exec(dest.marker);
        let rootNumber = ordered ? Number(ordered[1]) : 0;
        const firstFamily = markerFamily(first.marker);
        const destFamily = markerFamily(dest.marker);

        // A kept root's own marker escapes the width rules below; any width other
        // than the destination's shifts the nesting window and with children
        // following would capture them as continuation text or drop them from the
        // list, so the paste stays flat instead
        if (hasChildBelow) {
            for (const item of items) {
                if (item === first || depths.get(item) !== 0) continue;
                const family = markerFamily(item.marker);
                if (family !== firstFamily && family !== destFamily && item.marker.length !== dest.marker.length) return null;
            }
        }

        const rootMarker = (item: ListItemLine): string => {
            const family = markerFamily(item.marker);
            if (family !== firstFamily && family !== destFamily) return item.marker;
            if (!ordered) return dest.marker;
            // With children below, a number crossing a digit boundary would widen the
            // marker and push those children out of their nesting window, so the
            // destination's literal repeats and the renderer numbers onward by itself
            if (hasChildBelow) return dest.marker;
            // Markdown markers carry at most nine digits, and a renderer numbers a
            // repeated literal onward by itself
            rootNumber = Math.min(rootNumber + 1, 999999999);
            return `${rootNumber}${ordered[2]}${ordered[3]}`;
        };

        for (const line of parsedLines.slice(1)) {
            if (line === null) out.push('');
            else if (depthOf(line) === 0) {
                // A root without its own checkbox takes the destination's, so pasting
                // a plain list onto an empty task yields tasks throughout, not one
                const checkbox = line.checkbox !== '' ? line.checkbox : dest.checkbox;
                emit(line, 0, rootMarker(line), checkbox);
            } else emit(line, depthOf(line));
        }
    } else {
        // The destination item already has content, so the pasted tree becomes its
        // children, starting on the next line. A run of ordered roots is renumbered
        // from one, because a list directly below the parent's text only opens when it
        // starts there; deeper levels keep their markers.
        out.push('');
        indents[0] = dest.indent + stepPast(dest.marker);
        let childNumber = 0;
        let runDelimiter: string | null = null;
        for (const line of parsedLines) {
            if (line === null) {
                out.push('');
                continue;
            }
            const depth = depthOf(line);
            if (depth !== 0) {
                emit(line, depth);
                continue;
            }
            const ordered = /^\d{1,9}([.)])([ \t]+)$/.exec(line.marker);
            if (ordered === null) {
                runDelimiter = null;
                emit(line, 0);
                continue;
            }
            childNumber = runDelimiter === ordered[1] ? childNumber + 1 : 1;
            runDelimiter = ordered[1];
            emit(line, 0, `${childNumber}${ordered[1]}${ordered[2]}`);
        }
    }

    return { inserted: out.join('\n'), from };
}
