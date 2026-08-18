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
import type { App, ButtonComponent } from 'obsidian';
import { format, plural, strings } from '../i18n';
import { parseSnippetInterchange } from '../transforms/snippets';
import type { SnippetInterchangeResult } from '../transforms/snippets';
import type { TextSnippet } from './types';

const EMPTY_RESULT: SnippetInterchangeResult = { snippets: [], ruleCount: 0, invalidLines: [] };

/** Imports snippets from the plain-text interchange format without replacing stored ones. */
export class TextSnippetImportModal extends Modal {
    private readonly onImport: (snippets: TextSnippet[]) => Promise<void>;
    private result: SnippetInterchangeResult = EMPTY_RESULT;
    private summaryEl: HTMLElement | null = null;
    private invalidEl: HTMLElement | null = null;
    private importButton: ButtonComponent | null = null;
    private importing = false;

    constructor(app: App, onImport: (snippets: TextSnippet[]) => Promise<void>) {
        super(app);
        this.onImport = onImport;
    }

    onOpen(): void {
        const text = strings.settings.custom;
        this.titleEl.setText(text.importName);
        this.modalEl.addClass('better-paste-snippet-modal');

        this.contentEl.createDiv({ cls: 'better-paste-snippet-import-desc', text: text.importDesc });
        new Setting(this.contentEl).setClass('better-paste-snippet-rules-setting').addTextArea(input => {
            input.setPlaceholder('# Remove citations\ns/\\[\\d+\\]//g').onChange(value => {
                this.result = parseSnippetInterchange(value, text.importFallbackName);
                this.renderStatus();
            });
            input.inputEl.rows = 12;
        });

        this.summaryEl = this.contentEl.createDiv({ cls: 'better-paste-snippet-import-summary' });
        this.summaryEl.setAttrs({ role: 'status', 'aria-live': 'polite' });
        this.invalidEl = this.contentEl.createDiv({ cls: 'better-paste-snippet-validation' });

        new Setting(this.contentEl)
            .addButton(button => {
                this.importButton = button;
                button
                    .setButtonText(text.importName)
                    .setCta()
                    .onClick(() => {
                        void this.submit();
                    });
            })
            .addButton(button => button.setButtonText(strings.imageModal.cancel).onClick(() => this.close()));
        this.renderStatus();
    }

    private renderStatus(): void {
        if (!this.summaryEl || !this.invalidEl) return;
        const text = strings.settings.custom;
        this.summaryEl.setText(
            `${plural(text.recognizedSnippetsCount, this.result.snippets.length)}, ${plural(text.recognizedRulesCount, this.result.ruleCount)}`
        );

        this.invalidEl.empty();
        this.invalidEl.toggleClass('better-paste-snippet-validation-error', this.result.invalidLines.length > 0);
        if (this.result.invalidLines.length > 0) {
            this.invalidEl.createDiv({ cls: 'better-paste-snippet-invalid-heading', text: text.unparseableName });
            for (const issue of this.result.invalidLines) {
                this.invalidEl.createDiv({ text: format(text.invalidLine, { line: issue.lineNumber, value: issue.line }) });
            }
        }
        this.importButton?.setDisabled(this.result.snippets.length === 0 || this.importing);
    }

    private async submit(): Promise<void> {
        if (this.result.snippets.length === 0 || this.importing) return;
        this.importing = true;
        this.renderStatus();
        await this.onImport(this.result.snippets.map(snippet => ({ ...snippet, enabled: true })));
        this.close();
    }

    onClose(): void {
        this.contentEl.empty();
    }
}
