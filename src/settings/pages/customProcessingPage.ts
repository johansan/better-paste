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

import { Notice } from 'obsidian';
import type { Setting, SettingDefinition, SettingDefinitionItem, SettingGroupItem } from 'obsidian';
import { format, plural, strings } from '../../i18n';
import { applyTextSnippets, countSnippetRuleLines, findInvalidSnippetRuleLines, serializeTextSnippets } from '../../transforms/snippets';
import type { TextSnippet } from '../types';
import { REGEX_PLAYGROUND_URL, SNIPPETS_WIKI_URL } from '../constants';
import { TextSnippetImportModal } from '../TextSnippetImportModal';
import { TextSnippetModal } from '../TextSnippetModal';
import { logError } from '../../utils/logger';
import { SETTINGS_CLASS, TEXT_SNIPPET_KEY_PREFIX } from './context';
import type { SettingsPageContext } from './context';

type RegisterSnippetEditListener = (ownerDocument: Document) => void;

/** Saves a structural list change and rebuilds the definitions that represent it. */
async function saveAndUpdate(context: SettingsPageContext): Promise<void> {
    await context.saveSettings();
    context.update();
}

/** The rule count, validation warning and edit action shown under a snippet name. */
function snippetDescription(snippet: TextSnippet): string | DocumentFragment {
    const text = strings.settings.custom;
    const rules = plural(text.snippetRulesCount, countSnippetRuleLines(snippet.rules));
    const invalid = findInvalidSnippetRuleLines(snippet.rules).length;
    const description = invalid === 0 ? rules : `${rules}, ${plural(text.invalidRulesCount, invalid)}`;

    if (typeof createFragment === 'undefined') return description;

    return createFragment(fragment => {
        fragment.appendText(description);
        fragment.appendText(' ');
        // The framework clones description fragments, so element listeners are lost but
        // attributes survive. One delegated listener on the owning document handles clicks.
        fragment.createEl('button', {
            cls: 'better-paste-snippet-edit-button',
            text: text.editButton,
            attr: { type: 'button', 'data-snippet-id': snippet.id }
        });
    });
}

/** Opens the editor and persists either a replacement or a new list item. */
export function openSnippetEditor(context: SettingsPageContext, snippet: TextSnippet | null): void {
    new TextSnippetModal(context.app, snippet, async saved => {
        const snippets = context.settings().textSnippets;
        const index = snippet ? snippets.findIndex(candidate => candidate.id === snippet.id) : -1;
        if (index < 0) snippets.push(saved);
        else snippets[index] = saved;
        await saveAndUpdate(context);
    }).open();
}

/** A compact diagram showing where snippets sit in the paste pipeline. */
function renderPipeline(setting: Setting): void {
    const text = strings.settings.custom;
    setting.settingEl.addClass('better-paste-pipeline-setting');
    const pipeline = setting.settingEl.createDiv({ cls: 'better-paste-pipeline' });
    const steps = [text.pastedText, text.builtInRules, text.customSnippets, text.note];

    steps.forEach((step, index) => {
        if (index > 0) pipeline.createSpan({ cls: 'better-paste-pipeline-arrow', text: '\u2192' });
        pipeline.createDiv({ cls: 'better-paste-pipeline-step', text: step });
    });

    const buttons = setting.settingEl.createDiv({ cls: 'better-paste-pipeline-buttons' });
    const wiki = buttons.createEl('button', { text: text.wikiButton, attr: { type: 'button' } });
    wiki.addEventListener('click', () => window.open(SNIPPETS_WIKI_URL));
    const playground = buttons.createEl('button', { text: text.regexButton, attr: { type: 'button' } });
    playground.addEventListener('click', () => window.open(REGEX_PLAYGROUND_URL));
}

/** One identified toggle and edit affordance inside the reorderable list. */
function snippetDefinition(snippet: TextSnippet): SettingDefinition {
    const text = strings.settings.custom;

    return {
        name: snippet.name || text.unnamedSnippet,
        desc: snippetDescription(snippet),
        control: { type: 'toggle', key: `${TEXT_SNIPPET_KEY_PREFIX}${snippet.id}` }
    };
}

/** Reorderable snippet list and the import, export, and preview tools below it. */
function createSnippetsPageDefinitions(
    context: SettingsPageContext,
    registerSnippetEditListener: RegisterSnippetEditListener
): SettingDefinitionItem[] {
    const text = strings.settings.custom;

    return [
        {
            type: 'list',
            cls: SETTINGS_CLASS,
            items: context.settings().textSnippets.map(snippet => snippetDefinition(snippet)),
            emptyState: text.emptyState,
            addItem: {
                name: text.addSnippet,
                action: () => openSnippetEditor(context, null)
            },
            onReorder: (oldIndex, newIndex) => {
                const snippets = context.settings().textSnippets;
                const [snippet] = snippets.splice(oldIndex, 1);
                if (!snippet) return;
                snippets.splice(newIndex, 0, snippet);
                void saveAndUpdate(context);
            },
            onDelete: index => {
                context.settings().textSnippets.splice(index, 1);
                void saveAndUpdate(context);
            }
        },
        {
            type: 'group',
            cls: SETTINGS_CLASS,
            items: [
                {
                    name: text.exportName,
                    desc: text.exportDesc,
                    render: setting => {
                        setting.addButton(button =>
                            button.setButtonText(text.exportButton).onClick(() => {
                                const interchange = serializeTextSnippets(context.settings().textSnippets, text.importFallbackName);
                                void navigator.clipboard
                                    .writeText(interchange)
                                    .then(() => {
                                        new Notice(format(strings.notices.prefix, { message: strings.notices.snippetsCopied }), 2000);
                                    })
                                    .catch(error => {
                                        logError('Could not copy custom processing snippets', error);
                                        new Notice(format(strings.notices.prefix, { message: strings.notices.snippetsCopyFailed }));
                                    });
                            })
                        );
                    }
                },
                {
                    name: text.importName,
                    desc: text.importDesc,
                    render: setting => {
                        setting.addButton(button =>
                            button.setButtonText(text.importName).onClick(() => {
                                new TextSnippetImportModal(context.app, async snippets => {
                                    context.settings().textSnippets.push(...snippets);
                                    await saveAndUpdate(context);
                                }).open();
                            })
                        );
                    }
                },
                {
                    name: text.previewName,
                    desc: text.previewDesc,
                    searchable: false,
                    render: setting => {
                        const register = (): void => registerSnippetEditListener(setting.settingEl.ownerDocument);
                        const stopWatchingWindow = setting.settingEl.onWindowMigrated(register);
                        register();
                        renderSnippetPreview(setting, context);
                        return stopWatchingWindow;
                    }
                }
            ]
        }
    ];
}

/** Live whole-buffer preview for every enabled stored snippet. */
function renderSnippetPreview(setting: Setting, context: SettingsPageContext): void {
    const text = strings.settings.custom;
    setting.settingEl.addClass('better-paste-tester');
    const sample = setting.settingEl.querySelector<HTMLTextAreaElement>('.better-paste-preview textarea')?.value ?? '';
    // update() re-invokes this renderer on the same setting element, so replace its custom DOM.
    for (const existing of setting.settingEl.querySelectorAll<HTMLElement>('.better-paste-preview')) existing.remove();

    const container = setting.settingEl.createDiv({ cls: 'better-paste-preview' });
    const input = container.createEl('textarea', {
        attr: { 'aria-label': text.previewInputLabel, rows: '5' }
    });
    input.value = sample;
    const output = container.createDiv({ cls: ['better-paste-preview-output', 'better-paste-preview-empty'] });
    output.setAttrs({ role: 'status', 'aria-live': 'polite' });

    const render = (): void => {
        if (!input.value) {
            output.setText(text.previewEmpty);
            output.addClass('better-paste-preview-empty');
            return;
        }
        output.removeClass('better-paste-preview-empty');
        output.setText(applyTextSnippets(input.value, context.settings().textSnippets).text);
    };

    input.addEventListener('input', render);
    render();
}

/** Pipeline overview and the link to the full snippet editor page. */
export function createCustomProcessingDefinitions(
    context: SettingsPageContext,
    registerSnippetEditListener: RegisterSnippetEditListener
): SettingGroupItem[] {
    const text = strings.settings.custom;

    return [
        {
            name: text.pipelineName,
            searchable: false,
            render: renderPipeline
        },
        {
            type: 'page',
            name: text.snippetsName,
            desc: text.snippetsDesc,
            displayValue: () =>
                plural(text.enabledSnippetsCount, context.settings().textSnippets.filter(snippet => snippet.enabled).length),
            status: () =>
                context.settings().textSnippets.some(snippet => findInvalidSnippetRuleLines(snippet.rules).length > 0) ? 'warning' : null,
            items: createSnippetsPageDefinitions(context, registerSnippetEditListener)
        }
    ];
}
