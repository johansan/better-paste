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
import { cleanTerminalText, dedent, inferWrapWidth } from '../src/transforms/terminalText';
import type { TerminalCleanupOptions } from '../src/transforms/terminalText';
import { DEFAULT_SETTINGS } from '../src/settings/defaults';

function options(overrides: Partial<TerminalCleanupOptions> = {}): TerminalCleanupOptions {
    return { ...DEFAULT_SETTINGS, ...overrides };
}

// Written as escapes so this file stays plain ASCII
const ESC = '\u001B';
const BEL = '\u0007';

describe('dedent', () => {
    it('removes the shared indentation while preserving relative nesting', () => {
        expect(dedent(['    a', '      b', '    c'])).toEqual(['a', '  b', 'c']);
    });

    it('ignores blank lines when computing the shared prefix', () => {
        expect(dedent(['  a', '', '  b'])).toEqual(['a', '', 'b']);
    });

    it('leaves lines alone when there is no shared prefix', () => {
        expect(dedent(['a', '  b'])).toEqual(['a', '  b']);
    });
});

describe('inferWrapWidth', () => {
    it('ignores lines inside a code fence', () => {
        // A JSON log dump must not drag the threshold above the prose around it
        const prose = 'The deployment finished but three of the health checks did not come back in';
        const withFence = [prose, '  time, so the rollout has been paused pending a manual review.', '```', 'x'.repeat(120), '```'];

        expect(inferWrapWidth(withFence)).toBe(inferWrapWidth(withFence.slice(0, 2)));
    });

    it('rejoins prose that sits next to a long code block', () => {
        const input = [
            'The deployment finished but three of the health checks did not come back in',
            '  time, so the rollout has been paused pending a manual review by an operator.',
            '',
            '```',
            '{"level":"info","ts":"2026-08-12T19:44:02Z","msg":"health check timed out","attempt":3,"service":"api"}',
            '```'
        ].join('\n');

        expect(cleanTerminalText(input, options()).text).toContain('did not come back in time, so the rollout has been paused');
    });

    it('falls back to the floor when a single long line is an outlier', () => {
        expect(inferWrapWidth(['short', 'x'.repeat(200), 'also short'])).toBe(60);
    });

    it('survives a log with more lines than a function call can take arguments', () => {
        // Math.max(...lengths) would throw RangeError here
        const many = Array.from({ length: 200_000 }, (_unused, index) => `line ${index}`);
        expect(() => inferWrapWidth(many)).not.toThrow();
    });
});

describe('cleanTerminalText', () => {
    it('unwraps the reference terminal output', () => {
        const input = [
            ' I will remove the extra debate confirmation, then trace the menu main keyboard flows for other small, low-risk friction points. I will',
            '  keep destructive actions explicit and verify the interaction behavior with the existing tests or a focused harness.',
            '',
            '• The extra step is isolated to the list Enter handler, so the core change is straightforward. While tracing adjacent flows, I found',
            '  two likely friction points worth validating: selection can jump after the 20-second refresh, and pasted Discord items require the',
            '  uncommon Ctrl-D shortcut to save. I am checking the reference UI and current data behavior before changing either.',
            '',
            '• I am making three contained usability changes: Enter will launch a new debate immediately, busy screens will paint before any CLI work',
            '  begins, and auto-refresh will preserve the selected issue by ID instead of merely preserving its row number. I am leaving',
            '  confirmations in place only for removing local items, since that action changes stored data.'
        ].join('\n');

        const result = cleanTerminalText(input, options());

        expect(result.text).toBe(
            [
                'I will remove the extra debate confirmation, then trace the menu main keyboard flows for other small, low-risk friction points. I will keep destructive actions explicit and verify the interaction behavior with the existing tests or a focused harness.',
                '',
                '- The extra step is isolated to the list Enter handler, so the core change is straightforward. While tracing adjacent flows, I found two likely friction points worth validating: selection can jump after the 20-second refresh, and pasted Discord items require the uncommon Ctrl-D shortcut to save. I am checking the reference UI and current data behavior before changing either.',
                '',
                '- I am making three contained usability changes: Enter will launch a new debate immediately, busy screens will paint before any CLI work begins, and auto-refresh will preserve the selected issue by ID instead of merely preserving its row number. I am leaving confirmations in place only for removing local items, since that action changes stored data.'
            ].join('\n')
        );
        expect(result.changed).toBe(true);
    });

    it('leaves text alone entirely when nothing says it came from a terminal', () => {
        // No escape sequences and no rejoin, so the indentation is somebody's content
        const input = ['Roses are red', '  Violets are blue'].join('\n');
        expect(cleanTerminalText(input, options()).text).toBe(input);
    });

    it('does not flatten a Markdown hard line break', () => {
        // Two trailing spaces are a line break in Markdown, not terminal padding
        const input = 'first line  \nsecond line';
        expect(cleanTerminalText(input, options()).text).toBe(input);
    });

    it('does not rejoin a long Markdown hard break', () => {
        const spaces = 'A deliberate break on a line that is comfortably longer than the terminal wrap threshold  \n  next line';
        const backslash = 'A deliberate break on a line that is comfortably longer than the terminal wrap threshold\\\n  next line';

        expect(cleanTerminalText(spaces, options()).text).toBe(spaces);
        expect(cleanTerminalText(backslash, options()).text).toBe(backslash);
    });

    it('does not dedent pasted code', () => {
        const input = ['    def hello():', '        return 1'].join('\n');
        expect(cleanTerminalText(input, options()).text).toBe(input);
    });

    it('does not merge a nested list item into its parent', () => {
        const input = [
            '- A parent item that is comfortably longer than the sixty character wrap threshold',
            '  - A nested child item'
        ].join('\n');
        expect(cleanTerminalText(input, options()).text).toBe(input);
    });

    it('does not merge a heading into the paragraph above it', () => {
        const input = ['Some prose that is comfortably longer than the sixty character wrap threshold', '# A heading'].join('\n');
        expect(cleanTerminalText(input, options()).text).toBe(input);
    });

    it('leaves fenced code blocks untouched', () => {
        const input = [
            'Intro prose that is comfortably longer than the sixty character wrap threshold here',
            '',
            '```js',
            'const a = 1;',
            '  const b = 2;',
            '```'
        ].join('\n');
        expect(cleanTerminalText(input, options()).text).toBe(input);
    });

    it('does not close a fence with another marker or a shorter delimiter', () => {
        const input = ['````js', '~~~', '```', '  const value = 1;', '````'].join('\n');
        expect(cleanTerminalText(input, options({ terminalRejoin: 'never' })).text).toBe(input);
    });

    it('requires an indent for continuation lines by default', () => {
        const input = [
            'A line that is comfortably longer than the sixty character wrap threshold',
            'Not indented so not a continuation'
        ].join('\n');
        expect(cleanTerminalText(input, options()).text).toBe(input);
        expect(cleanTerminalText(input, options({ terminalRejoin: 'any' })).text).toBe(
            'A line that is comfortably longer than the sixty character wrap threshold Not indented so not a continuation'
        );
    });

    it('never rejoins in the never mode, but still strips and dedents', () => {
        const input = [
            '    \u001B[31mA line that is comfortably longer than any plausible wrap column for this test',
            '      continued here.\u001B[0m'
        ].join('\n');

        expect(cleanTerminalText(input, options({ terminalRejoin: 'never' })).text).toBe(
            ['A line that is comfortably longer than any plausible wrap column for this test', '  continued here.'].join('\n')
        );
    });

    it('strips ANSI colour sequences', () => {
        const input = `${ESC}[31mred text${ESC}[0m`;
        expect(cleanTerminalText(input, options()).text).toBe('red text');
    });

    it('strips OSC hyperlink sequences', () => {
        const input = `${ESC}]8;;https://example.com${BEL}link${ESC}]8;;${BEL}`;
        expect(cleanTerminalText(input, options()).text).toBe('link');
    });

    it('collapses runs of blank lines once the text is recognised as terminal output', () => {
        // The escape sequence is what identifies it; without one the spacing is left alone
        expect(cleanTerminalText('\u001B[0ma\n\n\n\nb', options()).text).toBe('a\n\nb');
        expect(cleanTerminalText('a\n\n\n\nb', options()).text).toBe('a\n\n\n\nb');
    });

    it('converts bullets to Markdown list syntax by default', () => {
        const input = '• First item\n• Second item';
        expect(cleanTerminalText(input, options()).text).toBe('- First item\n- Second item');
    });

    it('preserves bullet characters when asked', () => {
        const input = '• First item\n• Second item';
        expect(cleanTerminalText(input, options({ terminalBullets: 'preserve' })).text).toBe(input);
    });

    it('leaves bullets inside fenced code untouched', () => {
        const input = ['```text', '• literal output', '```', '• List item'].join('\n');
        expect(cleanTerminalText(input, options({ terminalBullets: 'markdown' })).text).toBe(
            ['```text', '• literal output', '```', '- List item'].join('\n')
        );
    });

    it('reports no change for text that is already clean', () => {
        const input = 'A single tidy line.';
        const result = cleanTerminalText(input, options());
        expect(result.changed).toBe(false);
        expect(result.text).toBe(input);
    });

    it('does not treat an em dash in prose as a list marker', () => {
        const input = 'A sentence that is long enough to pass the sixty character wrap threshold\n  -1 degree colder';
        expect(cleanTerminalText(input, options()).text).toBe(
            'A sentence that is long enough to pass the sixty character wrap threshold -1 degree colder'
        );
    });

    it('preserves indented code blocks', () => {
        const input = ['Prose that is comfortably longer than the sixty character wrap threshold ok', '    code_line(1)'].join('\n');
        expect(cleanTerminalText(input, options()).text).toBe(input);
    });
});
