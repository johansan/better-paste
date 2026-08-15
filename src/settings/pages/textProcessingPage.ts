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
import { applyDashStyle, applyQuoteStyle } from '../../transforms/typography';
import { toggle } from './context';
import type { SettingsPageContext } from './context';
import type { TextCommaPlacement, TextDashStyle, TextQuoteStyle } from '../types';

/** The Unicode code points the example draws in place of the characters they stand for. */
const NO_BREAK_SPACE_CODE = '[U+00A0]';
const ZERO_WIDTH_SPACE_CODE = '[U+200B]';

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

/** Quote example text, produced by the real rule so it always matches what a paste does. */
export function quoteStyleExample(style: TextQuoteStyle): string {
    const source = strings.settings.text.quotesExample;
    return `${source} \u2192 ${applyQuoteStyle(source, style).text}`;
}

/** Dash example text, produced by the real rule so it always matches what a paste does. */
export function dashStyleExample(style: TextDashStyle): string {
    const source = strings.settings.text.dashesExample;
    return `${source} \u2192 ${applyDashStyle(source, style).text}`;
}

/** Shows a description with the example for the currently selected dropdown value. */
function withStyleExample(description: string, example: string, exampleCls: string): string | DocumentFragment {
    if (typeof createFragment === 'undefined') return format(strings.settings.exampleFallback, { description, example });

    return createFragment(fragment => {
        fragment.appendText(description);
        fragment.createDiv({ cls: ['better-paste-example', exampleCls], text: example });
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

/** Rows shown under the Text processing heading. */
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
            name: text.invisibleName,
            desc: invisibleCharactersDescription(),
            aliases: aliases(source => source.settings.text.invisibleAliases),
            control: { type: 'toggle', key: 'textInvisible', defaultValue: DEFAULT_SETTINGS.textInvisible }
        },
        {
            name: text.quotesName,
            desc: withStyleExample(text.quotesDesc, quoteStyleExample(context.settings().textQuotes), 'better-paste-quote-example'),
            aliases: aliases(source => source.settings.text.quotesAliases),
            control: {
                type: 'dropdown',
                key: 'textQuotes',
                defaultValue: DEFAULT_SETTINGS.textQuotes,
                options: {
                    none: text.quotesNone,
                    straight: text.quotesStraight,
                    curly: text.quotesCurly
                }
            }
        },
        {
            name: text.dashesName,
            desc: withStyleExample(text.dashesDesc, dashStyleExample(context.settings().textDashes), 'better-paste-dash-example'),
            aliases: aliases(source => source.settings.text.dashesAliases),
            control: {
                type: 'dropdown',
                key: 'textDashes',
                defaultValue: DEFAULT_SETTINGS.textDashes,
                options: {
                    none: text.dashesNone,
                    hyphen: text.dashesHyphen,
                    en: text.dashesEn,
                    em: text.dashesEm,
                    'em-spaced': text.dashesEmSpaced
                }
            }
        },
        {
            name: text.commasName,
            desc: withStyleExample(text.commasDesc, commaPlacementExample(context.settings().textComma), 'better-paste-comma-example'),
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
