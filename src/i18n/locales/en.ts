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

/*
 * English strings, and the shape every other language file has to match.
 *
 * A string added here becomes a compile error in all twenty translations until they carry
 * it too, because each of them is annotated with `TranslationStrings`, which is derived
 * from this object.
 *
 * `{name}` marks a value filled in at runtime. A plural message is a `PluralForms` object
 * instead of a string, so a language can supply the grammatical numbers it actually uses.
 *
 * Only language belongs here. Sample addresses, Unicode code points and the arrow between
 * a before and an after read the same everywhere, so they stay in the page that draws them.
 */

import type { PluralForms } from '../types';

export const STRINGS_EN = {
    // Command palette entries
    commands: {
        paste: 'Paste',
        pasteRaw: 'Paste without processing',
        cleanSelection: 'Clean up selection',
        cleanTerminal: 'Clean up terminal output',
        commasInside: 'Move commas inside quotes',
        commasOutside: 'Move commas outside quotes',
        toggleCleanup: 'Toggle automatic cleanup'
    },

    notices: {
        // Wraps every notice, so a language can move the plugin name or drop the colon
        prefix: 'Better Paste: {message}',
        cleanupOn: 'automatic processing on',
        cleanupOff: 'automatic processing off',
        selectTextFirst: 'select some text first',
        nothingToClean: 'nothing to clean up',
        clipboardFailed: 'could not read the clipboard',
        titleFailed: 'could not fetch the title.',
        fetchingTitle: 'fetching title...',
        imagesFailed: { one: '{count} image could not be saved', other: '{count} images could not be saved' } as PluralForms,
        imagesFailedLinkKept: '{images}, the original link was kept',
        imagesFailedNothingPasted: '{images}, so nothing was pasted'
    },

    settings: {
        // Used where a description carries an example but the row is read outside a browser
        exampleFallback: '{description} Example: {example}',
        plainFallback: '{description} {example}',

        start: {
            heading: 'About',
            whatsNewName: "What's new in Better Paste {version}",
            whatsNewDesc: 'What changed in the most recent releases.',
            whatsNewAliases: ['release notes', 'changelog', 'version', 'update', 'history'],
            whatsNewButton: 'View recent updates',
            supportName: 'Support development',
            supportDesc: 'If you find Better Paste useful, please consider supporting its development.',
            supportAliases: ['sponsor', 'donate', 'coffee', 'github'],
            sponsorButton: '❤️ Sponsor',
            coffeeButton: '☕️ Buy me a coffee',
            pluginsName: 'Check out my other plugins',
            pluginsAliases: ['plugins', 'notebook navigator', 'pixel perfect image', 'author', 'more'],
            notebookNavigatorDesc: 'A better file browser and calendar',
            pixelPerfectImageDesc: 'Exact image resizing and more'
        },

        behavior: {
            autoCleanName: 'Clean up every paste',
            autoCleanDesc:
                'Applies the rules to every paste. When off, the rules run only from the Better Paste commands. A single note can opt out with the "{property}: false" property, or opt in with "{property}: true".',
            autoCleanAliases: ['automatic', 'enable', 'disable', 'note', 'exclude', 'property', 'frontmatter', 'opt out', 'opt in', 'bp'],
            notePropertyName: 'Note property',
            notePropertyDesc: 'Property that switches Better Paste on or off for one note.',
            notePropertyAliases: ['note', 'property', 'frontmatter', 'exclude', 'opt out', 'opt in', 'disable', 'enable', 'bp', 'verbatim']
        },

        images: {
            heading: 'Images',
            savingName: 'Save pasted images into the vault',
            savingDesc:
                'Saves pasted images into your attachment folder and links the local file instead of the web address. Covers Safari\'s "Copy image", images inside copied web content, and pasted image addresses. By default the file name comes from the address:',
            savingAliases: [
                'download',
                'attachment',
                'safari',
                'screenshot',
                'picture',
                'folder',
                'file name',
                'filename',
                'width',
                'size'
            ],
            sizeChoiceName: 'Apply size on paste',
            sizeChoiceDesc:
                "Adds a width to every saved image embed, such as ![[photo.jpg|400]]. A note's own width property overrides this.",
            sizeChoiceAliases: ['size', 'width', 'image size', 'resize', 'embed', '400'],
            sizeOptionsName: 'Size options',
            sizeOptionsDesc: 'The widths offered above and in the paste dialog, separated by commas.',
            classChoiceName: 'Apply CSS class on paste',
            classChoiceDesc:
                'Adds a class to every saved image embed, such as ![[photo.jpg#invert]]. Themes and CSS snippets decide what a class does.',
            classChoiceAliases: ['css', 'class', 'snippet', 'invert', 'theme', 'filter', 'embed'],
            classOptionsName: 'Class options',
            classOptionsDesc: 'The classes offered above and in the paste dialog, separated by commas.',
            choiceNone: 'Do nothing',
            choiceAsk: 'Ask on every paste',
            nameFormatName: 'File names',
            nameFormatDesc: 'How saved images are named.',
            nameFormatSource: 'Name from source',
            nameFormatCustom: 'Custom format',
            customName: 'Custom format',
            customDesc: 'Use {{name}} for the source name and Moment date formats such as YYYY-MM-DD.',
            customMomentLink: 'Moment format',
            customExample: 'Example: {value}',
            customAliases: ['name', 'filename', 'date', 'moment', 'YYYY', '{{name}}'],
            sizePropertyName: 'Image width property',
            sizePropertyDesc:
                'Frontmatter property that sets the width of images pasted into a note. With "image-width: 400" in the note, a pasted image becomes ![[photo.png|400]]. Leave blank to add no width.',
            sizePropertyAliases: ['size', 'frontmatter', 'property', 'resize', 'width', 'image']
        },

        links: {
            heading: 'Links',
            titlesName: 'Fetch titles for pasted links',
            titlesDesc:
                'Pasting a web address by itself inserts a Markdown link with the page title. If text is selected, the selected text becomes the label and no title is fetched. The plain address is kept when the title cannot be fetched.',
            titlesAliases: ['title', 'page', 'website', 'markdown link', 'download'],
            cleaningName: 'Clean pasted links',
            cleaningDesc: 'Removes tracking parameters from pasted links:',
            cleaningAliases: ['url', 'tracking', 'utm', 'parameters', 'query', 'site', 'domain', 'youtube', 'exception'],
            stripName: 'Which parameters to remove',
            stripDesc: 'Tracking parameters are names such as utm_source, fbclid and gclid.',
            stripAliases: ['utm', 'tracking', 'query', 'parameters'],
            stripAll: 'Every parameter unless a site rule keeps it',
            stripTracking: 'Only known tracking parameters',
            rulesName: 'Site rules',
            rulesDesc: 'Parameters to keep on specific sites.',
            rulesCount: { one: '{count} site', other: '{count} sites' } as PluralForms,
            listName: 'Your site rules',
            // {sites} is the shipped rule count, written by listShippedCount
            listDesc:
                '{sites} are already covered by the plugin. Add your own rules here, one per line. "example.com" keeps every parameter on that site, "example.com: a, b" keeps only those two, and "!example.com" removes a rule that ships with the plugin. Subdomains are matched automatically.',
            listShippedCount: { one: '{count} common site', other: '{count} common sites' } as PluralForms,
            listAliases: ['domain', 'exception', 'whitelist', 'youtube'],
            listInvalid: 'Not a site name: {values}',
            testerName: 'Try it',
            testerDesc: 'Paste a link to see what the rules keep.',
            testerLabel: 'Link to clean',
            testerEmpty: 'The cleaned link appears here.'
        },

        text: {
            heading: 'Text processing',
            trimName: 'Trim surrounding whitespace',
            trimDesc: 'Removes blank lines and spaces from the start and end of pasted text.',
            trimAliases: ['whitespace', 'blank', 'space', 'newline', 'trim'],
            invisibleName: 'Invisible characters',
            invisibleDesc: 'Removes zero-width spaces and turns non-breaking spaces into normal spaces.',
            invisibleAliases: ['ai', 'chatgpt', 'claude', 'llm', 'unicode', 'invisible', 'nbsp', 'whitespace'],
            // Three fragments of one sentence. An invisible character is drawn as its
            // Unicode code point between each pair, so they cannot be one string.
            invisibleExampleStart: 'The',
            invisibleExampleMiddle: 'result',
            invisibleExampleEnd: ' was fine.',
            invisibleExampleAfter: 'The result was fine.',
            quotesName: 'Quotes',
            quotesDesc: 'Converts curly quotes and apostrophes into straight quotes.',
            quotesAliases: [
                'quote',
                'quotes',
                'smart quotes',
                'curly quotes',
                'straight quotes',
                'apostrophe',
                'punctuation',
                'typography',
                'ai'
            ],
            quotesExample: '“Fine,” she said.',
            dashesName: 'Dashes',
            dashesDesc: 'Converts en and em dashes into hyphens.',
            dashesAliases: ['dash', 'em dash', 'en dash', 'hyphen', 'punctuation', 'typography', 'ai'],
            dashesExample: 'The result — against all odds — was fine.'
        }
    },

    imageModal: {
        title: 'Image options',
        sizeName: 'Size',
        className: 'CSS class',
        none: 'Do nothing',
        apply: 'Apply',
        cancel: 'Cancel'
    },

    welcome: {
        title: 'Welcome to Better Paste',
        intro: [
            'Copy images from Safari straight into your vault, paste links without tracking junk, fix broken terminal output, and clean up AI text. Just paste, and Better Paste handles the rest.',
            'One tip before you start: bind **Paste without processing** to `Cmd+Shift+V` (`Ctrl+Shift+V` on Windows), so you can always paste exactly what is on the clipboard.',
            'Every rule has its own toggle under Settings, Better Paste, and the `{property}: false` property turns the plugin off for a single note.'
        ],
        startButton: 'Get started'
    },

    overlap: {
        title: 'Better Paste: overlapping plugins',
        thanks: 'Thank you for installing and using Better Paste!',
        intro: {
            one: 'Right now you have {count} plugin installed that does more or less the same thing, so disable or uninstall:',
            other: 'Right now you have {count} plugins installed that do more or less the same thing, so disable or uninstall:'
        } as PluralForms,
        outro: 'Disable in Settings > Community plugins.',
        dontRemind: "Don't remind me again",
        button: 'Got it'
    },

    whatsNew: {
        title: "What's new in Better Paste",
        scrollLabel: 'Release notes',
        releaseHeading: 'Version {version} ({date})',
        categoryNew: 'New',
        categoryImproved: 'Improved',
        categoryChanged: 'Changed',
        categoryFixed: 'Fixed',
        support: 'If you find Better Paste useful, please consider supporting its development.',
        coffeeButton: '☕️ Buy me a coffee',
        thanksButton: 'Thanks!'
    }
};
