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

import { cleanTerminalText, endsHyphenated, joinFragments } from './terminalText';
import type { TerminalCleanupResult } from './terminalText';
import { markdownCodeRanges } from './markdownRanges';
import { PDF_MIN_WRAP_WIDTH } from '../settings/constants';

/**
 * The situational choices offered by the PDF cleanup dialog. Each one is a guess only
 * the user can confirm, so none of them runs without being asked for.
 */
export interface PdfCleanupOptions {
    /** Removes page number lines together with the page break around them. */
    removeFurniture: boolean;
    /** Joins the whole selection into one paragraph. */
    singleParagraph: boolean;
}

const DEFAULT_OPTIONS: PdfCleanupOptions = { removeFurniture: false, singleParagraph: false };

/**
 * The Latin ligature glyphs publisher fonts put on the clipboard, ff fi fl ffi ffl and
 * the long s forms. Expanded into letters because a vault search for "financial" never
 * matches the word with a ligature in it. Written as escapes so this file stays ASCII.
 */
const LIGATURES: Record<string, string> = {
    '\uFB00': 'ff',
    '\uFB01': 'fi',
    '\uFB02': 'fl',
    '\uFB03': 'ffi',
    '\uFB04': 'ffl',
    // Unicode folds the long s ligatures to st
    '\uFB05': 'st',
    '\uFB06': 'st'
};

/**
 * A line whose visible content is digits and the separators page numbers actually use,
 * such as "14", "- 3 -" or "3 / 12". The set is a whitelist so that standalone values
 * like "95%", "[12]" or "2 + 2 = 4" stay content.
 */
const PAGE_NUMBER_LINE = /^[\s\-\u2013\u2014.()/|:]*\d[\d\s\-\u2013\u2014.()/|:]*$/;

/** Longest visible content that can plausibly be a page number line. */
const PAGE_NUMBER_MAX_LENGTH = 24;

interface ClassifiedLine {
    text: string;
    /** True when Markdown renders the line as code, so cleanup must pass it through. */
    code: boolean;
}

/**
 * Splits into lines, marking the ones Markdown renders entirely as code. A line that
 * only contains an inline backtick span is prose with code in it, so it stays workable.
 */
function classifyLines(text: string): ClassifiedLine[] {
    const codeRanges = markdownCodeRanges(text);
    const lines: ClassifiedLine[] = [];
    let start = 0;
    // Block math is protected like code: its delimiters repeat and its content can be
    // a bare number, both of which the furniture rules would otherwise remove
    let math = false;
    for (const line of text.split('\n')) {
        const end = start + line.length;
        // A math delimiter is a line holding only $$, the same rule the rejoin and the
        // marker ranges use. A $$ inside prose, such as a shell's process id, is content.
        const delimiter = line.trim() === '$$';
        // The strict lower bound keeps a blank line that merely touches a range's
        // endpoint, such as the one after a closing fence, out of the code block
        const code = math || delimiter || codeRanges.some(range => range.start <= start && range.end > start && range.end >= end);
        if (delimiter) math = !math;
        lines.push({ text: line, code });
        start = end + 1;
    }
    return lines;
}

/**
 * Removes page number lines together with the blank lines around them. When the text
 * before a removed gap ends in a broken word, the gap closes completely so the rejoin
 * can repair the word across the page break. Otherwise one blank line remains and the
 * paragraphs stay separate. Repeated headers and footers are deliberately left alone:
 * telling them apart from repeated content needs the page geometry a paste never has.
 */
function removePageFurniture(text: string): string {
    const lines = classifyLines(text);

    const isFurniture = (index: number): boolean => {
        const line = lines[index];
        if (line.code) return false;
        const key = line.text.trim();
        if (key.length === 0) return false;
        return key.length <= PAGE_NUMBER_MAX_LENGTH && PAGE_NUMBER_LINE.test(key);
    };

    const output: string[] = [];
    let index = 0;
    while (index < lines.length) {
        const line = lines[index];
        if (line.code || (line.text.trim().length > 0 && !isFurniture(index))) {
            output.push(line.text);
            index += 1;
            continue;
        }

        // Blank lines and furniture around a page break form one gap
        let end = index;
        let hadFurniture = false;
        while (end < lines.length && !lines[end].code && (lines[end].text.trim().length === 0 || isFurniture(end))) {
            if (isFurniture(end)) hadFurniture = true;
            end += 1;
        }

        if (!hadFurniture) {
            for (let at = index; at < end; at += 1) output.push(lines[at].text);
        } else {
            const previous = output.length > 0 ? output[output.length - 1] : undefined;
            const next = end < lines.length ? lines[end] : undefined;
            // A gap at either edge of the selection disappears with its furniture. In
            // the middle it closes completely when the text reads as one sentence
            // crossing the page: the line before ends in a broken word or without
            // sentence punctuation, and the line after resumes in lowercase or with a
            // plain number. Otherwise one blank line keeps the paragraphs separate.
            if (previous !== undefined && next !== undefined) {
                const crossesPage =
                    endsHyphenated(previous) ||
                    (!/[.!?:;"'\u2019\u201D\u2026)]$/.test(previous.trimEnd()) &&
                        !next.code &&
                        /^[\p{Ll}\d]/u.test(next.text.trimStart()) &&
                        !/^\s*\d{1,9}[.)]\s/.test(next.text));
                if (!crossesPage) output.push('');
            }
        }
        index = end;
    }

    return output.join('\n');
}

/** Joins every prose line into one paragraph. Lines Markdown renders as code keep theirs. */
function joinIntoOneParagraph(text: string): string {
    const parts: string[] = [];
    const prose: string[] = [];
    const code: string[] = [];
    // The pieces join under the same rules as the rejoin, so CJK text stays unspaced
    // and a web address keeps its protective break. No collapse happens here: the join
    // adds no double spaces and the earlier collapse already handled the rest.
    const flushProse = (): void => {
        if (prose.length === 0) return;
        parts.push(prose.reduce((joined, piece) => joinFragments(joined, piece)));
        prose.length = 0;
    };
    const flushCode = (): void => {
        if (code.length === 0) return;
        parts.push(code.join('\n'));
        code.length = 0;
    };

    for (const line of classifyLines(text)) {
        if (line.code) {
            flushProse();
            code.push(line.text);
            continue;
        }
        flushCode();
        const trimmed = line.text.trim();
        if (trimmed.length > 0) prose.push(trimmed);
    }
    flushProse();
    flushCode();

    // The blank line keeps an indented code block out of the joined paragraph, because
    // Markdown reads an indented line straight after prose as more prose
    return parts.join('\n\n');
}

/**
 * Cleans text copied out of a PDF: expands ligatures, repairs words hyphenated at line
 * ends, rejoins the lines the layout wrapped and collapses justified-text spacing. The
 * options add the cleanups that depend on what was copied.
 */
export function cleanPdfText(input: string, options: PdfCleanupOptions = DEFAULT_OPTIONS): TerminalCleanupResult {
    // Some extractors put accents on the clipboard as combining marks. Composing them
    // makes the hyphen repair see the letter and makes the words match a vault search.
    let text = input.normalize('NFC').replace(/\r\n?/g, '\n');

    text = text.replace(/[\uFB00-\uFB06]/g, glyph => LIGATURES[glyph]);

    // A soft hyphen inside a word is dropped, the same way the invisible-character rule
    // treats it on paste. One at a line end stays: the rejoin reads it as wrap evidence
    // and removes it whatever follows, unlike a visible hyphen.
    text = text.replace(/\u00AD(?![ \t]*\n)/g, '');

    if (options.removeFurniture) text = removePageFurniture(text);

    const result = cleanTerminalText(text, {
        terminalRejoin: 'any',
        terminalBullets: 'markdown',
        mergeHyphens: true,
        collapseSpaces: true,
        minWrapWidth: PDF_MIN_WRAP_WIDTH,
        protectMath: true
    });

    // A soft hyphen that survived sat at a break the rejoin kept, for example before a
    // list item, so it goes here instead
    let cleaned = result.text.replace(/\u00AD/g, '');

    if (options.singleParagraph) cleaned = joinIntoOneParagraph(cleaned);

    return { text: cleaned, changed: cleaned !== input };
}
