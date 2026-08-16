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
import { SHIPPED_DOMAIN_RULES, TRACKING_PARAMS } from '../settings/constants';
import { markdownCodeRanges, overlapsRange } from './markdownRanges';
import type { BetterPasteSettings, LinkStripMode } from '../settings/types';

/** How many labels a wildcard top-level domain may stand for, covering ".com" and ".co.uk". */
const MAX_TLD_LABELS = 2;

/** Common second-level labels used before a two-letter country suffix. */
const COUNTRY_SECOND_LEVEL_LABELS = new Set(['ac', 'co', 'com', 'edu', 'gov', 'net', 'org']);

/** A parsed line from the site rules. */
export interface DomainRule {
    /** Hostname the rule applies to, matched against the host itself and any subdomain. */
    domain: string;
    /** True for a rule written "google.*", which matches the site on any top-level domain. */
    anyTld: boolean;
    /** True when the rule lists no parameters, meaning every parameter survives. */
    keepAll: boolean;
    /** Parameter names that survive on this domain. */
    params: string[];
}

/**
 * Cleaning options with the site rules already parsed. Parsing happens once per paste
 * rather than once per URL, which matters for a document full of links.
 */
export interface UrlCleanupOptions {
    strip: LinkStripMode;
    rules: readonly DomainRule[];
}

/** Builds the cleaning options for a paste from the stored settings. */
export function buildUrlCleanupOptions(settings: Pick<BetterPasteSettings, 'linkStrip' | 'linkRules'>): UrlCleanupOptions {
    return { strip: settings.linkStrip, rules: mergeDomainRules(settings.linkRules) };
}

/**
 * Matches http(s) URLs. The character class stays permissive and trailing punctuation is
 * trimmed afterwards by `trimUrlTail`, which is more reliable than trying to express
 * "not sentence-final punctuation" in the pattern itself.
 */
const URL_PATTERN = /https?:\/\/[^\s<>"`\\\u201c\u201d]+/gi;

/** Punctuation that is almost always sentence punctuation rather than part of the URL. */
const TRAILING_PUNCTUATION = new Set(['.', ',', ';', ':', '!', '?', '"', "'", '`', '\u2018', '\u2019', '\u201A', '\u201B']);

/**
 * Wikilink and Markdown link openers end a URL: a link pasted flush behind one otherwise
 * rides along and is deleted when the query is cleaned. Labels may nest one bracket pair.
 */
const LINK_OPENER = /\[\[|\[(?:[^\][]|\[[^\][]*\])*\]\(/;

/**
 * Full-width CJK sentence punctuation never appears raw in a URL, so it always ends the
 * match. Full-width brackets are not here: they pair, so the balance scan decides them.
 */
const CJK_PUNCTUATION = /[\u3000-\u3002\u301C-\u301F\uFF01-\uFF07\uFF0A-\uFF0F\uFF1A-\uFF20\uFF3B-\uFF40\uFF5B-\uFF65]/;

/**
 * CJK letters are real URL content (wiki paths, image filenames, search queries), so they
 * end the match only when the surrounding text says they are prose: either the character
 * in front of the match is a CJK letter, because a writer who joins prose to the front of
 * a URL joins it to the back too, or the letters run from inside the query to the end of
 * the match with no URL syntax after them, in which case the reading is undecidable and
 * the URL is left uncleaned. The katakana middle dot and double hyphen are excluded:
 * they are separators, and the middle dot in front of a URL is a Japanese list bullet,
 * not prose joined to the link.
 */
const CJK_LETTER = /[\u3040-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uAC00-\uD7AF]/;

/**
 * Where flush prose starts: the letters plus the separators excluded above, so a prose
 * run opening with a middle dot is cut in front of the dot rather than behind it.
 */
const CJK_PROSE = /[\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uAC00-\uD7AF]/;

/** CJK letters and full-width characters, used to test that a tail is prose-only. */
const CJK_TAIL = /^[\u3000-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uAC00-\uD7AF\uFF00-\uFFEF]*$/;

/**
 * Full-width opening brackets behind the query end the URL: a real query never carries
 * one raw, while an annotation such as \uFF08PDF\uFF09 flush after a link is ordinary Japanese
 * typography. Openers in the path stay with the balance scan, because wiki paths use them.
 */
const FULL_WIDTH_OPENER = /[\uFF08\u3008\u300A\u300C\u300E\u3010\u3014\u3016\u3018\u301A]/;

/** Where a URL match really ends, and whether cleaning it is safe. */
interface UrlBoundary {
    url: string;
    /** True when the cut reads as URL data just as well, so the URL must not be cleaned. */
    ambiguous: boolean;
    /**
     * Offset in the match where scanning may resume after an ambiguous cut: the first
     * unmatched closing bracket, because the query cannot extend past it. -1 when there
     * is none, in which case the ambiguity runs to the next whitespace.
     */
    resume: number;
}

/** Index of the first closing bracket with no earlier opening partner, or -1. */
function unmatchedCloserIndex(url: string): number {
    const depths: Record<string, number> = {};
    for (const opener of Object.values(CLOSING_BRACKETS)) depths[opener] = 0;
    for (let i = 0; i < url.length; i++) {
        const char = url[i];
        if (char in depths) {
            depths[char] += 1;
            continue;
        }
        const opener = CLOSING_BRACKETS[char];
        if (!opener) continue;
        if (depths[opener] === 0) return i;
        depths[opener] -= 1;
    }
    return -1;
}

/**
 * Cuts a URL match down to where the URL really ends. Every caller reattaches the cut
 * text verbatim, so a cut never loses characters. A `[[` behind the query is the one
 * undecidable case: it reads as a pasted wikilink or as a JSON array in a filter
 * parameter equally well, so the URL is marked ambiguous and left uncleaned rather than
 * corrupted under either reading.
 */
export function urlBoundary(url: string, precedingChar: string): UrlBoundary {
    let cut = url.length;
    let ambiguous = false;

    const closer = unmatchedCloserIndex(url);
    if (closer !== -1) cut = closer;

    const punctuation = CJK_PUNCTUATION.exec(url);
    if (punctuation && punctuation.index < cut) cut = punctuation.index;

    const queryStart = url.indexOf('?');
    if (queryStart !== -1) {
        const annotation = FULL_WIDTH_OPENER.exec(url.slice(queryStart));
        if (annotation && queryStart + annotation.index < cut) cut = queryStart + annotation.index;
    }

    const opener = LINK_OPENER.exec(url);
    if (opener && opener.index < cut) {
        cut = opener.index;
        ambiguous = opener[0] === '[[' && url.slice(0, cut).includes('?');
    }

    if (CJK_LETTER.test(precedingChar)) {
        const letter = CJK_PROSE.exec(url);
        if (letter && letter.index < cut) {
            cut = letter.index;
            ambiguous = false;
        }
    } else {
        // Without prose at the front, trailing CJK letters are undecidable: they read as
        // a query value (?q=...) or as flush prose equally well. When they run from
        // inside the query to the end of the match with no URL syntax after them, the
        // URL ends there but is not cleaned. Letters followed by more query syntax,
        // such as ?q=...&page=2, stay URL content, and so do letters behind a #,
        // because a fragment anchor such as a wiki section name is not prose.
        if (queryStart !== -1) {
            const fragment = url.indexOf('#', queryStart);
            const letter = CJK_LETTER.exec(url.slice(queryStart));
            if (letter) {
                const index = queryStart + letter.index;
                if ((fragment === -1 || index < fragment) && index < cut && CJK_TAIL.test(url.slice(index))) {
                    cut = index;
                    ambiguous = true;
                }
            }
        }
    }

    return { url: url.slice(0, cut), ambiguous, resume: ambiguous && closer > cut ? closer : -1 };
}

/** Closing brackets that only belong to the URL when the URL also contains their opening partner. */
const CLOSING_BRACKETS: Record<string, string> = {
    ')': '(',
    ']': '[',
    '}': '{',
    '>': '<',
    // Full-width pairs balance the same way: paired inside a URL they are IRI path
    // content, an unmatched closer marks prose wrapped around the link
    '\uFF09': '\uFF08',
    '\u3009': '\u3008',
    '\u300B': '\u300A',
    '\u300D': '\u300C',
    '\u300F': '\u300E',
    '\u3011': '\u3010',
    '\u3015': '\u3014',
    '\u3017': '\u3016',
    '\u3019': '\u3018',
    '\u301B': '\u301A'
};

/**
 * Trims characters that a URL regex greedily absorbed but that belong to the surrounding
 * prose or Markdown syntax. Unbalanced closing brackets are removed, balanced ones kept,
 * so both `(see https://example.com/a)` and `https://en.wikipedia.org/wiki/Foo_(bar)` work.
 * `precedingChar` is the character in front of the match, used to tell CJK prose flush
 * against the URL from CJK content inside it.
 */
export function trimUrlTail(url: string, precedingChar = ''): string {
    return trimTrailingNoise(urlBoundary(url, precedingChar).url);
}

/** Trims sentence punctuation, closing emphasis pairs and unbalanced closers off the tail. */
export function trimTrailingNoise(url: string): string {
    let end = url.length;

    while (end > 0) {
        const char = url[end - 1];

        if (TRAILING_PUNCTUATION.has(char)) {
            end -= 1;
            continue;
        }

        // A trailing pair closes a bold or struck link wrapped around the URL
        if ((char === '*' || char === '~') && url[end - 2] === char) {
            end -= 2;
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

/**
 * Normalises a domain for matching.
 *
 * A leading "*." is accepted and dropped, because a rule already covers every subdomain:
 * "example.com" and "*.example.com" mean the same thing. A trailing ".*" is different because it
 * means the site on any top-level domain, which is how one rule covers google.com,
 * google.se and google.co.uk together.
 */
function normalizeDomain(domain: string): { domain: string; anyTld: boolean } {
    const cleaned = domain.trim().toLowerCase().replace(/^\*\./, '');
    const anyTld = cleaned.endsWith('.*');
    return { domain: anyTld ? cleaned.slice(0, -2) : cleaned, anyTld };
}

/** True when `host` is the rule's site, a subdomain of it, or it under another top-level domain. */
function hostMatchesRule(host: string, rule: DomainRule): boolean {
    if (!rule.anyTld) return host === rule.domain || host.endsWith(`.${rule.domain}`);

    const labels = host.split('.');
    const wanted = rule.domain.split('.');

    for (let start = 0; start + wanted.length < labels.length; start++) {
        if (!wanted.every((label, offset) => labels[start + offset] === label)) continue;

        // One label covers .com and .se. Two labels must look like .co.uk or .com.au,
        // otherwise a host such as google.example.com would match google.*.
        const remaining = labels.length - (start + wanted.length);
        if (remaining === 1) return true;
        if (remaining === MAX_TLD_LABELS) {
            const secondLevel = labels[start + wanted.length];
            const country = labels[start + wanted.length + 1];
            if (COUNTRY_SECOND_LEVEL_LABELS.has(secondLevel) && country.length === 2) return true;
        }
    }

    return false;
}

/** Parses site rule lines, ignoring blank lines and '#' comments. */
export function parseDomainRules(lines: readonly string[]): DomainRule[] {
    const rules: DomainRule[] = [];

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('!')) continue;

        // Either separator is accepted; "|" is what the settings field shows, because a
        // colon also appears inside the URLs these rules are about
        const separator = trimmed.search(/[|:]/);
        const rawDomain = separator >= 0 ? trimmed.slice(0, separator) : trimmed;
        const rawParams = separator >= 0 ? trimmed.slice(separator + 1) : '';

        const { domain, anyTld } = normalizeDomain(rawDomain);
        if (!domain) continue;

        const params = rawParams
            .split(',')
            .map(param => param.trim())
            .filter(param => param.length > 0);

        rules.push({ domain, anyTld, keepAll: params.length === 0, params });
    }

    return rules;
}

/**
 * Combines the shipped site rules with the user's own.
 *
 * The shipped list lives in code rather than in the user's settings so that rules added in
 * a later release still reach people who have added rules of their own. A user rule for the
 * same domain replaces the shipped one, and a line of the form `!example.com` drops a
 * shipped rule entirely.
 */
export function mergeDomainRules(userRules: readonly string[]): DomainRule[] {
    const disabled = new Set<string>();
    const kept: string[] = [];

    for (const line of userRules) {
        const trimmed = line.trim();
        if (trimmed.startsWith('!')) {
            // Stored without any wildcard, so "!google.*" and "!google" both disable the
            // shipped rules for google and its subdomains
            const { domain } = normalizeDomain(trimmed.slice(1));
            if (domain) disabled.add(domain);
            continue;
        }
        kept.push(line);
    }

    // A later line for the same site replaces an earlier one, rather than sitting behind it
    // forever: findDomainRule keeps the first of two equally specific rules
    const byDomain = new Map<string, DomainRule>();
    for (const rule of parseDomainRules(kept)) byDomain.set(rule.domain, rule);
    const user = [...byDomain.values()];

    // Removals are exact because the settings field shows every shipped rule separately.
    // Deleting google.* must not also delete a maps.google.* row the user left in place.
    const isDisabled = (rule: DomainRule): boolean => disabled.has(rule.domain);

    const shipped = parseDomainRules(SHIPPED_DOMAIN_RULES).filter(rule => !byDomain.has(rule.domain) && !isDisabled(rule));

    return [...shipped, ...user];
}

/** Renders a rule the way the settings field shows it. */
export function formatDomainRule(rule: DomainRule): string {
    const site = rule.anyTld ? `${rule.domain}.*` : rule.domain;
    return rule.keepAll ? site : `${site} | ${rule.params.join(', ')}`;
}

/**
 * The full rule list as the settings field shows it: the shipped rules and the user's own,
 * merged, so every site can be read and edited in one place.
 */
export function renderDomainRules(userRules: readonly string[]): string {
    return mergeDomainRules(userRules).map(formatDomainRule).join('\n');
}

/**
 * Turns an edited rule list back into just the user's changes.
 *
 * Only the difference from the shipped list is stored, so a rule added to a later release
 * still reaches someone who has edited their own. A site the user removed from the field
 * comes back as an explicit "!example.com" line.
 */
export function diffDomainRules(lines: readonly string[]): string[] {
    const shown = new Map<string, DomainRule>();
    for (const rule of parseDomainRules(lines)) shown.set(rule.domain, rule);

    const shipped = new Map<string, DomainRule>();
    for (const rule of parseDomainRules(SHIPPED_DOMAIN_RULES)) shipped.set(rule.domain, rule);

    const removals = [...shipped.values()]
        .filter(rule => !shown.has(rule.domain))
        .map(rule => `!${rule.anyTld ? `${rule.domain}.*` : rule.domain}`);

    const additions = [...shown.values()]
        .filter(rule => {
            const base = shipped.get(rule.domain);
            return !base || formatDomainRule(base) !== formatDomainRule(rule);
        })
        .map(formatDomainRule);

    return [...removals, ...additions];
}

/**
 * Finds the rule that applies to `host`, preferring the most specific match so that
 * "maps.google.com" wins over "google.com" when both are configured.
 */
export function findDomainRule(host: string, rules: readonly DomainRule[]): DomainRule | null {
    const normalizedHost = host.toLowerCase();
    let best: DomainRule | null = null;

    for (const rule of rules) {
        if (!hostMatchesRule(normalizedHost, rule)) continue;
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

/** True when a site rule explicitly preserves this parameter. */
function ruleKeeps(rule: DomainRule | null, name: string): boolean {
    if (!rule) return false;
    if (rule.keepAll) return true;
    return rule.params.some(param => param.toLowerCase() === name.toLowerCase());
}

/**
 * Decides whether a single query parameter survives cleaning.
 *
 * In tracking mode a site rule may only rescue a parameter, never remove one. Letting a
 * rule act as a whitelist there would silently strip ordinary parameters from a user who
 * chose the conservative mode precisely to avoid that.
 */
function shouldKeepParam(name: string, rule: DomainRule | null, mode: LinkStripMode): boolean {
    if (mode === 'tracking') {
        if (!matchesAnyGlob(name, TRACKING_PARAMS)) return true;
        return ruleKeeps(rule, name);
    }

    return ruleKeeps(rule, name);
}

/**
 * Drops a scroll-to-text fragment while keeping a real anchor. Browsers append these when
 * you copy a link to highlighted text; they are long, brittle, and never wanted in a note.
 */
function cleanFragment(fragment: string): string {
    if (!fragment) return '';

    const textFragment = fragment.indexOf(':~:');
    if (textFragment < 0) return fragment;

    // '#section:~:text=foo' keeps '#section'; '#:~:text=foo' drops the fragment entirely
    const remainder = fragment.slice(0, textFragment);
    return remainder === '#' ? '' : remainder;
}

/**
 * Cleans a single URL. Returns the input unchanged when it is not an http(s) URL or when
 * nothing is removed, so URLs that need no cleaning keep their exact original spelling.
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
    const base = queryIndex >= 0 ? withoutFragment.slice(0, queryIndex) : withoutFragment;
    const query = queryIndex >= 0 ? withoutFragment.slice(queryIndex + 1) : '';

    const rule = findDomainRule(parsed.hostname, options.rules);
    const kept = splitQuery(query).filter(pair => shouldKeepParam(pair.name, rule, options.strip));

    const nextQuery = kept.map(pair => pair.raw).join('&');
    const rebuilt = `${base}${nextQuery ? `?${nextQuery}` : ''}${cleanFragment(fragment)}`;

    return rebuilt === raw ? raw : rebuilt;
}

export interface UrlCleanupResult {
    text: string;
    /** Number of URLs that were actually modified. */
    count: number;
}

/** A span of text that URL cleaning must not touch. */
export interface ProtectedRange {
    start: number;
    end: number;
}

/** Ranges occupied by http(s) addresses, excluding punctuation that belongs to prose. */
export function httpUrlRanges(text: string): ProtectedRange[] {
    const ranges: ProtectedRange[] = [];

    URL_PATTERN.lastIndex = 0;
    for (let match = URL_PATTERN.exec(text); match !== null; match = URL_PATTERN.exec(text)) {
        const url = trimUrlTail(match[0], text[match.index - 1] ?? '');
        ranges.push({ start: match.index, end: match.index + url.length });
        // Rescan what the trim gave back, so a URL pasted flush behind this one gets its own range
        URL_PATTERN.lastIndex = match.index + url.length;
    }

    return ranges;
}

/**
 * Cleans every http(s) URL found in `text`. Works on plain text and on Markdown, where
 * link targets such as `[label](url)` are matched by the same pattern.
 */
export function cleanUrlsInText(text: string, options: UrlCleanupOptions, protect: readonly ProtectedRange[] = []): UrlCleanupResult {
    let count = 0;
    const protectedRanges = [...protect, ...markdownCodeRanges(text)];
    const parts: string[] = [];
    let cursor = 0;

    URL_PATTERN.lastIndex = 0;
    for (let match = URL_PATTERN.exec(text); match !== null; match = URL_PATTERN.exec(text)) {
        const boundary = urlBoundary(match[0], text[match.index - 1] ?? '');
        const url = trimTrailingNoise(boundary.url);

        // An ambiguous match is left alone up to its first unmatched closing bracket or,
        // when there is none, the next whitespace: a quote inside a JSON query value ends
        // the match early, and rescanning before that point would clean a URL nested
        // inside the very query this match declined to touch. Content past the closer is
        // separate, such as a second Markdown link pasted flush behind this one.
        if (boundary.ambiguous) {
            if (boundary.resume !== -1) {
                URL_PATTERN.lastIndex = match.index + boundary.resume;
            } else {
                const whitespace = /\s/.exec(text.slice(match.index + match[0].length));
                URL_PATTERN.lastIndex = whitespace ? match.index + match[0].length + whitespace.index : text.length;
            }
            continue;
        }

        // Rescan what the trim gave back, so a second link pasted flush behind this one
        // is cleaned on its own instead of travelling along as an uncleaned tail
        URL_PATTERN.lastIndex = match.index + url.length;

        // A URL that is about to be fetched as an image is left exactly as it was. A
        // signed link from a CDN carries its token in the query, and stripping that
        // before the request turns a working image into a 403.
        if (overlapsRange(protectedRanges, match.index, match.index + url.length)) continue;

        const cleaned = cleanUrl(url, options);
        if (cleaned === url) continue;
        count += 1;
        parts.push(text.slice(cursor, match.index), cleaned);
        cursor = match.index + url.length;
    }

    parts.push(text.slice(cursor));
    return { text: parts.join(''), count };
}
