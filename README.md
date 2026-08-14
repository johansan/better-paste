# Better Paste

Stop fixing formatting manually after every paste. Better Paste resolves common clipboard issues before they reach your Obsidian vault. It finally lets you copy images from Safari directly into your vault, strips tracking parameters from URLs, fetches page titles, rejoins broken lines in terminal output, and removes invisible characters and curly quotes from AI text. Just paste, and the plugin handles the rest.

If you find Better Paste useful, please consider [☕️ Buying me a coffee](https://buymeacoffee.com/johansan) or [Sponsor on GitHub ❤️](https://github.com/sponsors/johansan).

<br/>

## 1 Installation

1. **Install Obsidian** if you have not already, from [obsidian.md](https://obsidian.md/)
2. **Enable community plugins** in Settings, Community plugins, Turn on community plugins
3. **Install Better Paste** by clicking Browse, searching for "Better Paste", then Install

<br/>

## 2 What it does

Four rules. Each one can be turned off on its own.

**Terminal output.** Copying from a terminal gives you the terminal's line breaks, not yours:

```
 The deployment finished, but three of the health checks did not report back before the
  timeout, so the rollout has been paused pending a manual review.

• Two of the three recovered on their own within a minute, which suggests the checks are
  racing the container's startup probe rather than failing outright.
```

pastes as:

```
The deployment finished, but three of the health checks did not report back before the timeout, so the rollout has been paused pending a manual review.

• Two of the three recovered on their own within a minute, which suggests the checks are racing the container's startup probe rather than failing outright.
```

**Links.** A link out of a newsletter:

```
https://support.claude.com/en/articles/16266773-how-claude-marks-ai-generated-content?utm_source=www.therundown.ai&utm_medium=newsletter&utm_campaign=anthropic-slips-an-invisible-signature-into-claude&_bhlid=5860aad7a9737cf115b5ac231b92ca3147d16877
```

pastes as:

```
https://support.claude.com/en/articles/16266773-how-claude-marks-ai-generated-content
```

Title fetching turns a pasted web address into a Markdown link using the page title. The address is pasted immediately, then replaced when the title arrives. Image addresses are left to image handling, and a failed request leaves the original address in place.

**AI text.** `“The result was fine,” he said.` pastes as `"The result was fine," he said.` Curly quotes become straight, fancy dashes become hyphens, and the invisible characters that came along are gone.

**Images.** Copy a picture in Safari and Obsidian leaves a link to the website. Better Paste saves the picture into your vault instead, so the note still works offline and survives the source site going away.

<br/>

## 3 Security and quality

Better Paste is checked with [TypeScript](https://www.typescriptlang.org/), [ESLint](https://eslint.org/) with the official [Obsidian ESLint plugin](https://github.com/obsidianmd/eslint-plugin), [Stylelint](https://stylelint.io/), [Prettier](https://prettier.io/), [Vitest](https://vitest.dev/) and a dead code check before any change is merged. The build only runs when every check passes, and a warning is treated as an error.

Better Paste runs locally apart from requests to download pasted pictures, fetch pasted link titles, and load dialog artwork. See [section 8](#8-network-disclosure) for the full account.

<br/>

## 4 How it decides what to do

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

When a download fails or times out, the original link stays in the note. Nothing is lost, and a notice says what happened.

Alt text from a downloaded Markdown or HTML image is kept on the local embed. If the note also sets an image width, the embed carries both.

<br/>

## 5 Settings

Seventeen settings, arranged as a landing page with three sub pages. Anything with only one sensible answer is simply how the plugin behaves, rather than a question you have to answer.

### 5.1 Behavior

- **Clean up every paste** applies the rules whenever you paste. Turn it off to use the commands only.
- **Show a notice when a paste is changed** gives a one line summary. Failures are reported whatever this is set to.

### 5.2 Images

**Save pasted images into the vault** saves Safari's "Copy image", pictures inside copied web content, and standalone image addresses as local attachments. Saved pictures go wherever the vault files attachments, which is Obsidian's own setting under Files and links. The plugin does not add a second place to answer that.

Behind **Image handling**:

- **File names** uses the source name or a custom format. A custom format can combine `{{name}}` with Moment date syntax, such as `{{name}}-YYYY-MM-DD`. The setting shows the resulting filename below the field.
- **Image width property** names the note property that sets how wide pasted images are. See [section 6](#6-per-note-control).

### 5.3 Links

**Which parameters to remove** offers every parameter except where a site rule keeps it, or only the parameters known to be tracking.

**Fetch titles for pasted links** turns a clipboard containing one non-image web address into a Markdown link using the page title. When other text is selected, that text becomes the link label without making a request. It is on by default. Addresses inside prose and links that already carry their own label are left alone.

Behind **Rules for preserving parameters**, the full rule list and a live tester:

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

### 5.4 Terminal text

Behind **Terminal text handling**:

- **When to rejoin a broken line** offers three levels. _Only when the next line is indented_ is what most terminals do and what keeps ordinary multi line text safe. _Whenever the line above looks full_ suits tools that wrap without indenting. _Never rejoin_ leaves every line break alone and only strips escape codes and indentation, which suits column aligned output such as `git log --graph` where the breaks are the layout.
- **Bullet characters** converts `•` to a real Markdown list item that folds and indents by default, or can leave the original character alone.
- A live tester.

The wrap column is worked out from the text itself. A terminal breaks every long line at the same place, so wrapped lines cluster just below it. When several lines sit near the longest, that length is the wrap column. Fenced code is excluded from the measurement, so a long line in a log dump does not stop the prose around it from being rejoined.

The rule leaves text alone entirely unless something identifies it as terminal output, meaning it carried escape codes or a paragraph was actually rejoined. Pasted code keeps its indentation and Markdown's two space line break survives.

### 5.5 Text processing

- **Trim surrounding whitespace** drops blank lines and stray spaces from the start and end of pasted text. The middle is left alone.
- **Commas and quotes** can leave comma placement unchanged, put commas inside closing quotation marks, or put them outside. **No change** is the default because comma placement is a style preference.
- **AI cleanup: invisible characters** removes zero-width spaces and turns non-breaking spaces into normal spaces. For example, `The[U+00A0]result[U+200B] was fine.` becomes `The result was fine.`
- **AI cleanup: dashes and quotes** turns long dashes into `-`, and `“ ” ‘ ’` into `"` and `'`. For example, `“This approach [long dash] while simple [long dash] can significantly improve your workflow.”` becomes `"This approach - while simple - can significantly improve your workflow."`

Several invisible characters are deliberately kept, because they carry meaning rather than being junk. The zero width joiner holds a multi part emoji together, the joiner and non-joiner are ordinary content in Persian, Arabic and the Indic scripts, the word joiner prevents a line break, direction marks and embeddings make mixed Arabic or Hebrew and Latin text render in the right order, and the ideographic space is the normal word space in CJK.

<br/>

## 6 Per note control

Two frontmatter properties change what happens in a single note.

**Leave a note alone entirely:**

```yaml
---
better-paste: false
---
```

Nothing is touched in that note. `off`, `no` and `0` work too. This suits notes that are deliberately verbatim, such as logs, transcripts and scratchpads. The commands still work if you invoke one by name, since asking for the rules explicitly overrides the property.

**Set the width of pasted images:**

```yaml
---
image-width: 400
---
```

Images pasted into that note come out as `![[picture.png|400]]`, which is Obsidian's own size syntax, the same thing you would get by typing the width by hand. Markdown link vaults get `![400](picture.png)` instead. Both render identically. The value can be a width such as `400` or a width and height such as `400x300`. A value Obsidian cannot use, such as `50%`, is ignored rather than written into the link.

Both properties are read from the note as it stands in the editor rather than from Obsidian's metadata cache, so a property you just typed applies to the very next paste.

One consequence worth knowing. A note with `image-width` also takes screenshot pastes away from Obsidian's own handler, since that handler has no way to apply the width. Notes without it are untouched.

<br/>

## 7 Commands

Set custom hotkeys for these in Obsidian's Hotkeys settings. None are bound by default.

- `better-paste:paste` **Paste.** Pastes the clipboard's plain text through the rules, whether or not automatic cleanup is on, and whether or not the note opted out.
- `better-paste:paste-raw` **Paste without processing.** Pastes the clipboard's plain text exactly as it is.
- `better-paste:clean` **Clean up selection.** Applies the text rules to whatever you have selected.
- `better-paste:toggle-cleanup` **Toggle automatic cleanup.** Flips the master switch, which is handy on a hotkey.

<br/>

## 8 Network disclosure

Better Paste makes network requests in exactly three situations.

**Pasting a picture.** When you paste content that references a picture by http(s) address, such as a Safari page selection, a Markdown image link, or a bare link ending in `.png`, the plugin downloads that picture so the note holds a local copy. The address always comes from what you pasted. The plugin never chooses one, and link cleaning deliberately leaves those addresses untouched so a signed link keeps the token it needs. The request uses Obsidian's own `requestUrl`.

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

## 9 What is not a setting

A paste is left alone when the cursor sits inside inline code, an indented or fenced code block, or the frontmatter block. Pasting into code is an act of preservation, so applying text rules there would destroy the thing you were protecting.

These behaviours have one sensible value and are simply how the plugin works. Escape sequences and stray control characters are stripped from terminal output, the shared indentation is removed, runs of blank lines collapse, trailing spaces go, fenced code is never rejoined, images embedded in the clipboard as `data:` URIs are always saved, images over 50 MB or slower than 30 seconds are left as links, and scroll to text `#:~:text=` fragments are dropped from links while real anchors are kept.

<br/>

## 10 Contact

Better Paste is built and maintained by [Johan Sanneblad](https://www.linkedin.com/in/johansan/). Johan has a PhD in Software Development and has worked with innovation development for companies such as Apple, Electronic Arts, Google, Microsoft, Lego, SKF, Volvo Cars, Volvo Group and Yamaha.

Feel free to connect with me on [LinkedIn](https://www.linkedin.com/in/johansan/).

<br/>

## 11 Questions or issues?

Open an issue on the [GitHub repository](https://github.com/johansan/better-paste/issues).

The most useful thing you can include in a bug report is what was on the clipboard. Open <https://dynalist.io/clipboard> in the app you copied from, paste there, and include what it prints.

**Pull requests are not accepted.** With the emergence of agentic coding, outside code submissions cannot be quality controlled to the standard the project maintains, so any pull request is closed automatically. Contribute ideas as feature requests instead. See [CONTRIBUTING.md](https://github.com/johansan/better-paste/blob/main/CONTRIBUTING.md) for details.

<br/>

## 12 License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](https://github.com/johansan/better-paste/blob/main/LICENSE) file for details.
