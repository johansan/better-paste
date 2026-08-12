# Better Paste

An Obsidian plugin that cleans up content on its way into your notes.

Three rules, each independently configurable and each able to be turned off:

1. **Images** — when the clipboard describes a picture by link rather than by bitmap, as Safari does, download it into the vault and embed the local copy.
2. **URLs** — strip tracking parameters from pasted links, with per-site exceptions for the sites where parameters actually matter.
3. **Terminal text** — rejoin paragraphs that a terminal hard wrapped at its window width and drop the indentation it added.

## What it looks like

**Terminal output.** Copying from a terminal gives you the terminal's line breaks, not yours:

```
 I'll remove the extra debate confirmation, then trace the menu's main keyboard flows for other small, low-risk friction points. I'll
  keep destructive actions explicit and verify the interaction behavior with the existing tests or a focused harness.

• The extra step is isolated to the list's Enter handler, so the core change is straightforward. While tracing adjacent flows, I found
  two likely friction points worth validating: selection can jump after the 20-second refresh, and pasted Discord items require the
  uncommon Ctrl-D shortcut to save.
```

pastes as:

```
I'll remove the extra debate confirmation, then trace the menu's main keyboard flows for other small, low-risk friction points. I'll keep destructive actions explicit and verify the interaction behavior with the existing tests or a focused harness.

• The extra step is isolated to the list's Enter handler, so the core change is straightforward. While tracing adjacent flows, I found two likely friction points worth validating: selection can jump after the 20-second refresh, and pasted Discord items require the uncommon Ctrl-D shortcut to save.
```

**URLs.** A link out of a newsletter:

```
https://support.claude.com/en/articles/16266773-how-claude-marks-ai-generated-content?utm_source=www.therundown.ai&utm_medium=newsletter&utm_campaign=anthropic-slips-an-invisible-signature-into-claude&_bhlid=5860aad7a9737cf115b5ac231b92ca3147d16877
```

pastes as:

```
https://support.claude.com/en/articles/16266773-how-claude-marks-ai-generated-content
```

**Images.** Copy a region of a Safari page and the images arrive as `https://` links. Better Paste downloads them and leaves `![[picture.png]]` behind, so the note still works offline and survives the source site going away.

## Installing

Better Paste requires Obsidian 1.13.0 or later.

Until it is in the community plugin browser, install it manually: download `main.js`, `manifest.json` and `styles.css` from a release into `<vault>/.obsidian/plugins/better-paste/`, then enable it under Settings → Community plugins.

## How it decides what to do

Better Paste hooks Obsidian's paste event and looks at what the clipboard actually holds.

| Clipboard holds                                                | What happens                                                                                                               |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Bitmap data **and** an `<img>` tag, from Safari's "Copy image" | Better Paste saves the bitmap it already has; Obsidian on its own prefers the HTML and leaves an external link             |
| Bitmap data alone, such as a screenshot                        | Left to Obsidian, which already saves it using your attachment settings                                                    |
| Rich content (HTML)                                            | Obsidian converts it to Markdown as usual, then Better Paste cleans the URLs and downloads the images in what was inserted |
| A styled terminal dump (`<pre>` with no links or images)       | Treated as plain text, so the terminal rule applies                                                                        |
| Plain text                                                     | Better Paste transforms it and inserts the result itself                                                                   |

Safari's "Copy image" is the case worth calling out. It puts _both_ the decoded bitmap and an `<img>` tag on the clipboard, and Obsidian picks the HTML — so the note ends up pointing at the website instead of holding the picture. Better Paste uses the bytes that are already there, so nothing is downloaded at all. The file is still named after the original picture (`gaia-2026-talk.png` rather than Safari's generic `image.png`), while the extension comes from the actual bitmap, which is why a page's `.webp` correctly lands as a `.png`.

Rich content is deliberately left to Obsidian's own HTML-to-Markdown conversion rather than reimplemented; Better Paste only post-processes the result.

When a download fails or times out, the original link stays in the note. Nothing is lost, and a notice tells you what happened.

## Commands

| Command                     | What it does                                                                                   |
| --------------------------- | ---------------------------------------------------------------------------------------------- |
| Paste and clean up          | Pastes the clipboard's plain text through the rules, whether or not automatic processing is on |
| Paste without processing    | Pastes the clipboard's plain text verbatim                                                     |
| Clean up selection          | Applies the text rules to what you have selected                                               |
| Toggle automatic processing | Flips the master switch, handy on a hotkey                                                     |

None of these are bound to a key by default. Assign them under Settings → Hotkeys.

## Settings

### Pasting

- **Process pasted content automatically** — apply the rules on every paste. Turn it off to use the commands only.
- **Show a notice after each paste** — a one-line summary of what changed.

### Images and rich content

- **Save pasted images into the vault** — the master switch for image handling.
- **Download linked images** / **Save inline images** / **Treat a pasted image URL as an image** — which sources are picked up: `http(s)` links in rich content, `data:` URIs, and bare image URLs pasted on their own.
- **Save images to** — follow the vault's own attachment setting, or a specific folder.
- **Filename** — a template. `{{name}}` (from the URL), `{{host}}`, `{{date}}`, `{{time}}`, `{{timestamp}}`. The extension is added for you.
- **Maximum image size** and **Download timeout** — anything over the limit is left as a link.
- **Image width property** — the frontmatter property that sets how wide images are in a note. See below.
- **Image file types** — the extensions accepted as images.

#### Sizing images per note

Some notes want every image at the same width. Put the property in the note's frontmatter and Better Paste embeds pasted images at that size:

```yaml
---
image-width: 400
---
```

Images pasted into that note come out as `![[picture.png|400]]`, which is Obsidian's own size syntax — the same thing you would get by typing the width by hand. Markdown-link vaults get `![400](picture.png)` instead; both render identically.

The value can be a width (`400`) or a width and height (`400x300`). A value Obsidian cannot use, such as `50%`, is ignored rather than written into the link. Rename the property under **Image width property**, or blank that setting to switch the feature off.

The property is read from the note as it currently stands in the editor, not from Obsidian's metadata cache, so a width you just typed applies to the very next paste.

One consequence worth knowing: a note with this property also takes screenshot pastes away from Obsidian's own handler, since that handler has no way to apply the width. Notes without the property are untouched, and screenshots there keep going through Obsidian as usual.

### URL cleaning

**Parameters to remove** chooses the strategy:

- **All parameters, except the exceptions below** (the default) removes everything after `?`. This is thorough, and relies on the site exceptions to keep working links working.
- **Only known tracking parameters** removes just the names in the tracking list, leaving everything else alone.

**Site exceptions** is the list that makes strip-everything safe. One rule per line:

```
youtube.com: v, t, list, index, start
news.ycombinator.com: id
gitlab.com
```

A rule with parameters keeps only those. A bare domain keeps all of them. Subdomains are matched automatically, so `wikipedia.org` also covers `en.wikipedia.org`. Lines starting with `#` are comments.

The shipped list covers YouTube, Vimeo, Hacker News, Google search and maps, Zoom passwords, Dropbox share keys, Figma node IDs and others. Add your own; the button below the list puts the defaults back.

Also here: **Always keep these parameters** (a global allow list, `*` wildcards accepted), **Remove highlight links** (drops the `:~:text=` fragment browsers add when you copy a link to selected text), **Remove all anchors**, and **Remove trailing slash**.

**Try it** cleans a URL live so you can check a rule without leaving settings.

### Terminal text

- **Rejoin wrapped lines** — the core of the rule. Headings, list items, tables, blockquotes and code blocks are never merged into the line above.
- **Only rejoin indented lines** (on by default) — a line only continues the paragraph above when it is indented further than the line that started it. This is what keeps ordinary multi-line text safe. Turning it off rejoins any line that follows a long one, which is more aggressive.
- **Minimum line length** — a line only counts as wrapped when the line above it is at least this long, on the theory that a short line ended because the writer ended it.
- **Remove leading indentation**, **Remove colour codes** (ANSI escapes), **Collapse blank lines**, **Trim trailing spaces**, **Preserve code blocks**.
- **Bullets** — leave characters like `•` alone, or convert them to Markdown list items.
- **List markers** — the characters that start a list item.

**Try it** shows the cleaned result as you type.

## Development

```bash
npm install
npm run dev     # watch build, deployed into this repo's own vault
npm run build   # type-check and production build
npm test        # vitest
npm run lint
```

The repository root doubles as an Obsidian test vault: every build copies `main.js`, `manifest.json` and `styles.css` into `.obsidian/plugins/better-paste/`, so `Reload app without saving` picks up your changes.

The text rules are pure functions in `src/transforms/` with no Obsidian dependency, which is where most of the test coverage sits. `src/paste/` holds the clipboard handling and the vault writes.

## License

GPL-3.0-or-later. See [LICENSE](LICENSE).
