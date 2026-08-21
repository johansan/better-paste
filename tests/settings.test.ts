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
import { findInvalidRemovalRules, normalizeSettings, parseLines } from '../src/settings/normalize';
import { DEFAULT_SETTINGS } from '../src/settings/defaults';
import { SHIPPED_PARAM_REMOVALS } from '../src/settings/constants';
import { isPreformattedHtml, isSingleImageFile } from '../src/paste/PasteService';
import { runTextPipeline } from '../src/transforms';
import { parseDomainRemovals } from '../src/transforms/urlCleanup';
import { fakeFile } from './stubs/editor';

describe('normalizeSettings', () => {
    it('migrates the web image mode and validates stored values', () => {
        expect(normalizeSettings({ imageEnabled: false }).imageMode).toBe('off');
        expect(normalizeSettings({ imageEnabled: true }).imageMode).toBe('link');
        expect(normalizeSettings({}).imageMode).toBe('link');
        expect(normalizeSettings({ imageMode: 'download' }).imageMode).toBe('download');
        expect(normalizeSettings({ imageMode: 'invalid' }).imageMode).toBe('link');
    });

    it('returns the defaults for missing data', () => {
        expect(normalizeSettings(null)).toEqual(DEFAULT_SETTINGS);
        expect(normalizeSettings(undefined)).toEqual(DEFAULT_SETTINGS);
        expect(normalizeSettings({})).toEqual(DEFAULT_SETTINGS);
    });

    it('fetches link titles by default', () => {
        expect(normalizeSettings({}).linkTitles).toBe(true);
    });

    it('keeps an embed choice only while its value is still offered', () => {
        expect(normalizeSettings({ imageSizeChoice: '600' }).imageSizeChoice).toBe('600');
        expect(normalizeSettings({ imageSizeOptions: '400', imageSizeChoice: '600' }).imageSizeChoice).toBe('');
        expect(normalizeSettings({ imageClassOptions: 'invert', imageClassChoice: 'ask' }).imageClassChoice).toBe('ask');
        expect(normalizeSettings({ imageClassOptions: 'invert', imageClassChoice: 'invert' }).imageClassChoice).toBe('invert');
        // Asking with an empty list would silently do nothing, so it falls back to none
        expect(normalizeSettings({ imageClassOptions: '', imageClassChoice: 'ask' }).imageClassChoice).toBe('');
    });

    it('keeps valid stored values', () => {
        const result = normalizeSettings({
            linkRemovals: ['example.com | source'],
            linkTitles: false,
            imageNameTemplate: '{{name}}-YYYY-MM-DD'
        });
        expect(result.linkRemovals).toEqual(['example.com | source']);
        expect(result.linkTitles).toBe(false);
        expect(result.imageNameTemplate).toBe('{{name}}-YYYY-MM-DD');
    });

    it('normalizes malformed custom snippets without losing usable rules', () => {
        const result = normalizeSettings({
            textSnippets: [
                null,
                12,
                {},
                { id: 'kept', name: '  Citations  ', rules: ['// note', 's/foo/bar/g', 7], enabled: false },
                { id: 'kept', name: 'Duplicate id', rules: ['s/x/y/'], enabled: true },
                { id: '', name: '', rules: ['s/a/b/'], enabled: 'yes' },
                { id: 9, name: 'Broken but named', rules: 's/a/b/', enabled: 'yes' },
                { name: '', rules: ['not a rule'] }
            ]
        });

        expect(result.textSnippets).toHaveLength(4);
        expect(result.textSnippets[0]).toEqual({ id: 'kept', name: 'Citations', rules: ['// note', 's/foo/bar/g'], enabled: false });
        expect(result.textSnippets[1]).toMatchObject({ name: 'Duplicate id', rules: ['s/x/y/'], enabled: true });
        expect(result.textSnippets[1].id).not.toBe('kept');
        expect(result.textSnippets[2].id).toMatch(/^[a-z0-9]{7}$/u);
        expect(result.textSnippets[2]).toMatchObject({ name: '', rules: ['s/a/b/'], enabled: true });
        expect(result.textSnippets[3].id).toMatch(/^[a-z0-9]{7}$/u);
        expect(result.textSnippets[3]).toMatchObject({ name: 'Broken but named', rules: [], enabled: true });
    });

    it('keeps URL snippets separate and their ids unique across both lists', () => {
        const result = normalizeSettings({
            textSnippets: [{ id: 'shared', name: 'Text', rules: ['s/a/b/'], enabled: true }],
            urlSnippets: [{ id: 'shared', name: 'Link', rules: ['s/c/d/'], enabled: false }]
        });

        expect(result.textSnippets).toEqual([{ id: 'shared', name: 'Text', rules: ['s/a/b/'], enabled: true }]);
        expect(result.urlSnippets[0]).toMatchObject({ name: 'Link', rules: ['s/c/d/'], enabled: false });
        // Toggle controls and edit buttons look snippets up by id alone, so a duplicate is reassigned
        expect(result.urlSnippets[0].id).not.toBe('shared');
    });

    it('replaces values of the wrong type', () => {
        const result = normalizeSettings({ autoClean: 'yes', imageSizeProperty: 7 });
        expect(result.autoClean).toBe(DEFAULT_SETTINGS.autoClean);
        expect(result.imageSizeProperty).toBe(DEFAULT_SETTINGS.imageSizeProperty);
    });

    it('uses the default custom image format when the stored format is blank', () => {
        expect(normalizeSettings({ imageNameTemplate: '   ' }).imageNameTemplate).toBe('{{name}}');
    });

    it('drops keys that are not settings', () => {
        const result = normalizeSettings({
            terminalStripAnsi: false,
            imageFolder: 'files',
            imageLinkPaste: 'link',
            urlTrackingParams: ['x']
        });
        expect(result).toEqual(DEFAULT_SETTINGS);
    });

    it('stores only user-defined removals, leaving the shipped list in code', () => {
        expect(normalizeSettings({ linkRemovals: ['mine.example | source'] }).linkRemovals).toEqual(['mine.example | source']);
        expect(parseDomainRemovals(SHIPPED_PARAM_REMOVALS)).toHaveLength(SHIPPED_PARAM_REMOVALS.length);
    });

    it('round-trips its own output unchanged', () => {
        const once = normalizeSettings({ linkRemovals: ['mine.example | source'] });
        expect(normalizeSettings(once)).toEqual(once);
    });

    it('does not reinterpret old keep-lists as removals', () => {
        expect(normalizeSettings({ linkStrip: 'all', linkRules: ['mine.example | id'] }).linkRemovals).toEqual([]);
    });

    it('resets the template when the old format dropdown stored source', () => {
        expect(normalizeSettings({ imageNameFormat: 'source', imageNameTemplate: '{{noteName}}' }).imageNameTemplate).toBe(
            DEFAULT_SETTINGS.imageNameTemplate
        );
        expect(normalizeSettings({ imageNameFormat: 'custom', imageNameTemplate: '{{noteName}}' }).imageNameTemplate).toBe('{{noteName}}');
    });
});

describe('parseLines and rule validation', () => {
    it('drops blank lines', () => {
        expect(parseLines('a\n\n  \nb')).toEqual(['a', 'b']);
    });

    it('preserves the internal structure of a rule line', () => {
        expect(parseLines('youtube.com: v, t')).toEqual(['youtube.com: v, t']);
    });

    it('accepts well-formed removals', () => {
        expect(findInvalidRemovalRules('fbclid\nyoutube.com | si, feature\n*.wild.org: ref\nlocalhost | debug\n!youtube.com')).toEqual([]);
    });

    it('flags a bad site, malformed global entry or disabled rule with parameters', () => {
        expect(findInvalidRemovalRules('youtube,com: v')).toEqual(['youtube,com: v']);
        expect(findInvalidRemovalRules('two parameter names')).toEqual(['two parameter names']);
        expect(findInvalidRemovalRules('!youtube.com | si')).toEqual(['!youtube.com | si']);
    });

    it('accepts a single-label intranet site rule but not a single-label disable', () => {
        expect(findInvalidRemovalRules('intranet | source')).toEqual([]);
        // A single label can never reach a shipped removal, so disabling one is a mistake
        expect(findInvalidRemovalRules('!fbclid')).toEqual(['!fbclid']);
    });

    it('flags a site written with a port instead of splitting it at the colon', () => {
        expect(findInvalidRemovalRules('localhost:3000 | debug')).toEqual(['localhost:3000 | debug']);
    });

    it('ignores comments when validating', () => {
        expect(findInvalidRemovalRules('# just a note about things')).toEqual([]);
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

    it('treats prose containing a code block as rich content', () => {
        expect(isPreformattedHtml('<h2>Example</h2><p>Run this:</p><pre><code>npm test</code></pre>')).toBe(false);
    });

    it('treats a standalone browser code block as rich content', () => {
        expect(isPreformattedHtml('<pre><code>npm test</code></pre>')).toBe(false);
    });

    it('allows clipboard metadata around a terminal pre block', () => {
        expect(isPreformattedHtml('<head><meta charset="UTF-8"></head><!--StartFragment--><pre>output</pre>')).toBe(true);
    });
});

describe('isSingleImageFile', () => {
    it('is true for one image', () => {
        expect(isSingleImageFile([fakeFile('a.png', 'image/png')])).toBe(true);
    });

    it('is false for several images, which are left to Obsidian', () => {
        expect(isSingleImageFile([fakeFile('a.png', 'image/png'), fakeFile('b.jpg', 'image/jpeg')])).toBe(false);
    });

    it('is false for a non-image file', () => {
        expect(isSingleImageFile([fakeFile('notes.pdf', 'application/pdf')])).toBe(false);
    });

    it('is false when there are no files', () => {
        expect(isSingleImageFile([])).toBe(false);
    });

    it('is false when the type is unknown', () => {
        expect(isSingleImageFile([fakeFile('mystery', '')])).toBe(false);
    });
});

describe('runTextPipeline', () => {
    it('cleans URLs without touching the line structure', () => {
        const input = [
            '\u2022 Read the announcement at https://support.claude.com/en/articles/16266773-how-claude-marks-ai?utm_source=news and then',
            '  decide whether the change matters for us.'
        ].join('\n');

        const result = runTextPipeline(input, DEFAULT_SETTINGS);

        // Terminal rejoining and bullet conversion moved to commands, so the lines and
        // the bullet stay as pasted while the URL still loses its tracking parameter
        expect(result.text).toBe(
            [
                '\u2022 Read the announcement at https://support.claude.com/en/articles/16266773-how-claude-marks-ai and then',
                '  decide whether the change matters for us.'
            ].join('\n')
        );
        expect(result.changed).toBe(true);
    });

    it('normalises AI typography before the other rules see it', () => {
        // A no-break space is not whitespace to a regular expression, so if the AI rule did
        // not run first the terminal rule would treat this line as non-blank
        const result = runTextPipeline('a\u00a0\u2014\u00a0b', { ...DEFAULT_SETTINGS, textDashes: true });
        expect(result.text).toBe('a - b');
    });

    it('reports no change for text that needs none', () => {
        expect(runTextPipeline('Just a sentence.', DEFAULT_SETTINGS).changed).toBe(false);
    });

    it('keeps image access parameters when image downloading is off', () => {
        const input = 'See ![shot](https://cdn.discordapp.com/attachments/123/456/shot.png?ex=66f&is=66e&hm=abc123)';
        expect(runTextPipeline(input, { ...DEFAULT_SETTINGS, imageMode: 'off' }).text).toBe(input);
    });

    it('cleans the destination of an escaped image, which renders as a link', () => {
        const input = '\\![Screenshot](https://example.com/screenshot.png?utm_source=news)';
        expect(runTextPipeline(input, { ...DEFAULT_SETTINGS, imageMode: 'off' }).text).toBe(
            '\\![Screenshot](https://example.com/screenshot.png)'
        );
    });

    it('leaves comma placement alone by default', () => {
        expect(runTextPipeline('He called it "finished," then left.', DEFAULT_SETTINGS).text).toBe('He called it "finished," then left.');
    });

    it('trims blank space from the ends of the paste', () => {
        expect(runTextPipeline('\n\n   Some text copied from a web page.  \n\n', DEFAULT_SETTINGS).text).toBe(
            'Some text copied from a web page.'
        );
    });

    it('leaves the middle of the paste alone when trimming', () => {
        expect(runTextPipeline('  first\n\nsecond  ', DEFAULT_SETTINGS).text).toBe('first\n\nsecond');
    });

    it('preserves indentation that makes the first line a Markdown code block', () => {
        expect(runTextPipeline('    first code line\n    second code line', DEFAULT_SETTINGS).text).toBe(
            '    first code line\n    second code line'
        );
    });

    it('leaves URLs and punctuation inside indented Markdown code alone', () => {
        const input = '    https://example.com/api?token=secret 2020\u20132024';
        expect(runTextPipeline(input, DEFAULT_SETTINGS).text).toBe(input);
    });

    it('trims after the other rules, not before', () => {
        // The terminal rule can leave a blank line at the end; the trim has to see it
        expect(runTextPipeline('text\n\n\n\n', DEFAULT_SETTINGS).text).toBe('text');
    });

    it('leaves the ends alone when trimming is off', () => {
        // The terminal rule dedents on its own, so it has to be off to isolate the trim
        const settings = { ...DEFAULT_SETTINGS, textTrim: false, terminalEnabled: false };
        expect(runTextPipeline('  spaced  ', settings).text).toBe('  spaced  ');
    });

    it('straightens quotes as part of the pipeline', () => {
        expect(runTextPipeline('\u201CIt\u2019s fine\u201D', { ...DEFAULT_SETTINGS, textQuotes: true }).text).toBe('"It\'s fine"');
    });

    it('keeps curly quotes around a URL while cleaning it', () => {
        expect(
            runTextPipeline('See \u201Chttps://example.com/page?utm_source=news\u201D now.', { ...DEFAULT_SETTINGS, textQuotes: true }).text
        ).toBe('See "https://example.com/page" now.');
    });

    it('straightens curly single quotes around a URL without losing the closing quote', () => {
        const styled = { ...DEFAULT_SETTINGS, textQuotes: true };
        expect(runTextPipeline('See \u2018https://example.com/page?utm_source=news\u2019 now.', styled).text).toBe(
            "See 'https://example.com/page' now."
        );
        expect(runTextPipeline('See \u2018https://example.com/page\u2019 now.', styled).text).toBe("See 'https://example.com/page' now.");
    });

    it('keeps a URL inside frontmatter intact while cleaning body links', () => {
        const input = '---\nsource: https://forum.example.com/thread?id=42\n---\nSee https://example.com/a?utm_source=x';
        expect(runTextPipeline(input, DEFAULT_SETTINGS).text).toBe(
            '---\nsource: https://forum.example.com/thread?id=42\n---\nSee https://example.com/a'
        );
    });

    it('keeps the indent of a pasted list fragment, preserving sibling items', () => {
        const input = '  - alpha\n  - beta';
        expect(runTextPipeline(input, DEFAULT_SETTINGS).text).toBe(input);
    });

    it('skips a rule that is turned off', () => {
        expect(runTextPipeline('https://example.com/a?utm_source=x', { ...DEFAULT_SETTINGS, linkEnabled: false }).text).toBe(
            'https://example.com/a?utm_source=x'
        );
        expect(runTextPipeline('a \u2014 b', { ...DEFAULT_SETTINGS, textDashes: false }).text).toBe('a \u2014 b');
        expect(runTextPipeline('\u201cq\u201d', { ...DEFAULT_SETTINGS, textQuotes: false }).text).toBe('\u201cq\u201d');
    });
});
