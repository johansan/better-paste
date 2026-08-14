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
import type { SettingsPageContext } from './context';

/** Sample text shown in the tester before the user types their own. */
const TERMINAL_SAMPLE = [
    '• The extra step is isolated to the list Enter handler, so the core change is straightforward. While tracing adjacent flows, I found',
    '  two likely friction points worth validating: selection can jump after the refresh.'
].join('\n');

/** Rows shown directly under the Terminal text heading on the landing page. */
export function createTerminalLandingDefinitions(context: SettingsPageContext): SettingGroupItem[] {
    const enabled = (): boolean => context.settings().terminalEnabled;

    return [
        {
            name: 'Clean up terminal output',
            desc: 'Rejoins wrapped lines in terminal output and removes indentation. Color codes are stripped. Code fences, tables, and list items are untouched.',
            aliases: ['wrap', 'unwrap', 'rejoin', 'ansi', 'console', 'shell', 'indent', 'bullet', 'list', 'markdown'],
            control: { type: 'toggle', key: 'terminalEnabled', defaultValue: DEFAULT_SETTINGS.terminalEnabled }
        },
        {
            type: 'page',
            name: 'Terminal text handling',
            desc: 'Rejoin conditions and bullet characters.',
            visible: enabled,
            items: createTerminalOptionsDefinitions(context)
        }
    ];
}

/** The Terminal options sub-page. */
function createTerminalOptionsDefinitions(context: SettingsPageContext): SettingGroupItem[] {
    return [
        {
            name: 'When to rejoin a broken line',
            desc: 'The condition required to treat a line as a continuation of the previous line.',
            aliases: ['indent', 'wrap', 'aggressive', 'safe', 'git log'],
            control: {
                type: 'dropdown',
                key: 'terminalRejoin',
                defaultValue: DEFAULT_SETTINGS.terminalRejoin,
                options: {
                    indented: 'Only when the next line is indented',
                    any: 'Whenever the line above looks full',
                    never: 'Never rejoin, only strip codes and indentation'
                }
            }
        },
        {
            name: 'Bullet characters',
            desc: 'Determines whether bullet characters (like •) in terminal output are preserved or converted to Markdown list items.',
            aliases: ['list', 'markdown', 'dash'],
            control: {
                type: 'dropdown',
                key: 'terminalBullets',
                defaultValue: DEFAULT_SETTINGS.terminalBullets,
                options: {
                    markdown: 'Convert to Markdown list items',
                    preserve: 'Leave them as they are'
                }
            }
        },
        {
            name: 'Try it',
            desc: 'Paste terminal output to see how it would be cleaned up.',
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
        attr: { placeholder: TERMINAL_SAMPLE, rows: '5', 'aria-label': 'Terminal text to clean' }
    });
    const output = container.createDiv({ cls: 'better-paste-preview-output' });
    output.setAttrs({ role: 'status', 'aria-live': 'polite' });

    const render = (): void => {
        const source = input.value;
        if (!source.trim()) {
            output.setText('The cleaned text appears here.');
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
