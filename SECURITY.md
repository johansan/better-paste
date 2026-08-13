# Security policy

## Reporting a vulnerability

Please report security issues privately through GitHub's [security advisory form](https://github.com/johansan/better-paste/security/advisories/new) rather than opening a public issue.

## What this plugin does with your data

Better Paste handles clipboard content, which is often sensitive. What it does with it:

- **No clipboard content or usage data is sent anywhere.** There is no telemetry, no analytics and no server belonging to this plugin.
- **Network requests are limited to pictures.** The plugin downloads images referenced by pasted content when image saving is on. Welcome and release-notes dialogs also load their artwork from the plugin repository when they are shown. The welcome dialog opens automatically on first enable, and release notes can open automatically after an update.
- **Downloaded images are written into your vault**, to the attachment location Obsidian is configured to use.
- **Clipboard content is never stored.** It is transformed in memory during the paste and not retained; the plugin keeps no history.
- **Settings are stored in your vault**, in `.obsidian/plugins/better-paste/data.json`.

## Things worth knowing

- A remote image download reveals your IP address to the host serving that image, exactly as opening the page would. Turn off image saving if that matters for a particular vault.
- The plugin does not run any code it downloads. Downloaded bytes are only ever written to a file.
- Pasting into a note that carries `better-paste: false` in its frontmatter is left entirely alone.
