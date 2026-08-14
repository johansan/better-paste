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

import type { Setting, SettingGroupItem } from 'obsidian';
import { DEFAULT_SETTINGS } from '../defaults';
import { runTextPipeline } from '../../transforms';
import { aliases, strings } from '../../i18n';
import type { SettingsPageContext } from './context';

/** Sample text shown in the tester before the user types their own. */
const TERMINAL_SAMPLE = strings.settings.terminal.testerSample.join('\n');

/** Rows shown directly under the Terminal text heading on the landing page. */
export function createTerminalLandingDefinitions(context: SettingsPageContext): SettingGroupItem[] {
    const enabled = (): boolean => context.settings().terminalEnabled;
    const text = strings.settings.terminal;

    return [
        {
            name: text.cleanupName,
            desc: text.cleanupDesc,
            aliases: aliases(source => source.settings.terminal.cleanupAliases),
            control: { type: 'toggle', key: 'terminalEnabled', defaultValue: DEFAULT_SETTINGS.terminalEnabled }
        },
        {
            type: 'page',
            name: text.pageName,
            desc: text.pageDesc,
            visible: enabled,
            items: createTerminalOptionsDefinitions(context)
        }
    ];
}

/** The Terminal options sub-page. */
function createTerminalOptionsDefinitions(context: SettingsPageContext): SettingGroupItem[] {
    const text = strings.settings.terminal;

    return [
        {
            name: text.rejoinName,
            desc: text.rejoinDesc,
            aliases: aliases(source => source.settings.terminal.rejoinAliases),
            control: {
                type: 'dropdown',
                key: 'terminalRejoin',
                defaultValue: DEFAULT_SETTINGS.terminalRejoin,
                options: {
                    indented: text.rejoinIndented,
                    any: text.rejoinAny,
                    never: text.rejoinNever
                }
            }
        },
        {
            name: text.bulletsName,
            desc: text.bulletsDesc,
            aliases: aliases(source => source.settings.terminal.bulletsAliases),
            control: {
                type: 'dropdown',
                key: 'terminalBullets',
                defaultValue: DEFAULT_SETTINGS.terminalBullets,
                options: {
                    markdown: text.bulletsMarkdown,
                    preserve: text.bulletsPreserve
                }
            }
        },
        {
            name: text.testerName,
            desc: text.testerDesc,
            searchable: false,
            render: setting => renderTerminalTester(setting, context)
        }
    ];
}

/** Live preview of the terminal rules, which are easiest to judge by example. */
function renderTerminalTester(setting: Setting, context: SettingsPageContext): void {
    // Marks the row so styles.css can lay the preview out below the label, which
    // avoids needing :has() on the parent
    setting.settingEl.addClass('better-paste-tester');
    const container = setting.settingEl.createDiv({ cls: 'better-paste-preview' });
    const input = container.createEl('textarea', {
        attr: { placeholder: TERMINAL_SAMPLE, rows: '5', 'aria-label': strings.settings.terminal.testerLabel }
    });
    const output = container.createDiv({ cls: 'better-paste-preview-output' });
    output.setAttrs({ role: 'status', 'aria-live': 'polite' });

    const render = (): void => {
        const source = input.value;
        if (!source.trim()) {
            output.setText(strings.settings.terminal.testerEmpty);
            output.addClass('better-paste-preview-empty');
            return;
        }
        output.removeClass('better-paste-preview-empty');
        // The whole pipeline, not just this rule, so the preview matches a real paste
        output.setText(runTextPipeline(source, context.settings()).text);
    };

    input.addEventListener('input', render);
    render();
}
