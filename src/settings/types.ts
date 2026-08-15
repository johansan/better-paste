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
export type LinkStripMode = 'all' | 'tracking';

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
export type ImageNameFormat = 'source' | 'custom';

/** Placement of a comma next to a closing double quotation mark. */
export type TextCommaPlacement = 'none' | 'inside' | 'outside';

/** The quotation mark style pasted text is converted to. */
export type TextQuoteStyle = 'none' | 'straight' | 'curly';

/**
 * The dash style pasted text is converted to.
 * - 'hyphen': en and em dashes become hyphens
 * - 'en': dashes between words become spaced en dashes, the British convention
 * - 'em': dashes between words become closed em dashes, the American convention
 * - 'em-spaced': dashes between words become em dashes with a space on each side
 */
export type TextDashStyle = 'none' | 'hyphen' | 'en' | 'em' | 'em-spaced';

export interface BetterPasteSettings {
    /* Pasting */

    /** Run the rules automatically on paste. When off, only the commands apply them. */
    autoClean: boolean;

    /* Images */

    /** Save pasted pictures into the vault instead of leaving them as links. */
    imageEnabled: boolean;
    /** Naming scheme for saved images. */
    imageNameFormat: ImageNameFormat;
    /** Custom source-name and Moment date format for saved image filenames. */
    imageNameTemplate: string;
    /** Comma-separated widths offered for saved image embeds, such as "400, 600, 800". */
    imageSizeOptions: string;
    /**
     * Width applied to every saved image embed: '' for none, 'ask' for a dialog on each
     * paste, otherwise one of the values in `imageSizeOptions`. A note's own width
     * property overrides this.
     */
    imageSizeChoice: string;
    /** Comma-separated CSS classes offered for saved image embeds, such as "invert, invertW". */
    imageClassOptions: string;
    /**
     * Class applied to every saved image embed: '' for none, 'ask' for a dialog on each
     * paste, otherwise one of the values in `imageClassOptions`.
     */
    imageClassChoice: string;

    /* Frontmatter */

    /**
     * Frontmatter property switching the plugin on or off for one note. Blank disables it.
     *
     * Configurable rather than fixed because the name has to coexist with whatever the vault
     * and other plugins already use, and a collision cannot be resolved from here.
     */
    noteProperty: string;
    /** Frontmatter property setting the width of images pasted into a note. Blank disables it. */
    imageSizeProperty: string;

    /* Links */

    /** Remove tracking from pasted links. */
    linkEnabled: boolean;
    /** Turn a pasted standalone web address into a Markdown link using the page title. */
    linkTitles: boolean;
    /** Whether to drop every parameter or only known tracking ones. */
    linkStrip: LinkStripMode;
    /**
     * The user's own site rules, merged over the shipped list at read time so that
     * updates to the shipped rules keep reaching people who have added their own.
     */
    linkRules: string[];

    /* Terminal text */

    /** Rejoin paragraphs a terminal broke across lines. */
    terminalEnabled: boolean;
    /** How readily a line is treated as a continuation. */
    terminalRejoin: TerminalRejoinMode;
    /** What happens to bullet characters. */
    terminalBullets: TerminalBulletMode;

    /* Text processing */

    /** Remove blank space from the start and end of whatever was pasted. */
    textTrim: boolean;
    /** Placement of a comma next to a closing double quotation mark. */
    textComma: TextCommaPlacement;
    /** Remove zero-width characters and turn no-break spaces into ordinary ones. */
    textInvisible: boolean;
    /** The quotation mark style pasted text is converted to. */
    textQuotes: TextQuoteStyle;
    /** The dash style pasted text is converted to. */
    textDashes: TextDashStyle;

    /* Stored state */

    /**
     * Version whose release notes have been shown. Not a setting and not editable in the
     * settings tab: the What's new dialog writes it, and the same value is mirrored into
     * vault-local storage so a stale synced data.json cannot reopen the dialog.
     */
    lastShownVersion: string;
    /** The size picked in the last image paste dialog, preselected in the next one. */
    imageLastSize: string;
    /** The class picked in the last image paste dialog, preselected in the next one. */
    imageLastClass: string;
}
