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

import { readFile, writeFile } from 'node:fs/promises';

const catalogUrl = new URL('../LINK_REMOVALS.md', import.meta.url);
const outputUrl = new URL('../src/settings/linkRemovals.generated.ts', import.meta.url);

function entriesUnder(markdown, heading) {
    const marker = `## ${heading}`;
    const markerIndex = markdown.indexOf(marker);
    if (markerIndex < 0) throw new Error(`Missing heading: ${marker}`);

    const following = markdown.slice(markerIndex + marker.length);
    const nextHeading = following.search(/\n## /);
    const section = nextHeading < 0 ? following : following.slice(0, nextHeading);
    const block = section.match(/```text\n([\s\S]*?)\n```/);
    if (!block) throw new Error(`Missing text block under: ${marker}`);

    const entries = block[1]
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean);
    if (entries.length === 0) throw new Error(`Empty list under: ${marker}`);
    return entries;
}

function rejectDuplicates(entries, label) {
    const seen = new Set();
    for (const entry of entries) {
        const key = entry.toLowerCase();
        if (seen.has(key)) throw new Error(`Duplicate ${label}: ${entry}`);
        seen.add(key);
    }
}

function validateTrackingParams(entries) {
    rejectDuplicates(entries, 'tracking parameter');
    for (const entry of entries) {
        if (/[,|\s]/.test(entry)) throw new Error(`Invalid tracking parameter: ${entry}`);
    }
}

function validateParamSets(entries, label) {
    rejectDuplicates(entries, label);
    for (const entry of entries) {
        const params = entry.split(', ');
        if (params.some(param => !param || /[,|\s]/.test(param))) {
            throw new Error(`Invalid ${label}: ${entry}`);
        }
    }
}

function validateSiteRemovals(entries) {
    rejectDuplicates(entries, 'site removal');
    const sites = new Set();
    for (const entry of entries) {
        const parts = entry.split(' | ');
        if (parts.length !== 2) throw new Error(`Invalid site removal: ${entry}`);

        const [site, rawParams] = parts;
        const domain = site.replace(/^\*\./, '').replace(/\.\*$/, '');
        if (!/^[a-z0-9-]+(?:\.[a-z0-9-]+)*$/i.test(domain)) throw new Error(`Invalid site: ${site}`);
        const siteKey = site.toLowerCase();
        if (sites.has(siteKey)) throw new Error(`Duplicate site: ${site}`);
        sites.add(siteKey);

        const params = rawParams.split(', ');
        if (params.length === 0 || params.some(param => !param || /[,|\s]/.test(param))) {
            throw new Error(`Invalid parameter list: ${entry}`);
        }
    }
}

function quote(value) {
    return `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;
}

function renderArray(name, entries) {
    return `export const ${name} = [\n${entries.map(entry => `    ${quote(entry)}`).join(',\n')}\n] as const;`;
}

function renderParamSets(name, entries) {
    const sets = entries.map(entry => `    [${entry.split(', ').map(quote).join(', ')}]`).join(',\n');
    return `export const ${name} = [\n${sets}\n] as const;`;
}

const markdown = await readFile(catalogUrl, 'utf8');
const updatedMatch = markdown.match(/^Last updated: (\d{4}-\d{2}-\d{2})$/m);
if (!updatedMatch) {
    throw new Error('LINK_REMOVALS.md needs a Last updated date in YYYY-MM-DD format');
}
const updated = updatedMatch[1];
const signedUrlParamSets = entriesUnder(markdown, 'Parameter sets that identify signed URLs');
const trackingParams = entriesUnder(markdown, 'Tracking parameters removed on every site');
const siteRemovals = entriesUnder(markdown, 'Extra parameters removed on specific sites');

validateParamSets(signedUrlParamSets, 'signed URL parameter set');
validateTrackingParams(trackingParams);
validateSiteRemovals(siteRemovals);

const generated = `/*
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

// Generated from LINK_REMOVALS.md. Edit that file, then run npm run generate:link-removals.

export const LINK_REMOVALS_UPDATED = ${quote(updated)};

${renderParamSets('SIGNED_URL_PARAM_SETS', signedUrlParamSets)}

${renderArray('TRACKING_PARAMS', trackingParams)}

${renderArray('SHIPPED_PARAM_REMOVALS', siteRemovals)}
`;

await writeFile(outputUrl, generated, 'utf8');
