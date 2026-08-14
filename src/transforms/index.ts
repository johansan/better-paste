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

import { normalizeInvisibleCharacters, replacePunctuation } from './aiText';
import { cleanTerminalText } from './terminalText';
import { applyCommaPlacement } from './textProcessing';
import { buildUrlCleanupOptions, cleanUrlsInText, httpUrlRanges } from './urlCleanup';
import { imageReferenceRanges } from '../paste/imageReferences';
import type { BetterPasteSettings } from '../settings/types';

export interface TextPipelineResult {
    text: string;
    /** True when any rule modified the text. */
    changed: boolean;
    /** True when AI typography was normalised. */
    aiTextCleaned: boolean;
    /** True when terminal cleanup modified the text. */
    terminalCleaned: boolean;
    /** True when a Text processing rule modified the text. */
    textProcessed: boolean;
    /** Number of URLs that were cleaned. */
    urlsCleaned: number;
}

/** Trims surrounding paste noise while preserving indentation that makes the first line code. */
function trimPasteEdges(text: string): string {
    let trimmed = text.replace(/^(?:[ \t]*\r?\n)+/, '').replace(/(?:\r?\n[ \t]*)+$/, '');
    if (!/^(?: {4}|\t)/.test(trimmed)) trimmed = trimmed.replace(/^[ \t]+/, '');
    return trimmed.replace(/[ \t]+$/, '');
}

/**
 * Runs the synchronous text rules in order.
 *
 * The two halves of the character rule sit on either side of the terminal rule, and the
 * order is load-bearing in both directions:
 *
 * - Invisible characters go first. A no-break space is not whitespace to a regular
 *   expression, so leaving one in would defeat the blank-line and indentation detection
 *   that the terminal rule depends on.
 * - AI punctuation runs after structural rules. A hyphen is a list marker, so converting a long dash early would
 *   make the terminal rule read that line as a bullet, refuse to rejoin the paragraph, and
 *   leave the sentence rendering as a list item.
 *
 * The trim comes after everything, so it also clears blank lines the other rules left
 * behind rather than only the ones that were pasted.
 */
export function runTextPipeline(input: string, settings: BetterPasteSettings): TextPipelineResult {
    let text = input;
    let aiTextCleaned = false;
    let terminalCleaned = false;
    let textProcessed = false;
    let urlsCleaned = 0;

    if (settings.textInvisible) {
        const result = normalizeInvisibleCharacters(text, httpUrlRanges(text));
        aiTextCleaned = result.changed;
        text = result.text;
    }

    if (settings.terminalEnabled) {
        const result = cleanTerminalText(text, settings);
        terminalCleaned = result.changed;
        text = result.text;
    }

    if (settings.linkEnabled) {
        // Anything that is about to be downloaded as an image is off limits to URL
        // cleaning, which would otherwise strip the token out of a signed link
        const protect = settings.imageEnabled ? imageReferenceRanges(text) : [];
        const result = cleanUrlsInText(text, buildUrlCleanupOptions(settings), protect);
        urlsCleaned = result.count;
        text = result.text;
    }

    if (settings.textInvisible && settings.textPunctuation) {
        const result = replacePunctuation(text, httpUrlRanges(text));
        aiTextCleaned = aiTextCleaned || result.changed;
        text = result.text;
    }

    if (settings.textComma !== 'none') {
        const result = applyCommaPlacement(text, settings.textComma);
        textProcessed = result.changed;
        text = result.text;
    }

    // Last, so it also clears whatever the rules above left at the edges
    if (settings.textTrim) text = trimPasteEdges(text);

    return { text, changed: text !== input, aiTextCleaned, terminalCleaned, textProcessed, urlsCleaned };
}
