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
import { diffDomainRules, renderDomainRules } from '../transforms/urlCleanup';
import { LIST_KEY_SUFFIX, SETTINGS_CLASS, toggle } from './pages/context';
import type { SettingsPageContext } from './pages/context';
import { createImageLandingDefinitions } from './pages/imagesPage';
import { createLinkLandingDefinitions } from './pages/linksPage';
import { createTerminalLandingDefinitions } from './pages/terminalPage';
import { createAiTextLandingDefinitions } from './pages/aiTextPage';
import { createStartDefinitions } from './pages/startPage';

/**
 * Settings stored as a list of lines but edited as one text field. The control key carries
 * a suffix so the tab knows to convert between the two forms.
 */
const LIST_KEYS = ['urlDomainRules'] as const;
type ListSettingKey = (typeof LIST_KEYS)[number];

function isListControlKey(key: string): boolean {
    if (!key.endsWith(LIST_KEY_SUFFIX)) return false;
    return (LIST_KEYS as readonly string[]).includes(key.slice(0, -LIST_KEY_SUFFIX.length));
}

function listKeyOf(controlKey: string): ListSettingKey {
    return controlKey.slice(0, -LIST_KEY_SUFFIX.length) as ListSettingKey;
}

/**
 * Keys whose value is surfaced on a sub-page link and must change while that page stays
 * visible. A `displayValue` is only recomputed by `update()`; `refreshDomState` only changes
 * visibility. Textarea values are omitted because rebuilding while typing loses the caret.
 */
const SUMMARY_KEYS = new Set(['terminalRejoinMode']);

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
            showWhatsNew: () => this.plugin.showWhatsNew()
        };
    }

    getSettingDefinitions(): SettingDefinitionItem[] {
        const context = this.context;

        return [
            { type: 'group', cls: SETTINGS_CLASS, items: createStartDefinitions(context) },
            {
                type: 'group',
                cls: SETTINGS_CLASS,
                heading: 'Behavior',
                items: [
                    toggle(
                        'interceptPaste',
                        'Clean up every paste',
                        'Apply the rules on every paste. Turn this off to use the commands only. A single note can opt out with the "better-paste: false" property.',
                        ['automatic', 'enable', 'disable', 'note', 'exclude', 'property', 'frontmatter', 'opt out']
                    ),
                    toggle(
                        'trimPaste',
                        'Trim space around the paste',
                        'Removes blank lines and spaces at the start and end of pasted text.',
                        ['whitespace', 'blank', 'space', 'newline', 'trim']
                    ),
                    toggle(
                        'showNotices',
                        'Show a notice when a paste is changed',
                        'A one-line summary of what was cleaned up. Failures are always reported, whatever this is set to.'
                    )
                ]
            },
            { type: 'group', cls: SETTINGS_CLASS, heading: 'Images', items: createImageLandingDefinitions(context) },
            { type: 'group', cls: SETTINGS_CLASS, heading: 'Links', items: createLinkLandingDefinitions(context) },
            { type: 'group', cls: SETTINGS_CLASS, heading: 'Terminal text', items: createTerminalLandingDefinitions(context) },
            { type: 'group', cls: SETTINGS_CLASS, heading: 'AI cleanup', items: createAiTextLandingDefinitions(context) }
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
            this.afterChange(key);
            return;
        }

        // Trim here as well as on load, so the field does not show a value that the next
        // restart will silently change
        if (key === 'imageSizeProperty' && typeof value === 'string') {
            await super.setControlValue(key, value.trim());
        } else {
            await super.setControlValue(key, value);
        }

        this.afterChange(key);
    }

    /**
     * Re-evaluates whatever the change could have invalidated. Visibility predicates only
     * need the cheap DOM pass; a summary shown on a page link needs a full rebuild.
     */
    private afterChange(key: string): void {
        if (SUMMARY_KEYS.has(key)) this.update();
        else this.refreshDomState();
    }
}
