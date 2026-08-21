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

import { trimTrailingNoise, urlBoundary } from '../transforms/urlCleanup';
import { frontmatterRanges, markdownSyntaxRanges } from '../transforms/typography';
import { markdownCodeRanges } from '../transforms/markdownRanges';
import { IMAGE_EXTENSIONS } from '../settings/constants';
import { isDropboxShareUrl } from './titleProviders';

/** Where an image reference came from, which decides how it is rewritten. */
export type ImageReferenceKind = 'markdown' | 'html' | 'bare';

export interface ImageReference {
    /** Exact source text that will be replaced by a vault embed. */
    token: string;
    /** Offset of the token within the source text. */
    index: number;
    /** Image source: an http(s) URL or a data: URI. */
    url: string;
    /** Alt text, when the source provided one. */
    alt: string;
    kind: ImageReferenceKind;
}

/** Markdown image: ![alt](url "optional title") */
const MARKDOWN_IMAGE = /!\[((?:\\.|[^\]\\\n])*)\]\(\s*<?((?:[^()<\s>]|\([^()<\s>]*\))+)>?(?:\s+(?:"[^"]*"|'[^']*'))?\s*\)/g;

/** Ordinary Markdown link, claimed so its destination is never mistaken for a bare image URL. */
const MARKDOWN_LINK = /\[(?:\\.|[^\]\\\n])*\]\(\s*<?(?:[^()<\s>]|\([^()<\s>]*\))+>?(?:\s+(?:"[^"]*"|'[^']*'))?\s*\)/g;

/** Link definition, claimed so its destination is not rewritten as a bare image URL. */
const MARKDOWN_DEFINITION = /^ {0,3}\[(?:\\.|[^\]\\\n])+\]:[ \t]*<?(?:[^()<\s>]|\([^()<\s>]*\))+>?[^\n]*$/gm;

/** Raw HTML image tag, including greater-than signs inside quoted attributes. */
const HTML_IMAGE = /<img\b(?:[^"'<>]|"[^"]*"|'[^']*')*>/gi;

/** Bare http(s) URL, filtered afterwards to those that point at an image file. */
const BARE_URL = /https?:\/\/[^\s<>"`\\\u201c\u201d]+/gi;

/** Tags and autolinks claimed before bare URLs, so an href is never rewritten as an image. */
const HTML_TAG = /<(?:[^"'<>]|"[^"]*"|'[^']*')+>/g;

/** Decodes the character references supported in clipboard HTML attributes. */
function decodeHtmlAttribute(value: string): string {
    const named: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0' };

    return value.replace(/&(amp|lt|gt|quot|apos|nbsp|#\d+|#x[\da-f]+);/gi, (reference, entity: string) => {
        if (!entity.startsWith('#')) return named[entity.toLowerCase()];
        const hexadecimal = entity[1].toLowerCase() === 'x';
        const codePoint = Number.parseInt(entity.slice(hexadecimal ? 2 : 1), hexadecimal ? 16 : 10);
        return codePoint <= 0x10ffff && (codePoint < 0xd800 || codePoint > 0xdfff) ? String.fromCodePoint(codePoint) : reference;
    });
}

/** Reads an exact HTML attribute, without mistaking data-src or data-alt for it. */
function htmlAttribute(tag: string, name: 'src' | 'alt'): string | null {
    const pattern = new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i');
    const match = pattern.exec(tag);
    return match ? decodeHtmlAttribute(match[1] ?? match[2] ?? match[3] ?? '') : null;
}

/**
 * Returns the `src` of every image tag in a clipboard HTML payload, in document order.
 * Used to name clipboard bitmaps after the picture they came from, so this deliberately
 * ignores the download settings: nothing is fetched here.
 */
export function imageSourcesFromHtml(html: string): string[] {
    const sources: string[] = [];

    HTML_IMAGE.lastIndex = 0;
    for (let match = HTML_IMAGE.exec(html); match !== null; match = HTML_IMAGE.exec(html)) {
        const source = htmlAttribute(match[0], 'src');
        if (source !== null) sources.push(source);
    }

    return sources;
}

/** True when a clipboard HTML payload describes at least one image. */
export function htmlHasImages(html: string): boolean {
    return /<img\b/i.test(html);
}

/** True when the URL is an inline data: URI carrying image bytes. */
export function isDataImageUri(url: string): boolean {
    return /^data:image\//i.test(url);
}

/** True when the URL uses a scheme we are willing to download from. */
export function isHttpUrl(url: string): boolean {
    return /^https?:\/\//i.test(url);
}

/** Percent-encodes characters that cannot safely appear in a Markdown link destination. */
export function escapeMarkdownDestination(destination: string): string {
    return destination.replace(/[\\()<> \r\n\t]/g, char => `%${char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')}`);
}

/** Builds a remote image embed whose label and destination cannot break Markdown syntax. */
export function remoteMarkdownEmbed(alt: string, url: string, size: string | null): string {
    const safeAlt = alt
        .replace(/[[\]|\\]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    const label = size ? (safeAlt ? `${safeAlt}|${size}` : size) : safeAlt;
    return `![${label}](${escapeMarkdownDestination(url)})`;
}

/** Returns the lowercase file extension of a URL's path, or null when it has none. */
export function extensionOfUrl(url: string): string | null {
    try {
        const parsed = new URL(url);
        const match = /\.([a-z0-9]+)$/i.exec(parsed.pathname);
        return match ? match[1].toLowerCase() : null;
    } catch {
        return null;
    }
}

/** True when a bare URL points at something that looks like an image file. */
function looksLikeImageUrl(url: string): boolean {
    if (isDropboxShareUrl(url)) return false;
    const extension = extensionOfUrl(url);
    return extension !== null && IMAGE_EXTENSIONS.some(candidate => candidate.toLowerCase() === extension);
}

/** True when this is a source the plugin knows how to pull into the vault. */
function isSupportedSource(url: string): boolean {
    return isDataImageUri(url) || isHttpUrl(url);
}

/**
 * Finds every image in `text` that should be pulled into the vault. Overlapping matches are
 * resolved by priority: an explicit Markdown or HTML image always wins over a bare URL that
 * happens to sit inside it.
 */
export function findImageReferences(text: string): ImageReference[] {
    const found: ImageReference[] = [];
    // Frontmatter is claimed up front: a cover or banner property holding an image URL is
    // data, and rewriting it into a vault embed would break the properties block
    const claimed: { start: number; end: number }[] = [...markdownCodeRanges(text), ...frontmatterRanges(text)];

    const claim = (start: number, end: number): boolean => {
        if (claimed.some(range => start < range.end && end > range.start)) return false;
        claimed.push({ start, end });
        return true;
    };

    MARKDOWN_IMAGE.lastIndex = 0;
    for (let match = MARKDOWN_IMAGE.exec(text); match !== null; match = MARKDOWN_IMAGE.exec(text)) {
        // An odd run of backslashes escapes the bang, which then renders as a literal
        // character in front of a normal link rather than an image
        let slashes = 0;
        for (let i = match.index - 1; i >= 0 && text[i] === '\\'; i--) slashes += 1;
        if (slashes % 2 === 1) continue;
        const url = match[2];
        if (!isSupportedSource(url)) continue;
        if (!claim(match.index, match.index + match[0].length)) continue;
        found.push({ token: match[0], index: match.index, url, alt: match[1] ?? '', kind: 'markdown' });
    }

    MARKDOWN_LINK.lastIndex = 0;
    for (let match = MARKDOWN_LINK.exec(text); match !== null; match = MARKDOWN_LINK.exec(text)) {
        claim(match.index, match.index + match[0].length);
    }

    MARKDOWN_DEFINITION.lastIndex = 0;
    for (let match = MARKDOWN_DEFINITION.exec(text); match !== null; match = MARKDOWN_DEFINITION.exec(text)) {
        claim(match.index, match.index + match[0].length);
    }

    HTML_IMAGE.lastIndex = 0;
    for (let match = HTML_IMAGE.exec(text); match !== null; match = HTML_IMAGE.exec(text)) {
        const url = htmlAttribute(match[0], 'src');
        if (url === null || !isSupportedSource(url)) continue;
        if (!claim(match.index, match.index + match[0].length)) continue;
        const alt = htmlAttribute(match[0], 'alt') ?? '';
        found.push({ token: match[0], index: match.index, url, alt, kind: 'html' });
    }

    HTML_TAG.lastIndex = 0;
    for (let match = HTML_TAG.exec(text); match !== null; match = HTML_TAG.exec(text)) {
        claim(match.index, match.index + match[0].length);
    }

    // Everything the text rules protect is claimed label-independently before bare URLs,
    // because a link label containing brackets, such as a linked thumbnail
    // [![shot](thumb.png)](https://example.com/full.png), defeats the link pattern above
    // and would leave its destination free for the bare pass to rewrite
    for (const range of markdownSyntaxRanges(text)) claim(range.start, range.end);

    BARE_URL.lastIndex = 0;
    for (let match = BARE_URL.exec(text); match !== null; match = BARE_URL.exec(text)) {
        const boundary = urlBoundary(match[0], text[match.index - 1] ?? '');
        const url = trimTrailingNoise(boundary.url);
        // An ambiguous match is skipped up to its first unmatched closer or the next
        // whitespace, otherwise a URL nested in its query would be rewritten. Anything
        // else rescans what the trim gave back, so a URL pasted flush behind this one
        // is seen too
        if (boundary.ambiguous) {
            if (boundary.resume !== -1) {
                BARE_URL.lastIndex = match.index + boundary.resume;
            } else {
                const whitespace = /\s/.exec(text.slice(match.index + match[0].length));
                BARE_URL.lastIndex = whitespace ? match.index + match[0].length + whitespace.index : text.length;
            }
            continue;
        }
        BARE_URL.lastIndex = match.index + url.length;
        if (!looksLikeImageUrl(url)) continue;
        if (!claim(match.index, match.index + url.length)) continue;
        found.push({ token: url, index: match.index, url, alt: '', kind: 'bare' });
    }

    return found.sort((a, b) => a.index - b.index);
}

/** The span each image reference occupies, for callers that must leave them alone. */
export function imageReferenceRanges(text: string): { start: number; end: number }[] {
    return findImageReferences(text).map(reference => ({
        start: reference.index,
        end: reference.index + reference.token.length
    }));
}

/**
 * Rebuilds `text` with each reference replaced by its resolved embed. References whose
 * download failed are left exactly as they were.
 */
export function replaceImageReferences(text: string, references: readonly ImageReference[], embeds: ReadonlyMap<number, string>): string {
    const ordered = [...references].sort((a, b) => a.index - b.index);
    const parts: string[] = [];
    let cursor = 0;

    for (const reference of ordered) {
        const embed = embeds.get(reference.index);
        if (embed === undefined) continue;
        parts.push(text.slice(cursor, reference.index), embed);
        cursor = reference.index + reference.token.length;
    }

    parts.push(text.slice(cursor));
    return parts.join('');
}
