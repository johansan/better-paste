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

/** Shown on the support row in settings and at the foot of the What's new dialog. */
export const SUPPORT_SPONSOR_URL = 'https://github.com/sponsors/johansan/';
export const SUPPORT_BUY_ME_A_COFFEE_URL = 'https://buymeacoffee.com/johansan';

/**
 * Artwork for the welcome dialog. Served from the repository rather than bundled, because
 * Obsidian installs only main.js, manifest.json and styles.css, so a file next to them
 * would never reach anyone who installed the plugin from the community list.
 */
export const WELCOME_IMAGE_URL = `https://raw.githubusercontent.com/${REPOSITORY}/main/images/welcome.jpg`;
