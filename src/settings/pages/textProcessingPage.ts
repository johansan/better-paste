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

/** Rows shown directly under the Text processing heading. */
export function createTextProcessingDefinitions(): SettingGroupItem[] {
    return [
        {
            name: 'Commas and quotes',
            desc: 'Choose where to place a comma next to a closing double quotation mark.',
            aliases: ['comma', 'quote', 'quotation', 'punctuation', 'style'],
            control: {
                type: 'dropdown',
                key: 'textCommaPlacement',
                defaultValue: DEFAULT_SETTINGS.textCommaPlacement,
                options: {
                    none: 'Do nothing',
                    inside: 'Comma inside quotes',
                    outside: 'Comma outside quotes'
                }
            }
        },
        toggle('trimPaste', 'Trim surrounding whitespace', 'Removes blank lines and spaces from the start and end of pasted text.', [
            'whitespace',
            'blank',
            'space',
            'newline',
            'trim'
        ])
    ];
}
