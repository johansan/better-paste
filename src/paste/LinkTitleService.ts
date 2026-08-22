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
import { escapeMarkdownDestination, extensionOfUrl } from './imageReferences';
import { isDropboxShareUrl, titleProviderRequest } from './titleProviders';
import type { TitleProviderRequest } from './titleProviders';
import { IMAGE_EXTENSIONS, LINK_TITLE_MAX_PARALLEL, LINK_TITLE_TIMEOUT_SECONDS } from '../settings/constants';
import { BLOCKQUOTE_PREFIX } from '../transforms/markdownRanges';

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

/** Returns the note title and original address from a standalone Obsidian open URL. */
export function obsidianUrlTitle(text: string): { title: string; url: string } | null {
    if (!text || /\s/.test(text)) return null;

    try {
        const parsed = new URL(text);
        if (parsed.protocol.toLowerCase() !== 'obsidian:' || parsed.host.toLowerCase() !== 'open') return null;

        const file = parsed.searchParams.get('file');
        if (!file) return null;
        // A heading or block suffix opens a place inside the note, so it stays in the
        // destination but not in the label. A trailing .md goes too, because the copy
        // command writes note names without it.
        const title = file.split('#')[0].split('/').pop()?.replace(/\.md$/i, '');
        if (!title) return null;
        return { title, url: text };
    } catch {
        return null;
    }
}

export interface StandaloneWebUrlLine {
    url: string;
    leading: string;
    trailing: string;
}

export interface StandaloneWebUrlLinesOptions {
    allowBlockQuotes?: boolean;
}

/** Returns the URL-bearing lines when the text is solely a list of web addresses. */
export function standaloneWebUrlLines(text: string, options: StandaloneWebUrlLinesOptions = {}): StandaloneWebUrlLine[] | null {
    if (standaloneWebUrl(text) !== null) return null;

    const lines: StandaloneWebUrlLine[] = [];
    for (const line of text.split('\n')) {
        const quotePrefix = options.allowBlockQuotes ? (BLOCKQUOTE_PREFIX.exec(line)?.[0] ?? '') : '';
        const content = line.slice(quotePrefix.length);
        if (!content.trim()) continue;
        const indentation = content.match(/^[ \t]*/)?.[0] ?? '';
        const afterIndentation = content.slice(indentation.length);
        const listPrefix = afterIndentation.match(/^(?:[-+*]|\d{1,9}[.)])[ \t]+(?:\[[ xX]\][ \t]+)?/)?.[0] ?? '';
        const value = afterIndentation.slice(listPrefix.length);
        const leading = quotePrefix + indentation + listPrefix;
        const trailing = value.match(/[ \t]*$/)?.[0] ?? '';
        const url = standaloneWebUrl(value.trim());
        if (url === null || isObviousImageUrl(url)) return null;
        lines.push({ url, leading, trailing });
    }
    return lines.length > 0 ? lines : null;
}

/** True when the path extension identifies a URL as an image without making a request. */
export function isObviousImageUrl(url: string): boolean {
    if (isDropboxShareUrl(url)) return false;
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

/** Formats the exact Markdown subject that link snippets and the note both see. */
export function formatTitledLink(title: string, url: string): string {
    return `[${escapeLinkTitle(title)}](${escapeMarkdownDestination(url)})`;
}

/** Finds the first unescaped Markdown link destination delimiter. */
function titledLinkDestinationStart(markdown: string): number {
    if (!markdown.startsWith('[') || !markdown.endsWith(')') || /[\r\n]/.test(markdown)) return -1;

    let backslashes = 0;
    for (let index = 1; index < markdown.length - 1; index++) {
        const char = markdown[index];
        if (char === '\\') {
            backslashes += 1;
            continue;
        }
        if (char === ']' && markdown[index + 1] === '(' && backslashes % 2 === 0) return index;
        backslashes = 0;
    }
    return -1;
}

/** Removes only escapes that the title formatter itself adds. */
function unescapeLinkTitle(title: string): string {
    return title.replace(/\\([\\`*_[\]<>~|])/g, '$1');
}

/** Keeps the original titled link unless a snippet changes only its non-empty label. */
export function composeTitledLink(source: string, result: string): string {
    const destinationStart = titledLinkDestinationStart(source);
    if (destinationStart < 1 || result === source) return source;

    const destination = source.slice(destinationStart);
    if (!result.startsWith('[') || !result.endsWith(destination)) return source;

    const label = result.slice(1, -destination.length);
    if (!label.trim() || /[\r\n]/.test(label)) return source;
    return `[${escapeLinkTitle(unescapeLinkTitle(label))}${destination}`;
}

/** True when a page-specific URL returned only a brand name found in its hostname. */
function isGenericSiteTitle(title: string, url: URL): boolean {
    if (url.pathname === '/' && !url.search && !url.hash) return false;

    const normalise = (value: string): string => value.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normalisedTitle = normalise(title);
    return normalisedTitle.length > 0 && url.hostname.split('.').some(label => normalise(label) === normalisedTitle);
}

/** Fetches page titles for standalone links. */
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

    /** True when the paste is solely URL lines and is not owned by the single-link path. */
    hasBatchWork(text: string): boolean {
        return !this.disposed && this.getSettings().linkTitles && standaloneWebUrlLines(text) !== null;
    }

    /** Fetches distinct URL titles with bounded concurrency and restores line order. */
    async materializeTitles(
        text: string,
        options: StandaloneWebUrlLinesOptions = {}
    ): Promise<({ title: string; url: string } | null)[] | null> {
        if (this.disposed || !this.getSettings().linkTitles) return null;
        const lines = standaloneWebUrlLines(text, options);
        if (lines === null) return null;

        const urls = [...new Set(lines.map(line => line.url))];
        const results = new Map<string, { title: string; url: string } | null>();
        let next = 0;
        const worker = async (): Promise<void> => {
            while (!this.disposed) {
                const index = next;
                next += 1;
                if (index >= urls.length) return;
                const url = urls[index];
                results.set(url, await this.materializeTitle(url));
            }
        };

        await Promise.all(Array.from({ length: Math.min(LINK_TITLE_MAX_PARALLEL, urls.length) }, () => worker()));
        return lines.map(line => results.get(line.url) ?? null);
    }

    /**
     * Asks a site's own title endpoint, because some sites answer it while blocking
     * ordinary page loads. Failures use the provider fallback, and terminal providers
     * prevent a later page fetch when no title is available.
     */
    private async titleFromProvider(provider: TitleProviderRequest, timeoutMs: number): Promise<string | null> {
        let timer: ReturnType<typeof setTimeout> | undefined;
        try {
            const response = await Promise.race([
                this.requestPage({ url: provider.url, method: provider.method, throw: false }),
                new Promise<null>(resolve => {
                    timer = window.setTimeout(() => resolve(null), timeoutMs);
                })
            ]);
            if (this.disposed) return null;
            if (response === null || response.status < 200 || response.status >= 300) return provider.fallbackTitle;
            return provider.titleFromResponse(response) ?? provider.fallbackTitle;
        } catch {
            return this.disposed ? null : provider.fallbackTitle;
        } finally {
            if (timer !== undefined) window.clearTimeout(timer);
        }
    }

    /** Returns the raw title and address for final Markdown formatting, or null on failure. */
    async materializeTitle(text: string): Promise<{ title: string; url: string } | null> {
        if (!this.hasWork(text)) return null;
        const url = standaloneWebUrl(text);
        if (url === null) return null;

        // One deadline covers the provider, HEAD and GET legs together, so a stalled
        // request cannot stretch the wait past the documented limit.
        const deadline = Date.now() + LINK_TITLE_TIMEOUT_SECONDS * 1000;
        const remainingMs = (): number => deadline - Date.now();
        let timer: ReturnType<typeof setTimeout> | undefined;

        try {
            const providerRequest = titleProviderRequest(new URL(url));
            if (providerRequest !== null) {
                const provided = await this.titleFromProvider(providerRequest, remainingMs());
                if (this.disposed) return null;
                if (provided !== null) return { title: provided, url };
                if (providerRequest.terminal) return null;
            }

            // requestUrl buffers the whole response and cannot stream or abort, so a page
            // that declares an oversized body is refused before any of it is downloaded.
            // A server that answers without a length is bounded only by the parse slice.
            if (remainingMs() <= 0) return null;
            if ((await this.declaredLength(url, remainingMs())) > MAX_PAGE_BYTES) return null;
            if (this.disposed || remainingMs() <= 0) return null;

            const response = await Promise.race([
                this.requestPage({ url, method: 'GET', throw: false }),
                new Promise<null>(resolve => {
                    timer = window.setTimeout(() => resolve(null), remainingMs());
                })
            ]);

            if (this.disposed || response === null) return null;
            if (response.status < 200 || response.status >= 300) return null;

            const contentType = Object.entries(response.headers).find(([name]) => name.toLowerCase() === 'content-type')?.[1];
            if (contentType && !/^(?:text\/html|application\/xhtml\+xml)\b/i.test(contentType.trim())) return null;

            // The title lives in the head, so parsing stops after the first slice even
            // when a server streams an enormous page
            const title = this.parseTitle(response.text.slice(0, PARSE_SLICE_BYTES));
            return title && !isGenericSiteTitle(title, new URL(url)) ? { title, url } : null;
        } catch (error) {
            logWarning(`Failed to fetch the title for ${url}`, error);
            return null;
        } finally {
            if (timer !== undefined) window.clearTimeout(timer);
        }
    }
}
