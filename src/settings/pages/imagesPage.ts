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

import type { DropdownComponent, Setting, SettingDefinitionItem, SettingGroupItem } from 'obsidian';
import { DEFAULT_SETTINGS } from '../defaults';
import { DEFAULT_IMAGE_NAME_TEMPLATE } from '../constants';
import { applyFileNameTemplate, buildFileNameTokens } from '../../utils/filenames';
import { aliases, format, strings } from '../../i18n';
import { parseCommaList } from '../normalize';
import { MOMENT_FORMAT_DOCS_URL } from '../../urls';
import type { SettingsPageContext } from './context';

/** Example lists shown while an options field is empty. */
const SIZE_OPTIONS_PLACEHOLDER = '200, 400, 600';
const CLASS_OPTIONS_PLACEHOLDER = 'invert, invertW';

const FILENAME_EXAMPLE_URL = 'https://images.example.com/2026/05/skyline-8f21a.jpg';
const FILENAME_EXAMPLE_DATE = new Date(2026, 7, 13, 14, 5, 6);

/** The three parts of the example address, which read the same in every language. */
const SAVING_EXAMPLE_ADDRESS = 'https://images.example.com/2026/05/';
const SAVING_EXAMPLE_FILE = 'skyline-8f21a.jpg';
const SAVING_EXAMPLE_QUERY = '?auto=format&w=2400';
const FILE_LINK_EXAMPLE_RESULT = '[[Document.pdf]]';

/**
 * Shows what the selected mode leaves in the note. Download derives the file name from
 * the address, so the dropped parts are struck through and what remains is the name
 * inside the embed.
 *
 * Built with plain DOM calls and guarded, because the settings definitions are also read
 * outside a browser by the tests.
 */
function savingExample(mode: 'off' | 'link' | 'download'): string | DocumentFragment {
    const text = strings.settings.images;
    const address = `${SAVING_EXAMPLE_ADDRESS}${SAVING_EXAMPLE_FILE}${SAVING_EXAMPLE_QUERY}`;
    const lead = mode === 'download' ? `${text.savingDesc} ${text.savingDownloadDesc}` : text.savingDesc;

    if (typeof createFragment === 'undefined') {
        return format(strings.settings.plainFallback, {
            description: lead,
            example: mode === 'link' ? `![](${address})` : mode === 'download' ? `![[${SAVING_EXAMPLE_FILE}]]` : address
        });
    }

    return createFragment(fragment => {
        fragment.appendText(lead);
        const example = fragment.createDiv({ cls: 'better-paste-example' });
        if (mode === 'download') {
            example.createSpan({ text: '![[' });
            example.createSpan({ cls: 'better-paste-example-removed', text: SAVING_EXAMPLE_ADDRESS });
            example.createSpan({ text: SAVING_EXAMPLE_FILE });
            example.createSpan({ cls: 'better-paste-example-removed', text: SAVING_EXAMPLE_QUERY });
            example.createSpan({ text: ']]' });
        } else {
            example.createSpan({ text: mode === 'link' ? `![](${address})` : address });
        }
    });
}

/** Shows what the selected mode makes of a pasted file embed. */
function fileModeDescription(mode: 'off' | 'link'): string | DocumentFragment {
    const text = strings.settings.images;
    const result = mode === 'link' ? FILE_LINK_EXAMPLE_RESULT : `!${FILE_LINK_EXAMPLE_RESULT}`;
    const example = `!${FILE_LINK_EXAMPLE_RESULT} → ${result}`;
    if (typeof createFragment === 'undefined') {
        return format(strings.settings.exampleFallback, { description: text.fileModeDesc, example });
    }

    return createFragment(fragment => {
        fragment.appendText(text.fileModeDesc);
        fragment.createDiv({ cls: 'better-paste-example', text: example });
    });
}

/** Filename format field with the same one-line example used by the real save path. */
function renderCustomFilenameFormat(setting: Setting, context: SettingsPageContext): void {
    const text = strings.settings.images;

    setting.setName(text.nameFormatName);
    setting.settingEl.addClass('better-paste-filename-format');
    setting.descEl.appendText(text.customDesc);
    setting.descEl.createEl('br');
    const momentLink = setting.descEl.createEl('a', { text: text.customMomentLink, href: MOMENT_FORMAT_DOCS_URL });
    momentLink.setAttr('rel', 'noopener noreferrer');
    momentLink.setAttr('target', '_blank');
    // The screenshot rule stands apart from the token list, so it gets its own paragraph
    setting.descEl.createEl('br');
    setting.descEl.createEl('br');
    setting.descEl.appendText(text.customScreenshotDesc);
    const example = setting.descEl.createDiv({ cls: 'better-paste-example' });

    const renderExample = (template: string): void => {
        // The note name and property tokens show sample values, and a counter shows its
        // first number, so the example stays honest for any template
        const tokens = {
            ...buildFileNameTokens(FILENAME_EXAMPLE_URL),
            noteName: text.customExampleNote,
            property: (key: string) => key
        };
        const baseName = applyFileNameTemplate(template, tokens, FILENAME_EXAMPLE_DATE);
        example.setText(format(text.customExample, { value: `${baseName}.jpg` }));
    };

    setting.addText(text => {
        text.setPlaceholder(DEFAULT_IMAGE_NAME_TEMPLATE)
            .setValue(context.settings().imageNameTemplate)
            .onChange(value => {
                const template = value.trim() || DEFAULT_IMAGE_NAME_TEMPLATE;
                context.settings().imageNameTemplate = template;
                renderExample(template);
                return context.saveSettings();
            });
    });
    renderExample(context.settings().imageNameTemplate);
}

/** Fills a choice dropdown with none, the offered values, and ask. */
function populateChoiceDropdown(dropdown: DropdownComponent, options: string, choice: string): void {
    const text = strings.settings.images;
    const values = parseCommaList(options);
    dropdown.selectEl.empty();
    dropdown.addOption('', text.choiceNone);
    for (const value of values) dropdown.addOption(value, value);
    // Ask is only offered while there is something to pick, because with an empty list
    // the dialog would have nothing to show
    if (values.length > 0) dropdown.addOption('ask', text.choiceAsk);
    // A stored choice whose value was removed from the list displays as none but is not
    // rewritten, so typing the value back restores it
    dropdown.setValue((choice === 'ask' && values.length > 0) || values.includes(choice) ? choice : '');
}

/** The label a stored choice shows on the landing row, or '' when it resolves to none. */
function choiceLabel(choice: string, options: string): string {
    const values = parseCommaList(options);
    if (choice === 'ask' && values.length > 0) return strings.settings.images.summaryAsk;
    return values.includes(choice) ? choice : '';
}

/**
 * Rows shown under the Attachments heading. The saving choice governs web images only;
 * naming and decoration also reach clipboard images, so those rows are always visible.
 */
export function createImageLandingDefinitions(context: SettingsPageContext): SettingGroupItem[] {
    const text = strings.settings.images;

    return [
        {
            name: text.savingName,
            desc: savingExample(context.settings().imageMode),
            aliases: aliases(source => source.settings.images.savingAliases),
            render: setting => {
                setting.setName(text.savingName);
                setting.setDesc(savingExample(context.settings().imageMode));
                setting.addDropdown(dropdown => {
                    dropdown.addOption('off', text.savingChoiceOff);
                    dropdown.addOption('link', text.savingChoiceLink);
                    dropdown.addOption('download', text.savingChoiceDownload);
                    dropdown.setValue(context.settings().imageMode);
                    dropdown.onChange(value => {
                        if (value !== 'off' && value !== 'link' && value !== 'download') return;
                        context.settings().imageMode = value;
                        setting.setDesc(savingExample(value));
                        return context.saveSettings();
                    });
                });
            }
        },
        {
            name: text.fileModeName,
            desc: fileModeDescription(context.settings().fileMode),
            aliases: aliases(source => source.settings.images.fileModeAliases),
            render: setting => {
                setting.setName(text.fileModeName);
                setting.setDesc(fileModeDescription(context.settings().fileMode));
                setting.addDropdown(dropdown => {
                    dropdown.addOption('off', text.fileModeChoiceOff);
                    dropdown.addOption('link', text.fileModeChoiceLink);
                    dropdown.setValue(context.settings().fileMode);
                    dropdown.onChange(value => {
                        if (value !== 'off' && value !== 'link') return;
                        context.settings().fileMode = value;
                        setting.setDesc(fileModeDescription(value));
                        return context.saveSettings();
                    });
                });
            }
        },
        {
            name: text.nameFormatName,
            aliases: aliases(source => source.settings.images.customAliases),
            render: setting => renderCustomFilenameFormat(setting, context)
        },
        {
            type: 'page',
            name: text.sizeStyleName,
            desc: text.sizeStyleDesc,
            aliases: aliases(source => source.settings.images.sizeStyleAliases),
            displayValue: () => {
                const settings = context.settings();
                const size = choiceLabel(settings.imageSizeChoice, settings.imageSizeOptions);
                const style = choiceLabel(settings.imageClassChoice, settings.imageClassOptions);
                const parts = [
                    size ? format(text.summarySize, { value: size }) : '',
                    style ? format(text.summaryStyle, { value: style }) : ''
                ].filter(part => part !== '');
                return parts.length > 0 ? parts.join(', ') : text.choiceNone;
            },
            items: createSizeStylePageDefinitions(context)
        }
    ];
}

/** The width and CSS class rows, on their own page because most vaults never touch them. */
function createSizeStylePageDefinitions(context: SettingsPageContext): SettingDefinitionItem[] {
    const text = strings.settings.images;

    // Each options field rebuilds its dropdown while it is edited, so a value can be
    // picked right after it is typed without reopening the settings tab
    let refreshSizeChoices: (() => void) | undefined;
    let refreshClassChoices: (() => void) | undefined;

    return [
        {
            name: text.sizeChoiceName,
            aliases: aliases(source => source.settings.images.sizeChoiceAliases),
            render: setting => {
                setting.setName(text.sizeChoiceName);
                setting.setDesc(text.sizeChoiceDesc);
                setting.addDropdown(dropdown => {
                    dropdown.onChange(value => {
                        context.settings().imageSizeChoice = value;
                        // The landing row's summary names this choice, so it must rebuild
                        context.update();
                        return context.saveSettings();
                    });
                    const populate = (): void =>
                        populateChoiceDropdown(dropdown, context.settings().imageSizeOptions, context.settings().imageSizeChoice);
                    populate();
                    refreshSizeChoices = populate;
                });
            }
        },
        {
            name: text.sizeOptionsName,
            aliases: aliases(source => source.settings.images.sizeChoiceAliases),
            render: setting => {
                setting.setName(text.sizeOptionsName);
                setting.setDesc(text.sizeOptionsDesc);
                setting.addText(input => {
                    input
                        .setPlaceholder(SIZE_OPTIONS_PLACEHOLDER)
                        .setValue(context.settings().imageSizeOptions)
                        .onChange(value => {
                            context.settings().imageSizeOptions = value;
                            refreshSizeChoices?.();
                            return context.saveSettings();
                        });
                });
            }
        },
        // A setting rather than a constant: the name has to coexist with whatever the
        // vault already puts in frontmatter, and the plugin ships as a bundle, so a
        // fixed name would leave no way out. Blank switches the property off.
        {
            name: text.sizePropertyName,
            desc: context.dynamicDescription('imageSizeProperty'),
            aliases: aliases(source => source.settings.images.sizePropertyAliases),
            control: {
                type: 'text',
                key: 'imageSizeProperty',
                placeholder: DEFAULT_SETTINGS.imageSizeProperty,
                defaultValue: DEFAULT_SETTINGS.imageSizeProperty
            }
        },
        {
            name: text.classChoiceName,
            aliases: aliases(source => source.settings.images.classChoiceAliases),
            render: setting => {
                setting.setName(text.classChoiceName);
                setting.setDesc(text.classChoiceDesc);
                setting.addDropdown(dropdown => {
                    dropdown.onChange(value => {
                        context.settings().imageClassChoice = value;
                        // The landing row's summary names this choice, so it must rebuild
                        context.update();
                        return context.saveSettings();
                    });
                    const populate = (): void =>
                        populateChoiceDropdown(dropdown, context.settings().imageClassOptions, context.settings().imageClassChoice);
                    populate();
                    refreshClassChoices = populate;
                });
            }
        },
        {
            name: text.classOptionsName,
            aliases: aliases(source => source.settings.images.classChoiceAliases),
            render: setting => {
                setting.setName(text.classOptionsName);
                setting.setDesc(text.classOptionsDesc);
                setting.addText(input => {
                    input
                        .setPlaceholder(CLASS_OPTIONS_PLACEHOLDER)
                        .setValue(context.settings().imageClassOptions)
                        .onChange(value => {
                            context.settings().imageClassOptions = value;
                            refreshClassChoices?.();
                            return context.saveSettings();
                        });
                });
            }
        }
    ];
}
