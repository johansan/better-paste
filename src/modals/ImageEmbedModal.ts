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

/** What the dialog decided for the paste. Null parts add nothing to the embed. */
export interface ImageEmbedChoice {
    size: string | null;
    cssClass: string | null;
}

/** Which pickers the dialog shows and what they start on. */
export interface ImageEmbedPrompt {
    /** Sizes to offer, or null when the size is already decided for this paste. */
    sizes: readonly string[] | null;
    /** Classes to offer, or null when the class is already decided for this paste. */
    classes: readonly string[] | null;
    initialSize: string;
    initialClass: string;
}

/**
 * Asks which size and CSS class a pasted image embed should get. Opened once per paste,
 * only for the parts whose setting says to ask. Enter applies, Escape applies nothing.
 */
export class ImageEmbedModal extends Modal {
    private readonly prompt: ImageEmbedPrompt;
    private readonly onSubmit: (choice: ImageEmbedChoice | null) => void;
    private size: string;
    private cssClass: string;
    /** Guards the callback, because closing after Apply must not also report a cancel. */
    private submitted = false;

    constructor(app: App, prompt: ImageEmbedPrompt, onSubmit: (choice: ImageEmbedChoice | null) => void) {
        super(app);
        this.prompt = prompt;
        this.onSubmit = onSubmit;
        // The previous paste's picks are preselected while they are still offered
        this.size = prompt.sizes?.includes(prompt.initialSize) ? prompt.initialSize : '';
        this.cssClass = prompt.classes?.includes(prompt.initialClass) ? prompt.initialClass : '';
    }

    onOpen(): void {
        const text = strings.imageModal;
        this.titleEl.setText(text.title);

        if (this.prompt.sizes) {
            const sizes = this.prompt.sizes;
            new Setting(this.contentEl).setName(text.sizeName).addDropdown(dropdown => {
                dropdown.addOption('', text.none);
                for (const option of sizes) dropdown.addOption(option, option);
                dropdown.setValue(this.size);
                dropdown.onChange(value => {
                    this.size = value;
                });
            });
        }

        if (this.prompt.classes) {
            const classes = this.prompt.classes;
            new Setting(this.contentEl).setName(text.className).addDropdown(dropdown => {
                dropdown.addOption('', text.none);
                for (const option of classes) dropdown.addOption(option, option);
                dropdown.setValue(this.cssClass);
                dropdown.onChange(value => {
                    this.cssClass = value;
                });
            });
        }

        new Setting(this.contentEl)
            .addButton(button =>
                button
                    .setButtonText(text.apply)
                    .setCta()
                    .onClick(() => this.submit())
            )
            .addButton(button => button.setButtonText(text.cancel).onClick(() => this.close()));

        // Enter applies from anywhere in the dialog, so the flow is paste, pick, Enter
        this.scope.register([], 'Enter', event => {
            event.preventDefault();
            this.submit();
        });
    }

    private submit(): void {
        if (this.submitted) return;
        this.submitted = true;
        this.onSubmit({ size: this.size || null, cssClass: this.cssClass || null });
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
