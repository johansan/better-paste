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
import { DEFAULT_IMAGE_FILENAME_TEMPLATE } from '../constants';
import { applyFileNameTemplate, buildFileNameTokens } from '../../utils/filenames';
import type { SettingsPageContext } from './context';

const FILENAME_EXAMPLE_URL = 'https://images.example.com/2026/05/skyline-8f21a.jpg';
const FILENAME_EXAMPLE_DATE = new Date(2026, 7, 13, 14, 5, 6);

/**
 * Shows the rule by example, with the part of the address that is dropped struck through.
 * What is left is the file name, which is what the default naming format saves it as.
 *
 * Built with plain DOM calls and guarded, because the settings definitions are also read
 * outside a browser by the tests.
 */
function savingExample(): string | DocumentFragment {
    const lead =
        'Saves pasted pictures as local files rather than leaving external image links. This includes Safari\'s "Copy image", pictures inside copied web content, and standalone image addresses. Images are saved to your vault attachment folder. With "Name from source":';
    const address = 'https://images.example.com/2026/05/';
    const file = 'skyline-8f21a.jpg';
    const query = '?auto=format&w=2400';

    if (typeof createFragment === 'undefined') return `${lead} ${address}${file}${query}`;

    return createFragment(fragment => {
        fragment.appendText(lead);
        const example = fragment.createDiv({ cls: 'better-paste-example' });
        example.createSpan({ cls: 'better-paste-example-removed', text: address });
        example.createSpan({ text: file });
        example.createSpan({ cls: 'better-paste-example-removed', text: query });
    });
}

/** Custom filename format with the same one-line example used by the real save path. */
function renderCustomFilenameFormat(setting: Setting, context: SettingsPageContext): void {
    setting.setName('Custom format');
    setting.settingEl.addClass('better-paste-filename-format');
    setting.descEl.appendText('Use {{name}} for the source name and Moment date formats such as YYYY-MM-DD.');
    const example = setting.descEl.createDiv({ cls: 'better-paste-example' });

    const renderExample = (template: string): void => {
        const tokens = buildFileNameTokens(FILENAME_EXAMPLE_URL);
        const baseName = applyFileNameTemplate(template, tokens, FILENAME_EXAMPLE_DATE);
        example.setText(`Example: ${baseName}.jpg`);
    };

    setting.addText(text => {
        text.setPlaceholder(DEFAULT_IMAGE_FILENAME_TEMPLATE)
            .setValue(context.settings().imageFilenameTemplate)
            .onChange(value => {
                const template = value.trim() || DEFAULT_IMAGE_FILENAME_TEMPLATE;
                context.settings().imageFilenameTemplate = template;
                renderExample(template);
                return context.saveSettings();
            });
    });
    renderExample(context.settings().imageFilenameTemplate);
}

/** Rows shown directly under the Images heading on the landing page. */
export function createImageLandingDefinitions(context: SettingsPageContext): SettingGroupItem[] {
    const enabled = (): boolean => context.settings().imagesEnabled;

    return [
        {
            name: 'Save pasted images into the vault',
            desc: savingExample(),
            aliases: ['download', 'attachment', 'safari', 'screenshot', 'picture', 'folder', 'file name', 'filename', 'width', 'size'],
            control: { type: 'toggle', key: 'imagesEnabled', defaultValue: DEFAULT_SETTINGS.imagesEnabled }
        },
        {
            type: 'page',
            name: 'Image handling',
            desc: 'File names and per-note image width.',
            visible: enabled,
            items: createImageOptionsDefinitions(context)
        }
    ];
}

/** The Image options sub-page. */
function createImageOptionsDefinitions(context: SettingsPageContext): SettingGroupItem[] {
    return [
        {
            name: 'File names',
            desc: 'Choose how saved image files are named.',
            control: {
                type: 'dropdown',
                key: 'imageFilenameFormat',
                defaultValue: DEFAULT_SETTINGS.imageFilenameFormat,
                options: {
                    source: 'Name from source',
                    custom: 'Custom format'
                }
            }
        },
        {
            name: 'Custom format',
            aliases: ['name', 'filename', 'date', 'moment', 'YYYY', '{{name}}'],
            visible: () => context.settings().imageFilenameFormat === 'custom',
            render: setting => renderCustomFilenameFormat(setting, context)
        },
        {
            name: 'Image width property',
            desc: 'The frontmatter property that defines the width of images pasted into a note. A note using this property takes screenshot pastes over from Obsidian. Leave blank to disable.',
            aliases: ['size', 'frontmatter', 'property', 'resize'],
            control: {
                type: 'text',
                key: 'imageSizeProperty',
                placeholder: DEFAULT_SETTINGS.imageSizeProperty,
                defaultValue: DEFAULT_SETTINGS.imageSizeProperty
            }
        }
    ];
}
