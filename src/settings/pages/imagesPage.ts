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

import type { SettingGroupItem } from 'obsidian';
import { DEFAULT_SETTINGS } from '../defaults';
import { describeWithExample } from './context';
import type { SettingsPageContext } from './context';

/** Rows shown directly under the Images heading on the landing page. */
export function createImageLandingDefinitions(context: SettingsPageContext): SettingGroupItem[] {
    const enabled = (): boolean => context.settings().imagesEnabled;

    return [
        {
            name: 'Save pasted images into the vault',
            desc: 'Keep a local copy of pictures you paste, instead of a link to somebody else’s server. Covers Safari’s "Copy image", pictures inside copied web content, and images embedded in the clipboard. They are filed wherever the vault puts attachments, which is set under Files and links.',
            aliases: ['download', 'attachment', 'safari', 'screenshot', 'picture', 'folder', 'file name', 'filename', 'width', 'size'],
            control: { type: 'toggle', key: 'imagesEnabled', defaultValue: DEFAULT_SETTINGS.imagesEnabled }
        },
        {
            type: 'page',
            name: 'More about images',
            desc: 'File names, image links, and per-note image width.',
            visible: enabled,
            items: createImageOptionsDefinitions()
        }
    ];
}

/** The Image options sub-page. */
function createImageOptionsDefinitions(): SettingGroupItem[] {
    return [
        {
            name: 'File names',
            desc: 'How saved pictures are named. A name taken from the source is the most recognizable, but some sites serve pictures under a meaningless name.',
            control: {
                type: 'dropdown',
                key: 'imageFilenameFormat',
                defaultValue: DEFAULT_SETTINGS.imageFilenameFormat,
                options: {
                    source: 'Name from the source',
                    'source-date': 'Name and date',
                    'date-time': 'Date and time'
                }
            }
        },
        {
            name: 'Pasting a link to an image',
            desc: describeWithExample(
                'Sometimes what you paste is not a page but the picture itself: the address you get from "Copy image address" in a browser, ending in .png or .jpg. This decides what lands in the note.',
                'https://example.com/photo.png'
            ),
            aliases: ['bare url', 'link', 'embed', 'preview', 'address'],
            control: {
                type: 'dropdown',
                key: 'imageLinkPaste',
                defaultValue: DEFAULT_SETTINGS.imageLinkPaste,
                options: {
                    image: 'Save the picture and show it',
                    link: 'Leave the link as it is'
                }
            }
        },
        {
            name: 'Image width property',
            desc: 'The note property that sets how wide pasted images are. With the default, writing "image-width: 400" in a note’s properties embeds every image pasted there at 400 pixels. A note using it also takes screenshot pastes over from Obsidian, since only this plugin can apply the width. Leave blank to switch off.',
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
