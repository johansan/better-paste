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

interface TitleProvider {
    /** The provider request for this address, or null when the provider does not handle it. */
    requestFor(url: URL): string | null;
    /** Reads the title from this provider's response. */
    titleFromResponse: (body: string) => string | null;
}

export interface TitleProviderRequest {
    url: string;
    titleFromResponse: (body: string) => string | null;
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
    {
        // Videos, short links, Shorts and playlists answer. Channel and other pages
        // return 404 and fall through to the page fetch.
        requestFor: url =>
            url.hostname === 'youtu.be' || underDomain(url.hostname, 'youtube.com')
                ? `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url.href)}`
                : null,
        titleFromResponse: titleFromOEmbedResponse
    },
    {
        // Posts and comment permalinks both answer with the post title. Addresses
        // without a post id return 400, so only these are sent.
        requestFor: url =>
            underDomain(url.hostname, 'reddit.com') && url.pathname.includes('/comments/')
                ? `https://www.reddit.com/oembed?url=${encodeURIComponent(url.href)}`
                : null,
        titleFromResponse: titleFromOEmbedResponse
    },
    {
        // Videos answer with the caption and profiles with the profile name. The page
        // fetch only ever sees the app shell, so every TikTok address is sent. Broken
        // addresses return 400 and fall through.
        requestFor: url =>
            underDomain(url.hostname, 'tiktok.com') ? `https://www.tiktok.com/oembed?url=${encodeURIComponent(url.href)}` : null,
        titleFromResponse: titleFromOEmbedResponse
    },
    {
        // Share pages serve a login shell to plain fetches, so this is the only source
        // of a title. Unknown recordings return 404 and fall through.
        requestFor: url =>
            underDomain(url.hostname, 'loom.com') && url.pathname.startsWith('/share/')
                ? `https://www.loom.com/v1/oembed?url=${encodeURIComponent(url.href)}`
                : null,
        titleFromResponse: titleFromOEmbedResponse
    },
    {
        // Question pages block ordinary requests, so the API is used only when the path
        // supplies the question id required by its endpoint.
        requestFor: url => {
            const questionId = stackExchangeQuestionId(url);
            return questionId === null
                ? null
                : `https://api.stackexchange.com/2.3/questions/${questionId}?site=${encodeURIComponent(url.hostname)}`;
        },
        titleFromResponse: titleFromStackExchangeResponse
    }
];

/** Returns the request that answers with this page's title, or null when no provider handles it. */
export function titleProviderRequest(url: URL): TitleProviderRequest | null {
    for (const provider of TITLE_PROVIDERS) {
        const requestUrl = provider.requestFor(url);
        if (requestUrl !== null) {
            return { url: requestUrl, titleFromResponse: provider.titleFromResponse };
        }
    }
    return null;
}
