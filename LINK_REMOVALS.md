# Built-in link removals

Last updated: 2026-08-17

This file is the source for the removal lists bundled with Better Paste. Plugin updates can add new entries. Anything not listed in this file stays in the link: a Wall Street Journal gift link keeps `st=gift123`, a shared Slack file keeps `pub_secret`, and a Zoom invite keeps `pwd`.

`*` matches any characters in a parameter name. A site entry also applies to its subdomains. A site ending in `.*` matches country domains such as google.com, google.se and google.co.uk. A line starting with `#` is a comment.

Every entry is verified against vendor documentation or a maintained strip list (Firefox, ClearURLs, AdGuard, uBlock Origin, Brave) before it ships. Entries are grouped by vendor and sorted within each group.

## Parameter sets that identify signed URLs

When a URL contains every parameter on one of these lines, Better Paste keeps the URL exactly as copied. Removing any query parameter can invalidate its cryptographic signature.

```text
X-Amz-Signature
X-Goog-Signature
sv, sig
Signature, Expires, AWSAccessKeyId
Signature, Expires, GoogleAccessId
Signature, Expires, KeyName
Signature, Expires, Key-Pair-Id
Signature, Policy, Key-Pair-Id
```

## Tracking parameters removed on every site

```text
# Affiliate networks
awc
cjevent
irclickid
ranEAID
ranMID
ranSiteID
sscid
zanpid

# Analytics platforms
at_campaign
at_medium
matomo_*
mtm_*
piwik_*
pk_campaign
pk_cid
pk_content
pk_cpn
pk_keyword
pk_kwd
pk_medium
pk_source
pk_vid
s_kwcid
WT.mc_id

# Email marketing
_bhlid
ck_subscriber_id
elqCampaignId
mc_cid
mc_eid
mkt_tok
oly_anon_id
oly_enc_id
vero_conv
vero_id

# Google
_ga
_gl
dclid
gad_*
gbraid
gclid
gclsrc
srsltid
utm_*
wbraid

# HubSpot
_hsenc
_hsmi
hsa_acc
hsa_ad
hsa_cam
hsa_grp
hsa_kw
hsa_la
hsa_mt
hsa_net
hsa_ol
hsa_src
hsa_tgt
hsa_ver
hsCtaTracking

# Meta
fbclid
igshid
mibextid

# Other ad platforms
dicbo
epik
li_fat_id
msclkid
rb_clickid
tblci
ttclid
twclid

# Yahoo
guccounter
guce_referrer
guce_referrer_sig

# Yandex
_openstat
yclid
```

## Extra parameters removed on specific sites

```text
amazon.* | crid, qid, sr, sprefix, ref_*, tag, linkCode, camp, creative, creativeASIN, ascsubtag, sc_campaign, sc_channel, sc_country, sc_geo, sc_outcome, sc_publisher
apps.apple.com | itsct, itscg, at, ct, mt, pt
bing.com | form, lq, pq, sc, qs, sk, cvid, ghsh, ghacc, ghpl
docs.google.* | usp
drive.google.* | usp
duckduckgo.com | t, atb
instagram.com | igsh
linkedin.com | trk, trackingId, refId, lipi, originalSubdomain
maps.google.* | entry, g_ep, g_st, usp
medium.com | source
microsoft.com | ocid
open.spotify.com | si
threads.net | igsh
twitter.com | ref_src, ref_url, s
www.google.* | client, sca_esv, sourceid, ei, ved, uact, oq, gs_lp, sclient, iflsig, bih, biw, usp
x.com | ref_src, ref_url, s
youtu.be | si
youtube.com | si, feature
```

## Deliberately left out

Real trackers with a documented functional collision, so removing them can break a pasted link:

- `__s`: Drip subscriber ID, but a functional navigation parameter on UnivIS university sites.
- `_kx`: Klaviyo recipient ID, but Klaviyo unsubscribe and preference pages need it.
- `elqTrackId`: Eloqua link ID, but Eloqua-hosted redirect links break without it.
- `sp` on bing.com: suggestion telemetry in search, but it defines the pins in shared Bing Maps links.
- `midToken` on linkedin.com: email attribution, but confirmation and unsubscribe actions pair it with `midSig`.
- `npnl`: Newspack newsletter link signature, but it is the HMAC-signed pass that lets a newsletter reader through the site's content gate, so gated articles stop opening without it.
