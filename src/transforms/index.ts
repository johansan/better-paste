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

import { cleanTerminalText } from './terminalText';
import { cleanUrlsInText } from './urlCleanup';
import type { BetterPasteSettings } from '../settings/types';

export interface TextPipelineResult {
    text: string;
    /** True when any rule modified the text. */
    changed: boolean;
    /** Number of URLs that were cleaned. */
    urlsCleaned: number;
    /** True when terminal cleanup modified the text. */
    terminalCleaned: boolean;
}

/**
 * Runs the synchronous text rules in order. Terminal cleanup runs first because it
 * restores line structure that URL cleaning would otherwise have to work around.
 */
export function runTextPipeline(input: string, settings: BetterPasteSettings): TextPipelineResult {
    let text = input;
    let terminalCleaned = false;
    let urlsCleaned = 0;

    if (settings.terminalEnabled) {
        const result = cleanTerminalText(text, settings);
        terminalCleaned = result.changed;
        text = result.text;
    }

    if (settings.urlEnabled) {
        const result = cleanUrlsInText(text, settings);
        urlsCleaned = result.count;
        text = result.text;
    }

    return { text, changed: text !== input, urlsCleaned, terminalCleaned };
}

export { cleanTerminalText } from './terminalText';
export { cleanUrl, cleanUrlsInText } from './urlCleanup';
export { stripAnsi } from './ansi';
