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
import { normalizeVersion } from '../releaseNotes';
import type {
    BetterPasteSettings,
    ImageFilenameFormat,
    ImageLinkPaste,
    TerminalBulletMode,
    TerminalRejoinMode,
    UrlStripMode
} from './types';

function asBoolean(value: unknown, fallback: boolean): boolean {
    return typeof value === 'boolean' ? value : fallback;
}

function asString(value: unknown, fallback: string): string {
    return typeof value === 'string' ? value : fallback;
}

function asStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return value.filter((entry): entry is string => typeof entry === 'string');
}

function asEnum<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
    return typeof value === 'string' && (allowed as readonly string[]).includes(value) ? (value as T) : fallback;
}

const URL_STRIP_MODES: readonly UrlStripMode[] = ['all', 'tracking'];
const BULLET_MODES: readonly TerminalBulletMode[] = ['preserve', 'markdown'];
const REJOIN_MODES: readonly TerminalRejoinMode[] = ['indented', 'any', 'never'];
const FILENAME_FORMATS: readonly ImageFilenameFormat[] = ['source', 'source-date', 'date-time'];
const IMAGE_LINK_PASTE: readonly ImageLinkPaste[] = ['image', 'link'];

/**
 * Builds a complete settings object from whatever was stored on disk. Every field is
 * validated so a hand-edited data.json cannot put the plugin in a broken state, and any
 * key that is not a current setting is simply dropped.
 */
export function normalizeSettings(raw: unknown): BetterPasteSettings {
    const data = (typeof raw === 'object' && raw !== null ? raw : {}) as Partial<Record<keyof BetterPasteSettings, unknown>>;
    const defaults = DEFAULT_SETTINGS;

    return {
        interceptPaste: asBoolean(data.interceptPaste, defaults.interceptPaste),
        showNotices: asBoolean(data.showNotices, defaults.showNotices),
        trimPaste: asBoolean(data.trimPaste, defaults.trimPaste),

        imagesEnabled: asBoolean(data.imagesEnabled, defaults.imagesEnabled),
        imageFilenameFormat: asEnum(data.imageFilenameFormat, FILENAME_FORMATS, defaults.imageFilenameFormat),
        imageLinkPaste: asEnum(data.imageLinkPaste, IMAGE_LINK_PASTE, defaults.imageLinkPaste),
        imageSizeProperty: asString(data.imageSizeProperty, defaults.imageSizeProperty).trim(),

        urlEnabled: asBoolean(data.urlEnabled, defaults.urlEnabled),
        urlStripMode: asEnum(data.urlStripMode, URL_STRIP_MODES, defaults.urlStripMode),
        // Only the user's own rules are stored; the shipped list is merged in at read time
        urlDomainRules: asStringArray(data.urlDomainRules),

        terminalEnabled: asBoolean(data.terminalEnabled, defaults.terminalEnabled),
        terminalRejoinMode: asEnum(data.terminalRejoinMode, REJOIN_MODES, defaults.terminalRejoinMode),
        terminalBulletMode: asEnum(data.terminalBulletMode, BULLET_MODES, defaults.terminalBulletMode),

        aiTextEnabled: asBoolean(data.aiTextEnabled, defaults.aiTextEnabled),
        aiTextPlainPunctuation: asBoolean(data.aiTextPlainPunctuation, defaults.aiTextPlainPunctuation),

        lastShownVersion: normalizeVersion(data.lastShownVersion)
    };
}

/** Splits a multi-line settings field into trimmed lines, dropping blank ones. */
export function parseLines(value: string): string[] {
    return value
        .split('\n')
        .map(line => line.trimEnd())
        .filter(line => line.trim().length > 0);
}

/** Reports site rule lines that will not parse, so the settings UI can flag them. */
export function findInvalidDomainRules(value: string): string[] {
    const invalid: string[] = [];

    for (const line of parseLines(value)) {
        const trimmed = line.trim();
        if (trimmed.startsWith('#')) continue;

        const body = trimmed.startsWith('!') ? trimmed.slice(1).trim() : trimmed;
        const site = body.split(/[|:]/)[0].trim();

        // "*.example.com" and "example.*" are both accepted spellings
        const anyTld = site.endsWith('.*');
        const domain = (anyTld ? site.slice(0, -2) : site).replace(/^\*\./, '');

        const labels = /^[a-z0-9-]+(\.[a-z0-9-]+)*$/i.test(domain);
        const looksLikeDomain = labels && (anyTld || domain.includes('.') || domain === 'localhost');
        if (!looksLikeDomain) invalid.push(trimmed);
    }

    return invalid;
}
