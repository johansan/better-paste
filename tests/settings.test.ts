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
import { findInvalidDomainRules, normalizeSettings, parseLines } from '../src/settings/normalize';
import { DEFAULT_SETTINGS } from '../src/settings/defaults';
import { SHIPPED_DOMAIN_RULES } from '../src/settings/constants';
import { isPreformattedHtml, onlyImageFiles } from '../src/paste/PasteService';
import { runTextPipeline } from '../src/transforms';
import { mergeDomainRules } from '../src/transforms/urlCleanup';
import { fakeFile } from './stubs/editor';

describe('normalizeSettings', () => {
    it('returns the defaults for missing data', () => {
        expect(normalizeSettings(null)).toEqual(DEFAULT_SETTINGS);
        expect(normalizeSettings(undefined)).toEqual(DEFAULT_SETTINGS);
        expect(normalizeSettings({})).toEqual(DEFAULT_SETTINGS);
    });

    it('keeps valid stored values', () => {
        const result = normalizeSettings({ urlStripMode: 'tracking', terminalRejoinMode: 'any', imageFilenameFormat: 'date-time' });
        expect(result.urlStripMode).toBe('tracking');
        expect(result.terminalRejoinMode).toBe('any');
        expect(result.imageFilenameFormat).toBe('date-time');
    });

    it('replaces values of the wrong type', () => {
        const result = normalizeSettings({ interceptPaste: 'yes', imageSizeProperty: 7 });
        expect(result.interceptPaste).toBe(DEFAULT_SETTINGS.interceptPaste);
        expect(result.imageSizeProperty).toBe(DEFAULT_SETTINGS.imageSizeProperty);
    });

    it('drops keys that are not settings', () => {
        const result = normalizeSettings({ terminalStripAnsi: false, imageFolder: 'files', urlTrackingParams: ['x'] });
        expect(result).toEqual(DEFAULT_SETTINGS);
    });

    it("stores only the user's own site rules, leaving the shipped list in code", () => {
        expect(normalizeSettings({ urlDomainRules: ['mine.example: id'] }).urlDomainRules).toEqual(['mine.example: id']);
        expect(mergeDomainRules([])).toHaveLength(SHIPPED_DOMAIN_RULES.length);
    });

    it('round-trips its own output unchanged', () => {
        const once = normalizeSettings({ urlStripMode: 'tracking', urlDomainRules: ['mine.example: id'] });
        expect(normalizeSettings(once)).toEqual(once);
    });

    it('rejects an unknown enum value', () => {
        expect(normalizeSettings({ urlStripMode: 'sometimes' }).urlStripMode).toBe(DEFAULT_SETTINGS.urlStripMode);
        expect(normalizeSettings({ imageFilenameFormat: 'fancy' }).imageFilenameFormat).toBe(DEFAULT_SETTINGS.imageFilenameFormat);
    });
});

describe('parseLines and rule validation', () => {
    it('drops blank lines', () => {
        expect(parseLines('a\n\n  \nb')).toEqual(['a', 'b']);
    });

    it('preserves the internal structure of a rule line', () => {
        expect(parseLines('youtube.com: v, t')).toEqual(['youtube.com: v, t']);
    });

    it('accepts well-formed site rules', () => {
        expect(findInvalidDomainRules('example.com\nyoutube.com: v, t\n!github.com\n*.wild.org\nlocalhost')).toEqual([]);
    });

    it('flags a line that is not a site name', () => {
        expect(findInvalidDomainRules('youtube,com: v')).toEqual(['youtube,com: v']);
        expect(findInvalidDomainRules('not a domain')).toEqual(['not a domain']);
    });

    it('ignores comments when validating', () => {
        expect(findInvalidDomainRules('# just a note about things')).toEqual([]);
    });
});

describe('isPreformattedHtml', () => {
    it('treats a terminal <pre> dump as plain text', () => {
        expect(isPreformattedHtml('<pre><span style="color:#fff">hello</span></pre>')).toBe(true);
    });

    it('treats HTML with an image as rich content', () => {
        expect(isPreformattedHtml('<pre><img src="https://example.com/a.png"></pre>')).toBe(false);
    });

    it('treats HTML with a link as rich content', () => {
        expect(isPreformattedHtml('<pre><a href="https://example.com">x</a></pre>')).toBe(false);
    });

    it('treats ordinary prose HTML as rich content', () => {
        expect(isPreformattedHtml('<p>Hello <b>world</b></p>')).toBe(false);
    });
});

describe('onlyImageFiles', () => {
    it('is true when every file is an image', () => {
        expect(onlyImageFiles([fakeFile('a.png', 'image/png'), fakeFile('b.jpg', 'image/jpeg')])).toBe(true);
    });

    it('is false for a mixed paste, so nothing is dropped', () => {
        expect(onlyImageFiles([fakeFile('a.png', 'image/png'), fakeFile('notes.pdf', 'application/pdf')])).toBe(false);
    });

    it('is false when there are no files', () => {
        expect(onlyImageFiles([])).toBe(false);
    });

    it('is false when the type is unknown', () => {
        expect(onlyImageFiles([fakeFile('mystery', '')])).toBe(false);
    });
});

describe('runTextPipeline', () => {
    it('cleans up terminal text and its URLs in one pass', () => {
        const input = [
            '• Read the announcement at https://support.claude.com/en/articles/16266773-how-claude-marks-ai?utm_source=news and then',
            '  decide whether the change matters for us.'
        ].join('\n');

        const result = runTextPipeline(input, DEFAULT_SETTINGS);

        expect(result.text).toBe(
            '• Read the announcement at https://support.claude.com/en/articles/16266773-how-claude-marks-ai and then decide whether the change matters for us.'
        );
        expect(result.terminalCleaned).toBe(true);
        expect(result.urlsCleaned).toBe(1);
        expect(result.changed).toBe(true);
    });

    it('normalises AI typography before the other rules see it', () => {
        // A no-break space is not whitespace to a regular expression, so if the AI rule did
        // not run first the terminal rule would treat this line as non-blank
        const result = runTextPipeline('a — b', DEFAULT_SETTINGS);
        expect(result.text).toBe('a - b');
        expect(result.aiTextCleaned).toBe(true);
    });

    it('reports no change for text that needs none', () => {
        expect(runTextPipeline('Just a sentence.', DEFAULT_SETTINGS).changed).toBe(false);
    });

    it('replaces dashes after the terminal rule, not before it', () => {
        // A hyphen is a list marker. Converting the dash first would make the terminal rule
        // read this as a bullet, refuse to rejoin the paragraph, and render it as a list.
        const input = [
            '\u2014 he said, in a line that runs comfortably past the wrap column of this terminal window',
            '  and then continued on the following line.'
        ].join('\n');

        expect(runTextPipeline(input, DEFAULT_SETTINGS).text).toBe(
            '- he said, in a line that runs comfortably past the wrap column of this terminal window and then continued on the following line.'
        );
    });

    it('strips a no-break space before the terminal rule needs to see whitespace', () => {
        const input = ['A line long enough to reach the wrap column of a fairly ordinary terminal window', '\u00A0 continued here.'].join(
            '\n'
        );
        expect(runTextPipeline(input, DEFAULT_SETTINGS).text).toBe(
            'A line long enough to reach the wrap column of a fairly ordinary terminal window continued here.'
        );
    });

    it('trims blank space from the ends of the paste', () => {
        expect(runTextPipeline('\n\n   Some text copied from a web page.  \n\n', DEFAULT_SETTINGS).text).toBe(
            'Some text copied from a web page.'
        );
    });

    it('leaves the middle of the paste alone when trimming', () => {
        expect(runTextPipeline('  first\n\nsecond  ', DEFAULT_SETTINGS).text).toBe('first\n\nsecond');
    });

    it('trims after the other rules, not before', () => {
        // The terminal rule can leave a blank line at the end; the trim has to see it
        expect(runTextPipeline('text\n\n\n\n', DEFAULT_SETTINGS).text).toBe('text');
    });

    it('leaves the ends alone when trimming is off', () => {
        // The terminal rule dedents on its own, so it has to be off to isolate the trim
        const settings = { ...DEFAULT_SETTINGS, trimPaste: false, terminalEnabled: false };
        expect(runTextPipeline('  spaced  ', settings).text).toBe('  spaced  ');
    });

    it('straightens quotes as part of the pipeline', () => {
        expect(runTextPipeline('\u201CIt\u2019s fine\u201D', DEFAULT_SETTINGS).text).toBe('"It\'s fine"');
    });

    it('skips a rule that is turned off', () => {
        expect(runTextPipeline('https://example.com/a?utm_source=x', { ...DEFAULT_SETTINGS, urlEnabled: false }).text).toBe(
            'https://example.com/a?utm_source=x'
        );
        expect(runTextPipeline('a — b', { ...DEFAULT_SETTINGS, aiTextEnabled: false }).text).toBe('a — b');
    });
});
