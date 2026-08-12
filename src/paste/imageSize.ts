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

/** Accepts "400", "400x300", "400 x 300" and the multiplication sign variant. */
const SIZE_PATTERN = /^(\d+)(?:\s*[x×]\s*(\d+))?$/i;

/**
 * Extracts the YAML text of a note's frontmatter block, or null when there is none.
 *
 * Read from the editor's current text rather than the metadata cache, because a property
 * the user just typed has not necessarily reached the cache by the time they paste.
 */
export function extractFrontmatterBlock(content: string): string | null {
    const lines = content.split('\n');

    // Obsidian only recognises frontmatter that opens on the very first line
    if (lines.length === 0 || lines[0].trimEnd() !== '---') return null;

    for (let index = 1; index < lines.length; index++) {
        const line = lines[index].trimEnd();
        if (line === '---' || line === '...') return lines.slice(1, index).join('\n');
    }

    // An unterminated block is still being typed
    return null;
}

/**
 * Converts a frontmatter value into the size suffix Obsidian understands in an embed,
 * or null when the value is missing or not a usable size.
 */
export function normalizeImageSize(value: unknown): string | null {
    if (typeof value === 'number') {
        return Number.isFinite(value) && value > 0 ? String(Math.round(value)) : null;
    }

    if (typeof value !== 'string') return null;

    const match = SIZE_PATTERN.exec(value.trim());
    if (!match) return null;

    const width = Number(match[1]);
    if (width <= 0) return null;

    if (match[2] === undefined) return String(width);

    const height = Number(match[2]);
    return height > 0 ? `${width}x${height}` : null;
}

/**
 * Reads the configured size property out of parsed frontmatter. The property name is
 * matched case insensitively, which is friendlier than YAML's exact matching and costs
 * nothing, since a note is not going to carry two spellings of the same property.
 */
export function resolveImageSize(frontmatter: unknown, property: string): string | null {
    const wanted = property.trim().toLowerCase();
    if (!wanted) return null;
    if (typeof frontmatter !== 'object' || frontmatter === null) return null;

    const record = frontmatter as Record<string, unknown>;
    const key = Object.keys(record).find(candidate => candidate.toLowerCase() === wanted);

    return key === undefined ? null : normalizeImageSize(record[key]);
}
