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
    serializeTextSnippets,
    snippetNameFromRules
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
        expect(parseSnippetRuleLine('# explanation').status).toBe('ignored');
        expect(parseSnippetRuleLine('  # explanation').status).toBe('ignored');
        expect(findInvalidSnippetRuleLines(['', '// explanation', '  // another', '# heading', '  # detail'])).toEqual([]);
        expect(countSnippetRuleLines(['', '// explanation', '# heading', 's/a/b/g', 'not a rule'])).toBe(2);
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
        const snippets = [snippet(['// explanation', '# more detail', 'not a rule', 's/cat/dog/g']), snippet(['s/dog/fox/g'], false)];
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
    it('takes a name from the first hash comment', () => {
        expect(snippetNameFromRules(['// Intro', '  #  Remove citations  ', '# Ignored'])).toBe('Remove citations');
        expect(snippetNameFromRules(['// Intro', 's/a/b/g'])).toBeNull();
    });

    it('keeps the reference block as one snippet with every line intact', () => {
        const input = [
            '# Remove Perplexity citations',
            '',
            '# Remove linked citations like [2](https://source)',
            String.raw`s|\[\d+\]\(https?://[^)]*\)||g`,
            '',
            '# Remove plain citations like [1]',
            String.raw`s/\[\d+\]//g`
        ].join('\n');
        const parsed = parseSnippetInterchange(input, 'Imported snippet');

        expect(parsed.snippets.map(({ name, rules }) => ({ name, rules }))).toEqual([
            { name: 'Remove Perplexity citations', rules: input.split('\n') }
        ]);
        expect(parsed.ruleCount).toBe(2);
        expect(parsed.invalidLines).toEqual([]);
    });

    it('keeps an attached heading and its rule in one snippet', () => {
        const input = ['# Remove source tags like [wikipedia]', String.raw`s/\[(wikipedia|reddit|youtube)\]//gi`].join('\n');
        const parsed = parseSnippetInterchange(input, 'Imported snippet');

        expect(parsed.snippets.map(({ name, rules }) => ({ name, rules }))).toEqual([
            { name: 'Remove source tags like [wikipedia]', rules: input.split('\n') }
        ]);
        expect(parsed.invalidLines).toEqual([]);
    });

    it('splits only at detached headings and keeps attached comments in their segment', () => {
        const parsed = parseSnippetInterchange(
            ['s/start/prefix/', '', '# First', '', '# Explains the next rule', 's/a/b/g', '', '# Second', '', 's/c/d/g'].join('\n'),
            'Imported snippet'
        );

        expect(parsed.snippets.map(({ name, rules }) => ({ name, rules }))).toEqual([
            { name: 'Imported snippet', rules: ['s/start/prefix/', ''] },
            { name: 'First', rules: ['# First', '', '# Explains the next rule', 's/a/b/g', ''] },
            { name: 'Second', rules: ['# Second', '', 's/c/d/g'] }
        ]);
    });

    it('round-trips detached headings verbatim and canonicalizes heading-free rules once', () => {
        const fallbackName = 'Imported snippet';
        const roundTrip = (source: TextSnippet): { exported: string; imported: TextSnippet } => {
            const exported = serializeTextSnippets([source], fallbackName);
            const parsed = parseSnippetInterchange(exported, fallbackName);
            expect(parsed.invalidLines).toEqual([]);
            expect(parsed.snippets).toHaveLength(1);
            const imported = parsed.snippets[0];
            if (!imported) throw new Error('Snippet did not import');
            return { exported, imported };
        };

        const detachedRules = ['# Existing heading', '', '# Detail', 's/a/b/g'];
        const detachedTrip = roundTrip(snippet(detachedRules, true, 'Existing heading'));
        expect(detachedTrip.exported).toBe(detachedRules.join('\n'));
        expect(detachedTrip.imported.rules.join('\n')).toBe(detachedTrip.exported);

        const headingFree = snippet(['s/cat/dog/g'], true, 'Replace cats');
        const firstTrip = roundTrip(headingFree);
        expect({ name: firstTrip.imported.name, rules: firstTrip.imported.rules }).toEqual({
            name: 'Replace cats',
            rules: ['# Replace cats', '', 's/cat/dog/g']
        });
        expect(applyTextSnippets('cat cat', [firstTrip.imported])).toEqual(applyTextSnippets('cat cat', [headingFree]));

        const secondTrip = roundTrip(firstTrip.imported);
        expect(secondTrip.exported).toBe(firstTrip.exported);
        expect(secondTrip.imported.rules.join('\n')).toBe(firstTrip.imported.rules.join('\n'));
    });

    it('exports a renamed detached heading under the current name', () => {
        const fallbackName = 'Imported snippet';
        const storedRules = ['# Old name', '', 's/a/b/g'];
        const imported = parseSnippetInterchange(storedRules.join('\n'), fallbackName).snippets[0];
        if (!imported) throw new Error('Snippet did not import');
        imported.name = 'New name';

        const exported = serializeTextSnippets([imported], fallbackName);

        expect(exported).toBe(['# New name', '', 's/a/b/g'].join('\n'));
        expect(imported.rules).toEqual(storedRules);
        expect(parseSnippetInterchange(exported, fallbackName).snippets[0]?.name).toBe('New name');
    });

    it('keeps one blank separator byte-stable across repeated round trips', () => {
        const fallbackName = 'Imported snippet';
        const expected = ['# First', '', 's/a/b/g', '', '# Second', '', 's/c/d/g'].join('\n');
        let interchange = expected;

        for (let trip = 0; trip < 2; trip++) {
            const parsed = parseSnippetInterchange(interchange, fallbackName);
            expect(parsed.snippets).toHaveLength(2);
            interchange = serializeTextSnippets(parsed.snippets, fallbackName);
            expect(interchange).toBe(expected);
        }
    });

    it('keeps and reports lines that cannot be parsed', () => {
        const parsed = parseSnippetInterchange('# Mixed\ns/foo/bar/g\nnot a rule\ns/[a-/x/', 'Imported snippet');
        expect(parsed.ruleCount).toBe(1);
        expect(parsed.snippets[0]?.rules).toEqual(['# Mixed', 's/foo/bar/g', 'not a rule', 's/[a-/x/']);
        expect(parsed.invalidLines).toEqual([
            { lineNumber: 3, line: 'not a rule' },
            { lineNumber: 4, line: 's/[a-/x/' }
        ]);
    });
});
