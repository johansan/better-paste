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
    applyTextSnippets,
    countSnippetRuleLines,
    findInvalidSnippetRuleLines,
    parseSnippetInterchange,
    parseSnippetRuleLine,
    serializeTextSnippets
} from '../src/transforms/snippets';
import { runTextPipeline } from '../src/transforms';
import { DEFAULT_SETTINGS } from '../src/settings/defaults';
import type { TextSnippet } from '../src/settings/types';

function snippet(rules: string[], enabled = true, name = 'Test'): TextSnippet {
    return { id: 'test-id', name, rules, enabled };
}

describe('snippet rule parser', () => {
    it('parses slash-delimited rules and flags', () => {
        const result = parseSnippetRuleLine('s/foo/bar/gim');
        expect(result.status).toBe('valid');
        if (result.status !== 'valid') throw new Error('Rule did not parse');
        expect({ find: result.find, replace: result.replace, flags: result.flags }).toEqual({
            find: 'foo',
            replace: 'bar',
            flags: 'gim'
        });
    });

    it('accepts a non-alphanumeric delimiter', () => {
        const result = parseSnippetRuleLine('s|http://|https://|g');
        expect(result.status).toBe('valid');
        if (result.status !== 'valid') throw new Error('Rule did not parse');
        expect(result.find).toBe('http://');
        expect(result.replace).toBe('https://');
    });

    it('accepts a delimiter represented by a surrogate pair', () => {
        const result = parseSnippetRuleLine('s💡cat💡dog💡g');
        expect(result.status).toBe('valid');
        if (result.status !== 'valid') throw new Error('Rule did not parse');
        expect('cat cat'.replace(result.regexp, result.replace)).toBe('dog dog');
    });

    it('preserves an escaped find delimiter and unescapes a replacement delimiter', () => {
        const line = String.raw`s/foo\/bar/baz\/qux/g`;
        const result = parseSnippetRuleLine(line);
        expect(result.status).toBe('valid');
        if (result.status !== 'valid') throw new Error('Rule did not parse');
        expect(result.find).toBe(String.raw`foo\/bar`);
        expect(result.replace).toBe('baz/qux');
        expect('foo/bar'.replace(result.regexp, result.replace)).toBe('baz/qux');
    });

    it('interprets newline and tab escapes in replacements', () => {
        const newline = parseSnippetRuleLine(String.raw`s/foo/line 1\nline 2/g`);
        const tab = parseSnippetRuleLine(String.raw`s/foo/left\tright/g`);
        expect(newline.status).toBe('valid');
        expect(tab.status).toBe('valid');
        if (newline.status !== 'valid' || tab.status !== 'valid') throw new Error('Rule did not parse');
        expect(newline.replace).toBe('line 1\nline 2');
        expect(tab.replace).toBe('left\tright');
    });

    it('interprets an escaped backslash once and preserves unknown escapes', () => {
        const backslash = parseSnippetRuleLine(String.raw`s/foo/\\n/g`);
        const unknown = parseSnippetRuleLine(String.raw`s/foo/\q/g`);
        expect(backslash.status).toBe('valid');
        expect(unknown.status).toBe('valid');
        if (backslash.status !== 'valid' || unknown.status !== 'valid') throw new Error('Rule did not parse');
        expect(backslash.replace).toBe(String.raw`\n`);
        expect(unknown.replace).toBe(String.raw`\q`);
    });

    it('unescapes a delimiter next to a newline escape', () => {
        const result = parseSnippetRuleLine(String.raw`s|foo|\|\n|g`);
        expect(result.status).toBe('valid');
        if (result.status !== 'valid') throw new Error('Rule did not parse');
        expect(result.replace).toBe('|\n');
    });

    it('ignores blank lines and comments', () => {
        expect(parseSnippetRuleLine('   ').status).toBe('ignored');
        expect(parseSnippetRuleLine('// explanation').status).toBe('ignored');
        expect(parseSnippetRuleLine('  // explanation').status).toBe('ignored');
        expect(findInvalidSnippetRuleLines(['', '// explanation', '  // another'])).toEqual([]);
        expect(countSnippetRuleLines(['', '// explanation', 's/a/b/g', '# Import heading'])).toBe(2);
    });

    it('rejects interchange headings as rules', () => {
        expect(findInvalidSnippetRuleLines(['# Remove citations'])).toEqual([{ lineNumber: 1, line: '# Remove citations' }]);
    });

    it('rejects malformed expressions and flags', () => {
        const lines = ['foo', 'sxfooxbarx', 'séfooébaré', 's foo bar ', 's/foo/bar', 's/[a-/x/', 's/a/b/gg'];
        expect(findInvalidSnippetRuleLines(lines)).toEqual(lines.map((line, index) => ({ lineNumber: index + 1, line })));
    });

    it('rejects an empty find and accepts an empty replacement', () => {
        expect(parseSnippetRuleLine('s//gone/g').status).toBe('invalid');
        const deletion = parseSnippetRuleLine('s/gone//g');
        expect(deletion.status).toBe('valid');
        if (deletion.status !== 'valid') throw new Error('Deletion did not parse');
        expect('gone and gone'.replace(deletion.regexp, deletion.replace)).toBe(' and ');
    });
});

describe('snippet application', () => {
    it('treats the paste as one buffer instead of running once per line', () => {
        expect(applyTextSnippets('one\ntwo', [snippet(['s/^/> /g'])]).text).toBe('> one\ntwo');
        expect(applyTextSnippets('one\ntwo', [snippet(['s/^/> /gm'])]).text).toBe('> one\n> two');
    });

    it('replaces only the first match without the global flag', () => {
        expect(applyTextSnippets('cat cat cat', [snippet(['s/cat/dog/'])]).text).toBe('dog cat cat');
    });

    it('supports numbered, whole-match and named replacement groups', () => {
        const rule = String.raw`s/(?<last>\w+), (?<first>\w+)/$<first> $1 [$&]/`;
        expect(applyTextSnippets('Sanneblad, Johan', [snippet([rule])]).text).toBe('Johan Sanneblad [Sanneblad, Johan]');
    });

    it('applies snippets and their rules in stored order', () => {
        const snippets = [snippet(['s/a/b/g', 's/b/c/g'], true, 'First'), snippet(['s/c/d/g'], true, 'Second')];
        expect(applyTextSnippets('a', snippets).text).toBe('d');
    });

    it('skips comments, disabled snippets, and invalid rule lines', () => {
        const snippets = [snippet(['// explanation', 'not a rule', 's/cat/dog/g']), snippet(['s/dog/fox/g'], false)];
        expect(applyTextSnippets('cat', snippets)).toEqual({ text: 'dog', changed: true });
    });
});

describe('snippet pipeline order', () => {
    it('runs after straightening quotes', () => {
        const settings = {
            ...DEFAULT_SETTINGS,
            textQuotes: true,
            textSnippets: [snippet([String.raw`s/"([^\"]+)"/[$1]/g`])]
        };
        expect(runTextPipeline('She said “fine”.', settings).text).toBe('She said [fine].');
    });

    it('runs before the final trim', () => {
        const settings = {
            ...DEFAULT_SETTINGS,
            textSnippets: [snippet([String.raw`s/^\[1\]$//m`])]
        };
        expect(runTextPipeline('[1]\nBody', settings).text).toBe('Body');
    });
});

describe('snippet interchange format', () => {
    it('round-trips comments, empty snippets, and multiple snippets', () => {
        const source = [
            snippet(['// Keep this explanation', '  // Keep its indentation', 's/foo/bar/g'], true, 'Commented'),
            snippet([], true, 'Empty'),
            snippet(['s/cat/dog/g'], true, 'Last')
        ];

        const parsed = parseSnippetInterchange(serializeTextSnippets(source, 'Imported snippet'), 'Imported snippet');

        expect(parsed.snippets.map(({ name, rules }) => ({ name, rules }))).toEqual(source.map(({ name, rules }) => ({ name, rules })));
        expect(parsed.ruleCount).toBe(2);
        expect(parsed.invalidLines).toEqual([]);
    });

    it('serializes and parses snippets in order', () => {
        const source = [
            snippet([String.raw`s/\[\d+\]//g`, String.raw`s/\[(wikipedia|reddit)\]//gi`], true, 'Remove citations'),
            snippet(['s/foo/bar/g'], false, 'Rename terms')
        ];
        const serialized = serializeTextSnippets(source, 'Imported snippet');
        const parsed = parseSnippetInterchange(serialized, 'Imported snippet');

        expect(serialized).toBe(
            [
                '# Remove citations',
                String.raw`s/\[\d+\]//g`,
                String.raw`s/\[(wikipedia|reddit)\]//gi`,
                '',
                '# Rename terms',
                's/foo/bar/g'
            ].join('\n')
        );
        expect(parsed.snippets.map(({ name, rules, enabled }) => ({ name, rules, enabled }))).toEqual([
            { name: 'Remove citations', rules: source[0].rules, enabled: true },
            { name: 'Rename terms', rules: source[1].rules, enabled: true }
        ]);
        expect(parsed.invalidLines).toEqual([]);
    });

    it('uses the fallback name for rules before the first heading', () => {
        const parsed = parseSnippetInterchange('s/foo/bar/g\n\n# Named\ns/a/b/', 'Imported snippet');
        expect(parsed.snippets.map(value => value.name)).toEqual(['Imported snippet', 'Named']);
    });

    it('reports lines that cannot be imported', () => {
        const parsed = parseSnippetInterchange('# Mixed\ns/foo/bar/g\nnot a rule\ns/[a-/x/', 'Imported snippet');
        expect(parsed.ruleCount).toBe(1);
        expect(parsed.invalidLines).toEqual([
            { lineNumber: 3, line: 'not a rule' },
            { lineNumber: 4, line: 's/[a-/x/' }
        ]);
    });
});
