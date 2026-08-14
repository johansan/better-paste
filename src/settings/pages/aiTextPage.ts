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

/** Shows the two invisible source characters as visible, removed Unicode codes. */
function invisibleCharactersDescription(): string | DocumentFragment {
    const description = 'Removes zero-width spaces and turns non-breaking spaces into normal spaces.';
    const start = 'The';
    const noBreakSpace = '[U+00A0]';
    const middle = 'result';
    const zeroWidthSpace = '[U+200B]';
    const end = ' was fine.';
    const after = 'The result was fine.';
    const example = `${start}${noBreakSpace}${middle}${zeroWidthSpace}${end} \u2192 ${after}`;

    if (typeof createFragment === 'undefined') return `${description} Example: ${example}`;

    return createFragment(fragment => {
        fragment.appendText(description);
        const row = fragment.createDiv({ cls: 'better-paste-example' });
        row.appendText(start);
        row.createSpan({ cls: 'better-paste-example-removed', text: noBreakSpace });
        row.appendText(middle);
        row.createSpan({ cls: 'better-paste-example-removed', text: zeroWidthSpace });
        row.appendText(`${end} \u2192 ${after}`);
    });
}

/** AI cleanup rows shown under Text processing on the landing page. */
export function createAiTextLandingDefinitions(context: SettingsPageContext): SettingGroupItem[] {
    return [
        {
            name: 'AI cleanup: invisible characters',
            desc: invisibleCharactersDescription(),
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
                'AI cleanup: dashes and quotes',
                withExample(
                    'Converts long dashes into hyphens and curly quotes into straight quotes.',
                    '\u201cThe result \u2014 against all odds \u2014 was perfect.\u201d',
                    '"The result - against all odds - was perfect."'
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
