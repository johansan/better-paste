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
import type {
    App,
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
import { SHIPPED_DOMAIN_RULES } from '../src/settings/constants';

/**
 * Settings the tab deliberately has no row for, because they are state the plugin keeps
 * rather than a choice the user makes.
 */
const STORED_STATE_KEYS = ['lastShownVersion', 'imageLastSize', 'imageLastClass'];

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

        expect(groups.map(group => group.heading)).toEqual([
            undefined,
            'Images',
            'Links',
            'Terminal text',
            'Text processing',
            'Frontmatter',
            'About'
        ]);
    });

    it('puts both per-note property names under Frontmatter', () => {
        const groups = tab
            .getSettingDefinitions()
            .filter((item): item is SettingDefinitionGroup => 'type' in item && item.type === 'group');
        const frontmatter = groups.find(group => group.heading === 'Frontmatter');
        const images = groups.find(group => group.heading === 'Images');

        // The two properties are one family, so they are configured together rather than
        // one being a constant and the other buried under Images
        expect(flatten([...(frontmatter?.items ?? [])]).map(row => row.name)).toEqual(['Note property', 'Image width property']);
        expect(flatten([...(images?.items ?? [])]).map(row => row.name)).not.toContain('Image width property');
    });

    it('puts the text preferences under Text processing', () => {
        const groups = tab
            .getSettingDefinitions()
            .filter((item): item is SettingDefinitionGroup => 'type' in item && item.type === 'group');
        const behavior = groups.find(group => group.heading === 'Behavior');
        const textProcessing = groups.find(group => group.heading === 'Text processing');
        const names = flatten([...(textProcessing?.items ?? [])]).map(row => row.name);

        expect(flatten([...(behavior?.items ?? [])]).map(row => row.name)).not.toContain('Trim surrounding whitespace');
        expect(names).toEqual(['Trim surrounding whitespace', 'Invisible characters', 'Quotes', 'Dashes', 'Commas']);
    });

    it('puts title fetching above link cleaning', () => {
        const names = flatten(tab.getSettingDefinitions()).map(row => row.name);
        expect(names.indexOf('Fetch titles for pasted links')).toBeLessThan(names.indexOf('Clean pasted links'));
    });

    it('puts Markdown conversion first in the bullet dropdown', () => {
        const row = controlRows(tab).find(candidate => candidate.control.key === 'terminalBullets');
        expect(row?.control.type).toBe('dropdown');
        if (row?.control.type !== 'dropdown') throw new Error('Bullet characters is not a dropdown');
        expect(Object.keys(row.control.options)[0]).toBe('markdown');
    });

    it('offers source and custom image filename formats', () => {
        const row = controlRows(tab).find(candidate => candidate.control.key === 'imageNameFormat');
        expect(row?.control.type).toBe('dropdown');
        if (row?.control.type !== 'dropdown') throw new Error('File names is not a dropdown');
        expect(row.control.options).toEqual({ source: 'Name from source', custom: 'Custom format' });
    });

    it('offers all comma placement choices', () => {
        const row = controlRows(tab).find(candidate => candidate.control.key === 'textComma');
        expect(row?.control.type).toBe('dropdown');
        if (row?.control.type !== 'dropdown') throw new Error('Commas is not a dropdown');
        expect(row.control.options).toEqual({
            none: 'No change',
            inside: 'Comma inside quotes',
            outside: 'Comma outside quotes'
        });
    });

    it('offers all quote styles', () => {
        const row = controlRows(tab).find(candidate => candidate.control.key === 'textQuotes');
        expect(row?.control.type).toBe('dropdown');
        if (row?.control.type !== 'dropdown') throw new Error('Quotes is not a dropdown');
        expect(row.control.options).toEqual({
            none: 'No change',
            straight: 'Straight quotes',
            curly: 'Curly quotes'
        });
    });

    it('offers all dash styles', () => {
        const row = controlRows(tab).find(candidate => candidate.control.key === 'textDashes');
        expect(row?.control.type).toBe('dropdown');
        if (row?.control.type !== 'dropdown') throw new Error('Dashes is not a dropdown');
        expect(row.control.options).toEqual({
            none: 'No change',
            hyphen: 'Hyphens',
            en: 'En dashes',
            em: 'Em dashes',
            'em-spaced': 'Em dashes with spaces'
        });
    });

    it('updates the comma example for the selected placement', () => {
        const descriptionFor = (placement: BetterPasteSettings['textComma']): string => {
            const row = flatten(makeTab(fakePlugin({ textComma: placement })).getSettingDefinitions()).find(
                candidate => candidate.name === 'Commas'
            );
            if (typeof row?.desc !== 'string') throw new Error('Commas has no text fallback');
            return row.desc;
        };

        const source = 'He called it "finished," then left.';
        expect(descriptionFor('none')).toContain(`${source} \u2192 ${source}`);
        expect(descriptionFor('inside')).toContain(`${source} \u2192 ${source}`);
        expect(descriptionFor('outside')).toContain(`${source} \u2192 He called it "finished", then left.`);
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
        expect(found.map(page => page.name)).toEqual(['Site rules', 'Terminal text handling']);
        // `items` keeps a page in the searchable tree; the imperative `page` form does not
        for (const page of found) {
            expect(page.items, `"${page.name}" has no items`).toBeDefined();
            expect(page.page, `"${page.name}" uses the imperative form`).toBeUndefined();
        }
    });

    it('shows the site count on its sub-page link', () => {
        const found = pages(tab.getSettingDefinitions());
        const sites = found.find(page => page.name === 'Site rules');

        expect(typeof sites?.displayValue === 'function' ? sites.displayValue() : sites?.displayValue).toMatch(/^\d+ sites$/);
    });

    it('gives every master toggle search terms for what it hides', () => {
        // A rule that is off hides its own settings, and a hidden row is dropped from search
        const masters = ['imageEnabled', 'linkEnabled', 'terminalEnabled', 'textInvisible'];
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

    it('writes a plain setting through and persists it', async () => {
        await tab.setControlValue('terminalRejoin', 'any');
        expect(plugin.settings.terminalRejoin).toBe('any');
        expect(plugin.saveCount()).toBe(1);
    });

    it('shows every site rule, shipped ones included, so they can be edited', () => {
        const shown = String(tab.getControlValue('linkRules.text')).split('\n');
        expect(shown).toHaveLength(SHIPPED_DOMAIN_RULES.length);
        expect(shown).toContain('youtube.com | v, t, list, index, start');
    });

    it('stores only what the user changed, so later releases can still add rules', async () => {
        const shown = String(tab.getControlValue('linkRules.text'));
        await tab.setControlValue('linkRules.text', `${shown}\nmine.example | id`);
        expect(plugin.settings.linkRules).toEqual(['mine.example | id']);
    });

    it('remembers a rule the user deleted from the field', async () => {
        const kept = String(tab.getControlValue('linkRules.text'))
            .split('\n')
            .filter(line => !line.startsWith('youtube.com'))
            .join('\n');

        await tab.setControlValue('linkRules.text', kept);
        expect(plugin.settings.linkRules).toEqual(['!youtube.com']);
        expect(String(tab.getControlValue('linkRules.text'))).not.toContain('youtube.com |');
    });

    it('keeps specific Google rules when only the generic rule is deleted', async () => {
        const kept = String(tab.getControlValue('linkRules.text'))
            .split('\n')
            .filter(line => !line.startsWith('google.*'))
            .join('\n');

        await tab.setControlValue('linkRules.text', kept);

        const shown = String(tab.getControlValue('linkRules.text'));
        const sites = pages(tab.getSettingDefinitions()).find(page => page.name === 'Site rules');
        const status = typeof sites?.status === 'function' ? sites.status() : sites?.status;
        expect(plugin.settings.linkRules).toEqual(['!google.*']);
        expect(shown.split('\n')).not.toContain('google.* | q, tbm, hl');
        expect(shown).toContain('maps.google.* | q, ll, z');
        expect(shown).toContain('docs.google.*');
        expect(status).toBeNull();
    });

    it('round-trips an unedited list to no stored changes', async () => {
        await tab.setControlValue('linkRules.text', String(tab.getControlValue('linkRules.text')));
        expect(plugin.settings.linkRules).toEqual([]);
    });

    it('does not rebuild the settings page while a site rule is being typed', async () => {
        const shown = String(tab.getControlValue('linkRules.text'));
        const before = (tab as unknown as { updateCount: number }).updateCount;

        await tab.setControlValue('linkRules.text', `${shown}\nmine.example | id`);

        expect((tab as unknown as { updateCount: number }).updateCount).toBe(before);
    });

    it('rejects a site rule that is not a domain', () => {
        const row = controlRows(tab).find(candidate => candidate.control.key === 'linkRules.text');
        const validate = row?.control.validate as ((value: string) => string | void) | undefined;
        expect(validate?.('example.com: id')).toBeUndefined();
        expect(validate?.('youtube,com: v')).toContain('youtube,com');
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
        expect(isVisible(rowFor('linkStrip', { linkEnabled: false }))).toBe(false);
        expect(isVisible(pageFor('Site rules', { linkEnabled: false }))).toBe(false);
    });

    it('hides the terminal page when the rule is off', () => {
        expect(isVisible(pageFor('Terminal text handling', { terminalEnabled: false }))).toBe(false);
        expect(isVisible(pageFor('Terminal text handling', { terminalEnabled: true }))).toBe(true);
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

    it('updates the rendered comma example after its selection changes', async () => {
        const tab = makeTab(fakePlugin());
        const rendered: string[] = [];
        Object.assign(tab, {
            containerEl: {
                querySelectorAll: () => [{ setText: (value: string) => rendered.push(value) }]
            }
        });

        await tab.setControlValue('textComma', 'outside');
        expect(rendered).toEqual(['He called it "finished," then left. \u2192 He called it "finished", then left.']);
    });

    it('updates the rendered quote and dash examples after their selections change', async () => {
        const tab = makeTab(fakePlugin());
        const rendered: string[] = [];
        Object.assign(tab, {
            containerEl: {
                querySelectorAll: () => [{ setText: (value: string) => rendered.push(value) }]
            }
        });

        await tab.setControlValue('textQuotes', 'curly');
        await tab.setControlValue('textDashes', 'em');
        expect(rendered).toEqual([
            '\u201cFine,\u201d she said. "Don\'t stop." \u2192 \u201cFine,\u201d she said. \u201cDon\u2019t stop.\u201d',
            'The result - against all odds \u2014 was fine. \u2192 The result\u2014against all odds\u2014was fine.'
        ]);
    });

    it('does not rebuild the terminal tester when its mode changes', async () => {
        const tab = makeTab(fakePlugin());
        const before = (tab as unknown as { updateCount: number }).updateCount;
        await tab.setControlValue('terminalRejoin', 'any');
        expect((tab as unknown as { updateCount: number }).updateCount).toBe(before);
    });
});
