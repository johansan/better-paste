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
import { SUPPORT_BUY_ME_A_COFFEE_URL, SUPPORT_SPONSOR_URL } from '../../urls';
import type { SettingsPageContext } from './context';

/** Release notes and support links, shown above the rules. */
export function createStartDefinitions(context: SettingsPageContext): SettingGroupItem[] {
    return [
        {
            name: `What's new in Better Paste ${context.version}`,
            desc: 'What changed in the most recent releases.',
            aliases: ['release notes', 'changelog', 'version', 'update', 'history'],
            render: setting => {
                setting.addButton(button =>
                    button.setButtonText('View recent updates').onClick(() => {
                        context.showWhatsNew();
                    })
                );
            }
        },
        {
            name: 'Support development',
            desc: 'If you find Better Paste useful, please consider supporting its continued development.',
            aliases: ['sponsor', 'donate', 'coffee', 'github'],
            render: setting => {
                setting.addButton(button =>
                    button.setButtonText('❤️ Sponsor').onClick(() => {
                        window.open(SUPPORT_SPONSOR_URL);
                    })
                );
                setting.addButton(button =>
                    button.setButtonText('☕️ Buy me a coffee').onClick(() => {
                        window.open(SUPPORT_BUY_ME_A_COFFEE_URL);
                    })
                );
            }
        }
    ];
}
