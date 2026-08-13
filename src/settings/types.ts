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
 * How much of a pasted link is removed.
 * - 'all': drop every query parameter unless a site rule keeps it
 * - 'tracking': drop only parameters known to be tracking
 */
export type UrlStripMode = 'all' | 'tracking';

/**
 * How readily a line is treated as the continuation of the one above it.
 * - 'indented': only when it is indented further than the line that started the paragraph
 * - 'any': whenever the line above looks full, which suits terminals that do not indent
 * - 'never': leave every line break alone, for column-aligned output such as `git log --graph`
 */
export type TerminalRejoinMode = 'indented' | 'any' | 'never';

/**
 * What happens to bullet characters in terminal output.
 * - 'preserve': leave the original character alone
 * - 'markdown': rewrite to a Markdown list item so Obsidian renders a real list
 */
export type TerminalBulletMode = 'preserve' | 'markdown';

/** Naming scheme for saved images. */
export type ImageFilenameFormat = 'source' | 'custom';

/** Placement of a comma next to a closing double quotation mark. */
export type TextCommaPlacement = 'none' | 'inside' | 'outside';

export interface BetterPasteSettings {
    /* Pasting */

    /** Run the rules automatically on paste. When off, only the commands apply them. */
    interceptPaste: boolean;
    /** Show a notice summarising what a paste changed. Failures are always reported. */
    showNotices: boolean;

    /* Images */

    /** Save pasted pictures into the vault instead of leaving them as links. */
    imagesEnabled: boolean;
    /** Naming scheme for saved images. */
    imageFilenameFormat: ImageFilenameFormat;
    /** Custom source-name and Moment date format for saved image filenames. */
    imageFilenameTemplate: string;
    /** Frontmatter property setting the width of images pasted into a note. Blank disables it. */
    imageSizeProperty: string;

    /* Links */

    /** Remove tracking from pasted links. */
    urlEnabled: boolean;
    /** Turn a pasted standalone web address into a Markdown link using the page title. */
    fetchLinkTitles: boolean;
    /** Whether to drop every parameter or only known tracking ones. */
    urlStripMode: UrlStripMode;
    /**
     * The user's own site rules, merged over the shipped list at read time so that
     * updates to the shipped rules keep reaching people who have added their own.
     */
    urlDomainRules: string[];

    /* Terminal text */

    /** Rejoin paragraphs a terminal broke across lines. */
    terminalEnabled: boolean;
    /** How readily a line is treated as a continuation. */
    terminalRejoinMode: TerminalRejoinMode;
    /** What happens to bullet characters. */
    terminalBulletMode: TerminalBulletMode;

    /* Text processing */

    /** Remove blank space from the start and end of whatever was pasted. */
    trimPaste: boolean;
    /** Placement of a comma next to a closing double quotation mark. */
    textCommaPlacement: TextCommaPlacement;

    /* AI text */

    /** Normalise the typography that AI assistants produce. */
    aiTextEnabled: boolean;
    /** Replace typographic punctuation with its plain ASCII equivalent. */
    aiTextPlainPunctuation: boolean;

    /* Stored state */

    /**
     * Version whose release notes have been shown. Not a setting and not editable in the
     * settings tab: the What's new dialog writes it, and the same value is mirrored into
     * vault-local storage so a stale synced data.json cannot reopen the dialog.
     */
    lastShownVersion: string;
}
