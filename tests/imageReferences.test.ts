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
    extensionOfUrl,
    escapeMarkdownDestination,
    findImageReferences,
    imageSourcesFromHtml,
    isDataImageUri,
    remoteMarkdownEmbed,
    replaceImageReferences
} from '../src/paste/imageReferences';

describe('remoteMarkdownEmbed', () => {
    it('removes label delimiters before appending the size', () => {
        expect(remoteMarkdownEmbed('A [cat] | photo', 'https://example.com/cat.png', '400')).toBe(
            '![A cat photo|400](https://example.com/cat.png)'
        );
    });

    it('encodes spaces and balanced or unbalanced parentheses', () => {
        expect(remoteMarkdownEmbed('', 'https://example.com/a (b).png?q=x+y&raw=%2F', null)).toBe(
            '![](https://example.com/a%20%28b%29.png?q=x+y&raw=%2F)'
        );
        expect(remoteMarkdownEmbed('', 'https://example.com/a(b.png', null)).toBe('![](https://example.com/a%28b.png)');
        expect(remoteMarkdownEmbed('', 'https://example.com/a)b.png', null)).toBe('![](https://example.com/a%29b.png)');
    });

    it('removes a trailing backslash from the label and remains parseable', () => {
        const embed = remoteMarkdownEmbed('A cat\\', 'https://example.com/cat.png', null);

        expect(embed).toBe('![A cat](https://example.com/cat.png)');
        expect(findImageReferences(embed)).toMatchObject([{ token: embed, alt: 'A cat', kind: 'markdown' }]);
    });

    it('collapses a literal newline in the label and remains parseable', () => {
        const embed = remoteMarkdownEmbed('A\n  cat', 'https://example.com/cat.png', null);

        expect(embed).toBe('![A cat](https://example.com/cat.png)');
        expect(findImageReferences(embed)).toMatchObject([{ token: embed, alt: 'A cat', kind: 'markdown' }]);
    });

    it('sanitizes an encoded newline from an HTML alt and remains parseable', () => {
        const [htmlImage] = findImageReferences('<img src="https://example.com/cat.png" alt="A&#10;cat">');
        const embed = remoteMarkdownEmbed(htmlImage.alt, htmlImage.url, null);

        expect(embed).toBe('![A cat](https://example.com/cat.png)');
        expect(findImageReferences(embed)).toMatchObject([{ token: embed, alt: 'A cat', kind: 'markdown' }]);
    });

    it('encodes an HTML source newline in the destination and remains parseable', () => {
        const [htmlImage] = findImageReferences('<img src="https://example.com/a&#10;b.png">');
        const embed = remoteMarkdownEmbed(htmlImage.alt, htmlImage.url, null);

        expect(embed).toBe('![](https://example.com/a%0Ab.png)');
        expect(findImageReferences(embed)).toMatchObject([{ token: embed, url: 'https://example.com/a%0Ab.png', kind: 'markdown' }]);
    });

    it('encodes angle brackets decoded from an HTML source and remains parseable', () => {
        const [htmlImage] = findImageReferences('<img src="https://example.com/a&lt;b&gt;.png">');
        const embed = remoteMarkdownEmbed(htmlImage.alt, htmlImage.url, null);

        expect(embed).toBe('![](https://example.com/a%3Cb%3E.png)');
        expect(findImageReferences(embed)).toMatchObject([{ token: embed, url: 'https://example.com/a%3Cb%3E.png', kind: 'markdown' }]);
    });
});

describe('escapeMarkdownDestination', () => {
    it('encodes Markdown delimiters and whitespace', () => {
        expect(escapeMarkdownDestination('a\\()<> \r\n\tb')).toBe('a%5C%28%29%3C%3E%20%0D%0A%09b');
    });
});

describe('isDataImageUri', () => {
    it('recognises image data URIs', () => {
        expect(isDataImageUri('data:image/png;base64,AAAA')).toBe(true);
        expect(isDataImageUri('data:text/plain,hello')).toBe(false);
        expect(isDataImageUri('https://example.com/a.png')).toBe(false);
    });
});

describe('extensionOfUrl', () => {
    it('reads the extension from the path, ignoring the query', () => {
        expect(extensionOfUrl('https://example.com/a/b.PNG?x=1')).toBe('png');
    });

    it('returns null when the path has no extension', () => {
        expect(extensionOfUrl('https://example.com/image')).toBeNull();
    });
});

describe('findImageReferences', () => {
    it('finds a Markdown image and keeps its alt text', () => {
        const found = findImageReferences('before ![a cat](https://example.com/cat.png) after');
        expect(found).toHaveLength(1);
        expect(found[0]).toMatchObject({ url: 'https://example.com/cat.png', alt: 'a cat', kind: 'markdown' });
    });

    it('finds a Markdown image whose URL has no extension', () => {
        const found = findImageReferences('![](https://example.com/render?id=7)');
        expect(found).toHaveLength(1);
        expect(found[0].url).toBe('https://example.com/render?id=7');
    });

    it('finds a Markdown image whose URL contains parentheses', () => {
        const found = findImageReferences('![](https://example.com/photo_(1).png)');
        expect(found).toHaveLength(1);
        expect(found[0].url).toBe('https://example.com/photo_(1).png');
        expect(found[0].token).toBe('![](https://example.com/photo_(1).png)');
    });

    it('finds a Markdown image with an escaped bracket in its alt text', () => {
        const found = findImageReferences('![a \\] bracket](https://example.com/photo.png)');
        expect(found).toHaveLength(1);
        expect(found[0]).toMatchObject({ url: 'https://example.com/photo.png', alt: 'a \\] bracket', kind: 'markdown' });
    });

    it('returns promptly for an incomplete Markdown link', () => {
        expect(findImageReferences('[label](https://example.com/abcdefgh')).toHaveLength(0);
    });

    it('finds an HTML image tag and its alt text', () => {
        const found = findImageReferences('<img src="https://example.com/a.jpg" alt="hello">');
        expect(found).toHaveLength(1);
        expect(found[0]).toMatchObject({ url: 'https://example.com/a.jpg', alt: 'hello', kind: 'html' });
    });

    it('decodes character references in HTML image attributes', () => {
        const text =
            '<img src="https://example.com/a.jpg?one=1&amp;two=2" ' +
            'alt="A &amp; B &lt; C &gt; D &quot;E&quot; &apos;F&apos; &#65; &#x42; &nbsp; G">';
        const found = findImageReferences(text);

        expect(found[0]).toMatchObject({
            token: text,
            url: 'https://example.com/a.jpg?one=1&two=2',
            alt: 'A & B < C > D "E" \'F\' A B \u00a0 G',
            kind: 'html'
        });
        expect(imageSourcesFromHtml(text)).toEqual(['https://example.com/a.jpg?one=1&two=2']);
    });

    it('keeps greater-than signs inside quoted HTML attributes', () => {
        const text = '<img src="https://example.com/a.jpg" alt="A > B">';
        const found = findImageReferences(text);

        expect(found[0]).toMatchObject({ token: text, url: 'https://example.com/a.jpg', alt: 'A > B', kind: 'html' });
        expect(replaceImageReferences(text, found, new Map([[found[0].index, '![[a.jpg]]']]))).toBe('![[a.jpg]]');
    });

    it('does not mistake data attributes for src and alt', () => {
        const text = '<img data-src="https://example.com/lazy.jpg" src="https://example.com/actual.jpg" data-alt="Preview" alt="Actual">';
        const found = findImageReferences(text);

        expect(found[0]).toMatchObject({ url: 'https://example.com/actual.jpg', alt: 'Actual', kind: 'html' });
        expect(imageSourcesFromHtml(text)).toEqual(['https://example.com/actual.jpg']);
    });

    it('finds a data URI image', () => {
        const found = findImageReferences('![](data:image/png;base64,AAAA)');
        expect(found).toHaveLength(1);
        expect(found[0].kind).toBe('markdown');
    });

    it('finds a bare image URL', () => {
        const found = findImageReferences('https://example.com/photo.jpg');
        expect(found).toHaveLength(1);
        expect(found[0].kind).toBe('bare');
    });

    it('leaves character reference text in a bare URL untouched', () => {
        const url = 'https://example.com/photo.jpg?one=1&amp;two=2';
        const found = findImageReferences(url);

        expect(found[0]).toMatchObject({ token: url, url, kind: 'bare' });
    });

    it('finds a bare image URL with a CJK filename', () => {
        const found = findImageReferences('https://example.com/\u5199\u771F.png');
        expect(found).toHaveLength(1);
        expect(found[0]).toMatchObject({ url: 'https://example.com/\u5199\u771F.png', kind: 'bare' });
    });

    it('finds a bare CJK-named image behind a katakana middle dot bullet', () => {
        const found = findImageReferences('\u30FBhttps://example.com/\u5199\u771F.png');
        expect(found).toHaveLength(1);
        expect(found[0].url).toBe('https://example.com/\u5199\u771F.png');
    });

    it('finds a bare image URL whose name holds balanced full-width brackets', () => {
        const found = findImageReferences('https://example.com/\u5199\u771F\uFF08\u6625\uFF09.png');
        expect(found).toHaveLength(1);
        expect(found[0]).toMatchObject({ url: 'https://example.com/\u5199\u771F\uFF08\u6625\uFF09.png', kind: 'bare' });
    });

    it('finds a bare image URL after an ambiguous link with no whitespace between', () => {
        const found = findImageReferences('[data](https://api.example.com/list?ids=[[1,2]])\u3001https://example.com/photo.png \u6B21');
        expect(found).toHaveLength(1);
        expect(found[0].url).toBe('https://example.com/photo.png');
    });

    it('does not rewrite an image URL nested inside an ambiguous query', () => {
        expect(findImageReferences('https://api.example.com/list?filter=[["url","=","https://b.example/photo.png"]]')).toHaveLength(0);
    });

    it('finds a bare image URL whose path contains balanced parentheses', () => {
        const found = findImageReferences('https://example.com/photo_(1).png');
        expect(found).toHaveLength(1);
        expect(found[0]).toMatchObject({ url: 'https://example.com/photo_(1).png', kind: 'bare' });
    });

    it('ignores a bare URL that is not an image', () => {
        expect(findImageReferences('https://example.com/article')).toHaveLength(0);
    });

    it('does not double-count the URL inside a Markdown image', () => {
        const found = findImageReferences('![](https://example.com/cat.png)');
        expect(found).toHaveLength(1);
        expect(found[0].kind).toBe('markdown');
    });

    it('does not treat an escaped image as an image reference', () => {
        expect(findImageReferences('\\![Screenshot](https://example.com/screenshot.png?utm_source=news)')).toHaveLength(0);
    });

    it('treats an image behind an escaped backslash as a real image', () => {
        expect(findImageReferences('\\\\![Screenshot](https://cdn.example.com/screenshot.png?token=secret)')).toHaveLength(1);
    });

    it('does not treat a normal Markdown link target as a bare image URL', () => {
        expect(findImageReferences('[photo](https://example.com/cat.png)')).toHaveLength(0);
    });

    it('does not rewrite an image URL inside a Markdown link definition', () => {
        const text = '![photo][cat]\n\n[cat]: https://example.com/cat.png "A cat"';
        expect(findImageReferences(text)).toHaveLength(0);
    });

    it('does not treat code examples as image references', () => {
        const text = ['`https://example.com/inline.png`', '```md', '![](https://example.com/fenced.png)', '```'].join('\n');
        expect(findImageReferences(text)).toHaveLength(0);
    });

    it('does not treat autolinks or HTML attributes as image references', () => {
        expect(findImageReferences('<https://example.com/cat.png>')).toHaveLength(0);
        expect(findImageReferences('<a href="https://example.com/cat.png">cat</a>')).toHaveLength(0);
    });

    it('returns references sorted by position', () => {
        const text = '![](https://example.com/b.png) and <img src="https://example.com/a.png">';
        const found = findImageReferences(text);
        expect(found.map(reference => reference.index)).toEqual([...found.map(reference => reference.index)].sort((a, b) => a - b));
    });
});

describe('replaceImageReferences', () => {
    it('swaps in the resolved embeds', () => {
        const text = 'x ![](https://example.com/a.png) y';
        const references = findImageReferences(text);
        const embeds = new Map([[references[0].index, '![[a.png]]']]);
        expect(replaceImageReferences(text, references, embeds)).toBe('x ![[a.png]] y');
    });

    it('leaves references without an embed untouched', () => {
        const text = 'x ![](https://example.com/a.png) y';
        const references = findImageReferences(text);
        expect(replaceImageReferences(text, references, new Map())).toBe(text);
    });

    it('handles several references in one pass', () => {
        const text = '![](https://example.com/a.png) ![](https://example.com/b.png)';
        const references = findImageReferences(text);
        const embeds = new Map([
            [references[0].index, '![[a.png]]'],
            [references[1].index, '![[b.png]]']
        ]);
        expect(replaceImageReferences(text, references, embeds)).toBe('![[a.png]] ![[b.png]]');
    });

    it('leaves an image URL inside frontmatter alone, being data', () => {
        const text = '---\ncover: https://example.com/photo.jpg\n---\nhttps://example.com/body.png';
        const found = findImageReferences(text);
        expect(found).toHaveLength(1);
        expect(found[0].url).toBe('https://example.com/body.png');
    });

    it('leaves the destination of a linked thumbnail alone', () => {
        expect(findImageReferences('[![shot](docs/shot.png)](https://example.com/screenshot.png)')).toHaveLength(0);
        const titled = findImageReferences('[![a](https://a.com/t.png "Thumb")](https://b.com/full.jpg)');
        expect(titled.map(reference => reference.url)).toEqual(['https://a.com/t.png']);
        expect(findImageReferences('[[Download] the installer](https://example.com/icon.png)')).toHaveLength(0);
    });

    it('leaves an image URL inside a wikilink alone', () => {
        expect(findImageReferences('[[https://x.com/a.png]]')).toHaveLength(0);
    });
});
