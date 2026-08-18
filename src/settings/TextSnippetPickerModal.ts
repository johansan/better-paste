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

import { FuzzySuggestModal } from 'obsidian';
import type { App } from 'obsidian';
import { strings } from '../i18n';
import type { TextSnippet } from './types';

/** Lists every stored snippet for an explicit run against the current selection. */
export class TextSnippetPickerModal extends FuzzySuggestModal<TextSnippet> {
    private readonly snippets: TextSnippet[];
    private readonly onChoose: (snippet: TextSnippet) => void;

    constructor(app: App, snippets: readonly TextSnippet[], onChoose: (snippet: TextSnippet) => void) {
        super(app);
        this.snippets = [...snippets];
        this.onChoose = onChoose;
        this.setPlaceholder(strings.commands.runSnippet);
    }

    getItems(): TextSnippet[] {
        return this.snippets;
    }

    getItemText(snippet: TextSnippet): string {
        return snippet.name;
    }

    onChooseItem(snippet: TextSnippet): void {
        this.onChoose(snippet);
    }
}
