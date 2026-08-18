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

import type { TextSnippet } from '../settings/types';

export interface ParsedSnippetRule {
    status: 'valid';
    find: string;
    replace: string;
    flags: string;
    regexp: RegExp;
}

export interface IgnoredSnippetRule {
    status: 'ignored';
}

export interface InvalidSnippetRule {
    status: 'invalid';
}

export type SnippetRuleParseResult = ParsedSnippetRule | IgnoredSnippetRule | InvalidSnippetRule;

export interface InvalidSnippetRuleLine {
    lineNumber: number;
    line: string;
}

export interface SnippetInterchangeResult {
    snippets: TextSnippet[];
    ruleCount: number;
    invalidLines: InvalidSnippetRuleLine[];
}

/** Creates the stable key used by a snippet's settings control. */
export function createTextSnippetId(): string {
    return Math.floor(Math.random() * 0x1_0000_0000)
        .toString(36)
        .padStart(7, '0');
}

/** Finds the next delimiter that is not preceded by an odd backslash run. */
function findDelimiter(line: string, start: number, delimiter: string): number {
    let backslashes = 0;

    for (let index = start; index < line.length; index++) {
        const character = line[index];
        if (character === '\\') {
            backslashes += 1;
            continue;
        }
        if (line.startsWith(delimiter, index) && backslashes % 2 === 0) return index;
        backslashes = 0;
    }
    return -1;
}

/** Interprets the supported escapes in a replacement without reprocessing backslash runs. */
function unescapeReplacement(value: string, delimiter: string): string {
    let result = '';

    for (let index = 0; index < value.length;) {
        if (value[index] !== '\\') {
            result += value[index];
            index += 1;
            continue;
        }

        if (value[index + 1] === '\\') {
            result += '\\';
            index += 2;
            continue;
        }
        if (value.startsWith(delimiter, index + 1)) {
            result += delimiter;
            index += 1 + delimiter.length;
            continue;
        }
        if (value[index + 1] === 'n') {
            result += '\n';
            index += 2;
            continue;
        }
        if (value[index + 1] === 't') {
            result += '\t';
            index += 2;
            continue;
        }

        result += '\\';
        index += 1;
    }
    return result;
}

/** Parses one sed-style replacement, distinguishing ignored lines from invalid ones. */
export function parseSnippetRuleLine(line: string): SnippetRuleParseResult {
    const trimmed = line.trim();
    const start = line.trimStart();
    if (!trimmed || start.startsWith('//') || start.startsWith('#')) return { status: 'ignored' };
    if (line[0] !== 's' || line.length < 2) return { status: 'invalid' };

    const delimiterCodePoint = line.codePointAt(1);
    if (delimiterCodePoint === undefined) return { status: 'invalid' };
    const delimiter = String.fromCodePoint(delimiterCodePoint);
    if (/[\p{L}\p{N}\s\\]/u.test(delimiter)) return { status: 'invalid' };

    const findEnd = findDelimiter(line, 1 + delimiter.length, delimiter);
    if (findEnd < 0) return { status: 'invalid' };
    const replaceEnd = findDelimiter(line, findEnd + delimiter.length, delimiter);
    if (replaceEnd < 0) return { status: 'invalid' };

    const find = line.slice(1 + delimiter.length, findEnd);
    if (!find) return { status: 'invalid' };
    const replace = unescapeReplacement(line.slice(findEnd + delimiter.length, replaceEnd), delimiter);
    const flags = line.slice(replaceEnd + delimiter.length);

    try {
        return { status: 'valid', find, replace, flags, regexp: new RegExp(find, flags) };
    } catch {
        return { status: 'invalid' };
    }
}

/** Reports invalid rules with their one-based positions inside the snippet. */
export function findInvalidSnippetRuleLines(rules: readonly string[]): InvalidSnippetRuleLine[] {
    const invalid: InvalidSnippetRuleLine[] = [];

    rules.forEach((line, index) => {
        if (parseSnippetRuleLine(line).status === 'invalid') invalid.push({ lineNumber: index + 1, line });
    });
    return invalid;
}

/** Counts non-blank, non-comment rule lines, including lines that need repair. */
export function countSnippetRuleLines(rules: readonly string[]): number {
    return rules.filter(line => parseSnippetRuleLine(line).status !== 'ignored').length;
}

/** Applies enabled snippets to the whole buffer, in snippet and rule order. */
export function applyTextSnippets(input: string, snippets: readonly TextSnippet[]): { text: string; changed: boolean } {
    let text = input;

    for (const snippet of snippets) {
        if (!snippet.enabled) continue;
        for (const line of snippet.rules) {
            const rule = parseSnippetRuleLine(line);
            if (rule.status !== 'valid') continue;
            text = text.replace(rule.regexp, rule.replace);
        }
    }
    return { text, changed: text !== input };
}

/** Returns the text from the first hash comment, without its marker. */
export function snippetNameFromRules(rules: readonly string[]): string | null {
    const comment = rules.find(line => line.trimStart().startsWith('#'));
    return comment === undefined ? null : comment.trimStart().slice(1).trim();
}

function isBlankLine(line: string): boolean {
    return line.trim().length === 0;
}

function isHashComment(line: string): boolean {
    return line.trimStart().startsWith('#');
}

/** A detached heading ends a block or is followed by another hash comment. */
function isDetachedHeading(lines: readonly string[], index: number): boolean {
    if (!isHashComment(lines[index] ?? '')) return false;
    const next = lines[index + 1];
    return next === undefined || isBlankLine(next) || isHashComment(next);
}

/** Parses snippet content, splitting only when a detached heading starts a new segment. */
export function parseSnippetInterchange(input: string, fallbackName: string): SnippetInterchangeResult {
    if (!input.trim()) return { snippets: [], ruleCount: 0, invalidLines: [] };

    const lines = input.split(/\r?\n/u);
    const snippets: TextSnippet[] = [];
    const invalidLines: InvalidSnippetRuleLine[] = [];
    let ruleCount = 0;
    let rules: string[] = [];

    const flush = (): void => {
        if (!rules.some(line => !isBlankLine(line))) return;
        snippets.push({
            id: createTextSnippetId(),
            name: snippetNameFromRules(rules) || fallbackName,
            rules,
            enabled: true
        });
        rules = [];
    };

    lines.forEach((line, index) => {
        if (isDetachedHeading(lines, index) && rules.some(candidate => !isBlankLine(candidate))) flush();
        rules.push(line);

        const parsed = parseSnippetRuleLine(line);
        if (parsed.status === 'valid') ruleCount += 1;
        else if (parsed.status === 'invalid') invalidLines.push({ lineNumber: index + 1, line });
    });
    flush();

    return { snippets, ruleCount, invalidLines };
}

/** Writes snippet content with current names and one blank line between snippets. */
export function serializeTextSnippets(snippets: readonly TextSnippet[], fallbackName: string): string {
    return snippets
        .map(snippet => {
            const name = snippet.name.trim() || fallbackName;
            const firstContent = snippet.rules.findIndex(line => !isBlankLine(line));
            const lines = [...snippet.rules];

            if (firstContent >= 0 && isDetachedHeading(lines, firstContent)) {
                const headingName = (lines[firstContent] ?? '').trimStart().slice(1).trim();
                if (headingName !== name) lines[firstContent] = `# ${name}`;
            } else {
                lines.unshift(`# ${name}`, '');
            }

            while (lines.length > 0 && isBlankLine(lines[lines.length - 1] ?? '')) lines.pop();
            return lines.join('\n');
        })
        .join('\n\n');
}
