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
 * Icons drawn on the plugin cards in settings that Obsidian does not ship itself.
 *
 * Only the plugin that owns a drawing registers it, so the card has to bring its own copy
 * to look right whether or not that plugin is installed. Registering happens here, at
 * import, because the id is worthless without the drawing behind it.
 *
 * The Notebook Navigator artwork is the content of icon.svg in that plugin's repository,
 * without the <svg> wrapper and with stroke="currentColor" on the outer group, which is
 * what its own build-icons.mjs produces. Refresh it by copying that file again after the
 * icon is redesigned. The coordinates are drawn against the "0 0 100 100" viewBox that
 * Obsidian wraps the content in.
 */

import { addIcon } from 'obsidian';

/** Icon id for the Notebook Navigator card. It carries this plugin's name because
 *  Notebook Navigator registers the same drawing under "notebook-navigator" for its
 *  ribbon, and registering that id here would replace the drawing it uses. */
export const NOTEBOOK_NAVIGATOR_ICON = 'better-paste-notebook-navigator';

addIcon(
    NOTEBOOK_NAVIGATOR_ICON,
    `<g stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <rect x="19.88" y="12.42" width="66.42" height="75.21" rx="6.25" stroke-width="8"/>
        <g stroke-width="4">
            <line x1="13.29" y1="24.38" x2="28.5" y2="24.38"/>
            <line x1="13.29" y1="37.21" x2="28.5" y2="37.21"/>
            <line x1="13.29" y1="50" x2="28.5" y2="50"/>
            <line x1="13.29" y1="62.79" x2="28.5" y2="62.79"/>
            <line x1="13.29" y1="75.63" x2="28.5" y2="75.63"/>
        </g>
        <g stroke-width="3.5">
            <circle cx="28.5" cy="24.38" r="1.38"/>
            <circle cx="28.5" cy="37.21" r="1.38"/>
            <circle cx="28.5" cy="50" r="1.38"/>
            <circle cx="28.5" cy="62.79" r="1.38"/>
            <circle cx="28.5" cy="75.63" r="1.38"/>
        </g>
        <polygon points="52.77 53.33 36.22 49.08 70.07 34.18 57.25 69.38 52.77 53.33" fill="currentColor" stroke="none"/>
    </g>`
);
