# Report (keep this up to date)

Last update: 24 Oct 2026, by the services builder. **Round 3 DONE** (app sim/usa-canada **37db6d6c**). Nothing published, nothing deployed, main untouched.
App commit every services and Mexico page is checked at: **37db6d6c** (Fusion 28, 24 Oct). (Built at 73c65f08 / d30ffa1; every page re-checked at 37db6d6c in round 3.) Website work only on `demo-studio`, folder `demo-studio/`.

## Round 3 (24 Oct, app 37db6d6c) — DONE
Asked by Monti / the architect: (1) re-record everything held (45 tile-price videos, V5 Brazil, VS5-MX), each re-checked in the code first;
(2) RS25-MX: the "cuesta un poco más" sentence left the app (LINKCOST-1); (3) build V9 (online booking) and VS20 (sell online), es + pt;
(4) regenerate the tree, publish nothing; new app bugs in `handoff/research/services/CODER-PROMPTS-SERVICES-ROUND3.md`.
- **All 31 older services pages re-checked at 37db6d6c**, not only the held ones, because the screens changed (tile price "Desde" on its own line and the
  cheapest choice; the owner panel's new search bar; pay screen link rows; combos; Agenda; words; the purple Support badge; the till grid A–Z under
  "Todos"). Each page fixed to match, file:line comments updated; notes in `handoff/research/services/build-notes/<ID>.md` ("## Round 3").
- **Re-recorded at 37db6d6c: 64 services videos**, plus 2 new (V9 es, VS20 es) (every services video except VS1 es/pt, whose screens did not change; their round-2 videos are still
  exact). Each one: code check → `tools/timing_frames.py` (real clip lengths, frames looked at) → `tools/record_video.py` → decode check →
  `tools/cut_price_scan.py` (no cut price anywhere). The 45 held videos, V5 Brazil (Portuguese WhatsApp text fixed) and VS5-MX are all in.
- Voice lines changed only where the app changed: V5 pt lines 4, 5, 8 (WhatsApp wording); V6 line 4 ("Al abrirla, Platata pasa directo al cobro");
  VS18 / VS18-MX line 7 ("Agregar combo"). Every other line byte-identical.
- **V9 "Reservas en línea" and VS20 "Vender en línea" built** (online booking is merged and the page deployed, 23 Oct): build, separate review
  (`REVIEW-R3-V9.md`, `REVIEW-R3-VS20.md`, every MUST fixed), voice, timing, record. **Colombia videos final; Brazil videos held** for the booking page's
  "Desde" price (coder round 3, item 1: the page shows the FIRST stored choice, e.g. "Coloração completa A partir de R$ 125,00" vs R$ 80,00 on the
  till, on the first screen of the Brazil video; the Colombia video's wrong cards are below the fold). Both pages play in every Spanish country and Brazil.
- **Mexico**: RS5-MX, TS5-MX, RS25-MX and the 14 Mexico sweep pages re-checked. RS25-MX re-made on the common case (a phone with no NFC, QR kept;
  the cost sentence is gone, LINKCOST-1); RS5-MX / TS5-MX now show the card line after a tap sale. All three re-recorded. The app prints the tap
  sale's brand in lower case ("visa ••4242") while a link sale prints "VISA": drawn as the app does it, Mexico coder list round 3, item 5.
- **Demo tree regenerated** (`tools/tree_restaurant.py`, `index.html`): every new video in; V9 and S20 now in the services tree for the four
  businesses (Colombia video shown for the Spanish countries; Brazil plays the page). Not published.
- **New app bugs**: `handoff/research/services/CODER-PROMPTS-SERVICES-ROUND3.md` — **READY**: 2 blocking (booking page "Desde" = first choice, blocks
  the V9 / VS20 Brazil videos; the booking page offers times the server then refuses), 3 money display, 19 small. Mexico: item 5 in
  `handoff/research/mexico/CODER-PROMPTS-MEXICO.md`. Round 2: every item the demos touch is fixed at 37db6d6c, except the half-fixed ones carried into round 3 (items 1, 4, 6, 7).
- PLANNER-TO-MARKETER: not received yet (Monti was to paste it); nothing in this round depends on it.
- **For the architect:** about 47 restaurant and retail pages draw the owner's "Mi negocio" panel; their videos were recorded before the panel's new
  search bar (WSEARCH-1, the first row of the panel). Whether to re-record those is your call; this round did services and Mexico only.

## Summary
Services: 33 demos (V1–V9, VS1–VS24), every one independently reviewed against the app code and re-checked at 37db6d6c. **68 videos final**
(es, pt, and Mexico's own Spanish where Mexico differs); **2 held** (V9 pt, VS20 pt: coder round 3 item 1). Coder list round 3 is ready.
Mexico cards: 3 videos final (RS5-MX, TS5-MX, RS25-MX "Cobrar con enlace"), the store picture is made, Brazil Pix lines checked.

## How each services demo was made
Build (helper, verified in the app code at 73c65f08; every page re-checked at 37db6d6c in round 3, V9 and VS20 built there) → independent review by a fresh helper (`handoff/research/services/REVIEW-*.md`, 8 reviews, 48 MUSTs found, all fixed) → voice (GitHub job) → timing check with the real clip lengths (`tools/timing_frames.py`, frames looked at for every video) → record → decode check → commit.

## Built and recorded
- Restaurant: 35 demos, 108 videos; Retail: 34 demos, 108 videos (before handoff).
- Services data kit: `kit/services-data.js`, `kit/vkit.js` (four businesses × 10 countries; the app's own catalogue copied by `tools/make_services_catalog.py`; Colombian prices = the app's; other countries = prices the demo owner typed; generic products only).

Services (es = Colombia, shown for every Spanish country; pt = Brazil; MX = Mexico's own Spanish, also shown for PE CL EC AR PA where it says "no suggested prices" (V1, V2) or "the cut has choices" (VS18)). Every video was checked at 37db6d6c frame by frame (`tools/timing_frames.py`) and for cut prices (`tools/cut_price_scan.py`).

| Feature | Business | Final videos (37db6d6c) | Held |
|---|---|---|---|
| V1 Elegir el oficio | Peluquería | es, pt, MX | – |
| V2 Editar precios y opciones | Peluquería | es, pt, MX | – |
| V3 Agendar una cita | Peluquería | es, pt | – |
| V4 La agenda del día | Peluquería | es, pt | – |
| V5 Mover, cancelar, no asistió | Peluquería | es, pt | – |
| V6 Cobrar la cita | Peluquería | es, pt | – |
| V7 Servicios y productos | Peluquería | es, pt | – |
| V8 Local, domicilio, recogida | Peluquería | es, pt | – |
| V9 Reservas en línea (new) | Peluquería | es | pt (booking page "Desde" = first choice, coder round 3 item 1) |
| VS1 Crear el negocio | Peluquería | es, pt (round 2, still exact) | – |
| VS2 Abrir la caja | Peluquería | es, pt | – |
| VS3 Efectivo | Peluquería | es, pt | – |
| VS4 QR / Pix | Peluquería | es, pt | – |
| VS5 Tarjeta | Veterinaria | es (Colombia, Wompi), MX (Stripe). No BR: no card in Brazil | – |
| VS6 Otras formas de pago | Veterinaria | es, pt, MX | – |
| VS7 Recibo | Peluquería | es, pt | – |
| VS8 Devolver una venta | Peluquería | es, pt | – |
| VS9 Sacar efectivo | Peluquería | es, pt | – |
| VS10 Cerrar la caja | Peluquería | es, pt | – |
| VS11 Reportes | Peluquería | es, pt | – |
| VS12 Enviar al contador | Veterinaria | es, pt | – |
| VS13 Clientes | Veterinaria | es, pt | – |
| VS14 Equipo y claves | Peluquería | es, pt | – |
| VS15 Pago a empleados (not US) | Peluquería | es, pt | – |
| VS16 Descuentos y cargos | Peluquería | es, pt | – |
| VS17 Impuestos | Peluquería | es, pt | – |
| VS18 Combos | Peluquería | es, pt, MX | – |
| VS19 Otro celular o tableta | Peluquería | es, pt | – |
| VS20 Vender en línea (new) | Peluquería | es | pt (same booking page "Desde" price, item 1) |
| VS21 Sin internet | Peluquería | es, pt | – |
| VS22 Google Drive | Veterinaria | es, pt | – |
| VS23 Huella | Peluquería | es, pt | – |
| VS24 Varios negocios | Peluquería | es, pt | – |

Final: **68** services videos. Held: **2** (V9 pt, VS20 pt).

Every page also plays for the other three businesses (`&biz=veterinaria|taller-motos|unas`) and all 10 countries. Taller de motos and Uñas are not the default business of any video yet; a few could be re-made with them later (e.g. V3 "Crear orden" for the workshop).

Demo tree (`index.html`, built by `tools/tree_restaurant.py`): services section for the four businesses (pages with `&biz=`), Spanish countries + Brazil; US/CA not offered for services (on hold). Not published: the architect publishes.

## Mexico cards (HANDOFF item 6), 23 Oct
Built and checked at d30ffa1 (STRIPE-MX-1, LINK-1..3, LINKFIX-1). Brief `handoff/research/mexico/_MEXICO-BRIEF.md`; independent review
`handoff/research/mexico/REVIEW-MX1.md` (2 MUST, both fixed; the CO, BR, US, CA and PE paths of RS5/TS5 proven to play exactly as before).

| Video | What it shows | Status |
|---|---|---|
| RS5-MX (restaurant) | Pay row Exacto / QR / Tarjeta + the small "Cobrar con enlace" link (the phone can tap), tip 15/18/20, "Acerca la tarjeta", "Procesando…", Sale complete "Pago aprobado" + the card line "visa ••4242" (the app's lower case, Mexico item 5), receipt by WhatsApp. No fee. | final `video/RS5-MX-es.mp4` (round 3) |
| TS5-MX (shop) | Same, no tip screen (shops don't ask by default; `&type=pharmacy` plays too). | final `video/TS5-MX-es.mp4` (round 3) |
| RS25-MX "Cobrar con enlace" (new feature S25, restaurant) | Round 3: a phone with NO NFC (the common case) in the shop that keeps its bank QR: pay row Exacto / QR / Tarjeta "Por enlace" (the app's short hint) + amber bar, no "can't take cards" strip; the red notice "Le falta el lector de tarjetas (NFC)." with no cost sentence (LINKCOST-1); Continuar; tip; QR page with the total and the tip; the customer pays on his own phone (a plain card, Stripe's page is never drawn); "Pago recibido. Guardando la venta…"; Sale complete "Pago aprobado VISA ••4242". | final `video/RS25-MX-es.mp4` (round 3) |
| Store picture "Acepta tarjetas" (Mexico, tap) | Phone with the app's own "Total a cobrar · Acerca la tarjeta" screen next to a generic card (no brand); small print = the app's own condition (NFC, Android 13) and the link fallback. Colombia version held (camera scan not built). | `store/accept-cards-MX.png` (`tools/render_store.py`) |

- Round 2 used an Android 12 phone and a shop without QR only to dodge Mexico coder items 1 and 3; both are fixed at 37db6d6c, so round 3 shows the common case.
- Every restaurant/shop page now shows Mexico with the Stripe card (kits: MX `pay.card = "stripe"`); the pass over the other pay-screen pages is in
  `handoff/research/mexico/build-notes/MX-SWEEP.md` (interactive pages only, no video changes).
- Tree: S5 (cards) now offered in Mexico for every business; new feature S25 "Cobrar con enlace" (MX, US, CA); a Mexico card video never falls back to
  Colombia's Wompi video (no Mexico video = no video).
- Brazil: the only Brazil videos that open the Pix QR are RS4, TS4, VS4, VS6, VS7, and every one already says the QR carries the total. Nothing re-recorded.
- VS5-MX (services, Stripe tap) is final (round 3). Not made: a "card can't tap" variant of the shop/services pages (one link video is enough for now).
- Round 3: the 14 sweep pages re-checked at 37db6d6c, no change needed (`build-notes/MX-SWEEP.md`).

## On hold
- **V9 pt, VS20 pt** (Brazil videos of online booking / sell online): wait for coder round 3 item 1 (the booking page's "Desde" price). Voices ready; then
  `tools/timing_frames.py <ID> pt:BR`, record, `tools/cut_price_scan.py`, commit, regenerate the tree.
- All US/Canada work (services scripts carry es + pt only).
- Colombia card scan: not in the app.

## Problems found (for the coder) — READY
- **Round 3:** `handoff/research/services/CODER-PROMPTS-SERVICES-ROUND3.md` (24 Oct, 37db6d6c): 2 blocking (1. the booking page's "Desde" is the FIRST stored
  choice, not the cheapest, `functions/storefront-projection.js:278,291`: blocks the V9 / VS20 Brazil videos; 2. the booking page offers times on the
  service's own minutes but the server checks the shop's slot length, `functions-public/index.js:231-238`: real bookings refused), 3 money display
  ("Desde $ 0"; combo sheet first price; owner's Sell online page without "Desde"), 19 small (words, plate emoji on trades, "Celular" field for a
  WhatsApp number, notification icon, Agenda overlap sign…). Each with file:line and a one-line fix. Monti passes it to the coder.
- **Mexico:** `handoff/research/mexico/CODER-PROMPTS-MEXICO.md`: items 1–4 fixed / answered at 37db6d6c; round 3 item 5 (tap sale brand in lower case).
- Round 2 (`CODER-PROMPTS-SERVICES-ROUND2.md`): every item the demos touch is fixed at 37db6d6c, except the half-fixed ones carried into round 3 (items 1, 4, 6, 7 there).

## Questions for Monti
- None open. (Answered 22 Oct: the services videos waited for the tile fix, now done; the Mexico card surcharge is left as is.)

## For the architect
- **Tap to Pay is still the simulated reader** (`sync/TapToPayMode.kt:25` `REAL_TAP_TO_PAY = false`): the Mexico (and US) tap videos show the flow the app is built for; a real card can be taken only once that ships. Re-check the tap pages then (Stripe's own tap screen may cover "Acerca la tarjeta").
- "Cobrar así cuesta un poco más" is gone from the app (LINKCOST-1, 37db6d6c); RS25-MX no longer shows it.
- **Mexico card surcharge (from Monti, 22 Oct):** the "Cargo por tarjeta de crédito" discount idea is offered in Mexico (Stripe country), where a card surcharge may not be allowed. Monti: leave it as is for now, no research; keep it as a point for when Mexico is looked at. (Coder round 2, "For Monti" 1.)
- V9 / VS20: the booking page drawn is the deployed one (`public/store/*` at 37db6d6c). VS20 adds the needed connection with a time-skip card; a real owner
  outside US/CA buys it through Google Play, which answers "not available" until the 8 Play products exist (CONN-4, `tools/play-catalog.py` never run).
- About 47 restaurant and retail videos show the owner panel without its new search bar (WSEARCH-1): re-record or not is your call.
- Restaurant/retail pages that differ slightly from the app at 37db6d6c (found in the Mexico sweep, not changed because they would move recorded CO/BR
  videos): RS21 pay row drawn Exacto 1.3 : Tarjeta 1 (the app is 1 : 1, or 1.2 : 2 with a connected reader); RS6 says "¿Regalar este pedido?", the app
  says "¿Regalar esta venta?"; RS11 / TS11 / RS12 / TS12: "1 vendido" is now a plural and the accountant card-fee note was reworded.

## Notes
- The checker needs Playwright 1.56.0 here (the container's Chromium is build 1194): `pip install playwright==1.56.0`.
- `tools/timing_frames.py <ID> es:CO pt:BR` = frames inside every voice line with the real clip lengths, to check before recording.
- For when US/CA resume: the restaurant/shop pages print the Canadian receipt date day-first, but the app writes month-first for Canada too (`utils/ReceiptFormatter.kt:186-187`, FIADO-STAFF-1). Left alone: US/CA are on hold.
- Kit polish for later (not needed by the built pages, which carry their own data): a few no-shows in the history, history from the 1st of last month, clients on fewer sales, no QR sales for US/CA.
