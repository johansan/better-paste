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
    'awc',
    'cjevent',
    'irclickid',
    'ranEAID',
    'ranMID',
    'ranSiteID',
    'sscid',
    'zanpid',
    'at_campaign',
    'at_medium',
    'matomo_*',
    'mtm_*',
    'piwik_*',
    'pk_campaign',
    'pk_cid',
    'pk_content',
    'pk_cpn',
    'pk_keyword',
    'pk_kwd',
    'pk_medium',
    'pk_source',
    'pk_vid',
    's_kwcid',
    'WT.mc_id',
    '_bhlid',
    'ck_subscriber_id',
    'elqCampaignId',
    'mc_cid',
    'mc_eid',
    'mkt_tok',
    'oly_anon_id',
    'oly_enc_id',
    'vero_conv',
    'vero_id',
    '_ga',
    '_gl',
    'dclid',
    'gad_*',
    'gbraid',
    'gclid',
    'gclsrc',
    'srsltid',
    'utm_*',
    'wbraid',
    '_hsenc',
    '_hsmi',
    'hsa_acc',
    'hsa_ad',
    'hsa_cam',
    'hsa_grp',
    'hsa_kw',
    'hsa_la',
    'hsa_mt',
    'hsa_net',
    'hsa_ol',
    'hsa_src',
    'hsa_tgt',
    'hsa_ver',
    'hsCtaTracking',
    'fbclid',
    'igshid',
    'mibextid',
    'dicbo',
    'epik',
    'li_fat_id',
    'msclkid',
    'rb_clickid',
    'tblci',
    'ttclid',
    'twclid',
    'guccounter',
    'guce_referrer',
    'guce_referrer_sig',
    '_openstat',
    'yclid'
] as const;

export const SHIPPED_PARAM_REMOVALS = [
    'amazon.* | crid, qid, sr, sprefix, ref_*, tag, linkCode, camp, creative, creativeASIN, ascsubtag, sc_campaign, sc_channel, sc_country, sc_geo, sc_outcome, sc_publisher',
    'apps.apple.com | itsct, itscg, at, ct, mt, pt',
    'bing.com | form, lq, pq, sc, qs, sk, cvid, ghsh, ghacc, ghpl',
    'docs.google.* | usp',
    'drive.google.* | usp',
    'duckduckgo.com | t, atb',
    'instagram.com | igsh',
    'linkedin.com | trk, trackingId, refId, lipi, originalSubdomain',
    'maps.google.* | entry, g_ep, g_st, usp',
    'medium.com | source',
    'microsoft.com | ocid',
    'open.spotify.com | si',
    'threads.net | igsh',
    'twitter.com | ref_src, ref_url, s',
    'www.google.* | client, sca_esv, sourceid, ei, ved, uact, oq, gs_lp, sclient, iflsig, bih, biw, usp',
    'x.com | ref_src, ref_url, s',
    'youtu.be | si',
    'youtube.com | si, feature'
] as const;
