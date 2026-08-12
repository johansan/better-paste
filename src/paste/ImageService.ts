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

import { TFolder, normalizePath, requestUrl } from 'obsidian';
import type { App, TFile } from 'obsidian';
import { findImageReferences, isDataImageUri, isHttpUrl, replaceImageReferences } from './imageReferences';
import type { ImageReference } from './imageReferences';
import { applyFileNameTemplate, buildFileNameTokens, resolveExtension } from '../utils/filenames';
import { logWarning } from '../utils/logger';
import type { BetterPasteSettings } from '../settings/types';

/** Number of images fetched at once, high enough to feel instant without flooding the network. */
const MAX_CONCURRENT_DOWNLOADS = 4;

/** Attempts made to find a free filename before giving up on a download. */
const MAX_FILENAME_ATTEMPTS = 100;

interface FetchedImage {
    data: ArrayBuffer;
    contentType?: string;
}

export interface ClipboardImageResult {
    /** Embeds for the bitmaps that were saved, in clipboard order. */
    embeds: string[];
    /** Bitmaps that could not be saved. */
    failed: number;
}

export interface ImageMaterializeResult {
    text: string;
    /** Images that were saved into the vault. */
    downloaded: number;
    /** Images that were left as their original reference because the download failed. */
    failed: number;
}

/** Downloads images referenced by pasted content and stores them in the vault. */
export class ImageService {
    private readonly app: App;
    private readonly getSettings: () => BetterPasteSettings;

    constructor(app: App, getSettings: () => BetterPasteSettings) {
        this.app = app;
        this.getSettings = getSettings;
    }

    /** True when the text contains at least one image the plugin is configured to download. */
    hasWork(text: string): boolean {
        const settings = this.getSettings();
        if (!settings.imagesEnabled) return false;
        return findImageReferences(text, settings).length > 0;
    }

    /**
     * Replaces every downloadable image reference in `text` with a vault embed.
     * References that fail to download are left untouched so nothing is lost.
     */
    async materializeImages(text: string, sourcePath: string, size: string | null = null): Promise<ImageMaterializeResult> {
        const settings = this.getSettings();
        if (!settings.imagesEnabled) return { text, downloaded: 0, failed: 0 };

        const references = findImageReferences(text, settings);
        if (references.length === 0) return { text, downloaded: 0, failed: 0 };

        const embeds = new Map<number, string>();
        let failed = 0;

        // A small worker pool keeps a page full of images from opening dozens of sockets
        const queue = [...references];
        const workers = Array.from({ length: Math.min(MAX_CONCURRENT_DOWNLOADS, queue.length) }, async () => {
            for (let reference = queue.shift(); reference !== undefined; reference = queue.shift()) {
                const embed = await this.materializeOne(reference, sourcePath, settings, size);
                if (embed === null) failed += 1;
                else embeds.set(reference.index, embed);
            }
        });

        await Promise.all(workers);

        return { text: replaceImageReferences(text, references, embeds), downloaded: embeds.size, failed };
    }

    /**
     * Stores bitmaps that are already on the clipboard, which is what Safari provides
     * alongside its HTML when you copy an image. `sources` supplies the original image URL
     * for each file where one is known, so the saved file can be named after the picture
     * rather than Safari's generic "image.png".
     */
    async saveClipboardImages(
        files: readonly File[],
        sources: readonly string[],
        sourcePath: string,
        size: string | null = null
    ): Promise<ClipboardImageResult> {
        const settings = this.getSettings();
        const embeds: string[] = [];
        let failed = 0;

        for (const [index, file] of files.entries()) {
            const embed = await this.saveClipboardImage(file, sources[index] ?? '', sourcePath, settings, size);
            if (embed === null) failed += 1;
            else embeds.push(embed);
        }

        return { embeds, failed };
    }

    /** Stores one clipboard bitmap and returns its embed, or null when it cannot be saved. */
    private async saveClipboardImage(
        file: File,
        source: string,
        sourcePath: string,
        settings: BetterPasteSettings,
        size: string | null
    ): Promise<string | null> {
        try {
            // The clipboard bitmap is authoritative for the format: Safari re-encodes a
            // page's .webp as PNG, so the file's own type and name decide the extension.
            // The source URL is only used for naming, never for the format.
            const extension = resolveExtension(file.type, file.name || source, settings.imageExtensions);
            if (!extension) {
                logWarning(`Skipped a pasted image: ${file.type || 'unknown type'} is not a recognised image type`);
                return null;
            }

            const data = await file.arrayBuffer();

            const maxBytes = settings.imageMaxSizeMb * 1024 * 1024;
            if (maxBytes > 0 && data.byteLength > maxBytes) {
                logWarning(`Skipped a pasted image: ${Math.round(data.byteLength / 1024 / 1024)} MB exceeds the size limit`);
                return null;
            }

            const saved = await this.saveImage(source, data, extension, sourcePath, settings, file.name);
            if (!saved) return null;

            return this.embedFor(saved, sourcePath, size);
        } catch (error) {
            logWarning('Failed to save a pasted image', error);
            return null;
        }
    }

    /** Downloads one image and returns the embed that should replace it, or null on failure. */
    private async materializeOne(
        reference: ImageReference,
        sourcePath: string,
        settings: BetterPasteSettings,
        size: string | null
    ): Promise<string | null> {
        try {
            const fetched = await this.fetchImage(reference.url, settings);
            if (!fetched) return null;

            const extension = resolveExtension(fetched.contentType, reference.url, settings.imageExtensions);
            if (!extension) {
                logWarning(`Skipped ${reference.url}: not a recognised image type`);
                return null;
            }

            const maxBytes = settings.imageMaxSizeMb * 1024 * 1024;
            if (maxBytes > 0 && fetched.data.byteLength > maxBytes) {
                logWarning(`Skipped ${reference.url}: ${Math.round(fetched.data.byteLength / 1024 / 1024)} MB exceeds the size limit`);
                return null;
            }

            const file = await this.saveImage(reference.url, fetched.data, extension, sourcePath, settings);
            if (!file) return null;

            return this.embedFor(file, sourcePath, size);
        } catch (error) {
            logWarning(`Failed to download ${reference.url}`, error);
            return null;
        }
    }

    /**
     * Builds the embed for a saved image. Obsidian reads the size out of the link's alias
     * slot in both link styles: `![[picture.png|400]]` and `![400](picture.png)`.
     */
    private embedFor(file: TFile, sourcePath: string, size: string | null): string {
        return `!${this.app.fileManager.generateMarkdownLink(file, sourcePath, undefined, size ?? undefined)}`;
    }

    /** Retrieves image bytes from an http(s) URL or decodes them from a data: URI. */
    private async fetchImage(url: string, settings: BetterPasteSettings): Promise<FetchedImage | null> {
        if (isDataImageUri(url)) return decodeDataUri(url);
        if (!isHttpUrl(url)) return null;

        const timeoutMs = Math.max(1, settings.imageTimeoutSeconds) * 1000;
        let timer: ReturnType<typeof setTimeout> | undefined;

        try {
            // requestUrl has no abort signal, so the race caps how long a paste can hang
            const response = await Promise.race([
                requestUrl({ url, method: 'GET', throw: false }),
                new Promise<null>(resolve => {
                    timer = window.setTimeout(() => resolve(null), timeoutMs);
                })
            ]);

            if (!response) {
                logWarning(`Timed out downloading ${url}`);
                return null;
            }

            if (response.status < 200 || response.status >= 300) {
                logWarning(`Skipped ${url}: server returned ${response.status}`);
                return null;
            }

            return { data: response.arrayBuffer, contentType: response.headers['content-type'] ?? response.headers['Content-Type'] };
        } finally {
            if (timer !== undefined) window.clearTimeout(timer);
        }
    }

    /** Writes the image into the vault, following the configured attachment location. */
    private async saveImage(
        url: string,
        data: ArrayBuffer,
        extension: string,
        sourcePath: string,
        settings: BetterPasteSettings,
        fallbackName?: string
    ): Promise<TFile | null> {
        const tokens = buildFileNameTokens(url, new Date(), fallbackName);
        const baseName = applyFileNameTemplate(settings.imageFilenameTemplate, tokens);
        const fileName = `${baseName}.${extension}`;

        if (settings.imageFolderMode === 'obsidian') {
            const path = await this.app.fileManager.getAvailablePathForAttachment(fileName, sourcePath);
            return this.app.vault.createBinary(path, data);
        }

        const folder = normalizePath(settings.imageFolder.trim() || '/');
        await this.ensureFolder(folder);

        // getAvailablePathForAttachment ignores a custom folder, so dedupe by hand
        for (let attempt = 0; attempt < MAX_FILENAME_ATTEMPTS; attempt++) {
            const candidateName = attempt === 0 ? fileName : `${baseName} ${attempt}.${extension}`;
            const candidatePath = folder === '/' ? candidateName : `${folder}/${candidateName}`;
            if (this.app.vault.getAbstractFileByPath(candidatePath)) continue;

            try {
                return await this.app.vault.createBinary(candidatePath, data);
            } catch (error) {
                // Another write may have taken the name between the check and the create
                if (attempt === MAX_FILENAME_ATTEMPTS - 1) throw error;
            }
        }

        logWarning(`Could not find a free filename for ${fileName}`);
        return null;
    }

    /** Creates the configured attachment folder when it does not exist yet. */
    private async ensureFolder(folder: string): Promise<void> {
        if (folder === '/' || folder === '') return;

        const existing = this.app.vault.getAbstractFileByPath(folder);
        if (existing instanceof TFolder) return;

        try {
            await this.app.vault.createFolder(folder);
        } catch (error) {
            // A concurrent paste may have created it first, which is not an error for us
            if (!this.app.vault.getAbstractFileByPath(folder)) throw error;
        }
    }
}

/** Decodes a data: URI into raw bytes. */
export function decodeDataUri(url: string): FetchedImage | null {
    const separator = url.indexOf(',');
    if (separator < 0) return null;

    const meta = url.slice('data:'.length, separator);
    const payload = url.slice(separator + 1);
    const contentType = meta.split(';')[0] || undefined;
    const isBase64 = /;base64/i.test(meta);

    try {
        if (isBase64) {
            const binary = atob(payload);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            return { data: bytes.buffer, contentType };
        }

        const decoded = decodeURIComponent(payload);
        return { data: new TextEncoder().encode(decoded).buffer, contentType };
    } catch (error) {
        logWarning('Failed to decode an inline image', error);
        return null;
    }
}
