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
import { continueQuotePaste } from '../src/transforms/quotePaste';

/** Runs the transform with the cursor at the | marker, which is removed before the call. */
function paste(pasted: string, document: string): string | null {
    const offset = document.indexOf('|');
    return continueQuotePaste(pasted, document.replace('|', ''), offset, offset);
}

describe('continueQuotePaste', () => {
    it('keeps two pasted paragraphs inside a block quote', () => {
        expect(paste('First paragraph\n\nSecond paragraph', '> |')).toBe('First paragraph\n>\n> Second paragraph');
    });

    it('keeps a pasted list inside a quoted paragraph', () => {
        expect(paste('- one\n- two', '> Introduction |')).toBe('- one\n> - two');
    });

    it('declines a single-line paste and a plain destination', () => {
        expect(paste('One line', '> |')).toBeNull();
        expect(paste('One\nTwo', 'Plain |')).toBeNull();
    });

    it('declines when the cursor is before or inside the quote prefix', () => {
        expect(paste('One\nTwo', '|> text')).toBeNull();
        expect(paste('One\nTwo', '> |> text')).toBeNull();
    });

    it('declines when non-whitespace text follows the cursor', () => {
        expect(paste('One\nTwo', '> before | after')).toBeNull();
    });

    it('claims when only whitespace follows the cursor', () => {
        expect(paste('One\nTwo', '> before |   ')).toBe('One\n> Two');
    });

    it('declines a selection that spans lines', () => {
        const document = '> first\n> second';
        const start = document.indexOf('first');

        expect(continueQuotePaste('One\nTwo', document, start, document.length)).toBeNull();
    });

    it('declines quote-like markers indented with four spaces or a tab', () => {
        expect(paste('One\nTwo', '    > text|')).toBeNull();
        expect(paste('One\nTwo', '\t> text|')).toBeNull();
    });

    it('reads a marker followed by four more spaces as one quote level', () => {
        expect(paste('One\nTwo', '>     > text|')).toBe('One\n> Two');
    });

    it('keeps nested and tight destination prefixes verbatim', () => {
        expect(paste('One\nTwo', '> > |')).toBe('One\n> > Two');
        expect(paste('One\nTwo', '>text|')).toBe('One\n>Two');
    });

    it('continues a paste in a callout body', () => {
        expect(paste('First paragraph\n\nSecond paragraph', '> [!note]\n> |')).toBe('First paragraph\n>\n> Second paragraph');
    });

    it('claims a callout header destination and keeps native title glue on line one', () => {
        expect(paste('Title text\nBody text', '> [!note] |')).toBe('Title text\n> Body text');
    });

    it('nests a quoted clipboard one level inside an empty quote line', () => {
        expect(paste('> one\n> two', '> |')).toBe('> one\n> > two');
    });

    it('keeps native glue when quoted text follows existing quoted prose', () => {
        expect(paste('> one\n> two', '> Intro |')).toBe('> one\n> > two');
    });

    it('declines an all-list clipboard on a quoted list item', () => {
        expect(paste('- one\n- two', '> - |')).toBeNull();
    });

    it('does not read a quoted thematic break as a list item', () => {
        expect(paste('- one\n- two', '> - - -|')).toBe('- one\n> - two');
    });

    it('claims prose on a quoted list item', () => {
        expect(paste('One\nTwo', '> - |')).toBe('One\n> Two');
    });

    it('drops whitespace from an interior blank line and trims the prefix', () => {
        expect(paste('One\n   \nTwo', '> > |')).toBe('One\n> >\n> > Two');
    });

    it('prefixes a trailing line break when edge trimming is off', () => {
        expect(paste('One\n', '> |')).toBe('One\n>');
    });

    it('normalizes CRLF line endings', () => {
        expect(paste('One\r\n\r\nTwo', '> |')).toBe('One\n>\n> Two');
    });
});
