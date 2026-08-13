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
import { DEFAULT_IMAGE_FILENAME_TEMPLATE } from './constants';

export const DEFAULT_SETTINGS: BetterPasteSettings = {
    interceptPaste: true,
    showNotices: true,

    imagesEnabled: true,
    imageFilenameFormat: 'source',
    imageFilenameTemplate: DEFAULT_IMAGE_FILENAME_TEMPLATE,
    imageSizeProperty: 'image-width',

    urlEnabled: true,
    fetchLinkTitles: true,
    urlStripMode: 'all',
    // Empty means "use the shipped rules unchanged"; entries here are merged over them
    urlDomainRules: [],

    terminalEnabled: true,
    terminalRejoinMode: 'indented',
    terminalBulletMode: 'markdown',

    trimPaste: true,
    textCommaPlacement: 'none',

    aiTextEnabled: true,
    aiTextPlainPunctuation: true,

    // Empty means no release notes have been shown in this vault yet
    lastShownVersion: ''
};
