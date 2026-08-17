# Built-in link removals

Last updated: 2026-08-17

This file is the source for the removal lists bundled with Better Paste. Plugin updates can add new entries. Anything not listed in this file stays in the link: a Wall Street Journal gift link keeps `st=gift123`, a shared Slack file keeps `pub_secret`, and a Zoom invite keeps `pwd`.

`*` matches any characters in a parameter name. A site entry also applies to its subdomains. A site ending in `.*` matches country domains such as google.com, google.se and google.co.uk.

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
__s
_bhlid
_ga
_gl
_hsenc
_hsmi
_kx
_openstat
at_campaign
at_medium
awc
cjevent
ck_subscriber_id
dclid
dicbo
elqCampaignId
elqTrackId
epik
fbclid
gad_*
gbraid
gclid
gclsrc
guccounter
guce_referrer
guce_referrer_sig
hsa_*
hsCtaTracking
igsh
igshid
irclickid
li_fat_id
matomo_*
mc_cid
mc_eid
mibextid
mkt_tok
msclkid
mtm_*
oly_anon_id
oly_enc_id
piwik_*
pk_*
pvs
ranEAID
ranMID
ranSiteID
rb_clickid
s_kwcid
sc_campaign
sc_channel
sc_country
sc_geo
sc_outcome
sc_publisher
srsltid
sscid
tblci
ttclid
twclid
utm_*
vero_conv
vero_id
wbraid
WT.mc_id
yclid
zanpid
```

## Extra parameters removed on specific sites

```text
amazon.* | crid, qid, sr, sprefix, ref_*, tag, linkCode, camp, creative, creativeASIN, ascsubtag
apps.apple.com | itsct, itscg, at, ct, mt, pt
bing.com | form, sp, lq, pq, sc, qs, sk, cvid, ghsh, ghacc, ghpl
docs.google.* | usp
drive.google.* | usp
duckduckgo.com | t, atb
linkedin.com | trk, trkCampaign, trackingId, refId, lipi, midToken, originalSubdomain
maps.google.* | entry, g_ep, g_st, usp
medium.com | source
microsoft.com | ocid
open.spotify.com | si
reddit.com | share_source
twitter.com | ref_src, ref_url, s
www.google.* | client, sca_esv, sourceid, ei, ved, uact, oq, gs_lp, sclient, iflsig, bih, biw, pvs, usp
x.com | ref_src, ref_url, s
youtu.be | si
youtube.com | si, feature
```
