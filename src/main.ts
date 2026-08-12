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

import { Notice, Plugin } from 'obsidian';
import type { Editor, MarkdownFileInfo, MarkdownView } from 'obsidian';
import { ImageService } from './paste/ImageService';
import { PasteService } from './paste/PasteService';
import { BetterPasteSettingTab } from './settings/SettingTab';
import { DEFAULT_SETTINGS } from './settings/defaults';
import { normalizeSettings } from './settings/normalize';
import type { BetterPasteSettings } from './settings/types';

export default class BetterPastePlugin extends Plugin {
    settings: BetterPasteSettings = DEFAULT_SETTINGS;
    private pasteService!: PasteService;

    async onload(): Promise<void> {
        await this.loadSettings();

        const imageService = new ImageService(this.app, () => this.settings);
        this.pasteService = new PasteService(() => this.settings, imageService);

        this.registerEvent(
            this.app.workspace.on('editor-paste', (event: ClipboardEvent, editor: Editor, info: MarkdownView | MarkdownFileInfo) => {
                if (event.defaultPrevented) return;
                // The service inserts the transformed text itself when it takes over, so the
                // default paste has to be suppressed to avoid inserting the content twice.
                if (this.pasteService.handleEditorPaste(event, editor, info)) event.preventDefault();
            })
        );

        this.addCommand({
            id: 'paste-processed',
            name: 'Paste and clean up',
            editorCallback: (editor: Editor, info: MarkdownView | MarkdownFileInfo) => {
                void this.pasteService.pasteProcessed(editor, info);
            }
        });

        this.addCommand({
            id: 'paste-raw',
            name: 'Paste without processing',
            editorCallback: (editor: Editor) => {
                void this.pasteService.pasteRaw(editor);
            }
        });

        this.addCommand({
            id: 'clean-selection',
            name: 'Clean up selection',
            editorCallback: (editor: Editor) => {
                this.pasteService.cleanSelection(editor);
            }
        });

        this.addCommand({
            id: 'toggle-automatic-processing',
            name: 'Toggle automatic processing',
            callback: () => {
                void this.toggleAutomaticProcessing();
            }
        });

        this.addSettingTab(new BetterPasteSettingTab(this.app, this));
    }

    async loadSettings(): Promise<void> {
        this.settings = normalizeSettings(await this.loadData());
    }

    async saveSettings(): Promise<void> {
        await this.saveData(this.settings);
    }

    /** Flips the master paste switch and reports the new state, for use from a hotkey. */
    private async toggleAutomaticProcessing(): Promise<void> {
        this.settings.interceptPaste = !this.settings.interceptPaste;
        await this.saveSettings();
        new Notice(`Better Paste: automatic processing ${this.settings.interceptPaste ? 'on' : 'off'}`);
    }
}
