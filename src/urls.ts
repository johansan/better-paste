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

const REPOSITORY = 'johansan/better-paste';
const RAW_BASE_URL = `https://raw.githubusercontent.com/${REPOSITORY}/main`;

/** Shown on the support row in settings and at the foot of the What's new dialog. */
export const SUPPORT_SPONSOR_URL = 'https://github.com/sponsors/johansan/';
export const SUPPORT_BUY_ME_A_COFFEE_URL = 'https://buymeacoffee.com/johansan';

/** Moment tokens supported by custom image filename formats. */
export const MOMENT_FORMAT_DOCS_URL = 'https://momentjs.com/docs/#/displaying/format/';

/** A plugin's page in Obsidian's community plugin browser, opened by the cards in settings. */
export function communityPluginUrl(id: string): string {
    return `obsidian://show-plugin?id=${id}`;
}

/*
 * Dialog artwork is served from the repository rather than bundled, because Obsidian
 * installs only main.js, manifest.json and styles.css, so a picture sitting beside them
 * would never reach anyone who installed from the community list, and inlining it would
 * carry every past release's artwork in main.js for good. Both dialogs drop the frame
 * when the fetch fails, so they read the same offline.
 */

/** Artwork at the top of the welcome dialog. */
export const WELCOME_IMAGE_URL = `${RAW_BASE_URL}/images/welcome.gif`;

/** Artwork under a version heading in the What's new dialog. `file` names it inside
 *  images/version-banners, extension included, so a banner can be a gif or a jpg. */
export function releaseBannerUrl(file: string): string {
    return `${RAW_BASE_URL}/images/version-banners/${file}`;
}
