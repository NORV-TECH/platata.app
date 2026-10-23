# Hand-back to the architect (23 Oct 2026)

From: the services builder (took over your `handoff/HANDOFF.md` on 22 Oct, 11:00 AM PT).
To: the architect, through Monti.
Branch: `demo-studio` only, folder `demo-studio/` only. Last commit: see `git log -1` (after 15bd645). Nothing published, nothing deployed,
`main` untouched, the app repo never edited (read only, newest commit seen d30ffa1).

**Status in one line:** every item of HANDOFF.md is done or on hold. Work stopped (Monti, 23 Oct) because what is left needs the coder, who
is not available. Monti will say when the coder is back.

The full detail is in `handoff/REPORT.md` (kept up to date). This file is the short version.

---

## 1. What I finished

### Services (HANDOFF items 1–4)
- **Data kit:** `kit/services-data.js` + `kit/vkit.js` (4 businesses: Peluquería, Veterinaria, Taller de motos, Uñas × 10 countries; the app's own
  catalogue copied by `tools/make_services_catalog.py`).
- **31 demo pages built:** V1–V8 and VS1–VS24 except VS20, in `demos/servicios/`. Every page also plays for the other three businesses (`&biz=`) and
  all Spanish countries + Brazil.
- **Independent review:** 8 reviews (`handoff/research/services/REVIEW-*.md`), 48 MUSTs found, all fixed.
- **Voices:** made for all of them (es Colombia, pt Brazil, and `-MX` es where Mexico's screens differ: V1, V2, VS5, VS6, VS18).
- **Videos:** 20 final. 45 recorded, found to show the app's cut tile prices, and taken out (voices kept) — see section 2.
- **Demo tree:** services section in `tools/tree_restaurant.py`, `index.html` regenerated.

### Mexico cards (HANDOFF item 6)
- **RS5-MX** (restaurant, Tap to Pay with tip) and **TS5-MX** (shop, Tap to Pay, no tip): final videos `video/RS5-MX-es.mp4`, `video/TS5-MX-es.mp4`.
- **RS25-MX "Cobrar con enlace"** (new shared feature S25, Mexico/US/Canada): final video `video/RS25-MX-es.mp4`. The phone can't read cards by
  tapping (Android 12) → the app's red notice → Continuar → tip → QR page with the total → the customer pays on his own phone (a plain stand-in
  card; Stripe's page is never drawn) → the sale closes by itself.
- **Store picture "Acepta tarjetas"** (Mexico, tap version): `store/accept-cards-MX.png` (made from `store/accept-cards-MX.html` with
  `tools/render_store.py`). Generic card, no brand. **Colombia version held:** the camera card scan is not built in the app.
- **Brazil Pix line:** checked. The only Brazil videos that open the Pix QR (RS4, TS4, VS4, VS6, VS7) already say the QR carries the total. Nothing
  to re-record.
- **Every restaurant and shop page now shows Mexico with the Stripe card** (33 pages + both kits: MX `pay.card = "stripe"`). Colombia, Brazil, US,
  Canada and Peru play exactly as before (proven page by page).
- **Tree:** cards (S5) offered in Mexico for every business; new feature S25 "Cobrar con enlace" (MX, US, CA); a Mexico card video never falls back
  to Colombia's Wompi video (no Mexico video = no video).
- Independent review: `handoff/research/mexico/REVIEW-MX1.md` (2 MUST, both fixed).

### New tools (in `tools/`)
- `timing_frames.py <ID> es:CO pt:BR` — frames inside every voice line with the real clip lengths (check before recording).
- `cut_price_scan.py [IDs]` — finds cut tile prices in the services videos.
- `render_store.py` — renders the store pictures to PNG.

---

## 2. What I need to continue (all from the coder, through Monti)

Two lists are ready for Monti to pass to the coder:
- `handoff/research/services/CODER-PROMPTS-SERVICES-ROUND2.md` — 10 blocking, 42 small, 1 US/CA.
- `handoff/research/mexico/CODER-PROMPTS-MEXICO.md` — 2 bugs, 1 question, doc drift.

What each fix unblocks:

| Coder fix | Unblocks |
|---|---|
| **Services round 2, item 2: service tile prices are cut** (`ProductCard.kt:307-330`, ShrinkToFitText stops at 12 sp then "…", minutes on the same row) | **45 services videos**, listed in REPORT.md "Waiting for the tile-price fix". Voices are made; only re-recording is needed. Also VS5-MX. |
| Services round 2, item 3: Portuguese WhatsApp text (`appt_wa_when`) | V5 Brazil video |
| Services round 2, items 8, 13, 12 ("2 servicios" strip; "Atendió" on a future booking; raw "+573001234567") | re-record V7; V3, V4, V6; V4, V5, VS7 after those land |
| Mexico item 1: the Card hint "Por enlace · QR o WhatsApp" is cut when QR is on | nothing held (RS25 uses a shop without QR); a Mexico link video with QR on |
| Mexico item 3: a phone with no NFC is told "ESTE TELÉFONO NO PUEDE COBRAR CON TARJETA" while it can charge by link | nothing held (RS25 uses an Android 12 phone) |

**How to resume, once the tile fix is in the newest `sim/usa-canada` commit:** for each held video:
`tools/timing_frames.py <ID> es:CO pt:BR` (look at the frames) → `tools/record_video.py <ID> es:CO pt:BR` (and `<ID>-MX es:MX`) →
`tools/cut_price_scan.py <ID>` → commit → regenerate the tree (`tools/tree_restaurant.py`) → update REPORT.md.
Playwright must be 1.56.0 here (`pip install playwright==1.56.0`).

---

## 3. Points for you (the architect)

- **Tap to Pay is still Stripe's practice reader** (`sync/TapToPayMode.kt:25` `REAL_TAP_TO_PAY = false`). No real card can be charged yet in Mexico
  or the US. The tap videos show the flow the app is built for. When real Tap to Pay ships, re-check the tap pages (Stripe's own tap screen may
  cover "Acerca la tarjeta").
- **"Cobrar así cuesta un poco más que acercar la tarjeta"** (`link_notice_cost`) shows on the Mexico link screen. Platata takes no fee in Mexico, so the
  line rests only on Stripe's Mexican rates; never confirmed for Mexico. Mexico list, item 4. The voice never talks about cost.
- **Mexico card surcharge** (from Monti, 22 Oct): the "Cargo por tarjeta de crédito" discount idea is offered in Mexico, where a card surcharge may
  not be allowed. Monti: leave it as is, no research; a point for when Mexico is looked at.
- **A Tap to Pay sale shows no card line** ("VISA ••4242") on Sale complete or the receipt (`StripePaymentActions.kt:41-42`, "null in v1"); a link
  sale does. Already on the services list (item 7).
- **For when US/CA resume:** the restaurant/shop pages print the Canadian receipt date day-first; the app writes it month-first for Canada too
  (`utils/ReceiptFormatter.kt:186-187`).
- **Publishing:** nothing was published. The tree and the videos are ready for you to publish when you decide, except the held videos.

---

## 4. Still on hold (unchanged from HANDOFF)
- V9 (online booking) and VS20 (sell online): wait for the coder's Lane D fix, Monti's deploy and Monti's go. (MERGE-24 d30ffa1, "Arreglo 14", is
  already in sim/usa-canada.)
- All US and Canada work.
- Colombia store picture: waits for the camera card scan in the app.
- Optional, not started: videos with Taller de motos or Uñas as the default business (both work in every page through `&biz=`).

## 5. Where everything is
| What | Where |
|---|---|
| Full status, per-video table | `handoff/REPORT.md` |
| Services builds and reviews | `handoff/research/services/` (`_HELPER-BRIEF.md`, `_REVIEW-BRIEF.md`, `REVIEW-*.md`, `build-notes/`) |
| Mexico builds and review | `handoff/research/mexico/` (`_MEXICO-BRIEF.md`, `_REVIEW-BRIEF.md`, `REVIEW-MX1.md`, `build-notes/`) |
| Coder lists | `handoff/research/services/CODER-PROMPTS-SERVICES-ROUND2.md`, `handoff/research/mexico/CODER-PROMPTS-MEXICO.md` |
| Pages | `demos/servicios/`, `demos/restaurante/RS5.html`, `RS25.html`, `demos/tienda/TS5.html` |
| Scripts | `features/V*.json`, `VS*.json`, `*-MX.json` |
| Videos | `video/` |
| Store picture | `store/` |
