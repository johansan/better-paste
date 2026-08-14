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

import type { STRINGS_EN } from './locales/en';

/**
 * The shape every language file must have. English is the source of truth, so adding a
 * string to `en.ts` makes the compiler name every translation that is still missing it.
 * A translation is annotated with this type, which also rejects a key that no longer
 * exists in English.
 */
export type TranslationStrings = typeof STRINGS_EN;

/**
 * One message in each grammatical number its language uses, selected by `Intl.PluralRules`.
 * English needs `one` and `other`, Russian and Polish also need `few` and `many`, Arabic
 * uses every category. A language supplies only the categories it has, so `other` is the
 * only required form.
 *
 * `{count}` is replaced with the number.
 */
export interface PluralForms {
    zero?: string;
    one?: string;
    two?: string;
    few?: string;
    many?: string;
    other: string;
}
