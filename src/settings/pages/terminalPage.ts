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
import type { TerminalRejoinMode } from '../types';

/** What each rejoin mode is called on the page link. */
const REJOIN_SUMMARY: Record<TerminalRejoinMode, string> = {
    indented: 'Indented lines only',
    any: 'Any wrapped line',
    never: 'Never'
};

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
            desc: 'Put back together the paragraphs your terminal broke apart at the edge of its window, and drop the indentation it added. Color codes are removed; code fences, tables and list items are left exactly as they are.',
            aliases: ['wrap', 'unwrap', 'rejoin', 'ansi', 'console', 'shell', 'indent', 'bullet', 'list', 'markdown'],
            control: { type: 'toggle', key: 'terminalEnabled', defaultValue: DEFAULT_SETTINGS.terminalEnabled }
        },
        {
            type: 'page',
            name: 'More about terminal text',
            desc: 'How cautiously lines are rejoined, and what happens to bullets.',
            visible: enabled,
            displayValue: () => REJOIN_SUMMARY[context.settings().terminalRejoinMode],
            items: createTerminalOptionsDefinitions(context)
        }
    ];
}

/** The Terminal options sub-page. */
function createTerminalOptionsDefinitions(context: SettingsPageContext): SettingGroupItem[] {
    return [
        {
            name: 'When to rejoin a broken line',
            desc: 'Most terminals indent the continuation of a wrapped line, and requiring that indent is what keeps ordinary multi-line text safe. Loosen it for tools that wrap without indenting; switch it off entirely for column-aligned output such as git log --graph, where the line breaks are the layout.',
            aliases: ['indent', 'wrap', 'aggressive', 'safe', 'git log'],
            control: {
                type: 'dropdown',
                key: 'terminalRejoinMode',
                defaultValue: DEFAULT_SETTINGS.terminalRejoinMode,
                options: {
                    indented: 'Only when the next line is indented',
                    any: 'Whenever the line above looks full',
                    never: 'Never rejoin, only strip codes and indentation'
                }
            }
        },
        {
            name: 'Bullet characters',
            desc: 'Terminal output uses characters like • that Obsidian treats as ordinary text. Converting them to Markdown list items makes them fold, indent and render as real lists.',
            aliases: ['list', 'markdown', 'dash'],
            control: {
                type: 'dropdown',
                key: 'terminalBulletMode',
                defaultValue: DEFAULT_SETTINGS.terminalBulletMode,
                options: {
                    preserve: 'Leave them as they are',
                    markdown: 'Convert to Markdown list items'
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
    const input = container.createEl('textarea', { attr: { placeholder: TERMINAL_SAMPLE, rows: '5' } });
    const output = container.createDiv({ cls: 'better-paste-preview-output' });

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
