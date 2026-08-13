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

import type { Editor, EditorPosition } from 'obsidian';

/**
 * A document model implementing the handful of Editor methods PasteService uses.
 * Offsets are the source of truth; line/ch positions are derived, which mirrors how
 * CodeMirror behaves and keeps the offset arithmetic under test honest.
 */
export class FakeEditor {
    private value: string;
    private anchor: number;
    private head: number;

    constructor(value = '', anchor = value.length, head = anchor) {
        this.value = value;
        this.anchor = anchor;
        this.head = head;
    }

    getValue(): string {
        return this.value;
    }

    getSelection(): string {
        return this.value.slice(Math.min(this.anchor, this.head), Math.max(this.anchor, this.head));
    }

    getCursor(which?: 'from' | 'to' | 'head' | 'anchor'): EditorPosition {
        if (which === 'from') return this.offsetToPos(Math.min(this.anchor, this.head));
        if (which === 'to') return this.offsetToPos(Math.max(this.anchor, this.head));
        if (which === 'anchor') return this.offsetToPos(this.anchor);
        return this.offsetToPos(this.head);
    }

    setCursor(pos: EditorPosition): void {
        this.anchor = this.posToOffset(pos);
        this.head = this.anchor;
    }

    setSelection(anchor: number, head: number): void {
        this.anchor = anchor;
        this.head = head;
    }

    posToOffset(pos: EditorPosition): number {
        const lines = this.value.split('\n');
        let offset = 0;
        for (let line = 0; line < pos.line && line < lines.length; line++) offset += lines[line].length + 1;
        return offset + pos.ch;
    }

    offsetToPos(offset: number): EditorPosition {
        const clamped = Math.max(0, Math.min(offset, this.value.length));
        const before = this.value.slice(0, clamped);
        const line = before.split('\n').length - 1;
        const lineStart = before.lastIndexOf('\n') + 1;
        return { line, ch: clamped - lineStart };
    }

    replaceSelection(text: string): void {
        const from = Math.min(this.anchor, this.head);
        const to = Math.max(this.anchor, this.head);
        this.value = this.value.slice(0, from) + text + this.value.slice(to);
        this.anchor = from + text.length;
        this.head = this.anchor;
    }

    replaceRange(text: string, from: EditorPosition, to: EditorPosition): void {
        const fromOffset = this.posToOffset(from);
        const toOffset = this.posToOffset(to);
        this.value = this.value.slice(0, fromOffset) + text + this.value.slice(toOffset);
        this.anchor = fromOffset + text.length;
        this.head = this.anchor;
    }

    /** Types text at the current cursor, used to simulate the user editing mid-download. */
    typeAt(offset: number, text: string): void {
        this.value = this.value.slice(0, offset) + text + this.value.slice(offset);
        this.anchor = offset + text.length;
        this.head = this.anchor;
    }

    asEditor(): Editor {
        return this as unknown as Editor;
    }
}

/** A File stand-in carrying fixed bytes, since Node's File is awkward to build in bulk. */
export function fakeFile(name: string, type: string, bytes = 8): File {
    const data = new Uint8Array(bytes).buffer;
    return {
        name,
        type,
        size: bytes,
        arrayBuffer: async () => data
    } as unknown as File;
}

/** Builds a ClipboardEvent-shaped object carrying the given clipboard flavours. */
export function fakeClipboardEvent(data: { plain?: string; html?: string; files?: File[]; fileCount?: number }): ClipboardEvent {
    let prevented = false;
    const files =
        data.files ?? Array.from({ length: data.fileCount ?? 0 }, (_unused, index) => fakeFile(`image-${index}.png`, 'image/png'));

    return {
        get defaultPrevented() {
            return prevented;
        },
        preventDefault() {
            prevented = true;
        },
        clipboardData: {
            files,
            getData(type: string) {
                if (type === 'text/plain') return data.plain ?? '';
                if (type === 'text/html') return data.html ?? '';
                return '';
            }
        }
    } as unknown as ClipboardEvent;
}
