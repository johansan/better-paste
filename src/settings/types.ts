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

/**
 * How query parameters are removed from pasted URLs.
 * - 'all': drop every parameter unless a domain rule or keep list preserves it
 * - 'tracking': drop only parameters matching the tracking pattern list
 */
export type UrlStripMode = 'all' | 'tracking';

/**
 * What happens to bullet characters when terminal text is cleaned up.
 * - 'preserve': leave the original bullet character untouched
 * - 'markdown': rewrite bullets to Markdown list syntax so Obsidian renders a real list
 */
export type TerminalBulletMode = 'preserve' | 'markdown';

/**
 * Where downloaded images are written.
 * - 'obsidian': follow the vault's own attachment location setting
 * - 'custom': always use the folder configured in `imageFolder`
 */
export type ImageFolderMode = 'obsidian' | 'custom';

export interface BetterPasteSettings {
    /** Run transforms automatically on regular paste. When false, only the explicit commands apply them. */
    interceptPaste: boolean;
    /** Show a notice summarising what each paste changed. */
    showNotices: boolean;

    /** Master switch for rich clipboard and image handling. */
    imagesEnabled: boolean;
    /** Download http(s) images referenced by pasted HTML into the vault. */
    downloadRemoteImages: boolean;
    /** Save inline data: URI images from pasted HTML into the vault. */
    downloadDataUriImages: boolean;
    /** Treat a pasted bare image URL as an embed and download it. */
    downloadBareImageUrls: boolean;
    /** Where downloaded images are stored. */
    imageFolderMode: ImageFolderMode;
    /** Vault-relative folder used when imageFolderMode is 'custom'. */
    imageFolder: string;
    /** Filename template. Supports {{name}}, {{host}}, {{date}}, {{time}}, {{timestamp}}. */
    imageFilenameTemplate: string;
    /** Reject downloads larger than this many megabytes. 0 disables the limit. */
    imageMaxSizeMb: number;
    /** Abort a download that takes longer than this many seconds. */
    imageTimeoutSeconds: number;
    /** File extensions accepted as images. */
    imageExtensions: string[];
    /**
     * Frontmatter property naming the width pasted images get in that note, for example
     * "image-width: 400". Blank turns the feature off.
     */
    imageSizeProperty: string;

    /** Master switch for URL cleaning. */
    urlEnabled: boolean;
    /** Whether to strip all parameters or only known tracking parameters. */
    urlStripMode: UrlStripMode;
    /** Glob patterns for tracking parameters, used in 'tracking' mode. */
    urlTrackingParams: string[];
    /** Glob patterns for parameters that survive on every domain, in both modes. */
    urlKeepParams: string[];
    /** Per-domain rules: "domain" keeps every parameter, "domain: a, b" keeps only a and b. */
    urlDomainRules: string[];
    /** Remove ':~:text=' scroll-to-text fragments. */
    urlStripTextFragments: boolean;
    /** Remove every '#fragment'. */
    urlStripAllFragments: boolean;
    /** Remove a trailing slash from the path. */
    urlStripTrailingSlash: boolean;

    /** Master switch for terminal text cleanup. */
    terminalEnabled: boolean;
    /** Join hard-wrapped continuation lines back into one paragraph. */
    terminalUnwrapLines: boolean;
    /** Only treat a line as a continuation when it is indented further than its paragraph's first line. */
    terminalRequireIndent: boolean;
    /** A line only counts as wrapped when the line above it is at least this long. */
    terminalMinWrapWidth: number;
    /** Remove the common leading indentation shared by all lines. */
    terminalDedent: boolean;
    /** Strip ANSI escape sequences (colours, cursor moves). */
    terminalStripAnsi: boolean;
    /** Collapse runs of blank lines into a single blank line. */
    terminalCollapseBlankLines: boolean;
    /** Remove trailing spaces from every line. */
    terminalTrimTrailingWhitespace: boolean;
    /** Never unwrap lines inside fenced code blocks. */
    terminalPreserveCodeBlocks: boolean;
    /** How bullet characters are treated. */
    terminalBulletMode: TerminalBulletMode;
    /** Characters that start a new list item and therefore a new paragraph. */
    terminalListMarkers: string[];
}
