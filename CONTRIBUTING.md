# Contributing

Thank you for taking an interest in Better Paste.

## Bug reports

The most useful bug report for this plugin is one that shows **what was on the clipboard**, because almost every problem comes down to which flavour was picked or how it was parsed.

Open <https://dynalist.io/clipboard> in the browser you copied from, paste there, and include what it prints. That page lists every type on the clipboard along with a preview, which is usually enough to identify the cause immediately.

Also say which app you copied from, what you expected, and what you got.

## Pull requests

Run the quality gate before opening one:

```bash
./scripts/build.sh
```

It runs ESLint (including the Obsidian plugin rules), Stylelint, markdownlint, TypeScript, the test suite, Prettier and a dead-code check, and only builds if every one of them passes. CI runs the same script, so a green local run means a green build.

A few conventions worth knowing:

- **The text rules are pure functions.** Everything under `src/transforms/` has no Obsidian import and is unit tested directly. New rules belong there, not in the paste handling.
- **A setting needs a defensible opposite state.** If one value is always right, make it a constant in `src/settings/constants.ts` instead. The plugin deliberately has few settings.
- **Reference data lives in code, not in settings.** Shipped site rules and tracking parameters are constants; only the user's own changes are stored, so updates reach existing installs.
- **Comments explain why, not what.**

## Running it locally

```bash
npm install
npm run dev
```

The repository root is itself an Obsidian vault, so a build deploys straight into it. `scripts/build-local.sh` also copies into `~/Notes` when that vault exists.

## Licence

Contributions are accepted under the GPL-3.0-or-later licence that covers the project.
