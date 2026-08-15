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
import { aliases, strings } from '../i18n';
import { diffDomainRules, renderDomainRules } from '../transforms/urlCleanup';
import { LIST_KEY_SUFFIX, SETTINGS_CLASS, toggle } from './pages/context';
import type { SettingsPageContext } from './pages/context';
import { createImageLandingDefinitions } from './pages/imagesPage';
import { createLinkLandingDefinitions } from './pages/linksPage';
import { createTerminalLandingDefinitions } from './pages/terminalPage';
import { commaPlacementExample, createTextProcessingDefinitions } from './pages/textProcessingPage';
import { createAiTextLandingDefinitions } from './pages/aiTextPage';
import { createStartDefinitions } from './pages/startPage';
import { createFrontmatterDefinitions } from './pages/frontmatterPage';

/**
 * Settings stored as a list of lines but edited as one text field. The control key carries
 * a suffix so the tab knows to convert between the two forms.
 */
const LIST_KEYS = ['linkRules'] as const;
type ListSettingKey = (typeof LIST_KEYS)[number];

function isListControlKey(key: string): boolean {
    if (!key.endsWith(LIST_KEY_SUFFIX)) return false;
    return (LIST_KEYS as readonly string[]).includes(key.slice(0, -LIST_KEY_SUFFIX.length));
}

function listKeyOf(controlKey: string): ListSettingKey {
    return controlKey.slice(0, -LIST_KEY_SUFFIX.length) as ListSettingKey;
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

    constructor(app: App, plugin: BetterPastePlugin) {
        super(app, plugin);
    }

    /** Shared by every page module. Settings are read live so `visible` predicates stay current. */
    private get context(): SettingsPageContext {
        return {
            settings: () => this.plugin.settings,
            version: this.plugin.manifest.version,
            showWhatsNew: () => this.plugin.showWhatsNew(),
            saveSettings: () => this.plugin.saveSettings()
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
                        strings.settings.behavior.autoCleanDesc,
                        aliases(source => source.settings.behavior.autoCleanAliases)
                    )
                ]
            },
            { type: 'group', cls: SETTINGS_CLASS, heading: strings.settings.images.heading, items: createImageLandingDefinitions(context) },
            { type: 'group', cls: SETTINGS_CLASS, heading: strings.settings.links.heading, items: createLinkLandingDefinitions(context) },
            {
                type: 'group',
                cls: SETTINGS_CLASS,
                heading: strings.settings.terminal.heading,
                items: createTerminalLandingDefinitions(context)
            },
            {
                type: 'group',
                cls: SETTINGS_CLASS,
                heading: strings.settings.text.heading,
                items: [...createTextProcessingDefinitions(context), ...createAiTextLandingDefinitions(context)]
            },
            // Below the rules, because these name the per-note properties rather than changing a rule
            { type: 'group', cls: SETTINGS_CLASS, heading: strings.settings.frontmatter.heading, items: createFrontmatterDefinitions() },
            // Last, because release notes, support links and the other plugins are not settings
            { type: 'group', cls: SETTINGS_CLASS, heading: strings.settings.start.heading, items: createStartDefinitions(context) }
        ];
    }

    /**
     * Reads a control's value. List settings are stored as lines but edited as text, so
     * they are joined here; everything else uses the base implementation, which reads
     * straight from `plugin.settings`.
     */
    getControlValue(key: string): unknown {
        if (isListControlKey(key)) return renderDomainRules(this.plugin.settings[listKeyOf(key)]);
        return super.getControlValue(key);
    }

    /** Writes a control's value, splitting the text form of a list setting back into lines. */
    async setControlValue(key: string, value: unknown): Promise<void> {
        if (isListControlKey(key)) {
            this.plugin.settings[listKeyOf(key)] = diffDomainRules(parseLines(typeof value === 'string' ? value : ''));
            await this.plugin.saveSettings();
            this.afterChange();
            return;
        }

        // Trim here as well as on load, so the field does not show a value that the next
        // restart will silently change
        if ((key === 'imageSizeProperty' || key === 'noteProperty') && typeof value === 'string') {
            await super.setControlValue(key, value.trim());
        } else {
            await super.setControlValue(key, value);
        }

        if (key === 'textComma') this.updateCommaExample(value);

        this.afterChange();
    }

    /** Updates the comma example in place so it always reflects the dropdown value. */
    private updateCommaExample(value: unknown): void {
        if (value !== 'none' && value !== 'inside' && value !== 'outside') return;
        const examples = this.containerEl?.querySelectorAll<HTMLElement>('.better-paste-comma-example') ?? [];
        for (const example of examples) example.setText(commaPlacementExample(value));
    }

    /** Re-evaluates visibility without rebuilding controls that hold unsaved tester input. */
    private afterChange(): void {
        this.refreshDomState();
    }
}
