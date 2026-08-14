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

import type { Setting, SettingGroupItem } from 'obsidian';
import { DEFAULT_SETTINGS } from '../defaults';
import { DEFAULT_IMAGE_NAME_TEMPLATE } from '../constants';
import { applyFileNameTemplate, buildFileNameTokens } from '../../utils/filenames';
import { aliases, format, strings } from '../../i18n';
import { MOMENT_FORMAT_DOCS_URL } from '../../urls';
import type { SettingsPageContext } from './context';

const FILENAME_EXAMPLE_URL = 'https://images.example.com/2026/05/skyline-8f21a.jpg';
const FILENAME_EXAMPLE_DATE = new Date(2026, 7, 13, 14, 5, 6);

/** The three parts of the example address, which read the same in every language. */
const SAVING_EXAMPLE_ADDRESS = 'https://images.example.com/2026/05/';
const SAVING_EXAMPLE_FILE = 'skyline-8f21a.jpg';
const SAVING_EXAMPLE_QUERY = '?auto=format&w=2400';

/**
 * Shows the rule by example, with the part of the address that is dropped struck through.
 * What is left is the file name, which is what the default naming format saves it as.
 *
 * Built with plain DOM calls and guarded, because the settings definitions are also read
 * outside a browser by the tests.
 */
function savingExample(): string | DocumentFragment {
    const lead = strings.settings.images.savingDesc;

    if (typeof createFragment === 'undefined') {
        return format(strings.settings.plainFallback, {
            description: lead,
            example: `${SAVING_EXAMPLE_ADDRESS}${SAVING_EXAMPLE_FILE}${SAVING_EXAMPLE_QUERY}`
        });
    }

    return createFragment(fragment => {
        fragment.appendText(lead);
        const example = fragment.createDiv({ cls: 'better-paste-example' });
        example.createSpan({ cls: 'better-paste-example-removed', text: SAVING_EXAMPLE_ADDRESS });
        example.createSpan({ text: SAVING_EXAMPLE_FILE });
        example.createSpan({ cls: 'better-paste-example-removed', text: SAVING_EXAMPLE_QUERY });
    });
}

/** Custom filename format with the same one-line example used by the real save path. */
function renderCustomFilenameFormat(setting: Setting, context: SettingsPageContext): void {
    const text = strings.settings.images;

    setting.setName(text.customName);
    setting.settingEl.addClass('better-paste-filename-format');
    setting.descEl.appendText(text.customDesc);
    setting.descEl.createEl('br');
    const momentLink = setting.descEl.createEl('a', { text: text.customMomentLink, href: MOMENT_FORMAT_DOCS_URL });
    momentLink.setAttr('rel', 'noopener noreferrer');
    momentLink.setAttr('target', '_blank');
    const example = setting.descEl.createDiv({ cls: 'better-paste-example' });

    const renderExample = (template: string): void => {
        const tokens = buildFileNameTokens(FILENAME_EXAMPLE_URL);
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

/** Rows shown directly under the Images heading on the landing page. */
export function createImageLandingDefinitions(context: SettingsPageContext): SettingGroupItem[] {
    const enabled = (): boolean => context.settings().imageEnabled;

    const text = strings.settings.images;

    return [
        {
            name: text.savingName,
            desc: savingExample(),
            aliases: aliases(source => source.settings.images.savingAliases),
            control: { type: 'toggle', key: 'imageEnabled', defaultValue: DEFAULT_SETTINGS.imageEnabled }
        },
        {
            type: 'page',
            name: text.pageName,
            desc: text.pageDesc,
            visible: enabled,
            items: createImageOptionsDefinitions(context)
        }
    ];
}

/** The Image options sub-page. */
function createImageOptionsDefinitions(context: SettingsPageContext): SettingGroupItem[] {
    const text = strings.settings.images;

    return [
        {
            name: text.nameFormatName,
            desc: text.nameFormatDesc,
            control: {
                type: 'dropdown',
                key: 'imageNameFormat',
                defaultValue: DEFAULT_SETTINGS.imageNameFormat,
                options: {
                    source: text.nameFormatSource,
                    custom: text.nameFormatCustom
                }
            }
        },
        {
            name: text.customName,
            aliases: aliases(source => source.settings.images.customAliases),
            visible: () => context.settings().imageNameFormat === 'custom',
            render: setting => renderCustomFilenameFormat(setting, context)
        },
        {
            name: text.sizePropertyName,
            desc: text.sizePropertyDesc,
            aliases: aliases(source => source.settings.images.sizePropertyAliases),
            control: {
                type: 'text',
                key: 'imageSizeProperty',
                placeholder: DEFAULT_SETTINGS.imageSizeProperty,
                defaultValue: DEFAULT_SETTINGS.imageSizeProperty
            }
        }
    ];
}
