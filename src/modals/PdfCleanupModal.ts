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
import type { App } from 'obsidian';
import { strings } from '../i18n';
import { cleanPdfText } from '../transforms/pdfText';
import type { PdfCleanupOptions } from '../transforms/pdfText';

/**
 * Previews the PDF cleanup on the selected text and offers the situational choices:
 * page numbers and joining into one paragraph. The preview updates
 * with every toggle, so the effect is visible before anything is applied. Enter applies,
 * Escape applies nothing.
 */
export class PdfCleanupModal extends Modal {
    private readonly text: string;
    private readonly options: PdfCleanupOptions;
    private readonly onSubmit: (options: PdfCleanupOptions | null) => void;
    private previewEl: HTMLElement | null = null;
    /** Guards the callback, because closing after Apply must not also report a cancel. */
    private submitted = false;

    constructor(app: App, text: string, initial: PdfCleanupOptions, onSubmit: (options: PdfCleanupOptions | null) => void) {
        super(app);
        this.text = text;
        this.options = { ...initial };
        this.onSubmit = onSubmit;
    }

    onOpen(): void {
        const text = strings.pdfModal;
        this.titleEl.setText(strings.commands.cleanPdf);
        this.modalEl.addClass('better-paste-pdf-modal');

        this.contentEl.createDiv({ text: text.description, cls: 'better-paste-pdf-description' });

        new Setting(this.contentEl).setName(text.furniture).addToggle(toggle => {
            toggle.setValue(this.options.removeFurniture).onChange(value => {
                this.options.removeFurniture = value;
                this.renderPreview();
            });
        });

        new Setting(this.contentEl).setName(text.singleParagraph).addToggle(toggle => {
            toggle.setValue(this.options.singleParagraph).onChange(value => {
                this.options.singleParagraph = value;
                this.renderPreview();
            });
        });

        this.contentEl.createDiv({ text: text.preview, cls: 'better-paste-pdf-preview-label' });
        this.previewEl = this.contentEl.createDiv({ cls: 'better-paste-pdf-preview' });
        this.renderPreview();

        // The image dialog's button labels are generic and reused here, so both dialogs
        // read the same in every language
        new Setting(this.contentEl)
            .addButton(button =>
                button
                    .setButtonText(strings.imageModal.apply)
                    .setCta()
                    .onClick(() => this.submit())
            )
            .addButton(button => button.setButtonText(strings.imageModal.cancel).onClick(() => this.close()));

        // Enter applies from anywhere in the dialog, so the flow is select, adjust, Enter
        this.scope.register([], 'Enter', event => {
            event.preventDefault();
            this.submit();
        });
    }

    private renderPreview(): void {
        this.previewEl?.setText(cleanPdfText(this.text, this.options).text);
    }

    private submit(): void {
        if (this.submitted) return;
        this.submitted = true;
        this.onSubmit({ ...this.options });
        this.close();
    }

    onClose(): void {
        this.contentEl.empty();
        if (!this.submitted) {
            this.submitted = true;
            this.onSubmit(null);
        }
    }
}
