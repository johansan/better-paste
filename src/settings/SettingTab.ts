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

import { PluginSettingTab } from 'obsidian';
import type { App, SettingDefinitionItem } from 'obsidian';
import type BetterPastePlugin from '../main';
import { parseLines } from './normalize';
import { DEFAULT_SETTINGS } from './defaults';
import { aliases, format, strings } from '../i18n';
import { DYNAMIC_DESCRIPTION_KEYS, LIST_KEY_SUFFIX, SETTINGS_CLASS, TEXT_SNIPPET_KEY_PREFIX, toggle } from './pages/context';
import type { DynamicDescriptionKey, SettingsPageContext } from './pages/context';
import { createImageLandingDefinitions } from './pages/imagesPage';
import { createLinkLandingDefinitions } from './pages/linksPage';
import { createTextProcessingDefinitions } from './pages/textProcessingPage';
import { createCustomProcessingDefinitions, openSnippetEditor } from './pages/customProcessingPage';
import { createStartDefinitions } from './pages/startPage';

/**
 * Settings stored as a list of lines but edited as one text field. The control key carries
 * a suffix so the tab knows to convert between the two forms.
 */
const LIST_KEYS = ['linkRemovals'] as const;
type ListSettingKey = (typeof LIST_KEYS)[number];

function isListControlKey(key: string): boolean {
    if (!key.endsWith(LIST_KEY_SUFFIX)) return false;
    return (LIST_KEYS as readonly string[]).includes(key.slice(0, -LIST_KEY_SUFFIX.length));
}

function listKeyOf(controlKey: string): ListSettingKey {
    return controlKey.slice(0, -LIST_KEY_SUFFIX.length) as ListSettingKey;
}

function isTextSnippetControlKey(key: string): boolean {
    return key.startsWith(TEXT_SNIPPET_KEY_PREFIX);
}

function textSnippetIdOf(controlKey: string): string {
    return controlKey.slice(TEXT_SNIPPET_KEY_PREFIX.length);
}

function isDynamicDescriptionKey(key: string): key is DynamicDescriptionKey {
    return (DYNAMIC_DESCRIPTION_KEYS as readonly string[]).includes(key);
}

/**
 * The settings tab.
 *
 * This class holds no setting rows of its own. It assembles the landing page from the
 * per-rule page modules and bridges Obsidian's control keys onto the stored settings,
 * which keeps each rule's UI in one small file next to the rule it configures.
 */
export class BetterPasteSettingTab extends PluginSettingTab {
    // PluginSettingTab already stores the plugin it was constructed with, and its default
    // getControlValue reads from it. Declaring rather than redefining the field narrows the
    // type without emitting a class field that would shadow the base's reference.
    declare plugin: BetterPastePlugin;
    private readonly snippetEditListenerDocuments = new WeakSet<Document>();

    constructor(app: App, plugin: BetterPastePlugin) {
        super(app, plugin);
    }

    /** Shared by every page module. Settings are read live so `visible` predicates stay current. */
    private get context(): SettingsPageContext {
        return {
            app: this.app,
            settings: () => this.plugin.settings,
            version: this.plugin.manifest.version,
            showWhatsNew: () => this.plugin.showWhatsNew(),
            saveSettings: () => this.plugin.saveSettings(),
            getControlValue: key => this.getControlValue(key),
            setControlValue: (key, value) => this.setControlValue(key, value),
            update: () => this.update(),
            dynamicDescription: key => this.dynamicDescription(key)
        };
    }

    getSettingDefinitions(): SettingDefinitionItem[] {
        const context = this.context;

        return [
            // No heading, because the settings tab is already named for the plugin
            {
                type: 'group',
                cls: SETTINGS_CLASS,
                items: [
                    toggle(
                        'autoClean',
                        strings.settings.behavior.autoCleanName,
                        this.dynamicDescription('noteProperty'),
                        aliases(source => source.settings.behavior.autoCleanAliases)
                    ),
                    // A setting rather than a constant: the name has to coexist with
                    // whatever the vault already puts in frontmatter, and the plugin
                    // ships as a bundle, so a fixed name would leave no way out. Blank
                    // switches the property off.
                    {
                        name: strings.settings.behavior.notePropertyName,
                        desc: strings.settings.behavior.notePropertyDesc,
                        aliases: aliases(source => source.settings.behavior.notePropertyAliases),
                        control: {
                            type: 'text',
                            key: 'noteProperty',
                            placeholder: DEFAULT_SETTINGS.noteProperty,
                            defaultValue: DEFAULT_SETTINGS.noteProperty
                        }
                    }
                ]
            },
            { type: 'group', cls: SETTINGS_CLASS, heading: strings.settings.images.heading, items: createImageLandingDefinitions(context) },
            { type: 'group', cls: SETTINGS_CLASS, heading: strings.settings.links.heading, items: createLinkLandingDefinitions(context) },
            { type: 'group', cls: SETTINGS_CLASS, heading: strings.settings.text.heading, items: createTextProcessingDefinitions() },
            {
                type: 'group',
                cls: SETTINGS_CLASS,
                heading: strings.settings.custom.heading,
                items: createCustomProcessingDefinitions(context, ownerDocument => this.registerSnippetEditListener(ownerDocument))
            },
            // Last, because release notes, support links and the other plugins are not settings
            { type: 'group', cls: SETTINGS_CLASS, heading: strings.settings.start.heading, items: createStartDefinitions(context) }
        ];
    }

    /** Subsection pages render outside the tab container, so their owning document handles delegated clicks. */
    private registerSnippetEditListener(ownerDocument: Document): void {
        const ownerWindow = ownerDocument.defaultView;
        if (!ownerWindow || this.snippetEditListenerDocuments.has(ownerDocument)) return;
        this.snippetEditListenerDocuments.add(ownerDocument);

        this.plugin.registerDomEvent(ownerDocument, 'click', event => {
            const target = event.target;
            if (!(target instanceof ownerWindow.Element)) return;
            const button = target.closest<HTMLButtonElement>('.better-paste-snippet-edit-button');
            if (!button) return;

            event.preventDefault();
            event.stopPropagation();
            const snippetId = button.dataset.snippetId;
            if (!snippetId) return;
            const snippet = this.plugin.settings.textSnippets.find(candidate => candidate.id === snippetId);
            if (snippet) openSnippetEditor(this.context, snippet);
        });
    }

    /**
     * Reads a control's value. List settings are stored as lines but edited as text, so
     * they are joined here; everything else uses the base implementation, which reads
     * straight from `plugin.settings`.
     */
    getControlValue(key: string): unknown {
        if (isListControlKey(key)) return this.plugin.settings[listKeyOf(key)].join('\n');
        if (isTextSnippetControlKey(key)) {
            return this.plugin.settings.textSnippets.find(snippet => snippet.id === textSnippetIdOf(key))?.enabled ?? false;
        }
        return super.getControlValue(key);
    }

    /** Writes a control's value, splitting the text form of a list setting back into lines. */
    async setControlValue(key: string, value: unknown): Promise<void> {
        if (isListControlKey(key)) {
            this.plugin.settings[listKeyOf(key)] = parseLines(typeof value === 'string' ? value : '');
            await this.plugin.saveSettings();
            this.afterChange();
            return;
        }

        if (isTextSnippetControlKey(key)) {
            const snippet = this.plugin.settings.textSnippets.find(candidate => candidate.id === textSnippetIdOf(key));
            if (!snippet || typeof value !== 'boolean') return;
            snippet.enabled = value;
            await this.plugin.saveSettings();
            this.update();
            return;
        }

        // Trim here as well as on load, so the field does not show a value that the next
        // restart will silently change
        if ((key === 'imageSizeProperty' || key === 'noteProperty') && typeof value === 'string') {
            await super.setControlValue(key, value.trim());
        } else {
            await super.setControlValue(key, value);
        }

        if (isDynamicDescriptionKey(key)) this.updateDynamicDescription(key);

        this.afterChange();
    }

    /**
     * Descriptions that name another setting's current value, keyed by the setting that
     * appears in the text. Each renders into a marked span so it can be rewritten in
     * place when the named setting changes, without rebuilding the row.
     */
    private readonly dynamicDescriptions: Record<DynamicDescriptionKey, { cls: string; text: () => string }> = {
        noteProperty: {
            cls: 'better-paste-autoclean-desc',
            text: () => {
                const property = this.plugin.settings.noteProperty.trim() || DEFAULT_SETTINGS.noteProperty;
                return format(strings.settings.behavior.autoCleanDesc, { property });
            }
        },
        imageSizeProperty: {
            cls: 'better-paste-image-width-desc',
            text: () => {
                const property = this.plugin.settings.imageSizeProperty.trim() || DEFAULT_SETTINGS.imageSizeProperty;
                return format(strings.settings.images.sizePropertyDesc, { property });
            }
        }
    };

    /** The description for the row whose text names `key`'s current value. */
    dynamicDescription(key: DynamicDescriptionKey): string | DocumentFragment {
        const entry = this.dynamicDescriptions[key];
        if (typeof createFragment === 'undefined') return entry.text();
        return createFragment(fragment => {
            fragment.createSpan({ cls: entry.cls, text: entry.text() });
        });
    }

    /** Rewrites a rendered description in place after the setting it names changes. */
    private updateDynamicDescription(key: DynamicDescriptionKey): void {
        const entry = this.dynamicDescriptions[key];
        const spans = this.containerEl?.querySelectorAll<HTMLElement>(`.${entry.cls}`) ?? [];
        for (const span of spans) span.setText(entry.text());
    }

    /** Re-evaluates visibility without rebuilding controls that hold unsaved tester input. */
    private afterChange(): void {
        this.refreshDomState();
    }
}
