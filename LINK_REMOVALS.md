# Built-in link removals

Last updated: 2026-08-17

This file is the source for the removal lists bundled with Better Paste. Plugin updates can add new entries. Unknown parameters stay in the link.

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
utm_*
_bhlid
fbclid
gclid
gclsrc
dclid
gbraid
wbraid
msclkid
twclid
yclid
igshid
igsh
mc_cid
mc_eid
mkt_tok
_hsenc
_hsmi
hsCtaTracking
vero_conv
vero_id
oly_anon_id
oly_enc_id
ck_subscriber_id
_ga
_gl
pk_*
piwik_*
matomo_*
at_medium
at_campaign
sc_channel
sc_campaign
sc_geo
sc_country
sc_outcome
sc_publisher
li_fat_id
irclickid
rb_clickid
zanpid
awc
epik
s_kwcid
pvs
__s
gad_*
srsltid
ttclid
mtm_*
hsa_*
mibextid
WT.mc_id
_kx
cjevent
sscid
ranMID
ranEAID
ranSiteID
elqTrackId
elqCampaignId
tblci
dicbo
_openstat
guccounter
guce_referrer
guce_referrer_sig
```

## Extra parameters removed on specific sites

```text
youtube.com | si, feature
youtu.be | si
www.google.* | client, sca_esv, sourceid, ei, ved, uact, oq, gs_lp, sclient, iflsig, bih, biw, pvs, usp
maps.google.* | entry, g_ep, g_st, usp
docs.google.* | usp
drive.google.* | usp
amazon.* | crid, qid, sr, sprefix, ref_*, tag, linkCode, camp, creative, creativeASIN, ascsubtag
bing.com | form, sp, lq, pq, sc, qs, sk, cvid, ghsh, ghacc, ghpl
duckduckgo.com | t, atb
linkedin.com | trk, trkCampaign, trackingId, refId, lipi, midToken, originalSubdomain
x.com | ref_src, ref_url, s
twitter.com | ref_src, ref_url, s
reddit.com | share_source
microsoft.com | ocid
apps.apple.com | itsct, itscg, at, ct, mt, pt
open.spotify.com | si
medium.com | source
```

Unknown parameters stay in the URL. This keeps access tokens on shared files and gift links without requiring rules for individual services.
