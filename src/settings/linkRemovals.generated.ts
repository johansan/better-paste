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

// Generated from LINK_REMOVALS.md. Edit that file, then run npm run generate:link-removals.

export const LINK_REMOVALS_UPDATED = '2026-08-17';

export const SIGNED_URL_PARAM_SETS = [
    ['X-Amz-Signature'],
    ['X-Goog-Signature'],
    ['sv', 'sig'],
    ['Signature', 'Expires', 'AWSAccessKeyId'],
    ['Signature', 'Expires', 'GoogleAccessId'],
    ['Signature', 'Expires', 'KeyName'],
    ['Signature', 'Expires', 'Key-Pair-Id'],
    ['Signature', 'Policy', 'Key-Pair-Id']
] as const;

export const TRACKING_PARAMS = [
    '__s',
    '_bhlid',
    '_ga',
    '_gl',
    '_hsenc',
    '_hsmi',
    '_kx',
    '_openstat',
    'at_campaign',
    'at_medium',
    'awc',
    'cjevent',
    'ck_subscriber_id',
    'dclid',
    'dicbo',
    'elqCampaignId',
    'elqTrackId',
    'epik',
    'fbclid',
    'gad_*',
    'gbraid',
    'gclid',
    'gclsrc',
    'guccounter',
    'guce_referrer',
    'guce_referrer_sig',
    'hsa_*',
    'hsCtaTracking',
    'igsh',
    'igshid',
    'irclickid',
    'li_fat_id',
    'matomo_*',
    'mc_cid',
    'mc_eid',
    'mibextid',
    'mkt_tok',
    'msclkid',
    'mtm_*',
    'oly_anon_id',
    'oly_enc_id',
    'piwik_*',
    'pk_*',
    'pvs',
    'ranEAID',
    'ranMID',
    'ranSiteID',
    'rb_clickid',
    's_kwcid',
    'sc_campaign',
    'sc_channel',
    'sc_country',
    'sc_geo',
    'sc_outcome',
    'sc_publisher',
    'srsltid',
    'sscid',
    'tblci',
    'ttclid',
    'twclid',
    'utm_*',
    'vero_conv',
    'vero_id',
    'wbraid',
    'WT.mc_id',
    'yclid',
    'zanpid'
] as const;

export const SHIPPED_PARAM_REMOVALS = [
    'amazon.* | crid, qid, sr, sprefix, ref_*, tag, linkCode, camp, creative, creativeASIN, ascsubtag',
    'apps.apple.com | itsct, itscg, at, ct, mt, pt',
    'bing.com | form, sp, lq, pq, sc, qs, sk, cvid, ghsh, ghacc, ghpl',
    'docs.google.* | usp',
    'drive.google.* | usp',
    'duckduckgo.com | t, atb',
    'linkedin.com | trk, trkCampaign, trackingId, refId, lipi, midToken, originalSubdomain',
    'maps.google.* | entry, g_ep, g_st, usp',
    'medium.com | source',
    'microsoft.com | ocid',
    'open.spotify.com | si',
    'reddit.com | share_source',
    'twitter.com | ref_src, ref_url, s',
    'www.google.* | client, sca_esv, sourceid, ei, ved, uact, oq, gs_lp, sclient, iflsig, bih, biw, pvs, usp',
    'x.com | ref_src, ref_url, s',
    'youtu.be | si',
    'youtube.com | si, feature'
] as const;
