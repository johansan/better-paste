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
        imagesFailedNothingPasted: '{images}, so nothing was pasted. The clipboard still has it.',
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
            supportDesc: 'If you find Better Paste useful, please consider supporting its continued development.',
            supportAliases: ['sponsor', 'donate', 'coffee', 'github'],
            sponsorButton: '❤️ Sponsor',
            coffeeButton: '☕️ Buy me a coffee'
        },

        behavior: {
            heading: 'Behavior',
            autoCleanName: 'Clean up every paste',
            autoCleanDesc:
                'Apply the rules on every paste. Turn this off to use the commands only. A single note can opt out with the "better-paste: false" property.',
            autoCleanAliases: ['automatic', 'enable', 'disable', 'note', 'exclude', 'property', 'frontmatter', 'opt out'],
            showNoticesName: 'Show a notice when a paste is changed',
            showNoticesDesc: 'A one-line summary of what was cleaned up. Failures are always reported, whatever this is set to.',
            showNoticesAliases: ['notice', 'summary', 'message', 'toast', 'quiet', 'silent']
        },

        images: {
            heading: 'Images',
            savingName: 'Save pasted images into the vault',
            savingDesc:
                'Saves pasted pictures as local files rather than leaving external image links. This includes Safari\'s "Copy image", pictures inside copied web content, and standalone image addresses. Images are saved to your vault attachment folder. With "Name from source":',
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
            pageDesc: 'File names and per-note image width.',
            nameFormatName: 'File names',
            nameFormatDesc: 'Choose how saved image files are named.',
            nameFormatSource: 'Name from source',
            nameFormatCustom: 'Custom format',
            customName: 'Custom format',
            customDesc: 'Use {{name}} for the source name and Moment date formats such as YYYY-MM-DD.',
            customMomentLink: 'Moment format',
            customExample: 'Example: {value}',
            customAliases: ['name', 'filename', 'date', 'moment', 'YYYY', '{{name}}'],
            sizePropertyName: 'Image width property',
            sizePropertyDesc:
                'The frontmatter property that defines the width of images pasted into a note. A note using this property takes screenshot pastes over from Obsidian. Leave blank to disable.',
            sizePropertyAliases: ['size', 'frontmatter', 'property', 'resize']
        },

        links: {
            heading: 'Links',
            titlesName: 'Fetch titles for pasted links',
            titlesDesc:
                'When the clipboard contains only a non-image web address, fetch its page title and paste a Markdown link. Other selected text becomes the label without making a request. The original address is kept if the title cannot be fetched.',
            titlesAliases: ['title', 'page', 'website', 'markdown link', 'download'],
            cleaningName: 'Clean pasted links',
            cleaningDesc: 'Removes tracking parameters from pasted links. The struck-through part is removed:',
            cleaningAliases: ['url', 'tracking', 'utm', 'parameters', 'query', 'site', 'domain', 'youtube', 'exception'],
            stripName: 'Which parameters to remove',
            stripDesc:
                'Choose whether to remove every query parameter or only known tracking parameters. Site rules can preserve parameters in either mode.',
            stripAliases: ['utm', 'tracking', 'query', 'parameters'],
            stripAll: 'Every parameter, except where a site rule keeps it',
            stripTracking: 'Only parameters known to be tracking',
            rulesName: 'Rules for preserving parameters',
            rulesDesc: 'Site rules for keeping specific query parameters in either removal mode.',
            rulesCount: { one: '{count} site', other: '{count} sites' } as PluralForms,
            listName: 'Your site rules',
            // {sites} is the shipped rule count, written by listShippedCount
            listDesc:
                '{sites} are already handled and stay up to date with the plugin. Add your own site rules here, one per line. "example.com" keeps every parameter on that site, "example.com: a, b" keeps only those two, and "!example.com" drops a rule that ships with the plugin. In "Only parameters known to be tracking" mode, a rule only rescues matching tracking parameters because other parameters are already kept. Subdomains are matched automatically.',
            listShippedCount: { one: '{count} common site', other: '{count} common sites' } as PluralForms,
            listAliases: ['domain', 'exception', 'whitelist', 'youtube'],
            listInvalid: 'Not a site name: {values}',
            testerName: 'Try it',
            testerDesc: 'Paste a link to see what these rules would keep.',
            testerLabel: 'Link to clean',
            testerEmpty: 'The cleaned link appears here.'
        },

        terminal: {
            heading: 'Terminal text',
            cleanupName: 'Clean up terminal output',
            cleanupDesc:
                'Rejoins wrapped lines in terminal output and removes indentation. Color codes are stripped. Code fences, tables, and list items are untouched.',
            cleanupAliases: ['wrap', 'unwrap', 'rejoin', 'ansi', 'console', 'shell', 'indent', 'bullet', 'list', 'markdown'],
            pageName: 'Terminal text handling',
            pageDesc: 'Rejoin conditions and bullet characters.',
            rejoinName: 'When to rejoin a broken line',
            rejoinDesc: 'The condition required to treat a line as a continuation of the previous line.',
            rejoinAliases: ['indent', 'wrap', 'aggressive', 'safe', 'git log'],
            rejoinIndented: 'Only when the next line is indented',
            rejoinAny: 'Whenever the line above looks full',
            rejoinNever: 'Never rejoin, only strip codes and indentation',
            bulletsName: 'Bullet characters',
            bulletsDesc:
                'Determines whether bullet characters (like •) in terminal output are preserved or converted to Markdown list items.',
            bulletsAliases: ['list', 'markdown', 'dash'],
            bulletsMarkdown: 'Convert to Markdown list items',
            bulletsPreserve: 'Leave them as they are',
            testerName: 'Try it',
            testerDesc: 'Paste terminal output to see how it would be cleaned up.',
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
            commasDesc: 'Choose where to place a comma next to a closing double quotation mark.',
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
