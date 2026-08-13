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
        version: '1.0.1',
        date: '2026-08-13',
        new: ['Fetch titles for pasted links. A standalone web address can now become a Markdown link using the page title.']
    },
    {
        version: '1.0.0',
        date: '2026-08-13',
        banner: '1.0.0.gif',
        info: 'This is the first version of Better Paste!',
        new: [
            'Saves pasted images into the vault as attachments. Covers Safari’s `Copy image`, pictures inside copied web content, and bitmaps already on the clipboard.',
            'Removes tracking parameters from pasted links. Thirty-three sites ship with a rule that keeps the parameters they need.',
            'Rejoins wrapped lines in terminal output, and removes color codes and indentation. Fenced code, tables and list items are left alone.',
            'Replaces curly quotes, long dashes and invisible characters with plain equivalents.',
            'Four commands: `Paste`, `Paste without processing`, `Clean up selection` and `Toggle automatic cleanup`.',
            'A note can opt out with the `better-paste: false` property, or set the width of pasted images with `image-width`.'
        ]
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
 * Whether an upgrade should open the dialog on its own.
 *
 * A release marked `showOnUpdate: false` is passed over silently, and because the marker
 * is only advanced once the dialog has actually been shown, its notes still appear later
 * alongside the next release that does open it.
 */
export function shouldAutoDisplayReleaseNotesForUpdate(fromVersion: string, toVersion: string): boolean {
    return getReleaseNotesBetweenVersions(fromVersion, toVersion).some(note => note.showOnUpdate !== false);
}
