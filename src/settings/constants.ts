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

/** Frontmatter property that switches the plugin off for a single note. */
export const DISABLE_PROPERTY = 'better-paste';

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

/** Filename templates behind the "File name format" choice. */
export const FILENAME_TEMPLATES = {
    source: '{{name}}',
    'source-date': '{{name}}-{{date}}',
    'date-time': '{{date}}-{{time}}'
} as const;

/* -------------------------------------------------------------------------- */
/* URLs                                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Parameter names removed in tracking mode. Entries may use '*' as a wildcard.
 * Shipped in code so additions reach existing users on update.
 */
export const TRACKING_PARAMS: readonly string[] = [
    'utm_*',
    '_bhlid',
    'fbclid',
    'gclid',
    'gclsrc',
    'dclid',
    'gbraid',
    'wbraid',
    'msclkid',
    'twclid',
    'yclid',
    'igshid',
    'igsh',
    'mc_cid',
    'mc_eid',
    'mkt_tok',
    '_hsenc',
    '_hsmi',
    'hsCtaTracking',
    'vero_conv',
    'vero_id',
    'oly_anon_id',
    'oly_enc_id',
    'ck_subscriber_id',
    '_ga',
    '_gl',
    'pk_*',
    'piwik_*',
    'matomo_*',
    'at_medium',
    'at_campaign',
    'sc_channel',
    'sc_campaign',
    'sc_geo',
    'sc_country',
    'sc_outcome',
    'sc_publisher',
    'li_fat_id',
    'trk',
    'trkCampaign',
    'irclickid',
    'rb_clickid',
    'zanpid',
    'awc',
    'epik',
    's_kwcid',
    'cmpid',
    'campaign_id',
    'campaignid',
    'adgroupid',
    'adid',
    'ref_src',
    'ref_url',
    'share_source',
    'pvs',
    'usp',
    '__s'
];

/**
 * Sites whose query parameters carry meaning, shipped with the plugin. The user's own
 * rules are merged over these at read time, so this list stays updatable.
 */
export const SHIPPED_DOMAIN_RULES: readonly string[] = [
    'youtube.com | v, t, list, index, start',
    'youtu.be | t, list',
    'vimeo.com | h',
    'twitch.tv | t',
    'news.ycombinator.com | id',
    'google.* | q, tbm, hl',
    'maps.google.* | q, ll, z',
    'scholar.google.* | q, cluster',
    'translate.google.* | sl, tl, text, op',
    'calendar.google.* | eid',
    'docs.google.*',
    'drive.google.*',
    'mail.google.*',
    'bing.com | q',
    'duckduckgo.com | q',
    'wikipedia.org | search, curid, oldid, diff, action, title',
    'stackoverflow.com | tab',
    'stackexchange.com | tab',
    'github.com | tab, q, w',
    'gitlab.com',
    'zoom.us | pwd',
    'teams.microsoft.com',
    'sharepoint.com',
    'dropbox.com | rlkey, dl',
    'notion.so | p, v',
    'atlassian.net | selectedIssue',
    'figma.com | node-id, t',
    'miro.com | moveToWidget',
    'airtable.com',
    'linear.app',
    'amazon.* | node, k',
    'localhost',
    '127.0.0.1'
];

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
 * How far below the longest line still counts as a full line when inferring the wrap column.
 *
 * A terminal breaks a line when the next word will not fit, so a wrapped line falls short
 * of the wrap column by roughly the length of that word. Measured against real output, the
 * shortfall on wrapped lines runs to about 13 characters while genuinely final lines of a
 * paragraph sit 19 or more below. Twenty-four leaves room for a long word without reaching
 * far enough down to swallow the end of a paragraph.
 */
export const WRAP_TOLERANCE = 24;
