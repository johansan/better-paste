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
            desc: 'Assistants produce characters that look ordinary but are not, and they survive a copy and paste. This swaps them for their plain equivalents: a no-break space becomes a normal space, and zero-width characters are dropped. The same characters get cleaned up whatever wrote them. Emoji and non-Latin scripts are left alone.',
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
                'Turn the em dash — and en dash – into a hyphen, and the curly quotes “ ” ‘ ’ into straight " and \'. Assistants and web pages both produce these; straight quotes also survive code and search better. This one is a matter of taste rather than tidiness, so switch it off if you set your punctuation on purpose. Guillemets « » are left alone, being ordinary quotation marks in several languages.',
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
