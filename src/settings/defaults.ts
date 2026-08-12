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

import type { BetterPasteSettings } from './types';

/**
 * Tracking parameters removed in 'tracking' mode. Entries may use '*' as a wildcard.
 * In 'all' mode this list is unused because every parameter is dropped by default.
 */
export const DEFAULT_TRACKING_PARAMS: string[] = [
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
 * Domains where query parameters carry meaning. A bare domain keeps every parameter;
 * "domain: a, b" keeps only the listed ones. Matching includes subdomains, so
 * "wikipedia.org" also covers "en.wikipedia.org".
 */
export const DEFAULT_DOMAIN_RULES: string[] = [
    '# Sites whose query parameters carry meaning.',
    '# "example.com" keeps every parameter, "example.com: a, b" keeps only a and b.',
    '# Subdomains are matched automatically.',
    'youtube.com: v, t, list, index, start',
    'youtu.be: t, list',
    'vimeo.com: h',
    'twitch.tv: t',
    'news.ycombinator.com: id',
    'google.com: q, tbm, hl',
    'maps.google.com: q, ll, z',
    'scholar.google.com: q, cluster',
    'translate.google.com: sl, tl, text, op',
    'calendar.google.com: eid',
    'docs.google.com',
    'drive.google.com',
    'mail.google.com',
    'bing.com: q',
    'duckduckgo.com: q',
    'wikipedia.org: search, curid, oldid, diff, action',
    'stackoverflow.com: tab',
    'stackexchange.com: tab',
    'github.com: tab, q, w',
    'gitlab.com',
    'zoom.us: pwd',
    'teams.microsoft.com',
    'sharepoint.com',
    'dropbox.com: rlkey, dl',
    'notion.so: p, v',
    'atlassian.net: selectedIssue',
    'figma.com: node-id, t',
    'miro.com: moveToWidget',
    'airtable.com',
    'linear.app',
    'amazon.com: node, k',
    'localhost',
    '127.0.0.1'
];

/** Bullet characters that begin a new list item in terminal output. */
export const DEFAULT_LIST_MARKERS: string[] = ['•', '‣', '▪', '▫', '▸', '◦', '·', '–', '—', '-', '*', '+'];

/** File extensions treated as images when materialising a URL into the vault. */
export const DEFAULT_IMAGE_EXTENSIONS: string[] = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'avif', 'bmp', 'heic', 'tiff'];

export const DEFAULT_SETTINGS: BetterPasteSettings = {
    interceptPaste: true,
    showNotices: true,

    imagesEnabled: true,
    downloadRemoteImages: true,
    downloadDataUriImages: true,
    downloadBareImageUrls: true,
    imageFolderMode: 'obsidian',
    imageFolder: 'attachments',
    imageFilenameTemplate: '{{name}}',
    imageMaxSizeMb: 25,
    imageTimeoutSeconds: 30,
    imageExtensions: [...DEFAULT_IMAGE_EXTENSIONS],
    imageSizeProperty: 'image-width',

    urlEnabled: true,
    urlStripMode: 'all',
    urlTrackingParams: [...DEFAULT_TRACKING_PARAMS],
    urlKeepParams: [],
    urlDomainRules: [...DEFAULT_DOMAIN_RULES],
    urlStripTextFragments: true,
    urlStripAllFragments: false,
    urlStripTrailingSlash: false,

    terminalEnabled: true,
    terminalUnwrapLines: true,
    terminalRequireIndent: true,
    terminalMinWrapWidth: 60,
    terminalDedent: true,
    terminalStripAnsi: true,
    terminalCollapseBlankLines: true,
    terminalTrimTrailingWhitespace: true,
    terminalPreserveCodeBlocks: true,
    terminalBulletMode: 'preserve',
    terminalListMarkers: [...DEFAULT_LIST_MARKERS]
};
