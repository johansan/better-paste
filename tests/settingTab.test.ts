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

import { beforeEach, describe, expect, it } from 'vitest';
import type { App, SettingDefinition, SettingDefinitionControl, SettingDefinitionItem } from 'obsidian';
import { BetterPasteSettingTab } from '../src/settings/SettingTab';
import { DEFAULT_SETTINGS } from '../src/settings/defaults';
import type BetterPastePlugin from '../src/main';
import type { BetterPasteSettings } from '../src/settings/types';

/** Minimal plugin double exposing only what the setting tab touches. */
function fakePlugin(overrides: Partial<BetterPasteSettings> = {}) {
    const settings: BetterPasteSettings = { ...DEFAULT_SETTINGS, ...overrides };
    let saves = 0;
    return {
        settings,
        saveSettings: async () => {
            saves += 1;
        },
        saveCount: () => saves
    };
}

function makeTab(plugin: ReturnType<typeof fakePlugin>): BetterPasteSettingTab {
    return new BetterPasteSettingTab({} as App, plugin as unknown as BetterPastePlugin);
}

/** Flattens the definition tree into the individual setting rows. */
function flatten(items: SettingDefinitionItem[]): SettingDefinition[] {
    const rows: SettingDefinition[] = [];
    for (const item of items) {
        if ('type' in item && (item.type === 'group' || item.type === 'list')) {
            rows.push(...flatten(item.items ?? []));
        } else {
            rows.push(item as SettingDefinition);
        }
    }
    return rows;
}

function controlRows(tab: BetterPasteSettingTab): SettingDefinitionControl[] {
    return flatten(tab.getSettingDefinitions()).filter((row): row is SettingDefinitionControl => row.control !== undefined);
}

/** The stub base class counts refreshDomState calls; the shipped typings do not expose that. */
function refreshCount(tab: BetterPasteSettingTab): number {
    return (tab as unknown as { refreshCount: number }).refreshCount;
}

/** Evaluates a row's visibility, which may be a boolean or a predicate. */
function isVisible(row: SettingDefinition | undefined): boolean | undefined {
    if (!row) return undefined;
    return typeof row.visible === 'function' ? row.visible() : row.visible;
}

describe('BetterPasteSettingTab definitions', () => {
    let plugin: ReturnType<typeof fakePlugin>;
    let tab: BetterPasteSettingTab;

    beforeEach(() => {
        plugin = fakePlugin();
        tab = makeTab(plugin);
    });

    it('every control key resolves to a real setting', () => {
        for (const row of controlRows(tab)) {
            const key = row.control.key;
            const settingKey = key.endsWith('.text') ? key.slice(0, -'.text'.length) : key;
            expect(Object.keys(DEFAULT_SETTINGS), `unknown control key "${key}"`).toContain(settingKey);
        }
    });

    it('reads the current value back for every control', () => {
        for (const row of controlRows(tab)) {
            const key = row.control.key;
            const value = tab.getControlValue(key);
            expect(value, `no value for "${key}"`).toBeDefined();
            // List settings are arrays in storage but strings in the editor
            if (key.endsWith('.text')) expect(typeof value).toBe('string');
            else expect(value).toEqual(plugin.settings[key as keyof BetterPasteSettings]);
        }
    });

    it('covers every setting except the ones with no control of their own', () => {
        const covered = new Set(
            controlRows(tab).map(row => {
                const key = row.control.key;
                return key.endsWith('.text') ? key.slice(0, -'.text'.length) : key;
            })
        );
        const missing = Object.keys(DEFAULT_SETTINGS).filter(key => !covered.has(key));
        expect(missing).toEqual([]);
    });

    it('gives every row a name', () => {
        for (const row of flatten(tab.getSettingDefinitions())) {
            expect(row.name.length).toBeGreaterThan(0);
        }
    });

    it('writes a plain setting through and persists it', async () => {
        await tab.setControlValue('terminalMinWrapWidth', 80);
        expect(plugin.settings.terminalMinWrapWidth).toBe(80);
        expect(plugin.saveCount()).toBe(1);
    });

    it('splits a line-separated list setting back into entries', async () => {
        await tab.setControlValue('urlDomainRules.text', 'example.com: a, b\n\nother.com');
        expect(plugin.settings.urlDomainRules).toEqual(['example.com: a, b', 'other.com']);
    });

    it('splits a comma-separated list setting back into entries', async () => {
        await tab.setControlValue('imageExtensions.text', 'png, jpg\nwebp');
        expect(plugin.settings.imageExtensions).toEqual(['png', 'jpg', 'webp']);
    });

    it('joins list settings for display using the right separator', () => {
        expect(tab.getControlValue('urlDomainRules.text')).toContain('\n');
        expect(tab.getControlValue('imageExtensions.text')).toBe(DEFAULT_SETTINGS.imageExtensions.join(', '));
    });

    it('hides the dependent image settings when the feature is off', () => {
        const off = makeTab(fakePlugin({ imagesEnabled: false }));
        const hidden = flatten(off.getSettingDefinitions()).filter(
            row => row.control?.key.startsWith('image') || row.control?.key.startsWith('download')
        );
        for (const row of hidden) {
            if (row.control?.key === 'imagesEnabled') continue;
            expect(isVisible(row), `"${row.control?.key}" should be hidden`).toBe(false);
        }
    });

    it('shows the custom image folder only in custom mode', () => {
        const folderRow = (settings: Partial<BetterPasteSettings>) =>
            flatten(makeTab(fakePlugin(settings)).getSettingDefinitions()).find(row => row.control?.key === 'imageFolder');

        expect(isVisible(folderRow({ imageFolderMode: 'obsidian' }))).toBe(false);
        expect(isVisible(folderRow({ imageFolderMode: 'custom' }))).toBe(true);
    });

    it('shows the tracking parameter list only in tracking mode', () => {
        const row = (mode: 'all' | 'tracking') =>
            flatten(makeTab(fakePlugin({ urlStripMode: mode })).getSettingDefinitions()).find(
                item => item.control?.key === 'urlTrackingParams.text'
            );

        expect(isVisible(row('all'))).toBe(false);
        expect(isVisible(row('tracking'))).toBe(true);
    });

    it('re-evaluates dependent settings after a plain change', async () => {
        const before = refreshCount(tab);
        await tab.setControlValue('imagesEnabled', false);
        expect(refreshCount(tab)).toBe(before + 1);
    });

    it('restores a list to its defaults from the action row', async () => {
        plugin.settings.urlDomainRules = ['only.example.com'];
        const restore = flatten(tab.getSettingDefinitions()).find(row => row.name.startsWith('Restore default site exceptions'));
        expect(restore?.action).toBeTypeOf('function');

        restore?.action?.(null as unknown as HTMLElement, 0);
        await Promise.resolve();
        await Promise.resolve();

        expect(plugin.settings.urlDomainRules).toEqual(DEFAULT_SETTINGS.urlDomainRules);
    });
});
