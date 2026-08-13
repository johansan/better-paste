# Releasing and submitting

Notes for publishing Better Paste and getting it into the community directory.

## Before the first submission

The submission mechanism changed. **There is no longer a pull request to `obsidianmd/obsidian-releases`.** That repository is now downstream of the directory. A bot mirrors `community-plugins.json` into it hourly, and pull requests are disabled. Any guide telling you to fork it is out of date.

Submission is a form at [community.obsidian.md](https://community.obsidian.md), signed in with an **Obsidian account** (not GitHub), with your GitHub account connected so it can verify repository ownership.

### Two things only you can do

- [ ] **Make the repository public.** Review cannot run against a private repo.
- [ ] **Confirm GitHub Sponsors is actually enabled**, or remove `fundingUrl` from `manifest.json`. The guidance is to drop it if you do not take donations.

### Already done

- `manifest.json` uses only the nine allowed keys, and `id`, `name` and `description` are free of the words "obsidian" and "plugin".
- The description satisfies the validator's charset, which permits only `A-Za-z0-9 .,!?'"-`. A colon or an em dash would be rejected, and no local lint catches it — the rule only fires on a filename that no ESLint config block matches.
- `LICENSE` is verbatim GPL-3.0 so GitHub detects it. Anything prepended makes GitHub report `NOASSERTION`, which the scanner flags.
- The README discloses network use, which policy requires for any plugin that makes requests.
- `versions.json` maps `1.0.0` to `minAppVersion` 1.13.0.
- `id` `better-paste` and name "Better Paste" were both free as of 2026-08-12, across 6,602 published plugins.

## Cutting a release

```bash
npm version patch      # or minor / major - updates manifest.json and versions.json
git push --follow-tags
```

The tag must be the bare version with **no `v` prefix**, so `1.0.0` rather than `v1.0.0`. Obsidian resolves releases by exact tag match against `manifest.json`, and `.github/workflows/release.yml` fails the build if the two disagree.

The workflow attaches `main.js`, `manifest.json` and `styles.css` as **three individual files**. Never a zip: Obsidian downloads them by name and does not unpack archives.

Repository → Settings → Actions → Workflow permissions must be **Read and write** for the release to be created.

## Submitting

1. Cut and publish `1.0.0`, then check the release has three separate attachments.
2. Sign in at [community.obsidian.md](https://community.obsidian.md), connect GitHub, then **Plugins → New plugin**. Payment type: Free.
3. Use **Review branch** on the entry page to run a preview scan without needing another release, and clear every **Error**. Warnings do not block.

Submitting early is worth doing: the entry and its id are created at submission, and only errors gate publication. That effectively claims `better-paste` while you finish anything outstanding.

**Get the id right the first time.** It cannot be changed after publication without an admin, and changing it resets the download count and forces every user to reinstall.

## What the automated review checks

Four sections, each rated Error, Warning, Recommendation or Pass. Only errors block.

- **Manifest** covers required keys, no disallowed keys, description format, forbidden words.
- **Releases** covers the tag matching the manifest version, the three assets present individually.
- **Source code** runs the rules in `eslint-plugin-obsidianmd`, which `npm run lint` already runs.
- **Build verification** rebuilds from source and compares against the released `main.js`. It uses the first of `build`, `build:plugin` or `compile` from `package.json`.

The scanner skips a fixed list of paths, which happens to include `tests`, `scripts`, `docs`, `esbuild.config.mjs`, `version-bump.mjs` and `.obsidian`, so the test vault in the repo root is safe.

## Local quality gate

```bash
./scripts/build.sh
```

Runs everything CI runs. It only produces a build when every check passes, then deploys into the repo vault and `~/Notes`.
