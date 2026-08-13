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

import { Notice } from 'obsidian';

interface NoticeOptions {
    timeout?: number;
    variant?: 'loading' | 'warning';
}

/** Shows an Obsidian notice in the window that created it, with an optional state style. */
export function showNotice(message: string, options: NoticeOptions = {}): Notice {
    const notice = new Notice(message, options.timeout);
    const container = notice.containerEl;
    if (!container) return notice;

    if (!container.isConnected) {
        const parent = container.parentElement;
        if (parent?.classList.contains('notice-container') && !parent.isConnected) {
            container.ownerDocument.body.appendChild(parent);
        }
    }

    if (options.variant === 'loading') container.addClass('is-loading');
    if (options.variant === 'warning') container.addClass('mod-warning');
    return notice;
}
