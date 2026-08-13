# AI instructions

Last verified against repo: 2026-08-13

## Target environment

- Product type: Obsidian community plugin
- Minimum supported Obsidian: `1.13.1`
- Source of truth for the minimum version: `manifest.json` `minAppVersion`
- Desktop runtime: Electron. Mobile runtime: Capacitor.
- `isDesktopOnly` is `false`, so mobile is a supported target. Do not add Node or Electron imports.

## Quick lookup

- Product overview: `README.md`. Release and submission process: `RELEASE.md`.
- Plugin bootstrap, commands, teardown: `src/main.ts`
- Paste orchestration, clipboard flavour selection, editor writes: `src/paste/PasteService.ts`
- Image download and vault writes: `src/paste/ImageService.ts`
- Image reference detection: `src/paste/imageReferences.ts`
- Per-note frontmatter and cursor context: `src/paste/noteOptions.ts`
- Text rules, all pure functions with no Obsidian import: `src/transforms/*`
- Settings model, defaults, validation: `src/settings/types.ts`, `src/settings/defaults.ts`, `src/settings/normalize.ts`
- Behaviour that is deliberately not configurable: `src/settings/constants.ts`
- Settings UI, one module per page: `src/settings/SettingTab.ts`, `src/settings/pages/*`
- Build, quality gate, local deploy: `scripts/build.sh`, `scripts/build-local.sh`
- Tests: `tests/*`, with `tests/stubs/*` providing the Obsidian and editor doubles

## High-level architecture

- `src/main.ts` owns startup and teardown. It loads settings, constructs `ImageService` and `PasteService`, registers the `editor-paste` handler and four commands, adds the settings tab, and calls `PasteService.dispose()` on unload so an image write still in flight stops touching the editor.
- `PasteService` decides what a paste is before doing anything. Clipboard bitmaps accompanied by an `<img>` tag are saved from the bytes already in hand. Rich HTML is left to Obsidian's own conversion and post-processed afterwards. Plain text is transformed and inserted by the plugin.
- The four text rules are pure functions in `src/transforms/`. They take a settings subset, return a new string, and never touch Obsidian. Almost all test coverage lives here.
- `runTextPipeline` in `src/transforms/index.ts` fixes rule order, and that order is load-bearing in both directions. Invisible characters go first because a no-break space is not whitespace to a regular expression. Punctuation goes last because a hyphen is a list marker.
- Settings are a flat object validated by `normalizeSettings`. Anything with one sensible value is a constant in `src/settings/constants.ts` rather than a setting.
- Shipped reference data, meaning site rules and tracking parameters, lives in code. Only the user's own changes are stored, so a later release still reaches an existing install.
- The settings tab holds no setting rows. It assembles a landing page from the modules in `src/settings/pages/` and bridges control keys onto stored settings.

## Tooling and release

- Run `./scripts/build.sh` after every change. It must finish with every check passing. A warning is treated as fatal.
- The gate runs ESLint with the official Obsidian plugin rules, Stylelint, markdownlint, TypeScript, Vitest, Prettier and knip, then builds and deploys into the repo vault and `~/Notes`.
- CI runs the same script, so a green local run means a green build.
- Version numbers in `manifest.json`, `package.json` and `versions.json` are release-managed through `npm version`. Do not edit them by hand.
- `icon.svg` is a branding asset for the README and the listing. Nothing imports it.

## Obsidian CLI debugging

- The CLI requires Obsidian to be running. Plugin id: `better-paste`.
- Deploy first with `./scripts/build.sh`, then `obsidian plugin:reload id=better-paste`.
- Useful for verifying behaviour end to end: `obsidian create name="T" content="" overwrite open`, then `obsidian command id=better-paste:paste-processed`, then `obsidian read path="T.md"`.
- Set the clipboard with `pbcopy` before invoking a paste command.
- `obsidian devtools` opens the console. Prefer `console.warn` and `console.error`; the lint config forbids `console.log`.
- Accessibility permission is not granted to the terminal on this machine, so `osascript` cannot send keystrokes. A real Cmd+V cannot be triggered. Verify paste behaviour with the commands above, or with unit tests against `tests/stubs/editor.ts`.

## Implementation rules

- Keep the text rules free of Obsidian imports. A new rule belongs in `src/transforms/`, not in the paste handling.
- A setting needs a defensible opposite state. If one value is always right, make it a constant. The plugin deliberately has few settings.
- Reference data belongs in code, not in stored settings, so updates reach existing installs.
- Keep static styles in `styles.css` and use Obsidian CSS variables. No inline styles, no `!important`, no `:has(...)`.
- Use `createEl`, `createDiv`, `createSpan` and `createFragment` rather than `document.createElement`. Never use `innerHTML`.
- Use `window.setTimeout` and `window.clearTimeout` for popout compatibility.
- Add the GPL header when creating a new source file.
- UI text is sentence case. Settings headings must not contain the words "settings" or "options".

## Engineering policy

### Architecture

- Prefer simple solutions and existing modules over new helper files.
- Prefer a small amount of obvious duplication over an abstraction that makes local behaviour harder to read.
- Remove deprecated code rather than keeping compatibility shims. This plugin has no released users to migrate, so migration code is speculative complexity.
- Do not add defensive code for scenarios that cannot occur.

### Investigation and fixes

- Confirm the cause before changing behaviour.
- Do not assume an issue is fixed until it has been tested, in the app where possible.
- Anything asynchronous that edits the editor must survive the user typing during the wait, and must stop after `dispose()`.

### Safety and typing

- Use type guards rather than assertions for Obsidian types.
- Avoid `any`. Use `unknown` at boundaries and narrow it.
- Write vault files through the Vault API. Resolve attachment paths with `fileManager.getAvailablePathForAttachment`.

## Writing style

- **Never use an em dash or an en dash**, in code comments, documentation, commit messages, release notes or replies. Rewrite the sentence instead. Use a comma, a colon, a full stop, or parentheses. This applies to the plugin's own output as well, which is the point of the punctuation rule it ships.
- Write what something does, not why it is good.
- Omit benefit language, subjective adjectives and unmeasured performance claims.
- Comments describe behaviour or usage, not change history.
- Commit messages are plain prose that sound like a person wrote them.

### Explanatory comments

- Comment a non-obvious contract, invariant, ordering constraint, fallback, cancellation path, platform quirk or data-loss safeguard.
- Comment decisions and guarantees, not syntax. State the condition being handled and the concrete failure that would occur otherwise.
- Assume a future maintainer may simplify or reorder the code. Write the comment that explains what would break.
- Use causal language such as because, so, otherwise, before, after and without.
- Do not comment obvious operations or paraphrase identifiers.

## Repository workflow

- Pull requests from outside contributors are not accepted and are closed automatically.
- Commit and push only when asked.
