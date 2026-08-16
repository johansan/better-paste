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

import { requestUrl } from 'obsidian';
import type { RequestUrlParam, RequestUrlResponse } from 'obsidian';
import { extensionOfUrl } from './imageReferences';
import { IMAGE_EXTENSIONS, LINK_TITLE_TIMEOUT_SECONDS } from '../settings/constants';

/** Pages declaring more than this are skipped: no title is worth buffering them. */
const MAX_PAGE_BYTES = 2 * 1024 * 1024;

/** The title sits in the head, so only this much of the body is ever parsed. */
const PARSE_SLICE_BYTES = 512 * 1024;
import { logWarning } from '../utils/logger';
import type { BetterPasteSettings } from '../settings/types';

type PageRequest = (request: RequestUrlParam | string) => Promise<RequestUrlResponse>;
type TitleParser = (html: string) => string | null;

/** Returns a standalone http(s) address, or null when the text contains anything else. */
export function standaloneWebUrl(text: string): string | null {
    if (!text || /\s/.test(text)) return null;

    try {
        const parsed = new URL(text);
        if ((parsed.protocol !== 'http:' && parsed.protocol !== 'https:') || !parsed.hostname) return null;
        return text;
    } catch {
        return null;
    }
}

/** True when the path extension identifies a URL as an image without making a request. */
export function isObviousImageUrl(url: string): boolean {
    const extension = extensionOfUrl(url);
    return extension !== null && IMAGE_EXTENSIONS.includes(extension);
}

/** Reads and normalises the document title from an HTML response. */
function extractPageTitle(html: string): string | null {
    const document = new DOMParser().parseFromString(html, 'text/html');
    const title = document.querySelector('title')?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    return title || null;
}

/** Escapes characters that would otherwise become Markdown inside a link label. */
export function escapeLinkTitle(title: string): string {
    return title.replace(/[\\`*_[\]<>~|]/g, '\\$&');
}

/**
 * Percent-encodes the characters that would let a URL break out of a Markdown link
 * destination. A crafted address ending in a parenthesis could otherwise close the link
 * early and turn the rest of itself into active Markdown, such as a remote image.
 */
export function escapeLinkDestination(url: string): string {
    return url.replace(/[\\()<>]/g, char => `%${char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')}`);
}

/** True when a page-specific URL returned only a brand name found in its hostname. */
function isGenericSiteTitle(title: string, url: URL): boolean {
    if (url.pathname === '/' && !url.search && !url.hash) return false;

    const normalise = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normalisedTitle = normalise(title);
    return normalisedTitle.length > 0 && url.hostname.split('.').some(label => normalise(label) === normalisedTitle);
}

/** Fetches page titles for standalone links and formats the resulting Markdown link. */
export class LinkTitleService {
    private readonly getSettings: () => BetterPasteSettings;
    private readonly requestPage: PageRequest;
    private readonly parseTitle: TitleParser;
    private disposed = false;

    constructor(getSettings: () => BetterPasteSettings, requestPage: PageRequest = requestUrl, parseTitle: TitleParser = extractPageTitle) {
        this.getSettings = getSettings;
        this.requestPage = requestPage;
        this.parseTitle = parseTitle;
    }

    dispose(): void {
        this.disposed = true;
    }

    /**
     * The Content-Length a HEAD request declares, or 0 when the server does not say.
     * Failures count as 0 so a server without HEAD support still gets its GET.
     */
    private async declaredLength(url: string, timeoutMs: number): Promise<number> {
        let timer: ReturnType<typeof setTimeout> | undefined;
        try {
            const response = await Promise.race([
                this.requestPage({ url, method: 'HEAD', throw: false }),
                new Promise<null>(resolve => {
                    timer = window.setTimeout(() => resolve(null), timeoutMs);
                })
            ]);
            if (!response || response.status < 200 || response.status >= 300) return 0;
            const header = Object.entries(response.headers).find(([name]) => name.toLowerCase() === 'content-length')?.[1];
            const length = Number(header ?? 0);
            return Number.isFinite(length) && length > 0 ? length : 0;
        } catch {
            return 0;
        } finally {
            if (timer !== undefined) window.clearTimeout(timer);
        }
    }

    /** True when this paste is exactly one non-image web address and title fetching is on. */
    hasWork(text: string): boolean {
        if (this.disposed || !this.getSettings().linkTitles) return false;
        const url = standaloneWebUrl(text);
        return url !== null && !isObviousImageUrl(url);
    }

    /** Returns a titled Markdown link, or null so the already-pasted address stays unchanged. */
    async materializeTitle(text: string): Promise<string | null> {
        if (!this.hasWork(text)) return null;
        const url = standaloneWebUrl(text);
        if (url === null) return null;

        const timeoutMs = LINK_TITLE_TIMEOUT_SECONDS * 1000;
        let timer: ReturnType<typeof setTimeout> | undefined;

        try {
            // requestUrl buffers the whole response and cannot stream or abort, so a page
            // that declares an oversized body is refused before any of it is downloaded.
            // A server that answers without a length is bounded only by the parse slice.
            if ((await this.declaredLength(url, timeoutMs)) > MAX_PAGE_BYTES) return null;
            if (this.disposed) return null;

            const response = await Promise.race([
                this.requestPage({ url, method: 'GET', throw: false }),
                new Promise<null>(resolve => {
                    timer = window.setTimeout(() => resolve(null), timeoutMs);
                })
            ]);

            if (this.disposed || response === null) return null;
            if (response.status < 200 || response.status >= 300) return null;

            const contentType = Object.entries(response.headers).find(([name]) => name.toLowerCase() === 'content-type')?.[1];
            if (contentType && !/^(?:text\/html|application\/xhtml\+xml)\b/i.test(contentType.trim())) return null;

            // The title lives in the head, so parsing stops after the first slice even
            // when a server streams an enormous page
            const title = this.parseTitle(response.text.slice(0, PARSE_SLICE_BYTES));
            return title && !isGenericSiteTitle(title, new URL(url)) ? `[${escapeLinkTitle(title)}](${escapeLinkDestination(url)})` : null;
        } catch (error) {
            logWarning(`Failed to fetch the title for ${url}`, error);
            return null;
        } finally {
            if (timer !== undefined) window.clearTimeout(timer);
        }
    }
}
