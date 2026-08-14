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

/*
 * Picks the language once, at load, because Obsidian only changes its interface language
 * across a restart.
 *
 * Every language file is imported directly rather than loaded on demand. A plugin ships as
 * one bundle, so the alternative only defers building the objects, and this string table is
 * small enough that building all of them costs less than the machinery to avoid it.
 */

import { getLanguage } from 'obsidian';
import { STRINGS_EN } from './locales/en';
import { STRINGS_AR } from './locales/ar';
import { STRINGS_DE } from './locales/de';
import { STRINGS_ES } from './locales/es';
import { STRINGS_FA } from './locales/fa';
import { STRINGS_FR } from './locales/fr';
import { STRINGS_ID } from './locales/id';
import { STRINGS_IT } from './locales/it';
import { STRINGS_JA } from './locales/ja';
import { STRINGS_KO } from './locales/ko';
import { STRINGS_NL } from './locales/nl';
import { STRINGS_PL } from './locales/pl';
import { STRINGS_PT } from './locales/pt';
import { STRINGS_PT_BR } from './locales/pt_br';
import { STRINGS_RU } from './locales/ru';
import { STRINGS_TH } from './locales/th';
import { STRINGS_TR } from './locales/tr';
import { STRINGS_UK } from './locales/uk';
import { STRINGS_VI } from './locales/vi';
import { STRINGS_ZH_CN } from './locales/zh_cn';
import { STRINGS_ZH_TW } from './locales/zh_tw';
import type { PluralForms, TranslationStrings } from './types';

interface Locale {
    /** BCP 47 tag, which is what `Intl.PluralRules` understands. */
    tag: string;
    strings: TranslationStrings;
}

/**
 * Keyed by the codes Obsidian's `getLanguage` returns. A language Obsidian offers but this
 * plugin has no translation for is absent, and falls back to English.
 */
export const LOCALES: Record<string, Locale> = {
    ar: { tag: 'ar', strings: STRINGS_AR },
    de: { tag: 'de', strings: STRINGS_DE },
    en: { tag: 'en', strings: STRINGS_EN },
    'en-GB': { tag: 'en-GB', strings: STRINGS_EN },
    es: { tag: 'es', strings: STRINGS_ES },
    fa: { tag: 'fa', strings: STRINGS_FA },
    fr: { tag: 'fr', strings: STRINGS_FR },
    id: { tag: 'id', strings: STRINGS_ID },
    it: { tag: 'it', strings: STRINGS_IT },
    ja: { tag: 'ja', strings: STRINGS_JA },
    ko: { tag: 'ko', strings: STRINGS_KO },
    nl: { tag: 'nl', strings: STRINGS_NL },
    pl: { tag: 'pl', strings: STRINGS_PL },
    pt: { tag: 'pt-PT', strings: STRINGS_PT },
    'pt-BR': { tag: 'pt-BR', strings: STRINGS_PT_BR },
    ru: { tag: 'ru', strings: STRINGS_RU },
    th: { tag: 'th', strings: STRINGS_TH },
    tr: { tag: 'tr', strings: STRINGS_TR },
    uk: { tag: 'uk', strings: STRINGS_UK },
    vi: { tag: 'vi', strings: STRINGS_VI },
    zh: { tag: 'zh-CN', strings: STRINGS_ZH_CN },
    'zh-TW': { tag: 'zh-TW', strings: STRINGS_ZH_TW }
};

const active: Locale = LOCALES[getLanguage()] ?? LOCALES.en;

/** Every user-facing string, in Obsidian's interface language. */
export const strings: TranslationStrings = active.strings;

/**
 * BCP 47 tag for the interface language, for the places where a value is formatted rather
 * than translated. It follows Obsidian rather than the operating system, so a date in the
 * release notes is written the same way as the text around it.
 */
export const localeTag: string = active.tag;

const pluralRules = new Intl.PluralRules(active.tag);

/** Replaces each `{name}` with its value, leaving a token that has no value in place. */
export function format(template: string, values: Record<string, string | number>): string {
    return template.replace(/\{(\w+)\}/g, (token, name: string) => {
        const value = values[name];
        return value === undefined ? token : String(value);
    });
}

/**
 * Picks the wording that matches `count` in this language, and writes the number into it.
 * A language supplies only the grammatical numbers it uses, so a category it left out
 * falls back to `other`, which every language has.
 */
export function plural(forms: PluralForms, count: number): string {
    const form = forms[pluralRules.select(count)] ?? forms.other;
    return format(form, { count });
}

/**
 * Search terms for a settings row. The translated terms come first and the English ones
 * follow, because the plugin's documentation and the names of these rules on the web are
 * English, so either language finds the row. A term a language kept in English appears once.
 */
export function aliases(pick: (source: TranslationStrings) => string[]): string[] {
    return [...new Set([...pick(strings), ...pick(STRINGS_EN)])];
}
