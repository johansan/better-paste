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

import { isListItemLine } from './listPaste';
import { BLOCKQUOTE_PREFIX } from './markdownRanges';

/**
 * Keeps the first line unchanged because native paste decides how it joins the
 * destination, then prefixes every later line with the destination quote prefix.
 */
export function continueQuotePaste(pasted: string, noteText: string, selectionStart: number, selectionEnd: number): string | null {
    const lines = pasted.split(/\r?\n/);
    if (lines.length < 2) return null;

    const lineStart = selectionStart === 0 ? 0 : noteText.lastIndexOf('\n', selectionStart - 1) + 1;
    const newlineIndex = noteText.indexOf('\n', selectionStart);
    const lineEnd = newlineIndex < 0 ? noteText.length : newlineIndex;
    if (selectionEnd > lineEnd) return null;

    const destinationLine = noteText.slice(lineStart, lineEnd);
    const prefix = BLOCKQUOTE_PREFIX.exec(destinationLine)?.[0] ?? '';
    if (!prefix.includes('>')) return null;
    if (selectionStart - lineStart < prefix.length) return null;
    if (noteText.slice(selectionEnd, lineEnd).trim() !== '') return null;

    const destinationContent = destinationLine.slice(prefix.length);
    if (isListItemLine(destinationContent) && lines.every(line => line.trim() === '' || isListItemLine(line))) return null;

    const blankPrefix = prefix.trimEnd();
    return lines.map((line, index) => (index === 0 ? line : line.trim() === '' ? blankPrefix : prefix + line)).join('\n');
}
