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
import { cleanPdfText } from '../src/transforms/pdfText';

// Written as escapes so this file stays plain ASCII
const SOFT_HYPHEN = '\u00AD';
const BULLET = '\u2022';
const HYPHEN = '\u2010';
const EM_DASH = '\u2014';

describe('cleanPdfText', () => {
    it('rejoins a hyphenated paragraph and drops the layout hyphens', () => {
        const input = [
            'The findings suggest that long-term expo-',
            'sure has a measurable effect on the out-',
            'come in both groups.'
        ].join('\n');

        expect(cleanPdfText(input).text).toBe(
            'The findings suggest that long-term exposure has a measurable effect on the outcome in both groups.'
        );
    });

    it('keeps the hyphen when the word resumes with a capital', () => {
        const input = ['the solver uses the well known Navier-', 'Stokes equations for the flow field.'].join('\n');

        expect(cleanPdfText(input).text).toBe('the solver uses the well known Navier-Stokes equations for the flow field.');
    });

    it('repairs a word broken by a soft hyphen at the line end', () => {
        const input = [`exposure to the compound over time was mea${SOFT_HYPHEN}`, 'sured in both cohorts across the trial.'].join('\n');

        expect(cleanPdfText(input).text).toBe('exposure to the compound over time was measured in both cohorts across the trial.');
    });

    it('drops a soft hyphen inside a word', () => {
        const result = cleanPdfText(`eco${SOFT_HYPHEN}nomic`);

        expect(result.text).toBe('economic');
        expect(result.changed).toBe(true);
    });

    it('removes a soft hyphen even when the word resumes with a capital', () => {
        const input = [`THE REPORT OF THE INTER${SOFT_HYPHEN}`, 'NATIONAL COMMITTEE WAS ADOPTED.'].join('\n');

        expect(cleanPdfText(input).text).toBe('THE REPORT OF THE INTERNATIONAL COMMITTEE WAS ADOPTED.');
    });

    it('drops a dangling soft hyphen when the join is blocked', () => {
        const input = [`the summary of totals below re${SOFT_HYPHEN}`, '- item one'].join('\n');

        expect(cleanPdfText(input).text).toBe('the summary of totals below re\n- item one');
    });

    it('treats the Unicode hyphen like the ASCII hyphen', () => {
        const input = [`the committee reached its considera${HYPHEN}`, 'tion of the remaining items.'].join('\n');

        expect(cleanPdfText(input).text).toBe('the committee reached its consideration of the remaining items.');
    });

    it('keeps the hyphen of an acronym compound broken at the line end', () => {
        const input = ['the study used the new RNA-', 'Seq analysis for both cohorts here.'].join('\n');

        expect(cleanPdfText(input).text).toBe('the study used the new RNA-Seq analysis for both cohorts here.');
    });

    it('joins wrapped Han and kana lines without a space', () => {
        const input = `${'\u767A'.repeat(40)}\n${'\u898B'.repeat(10)}`;

        expect(cleanPdfText(input).text).toBe('\u767A'.repeat(40) + '\u898B'.repeat(10));
    });

    it('joins without a space after CJK punctuation', () => {
        const input = `${'\u767A'.repeat(39)}\u3002\n${'\u898B'.repeat(10)}`;

        expect(cleanPdfText(input).text).toBe('\u767A'.repeat(39) + '\u3002' + '\u898B'.repeat(10));
    });

    it('joins wrapped Thai lines without a space', () => {
        const input = `${'\u0E01'.repeat(40)}\n${'\u0E02'.repeat(10)}`;

        expect(cleanPdfText(input).text).toBe('\u0E01'.repeat(40) + '\u0E02'.repeat(10));
    });

    it('repairs a hyphenated word with a decomposed accent', () => {
        const input = ['they met at the campus cafe\u0301-', 'teria for lunch and coffee today.'].join('\n');

        expect(cleanPdfText(input).text).toBe('they met at the campus caf\u00E9teria for lunch and coffee today.');
    });

    it('keeps the line break inside a wrapped web address', () => {
        const input = ['the report is available at https://example.com/research/', 'methods.pdf for download.'].join('\n');

        expect(cleanPdfText(input).changed).toBe(false);
    });

    it('keeps the line break inside a wrapped address without a scheme', () => {
        const input = ['the full report is available at www.example.com/research/', 'methods.pdf for download.'].join('\n');

        expect(cleanPdfText(input).changed).toBe(false);
    });

    it('keeps the hyphen of a numeric range broken at the line end', () => {
        const input = ['the measured interval was 10-', '20 units in total.'].join('\n');

        expect(cleanPdfText(input).text).toBe('the measured interval was 10-20 units in total.');
    });

    it('collapses doubled spaces on a single line', () => {
        const result = cleanPdfText('The results were  consistent across sites.');

        expect(result.text).toBe('The results were consistent across sites.');
        expect(result.changed).toBe(true);
    });

    it('keeps the spacing inside an inline code span', () => {
        expect(cleanPdfText('The value  of `a  b` stays  fixed.').text).toBe('The value of `a  b` stays fixed.');
    });

    it('collapses a space run right after inline code', () => {
        expect(cleanPdfText('Use `a`  here in the text.').text).toBe('Use `a` here in the text.');
    });

    it('keeps the spacing inside a wikilink target', () => {
        const input = 'the notes live in [[Project  Alpha]] for now  and later move.';

        expect(cleanPdfText(input).text).toBe('the notes live in [[Project  Alpha]] for now and later move.');
    });

    it('joins a tight em dash without adding a space', () => {
        const input = [
            `the meeting ran long and the outcome was unexpected${EM_DASH}`,
            'and it changed the plan for the quarter ahead.'
        ].join('\n');

        expect(cleanPdfText(input).text).toBe(
            `the meeting ran long and the outcome was unexpected${EM_DASH}and it changed the plan for the quarter ahead.`
        );
    });

    it('keeps the space when the em dash is already spaced', () => {
        const input = [`the results in the second cohort were mixed ${EM_DASH}`, 'and they were difficult to interpret cleanly.'].join(
            '\n'
        );

        expect(cleanPdfText(input).text).toBe(
            `the results in the second cohort were mixed ${EM_DASH} and they were difficult to interpret cleanly.`
        );
    });

    it('expands the Latin ligatures', () => {
        expect(cleanPdfText('\uFB00 \uFB01 \uFB02 \uFB03 \uFB04 \uFB05 \uFB06').text).toBe('ff fi fl ffi ffl st st');
    });

    it('collapses the space runs justified text leaves behind', () => {
        const input = ['The results were  consistent across all of the', 'sites  and the effect size remained stable.'].join('\n');

        expect(cleanPdfText(input).text).toBe('The results were consistent across all of the sites and the effect size remained stable.');
    });

    it('rejoins a narrow column that sits below the terminal floor', () => {
        const input = ['the model was trained on the full set', 'and evaluated against the held out data', 'for ten runs.'].join('\n');

        expect(cleanPdfText(input).text).toBe(
            'the model was trained on the full set and evaluated against the held out data for ten runs.'
        );
    });

    it('keeps the blank line between paragraphs', () => {
        const input = [
            'the first paragraph wraps onto a second',
            'line before it reaches its final stop.',
            '',
            'the second paragraph also wraps onto a',
            'second line before its own final stop.'
        ].join('\n');

        expect(cleanPdfText(input).text).toBe(
            [
                'the first paragraph wraps onto a second line before it reaches its final stop.',
                '',
                'the second paragraph also wraps onto a second line before its own final stop.'
            ].join('\n')
        );
    });

    it('leaves fenced code untouched while the prose around it rejoins', () => {
        const input = [
            'The pipeline is configured as follows, with',
            'the defaults shown for completeness below.',
            '```',
            'const x = 1;  //  spacing  kept',
            '```'
        ].join('\n');

        const output = cleanPdfText(input).text;
        expect(output).toContain('configured as follows, with the defaults shown');
        expect(output).toContain('const x = 1;  //  spacing  kept');
    });

    it('leaves block math untouched by the rejoin', () => {
        const hyphen = ['$$', 'a-', 'b', '$$'].join('\n');
        const bullet = ['$$', '\u00B7 x + y', '$$'].join('\n');

        expect(cleanPdfText(hyphen).changed).toBe(false);
        expect(cleanPdfText(bullet).changed).toBe(false);
    });

    it('keeps enumerated items on their own lines', () => {
        const input = [
            '(a) participants received the active treatment',
            'for twelve weeks before the final assessment.',
            '(b) participants received placebo for the same',
            'period before the final assessment.'
        ].join('\n');

        expect(cleanPdfText(input).text).toBe(
            [
                '(a) participants received the active treatment for twelve weeks before the final assessment.',
                '(b) participants received placebo for the same period before the final assessment.'
            ].join('\n')
        );
    });

    it('turns PDF bullets into Markdown list items', () => {
        expect(cleanPdfText(`${BULLET} first point\n${BULLET} second point`).text).toBe('- first point\n- second point');
    });

    it('does not merge a hyphenated line into a following list item', () => {
        const input = 'the following totals were re-\n- item one';

        expect(cleanPdfText(input).changed).toBe(false);
    });

    it('reports clean text as unchanged', () => {
        const result = cleanPdfText('Just a clean line.');

        expect(result.text).toBe('Just a clean line.');
        expect(result.changed).toBe(false);
    });
});

describe('cleanPdfText options', () => {
    const options = (overrides: Partial<Parameters<typeof cleanPdfText>[1]> = {}) => ({
        removeFurniture: false,
        singleParagraph: false,
        ...overrides
    });

    it('removes a page number line and keeps the paragraphs apart', () => {
        const input = [
            'the first page ends with a paragraph that',
            'stops here on a short line.',
            '',
            '14',
            '',
            'the next page starts with a new paragraph',
            'that also wraps onto a second line.'
        ].join('\n');

        expect(cleanPdfText(input, options({ removeFurniture: true })).text).toBe(
            [
                'the first page ends with a paragraph that stops here on a short line.',
                '',
                'the next page starts with a new paragraph that also wraps onto a second line.'
            ].join('\n')
        );
    });

    it('rejoins a paragraph split by a page break mid-sentence', () => {
        const input = ['the trial results showed that the treatment', '', '14', '', 'group improved substantially over the control.'].join(
            '\n'
        );

        expect(cleanPdfText(input, options({ removeFurniture: true })).text).toBe(
            'the trial results showed that the treatment group improved substantially over the control.'
        );
    });

    it('repairs a word broken across a page break', () => {
        const input = ['the compound was administered in the treat-', '', '- 14 -', '', 'ment group across the whole trial period.'].join(
            '\n'
        );

        expect(cleanPdfText(input, options({ removeFurniture: true })).text).toBe(
            'the compound was administered in the treatment group across the whole trial period.'
        );
    });

    it('keeps a numeric equation line', () => {
        const input = [
            'the paragraph before the equation ends here.',
            '',
            '2 + 2 = 4',
            '',
            'the paragraph after the equation starts here.'
        ].join('\n');

        expect(cleanPdfText(input, options({ removeFurniture: true })).changed).toBe(false);
    });

    it('keeps a repeated line that ends a sentence', () => {
        const input = 'it was a fine day.\n\nit was a fine day.';

        expect(cleanPdfText(input, options({ removeFurniture: true })).changed).toBe(false);
    });

    it('keeps standalone values that are not page numbers', () => {
        const percent = ['the measurement results are listed below', '', '95%', '', 'the rest of the analysis continues here'].join('\n');
        const citation = ['the sources are given as citation markers', '', '[12]', '', 'more of the analysis text continues here'].join(
            '\n'
        );

        expect(cleanPdfText(percent, options({ removeFurniture: true })).changed).toBe(false);
        expect(cleanPdfText(citation, options({ removeFurniture: true })).changed).toBe(false);
    });

    it('keeps a repeated label buried inside a run of text lines', () => {
        const input = [
            'the table below lists cohorts',
            'Control group',
            'mean value forty two',
            'Control group',
            'mean value fifty one'
        ].join('\n');

        expect(cleanPdfText(input, options({ removeFurniture: true })).changed).toBe(false);
    });

    it('keeps a repeated enumerated item', () => {
        const input = [
            'findings for the first cohort follow',
            '',
            '(a) Not applicable',
            '',
            'findings for the second cohort follow',
            '',
            '(a) Not applicable'
        ].join('\n');

        expect(cleanPdfText(input, options({ removeFurniture: true })).changed).toBe(false);
    });

    it('keeps a repeated bullet item', () => {
        const input = [
            'findings for the first cohort follow',
            '',
            `${BULLET} Not applicable`,
            '',
            'findings for the second cohort follow',
            '',
            `${BULLET} Not applicable`
        ].join('\n');

        const output = cleanPdfText(input, options({ removeFurniture: true })).text;
        expect(output.match(/- Not applicable/g)?.length).toBe(2);
    });

    it('removes page numbers after a prose mention of $$', () => {
        const input = ['the shell expands $$ to the process id.', '', '14', '', 'the next page continues with more text.'].join('\n');

        expect(cleanPdfText(input, options({ removeFurniture: true })).text).toBe(
            ['the shell expands $$ to the process id.', '', 'the next page continues with more text.'].join('\n')
        );
    });

    it('keeps block math and its delimiters', () => {
        const input = ['the derivation gives the following result', '', '$$', '2', '$$', '', 'which concludes the argument here.'].join(
            '\n'
        );

        expect(cleanPdfText(input, options({ removeFurniture: true })).changed).toBe(false);
    });

    it('keeps a numeric line inside a nested fence', () => {
        const input = ['````', '```', '14', '```', '````'].join('\n');

        expect(cleanPdfText(input, options({ removeFurniture: true })).changed).toBe(false);
    });

    it('keeps page numbers when the option is off', () => {
        const input = 'first line of text here\n\n14\n\nsecond line of text here';

        expect(cleanPdfText(input, options()).text).toContain('14');
    });

    it('joins everything into one paragraph on request', () => {
        const input = [
            'the first paragraph wraps onto a second',
            'line before it reaches its final stop.',
            '',
            'the second paragraph also wraps onto a',
            'second line before its own final stop.'
        ].join('\n');

        expect(cleanPdfText(input, options({ singleParagraph: true })).text).toBe(
            'the first paragraph wraps onto a second line before it reaches its final stop. the second paragraph also wraps onto a second line before its own final stop.'
        );
    });

    it('joins a line with an inline code span into the single paragraph', () => {
        const input = ['Run the command.', 'Use `npm test`.', 'Then inspect output.'].join('\n');

        expect(cleanPdfText(input, options({ singleParagraph: true })).text).toBe('Run the command. Use `npm test`. Then inspect output.');
    });

    it('keeps code span spacing in the single paragraph', () => {
        const input = 'Use `a  b` exactly.\nThen continue with the rest.';

        expect(cleanPdfText(input, options({ singleParagraph: true })).text).toBe('Use `a  b` exactly. Then continue with the rest.');
    });

    it('keeps a blank line around indented code in the single paragraph', () => {
        const input = [
            'prose before the block continues here',
            '',
            '    SELECT 1;',
            '    SELECT 2;',
            '',
            'prose after the block continues here'
        ].join('\n');

        expect(cleanPdfText(input, options({ singleParagraph: true })).text).toBe(
            [
                'prose before the block continues here',
                '',
                '    SELECT 1;',
                '    SELECT 2;',
                '',
                'prose after the block continues here'
            ].join('\n')
        );
    });

    it('repairs a hyphenated word across a blank line in the single paragraph', () => {
        const input = ['the effect was strongest for long expo-', '', 'sure durations in the second cohort.'].join('\n');

        expect(cleanPdfText(input, options({ singleParagraph: true })).text).toBe(
            'the effect was strongest for long exposure durations in the second cohort.'
        );
    });

    it('joins CJK paragraphs without a space in the single paragraph', () => {
        const input = '\u7B2C\u4E00\u6BB5\u3002\n\n\u7B2C\u4E8C\u6BB5\u3002';

        expect(cleanPdfText(input, options({ singleParagraph: true })).text).toBe('\u7B2C\u4E00\u6BB5\u3002\u7B2C\u4E8C\u6BB5\u3002');
    });

    it('keeps the protective break of a wrapped web address in the single paragraph', () => {
        const input = ['the report is at https://example.com/research/', 'methods.pdf for download.'].join('\n');

        expect(cleanPdfText(input, options({ singleParagraph: true })).text).toContain('https://example.com/research/\nmethods.pdf');
    });

    it('keeps fenced code out of the single paragraph', () => {
        const input = ['some prose before the code block here', '```', 'const x = 1;', '```', 'and some prose after it too'].join('\n');

        const output = cleanPdfText(input, options({ singleParagraph: true })).text;
        expect(output).toContain('```\nconst x = 1;\n```');
        expect(output).toContain('some prose before the code block here');
    });

    it('emits a single blank line after a fence in the single paragraph', () => {
        const input = ['some prose before the code block here', '```', 'const x = 1;', '```', '', 'and some prose after it too'].join('\n');

        expect(cleanPdfText(input, options({ singleParagraph: true })).text).toBe(
            ['some prose before the code block here', '', '```', 'const x = 1;', '```', '', 'and some prose after it too'].join('\n')
        );
    });
});
