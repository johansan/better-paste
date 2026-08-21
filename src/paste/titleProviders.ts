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

/*
 * Some sites block or redirect ordinary page loads but publish an endpoint that answers
 * with the page title. Addresses these providers handle are asked there before the page
 * itself is fetched.
 */

import type { RequestUrlResponse } from 'obsidian';

interface TitleProvider {
    /** The provider request for this address, or null when the provider does not handle it. */
    requestFor(url: URL): TitleProviderRequest | null;
}

export interface TitleProviderRequest {
    url: string;
    method: 'GET' | 'HEAD';
    titleFromResponse: (response: RequestUrlResponse) => string | null;
    fallbackTitle: string | null;
    terminal: boolean;
}

function underDomain(hostname: string, domain: string): boolean {
    return hostname === domain || hostname.endsWith(`.${domain}`);
}

function normaliseTitle(title: unknown): string | null {
    if (typeof title !== 'string') return null;
    const cleaned = title.replace(/\s+/g, ' ').trim();
    return cleaned || null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isUnknownArray(value: unknown): value is unknown[] {
    return Array.isArray(value);
}

function objectFromJson(body: string): Record<string, unknown> | null {
    try {
        const parsed: unknown = JSON.parse(body);
        return isRecord(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

function titleFromOEmbedResponse(body: string): string | null {
    return normaliseTitle(objectFromJson(body)?.title);
}

function bodyProvider(url: string, parser: (body: string) => string | null): TitleProviderRequest {
    return {
        url,
        method: 'GET',
        titleFromResponse: response => parser(response.text),
        fallbackTitle: null,
        terminal: false
    };
}

function contentDispositionFilename(response: RequestUrlResponse): string | null {
    const disposition = Object.entries(response.headers).find(([name]) => name.toLowerCase() === 'content-disposition')?.[1];
    if (!disposition) return null;

    const encoded = /(?:^|;)\s*filename\*\s*=\s*UTF-8''([^;]*)/i.exec(disposition)?.[1]?.trim();
    if (encoded) {
        try {
            const decoded = normaliseTitle(decodeURIComponent(encoded));
            if (decoded) return decoded;
        } catch {
            // The ordinary filename parameter can still provide a usable name.
        }
    }

    const filename = /(?:^|;)\s*filename\s*=\s*(?:"([^"]*)"|([^;]*))/i.exec(disposition);
    const value = (filename?.[1] ?? filename?.[2] ?? '').trim();
    return normaliseTitle(value);
}

function dropboxPathFallback(url: URL): string | null {
    const segment = url.pathname.split('/').at(-1) ?? '';
    let decoded = segment;
    try {
        decoded = decodeURIComponent(segment);
    } catch {
        // A malformed cosmetic path is still more useful than no file name.
    }
    return decoded !== '.' && decoded !== '..' ? normaliseTitle(decoded) : null;
}

function dropboxPathKind(url: URL): 'file' | 'folder' | null {
    if (!['www.dropbox.com', 'dropbox.com', 'dl.dropbox.com'].includes(url.hostname.toLowerCase())) return null;
    if (/^\/scl\/fi\/[^/]+\/[^/]+\/?$/.test(url.pathname) || /^\/s\/[^/]+\/[^/]+\/?$/.test(url.pathname)) return 'file';
    // Shared folder links can target nested content, so both folder patterns accept a subpath. https://developers.dropbox.com/dbx-sharing-guide
    if (/^\/scl\/fo\/[^/]+\/[^/]+(?:\/.*)?$/.test(url.pathname) || /^\/sh\/[^/]+\/[^/]+(?:\/.*)?$/.test(url.pathname)) return 'folder';
    return null;
}

/** True when the URL is a Dropbox file or folder share page. */
export function isDropboxShareUrl(url: string | URL): boolean {
    try {
        const parsed = typeof url === 'string' ? new URL(url) : url;
        // raw=1 and dl=1 serve the file directly, so those URLs stay available to image handling. https://help.dropbox.com/share/force-download
        if (
            parsed.hostname.toLowerCase() === 'dl.dropbox.com' ||
            parsed.searchParams.get('raw') === '1' ||
            parsed.searchParams.get('dl') === '1'
        )
            return false;
        return dropboxPathKind(parsed) !== null;
    } catch {
        return false;
    }
}

function dropboxProviderRequest(url: URL): TitleProviderRequest | null {
    const kind = dropboxPathKind(url);
    if (kind === null) return null;

    if (kind === 'file') {
        const request = new URL(url.pathname, 'https://dl.dropboxusercontent.com');
        const rlkey = url.searchParams.get('rlkey');
        if (rlkey !== null) request.searchParams.set('rlkey', rlkey);
        return {
            url: request.href,
            method: 'HEAD',
            titleFromResponse: contentDispositionFilename,
            fallbackTitle: dropboxPathFallback(url),
            terminal: true
        };
    }

    const request = new URL(url.href);
    request.hostname = 'www.dropbox.com';
    request.searchParams.set('dl', '1');
    return {
        url: request.href,
        method: 'HEAD',
        titleFromResponse: response => normaliseTitle(contentDispositionFilename(response)?.replace(/\.zip$/i, '')),
        fallbackTitle: null,
        terminal: true
    };
}

const STACK_EXCHANGE_DOMAINS = [
    'stackexchange.com',
    'stackoverflow.com',
    'superuser.com',
    'serverfault.com',
    'askubuntu.com',
    'stackapps.com',
    'mathoverflow.net'
] as const;

function stackExchangeQuestionId(url: URL): string | null {
    if (!STACK_EXCHANGE_DOMAINS.some(domain => underDomain(url.hostname, domain))) return null;
    return /^\/(?:questions|q)\/([0-9]+)(?:\/|$)/.exec(url.pathname)?.[1] ?? null;
}

function titleFromStackExchangeResponse(body: string): string | null {
    const items = objectFromJson(body)?.items;
    if (!isUnknownArray(items)) return null;

    const first = items[0];
    if (!isRecord(first)) return null;
    const title = first.title;
    if (typeof title !== 'string' || !title.trim()) return null;

    const decoded = new DOMParser().parseFromString(title, 'text/html').body.textContent;
    return normaliseTitle(decoded);
}

const TITLE_PROVIDERS: readonly TitleProvider[] = [
    { requestFor: dropboxProviderRequest },
    {
        // Videos, short links, Shorts and playlists answer. Channel and other pages
        // return 404 and fall through to the page fetch.
        requestFor: url =>
            url.hostname === 'youtu.be' || underDomain(url.hostname, 'youtube.com')
                ? bodyProvider(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url.href)}`, titleFromOEmbedResponse)
                : null
    },
    {
        // Posts and comment permalinks both answer with the post title. Addresses
        // without a post id return 400, so only these are sent.
        requestFor: url =>
            underDomain(url.hostname, 'reddit.com') && url.pathname.includes('/comments/')
                ? bodyProvider(`https://www.reddit.com/oembed?url=${encodeURIComponent(url.href)}`, titleFromOEmbedResponse)
                : null
    },
    {
        // Videos answer with the caption and profiles with the profile name. The page
        // fetch only ever sees the app shell, so every TikTok address is sent. Broken
        // addresses return 400 and fall through.
        requestFor: url =>
            underDomain(url.hostname, 'tiktok.com')
                ? bodyProvider(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url.href)}`, titleFromOEmbedResponse)
                : null
    },
    {
        // Share pages serve a login shell to plain fetches, so this is the only source
        // of a title. Unknown recordings return 404 and fall through.
        requestFor: url =>
            underDomain(url.hostname, 'loom.com') && url.pathname.startsWith('/share/')
                ? bodyProvider(`https://www.loom.com/v1/oembed?url=${encodeURIComponent(url.href)}`, titleFromOEmbedResponse)
                : null
    },
    {
        // Question pages block ordinary requests, so the API is used only when the path
        // supplies the question id required by its endpoint.
        requestFor: url => {
            const questionId = stackExchangeQuestionId(url);
            return questionId === null
                ? null
                : bodyProvider(
                      `https://api.stackexchange.com/2.3/questions/${questionId}?site=${encodeURIComponent(url.hostname)}`,
                      titleFromStackExchangeResponse
                  );
        }
    }
];

/** Returns the request that answers with this page's title, or null when no provider handles it. */
export function titleProviderRequest(url: URL): TitleProviderRequest | null {
    for (const provider of TITLE_PROVIDERS) {
        const request = provider.requestFor(url);
        if (request !== null) return request;
    }
    return null;
}
