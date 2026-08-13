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

import { trimUrlTail } from '../transforms/urlCleanup';
import { markdownCodeRanges } from '../transforms/markdownRanges';
import { IMAGE_EXTENSIONS } from '../settings/constants';
import type { BetterPasteSettings } from '../settings/types';

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

/** Subset of settings the reference finder reads. */
export type ImageReferenceOptions = Pick<BetterPasteSettings, 'imageLinkPaste'>;

/** Markdown image: ![alt](url "optional title") */
const MARKDOWN_IMAGE = /!\[((?:\\.|[^\]\\\n])*)\]\(\s*<?((?:[^()<\s>]+|\([^()<\s>]*\))+)>?(?:\s+(?:"[^"]*"|'[^']*'))?\s*\)/g;

/** Ordinary Markdown link, claimed so its destination is never mistaken for a bare image URL. */
const MARKDOWN_LINK = /\[(?:\\.|[^\]\\\n])*\]\(\s*<?(?:[^()<\s>]+|\([^()<\s>]*\))+>?(?:\s+(?:"[^"]*"|'[^']*'))?\s*\)/g;

/** Link definition, claimed so its destination is not rewritten as a bare image URL. */
const MARKDOWN_DEFINITION = /^ {0,3}\[(?:\\.|[^\]\\\n])+\]:[ \t]*<?(?:[^()<\s>]+|\([^()<\s>]*\))+>?[^\n]*$/gm;

/** Raw HTML image tag, which Obsidian leaves in place for some clipboard payloads. */
const HTML_IMAGE = /<img\b[^>]*?\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>/gi;

/** Bare http(s) URL, filtered afterwards to those that point at an image file. */
const BARE_URL = /https?:\/\/[^\s<>"`\\)\]]+/gi;

/** Tags and autolinks claimed before bare URLs, so an href is never rewritten as an image. */
const HTML_TAG = /<(?:[^"'<>]|"[^"]*"|'[^']*')+>/g;

/** Alt text of an HTML image tag. */
const HTML_ALT = /\balt\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i;

/**
 * Returns the `src` of every image tag in a clipboard HTML payload, in document order.
 * Used to name clipboard bitmaps after the picture they came from, so this deliberately
 * ignores the download settings: nothing is fetched here.
 */
export function imageSourcesFromHtml(html: string): string[] {
    const sources: string[] = [];

    HTML_IMAGE.lastIndex = 0;
    for (let match = HTML_IMAGE.exec(html); match !== null; match = HTML_IMAGE.exec(html)) {
        sources.push(match[1] ?? match[2] ?? match[3] ?? '');
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
export function findImageReferences(text: string, options: ImageReferenceOptions): ImageReference[] {
    const found: ImageReference[] = [];
    const claimed: { start: number; end: number }[] = markdownCodeRanges(text);

    const claim = (start: number, end: number): boolean => {
        if (claimed.some(range => start < range.end && end > range.start)) return false;
        claimed.push({ start, end });
        return true;
    };

    MARKDOWN_IMAGE.lastIndex = 0;
    for (let match = MARKDOWN_IMAGE.exec(text); match !== null; match = MARKDOWN_IMAGE.exec(text)) {
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
        const url = match[1] ?? match[2] ?? match[3] ?? '';
        if (!isSupportedSource(url)) continue;
        if (!claim(match.index, match.index + match[0].length)) continue;
        const altMatch = HTML_ALT.exec(match[0]);
        const alt = altMatch ? (altMatch[1] ?? altMatch[2] ?? altMatch[3] ?? '') : '';
        found.push({ token: match[0], index: match.index, url, alt, kind: 'html' });
    }

    HTML_TAG.lastIndex = 0;
    for (let match = HTML_TAG.exec(text); match !== null; match = HTML_TAG.exec(text)) {
        claim(match.index, match.index + match[0].length);
    }

    if (options.imageLinkPaste === 'image') {
        BARE_URL.lastIndex = 0;
        for (let match = BARE_URL.exec(text); match !== null; match = BARE_URL.exec(text)) {
            const url = trimUrlTail(match[0]);
            if (!looksLikeImageUrl(url)) continue;
            if (!claim(match.index, match.index + url.length)) continue;
            found.push({ token: url, index: match.index, url, alt: '', kind: 'bare' });
        }
    }

    return found.sort((a, b) => a.index - b.index);
}

/** The span each image reference occupies, for callers that must leave them alone. */
export function imageReferenceRanges(text: string, options: ImageReferenceOptions): { start: number; end: number }[] {
    return findImageReferences(text, options).map(reference => ({
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
