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

import { moment } from 'obsidian';

/** Characters Obsidian and the major filesystems reject in a file name. */
const ILLEGAL_CHARACTERS = /[\\/:*?"<>|[\]#^]/g;

/** Longest base name we generate, leaving room for a dedupe suffix and the extension. */
const MAX_BASENAME_LENGTH = 80;

/** Digits set aside per counter slot when capping length, so a number cannot be cut off. */
const COUNTER_RESERVE = 4;

/** Fallback used when a URL carries no usable name. */
const FALLBACK_BASENAME = 'pasted-image';

/** Basenames Windows reserves for devices, even when an extension is added. */
const WINDOWS_RESERVED_NAME = /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i;

interface MomentDateFormatter {
    (date: Date): { format: (pattern: string) => string };
}

/** Narrows Obsidian's Moment export, whose declaration does not expose its call signature. */
function isMomentDateFormatter(value: unknown): value is MomentDateFormatter {
    return typeof value === 'function';
}

/** Content types mapped to the extension we store them under. */
const CONTENT_TYPE_EXTENSIONS: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'image/avif': 'avif',
    'image/bmp': 'bmp',
    'image/heic': 'heic',
    'image/heif': 'heic',
    'image/tiff': 'tiff',
    'image/x-icon': 'ico',
    'image/vnd.microsoft.icon': 'ico'
};

/** Strips characters that cannot appear in a vault file name, keeping the edges as they are. */
function cleanFileNameText(name: string): string {
    return (
        name
            .replace(ILLEGAL_CHARACTERS, '')
            // eslint-disable-next-line no-control-regex -- matching control characters is the purpose of this pattern
            .replace(new RegExp('[\\u0000-\\u001F\\u007F]', 'g'), '')
            .replace(/\s+/g, ' ')
    );
}

/** Strips characters that cannot appear in a vault file name and trims the result to a sane length. */
export function sanitizeFileName(name: string): string {
    const cleaned = cleanFileNameText(name)
        .replace(/^[.\s]+|[.\s]+$/g, '')
        .trim();

    if (!cleaned) return FALLBACK_BASENAME;

    // Array.from cuts at code-point boundaries, so the final character cannot be half of a
    // surrogate pair. Clean the edge again because truncation may expose a trailing dot.
    const truncated = [...cleaned]
        .slice(0, MAX_BASENAME_LENGTH)
        .join('')
        .replace(/[.\s]+$/g, '')
        .trim();
    if (!truncated) return FALLBACK_BASENAME;
    return WINDOWS_RESERVED_NAME.test(truncated) ? `_${truncated}` : truncated;
}

/** Returns the base name of a URL's path without its extension, or null when there is none. */
export function baseNameFromUrl(url: string): string | null {
    // A data: URI's "path" is the media type followed by the payload, which makes a
    // terrible file name. Inline images have no name of their own, so report none.
    if (/^data:/i.test(url)) return null;

    try {
        const parsed = new URL(url);
        const last = parsed.pathname.split('/').filter(Boolean).pop();
        if (!last) return null;

        let decoded = last;
        try {
            decoded = decodeURIComponent(last);
        } catch {
            // A malformed escape is not worth failing the paste over
        }

        const withoutExtension = decoded.replace(/\.[a-z0-9]+$/i, '');
        const sanitized = sanitizeFileName(withoutExtension);
        return sanitized === FALLBACK_BASENAME && !withoutExtension ? null : sanitized;
    } catch {
        return null;
    }
}

/**
 * Picks the file extension for a downloaded image, preferring the server's content type
 * and falling back to the URL's own extension.
 */
export function resolveExtension(contentType: string | undefined, url: string, allowed: readonly string[]): string | null {
    const normalized = (contentType ?? '').split(';')[0].trim().toLowerCase();
    const fromContentType = CONTENT_TYPE_EXTENSIONS[normalized];
    const isAllowed = (extension: string): boolean => allowed.some(candidate => candidate.toLowerCase() === extension);

    if (fromContentType && isAllowed(fromContentType)) return fromContentType;

    // A named image URL may still return an HTML error page with status 200. Only fall
    // back to its extension when the server omitted the type or used a generic binary type.
    const genericBinary = normalized === 'application/octet-stream' || normalized === 'binary/octet-stream';
    if (normalized && !normalized.startsWith('image/') && !genericBinary) return null;

    // Accepts a URL or a bare file name, so a clipboard file's own name can be used
    let path = url;
    try {
        path = new URL(url).pathname;
    } catch {
        // Not a URL, match the extension on the raw string instead
    }

    const match = /\.([a-z0-9]+)$/i.exec(path);
    const fromPath = match ? match[1].toLowerCase() : null;
    if (fromPath && isAllowed(fromPath)) return fromPath;

    // A content type that says "image" but is not in the allow list still gives us a hint
    if (normalized.startsWith('image/')) {
        const guessed = normalized.slice('image/'.length).replace(/\+.*$/, '');
        if (isAllowed(guessed)) return guessed;
    }

    return null;
}

export interface FileNameTokens {
    /** Name taken from the URL, already sanitized. */
    name: string;
    /** Basename of the note the paste targets, or null when the paste has no note. */
    noteName?: string | null;
    /** Reads a frontmatter property of the target note, or null when it has no usable value. */
    property?: (key: string) => string | null;
}

/**
 * The name for a clipboard bitmap that has no name of its own, "Pasted image" followed
 * by a timestamp. Matches how Obsidian names such an image, so pastes handled by this
 * plugin and pastes handled by the app come out the same.
 */
export function pastedImageName(now: Date): string {
    if (!isMomentDateFormatter(moment)) throw new Error('Obsidian Moment formatter is unavailable');
    return moment(now).format('[Pasted image ]YYYYMMDDHHmmss');
}

/** The file's own name in a vault path, without folders or extension, or null for an empty path. */
export function baseNameFromPath(path: string): string | null {
    const last = path.split('/').pop() ?? '';
    const base = last.replace(/\.[a-z0-9]+$/i, '');
    return base ? base : null;
}

/**
 * Builds the token values a filename template can reference. `fallbackName` is used when the
 * URL carries no usable name, which is how a clipboard bitmap contributes its own file name.
 */
export function buildFileNameTokens(url: string, fallbackName?: string): FileNameTokens {
    const fallback = fallbackName ? sanitizeFileName(fallbackName.replace(/\.[a-z0-9]+$/i, '')) : FALLBACK_BASENAME;

    return {
        name: baseNameFromUrl(url) ?? fallback
    };
}

/**
 * Matches any {{...}} sequence, so a mistyped token is literalized and stays visible in
 * the name instead of leaking into the Moment pass as accidental date tokens.
 */
const TEMPLATE_TOKEN = /\{\{([^{}]*)\}\}/g;

/**
 * Widest zero-pad a counter accepts, and the most digits an existing file's number may
 * have to count as part of the sequence. Both caps exist for the same reason: a folder
 * of "Pasted image 20260818232550" files must not push the counter into timestamp
 * territory, and a typo like {{counter:300}} must not pad a name past the filesystem
 * limit.
 */
const MAX_COUNTER_DIGITS = 6;

/**
 * A template rendered around its counter slots. `segments` holds the text between the
 * slots, so one segment means the template has no counter. Segments are final: cleaned,
 * capped and ready to join with the numbers.
 */
export interface ExpandedFileName {
    segments: string[];
    /** Zero-pad width of each counter slot, 0 for an unpadded number. */
    counterWidths: number[];
}

/** A token's text cleaned for use inside a file name, or null when nothing usable remains. */
function cleanTokenValue(value: string | null | undefined): string | null {
    if (value == null) return null;
    const cleaned = cleanFileNameText(value)
        .replace(/^[.\s]+|[.\s]+$/g, '')
        .trim();
    return cleaned ? cleaned : null;
}

/** Cleans and caps the text around counter slots. */
function finishCounterSegments(formatted: string[], counterWidths: number[]): ExpandedFileName {
    const segments = formatted.map(cleanFileNameText);
    // Edge cleanup belongs to the whole name, not to each segment: a space before the
    // number is content, a space at the start of the name is not
    segments[0] = segments[0].replace(/^[.\s]+/, '');
    segments[segments.length - 1] = segments[segments.length - 1].replace(/[.\s]+$/, '');

    // Room is set aside for the numbers so truncating a long note name cannot cut them off
    let budget = Math.max(1, MAX_BASENAME_LENGTH - counterWidths.reduce((sum, width) => sum + Math.max(COUNTER_RESERVE, width), 0));
    for (let index = 0; index < segments.length; index++) {
        // Array.from cuts at code-point boundaries, as sanitizeFileName does
        const points = [...segments[index]];
        if (points.length <= budget) {
            budget -= points.length;
            continue;
        }
        segments[index] = points.slice(0, budget).join('');
        for (let rest = index + 1; rest < segments.length; rest++) segments[rest] = '';
        break;
    }
    segments[segments.length - 1] = segments[segments.length - 1].replace(/[.\s]+$/, '');

    return { segments, counterWidths };
}

/**
 * Expands a filename template around its counter slots. Unknown tokens are left in place
 * so a typo is visible rather than silently producing an empty name. Returns null when a
 * referenced value is unavailable, such as a frontmatter property the note does not
 * carry, so the caller can decide what stands in.
 */
export function expandFileNameTemplate(template: string, tokens: FileNameTokens, now: Date): ExpandedFileName | null {
    const rawSegments: string[] = [];
    const counterWidths: number[] = [];
    let current = '';
    let lastIndex = 0;

    for (const match of template.matchAll(TEMPLATE_TOKEN)) {
        current += template.slice(lastIndex, match.index);
        lastIndex = match.index + match[0].length;

        const key = match[1];
        const width = /^counter(?::(\d+))?$/.exec(key);
        if (width) {
            rawSegments.push(current);
            current = '';
            counterWidths.push(Math.min(MAX_COUNTER_DIGITS, Number(width[1] ?? 0)));
            continue;
        }

        let value: string | null;
        if (key === 'name') value = tokens.name;
        else if (key === 'noteName') value = cleanTokenValue(tokens.noteName);
        else if (key.startsWith('property:')) value = cleanTokenValue(tokens.property?.(key.slice('property:'.length).trim()));
        else {
            current += `[${match[0]}]`;
            continue;
        }

        if (value === null) return null;
        // Cleaning removed any brackets, so the value cannot break out of the Moment literal
        current += `[${value}]`;
    }
    current += template.slice(lastIndex);
    rawSegments.push(current);

    if (!isMomentDateFormatter(moment)) throw new Error('Obsidian Moment formatter is unavailable');
    // The narrowed formatter is captured because the guard does not reach into a closure
    const formatDate = moment;
    // A date token cannot span a counter slot, so the segments format independently
    // An empty segment skips Moment, because Moment answers an empty pattern with its
    // full default ISO output rather than an empty string
    const formatted = rawSegments.map(segment => (segment ? formatDate(now).format(segment) : ''));

    if (counterWidths.length === 0) return { segments: [sanitizeFileName(formatted[0])], counterWidths };
    return finishCounterSegments(formatted, counterWidths);
}

/** Joins the expanded segments, writing the counter value into each slot. */
export function assembleFileName(expanded: ExpandedFileName, counter = 0): string {
    const { segments, counterWidths } = expanded;
    let name = segments[0];
    for (let index = 0; index < counterWidths.length; index++) {
        name += String(counter).padStart(counterWidths[index], '0') + segments[index + 1];
    }
    // The counter digit itself can complete a device name, "com" plus 1 gives "com1",
    // so the reserved-name guard from sanitizeFileName applies here as well
    return WINDOWS_RESERVED_NAME.test(name) ? `_${name}` : name;
}

/**
 * Matches an existing file's basename against the rendered template, capturing its
 * counter value. Case-insensitive because the common desktop filesystems are. The digit
 * cap keeps a timestamp-named file, "Pasted image 20260818232550", out of the sequence.
 */
export function counterPattern(expanded: ExpandedFileName): RegExp {
    const escaped = expanded.segments.map(segment => segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    return new RegExp(`^${escaped.join(`(\\d{1,${MAX_COUNTER_DIGITS}})`)}$`, 'i');
}

/**
 * Expands a filename template into one name, showing counters as their first number.
 * Returns the fallback base name when the template references a value that is not
 * available; saving instead re-expands the default template, which the settings example
 * never needs because it supplies a sample value for every token.
 */
export function applyFileNameTemplate(template: string, tokens: FileNameTokens, now: Date): string {
    const expanded = expandFileNameTemplate(template, tokens, now);
    return expanded ? assembleFileName(expanded, 1) : FALLBACK_BASENAME;
}
