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

/** Adds a compact before and after example below a setting description. */
function withExample(description: string, before: string, after: string): string | DocumentFragment {
    const example = `${before} \u2192 ${after}`;
    if (typeof createFragment === 'undefined') return `${description} Example: ${example}`;

    return createFragment(fragment => {
        fragment.appendText(description);
        fragment.createDiv({ cls: 'better-paste-example', text: example });
    });
}

/** AI cleanup rows shown under Text processing on the landing page. */
export function createAiTextLandingDefinitions(context: SettingsPageContext): SettingGroupItem[] {
    return [
        {
            name: 'AI cleanup: invisible characters',
            desc: withExample(
                'Turns unusual spaces into normal spaces and removes selected invisible formatting characters. Emoji and meaningful language characters are left unchanged.',
                'The result[zero-width space] was fine.',
                'The result was fine.'
            ),
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
                'AI cleanup: plain punctuation',
                withExample(
                    'Converts long dashes into hyphens and curly quotes into straight quotes. Angle quotes such as \u00ab \u00bb are left unchanged.',
                    '\u201cThe result \u2014 was fine.\u201d',
                    '"The result - was fine."'
                ),
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
