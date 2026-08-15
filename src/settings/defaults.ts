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

import type { BetterPasteSettings } from './types';
import { DEFAULT_IMAGE_NAME_TEMPLATE } from './constants';

export const DEFAULT_SETTINGS: BetterPasteSettings = {
    autoClean: true,

    imageEnabled: true,
    imageNameFormat: 'source',
    imageNameTemplate: DEFAULT_IMAGE_NAME_TEMPLATE,

    noteProperty: 'bp',
    imageSizeProperty: 'image-width',

    linkEnabled: true,
    linkTitles: true,
    linkStrip: 'all',
    // Empty means "use the shipped rules unchanged"; entries here are merged over them
    linkRules: [],

    terminalEnabled: true,
    terminalRejoin: 'indented',
    terminalBullets: 'markdown',

    textTrim: true,
    textComma: 'none',
    textInvisible: true,
    textPunctuation: true,

    // Empty means no release notes have been shown in this vault yet
    lastShownVersion: ''
};
