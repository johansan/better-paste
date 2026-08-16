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
import { applyCommaPlacement } from '../src/transforms/textProcessing';

describe('applyCommaPlacement', () => {
    it('moves a comma outside a closing straight quote', () => {
        expect(applyCommaPlacement('He called it "finished," then left.', 'outside').text).toBe('He called it "finished", then left.');
    });

    it('moves a comma outside a closing curly quote', () => {
        expect(applyCommaPlacement('He called it \u201Cfinished,\u201D then left.', 'outside').text).toBe(
            'He called it \u201Cfinished\u201D, then left.'
        );
    });

    it('leaves a quoted separator character alone in both placements', () => {
        expect(applyCommaPlacement('use "," as the separator', 'inside').text).toBe('use "," as the separator');
        expect(applyCommaPlacement('use "," as the separator', 'outside').text).toBe('use "," as the separator');
        expect(applyCommaPlacement('use \u201C,\u201D as the separator', 'inside').text).toBe('use \u201C,\u201D as the separator');
    });

    it('keeps a grammatical comma after a quoted separator', () => {
        const input = 'Use ",", not ";", as the separator.';
        expect(applyCommaPlacement(input, 'inside').text).toBe(input);
    });

    it('leaves a space-padded quoted separator alone', () => {
        const single = 'Use ", " to separate the items.';
        expect(applyCommaPlacement(single, 'inside').text).toBe(single);
        const double = 'Use ", ", not "; ", as the separator.';
        expect(applyCommaPlacement(double, 'inside').text).toBe(double);
        const outside = 'Use " ," as the marker.';
        expect(applyCommaPlacement(outside, 'outside').text).toBe(outside);
    });

    it('moves a comma after a quoted word ending in a combining mark', () => {
        expect(applyCommaPlacement('She called it "\u0939\u093F\u0902\u0926\u0940", then left.', 'inside').text).toBe(
            'She called it "\u0939\u093F\u0902\u0926\u0940," then left.'
        );
    });

    it('leaves quoted CSV fields alone in inside mode', () => {
        const row = '"Anna","Berg","1975"';
        expect(applyCommaPlacement(row, 'inside').text).toBe(row);
        const mixed = 'name,"John Smith","Boston",age';
        expect(applyCommaPlacement(mixed, 'inside').text).toBe(mixed);
    });

    it('leaves CSV rows with empty fields alone in both placements', () => {
        const inside = '"Anna",,"Berg"';
        expect(applyCommaPlacement(inside, 'inside').text).toBe(inside);
        const outside = '"Smith,","Anna"';
        expect(applyCommaPlacement(outside, 'outside').text).toBe(outside);
        const trailing = '"Anna","Berg",';
        expect(applyCommaPlacement(trailing, 'inside').text).toBe(trailing);
    });

    it('leaves quoted TSV fields alone', () => {
        const row = '"Anna,"\t"Berg"';
        expect(applyCommaPlacement(row, 'outside').text).toBe(row);
    });

    it('leaves pretty-printed JSON alone in inside mode', () => {
        const json = '{\n  "name": "Anna",\n  "city": "Berg",\n  "age": 30\n}';
        expect(applyCommaPlacement(json, 'inside').text).toBe(json);
    });

    it('leaves adjacent quoted items alone, being data as often as an enumeration', () => {
        // {"name":"Anna", "city":"Berg"} and a quoted enumeration share this shape,
        // so the comma stays put rather than corrupting single-line JSON
        const enumeration = 'He listed "alpha", "beta" and "gamma" today.';
        expect(applyCommaPlacement(enumeration, 'inside').text).toBe(enumeration);
        const json = '{"name":"Anna", "city":"Berg"}';
        expect(applyCommaPlacement(json, 'inside').text).toBe(json);
    });

    it('leaves a field that starts with a space alone in outside mode', () => {
        const csv = 'name," John Smith",age';
        expect(applyCommaPlacement(csv, 'outside').text).toBe(csv);
    });

    it('does not move a comma across an opening quote when the space is missing', () => {
        const quote = 'She said,"I will be late."';
        expect(applyCommaPlacement(quote, 'outside').text).toBe(quote);
        const csv = 'name,"John Smith",age';
        expect(applyCommaPlacement(csv, 'outside').text).toBe(csv);
    });

    it('leaves an inch mark after a number alone', () => {
        const sizes = 'The 27", 24" and 21" models are on sale.';
        expect(applyCommaPlacement(sizes, 'inside').text).toBe(sizes);
        const attribute = 'Set width="10", height="20" in the tag.';
        expect(applyCommaPlacement(attribute, 'inside').text).toBe(attribute);
    });

    it('leaves empty quotes alone', () => {
        const input = 'Set the value to "", then save.';
        expect(applyCommaPlacement(input, 'inside').text).toBe(input);
    });

    it('moves a comma inside a closing quote', () => {
        expect(applyCommaPlacement('He called it "finished", then left.', 'inside').text).toBe('He called it "finished," then left.');
    });

    it('leaves commas in Markdown code alone', () => {
        const input = ['`"value,"`', '```text', '"value,"', '```'].join('\n');
        expect(applyCommaPlacement(input, 'outside').text).toBe(input);
    });

    it('leaves frontmatter values alone, being data rather than prose', () => {
        expect(applyCommaPlacement('---\ntags: ["a", "b"]\n---\n"x", done', 'inside').text).toBe('---\ntags: ["a", "b"]\n---\n"x," done');
    });

    it('leaves a wikilink target alone', () => {
        expect(applyCommaPlacement('[[He said "no", twice]]', 'inside').text).toBe('[[He said "no", twice]]');
    });
});
