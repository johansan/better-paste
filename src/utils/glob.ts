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

// Compiled patterns are cached because the same setting lists are reused on every paste
const globCache = new Map<string, RegExp>();

/** Escapes regular expression metacharacters so a literal string can be embedded in a pattern. */
function escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Compiles a glob pattern where '*' matches any run of characters and '?' matches one character.
 * Matching is anchored and case insensitive.
 */
function compileGlob(pattern: string): RegExp {
    const cached = globCache.get(pattern);
    if (cached) return cached;

    const source = pattern
        .split('*')
        .map(segment =>
            segment
                .split('?')
                .map(part => escapeRegex(part))
                .join('.')
        )
        .join('.*');

    const compiled = new RegExp(`^${source}$`, 'i');
    globCache.set(pattern, compiled);
    return compiled;
}

/** Returns true when `value` matches at least one of the glob patterns. */
export function matchesAnyGlob(value: string, patterns: readonly string[]): boolean {
    for (const pattern of patterns) {
        const trimmed = pattern.trim();
        if (!trimmed) continue;
        if (compileGlob(trimmed).test(value)) return true;
    }
    return false;
}
