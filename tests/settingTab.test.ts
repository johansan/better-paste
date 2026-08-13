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
const STORED_STATE_KEYS = ['lastShownVersion'];

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

/** Rows on the landing page itself, not inside any sub-page. */
function landingRows(items: SettingDefinitionItem[]): SettingDefinitionItem[] {
    const rows: SettingDefinitionItem[] = [];
    for (const item of items) {
        if (isContainer(item) && item.type !== 'page') rows.push(...landingRows([...(item.items ?? [])]));
        else rows.push(item);
    }
    return rows;
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

    it('every setting has a control somewhere in the tree', () => {
        const covered = new Set(
            controlRows(tab).map(row => {
                const key = row.control.key;
                return key.endsWith('.text') ? key.slice(0, -'.text'.length) : key;
            })
        );
        const uncovered = Object.keys(DEFAULT_SETTINGS).filter(key => !covered.has(key) && !STORED_STATE_KEYS.includes(key));
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

    it('puts the release notes and support rows above the rules', () => {
        const rows = flatten(tab.getSettingDefinitions());
        expect(rows.slice(0, 2).map(row => row.name)).toEqual(["What's new in Better Paste 1.0.0", 'Support development']);
    });

    it('groups every rule under a heading, leaving only the start rows loose', () => {
        const groups = tab
            .getSettingDefinitions()
            .filter((item): item is SettingDefinitionGroup => 'type' in item && item.type === 'group');

        expect(groups.map(group => group.heading)).toEqual([undefined, 'Behavior', 'Images', 'Links', 'Terminal text', 'AI cleanup']);
    });

    it('keeps the landing page short', () => {
        // The point of the sub-pages is that the first screen stays scannable
        expect(landingRows(tab.getSettingDefinitions()).length).toBeLessThanOrEqual(15);
    });

    it('puts the detail on sub-pages, declared so search can still reach it', () => {
        const found = pages(tab.getSettingDefinitions());
        expect(found.map(page => page.name)).toEqual(['Image handling', 'Rules for preserving parameters', 'Terminal text handling']);
        // `items` keeps a page in the searchable tree; the imperative `page` form does not
        for (const page of found) {
            expect(page.items, `"${page.name}" has no items`).toBeDefined();
            expect(page.page, `"${page.name}" uses the imperative form`).toBeUndefined();
        }
    });

    it('shows the site count on its sub-page link', () => {
        const found = pages(tab.getSettingDefinitions());
        const sites = found.find(page => page.name === 'Rules for preserving parameters');

        expect(typeof sites?.displayValue === 'function' ? sites.displayValue() : sites?.displayValue).toMatch(/^\d+ sites$/);
    });

    it('gives every master toggle search terms for what it hides', () => {
        // A rule that is off hides its own settings, and a hidden row is dropped from search
        const masters = ['imagesEnabled', 'urlEnabled', 'terminalEnabled', 'aiTextEnabled'];
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
        await tab.setControlValue('terminalRejoinMode', 'any');
        expect(plugin.settings.terminalRejoinMode).toBe('any');
        expect(plugin.saveCount()).toBe(1);
    });

    it('shows every site rule, shipped ones included, so they can be edited', () => {
        const shown = String(tab.getControlValue('urlDomainRules.text')).split('\n');
        expect(shown).toHaveLength(SHIPPED_DOMAIN_RULES.length);
        expect(shown).toContain('youtube.com | v, t, list, index, start');
    });

    it('stores only what the user changed, so later releases can still add rules', async () => {
        const shown = String(tab.getControlValue('urlDomainRules.text'));
        await tab.setControlValue('urlDomainRules.text', `${shown}\nmine.example | id`);
        expect(plugin.settings.urlDomainRules).toEqual(['mine.example | id']);
    });

    it('remembers a rule the user deleted from the field', async () => {
        const kept = String(tab.getControlValue('urlDomainRules.text'))
            .split('\n')
            .filter(line => !line.startsWith('youtube.com'))
            .join('\n');

        await tab.setControlValue('urlDomainRules.text', kept);
        expect(plugin.settings.urlDomainRules).toEqual(['!youtube.com']);
        expect(String(tab.getControlValue('urlDomainRules.text'))).not.toContain('youtube.com |');
    });

    it('keeps specific Google rules when only the generic rule is deleted', async () => {
        const kept = String(tab.getControlValue('urlDomainRules.text'))
            .split('\n')
            .filter(line => !line.startsWith('google.*'))
            .join('\n');

        await tab.setControlValue('urlDomainRules.text', kept);

        const shown = String(tab.getControlValue('urlDomainRules.text'));
        const sites = pages(tab.getSettingDefinitions()).find(page => page.name === 'Rules for preserving parameters');
        const status = typeof sites?.status === 'function' ? sites.status() : sites?.status;
        expect(plugin.settings.urlDomainRules).toEqual(['!google.*']);
        expect(shown.split('\n')).not.toContain('google.* | q, tbm, hl');
        expect(shown).toContain('maps.google.* | q, ll, z');
        expect(shown).toContain('docs.google.*');
        expect(status).toBeNull();
    });

    it('round-trips an unedited list to no stored changes', async () => {
        await tab.setControlValue('urlDomainRules.text', String(tab.getControlValue('urlDomainRules.text')));
        expect(plugin.settings.urlDomainRules).toEqual([]);
    });

    it('does not rebuild the settings page while a site rule is being typed', async () => {
        const shown = String(tab.getControlValue('urlDomainRules.text'));
        const before = (tab as unknown as { updateCount: number }).updateCount;

        await tab.setControlValue('urlDomainRules.text', `${shown}\nmine.example | id`);

        expect((tab as unknown as { updateCount: number }).updateCount).toBe(before);
    });

    it('rejects a site rule that is not a domain', () => {
        const row = controlRows(tab).find(candidate => candidate.control.key === 'urlDomainRules.text');
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
        expect(isVisible(pageFor('Image handling', { imagesEnabled: false }))).toBe(false);
        expect(isVisible(pageFor('Image handling', { imagesEnabled: true }))).toBe(true);
    });

    it('hides the link detail when the rule is off', () => {
        expect(isVisible(rowFor('urlStripMode', { urlEnabled: false }))).toBe(false);
        expect(isVisible(pageFor('Rules for preserving parameters', { urlEnabled: false }))).toBe(false);
    });

    it('hides the terminal page when the rule is off', () => {
        expect(isVisible(pageFor('Terminal text handling', { terminalEnabled: false }))).toBe(false);
        expect(isVisible(pageFor('Terminal text handling', { terminalEnabled: true }))).toBe(true);
    });

    it('hides the punctuation choice when AI cleanup is off', () => {
        expect(isVisible(rowFor('aiTextPlainPunctuation', { aiTextEnabled: false }))).toBe(false);
        expect(isVisible(rowFor('aiTextPlainPunctuation', { aiTextEnabled: true }))).toBe(true);
    });

    it('re-evaluates dependent settings after a change', async () => {
        const tab = makeTab(fakePlugin());
        const before = (tab as unknown as { refreshCount: number }).refreshCount;
        await tab.setControlValue('imagesEnabled', false);
        expect((tab as unknown as { refreshCount: number }).refreshCount).toBe(before + 1);
    });

    it('does not rebuild the terminal tester when its mode changes', async () => {
        const tab = makeTab(fakePlugin());
        const before = (tab as unknown as { updateCount: number }).updateCount;
        await tab.setControlValue('terminalRejoinMode', 'any');
        expect((tab as unknown as { updateCount: number }).updateCount).toBe(before);
    });
});
