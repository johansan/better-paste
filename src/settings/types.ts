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

/** One user-defined sequence of regular expression replacements. */
export interface TextSnippet {
    id: string;
    name: string;
    rules: string[];
    enabled: boolean;
}

export interface BetterPasteSettings {
    /* Pasting */

    /** Run the rules automatically on paste. When off, only the commands apply them. */
    autoClean: boolean;
    /** Open the What's new dialog once after an update. The settings button shows it either way. */
    showReleaseNotes: boolean;
    /**
     * Reindent a pasted list relative to the list item at the cursor, so its hierarchy
     * survives the paste. A document transform, so it has its own toggle: its result
     * depends on where the paste lands, not only on what was copied.
     */
    listNesting: boolean;
    /** Continue every line of a multi-line paste inside the destination block quote. */
    quoteContinuation: boolean;

    /* Attachments */

    /** Device file handling: off keeps Obsidian's preview embeds, link inserts plain links. */
    fileMode: 'off' | 'link';

    /* Images */

    /** Web image handling: off leaves references alone, link embeds URLs, download saves files. */
    imageMode: 'off' | 'link' | 'download';
    /** File name format for saved images: source-name, note and property tokens, counters and Moment dates. */
    imageNameTemplate: string;
    /** Comma-separated widths offered for image embeds, such as "400, 600, 800". */
    imageSizeOptions: string;
    /**
     * Width applied to every image embed: '' for none, 'ask' for a dialog on each
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
    /** Global and domain-specific parameter removals defined by the user. */
    linkRemovals: string[];

    /* Text processing */

    /** Remove blank space from the start and end of whatever was pasted. */
    textTrim: boolean;
    /** Remove zero-width characters and turn no-break spaces into ordinary ones. */
    textInvisible: boolean;
    /** Turn curly quotes and apostrophes into straight ones. */
    textQuotes: boolean;
    /** Turn en and em dashes into hyphens. */
    textDashes: boolean;

    /* Custom processing */

    /** User-defined replacements, applied to the whole pasted text after the built-in rules. */
    textSnippets: TextSnippet[];
    /** User-defined replacements, applied to the finished Markdown link after a title fetch. */
    urlSnippets: TextSnippet[];

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
    /** The toggles picked in the last PDF cleanup dialog, preselected in the next one. */
    pdfLastFurniture: boolean;
    pdfLastSingleParagraph: boolean;
}
