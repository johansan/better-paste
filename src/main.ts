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
import { AttachmentLinkService } from './paste/AttachmentLinkService';
import { ImageService } from './paste/ImageService';
import { LinkTitleService } from './paste/LinkTitleService';
import { PasteService } from './paste/PasteService';
import { ImageEmbedModal } from './modals/ImageEmbedModal';
import type { ImageEmbedChoice } from './modals/ImageEmbedModal';
import { PdfCleanupModal } from './modals/PdfCleanupModal';
import type { PdfCleanupOptions } from './transforms/pdfText';
import { WelcomeModal } from './modals/WelcomeModal';
import { WhatsNewModal } from './modals/WhatsNewModal';
import { PluginOverlapModal } from './modals/PluginOverlapModal';
import { findOverlappingPlugins } from './pluginOverlap';
import { BetterPasteSettingTab } from './settings/SettingTab';
import { TextSnippetPickerModal } from './settings/TextSnippetPickerModal';
import { format, strings } from './i18n';
import { logError } from './utils/logger';
import { DEFAULT_SETTINGS } from './settings/defaults';
import { normalizeSettings } from './settings/normalize';
import {
    compareVersions,
    getLatestReleaseNotes,
    getReleaseNotesForUpdate,
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

/**
 * Device-local marker set when the user ticks "Don't remind me again" in the overlapping
 * plugins dialog. Kept out of data.json so one device's choice does not silence another.
 */
const OVERLAP_DISMISSED_KEY = 'better-paste-overlap-dismissed';

export default class BetterPastePlugin extends Plugin {
    settings: BetterPasteSettings = DEFAULT_SETTINGS;
    private pasteService!: PasteService;
    private attachmentLinkService!: AttachmentLinkService;
    /** The image options dialog while it is open, closed on unload so it cannot outlive the plugin. */
    private imageModal: ImageEmbedModal | null = null;
    /** The PDF cleanup dialog while it is open, closed on unload for the same reason. */
    private pdfModal: PdfCleanupModal | null = null;
    /** The snippet picker while it is open, closed on unload so it cannot outlive the plugin. */
    private snippetPickerModal: TextSnippetPickerModal | null = null;
    private startupModal: WelcomeModal | WhatsNewModal | null = null;
    private overlapModal: PluginOverlapModal | null = null;
    /** Set on unload, so deferred callbacks and dialog closes stop touching the plugin. */
    private unloaded = false;

    async onload(): Promise<void> {
        await this.loadSettings();

        const imageService = new ImageService(this.app, () => this.settings);
        const linkTitleService = new LinkTitleService(() => this.settings);
        this.attachmentLinkService = new AttachmentLinkService(this.app);
        this.registerEditorExtension(this.attachmentLinkService.extension);
        this.registerEvent(this.app.vault.on('create', file => this.attachmentLinkService.handleFileCreated(file)));
        this.pasteService = new PasteService(
            () => this.settings,
            imageService,
            linkTitleService,
            (sizes, classes) => this.promptImageOptions(sizes, classes),
            text => this.promptPdfOptions(text),
            (files, editor) => this.attachmentLinkService.arm(files, editor)
        );

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
            name: strings.commands.paste,
            editorCallback: (editor: Editor, info: MarkdownView | MarkdownFileInfo) => {
                void this.pasteService.pasteProcessed(editor, info);
            }
        });

        this.addCommand({
            id: 'paste-raw',
            name: strings.commands.pasteRaw,
            editorCallback: (editor: Editor, info: MarkdownView | MarkdownFileInfo) => {
                void this.pasteService.pasteRaw(editor, info);
            }
        });

        // Ids are permanent and name the target first: "selection-<what>". Never reuse a retired id.
        this.addCommand({
            id: 'selection-clean',
            name: strings.commands.cleanSelection,
            editorCallback: (editor: Editor) => {
                this.pasteService.cleanSelection(editor);
            }
        });

        this.addCommand({
            id: 'selection-clean-terminal',
            name: strings.commands.cleanTerminal,
            editorCallback: (editor: Editor) => {
                this.pasteService.cleanTerminalSelection(editor);
            }
        });

        this.addCommand({
            id: 'selection-clean-pdf',
            name: strings.commands.cleanPdf,
            editorCallback: (editor: Editor) => {
                void this.pasteService.cleanPdfSelection(editor);
            }
        });

        this.addCommand({
            id: 'selection-run-snippet',
            name: strings.commands.runSnippet,
            editorCheckCallback: (checking: boolean, editor: Editor) => {
                if (this.settings.textSnippets.length === 0 && this.settings.urlSnippets.length === 0) return false;
                if (!checking) this.openSnippetPicker(editor);
                return true;
            }
        });

        this.addCommand({
            id: 'selection-commas-inside',
            name: strings.commands.commasInside,
            editorCallback: (editor: Editor) => {
                this.pasteService.placeCommas(editor, 'inside');
            }
        });

        this.addCommand({
            id: 'selection-commas-outside',
            name: strings.commands.commasOutside,
            editorCallback: (editor: Editor) => {
                this.pasteService.placeCommas(editor, 'outside');
            }
        });

        this.addCommand({
            id: 'toggle-cleanup',
            name: strings.commands.toggleCleanup,
            callback: () => {
                void this.toggleAutomaticProcessing();
            }
        });

        this.addSettingTab(new BetterPasteSettingTab(this.app, this));

        // Deferred so a dialog never opens over a workspace that is still being restored
        this.app.workspace.onLayoutReady(() => {
            if (this.unloaded) return;
            this.showStartupDialog().catch(error => logError('Could not show the startup dialog', error));
            this.showOverlapWarning();
        });
    }

    onunload(): void {
        this.unloaded = true;
        this.imageModal?.close();
        this.pdfModal?.close();
        this.snippetPickerModal?.close();
        this.startupModal?.close();
        this.overlapModal?.close();
        // An image write may still be in flight; this stops it editing a note that the
        // plugin no longer owns
        this.pasteService.dispose();
        this.attachmentLinkService.dispose();
    }

    /**
     * Warns while a plugin Better Paste replaces is still enabled. Shown on every start,
     * because the overlap makes each paste run through two handlers until it is removed,
     * unless the user has ticked "Don't remind me again" on this device.
     */
    private showOverlapWarning(): void {
        const dismissed: unknown = this.app.loadLocalStorage(OVERLAP_DISMISSED_KEY);
        if (dismissed === true) return;
        const overlaps = findOverlappingPlugins(this.app);
        if (overlaps.length === 0) return;
        this.overlapModal = new PluginOverlapModal(this.app, overlaps, dontRemind => {
            // Closed by unload rather than by the user, so no choice was made
            if (this.unloaded) return;
            if (dontRemind) this.app.saveLocalStorage(OVERLAP_DISMISSED_KEY, true);
        });
        this.overlapModal.open();
    }

    /** Opens the image options dialog and remembers the picks for the next paste. */
    private promptImageOptions(sizes: readonly string[] | null, classes: readonly string[] | null): Promise<ImageEmbedChoice | null> {
        return new Promise(resolve => {
            this.imageModal = new ImageEmbedModal(
                this.app,
                { sizes, classes, initialSize: this.settings.imageLastSize, initialClass: this.settings.imageLastClass },
                choice => {
                    this.imageModal = null;
                    if (choice) {
                        if (sizes) this.settings.imageLastSize = choice.size ?? '';
                        if (classes) this.settings.imageLastClass = choice.cssClass ?? '';
                        void this.saveSettings();
                    }
                    resolve(choice);
                }
            );
            this.imageModal.open();
        });
    }

    /** Opens the PDF cleanup dialog and remembers the picks for the next run. */
    private promptPdfOptions(text: string): Promise<PdfCleanupOptions | null> {
        return new Promise(resolve => {
            this.pdfModal = new PdfCleanupModal(
                this.app,
                text,
                {
                    removeFurniture: this.settings.pdfLastFurniture,
                    singleParagraph: this.settings.pdfLastSingleParagraph
                },
                options => {
                    this.pdfModal = null;
                    if (options) {
                        this.settings.pdfLastFurniture = options.removeFurniture;
                        this.settings.pdfLastSingleParagraph = options.singleParagraph;
                        void this.saveSettings();
                    }
                    resolve(options);
                }
            );
            this.pdfModal.open();
        });
    }

    /** Opens every stored snippet for an explicit run against the editor selection. */
    private openSnippetPicker(editor: Editor): void {
        const selection = editor.getSelection();
        // A single selection only: getSelection reads one text, but replaceSelection
        // would write that text into every cursor's range
        if (!selection || editor.listSelections().length > 1) {
            new Notice(format(strings.notices.prefix, { message: strings.notices.selectTextFirst }));
            return;
        }

        this.snippetPickerModal?.close();
        // URL snippets are offered too, so a titled link in a note can be reworked afterwards
        const urlSnippetIds = new Set(this.settings.urlSnippets.map(snippet => snippet.id));
        const snippets = [...this.settings.textSnippets, ...this.settings.urlSnippets];
        this.snippetPickerModal = new TextSnippetPickerModal(this.app, snippets, snippet => {
            this.snippetPickerModal = null;
            if (this.unloaded) return;
            this.pasteService.runSnippet(editor, snippet, urlSnippetIds.has(snippet.id));
        });
        this.snippetPickerModal.open();
    }

    async loadSettings(): Promise<void> {
        this.settings = normalizeSettings(await this.loadData());
    }

    async saveSettings(): Promise<void> {
        await this.saveData(this.settings);
    }

    /** Flips the master paste switch and reports the new state, for use from a hotkey. */
    private async toggleAutomaticProcessing(): Promise<void> {
        this.settings.autoClean = !this.settings.autoClean;
        await this.saveSettings();
        const message = this.settings.autoClean ? strings.notices.cleanupOn : strings.notices.cleanupOff;
        new Notice(format(strings.notices.prefix, { message }));
    }

    /** Opens the release notes on demand, from the button in settings. */
    showWhatsNew(): void {
        this.openWhatsNew(getLatestReleaseNotes());
    }

    /**
     * The welcome dialog on a first run, the release notes after an upgrade, nothing
     * otherwise. An upgrade shows every release since the one last shown, so a version
     * installed and skipped still gets its notes read, padded with a few earlier releases
     * so the dialog carries some history.
     */
    private async showStartupDialog(): Promise<void> {
        const currentVersion = this.manifest.version;
        const lastShownVersion = this.getLastShownVersion();

        // No marker at all means the plugin has not run in this vault before
        if (!lastShownVersion) {
            this.startupModal = new WelcomeModal(this.app);
            this.startupModal.open();
            await this.advanceLastShownVersion(currentVersion);
            return;
        }

        // A downgrade must not record the older version, because that would reopen the
        // dialog on whichever device is still running the newer one
        if (compareVersions(currentVersion, lastShownVersion) <= 0) return;

        // With the dialog switched off the marker still advances, so switching it back
        // on later starts from here instead of replaying every release missed meanwhile
        if (!this.settings.showReleaseNotes) {
            await this.advanceLastShownVersion(currentVersion);
            return;
        }

        if (!shouldAutoDisplayReleaseNotesForUpdate(lastShownVersion, currentVersion)) return;

        this.openWhatsNew(getReleaseNotesForUpdate(lastShownVersion, currentVersion));
    }

    private openWhatsNew(releaseNotes: ReleaseNote[]): void {
        this.startupModal = new WhatsNewModal(this.app, releaseNotes, () => {
            // Closed by unload rather than by the user: leaving the marker alone means
            // the dialog simply shows again next time, while advancing it here would
            // write through a plugin instance that no longer owns its settings
            if (this.unloaded) return;
            this.advanceLastShownVersion(this.manifest.version).catch(error => logError('Could not record the shown release notes', error));
        });
        this.startupModal.open();
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
        // Merged over what is on disk right now rather than saving the whole in-memory
        // object: another device may have synced newer settings while the dialog stood
        // open, and this marker write must not roll them back
        const stored: unknown = await this.loadData();
        const base = stored && typeof stored === 'object' ? (stored as Record<string, unknown>) : {};
        await this.saveData({ ...base, lastShownVersion: candidate });
    }
}
