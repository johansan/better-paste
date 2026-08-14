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
        toggleCleanup: 'Toggle automatic cleanup'
    },

    notices: {
        // Wraps every notice, so a language can move the plugin name or drop the colon
        prefix: 'Better Paste: {message}',
        // Joins the parts of the summary notice, which several languages do not punctuate with a comma
        separator: ', ',
        cleanupOn: 'automatic processing on',
        cleanupOff: 'automatic processing off',
        selectTextFirst: 'select some text first',
        nothingToClean: 'nothing to clean up',
        clipboardFailed: 'could not read the clipboard',
        titleFailed: 'could not fetch the title.',
        // {dots} is one to three full stops, cycled while the request is open
        fetchingTitle: 'fetching title{dots}',
        imagesFailed: { one: '{count} image could not be saved', other: '{count} images could not be saved' } as PluralForms,
        imagesFailedLinkKept: '{images}, the original link was kept',
        imagesFailedNothingPasted: '{images}, so nothing was pasted',
        aiTextCleaned: 'tidied AI text',
        terminalCleaned: 'cleaned up terminal text',
        textProcessed: 'adjusted text style',
        urlsCleaned: { one: 'cleaned {count} URL', other: 'cleaned {count} URLs' } as PluralForms,
        imagesSaved: { one: 'saved {count} image', other: 'saved {count} images' } as PluralForms
    },

    settings: {
        // Used where a description carries an example but the row is read outside a browser
        exampleFallback: '{description} Example: {example}',
        plainFallback: '{description} {example}',

        start: {
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
            pixelPerfectImageDesc: 'Exact image resizing and much more'
        },

        behavior: {
            heading: 'Behavior',
            autoCleanName: 'Clean up every paste',
            autoCleanDesc:
                'Applies the rules to every paste. When off, the rules run only from the Better Paste commands. A single note can opt out with the "better-paste: false" property.',
            autoCleanAliases: ['automatic', 'enable', 'disable', 'note', 'exclude', 'property', 'frontmatter', 'opt out'],
            showNoticesName: 'Show a notice when a paste is changed',
            showNoticesDesc: 'A one-line summary of what changed. Failures are always reported.',
            showNoticesAliases: ['notice', 'summary', 'message', 'toast', 'quiet', 'silent']
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
            pageName: 'Image handling',
            pageDesc: 'File names and image width.',
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
            sizePropertyAliases: ['size', 'frontmatter', 'property', 'resize']
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

        terminal: {
            heading: 'Terminal text',
            cleanupName: 'Clean up terminal output',
            cleanupDesc:
                'Rejoins lines that the terminal wrapped, and removes color codes and leading indentation. Code fences, tables and lists are left alone.',
            cleanupAliases: ['wrap', 'unwrap', 'rejoin', 'ansi', 'console', 'shell', 'indent', 'bullet', 'list', 'markdown'],
            pageName: 'Terminal text handling',
            pageDesc: 'Line rejoining and bullet characters.',
            rejoinName: 'When to rejoin a broken line',
            rejoinDesc: 'A line is joined to the one above only when that line looks full.',
            rejoinAliases: ['indent', 'wrap', 'aggressive', 'safe', 'git log'],
            rejoinIndented: 'Only when the line is indented',
            rejoinAny: 'Whether or not the line is indented',
            rejoinNever: 'Never, only remove codes and indentation',
            bulletsName: 'Bullet characters',
            bulletsDesc: 'What to do with bullet characters such as • in terminal output.',
            bulletsAliases: ['list', 'markdown', 'dash'],
            bulletsMarkdown: 'Convert to Markdown list items',
            bulletsPreserve: 'Leave them as they are',
            testerName: 'Try it',
            testerDesc: 'Paste terminal output to see how it is cleaned up.',
            testerLabel: 'Terminal text to clean',
            testerEmpty: 'The cleaned text appears here.',
            // The two lines of the sample are a wrapped sentence, so the second has to read
            // as the continuation of the first for the preview to show anything
            testerSample: [
                '• The extra step is isolated to the list Enter handler, so the core change is straightforward. While tracing adjacent flows, I found',
                '  two likely friction points worth validating: selection can jump after the refresh.'
            ]
        },

        text: {
            heading: 'Text processing',
            trimName: 'Trim surrounding whitespace',
            trimDesc: 'Removes blank lines and spaces from the start and end of pasted text.',
            trimAliases: ['whitespace', 'blank', 'space', 'newline', 'trim'],
            commasName: 'Commas and quotes',
            commasDesc: 'Where a comma goes next to a closing double quotation mark.',
            commasAliases: ['comma', 'quote', 'quotation', 'punctuation', 'style'],
            commasNone: 'No change',
            commasInside: 'Comma inside quotes',
            commasOutside: 'Comma outside quotes',
            // The two halves of the comma example. The source has the comma inside the
            // closing quotation mark, so only the outside setting changes it.
            commasExampleSource: 'He called it "finished," then left.',
            commasExampleOutside: 'He called it "finished", then left.',
            invisibleName: 'AI cleanup: invisible characters',
            invisibleDesc: 'Removes zero-width spaces and turns non-breaking spaces into normal spaces.',
            invisibleAliases: [
                'ai',
                'chatgpt',
                'claude',
                'llm',
                'dash',
                'em dash',
                'en dash',
                'hyphen',
                'unicode',
                'invisible',
                'nbsp',
                'typography',
                'punctuation',
                'whitespace'
            ],
            // Three fragments of one sentence. An invisible character is drawn as its
            // Unicode code point between each pair, so they cannot be one string.
            invisibleExampleStart: 'The',
            invisibleExampleMiddle: 'result',
            invisibleExampleEnd: ' was fine.',
            invisibleExampleAfter: 'The result was fine.',
            punctuationName: 'AI cleanup: dashes and quotes',
            punctuationDesc: 'Converts long dashes into hyphens and curly quotes into straight quotes.',
            punctuationAliases: [
                'em dash',
                'en dash',
                'hyphen',
                'quote',
                'quotes',
                'smart quotes',
                'curly quotes',
                'apostrophe',
                'punctuation',
                'typography'
            ],
            punctuationExampleBefore: '“The result — against all odds — was perfect.”',
            punctuationExampleAfter: '"The result - against all odds - was perfect."'
        }
    },

    welcome: {
        title: 'Welcome to Better Paste',
        intro: [
            'Better Paste alters clipboard content as it is pasted into a note.',
            'It saves linked images into the vault as attachments, removes tracking parameters from links, rejoins wrapped lines in terminal output, and replaces curly quotes and invisible characters with plain equivalents.',
            'Every rule can be turned off on its own.',
            'A single note can opt out entirely with the "better-paste: false" property. Settings are under Settings, Better Paste.'
        ],
        startButton: 'Get started'
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
