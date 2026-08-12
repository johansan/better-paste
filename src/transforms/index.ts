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
import { buildUrlCleanupOptions, cleanUrlsInText } from './urlCleanup';
import type { BetterPasteSettings } from '../settings/types';

export interface TextPipelineResult {
    text: string;
    /** True when any rule modified the text. */
    changed: boolean;
    /** True when AI typography was normalised. */
    aiTextCleaned: boolean;
    /** True when terminal cleanup modified the text. */
    terminalCleaned: boolean;
    /** Number of URLs that were cleaned. */
    urlsCleaned: number;
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
 * - Punctuation goes last. A hyphen is a list marker, so converting "— he said" early would
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
    let urlsCleaned = 0;

    if (settings.aiTextEnabled) {
        const result = normalizeInvisibleCharacters(text);
        aiTextCleaned = result.changed;
        text = result.text;
    }

    if (settings.terminalEnabled) {
        const result = cleanTerminalText(text, settings);
        terminalCleaned = result.changed;
        text = result.text;
    }

    if (settings.urlEnabled) {
        const result = cleanUrlsInText(text, buildUrlCleanupOptions(settings));
        urlsCleaned = result.count;
        text = result.text;
    }

    if (settings.aiTextEnabled && settings.aiTextPlainPunctuation) {
        const result = replacePunctuation(text);
        aiTextCleaned = aiTextCleaned || result.changed;
        text = result.text;
    }

    // Last, so it also clears whatever the rules above left at the edges
    if (settings.trimPaste) text = text.trim();

    return { text, changed: text !== input, aiTextCleaned, terminalCleaned, urlsCleaned };
}

export { cleanAiText, normalizeInvisibleCharacters, replacePunctuation } from './aiText';
export { cleanTerminalText } from './terminalText';
export { buildUrlCleanupOptions, cleanUrl, cleanUrlsInText } from './urlCleanup';
export { stripAnsi } from './ansi';
