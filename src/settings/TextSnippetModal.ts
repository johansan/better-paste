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

import { Modal, Setting } from 'obsidian';
import type { App, ButtonComponent, TextComponent } from 'obsidian';
import { format, strings } from '../i18n';
import { applyTextSnippets, createTextSnippetId, findInvalidSnippetRuleLines, snippetNameFromRules } from '../transforms/snippets';
import type { TextSnippet } from './types';
import { SNIPPETS_WIKI_URL } from './constants';

/** Converts the textarea value into stored lines without dropping comments or blanks. */
function rulesFromText(value: string): string[] {
    return value.length === 0 ? [] : value.split('\n');
}

/** Creates or edits one custom processing snippet with validation and a live preview. */
export class TextSnippetModal extends Modal {
    private readonly snippet: TextSnippet;
    private readonly onSave: (snippet: TextSnippet) => Promise<void>;
    private validationEl: HTMLElement | null = null;
    private previewEl: HTMLElement | null = null;
    private saveButton: ButtonComponent | null = null;
    private nameInput: TextComponent | null = null;
    private sample = '';
    private saving = false;

    constructor(app: App, initial: TextSnippet | null, onSave: (snippet: TextSnippet) => Promise<void>) {
        super(app);
        this.snippet = initial
            ? { ...initial, rules: [...initial.rules] }
            : { id: createTextSnippetId(), name: '', rules: [], enabled: true };
        this.onSave = onSave;
    }

    onOpen(): void {
        const text = strings.settings.custom;
        this.titleEl.setText(this.snippet.name ? text.editButton : text.addSnippet);
        this.modalEl.addClass('better-paste-snippet-modal');

        new Setting(this.contentEl).setName(text.nameName).addText(input => {
            this.nameInput = input;
            input.setValue(this.snippet.name).onChange(value => {
                this.snippet.name = value;
                this.updateSaveButton();
            });
        });

        const rulesSetting = new Setting(this.contentEl)
            .setName(text.rulesName)
            .setDesc(text.rulesDesc)
            .setClass('better-paste-snippet-rules-setting')
            .addTextArea(input => {
                input
                    .setPlaceholder(String.raw`s/\[\d+\]//g`)
                    .setValue(this.snippet.rules.join('\n'))
                    .onChange(value => {
                        this.updateRules(value);
                    });
                input.inputEl.rows = 8;
            });
        rulesSetting.descEl.createEl('br');
        const wiki = rulesSetting.descEl.createEl('a', { text: text.wikiPasteHint, href: SNIPPETS_WIKI_URL });
        wiki.setAttrs({ target: '_blank', rel: 'noopener noreferrer' });

        this.validationEl = this.contentEl.createDiv({ cls: 'better-paste-snippet-validation' });
        this.validationEl.setAttrs({ role: 'status', 'aria-live': 'polite' });
        this.renderValidation();

        this.contentEl.createDiv({ cls: 'better-paste-snippet-preview-label', text: text.previewName });
        this.contentEl.createDiv({ cls: 'better-paste-snippet-preview-desc', text: text.modalPreviewDesc });
        const preview = this.contentEl.createDiv({ cls: 'better-paste-preview' });
        const sample = preview.createEl('textarea', {
            attr: { 'aria-label': text.previewInputLabel, rows: '4' }
        });
        this.previewEl = preview.createDiv({ cls: ['better-paste-preview-output', 'better-paste-preview-empty'] });
        this.previewEl.setAttrs({ role: 'status', 'aria-live': 'polite' });
        sample.addEventListener('input', () => {
            this.sample = sample.value;
            this.renderPreview();
        });
        this.renderPreview();

        new Setting(this.contentEl)
            .addButton(button => {
                this.saveButton = button;
                button
                    .setButtonText(text.saveButton)
                    .setCta()
                    .onClick(() => {
                        void this.submit();
                    });
            })
            .addButton(button => button.setButtonText(strings.imageModal.cancel).onClick(() => this.close()));
        this.updateSaveButton();
    }

    private renderValidation(): void {
        if (!this.validationEl) return;
        const text = strings.settings.custom;
        const invalid = findInvalidSnippetRuleLines(this.snippet.rules);
        this.validationEl.empty();
        this.validationEl.toggleClass('better-paste-snippet-validation-error', invalid.length > 0);

        if (invalid.length === 0) {
            return;
        }

        for (const issue of invalid) {
            this.validationEl.createDiv({
                text: format(text.invalidLine, { line: issue.lineNumber, value: issue.line })
            });
        }
    }

    private updateRules(value: string): void {
        this.snippet.rules = rulesFromText(value);
        if (!this.snippet.name.trim()) {
            const name = snippetNameFromRules(this.snippet.rules);
            if (name !== null) {
                this.snippet.name = name;
                this.nameInput?.setValue(name);
            }
            this.updateSaveButton();
        }

        this.renderValidation();
        this.renderPreview();
    }

    private renderPreview(): void {
        if (!this.previewEl) return;
        if (!this.sample) {
            this.previewEl.setText(strings.settings.custom.previewEmpty);
            this.previewEl.addClass('better-paste-preview-empty');
            return;
        }

        this.previewEl.removeClass('better-paste-preview-empty');
        this.previewEl.setText(applyTextSnippets(this.sample, [{ ...this.snippet, enabled: true }]).text);
    }

    private updateSaveButton(): void {
        this.saveButton?.setDisabled(!this.snippet.name.trim() || this.saving);
    }

    private async submit(): Promise<void> {
        const name = this.snippet.name.trim();
        if (!name || this.saving) return;
        this.saving = true;
        this.snippet.name = name;
        this.updateSaveButton();
        await this.onSave({ ...this.snippet, rules: [...this.snippet.rules] });
        this.close();
    }

    onClose(): void {
        this.nameInput = null;
        this.contentEl.empty();
    }
}
