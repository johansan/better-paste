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
import type { BetterPasteSettings, ImageNameFormat } from './types';

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

/** Splits a comma-separated options field into trimmed values, dropping blank ones. */
export function parseCommaList(value: string): string[] {
    return value
        .split(',')
        .map(entry => entry.trim())
        .filter(entry => entry.length > 0);
}

/** Keeps an embed choice only while its value is still one of the offered options. */
function asEmbedChoice(value: unknown, options: string): string {
    if (typeof value !== 'string') return '';
    // Asking with nothing to offer would silently do nothing, so it falls back to none
    if (value === 'ask') return parseCommaList(options).length > 0 ? 'ask' : '';
    if (value === '') return value;
    return parseCommaList(options).includes(value) ? value : '';
}
const NAME_FORMATS: readonly ImageNameFormat[] = ['source', 'custom'];

/**
 * Builds a complete settings object from whatever was stored on disk. Every field is
 * validated so a hand-edited data.json cannot put the plugin in a broken state, and any
 * key that is not a current setting is simply dropped.
 */
export function normalizeSettings(raw: unknown): BetterPasteSettings {
    const data = (typeof raw === 'object' && raw !== null ? raw : {}) as Partial<Record<keyof BetterPasteSettings, unknown>>;
    const defaults = DEFAULT_SETTINGS;

    return {
        autoClean: asBoolean(data.autoClean, defaults.autoClean),

        imageEnabled: asBoolean(data.imageEnabled, defaults.imageEnabled),
        imageNameFormat: asEnum(data.imageNameFormat, NAME_FORMATS, defaults.imageNameFormat),
        imageNameTemplate: asString(data.imageNameTemplate, defaults.imageNameTemplate).trim() || defaults.imageNameTemplate,
        imageSizeOptions: asString(data.imageSizeOptions, defaults.imageSizeOptions),
        imageSizeChoice: asEmbedChoice(data.imageSizeChoice, asString(data.imageSizeOptions, defaults.imageSizeOptions)),
        imageClassOptions: asString(data.imageClassOptions, defaults.imageClassOptions),
        imageClassChoice: asEmbedChoice(data.imageClassChoice, asString(data.imageClassOptions, defaults.imageClassOptions)),
        imageLastSize: asString(data.imageLastSize, ''),
        imageLastClass: asString(data.imageLastClass, ''),
        noteProperty: asString(data.noteProperty, defaults.noteProperty).trim(),
        imageSizeProperty: asString(data.imageSizeProperty, defaults.imageSizeProperty).trim(),

        linkEnabled: asBoolean(data.linkEnabled, defaults.linkEnabled),
        linkTitles: asBoolean(data.linkTitles, defaults.linkTitles),
        // The former linkRules field held parameter keep-lists. It cannot be migrated
        // because interpreting those names as removals would reverse the user's intent.
        linkRemovals: asStringArray(data.linkRemovals),

        textTrim: asBoolean(data.textTrim, defaults.textTrim),
        textInvisible: asBoolean(data.textInvisible, defaults.textInvisible),
        textQuotes: asBoolean(data.textQuotes, defaults.textQuotes),
        textDashes: asBoolean(data.textDashes, defaults.textDashes),

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

/** Reports removal lines that will not parse, so the settings UI can flag them. */
export function findInvalidRemovalRules(value: string): string[] {
    const invalid: string[] = [];

    for (const line of parseLines(value)) {
        const trimmed = line.trim();
        if (trimmed.startsWith('#')) continue;

        const disabled = trimmed.startsWith('!');
        const body = disabled ? trimmed.slice(1).trim() : trimmed;
        // The pipe wins over a colon, so a site written with a port such as
        // "localhost:3000 | debug" is judged whole rather than split at the colon
        const pipe = body.indexOf('|');
        const separator = pipe >= 0 ? pipe : body.indexOf(':');
        if (!disabled && separator < 0) {
            if (!body || /[\s,]/.test(body)) invalid.push(trimmed);
            continue;
        }

        const site = (separator < 0 ? body : body.slice(0, separator)).trim();
        const params =
            separator < 0
                ? []
                : body
                      .slice(separator + 1)
                      .split(',')
                      .map(param => param.trim())
                      .filter(param => param.length > 0);

        // "*.example.com" and "example.*" are both accepted spellings
        const anyTld = site.endsWith('.*');
        const domain = (anyTld ? site.slice(0, -2) : site).replace(/^\*\./, '');

        const labels = /^[a-z0-9-]+(\.[a-z0-9-]+)*$/i.test(domain);
        // A site rule accepts a single-label intranet host. A disable line needs a dot or
        // a wildcard because every shipped removal it could reach names a public site.
        const looksLikeDomain = labels && (!disabled || anyTld || domain.includes('.'));
        if (!looksLikeDomain || (disabled ? separator >= 0 : params.length === 0)) invalid.push(trimmed);
    }

    return invalid;
}
