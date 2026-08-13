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
import { WELCOME_IMAGE_URL } from '../urls';

const INTRODUCTION = [
    'Better Paste alters clipboard content as it is pasted into a note.',
    'AI chatbots write curly quotes, long dashes and invisible characters that look like ordinary text but are not. Better Paste replaces them with plain equivalents, whatever wrote them.',
    'It also saves images into the vault, strips tracking from links, and rejoins wrapped terminal output.',
    'Every rule can be turned off, and a note can opt out with the "better-paste: false" property. Everything is under Settings, Better Paste.'
];

/** Shown once, the first time the plugin runs in a vault. */
export class WelcomeModal extends Modal {
    private startButton: HTMLButtonElement | null = null;

    onOpen(): void {
        this.modalEl.addClass('better-paste-modal');
        this.titleEl.setText('Welcome to Better Paste');

        const frame = this.contentEl.createDiv({ cls: 'better-paste-welcome-image' });
        const image = frame.createEl('img', { attr: { alt: '', loading: 'lazy', decoding: 'async' } });
        // The artwork is fetched from the repository, so the dialog has to read without it
        // when the vault is offline
        image.addEventListener('error', () => frame.remove());
        image.src = WELCOME_IMAGE_URL;

        const body = this.contentEl.createDiv({ cls: 'better-paste-welcome-body' });
        for (const paragraph of INTRODUCTION) body.createEl('p', { text: paragraph });

        const buttons = this.contentEl.createDiv({ cls: 'better-paste-modal-buttons' });
        this.startButton = buttons.createEl('button', { cls: 'mod-cta', text: 'Get started', attr: { type: 'button' } });
        this.startButton.addEventListener('click', () => {
            this.close();
        });
    }

    open(): void {
        super.open();
        window.requestAnimationFrame(() => this.startButton?.focus({ preventScroll: true }));
    }

    onClose(): void {
        this.contentEl.empty();
        this.modalEl.removeClass('better-paste-modal');
        this.startButton = null;
    }
}
