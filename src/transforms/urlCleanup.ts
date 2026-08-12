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

import { matchesAnyGlob } from '../utils/glob';
import type { BetterPasteSettings } from '../settings/types';

/** A parsed line from the domain rules setting. */
export interface DomainRule {
    /** Hostname the rule applies to, matched against the host itself and any subdomain. */
    domain: string;
    /** True when the rule lists no parameters, meaning every parameter survives. */
    keepAll: boolean;
    /** Parameter names that survive on this domain. */
    params: string[];
}

/** Subset of settings the URL cleaner reads, so tests can build one without a full settings object. */
export type UrlCleanupOptions = Pick<
    BetterPasteSettings,
    | 'urlStripMode'
    | 'urlTrackingParams'
    | 'urlKeepParams'
    | 'urlDomainRules'
    | 'urlStripTextFragments'
    | 'urlStripAllFragments'
    | 'urlStripTrailingSlash'
>;

/**
 * Matches http(s) URLs. The character class stays permissive and trailing punctuation is
 * trimmed afterwards by `trimUrlTail`, which is more reliable than trying to express
 * "not sentence-final punctuation" in the pattern itself.
 */
const URL_PATTERN = /https?:\/\/[^\s<>"'`\\]+/gi;

/** Punctuation that is almost always sentence punctuation rather than part of the URL. */
const TRAILING_PUNCTUATION = new Set(['.', ',', ';', ':', '!', '?', '"', "'", '`', '*', '_', '~']);

/** Closing brackets that only belong to the URL when the URL also contains their opening partner. */
const CLOSING_BRACKETS: Record<string, string> = {
    ')': '(',
    ']': '[',
    '}': '{',
    '>': '<'
};

/**
 * Trims characters that a URL regex greedily absorbed but that belong to the surrounding
 * prose or Markdown syntax. Unbalanced closing brackets are removed, balanced ones kept,
 * so both `(see https://example.com/a)` and `https://en.wikipedia.org/wiki/Foo_(bar)` work.
 */
export function trimUrlTail(url: string): string {
    let end = url.length;

    while (end > 0) {
        const char = url[end - 1];

        if (TRAILING_PUNCTUATION.has(char)) {
            end -= 1;
            continue;
        }

        const opener = CLOSING_BRACKETS[char];
        if (opener) {
            let openCount = 0;
            let closeCount = 0;
            for (let i = 0; i < end; i++) {
                if (url[i] === opener) openCount += 1;
                else if (url[i] === char) closeCount += 1;
            }
            // More closers than openers means this one came from the surrounding text
            if (closeCount > openCount) {
                end -= 1;
                continue;
            }
        }

        break;
    }

    return url.slice(0, end);
}

/** Parses the domain rules setting, ignoring blank lines and '#' comments. */
export function parseDomainRules(lines: readonly string[]): DomainRule[] {
    const rules: DomainRule[] = [];

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;

        const separator = trimmed.indexOf(':');
        const rawDomain = separator >= 0 ? trimmed.slice(0, separator) : trimmed;
        const rawParams = separator >= 0 ? trimmed.slice(separator + 1) : '';

        // Accept "*.example.com" as a synonym for "example.com"
        const domain = rawDomain.trim().toLowerCase().replace(/^\*\./, '');
        if (!domain) continue;

        const params = rawParams
            .split(',')
            .map(param => param.trim())
            .filter(param => param.length > 0);

        rules.push({ domain, keepAll: params.length === 0, params });
    }

    return rules;
}

/**
 * Finds the rule that applies to `host`, preferring the most specific match so that
 * "maps.google.com" wins over "google.com" when both are configured.
 */
export function findDomainRule(host: string, rules: readonly DomainRule[]): DomainRule | null {
    const normalizedHost = host.toLowerCase();
    let best: DomainRule | null = null;

    for (const rule of rules) {
        const matches = normalizedHost === rule.domain || normalizedHost.endsWith(`.${rule.domain}`);
        if (!matches) continue;
        if (!best || rule.domain.length > best.domain.length) best = rule;
    }

    return best;
}

/** Splits a raw query string into pairs while keeping each pair's original encoding. */
function splitQuery(query: string): { name: string; raw: string }[] {
    if (!query) return [];

    return query.split('&').map(raw => {
        const equals = raw.indexOf('=');
        const encodedName = equals >= 0 ? raw.slice(0, equals) : raw;
        let name = encodedName;
        try {
            name = decodeURIComponent(encodedName.replace(/\+/g, ' '));
        } catch {
            // Malformed percent escapes are left as-is rather than dropping the parameter
        }
        return { name, raw };
    });
}

/** Decides whether a single query parameter survives cleaning. */
function shouldKeepParam(name: string, rule: DomainRule | null, options: UrlCleanupOptions): boolean {
    if (matchesAnyGlob(name, options.urlKeepParams)) return true;

    if (rule) {
        if (rule.keepAll) return true;
        return rule.params.some(param => param.toLowerCase() === name.toLowerCase());
    }

    if (options.urlStripMode === 'tracking') {
        return !matchesAnyGlob(name, options.urlTrackingParams);
    }

    return false;
}

/** Applies the fragment settings, returning the fragment to keep (including its leading '#'). */
function cleanFragment(fragment: string, options: UrlCleanupOptions): string {
    if (!fragment) return '';
    if (options.urlStripAllFragments) return '';

    if (options.urlStripTextFragments) {
        const textFragment = fragment.indexOf(':~:');
        if (textFragment >= 0) {
            // '#section:~:text=foo' keeps '#section'; '#:~:text=foo' drops the fragment entirely
            const remainder = fragment.slice(0, textFragment);
            return remainder === '#' ? '' : remainder;
        }
    }

    return fragment;
}

/**
 * Cleans a single URL. Returns the input unchanged when it is not an http(s) URL or when
 * no setting applies, so URLs that need no cleaning keep their exact original spelling.
 */
export function cleanUrl(raw: string, options: UrlCleanupOptions): string {
    let parsed: URL;
    try {
        parsed = new URL(raw);
    } catch {
        return raw;
    }

    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return raw;

    // Work on the raw string rather than URL's normalised output so untouched URLs are
    // returned byte-for-byte and surviving parameters keep their original encoding.
    const hashIndex = raw.indexOf('#');
    const fragment = hashIndex >= 0 ? raw.slice(hashIndex) : '';
    const withoutFragment = hashIndex >= 0 ? raw.slice(0, hashIndex) : raw;

    const queryIndex = withoutFragment.indexOf('?');
    let base = queryIndex >= 0 ? withoutFragment.slice(0, queryIndex) : withoutFragment;
    const query = queryIndex >= 0 ? withoutFragment.slice(queryIndex + 1) : '';

    const rule = findDomainRule(parsed.hostname, parseDomainRules(options.urlDomainRules));
    const pairs = splitQuery(query);
    const kept = pairs.filter(pair => shouldKeepParam(pair.name, rule, options));

    const nextFragment = cleanFragment(fragment, options);

    if (options.urlStripTrailingSlash && parsed.pathname.length > 1 && base.endsWith('/')) {
        base = base.slice(0, -1);
    }

    const nextQuery = kept.map(pair => pair.raw).join('&');
    const rebuilt = `${base}${nextQuery ? `?${nextQuery}` : ''}${nextFragment}`;

    return rebuilt === raw ? raw : rebuilt;
}

export interface UrlCleanupResult {
    text: string;
    /** Number of URLs that were actually modified. */
    count: number;
}

/**
 * Cleans every http(s) URL found in `text`. Works on plain text and on Markdown, where
 * link targets such as `[label](url)` are matched by the same pattern.
 */
export function cleanUrlsInText(text: string, options: UrlCleanupOptions): UrlCleanupResult {
    let count = 0;

    const result = text.replace(URL_PATTERN, match => {
        const url = trimUrlTail(match);
        const tail = match.slice(url.length);
        const cleaned = cleanUrl(url, options);
        if (cleaned !== url) count += 1;
        return `${cleaned}${tail}`;
    });

    return { text: result, count };
}
