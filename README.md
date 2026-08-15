# ![Better Paste](https://raw.githubusercontent.com/johansan/better-paste/main/images/welcome.gif)

Stop fixing formatting manually after every paste. Better Paste resolves common clipboard issues before they reach your Obsidian vault. It finally lets you copy images from Safari directly into your vault, strips tracking parameters from URLs, fetches page titles, rejoins broken lines in terminal output, and removes invisible characters and curly quotes from AI text. Just paste, and the plugin handles the rest.

If you find Better Paste useful, please consider [☕️ Buying me a coffee](https://buymeacoffee.com/johansan) or [Sponsor on GitHub ❤️](https://github.com/sponsors/johansan).

<br/>

## 1 Installation

1. **Install Obsidian** if you have not already, from [obsidian.md](https://obsidian.md/)
2. **Enable community plugins** in Settings, Community plugins, Turn on community plugins
3. **Install Better Paste** by clicking Browse, searching for "Better Paste", then Install

<br/>

## 2 How it works

Copy, paste, and this is what reaches the note. Every rule can be turned off on its own, and [section 3](#3-settings-in-detail) covers each one in full.

### 2.1 Images from Safari

Safari's "Copy image" puts the picture and its web address on the clipboard. Pasted into Obsidian on its own, the address wins and the note points at the website:

```
![](https://images.example.com/2026/05/skyline-8f21a.jpg?auto=format&w=2400)
```

Pasted with Better Paste, which saves the bytes that were already on the clipboard:

```
![[skyline-8f21a.jpg]]
```

### 2.2 Tracking parameters

Copied out of a newsletter:

```
https://www.theverge.com/2026/1/9/story?utm_source=newsletter&utm_medium=email&fbclid=IwAR2x9
```

Pasted:

```
https://www.theverge.com/2026/1/9/story
```

### 2.3 Link titles

Copied from the address bar:

```
https://obsidian.md
```

Pasted, after the title arrives:

```
[Obsidian - Sharpen your thinking](https://obsidian.md)
```

### 2.4 Terminal output

Copied from a terminal, which broke the line at its window width:

```
npm warn deprecated inflight@1.0.6: This module is not supported and leaks memory. Do
  not use it. Check out lru-cache instead.
```

Pasted:

```
npm warn deprecated inflight@1.0.6: This module is not supported and leaks memory. Do not use it. Check out lru-cache instead.
```

### 2.5 AI text

Copied from a chatbot:

```
“It works,” she said — finally.
```

Pasted:

```
"It works," she said - finally.
```

The invisible characters that travel with chatbot text go at the same time, which [section 3.5](#35-text-processing) shows in full.

### 2.6 Commas and quotes

Copied from anywhere that puts the comma inside the quotation mark:

```
She called it "finished," then left.
```

Pasted, with **Commas and quotes** set to outside:

```
She called it "finished", then left.
```

<br/>

## 3 Settings in detail

Eighteen settings, arranged as a landing page with three sub pages. Anything with only one sensible answer is simply how the plugin behaves, rather than a question you have to answer.

### 3.1 Behavior

- **Clean up every paste** applies the rules whenever you paste. Turn it off to use the commands only, or to clean nothing but the notes that ask for it with `bp: true`. See [section 4](#4-per-note-control).
- **Show a notice when a paste is changed** gives a one line summary. Failures are reported whatever this is set to.

### 3.2 Images

**Save pasted images into the vault** covers Safari's "Copy image", pictures inside copied web content, and standalone image addresses. Saved pictures go wherever the vault files attachments, which is Obsidian's own setting under Files and links. The plugin does not add a second place to answer that.

The address decides the file name, including the address in the `<img>` tag that comes with Safari's "Copy image", so a picture saved from Safari is not called `image.png`. Everything before the last slash and everything after the question mark is dropped:

```
https://images.example.com/2026/05/skyline-8f21a.jpg?auto=format&w=2400
```

is saved as `skyline-8f21a.jpg` and embedded as `![[skyline-8f21a.jpg]]`.

- **File names** uses the source name or a custom format. A custom format can combine `{{name}}` with Moment date syntax, so `{{name}}-YYYY-MM-DD` saves the picture above as `skyline-8f21a-2026-08-13.jpg`. The setting shows the resulting filename below the field.

The width of a pasted image is set per note rather than here. See [section 3.6](#36-frontmatter) and [section 4](#4-per-note-control).

Alt text survives the download. A copied web page that contained

```
![Harbour at dusk](https://images.example.com/2026/05/skyline-8f21a.jpg)
```

becomes

```
![[skyline-8f21a.jpg|Harbour at dusk]]
```

and if the note also sets a width, the embed carries both as `![[skyline-8f21a.jpg|Harbour at dusk|400]]`.

When a download fails or times out, the original link stays in the note. Nothing is lost, and a notice says what happened.

### 3.3 Links

**Fetch titles for pasted links** turns a clipboard containing one non-image web address into a Markdown link using the page title. The address is pasted immediately and replaced when the title arrives, so nothing blocks while the request runs. When other text is selected, that text becomes the link label without making a request. It is on by default. Addresses inside prose and links that already carry their own label are left alone.

A title that is only the site's own brand name is rejected, because it says nothing the address did not already say. A story on `reddit.com` whose page title comes back as "Reddit" is left as the plain address rather than becoming a link labelled with the site name.

**Clean pasted links** removes the parameters. **Which parameters to remove** chooses between every parameter except where a site rule keeps it, and only the parameters known to be tracking.

Six links, pasted as one block, in the default **every parameter** mode:

```
https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLxAbC123&si=8f2a1c&utm_source=share&t=42
https://www.amazon.com/dp/B0CHX1W1XY/ref=sr_1_3?crid=2ABCDE&keywords=usb+hub&qid=1735689600&sr=8-3
https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT?si=8a1b2c3d4e5f
https://www.google.co.uk/search?q=obsidian+plugins&client=safari&sca_esv=9f1&sourceid=chrome
https://news.ycombinator.com/item?id=42315901&utm_medium=email
https://en.wikipedia.org/wiki/Obsidian#Formation:~:text=Obsidian%20is%20produced
```

come out as

```
https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLxAbC123&t=42
https://www.amazon.com/dp/B0CHX1W1XY/ref=sr_1_3
https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT
https://www.google.co.uk/search?q=obsidian+plugins
https://news.ycombinator.com/item?id=42315901
https://en.wikipedia.org/wiki/Obsidian#Formation
```

The video ID, the playlist, the timestamp, the search term and the Hacker News item ID survive because site rules keep them. The scroll to text fragment at the end of the Wikipedia link is dropped while the real `#Formation` anchor is kept. `google.co.uk` is covered by the same rule as `google.com`.

The same six links in **only tracking** mode:

```
https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLxAbC123&si=8f2a1c&t=42
https://www.amazon.com/dp/B0CHX1W1XY/ref=sr_1_3?crid=2ABCDE&keywords=usb+hub&qid=1735689600&sr=8-3
https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT?si=8a1b2c3d4e5f
https://www.google.co.uk/search?q=obsidian+plugins&client=safari&sca_esv=9f1&sourceid=chrome
https://news.ycombinator.com/item?id=42315901
https://en.wikipedia.org/wiki/Obsidian#Formation
```

Only `utm_medium` was a known tracking name, so only it and the text fragment went. Everything unfamiliar survives, which is the point of the cautious mode.

Behind **Site rules**, the full rule list and a live tester:

```
youtube.com | v, t, list, index, start     keep only these parameters
gitlab.com                                 keep every parameter
google.* | q, tbm, hl                      the site on any top-level domain
mine.example | id                          your own rule
```

Thirty three sites are filled in to start with, covering YouTube video IDs, Hacker News item IDs, Zoom passwords, Dropbox share keys, Figma node IDs and others. Edit any of them, delete the ones you disagree with, add your own. A line that is not a site name is flagged as you type.

Subdomains need no wildcard. `example.com` already covers `shop.example.com`, and `*.example.com` is accepted as the same thing. A trailing `.*` is the one that adds something: `google.*` matches `google.com`, `google.se` and `google.co.uk` with one rule, which is why a Google search keeps its `?q=` whichever country domain you are on.

Only your changes are saved rather than the whole list, so a site added in a later release still reaches you after you have edited it.

A site rule is a whitelist in **every parameter** mode. In **only tracking** mode it can only ever rescue a parameter, never remove one, so an unfamiliar parameter survives if you chose the cautious mode.

### 3.4 Terminal text

**Clean up terminal output** strips escape sequences, removes the shared indentation, and rejoins the paragraphs a terminal broke at its window width. Here is a whole `npm install` tail, copied as it appeared on screen:

```
npm warn deprecated inflight@1.0.6: This module is not supported and leaks memory. Do
  not use it. Check out lru-cache if you want a tested way to coalesce async requests.


added 412 packages, and audited 413 packages in 6s

• 52 packages are looking for funding
• 3 moderate severity vulnerabilities were found in the dependency tree, and two of
  them are fixed by running npm audit fix.
```

pasted:

```
npm warn deprecated inflight@1.0.6: This module is not supported and leaks memory. Do not use it. Check out lru-cache if you want a tested way to coalesce async requests.

added 412 packages, and audited 413 packages in 6s

- 52 packages are looking for funding
- 3 moderate severity vulnerabilities were found in the dependency tree, and two of them are fixed by running npm audit fix.
```

Both wrapped paragraphs are back on one line, the run of blank lines collapsed to one, the trailing blank line went, and the `•` bullets became Markdown list items that fold and indent like any other list. The `added 412 packages` line was never wrapped, so it was left exactly as it was.

Behind **Terminal text handling**:

- **When to rejoin a broken line** offers three levels.
- **Bullet characters** converts `•` to a real Markdown list item, or leaves the original character alone.
- A live tester.

_Only when the line is indented_ is the default. It is what most terminals do, and it keeps ordinary multi line text safe. _Whether or not the line is indented_ suits tools that wrap without indenting, which the default deliberately leaves alone:

```
The certificate for api.example.com expired on 12 March, so every request from the
worker pool has been failing since then.
```

The default leaves that unchanged, because nothing distinguishes the second line from a line the writer meant to break. The second level rejoins it:

```
The certificate for api.example.com expired on 12 March, so every request from the worker pool has been failing since then.
```

_Never rejoin_ leaves every line break alone and only strips escape codes and indentation. It suits column aligned output such as `git log --graph`, where the breaks are the layout and the colour codes are the only thing you want gone.

The wrap column is worked out from the text itself. A terminal breaks every long line at the same place, so wrapped lines cluster just below it. When several lines sit near the longest, that length is the wrap column. Fenced code is excluded from the measurement, so a long line in a log dump does not stop the prose around it from being rejoined.

The rule leaves text alone entirely unless something identifies it as terminal output, meaning it carried escape codes or a paragraph was actually rejoined. Pasted code keeps its indentation and Markdown's two space line break survives.

### 3.5 Text processing

- **Trim surrounding whitespace** drops blank lines and stray spaces from the start and end of pasted text. The middle is left alone.
- **Commas and quotes** can leave comma placement unchanged, put commas inside closing quotation marks, or put them outside. **No change** is the default because comma placement is a style preference.
- **AI cleanup: invisible characters** removes zero-width spaces and turns non-breaking spaces into normal spaces.
- **AI cleanup: dashes and quotes** turns long dashes into `-`, and `“ ” ‘ ’` into `"` and `'`.

Two lines out of a chatbot, with the invisible characters drawn as their Unicode code points:

```
“The rollout is fine,” she said — the checks just need more time.
Runtime dropped from 3–4 minutes to 40 seconds, and it doesn’t block[U+00A0]the release[U+200B].
```

pasted:

```
"The rollout is fine," she said - the checks just need more time.
Runtime dropped from 3-4 minutes to 40 seconds, and it doesn't block the release.
```

Curly double and single quotes became straight, the em dash and the en dash became hyphens, the non-breaking space became an ordinary space, and the zero-width space at the end is gone.

**Trim surrounding whitespace** works on the edges only. Text copied out of a web page or a chat window usually arrives padded, and the marks below stand for the blank lines and spaces that came with it:

```
[blank]
[blank]
···Meeting notes from the review.···
[blank]
```

pasted:

```
Meeting notes from the review.
```

A blank line in the middle of the same paste is content, so it stays.

**Commas and quotes** works in both directions, and only on a comma next to a closing double quotation mark:

| Setting              | `She called it "finished," then left.` | `She called it "finished", then left.` |
| -------------------- | -------------------------------------- | -------------------------------------- |
| No change (default)  | unchanged                              | unchanged                              |
| Comma inside quotes  | unchanged                              | `"finished," then left.`               |
| Comma outside quotes | `"finished", then left.`               | unchanged                              |

Several invisible characters are deliberately kept, because they carry meaning rather than being junk. The zero width joiner holds a multi part emoji together, the joiner and non-joiner are ordinary content in Persian, Arabic and the Indic scripts, the word joiner prevents a line break, direction marks and embeddings make mixed Arabic or Hebrew and Latin text render in the right order, and the ideographic space is the normal word space in CJK. `👨‍👩‍👧` and `東京　です` come through untouched.

### 3.6 Frontmatter

The names of the two per-note properties, described in [section 4](#4-per-note-control).

- **Note property** switches the plugin on or off for one note. `bp` by default.
- **Image width property** sets how wide images pasted into a note come out. `bp-image-width` by default.

These are settings rather than fixed names because a frontmatter property has to coexist with whatever your vault and your other plugins already use, and a collision cannot be settled from inside the plugin. The plugin ships as a compiled bundle, so a fixed name would leave forking as the only way out. Rename either one to fit your own conventions.

Blank switches that property off. A blank **Note property** means no note can opt out or in, and a blank **Image width property** means no width is ever added.

<br/>

## 4 Per note control

Two frontmatter properties change what happens in a single note. Both start with `bp`, so they sit together in Obsidian's properties panel and read as plugin directives rather than as properties of the note itself. Both names can be changed under **Frontmatter** in the settings, described in [section 3.6](#36-frontmatter).

**Leave a note alone entirely:**

```yaml
---
bp: false
---
```

Nothing is touched in that note. This suits notes that are deliberately verbatim, such as logs, transcripts and scratchpads. The commands still work if you invoke one by name, because asking for the rules explicitly overrides the property.

**Clean one note while the rest are left alone:**

```yaml
---
bp: true
---
```

`bp` overrides **Clean up every paste** in both directions, so this is the case where a note is cleaned even though automatic cleanup is switched off everywhere else.

| Clean up every paste | No `bp` property | `bp: true` | `bp: false` |
| -------------------- | ---------------- | ---------- | ----------- |
| On                   | cleaned          | cleaned    | left alone  |
| Off                  | left alone       | cleaned    | left alone  |

A boolean is the form to use, because Obsidian fixes a property's type from whatever is entered first and a checkbox is the shape this property wants. `off`, `no`, `0`, `disabled` and their opposites `on`, `yes`, `1`, `enabled` are read as well, so a `bp` already typed as text still answers. A value the plugin does not recognise means no opinion, so the note follows the setting.

Opting in does not reach into code. A paste landing in a fenced block or the frontmatter is left alone whatever `bp` says, because pasting there is an act of preservation.

**Set the width of pasted images:**

```yaml
---
bp-image-width: 400
---
```

Images pasted into that note come out as `![[picture.png|400]]`, which is Obsidian's own size syntax, the same thing you would get by typing the width by hand. Markdown link vaults get `![400](picture.png)` instead. Both render identically. The value can be a width such as `400` or a width and height such as `400x300`. A value Obsidian cannot use, such as `50%`, is ignored rather than written into the link.

Both properties are read from the note as it stands in the editor rather than from Obsidian's metadata cache, so a property you just typed applies to the very next paste.

One consequence worth knowing. A note with `bp-image-width` also takes screenshot pastes away from Obsidian's own handler, because that handler has no way to apply the width. Notes without it are untouched.

<br/>

## 5 Commands

Set custom hotkeys for these in Obsidian's Hotkeys settings. None are bound by default.

- `better-paste:paste` **Paste.** Pastes the clipboard's plain text through the rules, whether or not automatic cleanup is on, and whether or not the note opted out.
- `better-paste:paste-raw` **Paste without processing.** Pastes the clipboard's plain text exactly as it is.
- `better-paste:clean` **Clean up selection.** Applies the text rules to whatever you have selected.
- `better-paste:toggle-cleanup` **Toggle automatic cleanup.** Flips the master switch, which is handy on a hotkey.

<br/>

## 6 How it decides what to do

Better Paste looks at what the clipboard actually holds.

| Clipboard holds                                               | What happens                                                                                                                |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| One bitmap **and** an `<img>` tag, from Safari's "Copy image" | Better Paste saves the bitmap it already has. Obsidian on its own prefers the HTML and leaves an external link              |
| Bitmap data alone, such as a screenshot                       | Left to Obsidian, which already saves it using your attachment settings                                                     |
| Rich content (HTML)                                           | Obsidian converts it to Markdown as usual, then Better Paste cleans the links and downloads the images in what was inserted |
| A styled terminal dump                                        | Treated as plain text, so the terminal rule applies                                                                         |
| Plain text                                                    | Better Paste transforms it and inserts the result itself                                                                    |

Safari's "Copy image" is the case worth calling out. It puts _both_ the decoded bitmap and an `<img>` tag on the clipboard, and Obsidian picks the HTML, so the note ends up pointing at the website instead of holding the picture. Better Paste uses the bytes that are already there, so nothing is downloaded at all. The file is still named after the original picture rather than Safari's generic `image.png`, and the extension comes from the actual bitmap.

A paste containing more than one file is left to Obsidian. Better Paste only takes over a single clipboard bitmap.

Rich content is deliberately left to Obsidian's own HTML to Markdown conversion rather than reimplemented. Better Paste only post-processes the result.

<br/>

## 7 Languages

Commands, settings, notices and dialogs follow the language Obsidian is set to. Twenty one languages are translated, and any other language falls back to English.

Arabic, Chinese (Simplified), Chinese (Traditional), Dutch, English, French, German, Indonesian, Italian, Japanese, Korean, Persian, Polish, Portuguese, Portuguese (Brazil), Russian, Spanish, Thai, Turkish, Ukrainian, Vietnamese.

A count picks the grammatical number the language requires, so Russian, Polish, Ukrainian and Arabic are not limited to one plural form. Every setting carries search terms in both the interface language and English, so searching either finds the row. The setting names and descriptions themselves are only in the interface language.

Obsidian applies the interface language at startup, so switching language takes effect after a restart. Release notes are written in English.

<br/>

## 8 Security and quality

Better Paste is checked with [TypeScript](https://www.typescriptlang.org/), [ESLint](https://eslint.org/) with the official [Obsidian ESLint plugin](https://github.com/obsidianmd/eslint-plugin), [Stylelint](https://stylelint.io/), [Prettier](https://prettier.io/), [Vitest](https://vitest.dev/) and a dead code check before any change is merged. The build only runs when every check passes, and a warning is treated as an error.

Better Paste runs locally apart from requests to download pasted pictures, fetch pasted link titles, and load dialog artwork. See [section 9](#9-network-disclosure) for the full account.

<br/>

## 9 Network disclosure

Better Paste makes network requests in exactly three situations.

**Pasting a picture.** When you paste content that references a picture by http(s) address, such as a Safari page selection, a Markdown image link, or a bare link ending in `.png`, the plugin downloads that picture so the note holds a local copy. Safari's "Copy image" is the case that makes no request, because the bitmap is already on the clipboard. The address always comes from what you pasted. The plugin never chooses one, and link cleaning deliberately leaves those addresses untouched so a signed link keeps the token it needs. The request uses Obsidian's own `requestUrl`.

**Fetching a link title.** When **Fetch titles for pasted links** is on and the clipboard contains one non-image web address, the plugin fetches that address and reads the HTML page title. A request that fails, takes longer than 10 seconds, returns a non-HTML response, or has no title leaves the pasted address unchanged. This setting is on by default.

**Dialog artwork.** The welcome dialog and the What's new dialog each show a picture, loaded from this repository at `raw.githubusercontent.com` when the dialog opens. The welcome dialog opens automatically on first enable, and the What's new dialog can open automatically after an update. Nothing is sent with the request beyond what fetching any picture involves, and both dialogs simply leave the picture out when it cannot be fetched. The pictures are not bundled because Obsidian installs only `main.js`, `manifest.json` and `styles.css`.

**What it never does.**

- No telemetry, no analytics, no crash reporting, no usage counting.
- No server belonging to this plugin. There is not one.
- Nothing is fetched silently in the background or on a timer. A request only happens because pasted content referenced a picture, title fetching was enabled for a pasted address, or a welcome or release-notes dialog is being shown.
- No code is downloaded or executed. Downloaded bytes are only ever written to a file, and only when the response is a recognised image type.
- Nothing is uploaded. The clipboard is transformed in memory and not retained, and the plugin keeps no history.

**What is stored.** Downloaded pictures go to the attachment location your vault is configured to use. Settings live in `.obsidian/plugins/better-paste/data.json`. Nothing leaves the vault.

**Worth knowing.** Downloading an image, fetching a title, or loading dialog artwork reveals your IP address to whoever serves it, exactly as visiting the page would. Turn off **Save pasted images into the vault** or **Fetch titles for pasted links** if that matters for a given vault. Bitmap-only screenshots are still left to Obsidian's own paste handler.

<br/>

## 10 What is not a setting

A paste is left alone when the cursor sits inside inline code, an indented or fenced code block, or the frontmatter block. Pasting into code is an act of preservation, so applying text rules there would destroy the thing you were protecting. The same holds inside the text: a fenced block in the middle of what you pasted comes through byte for byte, tracking parameters and curly quotes included.

These behaviours have one sensible value and are simply how the plugin works. Escape sequences and stray control characters are stripped from terminal output, the shared indentation is removed, runs of blank lines collapse, trailing spaces go, fenced code is never rejoined, images embedded in the clipboard as `data:` URIs are always saved, images over 50 MB or slower than 30 seconds are left as links, and scroll to text `#:~:text=` fragments are dropped from links while real anchors are kept.

<br/>

## 11 Contact

Better Paste is built and maintained by [Johan Sanneblad](https://www.linkedin.com/in/johansan/). Johan has a PhD in Software Development and has worked with innovation development for companies such as Apple, Electronic Arts, Google, Microsoft, Lego, SKF, Volvo Cars, Volvo Group and Yamaha.

Feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/johansan/).

<br/>

## 12 Questions or issues?

Open an issue on the [GitHub repository](https://github.com/johansan/better-paste/issues).

The most useful thing you can include in a bug report is what was on the clipboard. Open <https://dynalist.io/clipboard> in the app you copied from, paste there, and include what it prints.

**Pull requests are not accepted.** With the emergence of agentic coding, outside code submissions cannot be quality controlled to the standard the project maintains, so any pull request is closed automatically. Contribute ideas as feature requests instead. See [CONTRIBUTING.md](https://github.com/johansan/better-paste/blob/main/CONTRIBUTING.md) for details.

<br/>

## 13 License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](https://github.com/johansan/better-paste/blob/main/LICENSE) file for details.
