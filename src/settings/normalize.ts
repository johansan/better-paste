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
import { strings } from '../i18n';
import { normalizeVersion } from '../releaseNotes';
import { createTextSnippetId, parseSnippetRuleLine } from '../transforms/snippets';
import { DEFAULT_BLANK_LINES_SNIPPET_RULES, DEFAULT_BOLD_HEADINGS_SNIPPET_RULES, DEFAULT_SITE_SUFFIXES_SNIPPET_RULES } from './constants';
import type { BetterPasteSettings, TextSnippet } from './types';

function asBoolean(value: unknown, fallback: boolean): boolean {
    return typeof value === 'boolean' ? value : fallback;
}

function asString(value: unknown, fallback: string): string {
    return typeof value === 'string' ? value : fallback;
}

function asFileMode(value: unknown): BetterPasteSettings['fileMode'] {
    return value === 'off' || value === 'link' ? value : DEFAULT_SETTINGS.fileMode;
}

function asImageMode(value: unknown, legacyEnabled: unknown): BetterPasteSettings['imageMode'] {
    if (value === 'off' || value === 'link' || value === 'download') return value;
    return legacyEnabled === false ? 'off' : DEFAULT_SETTINGS.imageMode;
}

function asStringArray(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return value.filter((entry): entry is string => typeof entry === 'string');
}

/** The id set spans both snippet lists because the settings tab keys controls by id alone. */
function asTextSnippets(value: unknown, ids: Set<string>): TextSnippet[] {
    if (!Array.isArray(value)) return [];

    const snippets: TextSnippet[] = [];
    for (const entry of value) {
        if (typeof entry !== 'object' || entry === null || Array.isArray(entry)) continue;

        const data = entry as Record<string, unknown>;
        const name = asString(data.name, '').trim();
        const rules = asStringArray(data.rules);
        const hasUsableRule = rules.some(line => parseSnippetRuleLine(line).status === 'valid');
        if (!name && !hasUsableRule) continue;

        let id = asString(data.id, '').trim();
        while (!id || ids.has(id)) id = createTextSnippetId();
        ids.add(id);

        snippets.push({
            id,
            name,
            rules,
            enabled: asBoolean(data.enabled, true)
        });
    }
    return snippets;
}

function defaultTextSnippets(): Omit<TextSnippet, 'id'>[] {
    return [
        {
            name: strings.settings.custom.defaultSnippetBoldHeadings,
            rules: [...DEFAULT_BOLD_HEADINGS_SNIPPET_RULES],
            enabled: true
        },
        {
            name: strings.settings.custom.defaultSnippetBlankLines,
            rules: [...DEFAULT_BLANK_LINES_SNIPPET_RULES],
            enabled: true
        }
    ];
}

function defaultUrlSnippets(): Omit<TextSnippet, 'id'>[] {
    return [
        {
            name: strings.settings.custom.defaultSnippetSiteSuffixes,
            rules: [...DEFAULT_SITE_SUFFIXES_SNIPPET_RULES],
            enabled: true
        }
    ];
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
/**
 * Builds a complete settings object from whatever was stored on disk. Every field is
 * validated so a hand-edited data.json cannot put the plugin in a broken state, and any
 * key that is not a current setting is simply dropped.
 */
export function normalizeSettings(raw: unknown): BetterPasteSettings {
    const data = (typeof raw === 'object' && raw !== null ? raw : {}) as Partial<Record<keyof BetterPasteSettings, unknown>>;
    const defaults = DEFAULT_SETTINGS;
    const snippetIds = new Set<string>();

    return {
        autoClean: asBoolean(data.autoClean, defaults.autoClean),
        listNesting: asBoolean(data.listNesting, defaults.listNesting),
        quoteContinuation: asBoolean(data.quoteContinuation, defaults.quoteContinuation),
        showReleaseNotes: asBoolean(data.showReleaseNotes, defaults.showReleaseNotes),

        fileMode: asFileMode(data.fileMode),

        imageMode: asImageMode(data.imageMode, (data as Record<string, unknown>).imageEnabled),
        // The former imageNameFormat dropdown gated the template. A vault that stored
        // 'source' kept whatever template text was last typed there, so that leftover
        // text must not spring to life now that the field alone decides the naming.
        imageNameTemplate:
            (data as Record<string, unknown>).imageNameFormat === 'source'
                ? defaults.imageNameTemplate
                : asString(data.imageNameTemplate, defaults.imageNameTemplate).trim() || defaults.imageNameTemplate,
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

        textSnippets: asTextSnippets(data.textSnippets === undefined ? defaultTextSnippets() : data.textSnippets, snippetIds),
        urlSnippets: asTextSnippets(data.urlSnippets === undefined ? defaultUrlSnippets() : data.urlSnippets, snippetIds),

        lastShownVersion: normalizeVersion(data.lastShownVersion),

        pdfLastFurniture: asBoolean(data.pdfLastFurniture, defaults.pdfLastFurniture),
        pdfLastSingleParagraph: asBoolean(data.pdfLastSingleParagraph, defaults.pdfLastSingleParagraph)
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
