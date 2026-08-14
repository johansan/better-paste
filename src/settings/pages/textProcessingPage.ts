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
import type { TextCommaPlacement } from '../types';

const COMMA_EXAMPLE_SOURCE = 'He called it "finished," then left.';
const COMMA_EXAMPLE_RESULTS: Record<TextCommaPlacement, string> = {
    none: COMMA_EXAMPLE_SOURCE,
    inside: COMMA_EXAMPLE_SOURCE,
    outside: 'He called it "finished", then left.'
};

/** Comma example text, also used to update the rendered row after a dropdown change. */
export function commaPlacementExample(placement: TextCommaPlacement): string {
    return `${COMMA_EXAMPLE_SOURCE} \u2192 ${COMMA_EXAMPLE_RESULTS[placement]}`;
}

/** Shows the selected comma placement with the same compact example used by other rules. */
function commasDescription(placement: TextCommaPlacement): string | DocumentFragment {
    const description = 'Choose where to place a comma next to a closing double quotation mark.';
    const example = commaPlacementExample(placement);

    if (typeof createFragment === 'undefined') return `${description} Example: ${example}`;

    return createFragment(fragment => {
        fragment.appendText(description);
        fragment.createDiv({ cls: ['better-paste-example', 'better-paste-comma-example'], text: example });
    });
}

/** Rows shown directly under the Text processing heading. */
export function createTextProcessingDefinitions(context: SettingsPageContext): SettingGroupItem[] {
    return [
        toggle('trimPaste', 'Trim surrounding whitespace', 'Removes blank lines and spaces from the start and end of pasted text.', [
            'whitespace',
            'blank',
            'space',
            'newline',
            'trim'
        ]),
        {
            name: 'Commas and quotes',
            desc: commasDescription(context.settings().textCommaPlacement),
            aliases: ['comma', 'quote', 'quotation', 'punctuation', 'style'],
            control: {
                type: 'dropdown',
                key: 'textCommaPlacement',
                defaultValue: DEFAULT_SETTINGS.textCommaPlacement,
                options: {
                    none: 'No change',
                    inside: 'Comma inside quotes',
                    outside: 'Comma outside quotes'
                }
            }
        }
    ];
}
