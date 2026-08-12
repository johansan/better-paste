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
    buildUrlCleanupOptions,
    cleanUrl,
    cleanUrlsInText,
    findDomainRule,
    mergeDomainRules,
    formatDomainRule,
    parseDomainRules,
    trimUrlTail
} from '../src/transforms/urlCleanup';
import type { UrlCleanupOptions } from '../src/transforms/urlCleanup';
import { SHIPPED_DOMAIN_RULES } from '../src/settings/constants';
import type { UrlStripMode } from '../src/settings/types';

function options(urlStripMode: UrlStripMode = 'all', urlDomainRules: string[] = []): UrlCleanupOptions {
    return buildUrlCleanupOptions({ urlStripMode, urlDomainRules });
}

describe('parseDomainRules', () => {
    it('parses bare domains as keep-all rules', () => {
        expect(parseDomainRules(['gitlab.com'])).toEqual([{ domain: 'gitlab.com', anyTld: false, keepAll: true, params: [] }]);
    });

    it('parses parameter lists', () => {
        expect(parseDomainRules(['youtube.com | v, t, list'])).toEqual([
            { domain: 'youtube.com', anyTld: false, keepAll: false, params: ['v', 't', 'list'] }
        ]);
        // The old colon spelling is still accepted
        expect(parseDomainRules(['youtube.com: v'])[0].params).toEqual(['v']);
    });

    it('ignores comments, removals and blank lines', () => {
        expect(parseDomainRules(['# a comment', '', '   ', '!skipped.com', 'example.com'])).toHaveLength(1);
    });

    it('accepts a leading wildcard label', () => {
        expect(parseDomainRules(['*.example.com'])[0].domain).toBe('example.com');
    });
});

describe('mergeDomainRules', () => {
    it('returns the shipped rules when the user has added none', () => {
        expect(mergeDomainRules([])).toHaveLength(SHIPPED_DOMAIN_RULES.length);
    });

    it('adds a user rule on top of the shipped ones', () => {
        const merged = mergeDomainRules(['example.com: id']);
        expect(merged).toHaveLength(SHIPPED_DOMAIN_RULES.length + 1);
        expect(findDomainRule('example.com', merged)?.params).toEqual(['id']);
    });

    it('lets a user rule replace a shipped one for the same site', () => {
        const merged = mergeDomainRules(['youtube.com: v']);
        expect(merged.filter(rule => rule.domain === 'youtube.com')).toHaveLength(1);
        expect(findDomainRule('youtube.com', merged)?.params).toEqual(['v']);
    });

    it('lets a user drop a shipped rule entirely', () => {
        const merged = mergeDomainRules(['!youtube.com']);
        expect(findDomainRule('youtube.com', merged)).toBeNull();
        expect(merged).toHaveLength(SHIPPED_DOMAIN_RULES.length - 1);
    });
});

describe('mergeDomainRules: precedence', () => {
    it('drops a shipped rule for the subdomains of a removal too', () => {
        // "!google" has to take out maps.google as well, or it does not mean what it says
        const merged = mergeDomainRules(['!google.*']);
        expect(merged.filter(rule => rule.domain.endsWith('google'))).toEqual([]);
        expect(cleanUrl('https://maps.google.com/?q=x&ll=1', options('all', ['!google.*']))).toBe('https://maps.google.com/');
    });

    it('lets a later user rule replace an earlier one for the same site', () => {
        const merged = mergeDomainRules(['example.com: a', 'example.com: b']);
        expect(merged.filter(rule => rule.domain === 'example.com')).toHaveLength(1);
        expect(cleanUrl('https://example.com/?a=1&b=2', options('all', ['example.com: a', 'example.com: b']))).toBe(
            'https://example.com/?b=2'
        );
    });
});

describe('wildcards', () => {
    it('accepts a leading star, which means the same as the bare domain', () => {
        expect(cleanUrl('https://shop.example.com/p?id=7&utm_source=x', options('all', ['*.example.com | id']))).toBe(
            'https://shop.example.com/p?id=7'
        );
    });

    it('covers every subdomain without any wildcard at all', () => {
        expect(cleanUrl('https://deep.shop.example.com/p?id=7&utm_source=x', options('all', ['example.com | id']))).toBe(
            'https://deep.shop.example.com/p?id=7'
        );
    });

    it('matches a site on any top-level domain with a trailing star', () => {
        // One rule for google.com, google.se and google.co.uk together
        for (const host of ['google.com', 'google.se', 'google.co.uk', 'www.google.se']) {
            expect(cleanUrl(`https://${host}/search?q=hi&client=safari`, options()), host).toBe(`https://${host}/search?q=hi`);
        }
    });

    it('does not let a trailing star reach past a top-level domain', () => {
        expect(cleanUrl('https://google.a.b.c.example/search?q=hi', options())).toBe('https://google.a.b.c.example/search');
    });

    it('still does not match a domain that merely ends with the same letters', () => {
        expect(cleanUrl('https://notexample.com/p?id=7', options('all', ['example.com | id']))).toBe('https://notexample.com/p');
    });

    it('round-trips a wildcard rule through the settings field', () => {
        expect(formatDomainRule(parseDomainRules(['google.* | q'])[0])).toBe('google.* | q');
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
        const expected = 'https://support.claude.com/en/articles/16266773-how-claude-marks-ai-generated-content';

        // The reference example comes out the same either way: every parameter on it is
        // already a known tracking parameter
        expect(cleanUrl(input, options('all'))).toBe(expected);
        expect(cleanUrl(input, options('tracking'))).toBe(expected);
    });

    it('keeps meaningful parameters on a listed site', () => {
        expect(cleanUrl('https://www.youtube.com/watch?v=abc123&utm_source=news&t=42', options())).toBe(
            'https://www.youtube.com/watch?v=abc123&t=42'
        );
    });

    it('keeps every parameter on a keep-all site', () => {
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

    it('keeps a trailing slash, which can be a different resource', () => {
        expect(cleanUrl('https://example.com/a/', options())).toBe('https://example.com/a/');
    });

    it('preserves the original parameter encoding of surviving parameters', () => {
        expect(cleanUrl('https://www.google.com/search?q=a%20b+c&utm_source=x', options())).toBe('https://www.google.com/search?q=a%20b+c');
    });
});

describe('cleanUrl: tracking mode', () => {
    it('removes only tracking parameters', () => {
        expect(cleanUrl('https://example.com/a?id=7&utm_source=news&fbclid=xyz', options('tracking'))).toBe('https://example.com/a?id=7');
    });

    it('leaves an unknown parameter alone on a site that has a rule', () => {
        // A site rule must never act as a whitelist here: the user picked the cautious mode
        // precisely so that unfamiliar parameters would survive
        expect(cleanUrl('https://github.com/x/y?foo=1', options('tracking'))).toBe('https://github.com/x/y?foo=1');
    });

    it('still lets a site rule rescue a parameter that looks like tracking', () => {
        const rules = ['example.com: ref_src'];
        expect(cleanUrl('https://example.com/a?ref_src=x', options('tracking', rules))).toBe('https://example.com/a?ref_src=x');
        expect(cleanUrl('https://example.com/a?ref_src=x', options('tracking'))).toBe('https://example.com/a');
    });

    it('applies a site rule as a whitelist in strip-all mode', () => {
        expect(cleanUrl('https://github.com/x/y?foo=1', options('all'))).toBe('https://github.com/x/y');
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
