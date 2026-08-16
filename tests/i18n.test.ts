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
import { aliases, format, LOCALES, plural, strings } from '../src/i18n';
import { STRINGS_EN } from '../src/i18n/locales/en';
import { normalizeInvisibleCharacters, straightenDashes, straightenQuotes } from '../src/transforms/typography';
import { applyCommaPlacement } from '../src/transforms/textProcessing';

/** The two invisible characters the invisible-characters example puts between its fragments. */
const NO_BREAK_SPACE = '\u00A0';
const ZERO_WIDTH_SPACE = '\u200B';

/**
 * Counts a paste can realistically report, chosen to reach every grammatical number the
 * supported languages use: Russian and Polish switch at 2 to 4 and again at 5, Ukrainian
 * repeats that pattern above 100, and Arabic has separate forms for 0, 1, 2, 3 to 10 and
 * 11 to 99.
 */
const COUNTS = [...Array.from({ length: 31 }, (_, index) => index), 100, 101, 102, 105, 111, 1000];

/** Categories `Intl.PluralRules` can return, so a typo in a language file is caught. */
const PLURAL_CATEGORIES = ['zero', 'one', 'two', 'few', 'many', 'other'];

type Plain = Record<string, unknown>;

/**
 * True for a plural message rather than a nested group of strings. A group is told apart
 * by its keys, because both shapes are an object of strings.
 */
function isPluralForms(value: unknown): value is Record<string, string> {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
    const keys = Object.keys(value);
    return keys.includes('other') && keys.every(key => PLURAL_CATEGORIES.includes(key));
}

/** Every `{name}` token in a string, sorted so two strings can be compared. */
function placeholders(value: string): string[] {
    return [...value.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort();
}

/** Walks English and a translation together, calling `visit` on each pair of strings. */
function walk(
    english: unknown,
    translated: unknown,
    path: string,
    visit: (path: string, english: string, translated: string) => void
): void {
    if (typeof english === 'string') {
        if (typeof translated !== 'string') throw new Error(`${path} is not a string`);
        visit(path, english, translated);
        return;
    }

    if (Array.isArray(english)) {
        if (!Array.isArray(translated)) throw new Error(`${path} is not a list`);

        // Search terms are chosen for the language rather than translated one for one, so
        // only prose lists have to line up with English
        if (path.endsWith('Aliases')) {
            expect(translated.length, `${path} has no search terms`).toBeGreaterThan(0);
            translated.forEach((entry: unknown, index) => {
                if (typeof entry !== 'string') throw new Error(`${path}[${index}] is not a string`);
                expect(entry.trim().length, `${path}[${index}] is empty`).toBeGreaterThan(0);
            });
            return;
        }

        expect(translated.length, `${path} has a different number of entries`).toBe(english.length);
        english.forEach((entry, index) => walk(entry, translated[index], `${path}[${index}]`, visit));
        return;
    }

    // A plural message holds only the grammatical numbers its own language uses, so its
    // keys are compared against the language rather than against English
    if (isPluralForms(english)) {
        if (!isPluralForms(translated)) throw new Error(`${path} is not a plural message`);
        for (const [category, form] of Object.entries(translated)) visit(`${path}.${category}`, english.other, form);
        return;
    }

    const source = english as Plain;
    const target = translated as Plain;
    expect(Object.keys(target).sort(), `${path} has different keys`).toEqual(Object.keys(source).sort());
    for (const key of Object.keys(source)) walk(source[key], target[key], `${path}.${key}`, visit);
}

describe('translations', () => {
    it('covers every language Obsidian offers that the plugin claims', () => {
        // The keys are the codes getLanguage returns, so a typo here silently falls back
        // to English rather than failing
        expect(Object.keys(LOCALES).sort()).toEqual(
            [
                'ar',
                'de',
                'en',
                'en-GB',
                'es',
                'fa',
                'fr',
                'id',
                'it',
                'ja',
                'ko',
                'nl',
                'pl',
                'pt',
                'pt-BR',
                'ru',
                'th',
                'tr',
                'uk',
                'vi',
                'zh',
                'zh-TW'
            ].sort()
        );
    });

    it.each(Object.entries(LOCALES))('%s has the same strings as English', (code, locale) => {
        walk(STRINGS_EN, locale.strings, code, (path, english, translated) => {
            expect(translated.trim().length, `${path} is empty`).toBeGreaterThan(0);
            expect(placeholders(translated), `${path} uses different placeholders`).toEqual(placeholders(english));
        });
    });

    it.each(Object.entries(LOCALES))('%s uses a language tag with real plural rules', (_code, locale) => {
        expect(new Intl.PluralRules(locale.tag).resolvedOptions().locale).not.toBe('');
    });

    it.each(Object.entries(LOCALES))('%s supplies every grammatical number it needs', (code, locale) => {
        const rules = new Intl.PluralRules(locale.tag);

        walkPlurals(locale.strings, code, (path, forms) => {
            const supplied = Object.keys(forms);

            for (const category of supplied) {
                expect(PLURAL_CATEGORIES, `${path} has an unknown category "${category}"`).toContain(category);
                expect(rules.resolvedOptions().pluralCategories, `${path} has a category this language never uses`).toContain(category);
            }

            for (const count of COUNTS) {
                const category = rules.select(count);
                expect(supplied, `${path} has no wording for ${count}`).toContain(category);
                // plural() reads the rules of whichever language is running, which is English
                // under the test stub, so the form is picked with this language's own rules
                expect(format(forms[category], { count }), `${path} drops the number for ${count}`).toContain(String(count));
            }
        });
    });

    it.each(Object.entries(LOCALES))('%s writes a comma example the rule really produces', (_code, locale) => {
        const source = locale.strings.settings.text.commasExampleSource;

        expect(applyCommaPlacement(source, 'outside').text).toBe(locale.strings.settings.text.commasExampleOutside);
        // The comma already sits inside the quotation mark, so this setting leaves it alone
        expect(applyCommaPlacement(source, 'inside').text).toBe(source);
    });

    it.each(Object.entries(LOCALES))('%s writes text cleanup examples the rules really produce', (_code, locale) => {
        const text = locale.strings.settings.text;
        const invisible = `${text.invisibleExampleStart}${NO_BREAK_SPACE}${text.invisibleExampleMiddle}${ZERO_WIDTH_SPACE}${text.invisibleExampleEnd}`;

        expect(normalizeInvisibleCharacters(invisible).text).toBe(text.invisibleExampleAfter);

        // Each example must visibly change, otherwise the settings row would promise a
        // change that never happens. Guillemets are deliberately left alone by the quote
        // rule, so a language cannot use them as its example pair.
        expect(straightenQuotes(text.quotesExample).changed, 'quotes').toBe(true);
        expect(straightenDashes(text.dashesExample).changed, 'dashes').toBe(true);
    });
});

/** Calls `visit` for every plural message inside a language file. */
function walkPlurals(value: unknown, path: string, visit: (path: string, forms: Record<string, string>) => void): void {
    if (typeof value === 'string' || Array.isArray(value)) return;
    if (isPluralForms(value)) {
        visit(path, value);
        return;
    }

    for (const [key, entry] of Object.entries(value as Plain)) walkPlurals(entry, `${path}.${key}`, visit);
}

describe('format', () => {
    it('replaces every token it has a value for', () => {
        expect(format('Version {version} ({date})', { version: '1.2.3', date: 'today' })).toBe('Version 1.2.3 (today)');
    });

    it('accepts numbers', () => {
        expect(format('{count} sites', { count: 4 })).toBe('4 sites');
    });

    it('leaves a token with no value in place', () => {
        expect(format('{a} and {b}', { a: 'one' })).toBe('one and {b}');
    });
});

describe('plural', () => {
    it('picks the singular for one', () => {
        expect(plural(STRINGS_EN.notices.imagesFailed, 1)).toBe('1 image could not be saved');
    });

    it('picks the plural for everything else', () => {
        expect(plural(STRINGS_EN.notices.imagesFailed, 0)).toBe('0 images could not be saved');
        expect(plural(STRINGS_EN.notices.imagesFailed, 3)).toBe('3 images could not be saved');
    });

    it('falls back to other for a category the language file leaves out', () => {
        expect(plural({ other: '{count} items' }, 1)).toBe('1 items');
    });
});

describe('search aliases', () => {
    it('are the English terms when Obsidian is in English', () => {
        expect(aliases(source => source.settings.links.listAliases)).toEqual(STRINGS_EN.settings.links.listAliases);
    });
});

describe('strings', () => {
    it('resolve to English when Obsidian reports no other language', () => {
        expect(strings).toBe(STRINGS_EN);
    });
});
