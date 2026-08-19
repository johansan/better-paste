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

function build(overrides: Partial<BetterPasteSettings> = {}, seededPaths: string[] = []) {
    const writes: { path: string; data: ArrayBuffer }[] = [];
    const existing = new Set<string>();
    const files: TFile[] = [];

    const addFile = (path: string): TFile => {
        const file = new TFile();
        file.path = path;
        const name = path.split('/').pop() ?? '';
        const dot = name.lastIndexOf('.');
        file.basename = dot >= 0 ? name.slice(0, dot) : name;
        file.extension = dot >= 0 ? name.slice(dot + 1) : '';
        existing.add(path);
        files.push(file);
        return file;
    };
    for (const path of seededPaths) addFile(path);

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
            generateMarkdownLink: (file: TFile, _sourcePath: string, subpath?: string, alias?: string) =>
                `[[${file.path}${subpath ?? ''}${alias ? `|${alias}` : ''}]]`
        },
        metadataCache: {
            // The real resolver returns the shortest unambiguous link text
            fileToLinktext: (file: TFile) => {
                const name = `${file.basename}.${file.extension}`;
                const clash = files.some(other => other !== file && `${other.basename}.${other.extension}` === name);
                return clash ? file.path : name;
            }
        },
        vault: {
            createBinary: async (path: string, data: ArrayBuffer) => {
                writes.push({ path, data });
                return addFile(path);
            },
            getFolderByPath: (folderPath: string) => ({
                children: files.filter(file => file.path.slice(0, file.path.lastIndexOf('/')) === folderPath)
            })
        }
    } as unknown as App;

    const settings = { ...DEFAULT_SETTINGS, ...overrides };
    return { service: new ImageService(app, () => settings), writes };
}

describe('ImageService', () => {
    it('stores an inline image and preserves its alt text', async () => {
        const { service, writes } = build();

        const result = await service.materializeImages('![a cat](data:image/png;base64,AA==)', 'Notes/Test.md');

        expect(result.text).toBe('![[Attachments/pasted-image.png|a cat]]');
        expect(result.downloaded).toBe(1);
        expect(result.failed).toBe(0);
        expect(result.files).toHaveLength(1);
        expect(writes).toHaveLength(1);
        expect(writes[0].data.byteLength).toBe(1);
    });

    it('uses the custom source name and Moment date format', async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 7, 13, 14, 5, 6));

        try {
            const { service, writes } = build({ imageNameTemplate: '{{name}}-YYYY-MM-DD' });
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

    it('adds the CSS class as a subpath, before the size', async () => {
        const { service } = build();

        const result = await service.materializeImages('![](data:image/png;base64,AA==)', 'Notes/Test.md', '400', 'invert');

        expect(result.text).toBe('![[Attachments/pasted-image.png#invert|400]]');
    });

    it('gives concurrent images with the same source name separate files', async () => {
        const { service, writes } = build();

        const result = await service.materializeImages('![](data:image/png;base64,AA==) ![](data:image/png;base64,AQ==)', 'Notes/Test.md');

        expect(result.downloaded).toBe(2);
        expect(new Set(writes.map(write => write.path)).size).toBe(2);
    });

    it('names an image after the note it is pasted into', async () => {
        const { service, writes } = build({ imageNameTemplate: '{{noteName}}' });

        await service.materializeImages('![](data:image/png;base64,AA==)', 'Notes/Trip report.md');

        expect(writes[0].path).toBe('Attachments/Trip report.png');
    });

    it('numbers a counter template one above the highest existing image', async () => {
        const { service, writes } = build({ imageNameTemplate: '{{noteName}}-{{counter}}' }, [
            'Attachments/Test-2.jpg',
            'Attachments/Test-7.png',
            'Attachments/Other-9.png'
        ]);

        await service.materializeImages('![](data:image/png;base64,AA==)', 'Notes/Test.md');

        // Test-7 wins over Test-2 across formats, and Other-9 belongs to another sequence
        expect(writes[0].path).toBe('Attachments/Test-8.png');
    });

    it('matches existing counter files regardless of case', async () => {
        const { service, writes } = build({ imageNameTemplate: '{{noteName}}-{{counter}}' }, ['Attachments/test-3.png']);

        await service.materializeImages('![](data:image/png;base64,AA==)', 'Notes/Test.md');

        expect(writes[0].path).toBe('Attachments/Test-4.png');
    });

    it('gives concurrent counter saves their own rising numbers', async () => {
        const { service, writes } = build({ imageNameTemplate: '{{noteName}}-{{counter:2}}' });

        await service.materializeImages('![](data:image/png;base64,AA==) ![](data:image/png;base64,AQ==)', 'Notes/Test.md');

        expect(writes.map(write => write.path).sort()).toEqual(['Attachments/Test-01.png', 'Attachments/Test-02.png']);
    });

    it('reads a frontmatter property into the name', async () => {
        const { service, writes } = build({ imageNameTemplate: '{{property:attachName}}-{{counter}}' });
        const naming = { property: (key: string) => (key === 'attachName' ? 'Project X' : null), now: new Date() };

        await service.materializeImages('![](data:image/png;base64,AA==)', 'Notes/Test.md', null, null, naming);

        expect(writes[0].path).toBe('Attachments/Project X-1.png');
    });

    it('falls back to the default name when a template value is missing', async () => {
        const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

        try {
            const { service, writes } = build({ imageNameTemplate: '{{property:attachName}}-{{counter}}' });
            await service.materializeImages('![](data:image/png;base64,AA==)', 'Notes/Test.md');

            expect(writes[0].path).toBe('Attachments/pasted-image.png');
            expect(warning).toHaveBeenCalled();
        } finally {
            warning.mockRestore();
        }
    });

    it('names a nameless clipboard bitmap the way Obsidian does', async () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2026, 7, 13, 14, 5, 6));

        try {
            const { service, writes } = build();
            const file = { name: 'image.png', type: 'image/png', size: 1, arrayBuffer: async () => new ArrayBuffer(1) } as File;

            await service.saveClipboardImage(file, '', 'Notes/Test.md');

            expect(writes[0].path).toBe('Attachments/Pasted image 20260813140506.png');
        } finally {
            vi.useRealTimers();
        }
    });

    it('keeps the real name of a clipboard file that has one', async () => {
        const { service, writes } = build();
        const file = { name: 'photo.png', type: 'image/png', size: 1, arrayBuffer: async () => new ArrayBuffer(1) } as File;

        await service.saveClipboardImage(file, '', 'Notes/Test.md');

        expect(writes[0].path).toBe('Attachments/photo.png');
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

    it('builds a quoted property link from the shortest unambiguous name', async () => {
        const { service } = build();
        const result = await service.materializeImages('![](data:image/png;base64,AA==)', 'Notes/Test.md');

        expect(service.propertyLink(result.files[0], 'Notes/Test.md')).toBe('"[[pasted-image.png]]"');
    });

    it('path-qualifies the property link when another file shares the name', async () => {
        const { service } = build({}, ['Elsewhere/pasted-image.png']);
        const result = await service.materializeImages('![](data:image/png;base64,AA==)', 'Notes/Test.md');

        expect(service.propertyLink(result.files[0], 'Notes/Test.md')).toBe('"[[Attachments/pasted-image.png]]"');
    });
});
