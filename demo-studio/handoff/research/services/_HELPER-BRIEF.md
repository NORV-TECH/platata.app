# Brief for every SERVICES demo-builder helper (22 Oct 2026)

You build marketing demo pages + video voice scripts for Platata (an Android POS), SERVICES business type
(salons, vets, workshops, nail salons). Monti (the owner) is busy: nobody answers questions. When something is
unclear, choose the honest option and write it down in your notes.

## Paths (the old briefs say `/home/claude/...`; use these)
| Old brief says | Here |
|---|---|
| `/home/claude/app-head`, `/home/claude/suma-plus-android` | `/home/user/suma-plus-android` (branch `sim/usa-canada`, commit 73c65f08) — **READ ONLY** |
| `/home/claude/platata.app/demo-studio` | `/home/user/platata.app/demo-studio` |
| `/home/claude/research/` | `/home/user/platata.app/demo-studio/handoff/research/` |

## Read first (all of it)
1. `/home/user/platata.app/demo-studio/handoff/research/retail/_BUILD-BRIEF.md` — the machinery, page rules, voice rules, checker. Everything there applies, with the services changes in (2) and below.
2. `/home/user/platata.app/demo-studio/handoff/research/services/_BUILD-BRIEF.md` — the services changes.
3. `/home/user/platata.app/demo-studio/kit/vkit.js` and `kit/services-data.js` headers (the services data kit; API below).
4. Your feature specs: `handoff/research/services/V<n>.md` / `S<n>.md` (written at 17d519ac — the code has moved a LOT since: 52 fixes, MERGE-22/23). Also `CODER-PROMPTS-SERVICES-21oct.md` (the 52 items the coder says are done), `handoff/PLANNER-TO-MARKETER-22oct.md`, and `REVIEW-1/2/3.md` (which research claims were right).
5. For a shared feature S<n>: the retail page `demos/tienda/TS<n>.html` (+ its build notes `handoff/research/retail/` if any) and the restaurant page `demos/restaurante/RS<n>.html`. The services page should reuse that look and change only what differs for services.
6. The app's `/home/user/suma-plus-android/CLAUDE.md`: grep the parts about your features (services, booking, agenda, where, payments, connections, team...). It is long; don't read all of it.

## The two hard rules
1. **Only what the app really does at 73c65f08.** RE-VERIFY every screen, word, number in the code before you draw it. Strings: `app/src/main/res/values` (en), `values-es`, `values-pt-rBR`. Code: `app/src/main/java/com/example/...`. Never invent a screen, button, word or price the code doesn't have. If the code can't do something the spec wants, leave it out and note it. If one of the 52 "done" items is NOT actually fixed in the code, say so in your notes (file:line).
2. **Write ONLY your own files**: `demo-studio/demos/servicios/<ID>.html`, `demo-studio/features/<ID>.json` (+ `<ID>-MX.json` when Mexico's Spanish words differ), `demo-studio/handoff/research/services/build-notes/<ID>.md`. Never edit kit/, tools/, index.html, other pages, the app repo. No git commands that change anything (no add/commit/push/checkout). If you need a kit change, copy what you need into your page and tell me in the reply.

## Services specifics
- Page: `demos/servicios/<ID>.html`, same head as the retail pages, scripts in this order: `../../kit/engine.js`, `../../kit/services-data.js`, `../../kit/vkit.js`. `const V = VKIT.ctx({biz:"<best business>"})`; `VKIT.start(V, {id:"<ID>", tallVideo:true, clock:"12:41", state, render, beats, steps, endText, device, who})`.
- The four demo businesses: `peluqueria` (Peluquería Carolina, owner + 2 stylists), `veterinaria` (Veterinaria Patitas, clients have pets), `taller-motos` (work orders: "Crear orden", ready date; clients have plates), `unas` (one-person nail salon). Pick the best one per feature (the spec says which). `?biz=` must also work with the other three where it makes sense (at least must not crash).
- Data: ONLY from the kit (V.C.services, V.C.products, V.C.staff, V.C.clients, V.C.sales, V.C.bookings, V.C.travelFee, V.C.openingCash, V.money ...). Service names, choices, add-ons, minutes are the app's own catalogue. Colombia shows the catalogue prices; other countries show prices the owner typed (the kit has them). Never invent other services, prices or names. Today is Thursday 22 Oct 2026 (`V.today`), clock 12:41.
- Look: business colour = services purple (`biz-servicios`, #7C55E0 ServiciosMain, PaperColor.kt). Material light for sell screens (material.css), the "paper" look where the app uses PaperTheme (setup, settings pages) — check the composable. Light theme only. Match the app's real layout, colours (hex from ui/theme), sizes, icons. Every screen carries a comment with file:line from the app.
- Devices: owner phone ("Tu teléfono"…), counter tablet (MamaPos, landscape), employee phone (Mini POS). Use the app's own device names. No kitchen screen. Never show stock on a tablet or staff phone.
- Facts to re-check (from the brief): no fiado for services; tips only with Stripe (US/CA/MX) — ServicesRules.tipDefaultOn = true; "who did the work", "Duración", no-show apart from cancel are in the code (Room 129); a booking can be taken with the register closed, only taking money needs it open; "Dónde atiendes" and the trade reach tablets and staff phones (REVFIX-13).
- **Countries**: the page must work for all 10 (CO MX PE CL EC AR PA es, BR pt, US CA en) — beats/hints/screens via `V.pick({es,pt,en})`. Videos are made ONLY for **CO:es and BR:pt**, plus **MX:es where Mexico differs** (e.g. cards: Mexico now takes cards through Stripe Tap to Pay, CardCountryGate "MX" → STRIPE, with "Cobrar con enlace" when the phone can't tap; no Platata fee in Mexico: never mention a fee). **US and Canada are ON HOLD**: no US/CA video, never show US "Employee pay", Team/time clock for US, card setup, Stripe dashboard or deposits. Brazil: in every Brazil video that shows QR/Pix, the voice says the Pix QR already carries the sale total (the customer scans, the amount is filled in, nothing to type) — CLAUDE.md QR-2.
- Colombia card by camera scan is NOT in the app: never show a card scan.
- No French anywhere. No Visa/Mastercard logos, no real brands (some seeded products in the app still carry brands — the kit keeps only generic products; never show the branded ones), no fake AI humans.

## The voice script `features/<ID>.json`
Same shape as the retail scripts, but **only es and pt** (English is on hold with the US):
`{"id":"<ID>","name":"…","business":"servicios","voice_settings":{"es":{"stability":0.5,"similarity_boost":0.75},"pt":{"stability":0.5,"similarity_boost":0.75}},"steps":[{"id":"1-…","voice":{"es":"…","pt":"…"}}, …]}`
- Steps in the json == beats in the page, same order, ids "1-xxx" … "9-xxx" (≤ 9 beats).
- es: Colombian neutral, spoken to the owner with **tú**; pt-BR with **você**. The voice only explains the feature: no greetings, no jokes, no small talk, no filler sounds. One or two short sentences per line; ≤ ~550 characters per language for the whole script. Last line: "Así … con Platata." / "Assim … com o Platata."
- Lines must describe exactly what is on screen at that beat, using the app's own button words. Avoid saying amounts that differ by country unless the line is country-specific.
- `<ID>-MX.json` (`"id":"<ID>-MX"`, only "es") only where Mexico's screens/words differ; its page renders with `?country=MX`, and its number of steps must equal the page's beats for MX too.
- Check the voice on the subtitles: beats ≤ 60 characters.

## Check your work (required)
- `cd /home/user/platata.app && python3 demo-studio/tools/check_demo.py servicios/<ID> CO:es BR:pt MX:es PE:es US:en` (add others where your feature differs, e.g. `?biz=`). Fix until every run prints OK.
- LOOK at the screenshots (Read tool on the PNGs in `demo-studio/_check/servicios-<ID>-<CC>-<lang>/`) for CO es, BR pt and MX es: cut text, overlaps, wrong language, wrong money, a ring on the wrong thing, a screen that doesn't look like the app. Compare with the app's screenshots (`/home/user/suma-plus-android/app/src/test/screenshots/`, may be stale) where they exist.
- Count beats == json steps (also for -MX).

## Notes `handoff/research/services/build-notes/<ID>.md` (required, short)
1. Built: what the demo shows (3 lines), devices, the business used, countries it differs in, app commit checked.
2. Left out and why.
3. New UX/UI problems found while building (only real ones, verified at 73c65f08, NOT already in `CODER-PROMPTS-SERVICES-21oct.md` unless that item is still not fixed): what's wrong, file:line, one-line fix, marked "BLOCKS THE DEMO" / "money" / "small".
4. Which of the 52 items you checked for this feature and whether they are really fixed.

## Reply to me
ONLY: files written, checker result lines, and the problems (one line each). Under 300 words.
