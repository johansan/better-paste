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
import { SHIPPED_PARAM_REMOVALS, SIGNED_URL_PARAM_SETS, TRACKING_PARAMS } from '../settings/constants';
import { markdownCodeRanges, overlapsRange } from './markdownRanges';
import type { BetterPasteSettings } from '../settings/types';

/** How many labels a wildcard top-level domain may stand for, covering ".com" and ".co.uk". */
const MAX_TLD_LABELS = 2;

/** Common second-level labels used before a two-letter country suffix. */
const COUNTRY_SECOND_LEVEL_LABELS = new Set(['ac', 'co', 'com', 'edu', 'go', 'gov', 'ne', 'net', 'or', 'org']);

/** A parsed domain-specific parameter removal. */
export interface DomainRemoval {
    /** Hostname the removal applies to, matched against the host itself and any subdomain. */
    domain: string;
    /** True for a line written "google.*", which matches the site on any top-level domain. */
    anyTld: boolean;
    /** Parameter names or glob patterns removed on this domain. */
    params: string[];
}

/** Cleaning options with built-in and user-defined removals already parsed. */
export interface UrlCleanupOptions {
    globalParams: readonly string[];
    removals: readonly DomainRemoval[];
}

/** Builds the cleaning options for a paste from the stored settings. */
export function buildUrlCleanupOptions(settings: Pick<BetterPasteSettings, 'linkRemovals'>): UrlCleanupOptions {
    const disabled = disabledDomains(settings.linkRemovals);
    const shipped = parseDomainRemovals(SHIPPED_PARAM_REMOVALS).filter(removal => !isDisabledRemoval(removal, disabled));
    return {
        globalParams: [...TRACKING_PARAMS, ...parseGlobalRemovals(settings.linkRemovals)],
        removals: [...shipped, ...parseDomainRemovals(settings.linkRemovals)]
    };
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
function hostMatchesRemoval(host: string, removal: DomainRemoval): boolean {
    if (!removal.anyTld) return host === removal.domain || host.endsWith(`.${removal.domain}`);

    const labels = host.split('.');
    const wanted = removal.domain.split('.');

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

/** Sites disabled with a user line such as "!youtube.com", stored without any wildcard. */
function disabledDomains(lines: readonly string[]): string[] {
    const disabled: string[] = [];
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('!')) continue;
        const { domain } = normalizeDomain(trimmed.slice(1));
        if (domain) disabled.push(domain);
    }
    return disabled;
}

/**
 * True when a "!site" line names this shipped removal's site or a parent of it. Subdomains
 * count because the shipped list is not shown in the settings field, so "!google.*" has to
 * reach the shipped "www.google.*" and "maps.google.*" entries without the user knowing
 * their exact spelling.
 */
function isDisabledRemoval(removal: DomainRemoval, disabled: readonly string[]): boolean {
    return disabled.some(domain => removal.domain === domain || removal.domain.endsWith(`.${domain}`));
}

/** Parses domain removal lines, ignoring comments and lines without any parameters. */
export function parseDomainRemovals(lines: readonly string[]): DomainRemoval[] {
    const removals: DomainRemoval[] = [];

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('!')) continue;

        // The pipe wins over a colon, so "localhost:3000 | debug" is not read as a
        // parameter list starting at the port
        const pipe = trimmed.indexOf('|');
        const separator = pipe >= 0 ? pipe : trimmed.indexOf(':');
        if (separator < 0) continue;

        const rawDomain = trimmed.slice(0, separator);
        const rawParams = trimmed.slice(separator + 1);

        const { domain, anyTld } = normalizeDomain(rawDomain);
        if (!domain) continue;

        const params = rawParams
            .split(',')
            .map(param => param.trim())
            .filter(param => param.length > 0);
        if (params.length === 0) continue;

        removals.push({ domain, anyTld, params });
    }

    return removals;
}

/** Parses bare parameter names that the user wants removed on every site. */
export function parseGlobalRemovals(lines: readonly string[]): string[] {
    return lines
        .map(line => line.trim())
        .filter(line => line.length > 0 && !line.startsWith('#') && !line.startsWith('!') && !/[|:\s,]/.test(line));
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

/** True when the query contains a known cryptographic signature parameter set. */
function isSignedUrl(pairs: readonly { name: string }[]): boolean {
    const names = new Set(pairs.map(pair => pair.name.toLowerCase()));
    return SIGNED_URL_PARAM_SETS.some(required => required.every(name => names.has(name.toLowerCase())));
}

/** True when a parameter matches a global or domain-specific removal. */
function shouldRemoveParam(name: string, host: string, globalParams: readonly string[], removals: readonly DomainRemoval[]): boolean {
    if (matchesAnyGlob(name, globalParams)) return true;
    return removals.some(removal => hostMatchesRemoval(host, removal) && matchesAnyGlob(name, removal.params));
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

    const pairs = splitQuery(query);
    // A cryptographically signed URL is preserved byte for byte. Removing any query
    // parameter can invalidate its signature, and the failure only shows when clicked.
    if (isSignedUrl(pairs)) return raw;

    const host = parsed.hostname.toLowerCase();
    const kept = pairs.filter(pair => !shouldRemoveParam(pair.name, host, options.globalParams, options.removals));

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
