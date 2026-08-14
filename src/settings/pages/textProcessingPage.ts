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
import type { TextCommaPlacement } from '../types';

/** The source already has the comma inside the quotation mark, so only "outside" moves it. */
const COMMA_EXAMPLE_RESULTS: Record<TextCommaPlacement, string> = {
    none: strings.settings.text.commasExampleSource,
    inside: strings.settings.text.commasExampleSource,
    outside: strings.settings.text.commasExampleOutside
};

/** Comma example text, also used to update the rendered row after a dropdown change. */
export function commaPlacementExample(placement: TextCommaPlacement): string {
    return `${strings.settings.text.commasExampleSource} \u2192 ${COMMA_EXAMPLE_RESULTS[placement]}`;
}

/** Shows the selected comma placement with the same compact example used by other rules. */
function commasDescription(placement: TextCommaPlacement): string | DocumentFragment {
    const description = strings.settings.text.commasDesc;
    const example = commaPlacementExample(placement);

    if (typeof createFragment === 'undefined') return format(strings.settings.exampleFallback, { description, example });

    return createFragment(fragment => {
        fragment.appendText(description);
        fragment.createDiv({ cls: ['better-paste-example', 'better-paste-comma-example'], text: example });
    });
}

/** Rows shown directly under the Text processing heading. */
export function createTextProcessingDefinitions(context: SettingsPageContext): SettingGroupItem[] {
    const text = strings.settings.text;

    return [
        toggle(
            'textTrim',
            text.trimName,
            text.trimDesc,
            aliases(source => source.settings.text.trimAliases)
        ),
        {
            name: text.commasName,
            desc: commasDescription(context.settings().textComma),
            aliases: aliases(source => source.settings.text.commasAliases),
            control: {
                type: 'dropdown',
                key: 'textComma',
                defaultValue: DEFAULT_SETTINGS.textComma,
                options: {
                    none: text.commasNone,
                    inside: text.commasInside,
                    outside: text.commasOutside
                }
            }
        }
    ];
}
