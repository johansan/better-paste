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

import { setIcon } from 'obsidian';
import type { Setting, SettingGroupItem } from 'obsidian';
import { aliases, format, strings } from '../../i18n';
import { communityPluginUrl, SUPPORT_BUY_ME_A_COFFEE_URL, SUPPORT_SPONSOR_URL } from '../../urls';
import { NOTEBOOK_NAVIGATOR_ICON } from '../pluginIcons';
import { toggle } from './context';
import type { SettingsPageContext } from './context';

/** The author's other plugins, shown as cards. The names are product names, so they are
 *  not translated. Pixel Perfect Image has no icon of its own, so it uses an Obsidian one. */
const OTHER_PLUGINS = [
    {
        id: 'notebook-navigator',
        name: 'Notebook Navigator',
        icon: NOTEBOOK_NAVIGATOR_ICON,
        description: strings.settings.start.notebookNavigatorDesc
    },
    {
        id: 'pixel-perfect-image',
        name: 'Pixel Perfect Image',
        icon: 'image',
        description: strings.settings.start.pixelPerfectImageDesc
    }
];

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
        toggle(
            'showReleaseNotes',
            text.showReleaseNotesName,
            text.showReleaseNotesDesc,
            aliases(source => source.settings.start.showReleaseNotesAliases)
        ),
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
        },
        {
            name: text.pluginsName,
            aliases: aliases(source => source.settings.start.pluginsAliases),
            render: renderOtherPlugins
        }
    ];
}

/** One card per plugin, each opening that plugin's page in Obsidian's community browser. */
function renderOtherPlugins(setting: Setting): void {
    // Marks the row so styles.css can lay the cards out below the label rather than beside it
    setting.settingEl.addClass('better-paste-plugins');
    const list = setting.settingEl.createDiv({ cls: 'better-paste-plugin-list' });

    for (const plugin of OTHER_PLUGINS) {
        const card = list.createEl('button', { cls: 'better-paste-plugin-card', attr: { type: 'button' } });
        setIcon(card.createDiv({ cls: 'better-paste-plugin-icon' }), plugin.icon);
        const details = card.createDiv({ cls: 'better-paste-plugin-details' });
        details.createDiv({ cls: 'better-paste-plugin-name', text: plugin.name });
        details.createDiv({ cls: 'better-paste-plugin-description', text: plugin.description });
        setIcon(card.createDiv({ cls: 'better-paste-plugin-arrow' }), 'chevron-right');
        card.addEventListener('click', () => {
            window.open(communityPluginUrl(plugin.id));
        });
    }
}
