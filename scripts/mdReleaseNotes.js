#!/usr/bin/env node

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

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const releaseNotesPath = join(scriptDirectory, '..', 'src', 'releaseNotes.ts');
const content = readFileSync(releaseNotesPath, 'utf8');
const releaseNotesMatch = content.match(/const\s+RELEASE_NOTES[\s\S]*?=\s*(\[[\s\S]*?\]);/);

if (!releaseNotesMatch) {
    console.error('Could not find RELEASE_NOTES in file');
    process.exit(1);
}

let releases;
try {
    releases = vm.runInNewContext(`(${releaseNotesMatch[1]})`, {});
} catch (error) {
    console.error(`Could not parse release notes: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
}

if (!Array.isArray(releases) || releases.length === 0) {
    console.error('No release notes found');
    process.exit(1);
}

const versionArgument = process.argv.slice(2).find(argument => argument && !argument.startsWith('-'));
const normalizedVersion = versionArgument ? versionArgument.replace(/^v/, '') : null;
const release = normalizedVersion
    ? releases.find(entry => typeof entry === 'object' && entry !== null && entry.version === normalizedVersion)
    : releases[0];

if (typeof release !== 'object' || release === null) {
    console.error(`No release notes found for version: ${normalizedVersion}`);
    process.exit(1);
}

const convertMarkdown = text => text.replace(/==/g, '**');
const printSection = (title, items) => {
    if (!Array.isArray(items) || items.length === 0) return;
    console.log(`### ${title}\n`);
    for (const item of items) console.log(`- ${convertMarkdown(item)}`);
    console.log();
};

if (typeof release.info === 'string') console.log(`${convertMarkdown(release.info)}\n`);

printSection('New', release.new);
printSection('Improved', release.improved);
printSection('Changed', release.changed);
printSection('Fixed', release.fixed);
