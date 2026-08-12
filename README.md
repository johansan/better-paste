# Better Paste

An Obsidian plugin that cleans up content on its way into your notes.

The only network access is downloading a picture that pasted content linked to, so the note holds the image rather than a link to someone else's server. There is no telemetry and no server behind this plugin. See [Network use and privacy](#network-use-and-privacy).

Four rules, each independently configurable and each able to be turned off:

1. **Images** — when the clipboard describes a picture by link rather than by bitmap, as Safari does, download it into the vault and embed the local copy.
2. **URLs** — strip tracking parameters from pasted links, with per-site exceptions for the sites where parameters actually matter.
3. **Terminal text** — rejoin paragraphs that a terminal hard wrapped at its window width and drop the indentation it added.
4. **AI text** — turn the typographic punctuation that AI assistants produce into plain hyphens and straight quotes, and strip the invisible characters that come with it.

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

**AI text.** `“The result — which nobody expected — was fine,” he said.` becomes `"The result - which nobody expected - was fine," he said.` — dashes to hyphens, curly quotes to straight, and any no-break or zero-width characters that came along are gone.

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

## Network use and privacy

Better Paste makes network requests in exactly one situation, and it is worth being precise about it.

**What it does.** When you paste content that references a picture by http(s) address — a Safari page selection, a Markdown image link, a bare link ending in `.png` — the plugin downloads that picture so the note holds a local copy instead of a link to somebody else's server. The request goes to the address the pasted content named, using Obsidian's own `requestUrl`, and nothing else is fetched.

**What it never does.**

- No telemetry, no analytics, no crash reporting, no usage counting.
- No server belonging to this plugin. There isn't one.
- Nothing is fetched at startup, in the background, or on a timer. A request only ever happens as the direct result of a paste you made.
- No code is downloaded or executed. Downloaded bytes are only ever written to a file, and only when the response is a recognised image type.
- Your clipboard is never transmitted. It is transformed in memory and not retained; the plugin keeps no history.

**What is stored.** Downloaded pictures go to the attachment location your vault is configured to use. Settings live in `.obsidian/plugins/better-paste/data.json`. Nothing leaves the vault.

**Worth knowing.** Downloading an image reveals your IP address to whoever serves it, exactly as visiting the page would. Turn off **Save pasted images into the vault** if that matters for a given vault, and pictures already on the clipboard will still be saved, since saving those touches no network at all.

## Why a plugin and not a Mac app

A menu bar app would clean every paste in every application, which sounds like the better product. It was investigated properly and rejected, for one reason: **a plugin knows where the paste is going, and an app does not.** Every rule here is better for knowing.

Consider what saving an image actually involves. Better Paste uses the bitmap but names it from the HTML source URL, files it wherever _this vault_ keeps attachments — which can mean "beside this note" or "in a subfolder under this note" — resolves the path _relative to the note being edited_, picks wikilink or Markdown syntax to match the vault's setting, reads _this note's_ frontmatter for a width, and replaces the exact pasted range once the write finishes.

None of that is available to an app with no vault, no note and no cursor. Ask what "save the image" should do when pasting into Mail, Word or Finder and there is no answer that is right in more than one of them. The most a menu bar app can manage is "prefer the bitmap when the clipboard offers both", which is one line of the feature above.

The same asymmetry runs through the text rules, and there it prevents damage rather than merely enabling a feature:

- **Pasting into a fenced code block is left alone.** Putting terminal output inside a fence is an act of preservation, so rejoining its lines there would destroy exactly what you were protecting. That check reads the document around the cursor. An app cannot see it, and would silently corrupt the paste.
- **A note can opt out entirely** with `better-paste: false`, and set its own image width. Both are per-document decisions with no equivalent outside a document.
- **Rich content stays Obsidian's job.** The plugin lets Obsidian convert HTML to Markdown and then post-processes the inserted range. An app would have to reimplement that conversion, worse.
- **One paste is one undo.** The plugin edits through the editor, so the cleaned result is a normal editing step.

There is also a plain cost difference. The plugin needs no permissions. A global paste interceptor needs Input Monitoring and the ability to post events, and on current macOS a further grant to read the clipboard programmatically — and Secure Input Mode switches all of it off, without warning, whenever a password field is focused anywhere on the system.

Better Paste trades reach for control, deliberately. It works in one application and knows everything about what happens there.

## Commands

| Command                  | What it does                                                                                   |
| ------------------------ | ---------------------------------------------------------------------------------------------- |
| Paste and clean up       | Pastes the clipboard's plain text through the rules, whether or not automatic processing is on |
| Paste without processing | Pastes the clipboard's plain text verbatim                                                     |
| Clean up selection       | Applies the text rules to what you have selected                                               |
| Toggle Better Paste      | Flips the master switch, handy on a hotkey                                                     |

None of these are bound to a key by default. Assign them under Settings → Hotkeys.

## Settings

Sixteen settings, arranged as a landing page with three sub-pages. Everything that had only one sensible answer is now simply how the plugin behaves, rather than a question you have to answer.

### Pasting

- **Clean up every paste** — apply the rules whenever you paste. Turn it off to use the commands only.
- **Trim space around the paste** — drop the blank lines and stray spaces that come with text copied from a web page or a PDF. Only the ends; the middle is left alone. On by default.
- **Show a notice when a paste is changed** — a one-line summary. Failures are reported whatever this is set to.

### Images

On the landing page: one toggle. Saved pictures go wherever the vault files attachments, which is Obsidian's own setting under Files and links — the plugin does not add a second place to answer that.

Behind **Image options**:

- **File names** — a name from the source, a name and date, or a date and time.
- **Paste an image link as the picture** — pasting a link ending in `.png` or `.jpg` saves that picture and shows it. Switch off to keep such a link as a link.
- **Image width property** — see below.

### Links

On the landing page: the master toggle and **Which parameters to remove** — every parameter except where a site rule keeps it, or only the parameters known to be tracking.

Behind **Site rules**: the full list, plus a live tester.

```
youtube.com | v, t, list, index, start     keep only these parameters
gitlab.com                                 keep every parameter
google.* | q, tbm, hl                      the site on any top-level domain
mine.example | id                          your own rule
```

Thirty-three sites are filled in to start with — YouTube video IDs, Hacker News item IDs, Zoom passwords, Dropbox share keys, Figma node IDs and so on. Edit any of them, delete the ones you disagree with, add your own. A line that is not a site name is flagged as you type.

Subdomains need no wildcard: `example.com` already covers `shop.example.com`, and `*.example.com` is accepted as the same thing. A trailing `.*` is the one that adds something — `google.*` matches `google.com`, `google.se` and `google.co.uk` with one rule, which is why a Google search keeps its `?q=` whichever country domain you are on.

Only your _changes_ are saved rather than the whole list, so a site added in a later release still reaches you after you have edited it.

A site rule is a whitelist in **every parameter** mode. In **only tracking** mode it can only ever rescue a parameter, never remove one — if you chose the cautious mode, an unfamiliar parameter survives.

### Terminal text

On the landing page: the master toggle. Behind **Terminal options**:

- **How eagerly to rejoin lines** — _Cautious_ only rejoins a line indented under the one above, which is what most terminals do and what keeps ordinary multi-line text safe. _Eager_ rejoins any line that follows a full one; use it for tools that wrap without indenting, such as `git log`.
- **Bullets** — leave `•` alone, or convert it to a real Markdown list item that folds and indents.
- A live tester.

The wrap column is worked out from the text itself. A terminal breaks every long line at the same place, so wrapped lines cluster just below it; when several lines sit near the longest, that length is the wrap column. Fenced code is excluded from the measurement, so a long line in a log dump does not stop the prose around it from being rejoined. This used to be a setting, which asked you to know how wide your terminal window was when you copied.

### AI cleanup

- **Clean up AI text** — assistants produce characters that look ordinary but are not, and they survive a copy and paste. A no-break space becomes a normal space; zero-width characters are dropped. The same characters are cleaned up whatever wrote them.
- **Use plain punctuation** — `—` and `–` become `-`, and `“ ” ‘ ’` become `"` and `'`. Straight quotes also survive code and search better than curly ones. A matter of taste rather than tidiness, so switch it off if you set your punctuation on purpose.

Several invisible characters are deliberately kept, because they are load-bearing rather than junk: the zero-width joiner holds a multi-part emoji together, the joiner and non-joiner are ordinary content in Persian, Arabic and the Indic scripts, the direction marks and isolates are what make mixed Arabic or Hebrew and Latin text render in the right order, and the ideographic space is the normal word space in CJK. Removing any of them would corrupt text rather than tidy it.

The two halves of this rule run on either side of the terminal rule. Invisible characters go first, because a no-break space is not whitespace to a regular expression and would defeat the blank-line detection. Dashes go last, because a hyphen is a list marker: converting one early would make the terminal rule read that line as a bullet and refuse to rejoin the paragraph.

## Per-note control

Two frontmatter properties change what happens in a single note.

**Leave a note alone entirely:**

```yaml
---
better-paste: false
---
```

Nothing is touched in that note. `off`, `no` and `0` work too. This is for notes that are deliberately verbatim — logs, transcripts, scratchpads. The commands still work if you invoke one by name: asking for the rules explicitly overrides the property.

**Set the width of pasted images:**

```yaml
---
image-width: 400
---
```

Images pasted into that note come out as `![[picture.png|400]]`, which is Obsidian's own size syntax — the same thing you would get by typing the width by hand. Markdown-link vaults get `![400](picture.png)` instead; both render identically. The value can be a width (`400`) or a width and height (`400x300`). A value Obsidian cannot use, such as `50%`, is ignored rather than written into the link.

Both properties are read from the note as it stands in the editor, not from Obsidian's metadata cache, so a property you just typed applies to the very next paste.

One consequence worth knowing: a note with `image-width` also takes screenshot pastes away from Obsidian's own handler, since that handler has no way to apply the width. Notes without it are untouched.

## What is not a setting

A paste is left alone when the cursor sits inside a fenced code block or the frontmatter block. Pasting terminal output into a fence is an act of preservation, so rejoining its lines there would destroy the thing you were protecting.

These behaviors have one sensible value and are simply how the plugin works: escape sequences and stray control characters are stripped from terminal output, the shared indentation is removed, runs of blank lines collapse, trailing spaces go, fenced code is never rejoined, images embedded in the clipboard as `data:` URIs are always saved, images over 50 MB or slower than 30 seconds are left as links, and scroll-to-text `#:~:text=` fragments are dropped from links while real anchors are kept.

## Development

```bash
npm install
npm run dev     # watch build, deployed into this repo's own vault
npm run build   # type-check and production build
npm test        # vitest
npm run lint
```

The repository root doubles as an Obsidian test vault: every build copies `main.js`, `manifest.json` and `styles.css` into `.obsidian/plugins/better-paste/`, so `Reload app without saving` picks up your changes.

The text rules are pure functions in `src/transforms/` with no Obsidian dependency, which is where most of the test coverage sits. `src/paste/` holds the clipboard handling and the vault writes. Each settings page is one module under `src/settings/pages/`; `SettingTab.ts` holds no setting rows itself, only the landing-page assembly and the bridge onto stored settings.

## License

GPL-3.0-or-later. See [LICENSE](LICENSE).
