# Brief for building the SERVICES demos and videos (read all of it first)

Same rules and same machinery as the restaurant demos (35 built) and the retail demos (34 built). Read `../retail/_BUILD-BRIEF.md` fully first: everything there applies, with the services changes below. Paths in the old briefs start with `/home/claude/...`: see the path table in `../../HANDOFF.md`.

## What to build
- Own features V1..V9 → page `demo-studio/demos/servicios/V<n>.html`, feature id `V<n>`, script `demo-studio/features/V<n>.json`.
- Shared features S1..S24 as a services business → page `demo-studio/demos/servicios/VS<n>.html`, feature id `VS<n>`, script `features/VS<n>.json`.
- The feature list and the first voice line of each: `../../DEMO-FEATURE-LIST.md` (V1..V9 and S1..S24).
- Spec per feature: `V<n>.md` / `S<n>.md` in this folder (written at 17d519ac). The coder has since changed a lot (52 fixes, MERGE-22/23, `73c65f08` and newer): RE-VERIFY every screen at the newest `sim/usa-canada` commit before you draw it. What changed is summed up in `../../PLANNER-TO-MARKETER-22oct.md` and in `CODER-PROMPTS-SERVICES-21oct.md` (the 52 items). `REVIEW-1/2/3.md` say which research claims were right.

## Hold (do not record yet)
- V9 (clients book online) and VS20 (sell online): wait until the coder's REVFIX-14 / Lane D fix is merged AND Monti has deployed the server and website. Monti will say when.
- Anything US/Canada-only: US and Canada are on hold (payroll, card partner). Do not make US:en videos for now. Do not show US "Employee pay", Team, time clock, card setup, Stripe dashboard or deposits.
- Colombia card by camera scan: NOT in the app yet (typed card only). Do not show a scan until the coder builds it.

## Videos to make now
- CO:es and BR:pt for every feature not on hold.
- MX:es where Mexico differs (cards: Mexico now takes cards through Stripe, CardCountryGate "MX" → STRIPE, with "Cobrar con enlace" when the phone can't tap). Make a `-MX` script only where the Spanish words differ for Mexico.
- Pages must still work for all 10 countries (CO MX PE CL EC AR PA es, BR pt, US CA en).

## The four demo businesses (Monti's choice)
Peluquería (hair salon, trade `peluqueria`), Veterinaria (`veterinaria`), Taller de motos (`taller-motos`, a work-order trade: "Crear orden", ready date), Uñas (one-person nail salon, `unas`). Pick the best one per feature (each spec says which). Service names, choices, add-ons and minutes come from the app's `app/src/main/assets/catalogo_investigado/<trade>.json`. No real brands anywhere (the coder removed them from the seeded products; check).

## First job: the services data kit
There is no services kit yet. Make `demo-studio/kit/services-data.js` + `demo-studio/kit/vkit.js` modelled exactly on `kit/shop-data.js` + `kit/skit.js` (and `restaurant-data.js` + `rkit.js`): `const V = VKIT.ctx()` with `?country=&lang=&biz=peluqueria|veterinaria|taller-motos|unas`, V.C (that business in that country: name, owner, staff with names, clients (vet: pet names; taller: plates), services with prices in that country's money, choices, add-ons, minutes, a few products with generic names, 6 weeks of sales and bookings for reports), V.money (copy the money format from skit.js, it matches CurrencyUtils), V.pick, VKIT.start, VKIT.hop. Colombian prices: the catalogue's `price_co`. Other countries: realistic local prices you choose (outside Colombia the app ships no prices; the owner types them, so any plausible local price is honest). Business colour: services purple from the app's theme (check ui/theme for the services accent).

## Services facts already verified (re-check, the code moved)
- No fiado for services. Tips only US/CA (on hold).
- Devices: owner phone, counter tablet (MamaPos), employee phone (Mini POS). No kitchen screen; the "back-room screen" exists but is not part of these demos.
- Who did the work, service length ("Duración"), no-show apart from cancel: now in the code (Room 129).
- A booking can be taken with the register closed; only taking money needs it open (Monti, 21 Oct; check the coder built it).
- Online booking needs the third connection (owner phone + included device + one paid), except US/CA. Leave it to V9/VS20.
- "Dónde atiendes" (shop / client's place / pickup) and the trade now reach the tablet and employee phones (REVFIX-13; check).

## Tools (same as retail)
- Check: `python3 demo-studio/tools/check_demo.py servicios/<ID> CO:es BR:pt MX:es` → screenshots in `demo-studio/_check/`. Look at them.
- Voices: commit `features/*.json`, then `demo-studio/tools/voice_then_record.sh "<message>" "<ID> es:CO" "<ID> pt:BR"` (pushes, waits for the GitHub "narration" commit, records). Videos land in `demo-studio/video/<ID>-<lang>.mp4`.
- `tools/tree_restaurant.py` builds the demo tree in `demo-studio/index.html` for restaurante and tienda: add a servicios section the same way.
- Notes per feature: `demo-studio/handoff/research/services/build-notes/<ID>.md` (built, left out, new UX problems with file:line, marked BLOCKS THE DEMO or small).
