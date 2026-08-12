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
import { cleanUrl, cleanUrlsInText, findDomainRule, parseDomainRules, trimUrlTail } from '../src/transforms/urlCleanup';
import type { UrlCleanupOptions } from '../src/transforms/urlCleanup';
import { DEFAULT_SETTINGS } from '../src/settings/defaults';

function options(overrides: Partial<UrlCleanupOptions> = {}): UrlCleanupOptions {
    return { ...DEFAULT_SETTINGS, ...overrides };
}

describe('parseDomainRules', () => {
    it('parses bare domains as keep-all rules', () => {
        expect(parseDomainRules(['gitlab.com'])).toEqual([{ domain: 'gitlab.com', keepAll: true, params: [] }]);
    });

    it('parses parameter lists', () => {
        expect(parseDomainRules(['youtube.com: v, t, list'])).toEqual([
            { domain: 'youtube.com', keepAll: false, params: ['v', 't', 'list'] }
        ]);
    });

    it('ignores comments and blank lines', () => {
        expect(parseDomainRules(['# a comment', '', '   ', 'example.com'])).toHaveLength(1);
    });

    it('accepts a leading wildcard label', () => {
        expect(parseDomainRules(['*.example.com'])[0].domain).toBe('example.com');
    });
});

describe('findDomainRule', () => {
    const rules = parseDomainRules(['google.com: q', 'maps.google.com: q, ll, z']);

    it('matches subdomains', () => {
        expect(findDomainRule('www.google.com', rules)?.domain).toBe('google.com');
    });

    it('prefers the most specific rule', () => {
        expect(findDomainRule('maps.google.com', rules)?.domain).toBe('maps.google.com');
    });

    it('does not match a domain that merely ends with the same letters', () => {
        expect(findDomainRule('notgoogle.com', rules)).toBeNull();
    });

    it('returns null when nothing matches', () => {
        expect(findDomainRule('example.com', rules)).toBeNull();
    });
});

describe('trimUrlTail', () => {
    it('drops sentence punctuation', () => {
        expect(trimUrlTail('https://example.com/a.')).toBe('https://example.com/a');
    });

    it('drops an unbalanced closing parenthesis', () => {
        expect(trimUrlTail('https://example.com/a)')).toBe('https://example.com/a');
    });

    it('keeps balanced parentheses', () => {
        expect(trimUrlTail('https://en.wikipedia.org/wiki/Foo_(bar)')).toBe('https://en.wikipedia.org/wiki/Foo_(bar)');
    });

    it('drops the extra parenthesis from a Markdown link containing parentheses', () => {
        expect(trimUrlTail('https://en.wikipedia.org/wiki/Foo_(bar))')).toBe('https://en.wikipedia.org/wiki/Foo_(bar)');
    });
});

describe('cleanUrl', () => {
    it('strips the tracking suffix from the reference URL', () => {
        const input =
            'https://support.claude.com/en/articles/16266773-how-claude-marks-ai-generated-content?utm_source=www.therundown.ai&utm_medium=newsletter&utm_campaign=anthropic-slips-an-invisible-signature-into-claude&_bhlid=5860aad7a9737cf115b5ac231b92ca3147d16877';
        expect(cleanUrl(input, options())).toBe('https://support.claude.com/en/articles/16266773-how-claude-marks-ai-generated-content');
    });

    it('keeps meaningful parameters on an exempt domain', () => {
        expect(cleanUrl('https://www.youtube.com/watch?v=abc123&utm_source=news&t=42', options())).toBe(
            'https://www.youtube.com/watch?v=abc123&t=42'
        );
    });

    it('keeps every parameter on a keep-all domain', () => {
        expect(cleanUrl('https://gitlab.com/x?a=1&b=2', options())).toBe('https://gitlab.com/x?a=1&b=2');
    });

    it('keeps the Hacker News item id', () => {
        expect(cleanUrl('https://news.ycombinator.com/item?id=123456', options())).toBe('https://news.ycombinator.com/item?id=123456');
    });

    it('returns non-http URLs untouched', () => {
        expect(cleanUrl('mailto:someone@example.com?subject=hi', options())).toBe('mailto:someone@example.com?subject=hi');
    });

    it('returns malformed input untouched', () => {
        expect(cleanUrl('not a url', options())).toBe('not a url');
    });

    it('preserves the exact spelling when nothing is removed', () => {
        expect(cleanUrl('https://example.com', options())).toBe('https://example.com');
    });

    it('strips a scroll-to-text fragment but keeps the anchor', () => {
        expect(cleanUrl('https://example.com/a#section:~:text=hello', options())).toBe('https://example.com/a#section');
        expect(cleanUrl('https://example.com/a#:~:text=hello', options())).toBe('https://example.com/a');
    });

    it('keeps ordinary fragments', () => {
        expect(cleanUrl('https://example.com/a#section', options())).toBe('https://example.com/a#section');
    });

    it('removes all fragments when configured to', () => {
        expect(cleanUrl('https://example.com/a#section', options({ urlStripAllFragments: true }))).toBe('https://example.com/a');
    });

    it('removes only tracking parameters in tracking mode', () => {
        expect(cleanUrl('https://example.com/a?id=7&utm_source=news&fbclid=xyz', options({ urlStripMode: 'tracking' }))).toBe(
            'https://example.com/a?id=7'
        );
    });

    it('honours the global keep list in strip-all mode', () => {
        expect(cleanUrl('https://example.com/a?id=7&utm_source=news', options({ urlKeepParams: ['id'] }))).toBe(
            'https://example.com/a?id=7'
        );
    });

    it('preserves the original parameter encoding of surviving parameters', () => {
        expect(cleanUrl('https://www.google.com/search?q=a%20b+c&utm_source=x', options())).toBe('https://www.google.com/search?q=a%20b+c');
    });

    it('strips a trailing slash only when configured to', () => {
        expect(cleanUrl('https://example.com/a/', options())).toBe('https://example.com/a/');
        expect(cleanUrl('https://example.com/a/', options({ urlStripTrailingSlash: true }))).toBe('https://example.com/a');
        expect(cleanUrl('https://example.com/', options({ urlStripTrailingSlash: true }))).toBe('https://example.com/');
    });
});

describe('cleanUrlsInText', () => {
    it('cleans a URL embedded in prose without eating the sentence period', () => {
        const result = cleanUrlsInText('See https://example.com/a?utm_source=x. Thanks!', options());
        expect(result.text).toBe('See https://example.com/a. Thanks!');
        expect(result.count).toBe(1);
    });

    it('cleans a Markdown link target', () => {
        const result = cleanUrlsInText('[label](https://example.com/a?utm_source=x)', options());
        expect(result.text).toBe('[label](https://example.com/a)');
    });

    it('cleans several URLs and counts them', () => {
        const result = cleanUrlsInText('https://a.com/?utm_source=x https://b.com/?fbclid=y https://c.com/', options());
        expect(result.text).toBe('https://a.com/ https://b.com/ https://c.com/');
        expect(result.count).toBe(2);
    });

    it('leaves text without URLs untouched', () => {
        const result = cleanUrlsInText('no links here', options());
        expect(result.count).toBe(0);
        expect(result.text).toBe('no links here');
    });
});
