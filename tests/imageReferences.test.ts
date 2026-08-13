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
import { extensionOfUrl, findImageReferences, isDataImageUri, replaceImageReferences } from '../src/paste/imageReferences';
import type { ImageReferenceOptions } from '../src/paste/imageReferences';
import { DEFAULT_SETTINGS } from '../src/settings/defaults';

function options(overrides: Partial<ImageReferenceOptions> = {}): ImageReferenceOptions {
    return { ...DEFAULT_SETTINGS, ...overrides };
}

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
        const found = findImageReferences('before ![a cat](https://example.com/cat.png) after', options());
        expect(found).toHaveLength(1);
        expect(found[0]).toMatchObject({ url: 'https://example.com/cat.png', alt: 'a cat', kind: 'markdown' });
    });

    it('finds a Markdown image whose URL has no extension', () => {
        const found = findImageReferences('![](https://example.com/render?id=7)', options());
        expect(found).toHaveLength(1);
        expect(found[0].url).toBe('https://example.com/render?id=7');
    });

    it('finds a Markdown image whose URL contains parentheses', () => {
        const found = findImageReferences('![](https://example.com/photo_(1).png)', options());
        expect(found).toHaveLength(1);
        expect(found[0].url).toBe('https://example.com/photo_(1).png');
        expect(found[0].token).toBe('![](https://example.com/photo_(1).png)');
    });

    it('finds an HTML image tag and its alt text', () => {
        const found = findImageReferences('<img src="https://example.com/a.jpg" alt="hello">', options());
        expect(found).toHaveLength(1);
        expect(found[0]).toMatchObject({ url: 'https://example.com/a.jpg', alt: 'hello', kind: 'html' });
    });

    it('finds a data URI image', () => {
        const found = findImageReferences('![](data:image/png;base64,AAAA)', options());
        expect(found).toHaveLength(1);
        expect(found[0].kind).toBe('markdown');
    });

    it('finds a bare image URL', () => {
        const found = findImageReferences('https://example.com/photo.jpg', options());
        expect(found).toHaveLength(1);
        expect(found[0].kind).toBe('bare');
    });

    it('ignores a bare URL that is not an image', () => {
        expect(findImageReferences('https://example.com/article', options())).toHaveLength(0);
    });

    it('does not double-count the URL inside a Markdown image', () => {
        const found = findImageReferences('![](https://example.com/cat.png)', options());
        expect(found).toHaveLength(1);
        expect(found[0].kind).toBe('markdown');
    });

    it('does not treat a normal Markdown link target as a bare image URL', () => {
        expect(findImageReferences('[photo](https://example.com/cat.png)', options())).toHaveLength(0);
    });

    it('does not treat code examples as image references', () => {
        const text = ['`https://example.com/inline.png`', '```md', '![](https://example.com/fenced.png)', '```'].join('\n');
        expect(findImageReferences(text, options())).toHaveLength(0);
    });

    it('does not treat autolinks or HTML attributes as image references', () => {
        expect(findImageReferences('<https://example.com/cat.png>', options())).toHaveLength(0);
        expect(findImageReferences('<a href="https://example.com/cat.png">cat</a>', options())).toHaveLength(0);
    });

    it('leaves a pasted image link alone when that is the choice', () => {
        const asLink = options({ imageLinkPaste: 'link' });
        expect(findImageReferences('https://example.com/a.png', asLink)).toHaveLength(0);
        // A picture inside copied content is a different question, and still saved
        expect(findImageReferences('![](https://example.com/a.png)', asLink)).toHaveLength(1);
    });

    it('returns references sorted by position', () => {
        const text = '![](https://example.com/b.png) and <img src="https://example.com/a.png">';
        const found = findImageReferences(text, options());
        expect(found.map(reference => reference.index)).toEqual([...found.map(reference => reference.index)].sort((a, b) => a - b));
    });
});

describe('replaceImageReferences', () => {
    it('swaps in the resolved embeds', () => {
        const text = 'x ![](https://example.com/a.png) y';
        const references = findImageReferences(text, options());
        const embeds = new Map([[references[0].index, '![[a.png]]']]);
        expect(replaceImageReferences(text, references, embeds)).toBe('x ![[a.png]] y');
    });

    it('leaves references without an embed untouched', () => {
        const text = 'x ![](https://example.com/a.png) y';
        const references = findImageReferences(text, options());
        expect(replaceImageReferences(text, references, new Map())).toBe(text);
    });

    it('handles several references in one pass', () => {
        const text = '![](https://example.com/a.png) ![](https://example.com/b.png)';
        const references = findImageReferences(text, options());
        const embeds = new Map([
            [references[0].index, '![[a.png]]'],
            [references[1].index, '![[b.png]]']
        ]);
        expect(replaceImageReferences(text, references, embeds)).toBe('![[a.png]] ![[b.png]]');
    });
});
