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
import { afterEach, describe, expect, it, vi } from 'vitest';
import { editorInfoField, TFile } from 'obsidian';
import type { App, Editor } from 'obsidian';
import { AttachmentLinkService } from '../src/paste/AttachmentLinkService';
import { fakeFile } from './stubs/editor';
import { setEditorInfoForTest } from './stubs/obsidian';

const services: AttachmentLinkService[] = [];

function vaultFile(path: string): TFile {
    const file = new TFile();
    file.path = path;
    const name = file.name;
    const dot = name.lastIndexOf('.');
    file.basename = dot < 0 ? name : name.slice(0, dot);
    file.extension = dot < 0 ? '' : name.slice(dot + 1);
    return file;
}

function build(files: TFile[] = [], markdownLinks = false): { service: AttachmentLinkService; app: App } {
    const app = {
        vault: { getFiles: () => files },
        fileManager: {
            generateMarkdownLink: (file: TFile, _sourcePath: string, _subpath?: string, alias?: string) =>
                markdownLinks ? `[${alias ?? ''}](${file.path})` : `[[${file.path}]]`
        }
    } as unknown as App;
    const service = new AttachmentLinkService(app);
    services.push(service);
    return { service, app };
}

function arm(service: AttachmentLinkService, files: readonly File[], editor: Editor): void {
    service.arm(files, editor);
}

function editorState(service: AttachmentLinkService, editor: Editor, doc = ''): EditorState {
    setEditorInfoForTest({ editor, file: { path: 'Notes/Test.md' } });
    return EditorState.create({ doc, extensions: [editorInfoField, service.extension] });
}

function insert(state: EditorState, text: string): EditorState {
    return state.update({ changes: { from: state.doc.length, insert: text } }).state;
}

afterEach(() => {
    for (const service of services.splice(0)) service.dispose();
    vi.useRealTimers();
});

describe('AttachmentLinkService', () => {
    it('turns a newly created native embed into a wikilink in the same transaction', () => {
        const { service } = build();
        const editor = {} as Editor;
        const attachment = vaultFile('Attachments/Document.pdf');
        arm(service, [fakeFile('Document.pdf', 'application/pdf')], editor);
        service.handleFileCreated(attachment);

        const state = insert(editorState(service, editor), '![[Attachments/Document.pdf]]');

        expect(state.doc.toString()).toBe('[[Attachments/Document.pdf]]');
    });

    it('adds visible text to Obsidian Markdown links for attachments', () => {
        const { service } = build([], true);
        const editor = {} as Editor;
        const attachment = vaultFile('Attachments/Document.pdf');
        arm(service, [fakeFile('Document.pdf', 'application/pdf')], editor);
        service.handleFileCreated(attachment);

        const state = insert(editorState(service, editor), '![](Attachments/Document.pdf)');

        expect(state.doc.toString()).toBe('[Document.pdf](Attachments/Document.pdf)');
    });

    it('matches a file Obsidian resolves from the vault without a create event', () => {
        const attachment = vaultFile('Attachments/Document.pdf');
        const { service } = build([attachment]);
        const editor = {} as Editor;
        arm(service, [fakeFile('Document.pdf', 'application/pdf')], editor);

        const state = insert(editorState(service, editor), '![[Attachments/Document.pdf]]');

        expect(state.doc.toString()).toBe('[[Attachments/Document.pdf]]');
    });

    it('matches the same existing vault attachment in sequential pastes', () => {
        const attachment = vaultFile('Attachments/Document.pdf');
        const { service } = build([attachment]);
        const editor = {} as Editor;
        let state = editorState(service, editor);

        arm(service, [fakeFile('Document.pdf', 'application/pdf')], editor);
        state = insert(state, '![[Attachments/Document.pdf]]');
        arm(service, [fakeFile('Document.pdf', 'application/pdf')], editor);
        state = insert(state, '![[Attachments/Document.pdf]]');

        expect(state.doc.toString()).toBe('[[Attachments/Document.pdf]][[Attachments/Document.pdf]]');
    });

    it('releases created-file claims when a watch expires', () => {
        vi.useFakeTimers();
        const files: TFile[] = [];
        const attachment = vaultFile('Attachments/Document.pdf');
        const { service } = build(files);
        const editor = {} as Editor;

        arm(service, [fakeFile('Document.pdf', 'application/pdf')], editor);
        service.handleFileCreated(attachment);
        files.push(attachment);
        vi.advanceTimersByTime(60_000);

        arm(service, [fakeFile('Document.pdf', 'application/pdf')], editor);
        const state = insert(editorState(service, editor), '![[Attachments/Document.pdf]]');

        expect(state.doc.toString()).toBe('[[Attachments/Document.pdf]]');
    });

    it('matches Obsidian collision names and generic screenshot names', () => {
        const { service } = build();
        const editor = {} as Editor;
        arm(service, [fakeFile('Document.pdf', 'application/pdf'), fakeFile('image.png', 'image/png')], editor);
        service.handleFileCreated(vaultFile('Attachments/Document 1.pdf'));
        service.handleFileCreated(vaultFile('Attachments/Pasted image 20260823120000.png'));

        let state = editorState(service, editor);
        state = insert(state, '![[Attachments/Document 1.pdf]]');
        state = insert(state, '![[Attachments/Pasted image 20260823120000.png]]');

        expect(state.doc.toString()).toBe('[[Attachments/Document 1.pdf]][[Attachments/Pasted image 20260823120000.png]]');
    });

    it('matches pathless images that Obsidian renames and normalizes to JPG', () => {
        const { service } = build();
        const editor = {} as Editor;
        arm(service, [fakeFile('IMG_1234.png', 'image/png'), fakeFile('IMG_5678.jpeg', 'image/jpeg')], editor);
        service.handleFileCreated(vaultFile('Attachments/Pasted image 20260823120000.png'));
        service.handleFileCreated(vaultFile('Attachments/Pasted image 20260823120001.jpg'));

        let state = editorState(service, editor);
        state = insert(state, '![[Attachments/Pasted image 20260823120000.png]]');
        state = insert(state, '![[Attachments/Pasted image 20260823120001.jpg]]');

        expect(state.doc.toString()).toBe('[[Attachments/Pasted image 20260823120000.png]][[Attachments/Pasted image 20260823120001.jpg]]');
    });

    it('ignores ordinary embeds and transactions from another editor', () => {
        const attachment = vaultFile('Attachments/Document.pdf');
        const { service } = build([attachment]);
        const watchedEditor = {} as Editor;
        arm(service, [fakeFile('Document.pdf', 'application/pdf')], watchedEditor);

        let state = editorState(service, watchedEditor);
        state = insert(state, '![[Attachments/Other.pdf]]');
        expect(state.doc.toString()).toBe('![[Attachments/Other.pdf]]');

        const otherEditor = {} as Editor;
        state = insert(editorState(service, otherEditor), '![[Attachments/Document.pdf]]');
        expect(state.doc.toString()).toBe('![[Attachments/Document.pdf]]');
    });

    it('disarms after every file in a multi-file paste is inserted', () => {
        const document = vaultFile('Attachments/Document.pdf');
        const sheet = vaultFile('Attachments/Sheet.csv');
        const { service } = build([document, sheet]);
        const editor = {} as Editor;
        arm(service, [fakeFile('Document.pdf', 'application/pdf'), fakeFile('Sheet.csv', 'text/csv')], editor);

        let state = editorState(service, editor);
        state = insert(state, '![[Attachments/Document.pdf]]');
        state = insert(state, '![[Attachments/Sheet.csv]]');
        state = insert(state, '![[Attachments/Document.pdf]]');

        expect(state.doc.toString()).toBe('[[Attachments/Document.pdf]][[Attachments/Sheet.csv]]![[Attachments/Document.pdf]]');
    });

    it('consumes repeated file names once each when one transaction inserts several embeds', () => {
        const { service } = build();
        const editor = {} as Editor;
        arm(service, [fakeFile('Document.pdf', 'application/pdf'), fakeFile('Document.pdf', 'application/pdf')], editor);
        service.handleFileCreated(vaultFile('Attachments/Document.pdf'));
        service.handleFileCreated(vaultFile('Attachments/Document 1.pdf'));

        let state = editorState(service, editor);
        state = insert(state, '![[Attachments/Document.pdf]]\n![[Attachments/Document 1.pdf]]');
        state = insert(state, '![[Attachments/Document.pdf]]');

        expect(state.doc.toString()).toBe('[[Attachments/Document.pdf]]\n[[Attachments/Document 1.pdf]]![[Attachments/Document.pdf]]');
    });
});
