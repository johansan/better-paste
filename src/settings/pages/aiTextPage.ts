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
import { toggle } from './context';
import type { SettingsPageContext } from './context';

/** Rows shown directly under the AI text heading on the landing page. */
export function createAiTextLandingDefinitions(context: SettingsPageContext): SettingGroupItem[] {
    return [
        {
            name: 'Clean up AI text',
            desc: 'Replaces hidden or special characters with their plain equivalents. A no-break space becomes a normal space, and zero-width characters are dropped. Emoji and non-Latin scripts are untouched.',
            aliases: [
                'ai',
                'chatgpt',
                'claude',
                'llm',
                'dash',
                'em dash',
                'en dash',
                'hyphen',
                'unicode',
                'invisible',
                'nbsp',
                'typography',
                'punctuation',
                'whitespace'
            ],
            control: { type: 'toggle', key: 'aiTextEnabled', defaultValue: DEFAULT_SETTINGS.aiTextEnabled }
        },
        {
            ...toggle(
                'aiTextPlainPunctuation',
                'Use plain punctuation',
                'Converts long dashes into a hyphen, and curly quotes into straight quotes. Guillemets are preserved.',
                [
                    'em dash',
                    'en dash',
                    'hyphen',
                    'quote',
                    'quotes',
                    'smart quotes',
                    'curly quotes',
                    'apostrophe',
                    'punctuation',
                    'typography'
                ]
            ),
            visible: () => context.settings().aiTextEnabled
        }
    ];
}
