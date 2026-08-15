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

import { Modal, Platform } from 'obsidian';
import type { App } from 'obsidian';
import { format, localeTag, strings } from '../i18n';
import { releaseBannerUrl, SUPPORT_BUY_ME_A_COFFEE_URL } from '../urls';
import type { ReleaseNote } from '../releaseNotes';

/** The lists under a version, in the order they are rendered. */
const CATEGORIES = [
    { key: 'new', label: strings.whatsNew.categoryNew },
    { key: 'improved', label: strings.whatsNew.categoryImproved },
    { key: 'changed', label: strings.whatsNew.categoryChanged },
    { key: 'fixed', label: strings.whatsNew.categoryFixed }
] as const;

/** Opens a link in the browser rather than inside Obsidian. */
function appendLink(parent: HTMLElement, url: string, label: string): void {
    const link = parent.createEl('a', { text: label, href: url });
    link.setAttr('rel', 'noopener noreferrer');
    link.setAttr('target', '_blank');
}

/**
 * Renders the inline formatting release notes and the welcome dialog may use. The pattern
 * is built per call because `exec` advances `lastIndex` on the object it is called with,
 * and an ==emphasis== span recurses into this same function.
 */
export function renderInline(container: HTMLElement, text: string): void {
    const pattern = /==([\s\S]*?)==|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|(https?:\/\/\S+)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(text)) !== null) {
        container.appendText(text.slice(lastIndex, match.index));
        const [, emphasis, linkLabel, linkUrl, code, bold, bareUrl] = match;

        if (emphasis) {
            renderInline(container.createSpan({ cls: 'better-paste-emphasis' }), emphasis);
        } else if (linkLabel && linkUrl) {
            appendLink(container, linkUrl, linkLabel);
        } else if (code) {
            container.createEl('code', { text: code });
        } else if (bold) {
            container.createEl('strong', { text: bold });
        } else if (bareUrl) {
            // A sentence that ends in a link would otherwise take its full stop with it
            const trailing = /[.,;:!?)]+$/.exec(bareUrl)?.[0] ?? '';
            const url = trailing ? bareUrl.slice(0, -trailing.length) : bareUrl;
            appendLink(container, url, url);
            container.appendText(trailing);
        }

        lastIndex = pattern.lastIndex;
    }

    container.appendText(text.slice(lastIndex));
}

/** Renders one note, turning each newline into a line break. */
function renderNoteText(container: HTMLElement, text: string): void {
    const lines = text.replace(/\r\n?/g, '\n').split('\n');

    lines.forEach((line, index) => {
        if (index > 0) container.createEl('br');
        renderInline(container, line);
    });
}

/** Shows the release date the way the reader writes dates, falling back to the raw value. */
function formatReleaseDate(date: string): string {
    const parsed = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return date;

    return parsed.toLocaleDateString(localeTag, { year: 'numeric', month: 'long', day: 'numeric' });
}

/** The What's new dialog. `onDismiss` runs once it is closed, however it was closed. */
export class WhatsNewModal extends Modal {
    private readonly releaseNotes: ReleaseNote[];
    private readonly onDismiss: () => void;
    private thanksButton: HTMLButtonElement | null = null;

    constructor(app: App, releaseNotes: ReleaseNote[], onDismiss: () => void) {
        super(app);
        this.releaseNotes = releaseNotes;
        this.onDismiss = onDismiss;
    }

    onOpen(): void {
        this.modalEl.addClass('better-paste-modal');
        this.titleEl.setText(strings.whatsNew.title);

        const scroll = this.contentEl.createDiv({ cls: 'better-paste-release-scroll' });
        scroll.setAttrs({ tabindex: '0', role: 'region', 'aria-label': strings.whatsNew.scrollLabel });
        for (const note of this.releaseNotes) this.renderRelease(scroll, note);

        this.contentEl.createDiv({ cls: 'better-paste-modal-divider' });
        this.contentEl.createEl('p', {
            cls: 'better-paste-modal-support',
            text: strings.whatsNew.support
        });

        const buttons = this.contentEl.createDiv({ cls: 'better-paste-modal-buttons' });

        const coffeeButton = buttons.createEl('button', { text: strings.whatsNew.coffeeButton, attr: { type: 'button' } });
        coffeeButton.addEventListener('click', () => {
            window.open(SUPPORT_BUY_ME_A_COFFEE_URL);
        });

        this.thanksButton = buttons.createEl('button', { cls: 'mod-cta', text: strings.whatsNew.thanksButton, attr: { type: 'button' } });
        this.thanksButton.addEventListener('click', () => {
            this.close();
        });
    }

    open(): void {
        super.open();

        // Focus the dismiss button rather than leaving it on the editor behind the dialog,
        // so Enter and Escape both close it. A phone shows no focus ring, so it is skipped.
        if (!Platform.isMobile) {
            window.requestAnimationFrame(() => this.thanksButton?.focus({ preventScroll: true }));
        }
    }

    onClose(): void {
        this.contentEl.empty();
        this.modalEl.removeClass('better-paste-modal');
        this.thanksButton = null;
        this.onDismiss();
    }

    private renderRelease(container: HTMLElement, note: ReleaseNote): void {
        const section = container.createDiv({ cls: 'better-paste-release' });
        section.createEl('h3', {
            text: format(strings.whatsNew.releaseHeading, { version: note.version, date: formatReleaseDate(note.date) })
        });

        if (note.banner) {
            const frame = section.createDiv({ cls: 'better-paste-release-banner' });
            const image = frame.createEl('img', { attr: { alt: '', loading: 'lazy', decoding: 'async' } });
            // Fetched from the repository, so the notes have to read without it offline
            image.addEventListener('error', () => frame.remove());
            image.src = releaseBannerUrl(note.banner);
        }

        if (note.info) renderNoteText(section.createEl('p', { cls: 'better-paste-release-info' }), note.info);

        for (const category of CATEGORIES) {
            const items = note[category.key];
            if (!items || items.length === 0) continue;

            section.createEl('h4', { cls: 'better-paste-release-category', text: category.label });
            const list = section.createEl('ul');
            for (const item of items) renderNoteText(list.createEl('li'), item);
        }
    }
}
