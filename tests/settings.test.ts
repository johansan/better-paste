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
import { normalizeSettings, parseLines, parseTokens } from '../src/settings/normalize';
import { DEFAULT_SETTINGS } from '../src/settings/defaults';
import { isPreformattedHtml } from '../src/paste/PasteService';
import { runTextPipeline } from '../src/transforms';

describe('normalizeSettings', () => {
    it('returns the defaults for missing data', () => {
        expect(normalizeSettings(null)).toEqual(DEFAULT_SETTINGS);
        expect(normalizeSettings(undefined)).toEqual(DEFAULT_SETTINGS);
        expect(normalizeSettings({})).toEqual(DEFAULT_SETTINGS);
    });

    it('keeps valid stored values', () => {
        const result = normalizeSettings({ urlStripMode: 'tracking', terminalMinWrapWidth: 90, imageFolder: 'files' });
        expect(result.urlStripMode).toBe('tracking');
        expect(result.terminalMinWrapWidth).toBe(90);
        expect(result.imageFolder).toBe('files');
    });

    it('replaces values of the wrong type', () => {
        const result = normalizeSettings({ interceptPaste: 'yes', terminalMinWrapWidth: 'wide', imageExtensions: 'png' });
        expect(result.interceptPaste).toBe(DEFAULT_SETTINGS.interceptPaste);
        expect(result.terminalMinWrapWidth).toBe(DEFAULT_SETTINGS.terminalMinWrapWidth);
        expect(result.imageExtensions).toEqual(DEFAULT_SETTINGS.imageExtensions);
    });

    it('clamps numbers to their supported range', () => {
        expect(normalizeSettings({ imageTimeoutSeconds: 0 }).imageTimeoutSeconds).toBe(1);
        expect(normalizeSettings({ imageTimeoutSeconds: 9999 }).imageTimeoutSeconds).toBe(300);
        expect(normalizeSettings({ imageMaxSizeMb: -5 }).imageMaxSizeMb).toBe(0);
    });

    it('rejects an unknown enum value', () => {
        expect(normalizeSettings({ urlStripMode: 'sometimes' }).urlStripMode).toBe(DEFAULT_SETTINGS.urlStripMode);
    });

    it('allows a list to be emptied on purpose', () => {
        expect(normalizeSettings({ urlKeepParams: [] }).urlKeepParams).toEqual([]);
    });

    it('falls back to a usable filename template', () => {
        expect(normalizeSettings({ imageFilenameTemplate: '   ' }).imageFilenameTemplate).toBe(DEFAULT_SETTINGS.imageFilenameTemplate);
    });
});

describe('parseLines and parseTokens', () => {
    it('drops blank lines', () => {
        expect(parseLines('a\n\n  \nb')).toEqual(['a', 'b']);
    });

    it('preserves the internal structure of a rule line', () => {
        expect(parseLines('youtube.com: v, t')).toEqual(['youtube.com: v, t']);
    });

    it('splits tokens on commas and newlines', () => {
        expect(parseTokens('png, jpg\nwebp')).toEqual(['png', 'jpg', 'webp']);
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

    it('reports no change for text that needs none', () => {
        const result = runTextPipeline('Just a sentence.', DEFAULT_SETTINGS);
        expect(result.changed).toBe(false);
    });

    it('skips a rule that is turned off', () => {
        const settings = { ...DEFAULT_SETTINGS, urlEnabled: false };
        const result = runTextPipeline('https://example.com/a?utm_source=x', settings);
        expect(result.text).toBe('https://example.com/a?utm_source=x');
    });
});
