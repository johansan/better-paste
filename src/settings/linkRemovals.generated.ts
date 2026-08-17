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
    'irclickid',
    'rb_clickid',
    'zanpid',
    'awc',
    'epik',
    's_kwcid',
    'pvs',
    '__s',
    'gad_*',
    'srsltid',
    'ttclid',
    'mtm_*',
    'hsa_*',
    'mibextid',
    'WT.mc_id',
    '_kx',
    'cjevent',
    'sscid',
    'ranMID',
    'ranEAID',
    'ranSiteID',
    'elqTrackId',
    'elqCampaignId',
    'tblci',
    'dicbo',
    '_openstat',
    'guccounter',
    'guce_referrer',
    'guce_referrer_sig'
] as const;

export const SHIPPED_PARAM_REMOVALS = [
    'youtube.com | si, feature',
    'youtu.be | si',
    'www.google.* | client, sca_esv, sourceid, ei, ved, uact, oq, gs_lp, sclient, iflsig, bih, biw, pvs, usp',
    'maps.google.* | entry, g_ep, g_st, usp',
    'docs.google.* | usp',
    'drive.google.* | usp',
    'amazon.* | crid, qid, sr, sprefix, ref_*, tag, linkCode, camp, creative, creativeASIN, ascsubtag',
    'bing.com | form, sp, lq, pq, sc, qs, sk, cvid, ghsh, ghacc, ghpl',
    'duckduckgo.com | t, atb',
    'linkedin.com | trk, trkCampaign, trackingId, refId, lipi, midToken, originalSubdomain',
    'x.com | ref_src, ref_url, s',
    'twitter.com | ref_src, ref_url, s',
    'reddit.com | share_source',
    'microsoft.com | ocid',
    'apps.apple.com | itsct, itscg, at, ct, mt, pt',
    'open.spotify.com | si',
    'medium.com | source'
] as const;
