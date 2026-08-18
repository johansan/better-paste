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
 * Behaviour that used to be configurable but has exactly one sensible value.
 *
 * These live in code rather than in data.json for two reasons. A setting whose off state
 * only produces damage is not a choice, it is a bug the user can opt into. And reference
 * data stored as user data freezes at first save, so shipped list updates would never
 * reach anyone who had already run the plugin.
 */

/* -------------------------------------------------------------------------- */
/* Images                                                                      */
/* -------------------------------------------------------------------------- */

/** File extensions accepted as images. An unrecognised extension fails safe: the link is left alone. */
export const IMAGE_EXTENSIONS: readonly string[] = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'avif', 'bmp', 'heic', 'tiff', 'ico'];

/** Images larger than this are left as a link. A sanity guard, not a bandwidth control. */
export const MAX_IMAGE_SIZE_MB = 50;

/** How long to wait for an image before giving up and keeping the original link. */
export const IMAGE_TIMEOUT_SECONDS = 30;

/** How long to wait for a page title before leaving the pasted address alone. */
export const LINK_TITLE_TIMEOUT_SECONDS = 10;

/** Filename format used for source names and as the starting custom format. */
export const DEFAULT_IMAGE_NAME_TEMPLATE = '{{name}}';

/* -------------------------------------------------------------------------- */
/* URLs                                                                        */
/* -------------------------------------------------------------------------- */

/** Documentation for writing and sharing custom processing snippets. */
export const SNIPPETS_WIKI_URL = 'https://github.com/johansan/better-paste/wiki/Snippets';

/**
 * Saved regex101 entry with the JavaScript flavor, substitution mode and a Perplexity
 * sample. A permalink rather than URL parameters because the flavor has no parameter
 * and the site would otherwise open its PCRE2 default.
 */
export const REGEX_PLAYGROUND_URL = 'https://regex101.com/r/8sw6Xt/1';

export { LINK_REMOVALS_UPDATED, SHIPPED_PARAM_REMOVALS, SIGNED_URL_PARAM_SETS, TRACKING_PARAMS } from './linkRemovals.generated';

/* -------------------------------------------------------------------------- */
/* Terminal text                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Characters that begin a list item. Deliberately excludes the en and em dash: a line
 * opening with a long dash is far more often prose than a bullet, and treating it as a list item
 * both blocks a legitimate rejoin and corrupts the text when bullets are converted.
 */
export const LIST_MARKERS: readonly string[] = ['•', '‣', '▪', '▫', '▸', '◦', '·', '-', '*', '+'];

/** Shortest line that can plausibly have been broken by a terminal's wrap column. */
export const MIN_WRAP_WIDTH = 60;

/**
 * The same floor for text copied out of a PDF. A two-column layout wraps prose around
 * 45 characters, so the terminal floor would block every rejoin.
 */
export const PDF_MIN_WRAP_WIDTH = 35;

/**
 * How far below the longest line still counts as a full line when inferring the wrap column.
 *
 * A terminal breaks a line when the next word will not fit, so a wrapped line falls short
 * of the wrap column by roughly the length of that word. Measured against real output, the
 * shortfall on wrapped lines runs to about 13 characters while genuinely final lines of a
 * paragraph sit 19 or more below. Twenty-four leaves room for a long word without reaching
 * far enough down to swallow the end of a paragraph.
 */
export const WRAP_TOLERANCE = 24;
