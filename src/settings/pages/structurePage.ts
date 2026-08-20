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

import type { SettingGroupItem } from 'obsidian';
import { aliases, strings } from '../../i18n';
import { toggle } from './context';

/**
 * Rows shown under the Structure heading: document transforms, whose result depends on
 * where the paste lands rather than only on what was copied.
 */
export function createStructureDefinitions(): SettingGroupItem[] {
    const text = strings.settings.structure;

    return [
        toggle(
            'listNesting',
            text.listNestingName,
            text.listNestingDesc,
            aliases(source => source.settings.structure.listNestingAliases)
        ),
        toggle(
            'quoteContinuation',
            text.quoteContinuationName,
            text.quoteContinuationDesc,
            aliases(source => source.settings.structure.quoteContinuationAliases)
        )
    ];
}
