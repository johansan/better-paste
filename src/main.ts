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
import { WelcomeModal } from './modals/WelcomeModal';
import { WhatsNewModal } from './modals/WhatsNewModal';
import { BetterPasteSettingTab } from './settings/SettingTab';
import { DEFAULT_SETTINGS } from './settings/defaults';
import { normalizeSettings } from './settings/normalize';
import {
    compareVersions,
    getLatestReleaseNotes,
    getReleaseNotesBetweenVersions,
    normalizeVersion,
    shouldAutoDisplayReleaseNotesForUpdate
} from './releaseNotes';
import type { ReleaseNote } from './releaseNotes';
import type { BetterPasteSettings } from './settings/types';

/**
 * Device-local copy of the version whose release notes have been shown. The same value is
 * stored in data.json, and the newer of the two wins: the synced copy stops the dialog
 * reappearing on a second device, while this one stops a stale settings file reopening it
 * on a device that has already seen it.
 */
const LAST_SHOWN_VERSION_KEY = 'better-paste-last-shown-version';

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
            id: 'paste',
            name: 'Paste',
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
            id: 'clean',
            name: 'Clean up selection',
            editorCallback: (editor: Editor) => {
                this.pasteService.cleanSelection(editor);
            }
        });

        this.addCommand({
            id: 'toggle-cleanup',
            name: 'Toggle automatic cleanup',
            callback: () => {
                void this.toggleAutomaticProcessing();
            }
        });

        this.addSettingTab(new BetterPasteSettingTab(this.app, this));

        // Deferred so a dialog never opens over a workspace that is still being restored
        this.app.workspace.onLayoutReady(() => {
            void this.showStartupDialog();
        });
    }

    onunload(): void {
        // An image write may still be in flight; this stops it editing a note that the
        // plugin no longer owns
        this.pasteService.dispose();
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

    /** Opens the release notes on demand, from the button in settings. */
    showWhatsNew(): void {
        this.openWhatsNew(getLatestReleaseNotes());
    }

    /**
     * The welcome dialog on a first run, the release notes after an upgrade, nothing
     * otherwise. An upgrade shows every release since the one last shown, so a version
     * installed and skipped still gets its notes read.
     */
    private async showStartupDialog(): Promise<void> {
        const currentVersion = this.manifest.version;
        const lastShownVersion = this.getLastShownVersion();

        // No marker at all means the plugin has not run in this vault before
        if (!lastShownVersion) {
            new WelcomeModal(this.app).open();
            await this.advanceLastShownVersion(currentVersion);
            return;
        }

        // A downgrade must not record the older version, because that would reopen the
        // dialog on whichever device is still running the newer one
        if (compareVersions(currentVersion, lastShownVersion) <= 0) return;
        if (!shouldAutoDisplayReleaseNotesForUpdate(lastShownVersion, currentVersion)) return;

        this.openWhatsNew(getReleaseNotesBetweenVersions(lastShownVersion, currentVersion));
    }

    private openWhatsNew(releaseNotes: ReleaseNote[]): void {
        new WhatsNewModal(this.app, releaseNotes, () => {
            void this.advanceLastShownVersion(this.manifest.version);
        }).open();
    }

    /** The newer of the two markers, discarding anything that is not a version. */
    private getLastShownVersion(): string {
        const stored = normalizeVersion(this.settings.lastShownVersion);
        const localValue: unknown = this.app.loadLocalStorage(LAST_SHOWN_VERSION_KEY);
        const local = normalizeVersion(localValue);
        const version = compareVersions(stored, local) >= 0 ? stored : local;

        // Carry a newer synced marker onto this device, otherwise a settings file that
        // syncs back from an older device would roll the marker back and repeat the dialog
        if (version && version !== local) this.app.saveLocalStorage(LAST_SHOWN_VERSION_KEY, version);

        return version;
    }

    /** Moves both markers forward. Neither is ever moved back. */
    private async advanceLastShownVersion(version: string): Promise<void> {
        const candidate = normalizeVersion(version);
        if (!candidate || compareVersions(candidate, this.getLastShownVersion()) <= 0) return;

        // Written before data.json, because the local marker is what still suppresses the
        // dialog if the settings write fails or is later overwritten by a stale device
        this.app.saveLocalStorage(LAST_SHOWN_VERSION_KEY, candidate);
        this.settings.lastShownVersion = candidate;
        await this.saveSettings();
    }
}
