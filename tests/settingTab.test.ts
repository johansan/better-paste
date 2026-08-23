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

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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
import { TextSnippetModal, TITLED_LINK_SAMPLE } from '../src/settings/TextSnippetModal';
import { linkRemovalContributionUrl } from '../src/settings/pages/linksPage';
import { BUILT_IN_LINK_REMOVALS_URL } from '../src/urls';

/**
 * Settings the tab deliberately has no row for, because they are state the plugin keeps
 * rather than a choice the user makes.
 */
const STORED_STATE_KEYS = ['lastShownVersion', 'imageLastSize', 'imageLastClass', 'pdfLastFurniture', 'pdfLastSingleParagraph'];

/** Settings owned by a custom-rendered row rather than a declarative control. */
const CUSTOM_RENDER_SETTING_KEYS = [
    'fileMode',
    'imageMode',
    'imageNameTemplate',
    'imageSizeChoice',
    'imageSizeOptions',
    'imageClassChoice',
    'imageClassOptions',
    'textSnippets',
    'urlSnippets'
];

/** Minimal plugin double exposing only what the setting tab touches. */
function fakePlugin(overrides: Partial<BetterPasteSettings> = {}) {
    const settings: BetterPasteSettings = { ...DEFAULT_SETTINGS, ...overrides };
    const domEvents: { element: unknown; type: string; callback: (event: MouseEvent) => void }[] = [];
    let saves = 0;
    return {
        settings,
        manifest: { version: '1.0.0' },
        showWhatsNew: () => undefined,
        registerDomEvent: (element: unknown, type: string, callback: (event: MouseEvent) => void) => {
            domEvents.push({ element, type, callback });
        },
        saveSettings: async () => {
            saves += 1;
        },
        domEvents: () => domEvents,
        saveCount: () => saves
    };
}

class MainWindowElement {
    readonly dataset: Record<string, string> = {};

    constructor(private readonly closestMatch: MainWindowElement | null) {}

    closest(selector: string): MainWindowElement | null {
        return selector === '.better-paste-snippet-edit-button' ? this.closestMatch : null;
    }
}

function makeTab(plugin: ReturnType<typeof fakePlugin>): BetterPasteSettingTab {
    const tab = new BetterPasteSettingTab({} as App, plugin as unknown as BetterPastePlugin);
    (tab as unknown as { containerEl: { ownerDocument: Document } }).containerEl = {
        ownerDocument: documentTarget as unknown as Document
    };
    return tab;
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

interface PreviewElementOptions {
    cls?: string | string[];
    text?: string;
    attr?: Record<string, string>;
}

/** DOM subset used by the custom snippet preview renderer. */
class PreviewElement {
    readonly classes = new Set<string>();
    readonly children: PreviewElement[] = [];
    readonly listeners = new Map<string, () => void>();
    readonly attrs: Record<string, string> = {};
    ownerDocument: unknown = documentTarget;
    value = '';
    text = '';
    private windowMigrationListener: (() => void) | null = null;
    private parent: PreviewElement | null = null;

    constructor(
        readonly tagName = 'div',
        options: PreviewElementOptions = {}
    ) {
        if (options.cls) this.addClass(...(Array.isArray(options.cls) ? options.cls : [options.cls]));
        if (options.text) this.text = options.text;
        if (options.attr) this.setAttrs(options.attr);
    }

    addClass(...classes: string[]): void {
        for (const cls of classes) this.classes.add(cls);
    }

    removeClass(...classes: string[]): void {
        for (const cls of classes) this.classes.delete(cls);
    }

    createDiv(options: PreviewElementOptions = {}): PreviewElement {
        return this.append(new PreviewElement('div', options));
    }

    createSpan(options: PreviewElementOptions = {}): PreviewElement {
        return this.append(new PreviewElement('span', options));
    }

    createEl(tagName: string, options: PreviewElementOptions = {}): PreviewElement {
        return this.append(new PreviewElement(tagName, options));
    }

    appendText(text: string): void {
        this.text += text;
    }

    setAttrs(attrs: Record<string, string>): void {
        Object.assign(this.attrs, attrs);
    }

    setText(text: string): void {
        this.text = text;
    }

    addEventListener(event: string, listener: () => void): void {
        this.listeners.set(event, listener);
    }

    onWindowMigrated(listener: () => void): () => void {
        this.windowMigrationListener = listener;
        return () => {
            this.windowMigrationListener = null;
        };
    }

    migrateTo(ownerDocument: unknown): void {
        this.ownerDocument = ownerDocument;
        this.windowMigrationListener?.();
    }

    querySelector(selector: string): PreviewElement | null {
        return this.querySelectorAll(selector)[0] ?? null;
    }

    querySelectorAll(selector: string): PreviewElement[] {
        const descendants = this.descendants();
        if (selector === '.better-paste-preview textarea') {
            return descendants.filter(element => element.tagName === 'textarea' && element.hasAncestorClass('better-paste-preview'));
        }
        if (selector === '.better-paste-preview input') {
            return descendants.filter(element => element.tagName === 'input' && element.hasAncestorClass('better-paste-preview'));
        }
        if (selector.startsWith('.')) {
            const cls = selector.slice(1);
            return descendants.filter(element => element.classes.has(cls));
        }
        return descendants.filter(element => element.tagName === selector);
    }

    remove(): void {
        if (!this.parent) return;
        const index = this.parent.children.indexOf(this);
        if (index >= 0) this.parent.children.splice(index, 1);
        this.parent = null;
    }

    private append(element: PreviewElement): PreviewElement {
        element.parent = this;
        this.children.push(element);
        return element;
    }

    private descendants(): PreviewElement[] {
        return this.children.flatMap(child => [child, ...child.descendants()]);
    }

    private hasAncestorClass(cls: string): boolean {
        for (let current = this.parent; current; current = current.parent) {
            if (current.classes.has(cls)) return true;
        }
        return false;
    }
}

const documentTarget = { defaultView: { Element: MainWindowElement } };

function renderSnippetTools(tab: BetterPasteSettingTab, ownerDocument: unknown): PreviewElement {
    const snippets = pages(tab.getSettingDefinitions()).find(page => page.name === 'Text snippets');
    const preview = flatten([...(snippets?.items ?? [])]).find(row => row.name === 'Try it');
    const settingEl = new PreviewElement();
    settingEl.ownerDocument = ownerDocument;
    preview?.render?.({ settingEl } as unknown as Setting);
    return settingEl;
}

beforeEach(() => {
    vi.stubGlobal('document', documentTarget);
});

afterEach(() => {
    vi.unstubAllGlobals();
});

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
        expect(rows.slice(-4).map(row => row.name)).toEqual([
            "What's new in Better Paste 1.0.0",
            'Show release notes after updating',
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
            'Attachments',
            'Links',
            'Text processing',
            'Custom processing',
            'Structure',
            'About'
        ]);
    });

    it('puts the note property under the master toggle and the width property under Attachments', () => {
        const groups = tab
            .getSettingDefinitions()
            .filter((item): item is SettingDefinitionGroup => 'type' in item && item.type === 'group');
        const top = groups.find(group => group.heading === undefined);
        const images = groups.find(group => group.heading === 'Attachments');

        const topNames = flatten([...(top?.items ?? [])]).map(row => row.name);
        expect(topNames).toEqual(['Clean up every paste', 'Note property']);

        const imageNames = flatten([...(images?.items ?? [])]).map(row => row.name);
        expect(imageNames.slice(0, 2)).toEqual(['Web images', 'Pasted files']);
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

    it('renders the filename format as a single field', () => {
        const rows = flatten(tab.getSettingDefinitions()).filter(candidate => candidate.name === 'File names');
        expect(rows).toHaveLength(1);
        expect(rows[0].render).toBeDefined();
    });

    it('offers quotes and dashes as plain toggles', () => {
        const quotesRow = controlRows(tab).find(candidate => candidate.control.key === 'textQuotes');
        const dashesRow = controlRows(tab).find(candidate => candidate.control.key === 'textDashes');
        expect(quotesRow?.control.type).toBe('toggle');
        expect(dashesRow?.control.type).toBe('toggle');
    });

    it('shows the unchanged paste example while the pasted files mode is off', () => {
        const row = flatten(tab.getSettingDefinitions()).find(candidate => candidate.name === 'Pasted files');

        expect(row?.desc).toContain('![[Document.pdf]] → ![[Document.pdf]]');
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
        expect(found.map(page => page.name)).toEqual(['Size and style', 'Link snippets', 'Link removals', 'Text snippets']);
        // `items` keeps a page in the searchable tree; the imperative `page` form does not
        for (const page of found) {
            expect(page.items, `"${page.name}" has no items`).toBeDefined();
            expect(page.page, `"${page.name}" uses the imperative form`).toBeUndefined();
        }
    });

    it('shows image handling after the text and structure transforms', () => {
        const pipeline = flatten(tab.getSettingDefinitions()).find(row => row.name === 'Apply custom regex snippets to text');
        const settingEl = new PreviewElement();
        pipeline?.render?.({ settingEl } as unknown as Setting);

        expect(settingEl.querySelectorAll('.better-paste-pipeline-step').map(step => step.text)).toEqual([
            'Pasted text',
            'Links',
            'Text processing',
            'Custom processing',
            'Structure',
            'Attachments',
            'Note'
        ]);
    });

    it('shows the user-defined entry count on its sub-page link', () => {
        const found = pages(tab.getSettingDefinitions());
        const removals = found.find(page => page.name === 'Link removals');

        expect(typeof removals?.displayValue === 'function' ? removals.displayValue() : removals?.displayValue).toMatch(/^\d+ entries$/);
    });

    it('summarizes the size and style picks on the landing row', () => {
        const summary = (settings: Partial<BetterPasteSettings>) => {
            const page = pages(makeTab(fakePlugin(settings)).getSettingDefinitions()).find(
                candidate => candidate.name === 'Size and style'
            );
            return typeof page?.displayValue === 'function' ? page.displayValue() : page?.displayValue;
        };

        expect(summary({})).toBe('Do nothing');
        expect(summary({ imageSizeChoice: '400' })).toBe('Size: 400');
        expect(summary({ imageSizeChoice: '400', imageClassOptions: 'invert', imageClassChoice: 'invert' })).toBe(
            'Size: 400, Style: invert'
        );
        expect(summary({ imageSizeChoice: 'ask' })).toBe('Size: Ask');
        // A stored choice that left the options list, and ask with nothing to offer, read as none
        expect(summary({ imageSizeChoice: '999' })).toBe('Do nothing');
        expect(summary({ imageClassOptions: '', imageClassChoice: 'ask' })).toBe('Do nothing');
    });

    it('gives every master control search terms for what it hides', () => {
        // A rule that is off hides its own settings, and a hidden row is dropped from search
        const masters = ['linkEnabled', 'textInvisible'];
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
            'Updated August 23, 2026. Global tracking filters: 76. Site-specific rules: 18. Cryptographically signed links stay unchanged.'
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

    it('bridges stable snippet toggle keys to the matching list entry', async () => {
        plugin.settings.textSnippets = [
            { id: 'first', name: 'First', rules: ['s/a/b/g'], enabled: true },
            { id: 'second', name: 'Second', rules: ['s/b/c/g'], enabled: false }
        ];

        expect(tab.getControlValue('textSnippet:second')).toBe(false);
        await tab.setControlValue('textSnippet:second', true);

        expect(plugin.settings.textSnippets.map(snippet => snippet.enabled)).toEqual([true, true]);
        expect(plugin.saveCount()).toBe(1);
        expect((tab as unknown as { updateCount: number }).updateCount).toBe(1);
    });

    it('bridges snippet toggle keys to the URL snippet list too', async () => {
        plugin.settings.textSnippets = [{ id: 'text', name: 'Text', rules: ['s/a/b/g'], enabled: true }];
        plugin.settings.urlSnippets = [{ id: 'link', name: 'Link', rules: ['s/c/d/g'], enabled: false }];

        expect(tab.getControlValue('textSnippet:link')).toBe(false);
        await tab.setControlValue('textSnippet:link', true);

        expect(plugin.settings.urlSnippets[0]?.enabled).toBe(true);
        expect(plugin.settings.textSnippets[0]?.enabled).toBe(true);
        expect(plugin.saveCount()).toBe(1);
    });

    it('uses snippet ids as row keys when displayed names match', () => {
        plugin.settings.textSnippets = [
            { id: 'first', name: 'Same name', rules: ['s/a/b/g'], enabled: true },
            { id: 'second', name: 'Same name', rules: ['s/b/c/g'], enabled: false }
        ];

        const rows = controlRows(tab).filter(row => row.name === 'Same name');

        expect(rows.map(row => row.control.key)).toEqual(['textSnippet:first', 'textSnippet:second']);
    });

    it('puts delegated edit metadata in the snippet description fragment', () => {
        vi.stubGlobal('createFragment', (build: (fragment: PreviewElement) => void) => {
            const fragment = new PreviewElement('fragment');
            build(fragment);
            return fragment;
        });
        plugin.settings.textSnippets = [{ id: 'replace', name: 'Replace', rules: ['s/a/b/g'], enabled: true }];

        try {
            const row = controlRows(tab).find(candidate => candidate.name === 'Replace');
            const description = row?.desc as unknown as PreviewElement;
            const edit = description.querySelector('.better-paste-snippet-edit-button');

            expect(description.text).toBe('1 rule ');
            expect(edit?.tagName).toBe('button');
            expect(edit?.attrs).toEqual({ type: 'button', 'data-snippet-id': 'replace' });
            expect(edit?.listeners.has('click')).toBe(false);
        } finally {
            vi.unstubAllGlobals();
        }
    });

    it('delegates snippet edit clicks once and resolves the live snippet', () => {
        plugin.settings.textSnippets = [{ id: 'replace', name: 'Old name', rules: ['s/a/b/g'], enabled: true }];
        renderSnippetTools(tab, documentTarget);
        renderSnippetTools(tab, documentTarget);

        const registrations = plugin.domEvents();
        expect(registrations).toHaveLength(1);
        expect(registrations[0]?.element).toBe(documentTarget);
        expect(registrations[0]?.type).toBe('click');

        plugin.settings.textSnippets = [{ id: 'replace', name: 'Current name', rules: ['s/c/d/g'], enabled: false }];
        const button = new MainWindowElement(null);
        button.dataset.snippetId = 'replace';
        const target = new MainWindowElement(button);
        const preventDefault = vi.fn();
        const stopPropagation = vi.fn();
        const event = {
            target,
            preventDefault,
            stopPropagation
        } as unknown as MouseEvent;
        const open = vi.spyOn(TextSnippetModal.prototype, 'open');

        try {
            registrations[0]?.callback(event);

            expect(preventDefault).toHaveBeenCalledOnce();
            expect(stopPropagation).toHaveBeenCalledOnce();
            expect(open).toHaveBeenCalledOnce();
            const openedModal: unknown = open.mock.instances[0];
            expect((openedModal as { snippet: { name: string } }).snippet.name).toBe('Current name');
        } finally {
            open.mockRestore();
        }
    });

    it('registers edit delegation in every document where the tab renders', () => {
        class PopoutElement {
            readonly dataset: Record<string, string> = {};

            constructor(private readonly closestMatch: PopoutElement | null) {}

            closest(selector: string): PopoutElement | null {
                return selector === '.better-paste-snippet-edit-button' ? this.closestMatch : null;
            }
        }

        const popoutDocument = { defaultView: { Element: PopoutElement } };
        plugin.settings.textSnippets = [{ id: 'popout', name: 'Popout snippet', rules: ['s/a/b/g'], enabled: true }];
        const migratedTools = renderSnippetTools(tab, documentTarget);
        migratedTools.migrateTo(popoutDocument);
        renderSnippetTools(tab, popoutDocument);

        const registrations = plugin.domEvents();
        expect(registrations.map(registration => registration.element)).toEqual([documentTarget, popoutDocument]);

        const button = new PopoutElement(null);
        button.dataset.snippetId = 'popout';
        const event = {
            target: new PopoutElement(button),
            preventDefault: vi.fn(),
            stopPropagation: vi.fn()
        } as unknown as MouseEvent;
        const open = vi.spyOn(TextSnippetModal.prototype, 'open');

        try {
            registrations[1]?.callback(event);
            expect(open).toHaveBeenCalledOnce();
        } finally {
            open.mockRestore();
        }
    });

    it('keeps pasted snippet rules verbatim and fills only an empty name', () => {
        const pasted = ['# Remove citations', '', '# Keep this comment', 's/a/b/g', '', '// Keep this too'].join('\n');
        const modal = new TextSnippetModal({} as App, null, false, async () => undefined);
        const nameInput = { setValue: vi.fn() };
        const editable = modal as unknown as {
            nameInput: typeof nameInput;
            snippet: { name: string; rules: string[] };
            updateRules: (value: string) => void;
        };
        editable.nameInput = nameInput;

        editable.updateRules(pasted);

        expect(editable.snippet).toMatchObject({ name: 'Remove citations', rules: pasted.split('\n') });
        expect(nameInput.setValue).toHaveBeenCalledWith('Remove citations');

        editable.snippet.name = 'My name';
        editable.updateRules('# Different name\ns/c/d/g');
        expect(editable.snippet).toMatchObject({ name: 'My name', rules: ['# Different name', 's/c/d/g'] });
        expect(nameInput.setValue).toHaveBeenCalledTimes(1);
    });

    it('shows enabled snippet counts and invalid rules on the page link', () => {
        plugin.settings.textSnippets = [
            { id: 'valid', name: 'Valid', rules: ['s/a/b/g'], enabled: true },
            { id: 'invalid', name: 'Invalid', rules: ['not a rule'], enabled: false }
        ];
        const snippets = pages(tab.getSettingDefinitions()).find(page => page.name === 'Text snippets');

        expect(typeof snippets?.displayValue === 'function' ? snippets.displayValue() : snippets?.displayValue).toBe('1 enabled snippet');
        expect(typeof snippets?.status === 'function' ? snippets.status() : snippets?.status).toBe('warning');
    });

    it('replaces the snippet preview and preserves its sample when the row renders again', () => {
        plugin.settings.textSnippets = [{ id: 'replace', name: 'Replace', rules: ['s/a/b/g'], enabled: true }];
        const snippets = pages(tab.getSettingDefinitions()).find(page => page.name === 'Text snippets');
        const preview = flatten([...(snippets?.items ?? [])]).find(row => row.name === 'Try it');
        const settingEl = new PreviewElement();
        const setting = { settingEl };

        preview?.render?.(setting as unknown as Setting);
        const input = settingEl.querySelector('.better-paste-preview textarea');
        if (!input) throw new Error('The snippet preview has no textarea');
        input.value = 'a';

        preview?.render?.(setting as unknown as Setting);

        expect(settingEl.querySelectorAll('.better-paste-preview')).toHaveLength(1);
        expect(settingEl.querySelector('.better-paste-preview textarea')?.value).toBe('a');
        expect(settingEl.querySelector('.better-paste-preview-output')?.text).toBe('b');
    });

    it('runs the URL snippet tester through the destination-protecting composer', () => {
        plugin.settings.urlSnippets = [
            { id: 'gh', name: 'GitHub', rules: ['s/GitHub - //'], enabled: true },
            { id: 'bad', name: 'Bad', rules: ['s/https:/http:/'], enabled: false }
        ];
        const page = pages(tab.getSettingDefinitions()).find(candidate => candidate.name === 'Link snippets');
        const preview = flatten([...(page?.items ?? [])]).find(row => row.name === 'Try it');
        const settingEl = new PreviewElement();
        preview?.render?.({ settingEl } as unknown as Setting);
        const input = settingEl.querySelector('.better-paste-preview input');
        const output = settingEl.querySelector('.better-paste-preview-output');
        if (!input || !output) throw new Error('The URL snippet tester is incomplete');

        // Starts empty with the sample as a placeholder, so nothing is prefilled
        expect(input.value).toBe('');
        expect(input.attrs.placeholder).toContain('noisetorch');

        input.value = TITLED_LINK_SAMPLE;
        input.listeners.get('input')?.();
        expect(output.text).toBe(
            '[noisetorch/NoiseTorch: Real-time microphone noise suppression on Linux. · GitHub](https://github.com/noisetorch/NoiseTorch)'
        );

        // A snippet that rewrites the destination falls back to the unmodified titled link
        const bad = plugin.settings.urlSnippets[1];
        if (bad) bad.enabled = true;
        input.listeners.get('input')?.();
        expect(output.text).toBe(input.value);
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

    it('keeps the naming and style rows independent of the web saving toggle', () => {
        const rowNamed = (name: string, settings: Partial<BetterPasteSettings>) =>
            flatten(makeTab(fakePlugin(settings)).getSettingDefinitions()).find(row => row.name === name);

        // The template and decoration also reach clipboard images, so they never hide
        expect(isVisible(rowNamed('File names', { imageMode: 'off' }))).toBeUndefined();
        expect(isVisible(rowNamed('Apply size on paste', { imageMode: 'off' }))).toBeUndefined();
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
        await tab.setControlValue('linkEnabled', false);
        expect((tab as unknown as { refreshCount: number }).refreshCount).toBe(before + 1);
    });
});
