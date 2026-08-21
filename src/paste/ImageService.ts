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

import { TFile, requestUrl } from 'obsidian';
import type { App } from 'obsidian';
import { findImageReferences, isDataImageUri, isHttpUrl, remoteMarkdownEmbed, replaceImageReferences } from './imageReferences';
import type { ImageReference } from './imageReferences';
import {
    assembleFileName,
    baseNameFromPath,
    buildFileNameTokens,
    counterPattern,
    expandFileNameTemplate,
    pastedImageName,
    resolveExtension
} from '../utils/filenames';
import type { ExpandedFileName, FileNameTokens } from '../utils/filenames';
import { DEFAULT_IMAGE_NAME_TEMPLATE, IMAGE_EXTENSIONS, IMAGE_TIMEOUT_SECONDS, MAX_IMAGE_SIZE_MB } from '../settings/constants';
import { logWarning } from '../utils/logger';
import type { BetterPasteSettings } from '../settings/types';

/** Number of images fetched at once, high enough to feel instant without flooding the network. */
const MAX_CONCURRENT_DOWNLOADS = 4;

/** Byte form of the image limit, shared by checks that run before and after decoding. */
export const MAX_IMAGE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

interface FetchedImage {
    data: ArrayBuffer;
    contentType?: string;
}

/**
 * The note the paste targets, given as a path or as a getter that reads the path when it
 * is needed. The getter form keeps an attachment beside a note that was moved while its
 * image was still downloading.
 */
export type SourcePath = string | (() => string);

function resolveSourcePath(source: SourcePath): string {
    return typeof source === 'function' ? source() : source;
}

/** Naming values captured when the paste happened, shared by every image that paste saves. */
export interface ImageNamingContext {
    /** Reads a frontmatter property of the target note, or null when it has no usable value. */
    property: (key: string) => string | null;
    /** One timestamp for the whole paste, so its images cannot straddle midnight. */
    now: Date;
}

/** Stands in when a caller has no note context to offer, such as the tests. */
function defaultNaming(): ImageNamingContext {
    return { property: () => null, now: new Date() };
}

export interface ImageMaterializeResult {
    text: string;
    /** Images that were saved into the vault. */
    downloaded: number;
    /** Images that were left as their original reference because the download failed. */
    failed: number;
    /** The saved files, so a caller whose editor rewrite is declined can discard them. */
    files: TFile[];
}

/** Saves images referenced by pasted content into the vault, or rewrites them to remote embeds in link mode. */
export class ImageService {
    private readonly app: App;
    private readonly getSettings: () => BetterPasteSettings;
    /** Path selection and creation stay together so equal source names cannot claim one file. */
    private saveQueue: Promise<void> = Promise.resolve();
    private disposed = false;

    constructor(app: App, getSettings: () => BetterPasteSettings) {
        this.app = app;
        this.getSettings = getSettings;
    }

    /** Stops awaited work before it can create another vault file. */
    dispose(): void {
        this.disposed = true;
    }

    /** True when the text contains at least one image the configured mode will change. */
    hasWork(text: string): boolean {
        if (this.disposed) return false;
        const settings = this.getSettings();
        if (settings.imageMode === 'off') return false;
        const references = findImageReferences(text);
        if (settings.imageMode === 'download') return references.length > 0;
        return references.some(reference => isDataImageUri(reference.url) || reference.kind !== 'markdown');
    }

    /**
     * Replaces image references according to the configured mode. References that fail
     * to save are left untouched so nothing is lost.
     */
    async materializeImages(
        text: string,
        sourcePath: SourcePath,
        size: string | null = null,
        cssClass: string | null = null,
        naming: ImageNamingContext = defaultNaming()
    ): Promise<ImageMaterializeResult> {
        if (this.disposed) return { text, downloaded: 0, failed: 0, files: [] };
        const settings = this.getSettings();
        if (settings.imageMode === 'off') return { text, downloaded: 0, failed: 0, files: [] };

        const references = findImageReferences(text);
        if (references.length === 0) return { text, downloaded: 0, failed: 0, files: [] };

        const embeds = new Map<number, string>();
        const files: TFile[] = [];
        let failed = 0;

        const queue: ImageReference[] = [];
        for (const reference of references) {
            if (settings.imageMode === 'link' && !isDataImageUri(reference.url)) {
                if (reference.kind !== 'markdown') embeds.set(reference.index, this.remoteEmbed(reference, size));
            } else {
                queue.push(reference);
            }
        }

        // A small worker pool keeps a page full of images from opening dozens of sockets
        const workers = Array.from({ length: Math.min(MAX_CONCURRENT_DOWNLOADS, queue.length) }, async () => {
            for (let reference = queue.shift(); !this.disposed && reference !== undefined; reference = queue.shift()) {
                const saved = await this.materializeOne(reference, sourcePath, settings, size, cssClass, naming);
                if (saved === null) failed += 1;
                else {
                    embeds.set(reference.index, saved.embed);
                    files.push(saved.file);
                }
            }
        });

        await Promise.all(workers);

        return { text: replaceImageReferences(text, references, embeds), downloaded: files.length, failed, files };
    }

    /** Builds a remote Markdown embed, with width in the alias slot used by Obsidian. */
    private remoteEmbed(reference: ImageReference, size: string | null): string {
        return remoteMarkdownEmbed(reference.alt, reference.url, size);
    }

    /**
     * Stores a bitmap that is already on the clipboard, which is what Safari provides
     * alongside its HTML when you copy an image. `source` supplies the original image URL
     * when one is known, so the saved file can be named after the picture
     * rather than Safari's generic "image.png".
     */
    async saveClipboardImage(
        file: File,
        source: string,
        sourcePath: SourcePath,
        size: string | null = null,
        cssClass: string | null = null,
        naming: ImageNamingContext = defaultNaming()
    ): Promise<{ embed: string; file: TFile } | null> {
        if (this.disposed) return null;
        const settings = this.getSettings();
        return this.storeClipboardImage(file, source, sourcePath, settings, size, cssClass, naming);
    }

    /** Stores one clipboard bitmap and returns its embed, or null when it cannot be saved. */
    private async storeClipboardImage(
        file: File,
        source: string,
        sourcePath: SourcePath,
        settings: BetterPasteSettings,
        size: string | null,
        cssClass: string | null,
        naming: ImageNamingContext
    ): Promise<{ embed: string; file: TFile } | null> {
        try {
            // The clipboard bitmap is authoritative for the format: Safari re-encodes a
            // page's .webp as PNG, so the file's own type and name decide the extension.
            // The source URL is only used for naming, never for the format.
            const extension = resolveExtension(file.type, file.name || source, IMAGE_EXTENSIONS);
            if (!extension) {
                logWarning(`Skipped a pasted image: ${file.type || 'unknown type'} is not a recognised image type`);
                return null;
            }

            if (MAX_IMAGE_BYTES > 0 && file.size > MAX_IMAGE_BYTES) {
                logWarning(`Skipped a pasted image: ${Math.round(file.size / 1024 / 1024)} MB exceeds the size limit`);
                return null;
            }

            const data = await file.arrayBuffer();
            if (this.disposed) return null;

            if (MAX_IMAGE_BYTES > 0 && data.byteLength > MAX_IMAGE_BYTES) {
                logWarning(`Skipped a pasted image: ${Math.round(data.byteLength / 1024 / 1024)} MB exceeds the size limit`);
                return null;
            }

            // A clipboard bitmap arrives under the browser's generic "image.png", so it
            // gets the name Obsidian would give it. A file with a real name of its own,
            // copied from a file manager, keeps that name.
            const ownName = baseNameFromPath(file.name || '');
            const fallbackName = ownName !== null && ownName.toLowerCase() !== 'image' ? file.name : pastedImageName(naming.now);
            const saved = await this.saveImage(source, data, extension, sourcePath, settings, naming, fallbackName);
            if (!saved) return null;

            return { embed: this.embedFor(saved, sourcePath, size, '', cssClass), file: saved };
        } catch (error) {
            logWarning('Failed to save a pasted image', error);
            return null;
        }
    }

    /** Downloads one image and returns the embed that should replace it, or null on failure. */
    private async materializeOne(
        reference: ImageReference,
        sourcePath: SourcePath,
        settings: BetterPasteSettings,
        size: string | null,
        cssClass: string | null,
        naming: ImageNamingContext
    ): Promise<{ embed: string; file: TFile } | null> {
        try {
            const fetched = await this.fetchImage(reference.url);
            if (this.disposed || !fetched) return null;

            const extension = resolveExtension(fetched.contentType, reference.url, IMAGE_EXTENSIONS);
            if (!extension) {
                logWarning(`Skipped ${reference.url}: not a recognised image type`);
                return null;
            }

            if (MAX_IMAGE_BYTES > 0 && fetched.data.byteLength > MAX_IMAGE_BYTES) {
                logWarning(`Skipped ${reference.url}: ${Math.round(fetched.data.byteLength / 1024 / 1024)} MB exceeds the size limit`);
                return null;
            }

            const file = await this.saveImage(reference.url, fetched.data, extension, sourcePath, settings, naming);
            if (!file) return null;

            return { embed: this.embedFor(file, sourcePath, size, reference.alt, cssClass), file };
        } catch (error) {
            logWarning(`Failed to download ${reference.url}`, error);
            return null;
        }
    }

    /**
     * Builds the embed for a saved image. Obsidian reads the size out of the link's alias
     * slot in both link styles: `![[picture.png|400]]` and `![400](picture.png)`. The CSS
     * class travels as a subpath, `![[picture.png#invert]]`, which Obsidian copies onto the
     * rendered embed's src attribute in both styles, where themes and snippets match it.
     */
    private embedFor(file: TFile, sourcePath: SourcePath, size: string | null, alt = '', cssClass: string | null = null): string {
        const label = size ? (alt ? `${alt}|${size}` : size) : alt || undefined;
        const subpath = cssClass ? `#${cssClass}` : undefined;
        return `!${this.app.fileManager.generateMarkdownLink(file, resolveSourcePath(sourcePath), subpath, label)}`;
    }

    /**
     * A double-quoted plain wikilink for a saved image in a frontmatter property. The
     * shortest unambiguous link text keeps a duplicate file name in another folder from
     * linking the wrong image, and JSON quoting is valid YAML for any path character.
     */
    propertyLink(file: TFile, sourcePath: string): string {
        return JSON.stringify(`[[${this.app.metadataCache.fileToLinktext(file, sourcePath)}]]`);
    }

    /** Retrieves image bytes from an http(s) URL or decodes them from a data: URI. */
    private async fetchImage(url: string): Promise<FetchedImage | null> {
        if (isDataImageUri(url)) return decodeDataUri(url);
        if (!isHttpUrl(url)) return null;

        const timeoutMs = IMAGE_TIMEOUT_SECONDS * 1000;
        const deadline = Date.now() + timeoutMs;
        let timer: ReturnType<typeof setTimeout> | undefined;

        try {
            // requestUrl buffers the whole response before the size check below can run,
            // and it cannot stream or abort. Asking for the declared length first keeps
            // an oversized file from being buffered at all; a server that answers with
            // no length, or lies about it, is caught only by the check after download.
            // The HEAD spends from the same time budget as the GET.
            if (MAX_IMAGE_BYTES > 0 && (await this.declaredLength(url, timeoutMs)) > MAX_IMAGE_BYTES) {
                logWarning(`Skipped ${url}: the server declares more than ${MAX_IMAGE_SIZE_MB} MB`);
                return null;
            }
            if (this.disposed) return null;

            // requestUrl has no abort signal, so the race caps how long a paste can hang
            const response = await Promise.race([
                requestUrl({ url, method: 'GET', throw: false }),
                new Promise<null>(resolve => {
                    timer = window.setTimeout(() => resolve(null), Math.max(1000, deadline - Date.now()));
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

    /**
     * Moves files whose embeds never reached the note into the trash, following the
     * user's trash preference. Used when the editor rewrite was declined, so a download
     * does not survive as an unreferenced attachment.
     */
    async discardFiles(files: readonly TFile[]): Promise<void> {
        for (const file of files) {
            try {
                await this.app.fileManager.trashFile(file);
            } catch (error) {
                logWarning(`Could not remove the unused attachment ${file.path}`, error);
            }
        }
    }

    /**
     * The Content-Length a HEAD request declares for the URL, or 0 when the server does
     * not say. Failures count as 0 so a server without HEAD support still gets its GET.
     */
    private async declaredLength(url: string, timeoutMs: number): Promise<number> {
        let timer: ReturnType<typeof setTimeout> | undefined;
        try {
            const response = await Promise.race([
                requestUrl({ url, method: 'HEAD', throw: false }),
                new Promise<null>(resolve => {
                    timer = window.setTimeout(() => resolve(null), timeoutMs);
                })
            ]);
            if (!response || response.status < 200 || response.status >= 300) return 0;
            const length = Number(response.headers['content-length'] ?? response.headers['Content-Length'] ?? 0);
            return Number.isFinite(length) && length > 0 ? length : 0;
        } catch {
            return 0;
        } finally {
            if (timer !== undefined) window.clearTimeout(timer);
        }
    }

    /** Writes the image into the vault, following the configured attachment location. */
    private async saveImage(
        url: string,
        data: ArrayBuffer,
        extension: string,
        sourcePath: SourcePath,
        settings: BetterPasteSettings,
        naming: ImageNamingContext,
        fallbackName?: string
    ): Promise<TFile | null> {
        const save = this.saveQueue.then(async () => {
            // Name expansion, the availability check and create are one operation from this
            // service's point of view, otherwise two concurrent downloads with the same name
            // or the same counter can race. The note name is read here rather than at paste
            // time so a note renamed during the download names its attachment correctly.
            if (this.disposed) return null;
            const tokens: FileNameTokens = {
                ...buildFileNameTokens(url, fallbackName),
                noteName: baseNameFromPath(resolveSourcePath(sourcePath)),
                property: naming.property
            };
            const template = settings.imageNameTemplate;
            let expanded = expandFileNameTemplate(template, tokens, naming.now);
            if (!expanded) {
                logWarning(`The name format "${template}" has no value for one of its tokens here, used the default name instead`);
                expanded = expandFileNameTemplate(DEFAULT_IMAGE_NAME_TEMPLATE, tokens, naming.now);
                if (!expanded) return null;
            }

            const baseName =
                expanded.counterWidths.length === 0
                    ? assembleFileName(expanded)
                    : assembleFileName(expanded, await this.nextCounter(expanded, extension, sourcePath));
            if (this.disposed) return null;

            const path = await this.app.fileManager.getAvailablePathForAttachment(
                `${baseName}.${extension}`,
                resolveSourcePath(sourcePath)
            );
            if (this.disposed) return null;
            const created = await this.app.vault.createBinary(path, data);
            if (this.disposed) {
                // The plugin unloaded while the write was in flight; nothing will insert
                // the embed, so the file must not survive as an unreferenced attachment
                await this.app.fileManager.trashFile(created);
                return null;
            }
            return created;
        });
        this.saveQueue = save.then(
            () => undefined,
            () => undefined
        );
        return save;
    }

    /**
     * The number the template's counter should use: one above the highest number an
     * existing image in the attachment folder carries in this template's shape. Counting
     * up rather than filling gaps, because a freed number can still be referenced by an
     * old note's embed, and reusing it would silently swap that note's picture.
     */
    private async nextCounter(expanded: ExpandedFileName, extension: string, sourcePath: SourcePath): Promise<number> {
        // The attachment folder is wherever Obsidian would put this file
        const probe = await this.app.fileManager.getAvailablePathForAttachment(
            `${assembleFileName(expanded, 1)}.${extension}`,
            resolveSourcePath(sourcePath)
        );
        const separator = probe.lastIndexOf('/');
        const folder = this.app.vault.getFolderByPath(separator < 0 ? '/' : probe.slice(0, separator));

        // One sequence across every image format, so shot-1.png and shot-2.jpg count as one series
        const pattern = counterPattern(expanded);
        let highest = 0;
        for (const child of folder?.children ?? []) {
            if (!(child instanceof TFile) || !IMAGE_EXTENSIONS.includes(child.extension.toLowerCase())) continue;
            const match = pattern.exec(child.basename);
            if (match) highest = Math.max(highest, Number(match[1]));
        }
        return highest + 1;
    }
}

/** Decodes a data: URI into raw bytes. */
function decodeDataUri(url: string): FetchedImage | null {
    const separator = url.indexOf(',');
    if (separator < 0) return null;

    const meta = url.slice('data:'.length, separator);
    const payload = url.slice(separator + 1);
    const contentType = meta.split(';')[0] || undefined;
    const isBase64 = /;base64/i.test(meta);

    try {
        if (isBase64) {
            const compact = payload.replace(/\s/g, '');
            const padding = compact.endsWith('==') ? 2 : compact.endsWith('=') ? 1 : 0;
            const decodedSize = Math.max(0, Math.floor((compact.length * 3) / 4) - padding);
            if (MAX_IMAGE_BYTES > 0 && decodedSize > MAX_IMAGE_BYTES) {
                logWarning(`Skipped an inline image: ${Math.round(decodedSize / 1024 / 1024)} MB exceeds the size limit`);
                return null;
            }

            const binary = atob(compact);
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
