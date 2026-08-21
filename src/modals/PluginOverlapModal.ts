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

import { Modal } from 'obsidian';
import type { App } from 'obsidian';
import { plural, strings } from '../i18n';
import type { OverlappingPlugin } from '../pluginOverlap';

/** Shown on startup while a plugin Better Paste replaces is still enabled. */
export class PluginOverlapModal extends Modal {
    private readonly overlaps: readonly OverlappingPlugin[];
    private readonly onDismiss: (dontRemind: boolean) => void;
    private button: HTMLButtonElement | null = null;
    private checkbox: HTMLInputElement | null = null;

    constructor(app: App, overlaps: readonly OverlappingPlugin[], onDismiss: (dontRemind: boolean) => void) {
        super(app);
        this.overlaps = overlaps;
        this.onDismiss = onDismiss;
    }

    onOpen(): void {
        this.modalEl.addClass('better-paste-modal');
        this.titleEl.setText(strings.overlap.title);

        const body = this.contentEl.createDiv({ cls: 'better-paste-welcome-body' });
        body.createEl('p', { text: strings.overlap.thanks });
        // The count matches the list below, so it names only the plugins to remove
        body.createEl('p', { text: plural(strings.overlap.intro, this.overlaps.length) });
        const list = body.createEl('ul');
        for (const plugin of this.overlaps) list.createEl('li', { text: plugin.name });
        body.createEl('p', { text: strings.overlap.outro });

        const remind = this.contentEl.createEl('label', { cls: 'better-paste-overlap-remind' });
        this.checkbox = remind.createEl('input', { type: 'checkbox' });
        remind.appendText(strings.overlap.dontRemind);

        const buttons = this.contentEl.createDiv({ cls: 'better-paste-modal-buttons' });
        this.button = buttons.createEl('button', { cls: 'mod-cta', text: strings.overlap.button, attr: { type: 'button' } });
        this.button.addEventListener('click', () => {
            this.close();
        });
    }

    open(): void {
        super.open();
        window.requestAnimationFrame(() => this.button?.focus({ preventScroll: true }));
    }

    onClose(): void {
        this.onDismiss(this.checkbox?.checked === true);
        this.contentEl.empty();
        this.modalEl.removeClass('better-paste-modal');
        this.button = null;
        this.checkbox = null;
    }
}
