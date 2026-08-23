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

interface PendingFilePaste {
    editor: Editor;
    files: readonly ClipboardFileIdentity[];
    candidates: Set<TFile>;
    remaining: number;
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
    private disposed = false;

    constructor(app: App) {
        this.app = app;
        this.extension = EditorState.transactionFilter.of(transaction => this.filterTransaction(transaction));
    }

    /** Records a file paste before Obsidian saves or resolves its attachments. */
    arm(files: readonly File[], editor: Editor): void {
        if (this.disposed || files.length === 0) return;

        const identities = files.map(identityOf);
        const candidates = new Set<TFile>();
        for (const candidate of this.app.vault.getFiles()) {
            if (identities.some(identity => matchesClipboardFile(candidate, identity))) candidates.add(candidate);
        }

        const pending: PendingFilePaste = {
            editor,
            files: identities,
            candidates,
            remaining: files.length,
            timer: 0
        };
        pending.timer = window.setTimeout(() => this.remove(pending), FILE_PASTE_TIMEOUT_MS);
        this.pending.add(pending);
    }

    /** Adds a newly saved attachment to every paste whose clipboard names can produce it. */
    handleFileCreated(file: TAbstractFile): void {
        if (this.disposed || !(file instanceof TFile)) return;
        for (const pending of this.pending) {
            if (pending.files.some(identity => matchesClipboardFile(file, identity, true))) pending.candidates.add(file);
        }
    }

    /** Stops pending watches before the editor extension is unregistered. */
    dispose(): void {
        this.disposed = true;
        for (const pending of this.pending) window.clearTimeout(pending.timer);
        this.pending.clear();
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
        const match: { pending: PendingFilePaste | null } = { pending: null };

        transaction.changes.iterChanges((_fromA, _toA, fromB, _toB, inserted) => {
            const text = inserted.toString();
            const watchesToCheck = match.pending ? [match.pending] : watches;
            for (const pending of watchesToCheck) {
                for (const candidate of pending.candidates) {
                    const link = this.app.fileManager.generateMarkdownLink(candidate, sourcePath);
                    const embed = `!${link}`;
                    if (text !== embed && text !== `${embed}\n\n`) continue;

                    const visibleLink = link.startsWith('[](')
                        ? this.app.fileManager.generateMarkdownLink(candidate, sourcePath, undefined, candidate.name)
                        : link;
                    match.pending = pending;
                    replacements.push({ from: fromB, to: fromB + embed.length, insert: visibleLink });
                    return;
                }
            }
        });

        const matched = match.pending;
        if (replacements.length === 0 || matched === null) return transaction;

        matched.remaining -= 1;
        if (matched.remaining === 0) this.remove(matched);
        return [transaction, { changes: replacements, sequential: true }];
    }

    private remove(pending: PendingFilePaste): void {
        if (!this.pending.delete(pending)) return;
        window.clearTimeout(pending.timer);
    }
}
