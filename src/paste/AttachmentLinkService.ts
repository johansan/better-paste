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

import { EditorState } from '@codemirror/state';
import type { ChangeSpec, Extension, Transaction, TransactionSpec } from '@codemirror/state';
import { editorInfoField, TFile } from 'obsidian';
import type { App, Editor, TAbstractFile } from 'obsidian';

/** A native attachment can wait on a large local file before it reaches the editor. */
const FILE_PASTE_TIMEOUT_MS = 60_000;

interface ClipboardFileIdentity {
    name: string;
    basename: string;
    extension: string;
    pastedImageExtension: string | null;
}

interface PendingFileEntry {
    identity: ClipboardFileIdentity;
    candidates: { file: TFile; createdAfterArm: boolean }[];
    consumed: boolean;
}

interface PendingFilePaste {
    editor: Editor;
    entries: PendingFileEntry[];
    claimedCandidates: Set<TFile>;
    timer: number;
}

function splitFileName(name: string): { basename: string; extension: string } {
    const dot = name.lastIndexOf('.');
    if (dot <= 0 || dot === name.length - 1) return { basename: name, extension: '' };
    return { basename: name.slice(0, dot), extension: name.slice(dot + 1) };
}

function identityOf(file: File): ClipboardFileIdentity {
    const name = file.name.split(/[\\/]/).pop() ?? '';
    const split = splitFileName(name);
    const mimeType = file.type.toLowerCase();
    const mimeExtension = mimeType.includes('/') ? mimeType.slice(mimeType.lastIndexOf('/') + 1).split('+')[0] : '';
    const extension = split.extension || mimeExtension;
    return {
        name: name.toLowerCase(),
        basename: split.basename.toLowerCase(),
        extension: extension.toLowerCase(),
        // Obsidian renames pathless PNG and JPEG clipboard data even when File.name is specific.
        // JPEG is also normalized from .jpeg to .jpg on that native path.
        pastedImageExtension: mimeType === 'image/png' ? 'png' : mimeType === 'image/jpeg' ? 'jpg' : null
    };
}

/** True when a vault file can be the attachment created or resolved for a clipboard file. */
function matchesClipboardFile(candidate: TFile, clipboard: ClipboardFileIdentity, newlyCreated = false): boolean {
    const candidateName = candidate.name.toLowerCase();
    if (clipboard.name && candidateName === clipboard.name) return true;

    const candidateBase = candidate.basename.toLowerCase();
    const candidateExtension = candidate.extension.toLowerCase();
    if (clipboard.basename && (!clipboard.extension || candidateExtension === clipboard.extension)) {
        const collisionPrefix = `${clipboard.basename} `;
        const collisionSuffix = candidateBase.startsWith(collisionPrefix) ? candidateBase.slice(collisionPrefix.length) : '';
        if (collisionSuffix !== '' && /^\d+$/.test(collisionSuffix)) return true;
    }

    return newlyCreated && clipboard.pastedImageExtension === candidateExtension && candidateBase.startsWith('pasted image ');
}

/**
 * Rewrites the embeds produced by Obsidian's native file paste while leaving attachment
 * naming, placement and collision handling to the app.
 */
export class AttachmentLinkService {
    readonly extension: Extension;
    private readonly app: App;
    private readonly pending = new Set<PendingFilePaste>();
    private readonly claimedCandidates = new Set<TFile>();
    private disposed = false;

    constructor(app: App) {
        this.app = app;
        this.extension = EditorState.transactionFilter.of(transaction => this.filterTransaction(transaction));
    }

    /** Records a file paste before Obsidian saves or resolves its attachments. */
    arm(files: readonly File[], editor: Editor): void {
        if (this.disposed || files.length === 0) return;

        const identities = files.map(identityOf);
        const entries = identities.map<PendingFileEntry>(identity => ({
            identity,
            candidates: this.app.vault
                .getFiles()
                .filter(file => !this.claimedCandidates.has(file) && matchesClipboardFile(file, identity))
                .map(file => ({ file, createdAfterArm: false })),
            consumed: false
        }));

        const pending: PendingFilePaste = {
            editor,
            entries,
            claimedCandidates: new Set(),
            timer: 0
        };
        pending.timer = window.setTimeout(() => this.remove(pending), FILE_PASTE_TIMEOUT_MS);
        this.pending.add(pending);
    }

    /** Assigns a newly saved attachment to the first matching unfilled clipboard entry. */
    handleFileCreated(file: TAbstractFile): void {
        if (this.disposed || !(file instanceof TFile) || this.claimedCandidates.has(file)) return;
        for (const pending of this.pending) {
            const entry = pending.entries.find(
                item =>
                    !item.consumed &&
                    !item.candidates.some(candidate => candidate.createdAfterArm) &&
                    matchesClipboardFile(file, item.identity, true)
            );
            if (!entry) continue;
            // A create event can also come from sync. The inserted-link match is the second
            // provenance gate, though an indistinguishable sync file remains inherently ambiguous.
            entry.candidates.push({ file, createdAfterArm: true });
            pending.claimedCandidates.add(file);
            this.claimedCandidates.add(file);
            return;
        }
    }

    /** Stops pending watches before the editor extension is unregistered. */
    dispose(): void {
        this.disposed = true;
        for (const pending of Array.from(this.pending)) this.remove(pending);
    }

    private filterTransaction(transaction: Transaction): TransactionSpec | readonly TransactionSpec[] {
        if (this.disposed || this.pending.size === 0 || !transaction.docChanged) return transaction;

        const info = transaction.startState.field(editorInfoField, false);
        const editor = info?.editor;
        if (!editor) return transaction;

        const watches = Array.from(this.pending).filter(pending => pending.editor === editor);
        if (watches.length === 0) return transaction;

        const sourcePath = info.file?.path ?? '';
        const replacements: ChangeSpec[] = [];

        transaction.changes.iterChanges((_fromA, _toA, fromB, _toB, inserted) => {
            const text = inserted.toString();
            const consumedRanges: { from: number; to: number }[] = [];
            while (true) {
                let found: {
                    pending: PendingFilePaste;
                    entry: PendingFileEntry;
                    candidate: TFile;
                    link: string;
                    embed: string;
                    index: number;
                } | null = null;
                for (const pending of watches) {
                    for (const entry of pending.entries) {
                        if (entry.consumed) continue;
                        for (const observation of entry.candidates) {
                            if (!observation.createdAfterArm && this.claimedCandidates.has(observation.file)) continue;
                            const candidate = observation.file;
                            const link = this.app.fileManager.generateMarkdownLink(candidate, sourcePath);
                            const embed = `!${link}`;
                            let index = text.indexOf(embed);
                            while (index >= 0 && consumedRanges.some(range => index < range.to && index + embed.length > range.from)) {
                                index = text.indexOf(embed, index + embed.length);
                            }
                            if (index < 0) continue;
                            if (found === null || index < found.index) {
                                found = {
                                    pending,
                                    entry,
                                    candidate,
                                    link,
                                    embed,
                                    index
                                };
                            }
                        }
                    }
                }
                if (found === null) break;

                const { pending, entry, candidate, link, embed, index } = found;
                entry.consumed = true;
                pending.claimedCandidates.add(candidate);
                this.claimedCandidates.add(candidate);
                consumedRanges.push({ from: index, to: index + embed.length });
                const visibleLink = link.startsWith('[](')
                    ? this.app.fileManager.generateMarkdownLink(candidate, sourcePath, undefined, candidate.name)
                    : link;
                replacements.push({ from: fromB + index, to: fromB + index + embed.length, insert: visibleLink });
                if (pending.entries.every(item => item.consumed)) this.remove(pending);
            }
        });

        if (replacements.length === 0) return transaction;
        return [transaction, { changes: replacements, sequential: true }];
    }

    private remove(pending: PendingFilePaste): void {
        if (!this.pending.delete(pending)) return;
        window.clearTimeout(pending.timer);
        for (const candidate of pending.claimedCandidates) this.claimedCandidates.delete(candidate);
    }
}
