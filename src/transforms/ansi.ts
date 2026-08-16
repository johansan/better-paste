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

// Every pattern below is built from escape strings rather than literal control bytes,
// so this file stays plain ASCII and survives copy/paste and editor round-trips.
const ESC = '\\u001B';
const BEL = '\\u0007';

/**
 * DCS, SOS, PM and APC strings (sixel, tmux passthrough, kitty graphics) run to ST with
 * their whole payload, which may itself contain doubled escapes. Must run first.
 */
const STRING_PATTERN = new RegExp(`${ESC}[PX^_](?:[^${ESC}]|${ESC}(?!\\\\))*${ESC}\\\\`, 'g');

/** OSC sequences (window titles, hyperlinks) terminated by BEL or ST. Must run before CSI. */
const OSC_PATTERN = new RegExp(`${ESC}\\][^${BEL}${ESC}]*(?:${BEL}|${ESC}\\\\)`, 'g');

/** CSI sequences: colours, cursor movement, erase commands. */
const CSI_PATTERN = new RegExp(`${ESC}\\[[0-?]*[ -/]*[@-~]`, 'g');

/**
 * Remaining escapes per ECMA-48: optional intermediate bytes then one final byte. This
 * covers charset selection (ESC ( B from tput sgr0), keypad modes (ESC =, ESC >) and
 * cursor save/restore (ESC 7, ESC 8), plus a bare trailing ESC.
 */
const SIMPLE_ESCAPE_PATTERN = new RegExp(`${ESC}[ -/]*[0-~]?`, 'g');

/** Control characters with no meaning in a note. Horizontal tab and line feed are kept. */
// eslint-disable-next-line no-control-regex -- matching control characters is the purpose of this pattern
const CONTROL_PATTERN = new RegExp('[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]', 'g');

/**
 * Removes ANSI escape sequences and stray control characters from terminal output.
 * Tabs and newlines are preserved because they carry layout meaning.
 */
export function stripAnsi(text: string): string {
    return text
        .replace(STRING_PATTERN, '')
        .replace(OSC_PATTERN, '')
        .replace(CSI_PATTERN, '')
        .replace(SIMPLE_ESCAPE_PATTERN, '')
        .replace(CONTROL_PATTERN, '');
}
