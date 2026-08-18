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

import { frontmatterRanges, normalizeInvisibleCharacters, straightenDashes, straightenQuotes } from './typography';
import { stripAnsi } from './ansi';
import { buildUrlCleanupOptions, cleanUrlsInText, httpUrlRanges } from './urlCleanup';
import { imageReferenceRanges } from '../paste/imageReferences';
import { applyTextSnippets } from './snippets';
import type { BetterPasteSettings } from '../settings/types';

export interface TextPipelineResult {
    text: string;
    /** True when any rule modified the text. */
    changed: boolean;
}

/** Trims surrounding paste noise while preserving indentation that makes the first line code. */
function trimPasteEdges(text: string): string {
    let trimmed = text.replace(/^(?:[ \t]*\r?\n)+/, '').replace(/(?:\r?\n[ \t]*)+$/, '');
    // An indented list item keeps its indent, because stripping it from the first line
    // only would turn two siblings into a parent and a nested child
    const listItem = /^[ \t]+(?:[-*+][ \t]|\d{1,9}[.)][ \t])/.test(trimmed);
    if (!listItem && !/^(?: {4}|\t)/.test(trimmed)) trimmed = trimmed.replace(/^[ \t]+/, '');
    return trimmed.replace(/[ \t]+$/, '');
}

/**
 * Runs the synchronous text rules in order. Invisible characters and escape codes go
 * first, so the structural rules see clean whitespace. The trim comes after everything,
 * so it also clears blank lines the other rules left behind rather than only the ones
 * that were pasted.
 */
export function runTextPipeline(input: string, settings: BetterPasteSettings): TextPipelineResult {
    let text = input;

    // Escape sequences are removed together with the invisible characters: color
    // codes and cursor controls are never content a note wants to keep
    if (settings.textInvisible) {
        text = stripAnsi(text);
        text = normalizeInvisibleCharacters(text, httpUrlRanges(text)).text;
    }

    if (settings.linkEnabled) {
        // Image references are off limits to URL cleaning whether or not they are
        // downloaded: stripping the token out of a signed link breaks the download,
        // and breaks the remote embed even more permanently when the link stays in
        // the note. A URL in a frontmatter value is data and keeps its parameters too.
        const protect = [...imageReferenceRanges(text), ...frontmatterRanges(text)];
        text = cleanUrlsInText(text, buildUrlCleanupOptions(settings), protect).text;
    }

    if (settings.textDashes) text = straightenDashes(text, httpUrlRanges(text)).text;

    if (settings.textQuotes) text = straightenQuotes(text, httpUrlRanges(text)).text;

    text = applyTextSnippets(text, settings.textSnippets).text;

    // Last, so it also clears whatever the rules above left at the edges
    if (settings.textTrim) text = trimPasteEdges(text);

    return { text, changed: text !== input };
}
