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

import type { SettingGroupItem } from 'obsidian';
import { DEFAULT_SETTINGS } from '../defaults';
import { aliases, strings } from '../../i18n';

/*
 * The names of the per-note properties.
 *
 * These are settings rather than constants because the names have to coexist with whatever
 * the vault and other plugins already put in frontmatter. A collision cannot be resolved
 * from here, and the plugin ships as a bundle, so a fixed name would leave no way out.
 * Blank switches that property off, which is the defensible opposite state.
 */
export function createFrontmatterDefinitions(): SettingGroupItem[] {
    const text = strings.settings.frontmatter;

    return [
        {
            name: text.notePropertyName,
            desc: text.notePropertyDesc,
            aliases: aliases(source => source.settings.frontmatter.notePropertyAliases),
            control: {
                type: 'text',
                key: 'noteProperty',
                placeholder: DEFAULT_SETTINGS.noteProperty,
                defaultValue: DEFAULT_SETTINGS.noteProperty
            }
        },
        {
            name: text.sizePropertyName,
            desc: text.sizePropertyDesc,
            aliases: aliases(source => source.settings.frontmatter.sizePropertyAliases),
            control: {
                type: 'text',
                key: 'imageSizeProperty',
                placeholder: DEFAULT_SETTINGS.imageSizeProperty,
                defaultValue: DEFAULT_SETTINGS.imageSizeProperty
            }
        }
    ];
}
