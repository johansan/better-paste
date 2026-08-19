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

import type { App } from 'obsidian';

/**
 * Plugins Better Paste replaces outright. The first two intercept the same paste event,
 * and Paste image rename watches for new attachments, so it renames the very files
 * Better Paste creates. Running them beside Better Paste means every paste is handled
 * twice. The values are fallback display names for when the installed manifest cannot
 * be read.
 */
const OVERLAPPING_PLUGINS: Record<string, string> = {
    'url-into-selection': 'Paste URL into selection',
    'obsidian-auto-link-title': 'Auto Link Title',
    'obsidian-paste-image-rename': 'Paste image rename'
};

export interface OverlappingPlugin {
    id: string;
    name: string;
}

/** The replaced plugins that are enabled right now, with their installed display names. */
export function findOverlappingPlugins(app: App): OverlappingPlugin[] {
    // The community plugin registry is not part of the public API surface, so it is
    // read defensively: anything unexpected means no warning rather than a crash
    const registry = (app as App & { plugins?: { enabledPlugins?: unknown; manifests?: unknown } }).plugins;
    const enabled = registry?.enabledPlugins;
    if (!(enabled instanceof Set)) return [];

    const manifests = registry?.manifests;
    const found: OverlappingPlugin[] = [];

    for (const [id, fallback] of Object.entries(OVERLAPPING_PLUGINS)) {
        if (!enabled.has(id)) continue;

        let name = fallback;
        if (manifests && typeof manifests === 'object') {
            const manifest = (manifests as Record<string, unknown>)[id];
            if (manifest && typeof manifest === 'object' && typeof (manifest as { name?: unknown }).name === 'string') {
                name = (manifest as { name: string }).name;
            }
        }
        found.push({ id, name });
    }

    return found;
}
