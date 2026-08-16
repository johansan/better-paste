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

import { describe, expect, it } from 'vitest';
import { findOverlappingPlugins } from '../src/pluginOverlap';
import type { App } from 'obsidian';

function appWith(plugins: unknown): App {
    return { plugins } as unknown as App;
}

describe('findOverlappingPlugins', () => {
    it('returns nothing when the registry is missing or malformed', () => {
        expect(findOverlappingPlugins(appWith(undefined))).toEqual([]);
        expect(findOverlappingPlugins(appWith({}))).toEqual([]);
        expect(findOverlappingPlugins(appWith({ enabledPlugins: ['url-into-selection'] }))).toEqual([]);
    });

    it('returns nothing when only unrelated plugins are enabled', () => {
        expect(findOverlappingPlugins(appWith({ enabledPlugins: new Set(['notebook-navigator']) }))).toEqual([]);
    });

    it('uses the installed manifest name when it is available', () => {
        const app = appWith({
            enabledPlugins: new Set(['url-into-selection']),
            manifests: { 'url-into-selection': { name: 'Paste URL into selection' } }
        });
        expect(findOverlappingPlugins(app)).toEqual([{ id: 'url-into-selection', name: 'Paste URL into selection' }]);
    });

    it('falls back to the shipped name without a manifest', () => {
        const app = appWith({ enabledPlugins: new Set(['obsidian-auto-link-title']) });
        expect(findOverlappingPlugins(app)).toEqual([{ id: 'obsidian-auto-link-title', name: 'Auto Link Title' }]);
    });

    it('reports both plugins when both are enabled', () => {
        const app = appWith({ enabledPlugins: new Set(['url-into-selection', 'obsidian-auto-link-title']) });
        expect(findOverlappingPlugins(app)).toHaveLength(2);
    });
});
