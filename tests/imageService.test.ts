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

import { describe, expect, it, vi } from 'vitest';
import { TFile } from 'obsidian';
import type { App } from 'obsidian';
import { ImageService } from '../src/paste/ImageService';
import { DEFAULT_SETTINGS } from '../src/settings/defaults';

function build() {
    const writes: { path: string; data: ArrayBuffer }[] = [];
    const app = {
        fileManager: {
            getAvailablePathForAttachment: async (fileName: string) => `Attachments/${fileName}`,
            generateMarkdownLink: (file: TFile, _sourcePath: string, _subpath?: string, alias?: string) =>
                `[[${file.path}${alias ? `|${alias}` : ''}]]`
        },
        vault: {
            createBinary: async (path: string, data: ArrayBuffer) => {
                writes.push({ path, data });
                const file = new TFile();
                file.path = path;
                return file;
            }
        }
    } as unknown as App;

    return { service: new ImageService(app, () => DEFAULT_SETTINGS), writes };
}

describe('ImageService', () => {
    it('stores an inline image and preserves its alt text', async () => {
        const { service, writes } = build();

        const result = await service.materializeImages('![a cat](data:image/png;base64,AA==)', 'Notes/Test.md');

        expect(result).toEqual({ text: '![[Attachments/pasted-image.png|a cat]]', downloaded: 1, failed: 0 });
        expect(writes).toHaveLength(1);
        expect(writes[0].data.byteLength).toBe(1);
    });

    it('keeps alt text together with a requested image size', async () => {
        const { service } = build();

        const result = await service.materializeImages('![a cat](data:image/png;base64,AA==)', 'Notes/Test.md', '400');

        expect(result.text).toBe('![[Attachments/pasted-image.png|a cat|400]]');
    });

    it('rejects an oversized clipboard file before reading its bytes', async () => {
        const { service, writes } = build();
        let bytesRead = false;
        const file = {
            name: 'large.png',
            type: 'image/png',
            size: 51 * 1024 * 1024,
            arrayBuffer: async () => {
                bytesRead = true;
                return new ArrayBuffer(0);
            }
        } as File;
        const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

        try {
            expect(await service.saveClipboardImage(file, '', 'Notes/Test.md')).toBeNull();
            expect(bytesRead).toBe(false);
            expect(writes).toHaveLength(0);
        } finally {
            warning.mockRestore();
        }
    });
});
