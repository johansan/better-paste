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
 * Some sites block or redirect ordinary page loads but publish an oEmbed endpoint that
 * answers a plain JSON request with the page title. Addresses these providers handle are
 * asked there before the page itself is fetched.
 */

interface TitleProvider {
    /** True when the provider publishes titles for this address. */
    handles(url: URL): boolean;
    /** The oEmbed endpoint, ready for the encoded page address to be appended. */
    endpoint: string;
}

function underDomain(hostname: string, domain: string): boolean {
    return hostname === domain || hostname.endsWith(`.${domain}`);
}

const TITLE_PROVIDERS: readonly TitleProvider[] = [
    {
        // Videos, short links, Shorts and playlists answer. Channel and other pages
        // return 404 and fall through to the page fetch.
        handles: url => url.hostname === 'youtu.be' || underDomain(url.hostname, 'youtube.com'),
        endpoint: 'https://www.youtube.com/oembed?format=json&url='
    },
    {
        // Posts and comment permalinks both answer with the post title. Addresses
        // without a post id return 400, so only these are sent.
        handles: url => underDomain(url.hostname, 'reddit.com') && url.pathname.includes('/comments/'),
        endpoint: 'https://www.reddit.com/oembed?url='
    },
    {
        // Videos answer with the caption and profiles with the profile name. The page
        // fetch only ever sees the app shell, so every TikTok address is sent. Broken
        // addresses return 400 and fall through.
        handles: url => underDomain(url.hostname, 'tiktok.com'),
        endpoint: 'https://www.tiktok.com/oembed?url='
    },
    {
        // Share pages serve a login shell to plain fetches, so this is the only source
        // of a title. Unknown recordings return 404 and fall through.
        handles: url => underDomain(url.hostname, 'loom.com') && url.pathname.startsWith('/share/'),
        endpoint: 'https://www.loom.com/v1/oembed?url='
    }
];

/** Returns the request that answers with this page's title, or null when no provider handles it. */
export function titleProviderRequest(url: URL): string | null {
    const provider = TITLE_PROVIDERS.find(candidate => candidate.handles(url));
    return provider ? provider.endpoint + encodeURIComponent(url.href) : null;
}

/** Reads and normalises the title from a provider's JSON response. */
export function titleFromProviderResponse(body: string): string | null {
    try {
        const parsed: unknown = JSON.parse(body);
        if (typeof parsed !== 'object' || parsed === null) return null;
        const title = (parsed as Record<string, unknown>).title;
        if (typeof title !== 'string') return null;
        const cleaned = title.replace(/\s+/g, ' ').trim();
        return cleaned || null;
    } catch {
        return null;
    }
}
