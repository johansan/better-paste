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

import { PluginSettingTab } from 'obsidian';
import type { App, Setting, SettingDefinition, SettingDefinitionItem } from 'obsidian';
import type BetterPastePlugin from '../main';
import { DEFAULT_SETTINGS } from './defaults';
import { parseLines, parseTokens } from './normalize';
import type { BetterPasteSettings } from './types';
import { cleanTerminalText } from '../transforms/terminalText';
import { cleanUrl } from '../transforms/urlCleanup';

/** Sample text shown in the terminal cleanup tester before the user types their own. */
const TERMINAL_SAMPLE = [
    '• The extra step is isolated to the list Enter handler, so the core change is straightforward. While tracing adjacent flows, I found',
    '  two likely friction points worth validating: selection can jump after the refresh.'
].join('\n');

/** Sample URL shown in the URL tester before the user types their own. */
const URL_SAMPLE = 'https://support.claude.com/en/articles/16266773-how-claude-marks-ai-generated-content?utm_source=news&_bhlid=abc123';

/** Settings stored as string arrays but edited as one text field. */
const LIST_SEPARATORS = {
    urlDomainRules: 'lines',
    urlTrackingParams: 'lines',
    urlKeepParams: 'lines',
    imageExtensions: 'tokens',
    terminalListMarkers: 'tokens'
} as const;

type ListSettingKey = keyof typeof LIST_SEPARATORS;

/** Class applied to the plugin's setting groups so styles.css can scope to them. */
const SETTINGS_CLASS = 'better-paste-settings';

/** Control keys are the settings keys, with a suffix for the ones edited as text. */
const LIST_KEY_SUFFIX = '.text';

function isListControlKey(key: string): key is `${ListSettingKey}${typeof LIST_KEY_SUFFIX}` {
    if (!key.endsWith(LIST_KEY_SUFFIX)) return false;
    return key.slice(0, -LIST_KEY_SUFFIX.length) in LIST_SEPARATORS;
}

function listKeyOf(controlKey: string): ListSettingKey {
    return controlKey.slice(0, -LIST_KEY_SUFFIX.length) as ListSettingKey;
}

export class BetterPasteSettingTab extends PluginSettingTab {
    // PluginSettingTab already stores the plugin it was constructed with, and its default
    // getControlValue reads from it. Declaring rather than redefining the field narrows the
    // type without emitting a class field that would shadow the base's reference.
    declare plugin: BetterPastePlugin;

    constructor(app: App, plugin: BetterPastePlugin) {
        super(app, plugin);
    }

    private get settings(): BetterPasteSettings {
        return this.plugin.settings;
    }

    getSettingDefinitions(): SettingDefinitionItem[] {
        return [
            ...this.pastingDefinitions(),
            { type: 'group', cls: SETTINGS_CLASS, heading: 'Images and rich content', items: this.imageDefinitions() },
            { type: 'group', cls: SETTINGS_CLASS, heading: 'URL cleaning', items: this.urlDefinitions() },
            { type: 'group', cls: SETTINGS_CLASS, heading: 'Terminal text', items: this.terminalDefinitions() }
        ];
    }

    /**
     * Reads a control's value. List settings are stored as arrays but edited as text, so
     * they are joined here; everything else uses the base implementation, which reads
     * straight from `plugin.settings`.
     */
    getControlValue(key: string): unknown {
        if (isListControlKey(key)) return this.joinList(listKeyOf(key));
        return super.getControlValue(key);
    }

    /** Writes a control's value, splitting the text form of a list setting back into entries. */
    async setControlValue(key: string, value: unknown): Promise<void> {
        if (isListControlKey(key)) {
            const settingKey = listKeyOf(key);
            const separator = LIST_SEPARATORS[settingKey];
            const parse = separator === 'lines' ? parseLines : parseTokens;
            this.settings[settingKey] = parse(typeof value === 'string' ? value : '');
            await this.plugin.saveSettings();
            return;
        }

        await super.setControlValue(key, value);

        // Several settings gate the visibility of others, and toggling one has to
        // re-evaluate those predicates. This only touches CSS state, so it is cheap
        // enough to run after every change rather than tracking which keys matter.
        this.refreshDomState();
    }

    private joinList(key: ListSettingKey): string {
        return this.settings[key].join(LIST_SEPARATORS[key] === 'lines' ? '\n' : ', ');
    }

    /** Toggle definition bound to a boolean setting. */
    private toggle(key: BooleanSettingKey, name: string, desc: string): SettingDefinition {
        return {
            name,
            desc,
            control: { type: 'toggle', key, defaultValue: DEFAULT_SETTINGS[key] }
        };
    }

    /**
     * A multi-line list setting followed by a row that restores the shipped defaults.
     * Returned as a flat pair because a group's items cannot contain another group.
     */
    private list(key: ListSettingKey, name: string, desc: string, rows: number, visible: () => boolean): SettingDefinition[] {
        return [
            {
                name,
                desc,
                visible,
                control: {
                    type: 'textarea',
                    key: `${key}${LIST_KEY_SUFFIX}`,
                    rows,
                    defaultValue: DEFAULT_SETTINGS[key].join(LIST_SEPARATORS[key] === 'lines' ? '\n' : ', ')
                }
            },
            {
                name: `Restore default ${name.toLowerCase()}`,
                desc: 'Replace the list above with the one Better Paste ships with.',
                visible,
                searchable: false,
                action: () => {
                    this.settings[key] = [...DEFAULT_SETTINGS[key]];
                    void this.plugin.saveSettings().then(() => this.update());
                }
            }
        ];
    }

    private pastingDefinitions(): SettingDefinition[] {
        return [
            this.toggle(
                'interceptPaste',
                'Process pasted content automatically',
                'Apply the rules below whenever you paste. Turn this off to use the Better Paste commands only.'
            ),
            this.toggle('showNotices', 'Show a notice after each paste', 'Summarises what was changed. Turn this off for silent pastes.')
        ];
    }

    private imageDefinitions(): SettingDefinition[] {
        const enabled = (): boolean => this.settings.imagesEnabled;

        return [
            {
                name: 'Save pasted images into the vault',
                desc: 'When the clipboard carries a picture as a link rather than as bitmap data, such as content copied from Safari, download it and embed the local copy.',
                control: { type: 'toggle', key: 'imagesEnabled', defaultValue: DEFAULT_SETTINGS.imagesEnabled }
            },
            {
                ...this.toggle(
                    'downloadRemoteImages',
                    'Download linked images',
                    'Fetch images that pasted rich content references by http(s) URL.'
                ),
                visible: enabled
            },
            {
                ...this.toggle(
                    'downloadDataUriImages',
                    'Save inline images',
                    'Store images that arrive embedded in the clipboard as data: URIs instead of leaving a long unreadable link in the note.'
                ),
                visible: enabled
            },
            {
                ...this.toggle(
                    'downloadBareImageUrls',
                    'Treat a pasted image URL as an image',
                    'When you paste a bare link that ends in an image extension, download it and embed it instead of inserting the link.'
                ),
                visible: enabled
            },
            {
                name: 'Save images to',
                desc: "Where downloaded images are stored. The vault's own choice lives under Files and links.",
                visible: enabled,
                control: {
                    type: 'dropdown',
                    key: 'imageFolderMode',
                    defaultValue: DEFAULT_SETTINGS.imageFolderMode,
                    options: {
                        obsidian: "Follow the vault's attachment setting",
                        custom: 'A specific folder'
                    }
                }
            },
            {
                name: 'Image folder',
                desc: 'Vault-relative folder. It is created if it does not exist.',
                visible: () => enabled() && this.settings.imageFolderMode === 'custom',
                control: {
                    type: 'text',
                    key: 'imageFolder',
                    placeholder: 'attachments',
                    defaultValue: DEFAULT_SETTINGS.imageFolder
                }
            },
            {
                name: 'Filename',
                desc: 'Template for saved images. Available: {{name}}, {{host}}, {{date}}, {{time}}, {{timestamp}}. The file extension is added automatically.',
                visible: enabled,
                control: {
                    type: 'text',
                    key: 'imageFilenameTemplate',
                    placeholder: DEFAULT_SETTINGS.imageFilenameTemplate,
                    defaultValue: DEFAULT_SETTINGS.imageFilenameTemplate,
                    validate: value => (value.trim() ? undefined : 'Enter a template, for example {{name}}')
                }
            },
            {
                name: 'Maximum image size',
                desc: 'Images larger than this are left as a link. Set to 0 for no limit.',
                visible: enabled,
                control: {
                    type: 'slider',
                    key: 'imageMaxSizeMb',
                    min: 0,
                    max: 100,
                    step: 1,
                    defaultValue: DEFAULT_SETTINGS.imageMaxSizeMb,
                    displayFormat: value => (value === 0 ? 'No limit' : `${value} MB`)
                }
            },
            {
                name: 'Download timeout',
                desc: 'Give up on an image that takes longer than this.',
                visible: enabled,
                control: {
                    type: 'slider',
                    key: 'imageTimeoutSeconds',
                    min: 1,
                    max: 120,
                    step: 1,
                    defaultValue: DEFAULT_SETTINGS.imageTimeoutSeconds,
                    displayFormat: value => `${value} s`
                }
            },
            {
                name: 'Image width property',
                desc: 'Frontmatter property that sets how wide images are when pasted into a note. Add it to a note, for example "image-width: 400", and every image pasted there is embedded at that width. Accepts a width or a width and height, such as 400x300. Leave blank to turn this off.',
                visible: enabled,
                control: {
                    type: 'text',
                    key: 'imageSizeProperty',
                    placeholder: DEFAULT_SETTINGS.imageSizeProperty,
                    defaultValue: DEFAULT_SETTINGS.imageSizeProperty
                }
            },
            ...this.list(
                'imageExtensions',
                'Image file types',
                'Extensions accepted as images, separated by commas. Anything else is left as a link.',
                3,
                enabled
            )
        ];
    }

    private urlDefinitions(): SettingDefinition[] {
        const enabled = (): boolean => this.settings.urlEnabled;

        return [
            {
                name: 'Clean pasted URLs',
                desc: 'Remove tracking parameters from links as they are pasted.',
                control: { type: 'toggle', key: 'urlEnabled', defaultValue: DEFAULT_SETTINGS.urlEnabled }
            },
            {
                name: 'Parameters to remove',
                desc: 'Whether to drop every query parameter or only the ones that look like tracking.',
                visible: enabled,
                control: {
                    type: 'dropdown',
                    key: 'urlStripMode',
                    defaultValue: DEFAULT_SETTINGS.urlStripMode,
                    options: {
                        all: 'All parameters, except the exceptions below',
                        tracking: 'Only known tracking parameters'
                    }
                }
            },
            ...this.list(
                'urlDomainRules',
                'Site exceptions',
                'One rule per line. "example.com" keeps every parameter on that site, "example.com: a, b" keeps only a and b. Subdomains are matched automatically.',
                8,
                enabled
            ),
            ...this.list(
                'urlTrackingParams',
                'Tracking parameters',
                'Parameter names to remove, one per line. Use * as a wildcard, for example utm_*.',
                8,
                () => enabled() && this.settings.urlStripMode === 'tracking'
            ),
            ...this.list(
                'urlKeepParams',
                'Always keep these parameters',
                'Parameter names that survive on every site, one per line. Use * as a wildcard.',
                3,
                enabled
            ),
            {
                ...this.toggle(
                    'urlStripTextFragments',
                    'Remove highlight links',
                    'Strip the ":~:text=" fragment that browsers add when you copy a link to highlighted text.'
                ),
                visible: enabled
            },
            {
                ...this.toggle('urlStripAllFragments', 'Remove all anchors', 'Also strip ordinary "#section" anchors from pasted links.'),
                visible: enabled
            },
            {
                ...this.toggle('urlStripTrailingSlash', 'Remove trailing slash', 'Turn "example.com/page/" into "example.com/page".'),
                visible: enabled
            },
            {
                name: 'Try it',
                desc: 'Paste a URL to see what the rules above would keep.',
                searchable: false,
                visible: enabled,
                render: setting => this.renderUrlTester(setting)
            }
        ];
    }

    private terminalDefinitions(): SettingDefinition[] {
        const enabled = (): boolean => this.settings.terminalEnabled;

        return [
            {
                name: 'Clean up text copied from a terminal',
                desc: 'Rejoin paragraphs that the terminal broke across lines and remove the indentation it added.',
                control: { type: 'toggle', key: 'terminalEnabled', defaultValue: DEFAULT_SETTINGS.terminalEnabled }
            },
            {
                ...this.toggle(
                    'terminalUnwrapLines',
                    'Rejoin wrapped lines',
                    'Merge the continuation lines of a paragraph back into one line. Headings, list items, tables and code blocks are never merged.'
                ),
                visible: enabled
            },
            {
                ...this.toggle(
                    'terminalRequireIndent',
                    'Only rejoin indented lines',
                    'Treat a line as a continuation only when it is indented further than the line that started the paragraph. Turning this off rejoins any line that follows a long one, which is more aggressive.'
                ),
                visible: () => enabled() && this.settings.terminalUnwrapLines
            },
            {
                name: 'Minimum line length',
                desc: 'A line counts as wrapped only when the line above it is at least this many characters long.',
                visible: () => enabled() && this.settings.terminalUnwrapLines,
                control: {
                    type: 'slider',
                    key: 'terminalMinWrapWidth',
                    min: 20,
                    max: 200,
                    step: 1,
                    defaultValue: DEFAULT_SETTINGS.terminalMinWrapWidth
                }
            },
            {
                ...this.toggle(
                    'terminalDedent',
                    'Remove leading indentation',
                    'Strip the indentation the terminal added in front of the text.'
                ),
                visible: enabled
            },
            {
                ...this.toggle('terminalStripAnsi', 'Remove colour codes', 'Strip escape sequences such as colours and cursor movement.'),
                visible: enabled
            },
            {
                ...this.toggle('terminalCollapseBlankLines', 'Collapse blank lines', 'Replace runs of blank lines with a single one.'),
                visible: enabled
            },
            {
                ...this.toggle('terminalTrimTrailingWhitespace', 'Trim trailing spaces', 'Remove spaces and tabs from the end of lines.'),
                visible: enabled
            },
            {
                ...this.toggle('terminalPreserveCodeBlocks', 'Preserve code blocks', 'Never touch anything between ``` fences.'),
                visible: enabled
            },
            {
                name: 'Bullets',
                desc: 'What to do with bullet characters such as the ones this text uses.',
                visible: enabled,
                control: {
                    type: 'dropdown',
                    key: 'terminalBulletMode',
                    defaultValue: DEFAULT_SETTINGS.terminalBulletMode,
                    options: {
                        preserve: 'Leave them as they are',
                        markdown: 'Convert to Markdown list items'
                    }
                }
            },
            ...this.list(
                'terminalListMarkers',
                'List markers',
                'Characters that start a list item, separated by commas. A line starting with one of these is never merged into the paragraph above.',
                3,
                enabled
            ),
            {
                name: 'Try it',
                desc: 'Paste terminal output to see how it would be cleaned up.',
                searchable: false,
                visible: enabled,
                render: setting => this.renderTerminalTester(setting)
            }
        ];
    }

    /** Live preview so the effect of the URL rules can be checked without leaving settings. */
    private renderUrlTester(setting: Setting): void {
        const container = setting.settingEl.createDiv({ cls: 'better-paste-preview' });
        const input = container.createEl('input', { type: 'text', attr: { placeholder: URL_SAMPLE } });
        const output = container.createDiv({ cls: 'better-paste-preview-output' });

        const render = (): void => {
            const source = input.value.trim();
            if (!source) {
                output.setText('The cleaned URL appears here.');
                output.addClass('better-paste-preview-empty');
                return;
            }
            output.removeClass('better-paste-preview-empty');
            output.setText(cleanUrl(source, this.settings));
        };

        input.addEventListener('input', render);
        render();
    }

    /** Live preview of the terminal rules, which are easiest to judge by example. */
    private renderTerminalTester(setting: Setting): void {
        const container = setting.settingEl.createDiv({ cls: 'better-paste-preview' });
        const input = container.createEl('textarea', { attr: { placeholder: TERMINAL_SAMPLE, rows: '5' } });
        const output = container.createDiv({ cls: 'better-paste-preview-output' });

        const render = (): void => {
            const source = input.value;
            if (!source.trim()) {
                output.setText('The cleaned text appears here.');
                output.addClass('better-paste-preview-empty');
                return;
            }
            output.removeClass('better-paste-preview-empty');
            output.setText(cleanTerminalText(source, this.settings).text);
        };

        input.addEventListener('input', render);
        render();
    }
}

/** Settings keys whose value is a boolean. */
type BooleanSettingKey = {
    [K in keyof BetterPasteSettings]: BetterPasteSettings[K] extends boolean ? K : never;
}[keyof BetterPasteSettings];
