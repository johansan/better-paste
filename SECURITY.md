# Security policy

## Reporting a vulnerability

Please report security issues privately through GitHub's [security advisory form](https://github.com/johansan/better-paste/security/advisories/new) rather than opening a public issue.

## What this plugin does with your data

Better Paste handles clipboard content, which is often sensitive. What it does with it:

- **No clipboard content or usage data is sent to the author.** There is no telemetry, no analytics and no server belonging to this plugin. The network requests described below go only to the host named by pasted content or to the repository serving dialog artwork.
- **Network requests are limited to pasted content and dialog artwork.** The plugin downloads images referenced by pasted content when image saving is on. When optional link title fetching is on, it also fetches a pasted standalone web address to read its HTML title. Welcome and release-notes dialogs load their artwork from the plugin repository when they are shown. The welcome dialog opens automatically on first enable, and release notes can open automatically after an update.
- **Downloaded images are written into your vault**, to the attachment location Obsidian is configured to use.
- **Clipboard content is never stored.** It is transformed in memory during the paste and not retained; the plugin keeps no history.
- **Settings are stored in your vault**, in `.obsidian/plugins/better-paste/data.json`.

## Things worth knowing

- A remote image download or page title request reveals your IP address to the host, exactly as opening the address would. Turn off image saving or link title fetching if that matters for a particular vault.
- The plugin does not run any code it downloads. Downloaded bytes are only ever written to a file.
- Pasting into a note that carries `better-paste: false` in its frontmatter is left entirely alone.
