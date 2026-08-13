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

import { describe, expect, it } from 'vitest';
import {
    compareVersions,
    getLatestReleaseNotes,
    getReleaseNotesBetweenVersions,
    normalizeVersion,
    shouldAutoDisplayReleaseNotesForUpdate
} from '../src/releaseNotes';

describe('compareVersions', () => {
    it('orders on each segment as a number, not as text', () => {
        expect(compareVersions('1.2.0', '1.10.0')).toBe(-1);
        expect(compareVersions('2.0.0', '1.9.9')).toBe(1);
        expect(compareVersions('1.0.0', '1.0.0')).toBe(0);
    });

    it('counts a missing segment as zero', () => {
        expect(compareVersions('1.2', '1.2.0')).toBe(0);
        expect(compareVersions('1.2.1', '1.2')).toBe(1);
    });

    it('sorts an absent marker below every release, so a first run counts as an upgrade', () => {
        expect(compareVersions('', '1.0.0')).toBe(-1);
        expect(compareVersions('', '')).toBe(0);
    });
});

describe('normalizeVersion', () => {
    it('keeps a plain numeric version', () => {
        expect(normalizeVersion('1.0.0')).toBe('1.0.0');
        expect(normalizeVersion(' 1.0.0 ')).toBe('1.0.0');
    });

    it('discards anything else, so a hand-edited marker cannot suppress the dialog', () => {
        expect(normalizeVersion('1.0.0-beta')).toBe('');
        expect(normalizeVersion('latest')).toBe('');
        expect(normalizeVersion('')).toBe('');
        expect(normalizeVersion(7)).toBe('');
        expect(normalizeVersion(null)).toBe('');
        expect(normalizeVersion(undefined)).toBe('');
    });
});

describe('release notes', () => {
    it('lists the releases newest first, which is the order the dialog renders', () => {
        const versions = getLatestReleaseNotes(50).map(note => note.version);
        expect([...versions].sort((a, b) => compareVersions(b, a))).toEqual(versions);
    });

    it('dates every release in a form the dialog can parse', () => {
        for (const note of getLatestReleaseNotes(50)) {
            expect(note.date, `"${note.version}" has an unparsable date`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        }
    });

    it('shows a release that is newer than the marker', () => {
        expect(getReleaseNotesBetweenVersions('0.9.0', '1.0.0').map(note => note.version)).toEqual(['1.0.0']);
    });

    it('lists link title fetching as new in 1.0.1', () => {
        expect(getLatestReleaseNotes(1)[0]).toMatchObject({
            version: '1.0.1',
            date: '2026-08-13',
            new: ['Fetch titles for pasted links. A standalone web address can now become a Markdown link using the page title.']
        });
    });

    it('leaves out the release already shown', () => {
        expect(getReleaseNotesBetweenVersions('1.0.0', '1.0.0')).toEqual([]);
    });

    it('leaves out a release newer than the version running', () => {
        expect(getReleaseNotesBetweenVersions('0.9.0', '0.9.5')).toEqual([]);
    });

    it('opens by itself for an upgrade that has notes', () => {
        expect(shouldAutoDisplayReleaseNotesForUpdate('0.9.0', '1.0.0')).toBe(true);
    });

    it('stays shut when nothing was released in between', () => {
        expect(shouldAutoDisplayReleaseNotesForUpdate('1.0.1', '1.0.2')).toBe(false);
    });
});
