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

/** Characters Obsidian and the major filesystems reject in a file name. */
const ILLEGAL_CHARACTERS = /[\\/:*?"<>|[\]#^]/g;

/** Longest base name we generate, leaving room for a dedupe suffix and the extension. */
const MAX_BASENAME_LENGTH = 80;

/** Fallback used when a URL carries no usable name. */
const FALLBACK_BASENAME = 'pasted-image';

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

/** Strips characters that cannot appear in a vault file name and trims the result to a sane length. */
export function sanitizeFileName(name: string): string {
    const cleaned = name
        .replace(ILLEGAL_CHARACTERS, '')
        // eslint-disable-next-line no-control-regex -- matching control characters is the purpose of this pattern
        .replace(new RegExp('[\\u0000-\\u001F\\u007F]', 'g'), '')
        .replace(/\s+/g, ' ')
        .replace(/^[.\s]+|[.\s]+$/g, '')
        .trim();

    if (!cleaned) return FALLBACK_BASENAME;
    return cleaned.length > MAX_BASENAME_LENGTH ? cleaned.slice(0, MAX_BASENAME_LENGTH).trim() : cleaned;
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
    /** Host the image came from. */
    host: string;
    /** Local date as YYYY-MM-DD. */
    date: string;
    /** Local time as HHmmss. */
    time: string;
    /** Milliseconds since the epoch. */
    timestamp: string;
}

/**
 * Builds the token values a filename template can reference. `fallbackName` is used when the
 * URL carries no usable name, which is how a clipboard bitmap contributes its own file name.
 */
export function buildFileNameTokens(url: string, now: Date, fallbackName?: string): FileNameTokens {
    const pad = (value: number, width = 2): string => String(value).padStart(width, '0');

    let host = '';
    try {
        host = new URL(url).hostname.replace(/^www\./, '');
    } catch {
        host = '';
    }

    const fallback = fallbackName ? sanitizeFileName(fallbackName.replace(/\.[a-z0-9]+$/i, '')) : FALLBACK_BASENAME;

    return {
        name: baseNameFromUrl(url) ?? fallback,
        host: sanitizeFileName(host),
        date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
        time: `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`,
        timestamp: String(now.getTime())
    };
}

/**
 * Expands a filename template. Unknown tokens are left in place so a typo is visible
 * rather than silently producing an empty name.
 */
export function applyFileNameTemplate(template: string, tokens: FileNameTokens): string {
    const expanded = template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
        const value = tokens[key as keyof FileNameTokens];
        return typeof value === 'string' ? value : match;
    });

    return sanitizeFileName(expanded);
}
