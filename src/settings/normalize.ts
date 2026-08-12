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

import { DEFAULT_SETTINGS } from './defaults';
import type { BetterPasteSettings, ImageFolderMode, TerminalBulletMode, UrlStripMode } from './types';

/** Bounds for the numeric settings, applied when loading data written by an older version. */
const LIMITS = {
    imageMaxSizeMb: { min: 0, max: 1024 },
    imageTimeoutSeconds: { min: 1, max: 300 },
    terminalMinWrapWidth: { min: 1, max: 400 }
} as const;

function asBoolean(value: unknown, fallback: boolean): boolean {
    return typeof value === 'boolean' ? value : fallback;
}

function asString(value: unknown, fallback: string): string {
    return typeof value === 'string' ? value : fallback;
}

function asNumber(value: unknown, fallback: number, min: number, max: number): number {
    if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
    return Math.min(max, Math.max(min, Math.round(value)));
}

function asStringArray(value: unknown, fallback: readonly string[]): string[] {
    if (!Array.isArray(value)) return [...fallback];
    const entries = value.filter((entry): entry is string => typeof entry === 'string');
    return entries.length > 0 || value.length === 0 ? entries : [...fallback];
}

function asEnum<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
    return typeof value === 'string' && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

const URL_STRIP_MODES: readonly UrlStripMode[] = ['all', 'tracking'];
const BULLET_MODES: readonly TerminalBulletMode[] = ['preserve', 'markdown'];
const FOLDER_MODES: readonly ImageFolderMode[] = ['obsidian', 'custom'];

/**
 * Builds a complete settings object from whatever was stored on disk. Every field is
 * validated so a hand-edited or outdated data.json cannot put the plugin in a broken state.
 */
export function normalizeSettings(raw: unknown): BetterPasteSettings {
    const data = (typeof raw === 'object' && raw !== null ? raw : {}) as Partial<Record<keyof BetterPasteSettings, unknown>>;
    const defaults = DEFAULT_SETTINGS;

    return {
        interceptPaste: asBoolean(data.interceptPaste, defaults.interceptPaste),
        showNotices: asBoolean(data.showNotices, defaults.showNotices),

        imagesEnabled: asBoolean(data.imagesEnabled, defaults.imagesEnabled),
        downloadRemoteImages: asBoolean(data.downloadRemoteImages, defaults.downloadRemoteImages),
        downloadDataUriImages: asBoolean(data.downloadDataUriImages, defaults.downloadDataUriImages),
        downloadBareImageUrls: asBoolean(data.downloadBareImageUrls, defaults.downloadBareImageUrls),
        imageFolderMode: asEnum(data.imageFolderMode, FOLDER_MODES, defaults.imageFolderMode),
        imageFolder: asString(data.imageFolder, defaults.imageFolder),
        imageFilenameTemplate:
            asString(data.imageFilenameTemplate, defaults.imageFilenameTemplate).trim() || defaults.imageFilenameTemplate,
        imageMaxSizeMb: asNumber(data.imageMaxSizeMb, defaults.imageMaxSizeMb, LIMITS.imageMaxSizeMb.min, LIMITS.imageMaxSizeMb.max),
        imageTimeoutSeconds: asNumber(
            data.imageTimeoutSeconds,
            defaults.imageTimeoutSeconds,
            LIMITS.imageTimeoutSeconds.min,
            LIMITS.imageTimeoutSeconds.max
        ),
        imageExtensions: asStringArray(data.imageExtensions, defaults.imageExtensions),
        imageSizeProperty: asString(data.imageSizeProperty, defaults.imageSizeProperty).trim(),

        urlEnabled: asBoolean(data.urlEnabled, defaults.urlEnabled),
        urlStripMode: asEnum(data.urlStripMode, URL_STRIP_MODES, defaults.urlStripMode),
        urlTrackingParams: asStringArray(data.urlTrackingParams, defaults.urlTrackingParams),
        urlKeepParams: asStringArray(data.urlKeepParams, defaults.urlKeepParams),
        urlDomainRules: asStringArray(data.urlDomainRules, defaults.urlDomainRules),
        urlStripTextFragments: asBoolean(data.urlStripTextFragments, defaults.urlStripTextFragments),
        urlStripAllFragments: asBoolean(data.urlStripAllFragments, defaults.urlStripAllFragments),
        urlStripTrailingSlash: asBoolean(data.urlStripTrailingSlash, defaults.urlStripTrailingSlash),

        terminalEnabled: asBoolean(data.terminalEnabled, defaults.terminalEnabled),
        terminalUnwrapLines: asBoolean(data.terminalUnwrapLines, defaults.terminalUnwrapLines),
        terminalRequireIndent: asBoolean(data.terminalRequireIndent, defaults.terminalRequireIndent),
        terminalMinWrapWidth: asNumber(
            data.terminalMinWrapWidth,
            defaults.terminalMinWrapWidth,
            LIMITS.terminalMinWrapWidth.min,
            LIMITS.terminalMinWrapWidth.max
        ),
        terminalDedent: asBoolean(data.terminalDedent, defaults.terminalDedent),
        terminalStripAnsi: asBoolean(data.terminalStripAnsi, defaults.terminalStripAnsi),
        terminalCollapseBlankLines: asBoolean(data.terminalCollapseBlankLines, defaults.terminalCollapseBlankLines),
        terminalTrimTrailingWhitespace: asBoolean(data.terminalTrimTrailingWhitespace, defaults.terminalTrimTrailingWhitespace),
        terminalPreserveCodeBlocks: asBoolean(data.terminalPreserveCodeBlocks, defaults.terminalPreserveCodeBlocks),
        terminalBulletMode: asEnum(data.terminalBulletMode, BULLET_MODES, defaults.terminalBulletMode),
        terminalListMarkers: asStringArray(data.terminalListMarkers, defaults.terminalListMarkers)
    };
}

/** Splits a multi-line settings field into trimmed lines, dropping blank ones. */
export function parseLines(value: string): string[] {
    return value
        .split('\n')
        .map(line => line.trimEnd())
        .filter(line => line.trim().length > 0);
}

/** Splits a settings field that accepts either newlines or commas as separators. */
export function parseTokens(value: string): string[] {
    return value
        .split(/[\n,]/)
        .map(token => token.trim())
        .filter(token => token.length > 0);
}
