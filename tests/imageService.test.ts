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
import type { BetterPasteSettings } from '../src/settings/types';

function build(overrides: Partial<BetterPasteSettings> = {}) {
    const writes: { path: string; data: ArrayBuffer }[] = [];
    const existing = new Set<string>();
    const app = {
        fileManager: {
            getAvailablePathForAttachment: async (fileName: string) => {
                const dot = fileName.lastIndexOf('.');
                const base = dot >= 0 ? fileName.slice(0, dot) : fileName;
                const extension = dot >= 0 ? fileName.slice(dot) : '';
                let path = `Attachments/${fileName}`;
                for (let suffix = 1; existing.has(path); suffix++) path = `Attachments/${base} ${suffix}${extension}`;
                return path;
            },
            generateMarkdownLink: (file: TFile, _sourcePath: string, _subpath?: string, alias?: string) =>
                `[[${file.path}${alias ? `|${alias}` : ''}]]`
        },
        vault: {
            createBinary: async (path: string, data: ArrayBuffer) => {
                existing.add(path);
                writes.push({ path, data });
                const file = new TFile();
                file.path = path;
                return file;
            }
        }
    } as unknown as App;

    const settings = { ...DEFAULT_SETTINGS, ...overrides };
    return { service: new ImageService(app, () => settings), writes };
}

describe('ImageService', () => {
    it('stores an inline image and preserves its alt text', async () => {
        const { service, writes } = build();

        const result = await service.materializeImages('![a cat](data:image/png;base64,AA==)', 'Notes/Test.md');

        expect(result).toEqual({ text: '![[Attachments/pasted-image.png|a cat]]', downloaded: 1, failed: 0 });
        expect(writes).toHaveLength(1);
        expect(writes[0].data.byteLength).toBe(1);
    });

    it('uses the custom source name and Moment date format', async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 7, 13, 14, 5, 6));

        try {
            const { service, writes } = build({ imageNameFormat: 'custom', imageNameTemplate: '{{name}}-YYYY-MM-DD' });
            await service.materializeImages('![](data:image/png;base64,AA==)', 'Notes/Test.md');

            expect(writes[0].path).toBe('Attachments/pasted-image-2026-08-13.png');
        } finally {
            vi.useRealTimers();
        }
    });

    it('keeps alt text together with a requested image size', async () => {
        const { service } = build();

        const result = await service.materializeImages('![a cat](data:image/png;base64,AA==)', 'Notes/Test.md', '400');

        expect(result.text).toBe('![[Attachments/pasted-image.png|a cat|400]]');
    });

    it('gives concurrent images with the same source name separate files', async () => {
        const { service, writes } = build();

        const result = await service.materializeImages('![](data:image/png;base64,AA==) ![](data:image/png;base64,AQ==)', 'Notes/Test.md');

        expect(result.downloaded).toBe(2);
        expect(new Set(writes.map(write => write.path)).size).toBe(2);
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

    it('does not write a clipboard image after disposal', async () => {
        const { service, writes } = build();
        let finishRead: (data: ArrayBuffer) => void = () => undefined;
        const data = new Promise<ArrayBuffer>(resolve => {
            finishRead = resolve;
        });
        const file = {
            name: 'waiting.png',
            type: 'image/png',
            size: 1,
            arrayBuffer: () => data
        } as File;

        const save = service.saveClipboardImage(file, '', 'Notes/Test.md');
        service.dispose();
        finishRead(new ArrayBuffer(1));

        expect(await save).toBeNull();
        expect(writes).toHaveLength(0);
    });
});
