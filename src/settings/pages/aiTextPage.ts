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
import { aliases, format, strings } from '../../i18n';
import { toggle } from './context';
import type { SettingsPageContext } from './context';

/** The Unicode code points the example draws in place of the characters they stand for. */
const NO_BREAK_SPACE_CODE = '[U+00A0]';
const ZERO_WIDTH_SPACE_CODE = '[U+200B]';

/** Adds a compact before and after example below a setting description. */
function withExample(description: string, before: string, after: string): string | DocumentFragment {
    const example = `${before} \u2192 ${after}`;
    if (typeof createFragment === 'undefined') return format(strings.settings.exampleFallback, { description, example });

    return createFragment(fragment => {
        fragment.appendText(description);
        fragment.createDiv({ cls: 'better-paste-example', text: example });
    });
}

/** Shows the two invisible source characters as visible, removed Unicode codes. */
function invisibleCharactersDescription(): string | DocumentFragment {
    const text = strings.settings.text;
    const description = text.invisibleDesc;
    const tail = `${text.invisibleExampleEnd} \u2192 ${text.invisibleExampleAfter}`;
    const example = `${text.invisibleExampleStart}${NO_BREAK_SPACE_CODE}${text.invisibleExampleMiddle}${ZERO_WIDTH_SPACE_CODE}${tail}`;

    if (typeof createFragment === 'undefined') return format(strings.settings.exampleFallback, { description, example });

    return createFragment(fragment => {
        fragment.appendText(description);
        const row = fragment.createDiv({ cls: 'better-paste-example' });
        row.appendText(text.invisibleExampleStart);
        row.createSpan({ cls: 'better-paste-example-removed', text: NO_BREAK_SPACE_CODE });
        row.appendText(text.invisibleExampleMiddle);
        row.createSpan({ cls: 'better-paste-example-removed', text: ZERO_WIDTH_SPACE_CODE });
        row.appendText(tail);
    });
}

/** AI cleanup rows shown under Text processing on the landing page. */
export function createAiTextLandingDefinitions(context: SettingsPageContext): SettingGroupItem[] {
    const text = strings.settings.text;

    return [
        {
            name: text.invisibleName,
            desc: invisibleCharactersDescription(),
            aliases: aliases(source => source.settings.text.invisibleAliases),
            control: { type: 'toggle', key: 'textInvisible', defaultValue: DEFAULT_SETTINGS.textInvisible }
        },
        {
            ...toggle(
                'textPunctuation',
                text.punctuationName,
                withExample(text.punctuationDesc, text.punctuationExampleBefore, text.punctuationExampleAfter),
                aliases(source => source.settings.text.punctuationAliases)
            ),
            visible: () => context.settings().textInvisible
        }
    ];
}
