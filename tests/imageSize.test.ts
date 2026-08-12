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
import { extractFrontmatterBlock, normalizeImageSize, resolveImageSize } from '../src/paste/imageSize';

describe('extractFrontmatterBlock', () => {
    it('reads the block at the top of a note', () => {
        expect(extractFrontmatterBlock('---\nimage-width: 400\n---\n\nBody text')).toBe('image-width: 400');
    });

    it('reads a block with several properties', () => {
        expect(extractFrontmatterBlock('---\ntitle: Notes\nimage-width: 400\n---\n')).toBe('title: Notes\nimage-width: 400');
    });

    it('accepts the "..." terminator', () => {
        expect(extractFrontmatterBlock('---\nimage-width: 400\n...\nBody')).toBe('image-width: 400');
    });

    it('handles an empty block', () => {
        expect(extractFrontmatterBlock('---\n---\nBody')).toBe('');
    });

    it('handles Windows line endings', () => {
        expect(extractFrontmatterBlock('---\r\nimage-width: 400\r\n---\r\nBody')).toBe('image-width: 400\r');
    });

    it('returns null when there is no frontmatter', () => {
        expect(extractFrontmatterBlock('Just a note.')).toBeNull();
    });

    it('ignores a rule that is not on the first line', () => {
        expect(extractFrontmatterBlock('Some text\n---\nimage-width: 400\n---')).toBeNull();
    });

    it('returns null while the block is still unterminated', () => {
        expect(extractFrontmatterBlock('---\nimage-width: 400\n')).toBeNull();
    });
});

describe('normalizeImageSize', () => {
    it('accepts a plain number', () => {
        expect(normalizeImageSize(400)).toBe('400');
        expect(normalizeImageSize('400')).toBe('400');
    });

    it('accepts a width and height', () => {
        expect(normalizeImageSize('400x300')).toBe('400x300');
        expect(normalizeImageSize('400 x 300')).toBe('400x300');
        expect(normalizeImageSize('400×300')).toBe('400x300');
    });

    it('rounds a fractional number', () => {
        expect(normalizeImageSize(399.6)).toBe('400');
    });

    it('rejects values that are not sizes', () => {
        expect(normalizeImageSize('wide')).toBeNull();
        expect(normalizeImageSize('50%')).toBeNull();
        expect(normalizeImageSize('-40')).toBeNull();
        expect(normalizeImageSize(0)).toBeNull();
        expect(normalizeImageSize(true)).toBeNull();
        expect(normalizeImageSize(null)).toBeNull();
        expect(normalizeImageSize(undefined)).toBeNull();
        expect(normalizeImageSize('')).toBeNull();
    });
});

describe('resolveImageSize', () => {
    it('reads the configured property', () => {
        expect(resolveImageSize({ 'image-width': 400 }, 'image-width')).toBe('400');
    });

    it('matches the property name regardless of case', () => {
        expect(resolveImageSize({ 'Image-Width': 400 }, 'image-width')).toBe('400');
    });

    it('ignores other properties', () => {
        expect(resolveImageSize({ title: 'Notes', width: 999 }, 'image-width')).toBeNull();
    });

    it('returns null for an unusable value', () => {
        expect(resolveImageSize({ 'image-width': 'huge' }, 'image-width')).toBeNull();
    });

    it('returns null when the feature is switched off', () => {
        expect(resolveImageSize({ 'image-width': 400 }, '')).toBeNull();
        expect(resolveImageSize({ 'image-width': 400 }, '   ')).toBeNull();
    });

    it('returns null for missing frontmatter', () => {
        expect(resolveImageSize(null, 'image-width')).toBeNull();
        expect(resolveImageSize(undefined, 'image-width')).toBeNull();
        expect(resolveImageSize('not an object', 'image-width')).toBeNull();
    });
});
