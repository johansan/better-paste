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

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

// One level up, because this script lives in scripts/ while every path it touches, and the
// working directory every git command needs, is the repository root
const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const releaseTypes = new Set(['patch', 'minor', 'major']);
const versionFiles = ['manifest.json', 'package.json', 'package-lock.json', 'versions.json'];

function run(command, args, options = {}) {
    return execFileSync(command, args, {
        cwd: projectRoot,
        encoding: 'utf8',
        stdio: options.capture ? ['ignore', 'pipe', 'pipe'] : 'inherit'
    })?.trim();
}

function git(args, options = {}) {
    return run('git', args, options);
}

function readJson(filename) {
    return JSON.parse(readFileSync(join(projectRoot, filename), 'utf8'));
}

function nextVersion(version, releaseType) {
    const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
    if (!match) throw new Error(`Invalid version in package.json: ${version}`);

    const [, majorText, minorText, patchText] = match;
    const major = Number(majorText);
    const minor = Number(minorText);
    const patch = Number(patchText);

    if (releaseType === 'major') return `${major + 1}.0.0`;
    if (releaseType === 'minor') return `${major}.${minor + 1}.0`;
    return `${major}.${minor}.${patch + 1}`;
}

function assertVersions(expectedVersion) {
    const manifest = readJson('manifest.json');
    const packageJson = readJson('package.json');
    const packageLock = readJson('package-lock.json');
    const versions = readJson('versions.json');

    if (
        manifest.version !== expectedVersion ||
        packageJson.version !== expectedVersion ||
        packageLock.version !== expectedVersion ||
        packageLock.packages?.['']?.version !== expectedVersion
    ) {
        throw new Error('Version fields do not agree across manifest.json, package.json and package-lock.json');
    }

    if (versions[expectedVersion] !== manifest.minAppVersion) {
        throw new Error(`versions.json does not map ${expectedVersion} to Obsidian ${manifest.minAppVersion}`);
    }
}

function assertReleaseNotes(version) {
    const source = readFileSync(join(projectRoot, 'src', 'releaseNotes.ts'), 'utf8');
    const escaped = version.replace(/\./g, '\\.');
    if (!new RegExp(`version:\\s*['"]${escaped}['"]`).test(source)) {
        throw new Error(`src/releaseNotes.ts has no entry for ${version}`);
    }
}

function assertCleanMain() {
    if (git(['branch', '--show-current'], { capture: true }) !== 'main') {
        throw new Error('Releases must run from the main branch');
    }

    if (git(['status', '--porcelain'], { capture: true })) {
        throw new Error('The worktree must be clean before releasing');
    }

    git(['remote', 'get-url', 'origin'], { capture: true });
    git(['fetch', 'origin', 'main', '--tags'], { capture: true });

    const local = git(['rev-parse', 'HEAD'], { capture: true });
    const remote = git(['rev-parse', 'origin/main'], { capture: true });
    if (local !== remote) throw new Error('Local main must match origin/main before releasing');
}

function assertTagAvailable(version) {
    if (git(['tag', '--list', version], { capture: true })) {
        throw new Error(`Tag ${version} already exists locally`);
    }

    if (git(['ls-remote', '--tags', 'origin', `refs/tags/${version}`, `refs/tags/${version}^{}`], { capture: true })) {
        throw new Error(`Tag ${version} already exists on origin`);
    }
}

function assertReleaseCommit(version) {
    assertVersions(version);

    if (git(['status', '--porcelain'], { capture: true })) {
        throw new Error('npm version left uncommitted changes');
    }

    if (git(['cat-file', '-t', `refs/tags/${version}`], { capture: true }) !== 'tag') {
        throw new Error(`Tag ${version} is not annotated`);
    }

    const taggedCommit = git(['rev-list', '-n', '1', version], { capture: true });
    const head = git(['rev-parse', 'HEAD'], { capture: true });
    if (taggedCommit !== head) throw new Error(`Tag ${version} does not point to the release commit`);

    const changedFiles = git(['show', '--pretty=format:', '--name-only', 'HEAD'], { capture: true }).split('\n').filter(Boolean).sort();
    if (changedFiles.join('\n') !== [...versionFiles].sort().join('\n')) {
        throw new Error(`Release commit changed unexpected files:\n${changedFiles.join('\n')}`);
    }
}

async function readChoice(question) {
    if (!stdin.isTTY || !stdout.isTTY) {
        throw new Error('Interactive input is unavailable. Pass a release type and --yes to release non-interactively');
    }

    const prompt = createInterface({ input: stdin, output: stdout });
    try {
        return (await prompt.question(question)).trim();
    } finally {
        prompt.close();
    }
}

async function selectReleaseType(currentVersion) {
    const versions = {
        patch: nextVersion(currentVersion, 'patch'),
        minor: nextVersion(currentVersion, 'minor'),
        major: nextVersion(currentVersion, 'major')
    };

    console.log(`\nCurrent version: ${currentVersion}\n`);
    console.log('Select release type:');
    console.log(`  1) Patch (${versions.patch}) [default]`);
    console.log(`  2) Minor (${versions.minor})`);
    console.log(`  3) Major (${versions.major})`);

    const choice = (await readChoice('\nEnter choice [1]: ')) || '1';
    if (choice === '1') return 'patch';
    if (choice === '2') return 'minor';
    if (choice === '3') return 'major';
    throw new Error(`Invalid choice: ${choice}`);
}

async function confirmRelease(currentVersion, targetVersion) {
    const answer = (await readChoice(`Release ${currentVersion} -> ${targetVersion} from main? [y/N] `)).toLowerCase();
    return answer === 'y' || answer === 'yes';
}

function printUsage() {
    console.log(`Usage: node scripts/release [patch|minor|major] [--dry-run] [--yes]

Examples:
  node scripts/release
  node scripts/release minor --dry-run

The script requires a clean main branch that matches origin/main. It runs the full
build, uses npm version to create the version commit and annotated bare tag, then
pushes main and that tag to origin atomically.`);
}

async function main() {
    const args = process.argv.slice(2);
    if (args.includes('--help') || args.includes('-h')) {
        printUsage();
        return;
    }

    let releaseType = args.find(argument => !argument.startsWith('--'));
    const unknown = args.filter(argument => argument !== releaseType && !['--dry-run', '--yes'].includes(argument));
    if ((releaseType && !releaseTypes.has(releaseType)) || unknown.length > 0) {
        printUsage();
        process.exitCode = 1;
        return;
    }

    const dryRun = args.includes('--dry-run');
    const packageJson = readJson('package.json');
    const currentVersion = packageJson.version;

    assertVersions(currentVersion);
    const selectedFromMenu = releaseType === undefined;
    releaseType ??= await selectReleaseType(currentVersion);
    const targetVersion = nextVersion(currentVersion, releaseType);
    assertReleaseNotes(targetVersion);
    assertCleanMain();
    assertTagAvailable(targetVersion);

    console.log(`Release ${currentVersion} -> ${targetVersion}`);
    console.log('Release notes, versions, clean main, origin/main and tag availability are valid.');

    if (dryRun) {
        console.log('Dry run complete. No version commit or tag was created.');
        return;
    }

    if (!selectedFromMenu && !args.includes('--yes') && !(await confirmRelease(currentVersion, targetVersion))) {
        console.log('Release cancelled.');
        return;
    }

    run('./scripts/build.sh', []);
    if (git(['status', '--porcelain'], { capture: true })) {
        throw new Error('The build changed tracked files. Commit the generated changes before releasing');
    }

    run('npm', ['version', releaseType]);
    assertReleaseCommit(targetVersion);

    git(['push', '--atomic', 'origin', 'main', `refs/tags/${targetVersion}`]);
    console.log(`Released ${targetVersion}. GitHub Actions will build and publish the release assets.`);
}

main().catch(error => {
    console.error(`Release failed: ${error instanceof Error ? error.message : String(error)}`);
    console.error('Inspect git status, the latest commit and local tags before retrying.');
    process.exitCode = 1;
});
