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
import { aliases, format, strings } from '../../i18n';
import { SUPPORT_BUY_ME_A_COFFEE_URL, SUPPORT_SPONSOR_URL } from '../../urls';
import type { SettingsPageContext } from './context';

/** Release notes and support links, shown above the rules. */
export function createStartDefinitions(context: SettingsPageContext): SettingGroupItem[] {
    const text = strings.settings.start;

    return [
        {
            name: format(text.whatsNewName, { version: context.version }),
            desc: text.whatsNewDesc,
            aliases: aliases(source => source.settings.start.whatsNewAliases),
            render: setting => {
                setting.addButton(button =>
                    button.setButtonText(text.whatsNewButton).onClick(() => {
                        context.showWhatsNew();
                    })
                );
            }
        },
        {
            name: text.supportName,
            desc: text.supportDesc,
            aliases: aliases(source => source.settings.start.supportAliases),
            render: setting => {
                setting.addButton(button =>
                    button.setButtonText(text.sponsorButton).onClick(() => {
                        window.open(SUPPORT_SPONSOR_URL);
                    })
                );
                setting.addButton(button =>
                    button.setButtonText(text.coffeeButton).onClick(() => {
                        window.open(SUPPORT_BUY_ME_A_COFFEE_URL);
                    })
                );
            }
        }
    ];
}
