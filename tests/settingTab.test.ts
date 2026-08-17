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

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type {
    App,
    Setting,
    SettingDefinition,
    SettingDefinitionControl,
    SettingDefinitionGroup,
    SettingDefinitionItem,
    SettingDefinitionPage
} from 'obsidian';
import { BetterPasteSettingTab } from '../src/settings/SettingTab';
import { DEFAULT_SETTINGS } from '../src/settings/defaults';
import type BetterPastePlugin from '../src/main';
import type { BetterPasteSettings } from '../src/settings/types';
import { linkRemovalContributionUrl } from '../src/settings/pages/linksPage';
import { BUILT_IN_LINK_REMOVALS_URL } from '../src/urls';

/**
 * Settings the tab deliberately has no row for, because they are state the plugin keeps
 * rather than a choice the user makes.
 */
const STORED_STATE_KEYS = ['lastShownVersion', 'imageLastSize', 'imageLastClass', 'pdfLastFurniture', 'pdfLastSingleParagraph'];

/** Settings owned by a custom-rendered row rather than a declarative control. */
const CUSTOM_RENDER_SETTING_KEYS = ['imageNameTemplate', 'imageSizeChoice', 'imageSizeOptions', 'imageClassChoice', 'imageClassOptions'];

/** Minimal plugin double exposing only what the setting tab touches. */
function fakePlugin(overrides: Partial<BetterPasteSettings> = {}) {
    const settings: BetterPasteSettings = { ...DEFAULT_SETTINGS, ...overrides };
    let saves = 0;
    return {
        settings,
        manifest: { version: '1.0.0' },
        showWhatsNew: () => undefined,
        saveSettings: async () => {
            saves += 1;
        },
        saveCount: () => saves
    };
}

function makeTab(plugin: ReturnType<typeof fakePlugin>): BetterPasteSettingTab {
    return new BetterPasteSettingTab({} as App, plugin as unknown as BetterPastePlugin);
}

/** A definition that holds other definitions: a group, a list, or a sub-page. */
type Container = SettingDefinitionGroup | SettingDefinitionPage;

function isContainer(item: SettingDefinitionItem): item is Container {
    return 'type' in item && (item.type === 'group' || item.type === 'list' || item.type === 'page');
}

/** Flattens the definition tree into the individual setting rows, descending into pages. */
function flatten(items: SettingDefinitionItem[]): SettingDefinition[] {
    const rows: SettingDefinition[] = [];
    for (const item of items) {
        if (isContainer(item)) rows.push(...flatten([...(item.items ?? [])]));
        else rows.push(item);
    }
    return rows;
}

/** Every sub-page in the tree, at any depth. */
function pages(items: SettingDefinitionItem[]): SettingDefinitionPage[] {
    const found: SettingDefinitionPage[] = [];
    for (const item of items) {
        if (!isContainer(item)) continue;
        if (item.type === 'page') found.push(item);
        found.push(...pages([...(item.items ?? [])]));
    }
    return found;
}

function controlRows(tab: BetterPasteSettingTab): SettingDefinitionControl[] {
    return flatten(tab.getSettingDefinitions()).filter((row): row is SettingDefinitionControl => row.control !== undefined);
}

/** Evaluates a row's visibility, which may be a boolean or a predicate. */
function isVisible(row: { visible?: boolean | (() => boolean) } | undefined): boolean | undefined {
    if (!row) return undefined;
    return typeof row.visible === 'function' ? row.visible() : row.visible;
}

describe('settings tree', () => {
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

    it('every setting has a control or custom row somewhere in the tree', () => {
        const covered = new Set(
            controlRows(tab).map(row => {
                const key = row.control.key;
                return key.endsWith('.text') ? key.slice(0, -'.text'.length) : key;
            })
        );
        const uncovered = Object.keys(DEFAULT_SETTINGS).filter(
            key => !covered.has(key) && !CUSTOM_RENDER_SETTING_KEYS.includes(key) && !STORED_STATE_KEYS.includes(key)
        );
        expect(uncovered).toEqual([]);
    });

    it('reads the current value back for every control', () => {
        for (const row of controlRows(tab)) {
            const key = row.control.key;
            const value = tab.getControlValue(key);
            expect(value, `no value for "${key}"`).toBeDefined();
            if (key.endsWith('.text')) expect(typeof value).toBe('string');
            else expect(value).toEqual(plugin.settings[key as keyof BetterPasteSettings]);
        }
    });

    it('gives every row a name', () => {
        for (const row of flatten(tab.getSettingDefinitions())) {
            expect(row.name.length).toBeGreaterThan(0);
        }
    });

    it('puts the release notes and support rows below the rules', () => {
        const rows = flatten(tab.getSettingDefinitions());
        expect(rows.slice(-3).map(row => row.name)).toEqual([
            "What's new in Better Paste 1.0.0",
            'Support development',
            'Check out my other plugins'
        ]);
    });

    it('leaves the first group unheaded and names every group below it', () => {
        const groups = tab
            .getSettingDefinitions()
            .filter((item): item is SettingDefinitionGroup => 'type' in item && item.type === 'group');

        expect(groups.map(group => group.heading)).toEqual([undefined, 'Images', 'Links', 'Text processing', 'About']);
    });

    it('puts the note property under the master toggle and the width property under Images', () => {
        const groups = tab
            .getSettingDefinitions()
            .filter((item): item is SettingDefinitionGroup => 'type' in item && item.type === 'group');
        const top = groups.find(group => group.heading === undefined);
        const images = groups.find(group => group.heading === 'Images');

        const topNames = flatten([...(top?.items ?? [])]).map(row => row.name);
        expect(topNames).toEqual(['Clean up every paste', 'Note property']);

        const imageNames = flatten([...(images?.items ?? [])]).map(row => row.name);
        expect(imageNames.indexOf('Image width property')).toBeGreaterThan(imageNames.indexOf('Size options'));
    });

    it('puts the text preferences under Text processing', () => {
        const groups = tab
            .getSettingDefinitions()
            .filter((item): item is SettingDefinitionGroup => 'type' in item && item.type === 'group');
        const behavior = groups.find(group => group.heading === 'Behavior');
        const textProcessing = groups.find(group => group.heading === 'Text processing');
        const names = flatten([...(textProcessing?.items ?? [])]).map(row => row.name);

        expect(flatten([...(behavior?.items ?? [])]).map(row => row.name)).not.toContain('Trim surrounding whitespace');
        expect(names).toEqual(['Trim surrounding whitespace', 'Invisible characters', 'Quotes', 'Dashes']);
    });

    it('puts title fetching above link cleaning', () => {
        const names = flatten(tab.getSettingDefinitions()).map(row => row.name);
        expect(names.indexOf('Fetch titles for pasted links')).toBeLessThan(names.indexOf('Clean pasted links'));
    });

    it('offers source and custom image filename formats', () => {
        const row = controlRows(tab).find(candidate => candidate.control.key === 'imageNameFormat');
        expect(row?.control.type).toBe('dropdown');
        if (row?.control.type !== 'dropdown') throw new Error('File names is not a dropdown');
        expect(row.control.options).toEqual({ source: 'Name from source', custom: 'Custom format' });
    });

    it('offers quotes and dashes as plain toggles', () => {
        const quotesRow = controlRows(tab).find(candidate => candidate.control.key === 'textQuotes');
        const dashesRow = controlRows(tab).find(candidate => candidate.control.key === 'textDashes');
        expect(quotesRow?.control.type).toBe('toggle');
        expect(dashesRow?.control.type).toBe('toggle');
    });

    it('shows an example for each character cleanup setting', () => {
        const rows = flatten(tab.getSettingDefinitions()).filter(row => ['Invisible characters', 'Quotes', 'Dashes'].includes(row.name));

        expect(rows).toHaveLength(3);
        for (const row of rows) {
            expect(typeof row.desc).toBe('string');
            if (typeof row.desc !== 'string') throw new Error(`${row.name} has no text fallback`);
            expect(row.desc).toContain('\u2192');
        }

        const invisible = rows.find(row => row.name === 'Invisible characters');
        expect(invisible?.desc).toContain('U+00A0');
        expect(invisible?.desc).toContain('U+200B');
    });

    it('puts the detail on sub-pages, declared so search can still reach it', () => {
        const found = pages(tab.getSettingDefinitions());
        expect(found.map(page => page.name)).toEqual(['Link removals']);
        // `items` keeps a page in the searchable tree; the imperative `page` form does not
        for (const page of found) {
            expect(page.items, `"${page.name}" has no items`).toBeDefined();
            expect(page.page, `"${page.name}" uses the imperative form`).toBeUndefined();
        }
    });

    it('shows the user-defined entry count on its sub-page link', () => {
        const found = pages(tab.getSettingDefinitions());
        const removals = found.find(page => page.name === 'Link removals');

        expect(typeof removals?.displayValue === 'function' ? removals.displayValue() : removals?.displayValue).toMatch(/^\d+ entries$/);
    });

    it('gives every master toggle search terms for what it hides', () => {
        // A rule that is off hides its own settings, and a hidden row is dropped from search
        const masters = ['imageEnabled', 'linkEnabled', 'textInvisible'];
        for (const key of masters) {
            const row = controlRows(tab).find(candidate => candidate.control.key === key);
            expect(row?.aliases?.length, `"${key}" has no aliases`).toBeGreaterThan(0);
        }
    });
});

describe('settings values', () => {
    let plugin: ReturnType<typeof fakePlugin>;
    let tab: BetterPasteSettingTab;

    beforeEach(() => {
        plugin = fakePlugin();
        tab = makeTab(plugin);
    });

    it('describes the built-in removals separately from the user list', () => {
        const builtIn = flatten(tab.getSettingDefinitions()).find(row => row.name === 'Built-in removals');
        expect(builtIn?.desc).toBe(
            'Updated August 17, 2026. Global tracking filters: 75. Site-specific rules: 18. Cryptographically signed links stay unchanged.'
        );
        expect(tab.getControlValue('linkRemovals.text')).toBe('');
    });

    it('opens the public built-in removal list', () => {
        const builtIn = flatten(tab.getSettingDefinitions()).find(row => row.name === 'Built-in removals');
        let buttonText = '';
        let click: (() => void) | undefined;
        const button = {
            setButtonText(value: string) {
                buttonText = value;
                return button;
            },
            onClick(handler: () => void) {
                click = handler;
                return button;
            }
        };
        const setting = {
            addButton(configure: (value: typeof button) => void) {
                configure(button);
                return setting;
            }
        };
        const open = vi.fn();
        vi.stubGlobal('window', { open });

        builtIn?.render?.(setting as unknown as Setting);
        click?.();

        expect(buttonText).toBe('View list');
        expect(open).toHaveBeenCalledWith(BUILT_IN_LINK_REMOVALS_URL);
        vi.unstubAllGlobals();
    });

    it('stores user-defined removals without copying the built-in list', async () => {
        await tab.setControlValue('linkRemovals.text', 'fbclid\nmine.example | source, ref');
        expect(plugin.settings.linkRemovals).toEqual(['fbclid', 'mine.example | source, ref']);
        expect(tab.getControlValue('linkRemovals.text')).toBe('fbclid\nmine.example | source, ref');
        expect(plugin.saveCount()).toBe(1);
    });

    it('hands contribution text to the localized website in the URL fragment', () => {
        const contribution = new URL(
            linkRemovalContributionUrl(['fbclid', 'mine.example | source, ref', '!youtube.com'], '1.2.3', 'pt-BR')
        );
        const fragment = new URLSearchParams(contribution.hash.slice(1));

        expect(contribution.pathname).toBe('/pt-br/contribute/');
        expect(contribution.search).toBe('');
        expect(fragment.get('rules')).toBe('fbclid\nmine.example | source, ref');
        expect(fragment.get('version')).toBe('1.2.3');
    });

    it('does not rebuild the settings page while a removal is being typed', async () => {
        const before = (tab as unknown as { updateCount: number }).updateCount;

        await tab.setControlValue('linkRemovals.text', 'mine.example | source');

        expect((tab as unknown as { updateCount: number }).updateCount).toBe(before);
    });

    it('describes and validates global and site-specific removals', () => {
        const row = controlRows(tab).find(candidate => candidate.control.key === 'linkRemovals.text');
        const validate = row?.control.validate as ((value: string) => string | void) | undefined;
        expect(row?.desc).toContain('"fbclid" removes the fbclid parameter wherever it appears.\n\n');
        expect(row?.desc).toContain('This removes source and ref from example.com and its subdomains, while every other parameter stays.');
        expect(row?.control.type === 'textarea' ? row.control.placeholder : undefined).toBe('fbclid\nexample.com | source, ref');
        expect(validate?.('fbclid')).toBeUndefined();
        expect(validate?.('example.com | source')).toBeUndefined();
        expect(validate?.('youtube,com | si')).toContain('youtube,com');
        expect(validate?.('two parameter names')).toContain('two parameter names');
    });
});

describe('dependent settings', () => {
    function rowFor(key: string, settings: Partial<BetterPasteSettings> = {}) {
        return controlRows(makeTab(fakePlugin(settings))).find(row => row.control.key === key);
    }

    function pageFor(name: string, settings: Partial<BetterPasteSettings> = {}) {
        return pages(makeTab(fakePlugin(settings)).getSettingDefinitions()).find(page => page.name === name);
    }

    it('hides the image detail when the rule is off', () => {
        expect(isVisible(rowFor('imageNameFormat', { imageEnabled: false }))).toBe(false);
        expect(isVisible(rowFor('imageNameFormat', { imageEnabled: true }))).toBe(true);
    });

    it('shows the custom filename row only for the custom format', () => {
        const customRow = (settings: Partial<BetterPasteSettings>) =>
            flatten(makeTab(fakePlugin(settings)).getSettingDefinitions()).find(row => row.name === 'Custom format');

        expect(isVisible(customRow({ imageNameFormat: 'source' }))).toBe(false);
        expect(isVisible(customRow({ imageNameFormat: 'custom' }))).toBe(true);
        expect(isVisible(customRow({ imageNameFormat: 'custom', imageEnabled: false }))).toBe(false);
    });

    it('hides the link detail when the rule is off', () => {
        expect(isVisible(pageFor('Link removals', { linkEnabled: false }))).toBe(false);
        expect(isVisible(pageFor('Link removals', { linkEnabled: true }))).toBe(true);
    });

    it('keeps the quote and dash choices independent of invisible characters', () => {
        expect(isVisible(rowFor('textQuotes', { textInvisible: false }))).toBeUndefined();
        expect(isVisible(rowFor('textDashes', { textInvisible: false }))).toBeUndefined();
    });

    it('re-evaluates dependent settings after a change', async () => {
        const tab = makeTab(fakePlugin());
        const before = (tab as unknown as { refreshCount: number }).refreshCount;
        await tab.setControlValue('imageEnabled', false);
        expect((tab as unknown as { refreshCount: number }).refreshCount).toBe(before + 1);
    });
});
