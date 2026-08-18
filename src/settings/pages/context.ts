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

import type { App, SettingDefinition } from 'obsidian';
import { DEFAULT_SETTINGS } from '../defaults';
import type { BetterPasteSettings } from '../types';

/**
 * What every page builder receives. Settings are read through a function so that
 * `visible` predicates always see current values rather than a snapshot taken at build
 * time because Obsidian re-evaluates them on each render.
 */
export interface SettingsPageContext {
    app: App;
    settings: () => BetterPasteSettings;
    /** Plugin version, named on the What's new row. */
    version: string;
    /** Opens the What's new dialog, and records the version once it is closed. */
    showWhatsNew: () => void;
    /** Persists a value changed by a custom-rendered setting row. */
    saveSettings: () => Promise<void>;
    /** Reads a declarative control value through the setting tab's storage bridge. */
    getControlValue: (key: string) => unknown;
    /** Writes a declarative control value through the setting tab's storage bridge. */
    setControlValue: (key: string, value: unknown) => Promise<void>;
    /** Rebuilds definitions after a list changes shape or visible text. */
    update: () => void;
    /** Description whose text names `key`'s current value and follows its renames. */
    dynamicDescription: (key: DynamicDescriptionKey) => string | DocumentFragment;
}

/** Settings whose current value is named inside another row's description text. */
export const DYNAMIC_DESCRIPTION_KEYS = ['noteProperty', 'imageSizeProperty'] as const;
export type DynamicDescriptionKey = (typeof DYNAMIC_DESCRIPTION_KEYS)[number];

/** Suffix marking a control key whose stored value is a list but is edited as text. */
export const LIST_KEY_SUFFIX = '.text';

/** Prefix for per-snippet toggles whose stable key contains the snippet id. */
export const TEXT_SNIPPET_KEY_PREFIX = 'textSnippet:';

/** Class applied to the plugin's setting groups so styles.css can scope to them. */
export const SETTINGS_CLASS = 'better-paste-settings';

/** Settings keys whose value is a boolean. */
export type BooleanSettingKey = {
    [K in keyof BetterPasteSettings]: BetterPasteSettings[K] extends boolean ? K : never;
}[keyof BetterPasteSettings];

/** Toggle definition bound to a boolean setting. */
export function toggle(key: BooleanSettingKey, name: string, desc: string | DocumentFragment, aliases?: string[]): SettingDefinition {
    return {
        name,
        desc,
        ...(aliases ? { aliases } : {}),
        control: { type: 'toggle', key, defaultValue: DEFAULT_SETTINGS[key] }
    };
}
