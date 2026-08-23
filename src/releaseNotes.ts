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

/*
 * What the What's new dialog shows, and which releases open it by themselves.
 *
 * The version last shown is recorded after the dialog closes, so an upgrade shows every
 * release since that marker rather than only the newest one. Same-version and downgraded
 * starts never open it.
 *
 * Note text carries a small amount of inline formatting, rendered by WhatsNewModal:
 * **bold**, `code`, ==emphasis==, [label](https://example.com) and a bare link. A single
 * newline becomes a line break. Nothing else is interpreted.
 *
 * A release may carry a banner. Put the picture in images/version-banners, name it after
 * the version, and name the file here. It is fetched from the repository when the dialog
 * opens, so it has to be pushed to main before that release ships.
 */

export interface ReleaseNote {
    version: string;
    /** ISO date, shown beside the version heading in the reader's own date format. */
    date: string;
    /** File name inside images/version-banners, extension included, such as '1.0.0.gif'. */
    banner?: string;
    /** When false, updating to this release does not open the dialog by itself. */
    showOnUpdate?: boolean;
    /** Lead paragraph above the lists. */
    info?: string;
    new?: string[];
    improved?: string[];
    changed?: string[];
    fixed?: string[];
}

/** Newest first. A new release goes at the top. */
const RELEASE_NOTES: ReleaseNote[] = [
    {
        version: '1.0.12',
        date: '2026-08-23',
        new: [
            'You can now paste screenshots, PDFs and other files as links instead of previews, using the new setting ==Pasted files==. Paste a screenshot and the leading `!` is removed, so you get `[[Screenshot.png]]` instead of `![[Screenshot.png]]`. The file is still saved to your vault.'
        ],
        improved: [
            'Pasting an address into an existing Markdown link no longer fetches a title. Paste `https://help.obsidian.md` into `[Obsidian help]()` and you get `[Obsidian help](https://help.obsidian.md)`.'
        ]
    },
    {
        version: '1.0.11',
        date: '2026-08-22',
        improved: ['Added Blueshift email tracking codes to the built-in link removals.'],
        fixed: [
            'Fixed block quote and callout continuation for formatted multi-paragraph pastes on mobile.',
            'Fixed link titles for numbered, bulleted and task lists of URLs.'
        ]
    },
    {
        version: '1.0.10',
        date: '2026-08-22',
        info: 'This release changes how pasted web images work. By default Better Paste now **paste web images as links** instead of downloading a copy into your vault. If you want local copies like before of every image link, set `Web images` to `Download with preview`.\n\nIf you enjoy using Better Paste, please help me spread the word to help others discover it!',
        new: [
            'You can now choose how web images are pasted: `Do nothing`, `Link with preview` or `Download with preview`. **Link with preview** is the new default.',
            'You can now clean up fetched link titles with ==Link snippets==! Your own regex rules rewrite the title, and the address always stays intact. Ready-made rules for GitHub, X, YouTube, Wikipedia and more are on the [wiki](https://github.com/johansan/better-paste/wiki/Snippets#link-snippets).',
            'You can now ==paste several links at once==! Every address on its own line gets its title and becomes a Markdown link.',
            'You can now ==paste multiple paragraphs into a block quote or callout==. Every pasted line stays quoted. [This has been an issue with Obsidian for years](https://forum.obsidian.md/t/paste-multiple-paragraphs-into-block-quote/36126/7).',
            'Ready-made snippets are now included: `Remove bold from headings`, `Collapse blank lines` and `Remove site names from titles` for pasted links. Edit them or switch them off like any snippet.'
        ],
        fixed: [
            'Fixed link titles for **Stack Overflow** and the **Stack Exchange**. Titles are now fetched using the Stack Exchange API.',
            'Fixed link titles for **Dropbox**. Pasted share links now get the file or folder name as their title.',
            'Fixed link titles for **Obsidian URLs**. Pasted Obsidian links now get the note name as their title.',
            'Fixed the overlapping plugins dialog counting Better Paste itself among the overlapping plugins.'
        ]
    },
    {
        version: '1.0.9',
        date: '2026-08-19',
        banner: '1.0.9.jpg',
        new: [
            'You can now name pasted images with a ==custom format==! Build file names from the note name, a frontmatter property, a rising counter or a date.',
            'New setting: ==Keep list nesting on paste==. Pasted lists now keep their nesting! Paste a list onto a list item and every level is indented to match, with bullets, numbers and checkboxes intact.',
            'You can now paste an image address into a note property. The image is saved into your vault and linked from the property, ready as a cover image in Bases.',
            "You can now switch off the What's new dialog after updates in the settings."
        ],
        changed: ['Restructured the Images settings into three parts: saving web images, file names, and size and style.'],
        fixed: ['Fixed an issue where pasting into nested list items skipped processing.']
    },
    {
        version: '1.0.7',
        date: '2026-08-18',
        banner: '1.0.7.jpg',
        new: [
            'Added support for ==custom regex snippets==! Configure in settings, ready-made snippets to import are on the [wiki](https://github.com/johansan/better-paste/wiki/Snippets).',
            'New command: ==Run snippet== applies a snippet of your choice to the current selection, even one that is switched off for pasting.'
        ]
    },
    {
        version: '1.0.6',
        date: '2026-08-17',
        new: [
            'New command: ==Clean up PDF text== for the current selection. When you run it you get a dialog with a **text preview** where you can toggle removing page numbers and joining everything into one paragraph.'
        ],
        fixed: [
            "Fixed so titles work for Reddit, YouTube, TikTok and Loom 🎉! These sites block normal page lookups, so the title is now fetched from each site's own embed service."
        ]
    },
    {
        version: '1.0.5',
        date: '2026-08-17',
        new: [
            'You can now add your own link removals, everywhere or per site, and turn off built-in ones. A live tester shows the result.',
            'You can now send in your removals to help improve the built-in list.'
        ],
        changed: [
            'Link cleaning now removes only known trackers and site clutter. Every built-in removal is verified and published, and unknown parameters stay in the link.'
        ]
    },
    {
        version: '1.0.4',
        date: '2026-08-16',
        new: ['Better Paste now warns you when the plugins **Paste URL into selection** or **Auto Link Title** are installed and enabled.']
    },
    {
        version: '1.0.3',
        date: '2026-08-16',
        new: [
            'You can now define image sizes and CSS classes to assign to images on paste. Either automatic or through a picker.',
            'Terminal cleanup and comma styling are now commands you run on a selection. Pasting no longer guesses whether your text came from a terminal.',
            'Quotes and Dashes now start switched off, so pasted typography is kept until you opt in.',
            'Reorganized the settings pane.'
        ]
    },
    {
        version: '1.0.2',
        date: '2026-08-15',
        improved: [
            'Reorganized the settings pane and moved ==About== to the bottom.',
            'Removed the summary notice after each paste. A notice now only appears when something fails.'
        ]
    },
    {
        version: '1.0.1',
        date: '2026-08-14',
        new: ['Better Paste will now fetch titles for pasted links.', 'Translated into 21 languages.']
    },
    {
        version: '1.0.0',
        date: '2026-08-13',
        banner: '1.0.0.gif',
        info: 'First version of Better Paste!'
    }
];

/** Accepts a plain numeric version such as 1.0.0, and nothing else. */
const VERSION_PATTERN = /^\d+(\.\d+)*$/;

/**
 * Validates a stored version marker, returning '' for anything that is not a version.
 * A hand-edited or half-written data.json would otherwise either suppress the dialog for
 * good or reopen it on every start.
 */
export function normalizeVersion(value: unknown): string {
    if (typeof value !== 'string') return '';

    const trimmed = value.trim();
    return VERSION_PATTERN.test(trimmed) ? trimmed : '';
}

/** Orders two versions: 1 when `a` is newer, -1 when `b` is newer, 0 when they match. */
export function compareVersions(a: string, b: string): number {
    const left = a.split('.').map(Number);
    const right = b.split('.').map(Number);

    for (let index = 0; index < Math.max(left.length, right.length); index++) {
        // A missing or unparsable segment counts as 0, so "1.2" and "1.2.0" are equal
        const difference = (left[index] || 0) - (right[index] || 0);
        if (difference !== 0) return difference > 0 ? 1 : -1;
    }

    return 0;
}

/** The most recent releases, for the button in settings. */
export function getLatestReleaseNotes(count = 5): ReleaseNote[] {
    return RELEASE_NOTES.slice(0, count);
}

/** Every release after `fromVersion` and up to `toVersion`, newest first. */
export function getReleaseNotesBetweenVersions(fromVersion: string, toVersion: string): ReleaseNote[] {
    return RELEASE_NOTES.filter(note => compareVersions(note.version, fromVersion) > 0 && compareVersions(note.version, toVersion) <= 0);
}

/**
 * The releases the upgrade dialog shows: everything after `fromVersion`, padded with the
 * releases below it so the dialog always holds a few for context. Releases above
 * `toVersion` stay hidden, because a note can sit in the code before its release ships.
 */
export function getReleaseNotesForUpdate(fromVersion: string, toVersion: string, minimum = 5): ReleaseNote[] {
    const released = RELEASE_NOTES.filter(note => compareVersions(note.version, toVersion) <= 0);
    const unseen = released.filter(note => compareVersions(note.version, fromVersion) > 0).length;
    return released.slice(0, Math.max(unseen, minimum));
}

/**
 * Whether an upgrade should open the dialog on its own.
 *
 * A release marked `showOnUpdate: false` is passed over silently, and because the marker
 * is only advanced once the dialog has actually been shown, its notes still appear later
 * alongside the next release that does open it.
 */
export function shouldAutoDisplayReleaseNotesForUpdate(fromVersion: string, toVersion: string): boolean {
    return getReleaseNotesBetweenVersions(fromVersion, toVersion).some(note => note.showOnUpdate !== false);
}
