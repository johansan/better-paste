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
    httpUrlRanges,
    parseDomainRemovals,
    parseGlobalRemovals,
    trimUrlTail
} from '../src/transforms/urlCleanup';
import type { UrlCleanupOptions } from '../src/transforms/urlCleanup';

function options(linkRemovals: string[] = []): UrlCleanupOptions {
    return buildUrlCleanupOptions({ linkRemovals });
}

describe('parseDomainRemovals', () => {
    it('parses parameter lists', () => {
        expect(parseDomainRemovals(['youtube.com | si, feature'])).toEqual([
            { domain: 'youtube.com', anyTld: false, params: ['si', 'feature'] }
        ]);
        expect(parseDomainRemovals(['youtube.com: si'])[0].params).toEqual(['si']);
    });

    it('ignores comments, blanks and lines without parameters', () => {
        expect(parseDomainRemovals(['# a comment', '', '   ', 'example.com', 'valid.com | source'])).toEqual([
            { domain: 'valid.com', anyTld: false, params: ['source'] }
        ]);
    });

    it('accepts a leading wildcard label', () => {
        expect(parseDomainRemovals(['*.example.com | source'])[0].domain).toBe('example.com');
    });
});

describe('parseGlobalRemovals', () => {
    it('parses bare parameter names', () => {
        expect(parseGlobalRemovals(['fbclid', 'custom_*'])).toEqual(['fbclid', 'custom_*']);
    });

    it('ignores site rules, disabled rules, comments and invalid bare lines', () => {
        expect(parseGlobalRemovals(['example.com | source', '!youtube.com', '# note', '', 'two names', 'source, ref'])).toEqual([]);
    });
});

describe('wildcards', () => {
    it('accepts a leading star, which means the same as the bare domain', () => {
        expect(cleanUrl('https://shop.example.com/p?id=7&source=x', options(['*.example.com | source']))).toBe(
            'https://shop.example.com/p?id=7'
        );
    });

    it('covers every subdomain without any wildcard at all', () => {
        expect(cleanUrl('https://deep.shop.example.com/p?id=7&source=x', options(['example.com | source']))).toBe(
            'https://deep.shop.example.com/p?id=7'
        );
    });

    it('matches a site on any top-level domain with a trailing star', () => {
        for (const host of ['google.com', 'google.se', 'google.co.uk', 'www.google.se']) {
            expect(cleanUrl(`https://${host}/search?q=hi&junk=1`, options(['google.* | junk'])), host).toBe(`https://${host}/search?q=hi`);
        }
    });

    it('does not let a trailing star reach past a top-level domain', () => {
        const url = 'https://google.a.b.c.example/search?q=hi&junk=1';
        expect(cleanUrl(url, options(['google.* | junk']))).toBe(url);
    });

    it('does not mistake an ordinary two-label suffix for a country domain', () => {
        const url = 'https://google.example.com/search?q=hi&junk=1';
        expect(cleanUrl(url, options(['google.* | junk']))).toBe(url);
    });

    it('recognizes Japanese second-level labels as country domains', () => {
        expect(cleanUrl('https://brand.or.jp/page?id=7&junk=1', options(['brand.* | junk']))).toBe('https://brand.or.jp/page?id=7');
    });

    it('still does not match a domain that merely ends with the same letters', () => {
        const url = 'https://notexample.com/p?id=7&source=x';
        expect(cleanUrl(url, options(['example.com | source']))).toBe(url);
    });
});

describe('trimUrlTail', () => {
    it('drops sentence punctuation', () => {
        expect(trimUrlTail('https://example.com/a.')).toBe('https://example.com/a');
        expect(trimUrlTail('https://example.com/a\u2019')).toBe('https://example.com/a');
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

    it('ends the URL at an unmatched closing bracket in the middle', () => {
        expect(trimUrlTail('https://one.com/?utm_source=x)[b](https://two.com/)')).toBe('https://one.com/?utm_source=x');
        expect(trimUrlTail('https://one.com/?utm_source=x)[[Note]]')).toBe('https://one.com/?utm_source=x');
        expect(trimUrlTail('https://one.com/page#:~:text=exact%20words)[source](https://two.com/)')).toBe(
            'https://one.com/page#:~:text=exact%20words'
        );
    });

    it('ends the URL at emphasis markers, wikilinks and Markdown link openers', () => {
        expect(trimUrlTail('https://example.com/page?utm_source=news**')).toBe('https://example.com/page?utm_source=news');
        expect(trimUrlTail('https://example.com/read?id=7~~')).toBe('https://example.com/read?id=7');
        expect(trimUrlTail('https://a.example/?utm_source=1[[My')).toBe('https://a.example/?utm_source=1');
        expect(trimUrlTail('https://a.example/?utm_source=1[next](https://b.example/)')).toBe('https://a.example/?utm_source=1');
    });

    it('ends the URL at full-width punctuation', () => {
        expect(trimUrlTail('https://example.com/store?utm_source=line\uFF09\u3092\u898B\u308B')).toBe(
            'https://example.com/store?utm_source=line'
        );
    });

    it('ends the URL at CJK letters when CJK prose touches the front of it', () => {
        expect(trimUrlTail('https://example.com/?utm_source=x\u3092\u78BA\u8A8D', '\u306F')).toBe('https://example.com/?utm_source=x');
    });

    it('ends the URL where trailing CJK letters run from the query to the end', () => {
        expect(trimUrlTail('https://example.com/?utm_source=x\u3092\u78BA\u8A8D')).toBe('https://example.com/?utm_source=x');
    });

    it('keeps a URL whose path holds balanced full-width brackets', () => {
        expect(trimUrlTail('https://example.com/\u6771\u4EAC\uFF08\u6625\u2013\u590F\uFF09?utm_source=x')).toBe(
            'https://example.com/\u6771\u4EAC\uFF08\u6625\u2013\u590F\uFF09?utm_source=x'
        );
    });

    it('keeps CJK content inside a delimited URL', () => {
        expect(trimUrlTail('https://example.com/\u5199\u771F.png')).toBe('https://example.com/\u5199\u771F.png');
        expect(trimUrlTail('https://example.com/search?q=\u6771\u4EAC&page=2')).toBe('https://example.com/search?q=\u6771\u4EAC&page=2');
        expect(trimUrlTail('https://zh.wikipedia.org/wiki/\u4E0A\u6D77\u2013\u5357\u4EAC\u94C1\u8DEF')).toBe(
            'https://zh.wikipedia.org/wiki/\u4E0A\u6D77\u2013\u5357\u4EAC\u94C1\u8DEF'
        );
    });

    it('keeps array query parameters and IPv6 hosts', () => {
        expect(trimUrlTail('https://example.com/?a[]=1&b[]=2')).toBe('https://example.com/?a[]=1&b[]=2');
        expect(trimUrlTail('https://[::1]:8080/path')).toBe('https://[::1]:8080/path');
    });

    it('keeps a doubled star inside a query', () => {
        expect(trimUrlTail('https://example.com/search?q=%22**%22')).toBe('https://example.com/search?q=%22**%22');
    });

    it('ends the URL before a link whose label nests brackets', () => {
        expect(trimUrlTail('https://one.com/?utm_source=x[outer[inner]](https://two.com/)')).toBe('https://one.com/?utm_source=x');
    });

    it('keeps balanced parentheses that precede an unmatched closer', () => {
        expect(trimUrlTail('https://en.wikipedia.org/wiki/Foo_(bar))[b](https://two.com/)')).toBe(
            'https://en.wikipedia.org/wiki/Foo_(bar)'
        );
    });
});

describe('cleanUrl', () => {
    it('strips the tracking suffix from the reference URL', () => {
        const input =
            'https://support.claude.com/en/articles/16266773-how-claude-marks-ai-generated-content?utm_source=www.therundown.ai&utm_medium=newsletter&utm_campaign=anthropic-slips-an-invisible-signature-into-claude&_bhlid=5860aad7a9737cf115b5ac231b92ca3147d16877';
        const expected = 'https://support.claude.com/en/articles/16266773-how-claude-marks-ai-generated-content';

        expect(cleanUrl(input, options())).toBe(expected);
    });

    it('keeps meaningful parameters on a listed site', () => {
        expect(cleanUrl('https://www.youtube.com/watch?v=abc123&utm_source=news&t=42', options())).toBe(
            'https://www.youtube.com/watch?v=abc123&t=42'
        );
    });

    it('keeps unknown parameters on every site', () => {
        expect(cleanUrl('https://gitlab.com/x?a=1&b=2', options())).toBe('https://gitlab.com/x?a=1&b=2');
    });

    it('keeps the Hacker News item id', () => {
        expect(cleanUrl('https://news.ycombinator.com/item?id=123456', options())).toBe('https://news.ycombinator.com/item?id=123456');
    });

    it('keeps the page title in Wikipedia history links', () => {
        expect(cleanUrl('https://en.wikipedia.org/w/index.php?title=Obsidian_(software)&action=history', options())).toBe(
            'https://en.wikipedia.org/w/index.php?title=Obsidian_(software)&action=history'
        );
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

    it('keeps apostrophes inside a URL while cleaning its parameters', () => {
        const input = "[x](https://example.com/search?q=O'Reilly&utm_source=x)";
        expect(cleanUrlsInText(input, options()).text).toBe("[x](https://example.com/search?q=O'Reilly)");
    });

    it('keeps scroll-to-text fragments because they select content at the destination', () => {
        expect(cleanUrl('https://example.com/a#section:~:text=hello', options())).toBe('https://example.com/a#section:~:text=hello');
        expect(cleanUrl('https://example.com/a#:~:text=hello', options())).toBe('https://example.com/a#:~:text=hello');
        expect(cleanUrl('https://example.com/a?utm_source=news#:~:text=hello', options())).toBe('https://example.com/a#:~:text=hello');
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

describe('cleanUrl: removals', () => {
    it('removes global tracking parameters', () => {
        expect(cleanUrl('https://example.com/a?id=7&utm_source=news&fbclid=xyz', options())).toBe('https://example.com/a?id=7');
    });

    it('leaves an unknown parameter alone', () => {
        expect(cleanUrl('https://github.com/x/y?foo=1', options())).toBe('https://github.com/x/y?foo=1');
    });

    it('applies a bare user-defined removal on every site', () => {
        const removals = ['custom_id'];
        expect(cleanUrl('https://example.com/a?id=7&custom_id=x', options(removals))).toBe('https://example.com/a?id=7');
        expect(cleanUrl('https://elsewhere.com/a?custom_id=y&keep=1', options(removals))).toBe('https://elsewhere.com/a?keep=1');
    });

    it('applies a user-defined removal only on its site', () => {
        const removals = ['example.com | source'];
        expect(cleanUrl('https://example.com/a?id=7&source=x', options(removals))).toBe('https://example.com/a?id=7');
        expect(cleanUrl('https://elsewhere.com/a?id=7&source=x', options(removals))).toBe('https://elsewhere.com/a?id=7&source=x');
    });

    it('cleans single-label intranet hosts', () => {
        expect(cleanUrl('https://intranet/page?id=7&source=mail', options(['intranet | source']))).toBe('https://intranet/page?id=7');
    });

    it('prefers the pipe separator, keeping a colon inside a parameter name', () => {
        expect(parseDomainRemovals(['example.com | a:b'])[0].params).toEqual(['a:b']);
    });

    it('lets a user disable one shipped site removal without rescuing global trackers', () => {
        expect(cleanUrl('https://www.youtube.com/watch?v=abc&si=share&utm_source=news', options(['!youtube.com']))).toBe(
            'https://www.youtube.com/watch?v=abc&si=share'
        );
    });

    it('disables shipped removals for subdomains of the named site', () => {
        // "!google.*" must reach the shipped "www.google.*" entry without the user
        // knowing its exact spelling, because the shipped list is not shown in the field
        const url = 'https://www.google.co.uk/search?q=obsidian&client=safari';
        expect(cleanUrl(url, options(['!google.*']))).toBe(url);
        expect(cleanUrl(url, options(['!www.google.*']))).toBe(url);
        expect(cleanUrl(url, options(['!youtube.com']))).toBe('https://www.google.co.uk/search?q=obsidian');
    });

    it('extends a disabled shipped rule with user-defined removals for the same site', () => {
        expect(
            cleanUrl(
                'https://www.youtube.com/watch?v=abc&si=share&feature=embed&custom=remove',
                options(['!youtube.com', 'youtube.com | custom'])
            )
        ).toBe('https://www.youtube.com/watch?v=abc&si=share&feature=embed');
    });

    it('applies built-in site removals without dropping functional parameters', () => {
        expect(cleanUrl('https://www.youtube.com/watch?v=abc&si=share&lc=comment', options())).toBe(
            'https://www.youtube.com/watch?v=abc&lc=comment'
        );
    });
});

describe('cleanUrlsInText', () => {
    it('cleans a URL embedded in prose without eating the sentence period', () => {
        const result = cleanUrlsInText('See https://example.com/a?utm_source=x. Thanks!', options());
        expect(result.text).toBe('See https://example.com/a. Thanks!');
        expect(result.count).toBe(1);
    });

    it('cleans a URL inside curly single quotes without eating the closing quote', () => {
        const result = cleanUrlsInText('See \u2018https://example.com/a?utm_source=x\u2019 now.', options());
        expect(result.text).toBe('See \u2018https://example.com/a\u2019 now.');
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

    it('leaves URLs inside fenced and inline code untouched', () => {
        const input = [
            '`https://example.com/inline?token=keep`',
            '',
            '```ts',
            'const url = "https://example.com/fenced?token=keep";',
            '```',
            '',
            'https://example.com/prose?utm_source=remove'
        ].join('\n');

        expect(cleanUrlsInText(input, options()).text).toBe(
            [
                '`https://example.com/inline?token=keep`',
                '',
                '```ts',
                'const url = "https://example.com/fenced?token=keep";',
                '```',
                '',
                'https://example.com/prose'
            ].join('\n')
        );
    });

    it('cleans a link pasted flush against a second link without deleting it', () => {
        const result = cleanUrlsInText('[a](https://one.com/?utm_source=x)[b](https://two.com/)', options());
        expect(result.text).toBe('[a](https://one.com/)[b](https://two.com/)');
        expect(result.count).toBe(1);
    });

    it('cleans a link pasted flush against a wikilink without deleting it', () => {
        const result = cleanUrlsInText('[a](https://one.com/?utm_source=x)[[Note]]', options());
        expect(result.text).toBe('[a](https://one.com/)[[Note]]');
    });

    it('keeps a highlight-fragment link pasted flush against a second link', () => {
        const result = cleanUrlsInText('[quote](https://one.com/page#:~:text=exact%20words)[source](https://two.com/)', options());
        expect(result.text).toBe('[quote](https://one.com/page#:~:text=exact%20words)[source](https://two.com/)');
    });

    it('cleans a link pasted flush against bold text without deleting it', () => {
        const result = cleanUrlsInText('[a](https://one.com/?utm_source=x)**important note kept**', options());
        expect(result.text).toBe('[a](https://one.com/)**important note kept**');
    });

    it('cleans each link in a row of three flush links', () => {
        const result = cleanUrlsInText(
            '[a](https://one.com/?utm_source=x)[b](https://two.com/?fbclid=y)[c](https://three.com/)',
            options()
        );
        expect(result.text).toBe('[a](https://one.com/)[b](https://two.com/)[c](https://three.com/)');
        expect(result.count).toBe(2);
    });

    it('strips a tracking parameter from a flush link', () => {
        const result = cleanUrlsInText('[a](https://one.com/?utm_source=x)[b](https://two.com/)', options());
        expect(result.text).toBe('[a](https://one.com/)[b](https://two.com/)');
    });

    it('cleans a bold or struck link without eating its closing markers', () => {
        expect(cleanUrlsInText('Read **https://example.com/page?utm_source=news** now', options()).text).toBe(
            'Read **https://example.com/page** now'
        );
        expect(cleanUrlsInText('old ~~https://example.com/read?fbclid=7~~ gone', options()).text).toBe(
            'old ~~https://example.com/read~~ gone'
        );
        expect(cleanUrlsInText('Read **https://example.com/page#:~:text=foo** now', options()).text).toBe(
            'Read **https://example.com/page#:~:text=foo** now'
        );
    });

    it('cleans a URL pasted flush against CJK text without deleting the text', () => {
        expect(cleanUrlsInText('\uFF08https://example.com/store?utm_source=line\uFF09\u3092\u898B\u308B', options()).text).toBe(
            '\uFF08https://example.com/store\uFF09\u3092\u898B\u308B'
        );
        expect(cleanUrlsInText('\u8A73\u7D30\u306Fhttps://example.com/?utm_source=x\u3092\u78BA\u8A8D', options()).text).toBe(
            '\u8A73\u7D30\u306Fhttps://example.com/\u3092\u78BA\u8A8D'
        );
    });

    it('cleans a search URL whose query contains a doubled star', () => {
        expect(cleanUrlsInText('https://example.com/search?q=%22**%22', options(['example.com | q'])).text).toBe(
            'https://example.com/search'
        );
        expect(cleanUrlsInText('https://example.com/search?q=%22**%22', options()).text).toBe('https://example.com/search?q=%22**%22');
    });

    it('keeps a nested-label link pasted flush behind a bare URL', () => {
        expect(cleanUrlsInText('https://one.com/?utm_source=x[outer[inner]](https://two.com/?utm_source=y)', options()).text).toBe(
            'https://one.com/[outer[inner]](https://two.com/)'
        );
    });

    it('keeps a Markdown link pasted flush behind a bare URL', () => {
        const result = cleanUrlsInText('https://a.example/?utm_source=1[next](https://b.example/two?utm_source=2)', options());
        expect(result.text).toBe('https://a.example/[next](https://b.example/two)');
        expect(result.count).toBe(2);
    });

    it('leaves a bare URL alone when double brackets follow its query', () => {
        // [[ behind the query reads as a pasted wikilink or as a JSON array in a filter
        // parameter equally well, so the URL is not cleaned rather than corrupted
        const wikilink = 'https://a.example/?utm_source=1[[My note]]';
        expect(cleanUrlsInText(wikilink, options()).text).toBe(wikilink);
        const json = 'https://api.example.com/list?filter=[["name","=","x"]]';
        expect(cleanUrlsInText(json, options()).text).toBe(json);
    });

    it('cleans a delimited URL with CJK query values without gluing them onto the path', () => {
        expect(
            cleanUrlsInText(
                '\u8A73\u7D30\u306F https://example.com/search?q=\u6771\u4EAC&page=2 \u3092\u898B\u3066',
                options(['example.com | q, page'])
            ).text
        ).toBe('\u8A73\u7D30\u306F https://example.com/search \u3092\u898B\u3066');
        expect(cleanUrlsInText('https://example.com/story?utm_campaign=\u6771\u4EAC\u30BB\u30FC\u30EB&id=9', options()).text).toBe(
            'https://example.com/story?id=9'
        );
    });

    it('leaves flush CJK prose alone when nothing confirms it is prose', () => {
        // A URL at line start with CJK letters riding in its query reads as a query
        // value or as flush prose equally well, so it is not cleaned
        const flush = 'https://example.com/?utm_source=x\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044';
        expect(cleanUrlsInText(flush, options()).text).toBe(flush);
        const separated = '\u8A73\u7D30\uFF1Ahttps://example.com/?utm_source=x\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044';
        expect(cleanUrlsInText(separated, options()).text).toBe(separated);
    });

    it('cleans a URL whose path holds balanced full-width brackets without cutting it', () => {
        expect(cleanUrlsInText('https://example.com/\u6771\u4EAC\uFF08\u6625\u2013\u590F\uFF09?utm_source=x', options()).text).toBe(
            'https://example.com/\u6771\u4EAC\uFF08\u6625\u2013\u590F\uFF09'
        );
    });

    it('leaves a URL nested inside an ambiguous query completely alone', () => {
        const json = 'https://api.example.com/list?filter=[["url","=","https://b.example/?utm_source=2"]]';
        expect(cleanUrlsInText(json, options()).text).toBe(json);
    });

    it('treats a katakana middle dot before the URL as a bullet, not prose', () => {
        expect(cleanUrlsInText('\u30FBhttps://example.com/story?utm_campaign=\u6771\u4EAC\u30BB\u30FC\u30EB&id=9', options()).text).toBe(
            '\u30FBhttps://example.com/story?id=9'
        );
        const trailing = '\u30FBhttps://example.com/search?q=\u6771\u4EAC';
        expect(cleanUrlsInText(trailing, options()).text).toBe(trailing);
    });

    it('keeps a full-width bracket annotation flush behind a cleaned query', () => {
        expect(
            cleanUrlsInText('\u8A73\u7D30 https://example.com/doc?id=42\uFF08PDF\uFF09 \u3092\u53C2\u7167', options(['example.com | id']))
                .text
        ).toBe('\u8A73\u7D30 https://example.com/doc\uFF08PDF\uFF09 \u3092\u53C2\u7167');
    });

    it('cleans a URL whose fragment is a CJK section anchor', () => {
        expect(cleanUrlsInText('https://ja.wikipedia.org/wiki/Foo?utm_source=chatgpt.com#\u6B74\u53F2', options()).text).toBe(
            'https://ja.wikipedia.org/wiki/Foo#\u6B74\u53F2'
        );
    });

    it('leaves a fenced block indented as a list continuation untouched', () => {
        const spaces = '1. Fetch the report:\n    ```\n    wget https://cdn.example.com/report.pdf?token=abc123\n    ```';
        expect(cleanUrlsInText(spaces, options()).text).toBe(spaces);
        const tabs = '- Download the installer:\n\t```\n\tcurl -O https://example.com/file?id=123\n\t```';
        expect(cleanUrlsInText(tabs, options()).text).toBe(tabs);
    });

    it('leaves a fenced block in a blockquoted list untouched', () => {
        const input = '> - Example:\n>     ```\n>     curl https://api.acme.io/run?token=secret&mode=fast\n>     ```';
        expect(cleanUrlsInText(input, options()).text).toBe(input);
    });

    it('ends an unclosed indented fence at a less indented margin paragraph', () => {
        const input = '10. Setup:\n    ```\n    npm install\n  Visit https://example.com/page?utm_source=news for details.';
        expect(cleanUrlsInText(input, options()).text).toBe(
            '10. Setup:\n    ```\n    npm install\n  Visit https://example.com/page for details.'
        );
    });

    it('keeps same-line code after a marker with five trailing spaces', () => {
        const input = '   10.     curl https://api.example.com/run?token=secret&mode=fast';
        expect(cleanUrlsInText(input, options()).text).toBe(input);
    });

    it('keeps the indented continuation of a code-starting list item', () => {
        const input = '-     Example:\n      Visit https://example.com/?utm_source=news';
        expect(cleanUrlsInText(input, options()).text).toBe(input);
    });

    it('cleans an indented line after a bare dash under a list item', () => {
        expect(cleanUrlsInText('- item\n--\n    see https://example.com/page?utm_source=news for details', options()).text).toBe(
            '- item\n--\n    see https://example.com/page for details'
        );
    });

    it('reads a trailing-space dash under a paragraph as a setext underline', () => {
        // An empty list item cannot interrupt a paragraph, so the code below stays code
        const input = 'Foo\n- \n    curl https://example.com/?utm_source=news';
        expect(cleanUrlsInText(input, options()).text).toBe(input);
    });

    it('keeps deep indented code after a fence inside a list item', () => {
        const input = '- Item\n  ```\n  code\n  ```\n      curl https://api.example.com/run?token=secret&mode=fast';
        expect(cleanUrlsInText(input, options()).text).toBe(input);
    });

    it('keeps indented code after a margin fence that ends a list', () => {
        const input = '- item\n```\ncode\n```\n    curl https://api.example.com/run?token=secret';
        expect(cleanUrlsInText(input, options()).text).toBe(input);
    });

    it('does not mistake an empty list item for a setext underline', () => {
        expect(cleanUrlsInText('- First\n- \n    https://example.com/?utm_source=news', options()).text).toBe(
            '- First\n- \n    https://example.com/'
        );
    });

    it('cleans list continuation prose after a fence inside the item', () => {
        const input = '- Item\n  ```sh\n  echo ready\n  ```\n    See https://example.com/page?utm_source=news for details';
        expect(cleanUrlsInText(input, options()).text).toBe(
            '- Item\n  ```sh\n  echo ready\n  ```\n    See https://example.com/page for details'
        );
    });

    it('keeps indented code under a setext heading whose text starts with a pipe', () => {
        const input = '| Release notes\n===\n    curl https://api.example.com/run?token=secret&mode=fast';
        expect(cleanUrlsInText(input, options()).text).toBe(input);
    });

    it('keeps indented code directly after a table', () => {
        const input = '| Command |\n| --- |\n    curl https://api.example.com/run?token=secret&mode=fast';
        expect(cleanUrlsInText(input, options()).text).toBe(input);
    });

    it('keeps indented code directly after a closed fence', () => {
        const input = '```sh\necho ready\n```\n    curl https://api.example.com/run?token=secret&mode=fast';
        expect(cleanUrlsInText(input, options()).text).toBe(input);
    });

    it('keeps indented code directly under a setext heading', () => {
        const input = 'Install\n=======\n    curl https://api.example.com/run?token=secret&mode=fast';
        expect(cleanUrlsInText(input, options()).text).toBe(input);
    });

    it('does not mistake a lone equals line for a setext underline', () => {
        // Without a paragraph above it the equals line is itself a paragraph, so the
        // indented line below continues it as prose and gets cleaned
        expect(cleanUrlsInText('====\n    x = https://example.com/?utm_source=news', options()).text).toBe(
            '====\n    x = https://example.com/'
        );
    });

    it('keeps indented code directly under a heading or thematic break', () => {
        const heading = '# Setup\n    curl https://example.com/?utm_source=news';
        expect(cleanUrlsInText(heading, options()).text).toBe(heading);
        const rule = '***\n    curl https://example.com/?utm_source=news';
        expect(cleanUrlsInText(rule, options()).text).toBe(rule);
    });

    it('keeps a fence under a marker with five trailing spaces as code', () => {
        const input = '-     Example:\n    ```\n  Visit https://example.com/?utm_source=news\n    ```';
        expect(cleanUrlsInText(input, options()).text).toBe(input);
    });

    it('keeps an indented block below a wide-spaced list item as code', () => {
        const input = '-    Example:\n    ```\n    Visit https://example.com/?utm_source=news\n    ```';
        expect(cleanUrlsInText(input, options()).text).toBe(input);
    });

    it('ends the item where extra marker spacing sets the content indent', () => {
        const input = '-  Example:\n    ```\n  Visit https://example.com/?utm_source=news\n    ```';
        expect(cleanUrlsInText(input, options()).text).toBe('-  Example:\n    ```\n  Visit https://example.com/\n    ```');
    });

    it('keeps fence content indented to the list item but less than the opener', () => {
        const input = '- Example:\n    ```\n  curl https://api.example.com/run?token=secret&mode=fast\n    ```';
        expect(cleanUrlsInText(input, options()).text).toBe(input);
    });

    it('treats a margin delimiter after an unclosed indented fence as a new opener', () => {
        const input = '- Setup:\n    ```\n    make build\n```\nThen run curl https://example.com/?utm_source=news';
        expect(cleanUrlsInText(input, options()).text).toBe(input);
    });

    it('ends an unclosed indented fence when its list item ends', () => {
        const input = '1. Do this:\n    ```\n    npm install\nThen visit https://example.com/page?utm_source=news for details.';
        expect(cleanUrlsInText(input, options()).text).toBe(
            '1. Do this:\n    ```\n    npm install\nThen visit https://example.com/page for details.'
        );
    });

    it('does not open a fence from an indented prose line under a paragraph', () => {
        const input =
            'Instructions mention the marker.\n    ```text means a fenced block.\n```\ncurl https://api.example.com/?token=secret\n```';
        expect(cleanUrlsInText(input, options()).text).toBe(input);
    });

    it('leaves backtick spans on an indented continuation line untouched', () => {
        const input = '- Install the CLI\n    then run `curl https://api.example.com/v1?key=abc&mode=x` to verify';
        expect(cleanUrlsInText(input, options()).text).toBe(input);
    });

    it('keeps a middle dot that opens the flush trailing prose', () => {
        expect(
            cleanUrlsInText(
                '\u8A73\u7D30\u306Fhttps://example.com/?utm_source=x\u30FB\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044',
                options()
            ).text
        ).toBe('\u8A73\u7D30\u306Fhttps://example.com/\u30FB\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044');
    });

    it('cleans a separate link pasted flush behind an ambiguous one', () => {
        expect(
            cleanUrlsInText('[data](https://api.example.com/list?ids=[[1,2]])[site](https://example.com/?utm_source=x)', options()).text
        ).toBe('[data](https://api.example.com/list?ids=[[1,2]])[site](https://example.com/)');
    });

    it('protects a whole IRI path behind a katakana middle dot bullet', () => {
        const url = 'https://zh.wikipedia.org/wiki/\u4E0A\u6D77\u2013\u5357\u4EAC\u94C1\u8DEF';
        const ranges = httpUrlRanges(`\u30FB${url}`);
        expect(ranges[0].end - ranges[0].start).toBe(url.length);
    });

    it('protects a whole IRI path so the dash rule cannot reach into it', () => {
        const url = 'https://zh.wikipedia.org/wiki/\u4E0A\u6D77\u2013\u5357\u4EAC\u94C1\u8DEF';
        const ranges = httpUrlRanges(`\u53C2\u8003 ${url} \u3092\u898B\u308B`);
        expect(ranges).toHaveLength(1);
        expect(ranges[0].end - ranges[0].start).toBe(url.length);
    });

    it('does not move URL-safe query characters onto the cleaned path', () => {
        for (const suffix of ['_', '~', '*']) {
            const input = `https://example.com/a?utm_source=value${suffix}`;
            expect(cleanUrlsInText(input, options()).text).toBe('https://example.com/a');
        }
    });
});

/*
 * Regression table from the keep-list review. Functional links must survive, while the
 * small built-in remove-list may delete only the names it identifies as clutter.
 */
describe('review regressions', () => {
    const SIGNED = [
        'https://bucket.s3.eu-north-1.amazonaws.com/report.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Signature=deadbeef&X-Amz-Expires=3600&utm_source=mail',
        'https://bucket.s3.amazonaws.com/report.pdf?AWSAccessKeyId=AKIAEXAMPLE&Expires=1780000000&Signature=abc%2Bdef&utm_source=mail',
        'https://account.blob.core.windows.net/c/file.docx?sv=2022-11-02&se=2026-09-01&sig=abc%2Fdef&utm_source=mail',
        'https://storage.googleapis.com/bucket/o.png?X-Goog-Signature=beef&X-Goog-Credential=x&utm_source=mail',
        'https://storage.googleapis.com/bucket/legacy.png?GoogleAccessId=service%40example.com&Expires=1780000000&Signature=abc%2Fdef&utm_source=mail',
        'https://media.example.com/file.pdf?Expires=1780000000&KeyName=cdn-key&Signature=abc-def_&utm_source=mail',
        'https://cdn.example.net/file.pdf?Expires=1780000000&Signature=abc&Key-Pair-Id=K123&utm_source=mail',
        'https://cdn.example.net/file.pdf?Policy=encoded&Signature=abc&Key-Pair-Id=K123&utm_source=mail'
    ];

    it('preserves cryptographically signed URLs byte for byte', () => {
        for (const url of SIGNED) expect(cleanUrl(url, options()), url).toBe(url);
    });

    it.each([
        [
            'https://files.slack.com/files-pri/T-F/img.png?pub_secret=abc123&utm_source=mail',
            'https://files.slack.com/files-pri/T-F/img.png?pub_secret=abc123'
        ],
        [
            'https://www.nytimes.com/2026/07/10/magazine/x.html?unlocked_article_code=1.6U0.pZE2&utm_source=mail',
            'https://www.nytimes.com/2026/07/10/magazine/x.html?unlocked_article_code=1.6U0.pZE2'
        ],
        [
            'https://www.washingtonpost.com/politics/2026/x/?pwapi_token=eyJ0eXAi&utm_source=mail',
            'https://www.washingtonpost.com/politics/2026/x/?pwapi_token=eyJ0eXAi'
        ],
        ['https://www.wsj.com/articles/x?st=gift123&utm_source=mail', 'https://www.wsj.com/articles/x?st=gift123'],
        ['https://zoom.us/j/123?pwd=secret&utm_source=invite', 'https://zoom.us/j/123?pwd=secret'],
        [
            'https://medium.com/@writer/story-abc?source=friends_link&sk=0123456789abcdef&utm_source=mail',
            'https://medium.com/@writer/story-abc?sk=0123456789abcdef'
        ],
        [
            'https://firebasestorage.googleapis.com/v0/b/app/o/img.png?alt=media&token=abc&utm_source=mail',
            'https://firebasestorage.googleapis.com/v0/b/app/o/img.png?alt=media&token=abc'
        ],
        [
            'https://media.discordapp.net/attachments/1/2/shot.png?ex=68&is=67&hm=hash&utm_source=mail',
            'https://media.discordapp.net/attachments/1/2/shot.png?ex=68&is=67&hm=hash'
        ],
        [
            'https://www.dropbox.com/scl/fi/abc/file.pdf?rlkey=k1&dl=0&raw=1&utm_source=mail',
            'https://www.dropbox.com/scl/fi/abc/file.pdf?rlkey=k1&dl=0&raw=1'
        ]
    ])('keeps access tokens while removing trackers', (input, expected) => {
        expect(cleanUrl(input, options())).toBe(expected);
    });

    it('keeps every reproduced functional link working', () => {
        const urls = [
            'https://play.google.com/store/apps/details?id=com.example&hl=en',
            'https://books.google.com/books?id=zyTCAlFPjgYC&pg=PA10',
            'https://console.cloud.google.com/storage/browser?project=sample-project',
            'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Standup&dates=20260902T073000/20260902T181000',
            'https://www.google.com/maps/dir/?api=1&origin=Stockholm&destination=Uppsala&travelmode=transit',
            'https://www.google.com/search?q=x&udm=14',
            'https://scholar.google.com/citations?user=ABC123&hl=en',
            'https://scholar.google.com/scholar?cites=7539990608053&as_sdt=2005&hl=en',
            'https://translate.google.com/translate?sl=auto&tl=en&u=https%3A%2F%2Fexample.jp%2F',
            'https://www.youtube.com/results?search_query=obsidian+plugins',
            'https://www.youtube.com/watch?v=abc&lc=Ugw123',
            'https://github.com/search?q=obsidian&type=repositories',
            'https://github.com/o/r/issues/new?template=bug.md&title=Crash&labels=bug',
            'https://news.ycombinator.com/news?p=2',
            'https://www.amazon.com/s?k=laptop&rh=n%3A565108&page=2',
            'https://duckduckgo.com/?q=cats&iax=images&ia=images',
            'https://x.atlassian.net/issues/?jql=project%20%3D%20ABC',
            'https://www.figma.com/proto/KEY/Name?node-id=1-2&scaling=min-zoom&page-id=0%3A1&starting-point-node-id=1%3A2&m=dev',
            'https://en.wikipedia.org/wiki/Foo?redirect=no',
            'https://en.wikipedia.org/w/index.php?title=Foo&action=edit&section=2',
            'https://www.dropbox.com/scl/fi/abc/file.pdf?rlkey=k1&st=tok&dl=0&raw=1',
            'https://team.slack.com/archives/C123/p1699?thread_ts=1699.1&cid=C123',
            'https://www.reddit.com/r/ObsidianMD/comments/abc/def/?context=3',
            'https://x.com/search?q=obsidian&f=live',
            'https://superuser.com/search?q=zsh',
            'https://docs.python.org/3/search.html?q=asyncio'
        ];
        for (const url of urls) expect(cleanUrl(url, options()), url).toBe(url);
    });

    it('keeps generic campaign and ad object ids', () => {
        const url = 'https://ads.google.com/aw/adgroups?campaignId=123&adGroupId=45&authuser=0';
        expect(cleanUrl(url, options())).toBe(url);
        expect(cleanUrl('https://crm.example.com/report?campaign_id=7', options())).toBe('https://crm.example.com/report?campaign_id=7');
    });

    it('strips trackers on every site', () => {
        expect(cleanUrl('https://linear.app/?utm_source=twitter&fbclid=IwAR1', options())).toBe('https://linear.app/');
        expect(cleanUrl('https://about.gitlab.com/pricing/?utm_source=news', options())).toBe('https://about.gitlab.com/pricing/');
    });

    it('strips the newly added tracker families', () => {
        expect(
            cleanUrl('https://example.com/a?gad_source=1&srsltid=Af&ttclid=x&mtm_campaign=c&hsa_cam=1&mibextid=Zx&id=7', options())
        ).toBe('https://example.com/a?id=7');
        expect(cleanUrl('https://learn.microsoft.com/x?WT.mc_id=twitter&view=net-8.0', options())).toBe(
            'https://learn.microsoft.com/x?view=net-8.0'
        );
    });

    it('leaves out trackers with documented functional collisions', () => {
        // __s, _kx and elqTrackId are real trackers, catalogued under "Deliberately left out"
        const url = 'https://example.com/a?__s=abcdef&_kx=k&elqTrackId=t&id=7';
        expect(cleanUrl(url, options())).toBe(url);
    });

    it.each([
        ['https://www.youtube.com/watch?v=abc&si=share&lc=comment', 'https://www.youtube.com/watch?v=abc&lc=comment'],
        ['https://www.google.com/search?q=obsidian&client=safari&sca_esv=9&sourceid=chrome', 'https://www.google.com/search?q=obsidian'],
        ['https://www.google.com/maps/d/viewer?mid=1abc&usp=sharing', 'https://www.google.com/maps/d/viewer?mid=1abc'],
        ['https://www.amazon.com/s?k=laptop&rh=n%3A1&page=2&crid=A&qid=7&sr=8-3', 'https://www.amazon.com/s?k=laptop&rh=n%3A1&page=2'],
        ['https://www.bing.com/search?q=obsidian&form=QBLH&cvid=abc', 'https://www.bing.com/search?q=obsidian'],
        ['https://duckduckgo.com/?q=obsidian&ia=web&t=ffab&atb=v1', 'https://duckduckgo.com/?q=obsidian&ia=web'],
        [
            'https://www.linkedin.com/jobs/search/?keywords=developer&trk=public_jobs&trackingId=abc',
            'https://www.linkedin.com/jobs/search/?keywords=developer'
        ],
        ['https://x.com/example/status/1?s=20&ref_src=twsrc', 'https://x.com/example/status/1'],
        ['https://www.instagram.com/p/abc/?igsh=MXd0&img_index=2', 'https://www.instagram.com/p/abc/?img_index=2'],
        ['https://learn.microsoft.com/dotnet/?view=net-8.0&ocid=AID', 'https://learn.microsoft.com/dotnet/?view=net-8.0'],
        ['https://apps.apple.com/app/id1?l=en&itsct=apps_box&itscg=30200', 'https://apps.apple.com/app/id1?l=en'],
        ['https://open.spotify.com/track/abc?si=share123', 'https://open.spotify.com/track/abc'],
        ['https://medium.com/@a/story-123?source=post_page', 'https://medium.com/@a/story-123']
    ])('applies a built-in site removal without dropping other parameters', (input, expected) => {
        expect(cleanUrl(input, options())).toBe(expected);
    });
});
