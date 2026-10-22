# Brief for an INDEPENDENT reviewer of the services demos (22 Oct 2026)

You did not build these pages. Your job: find what is wrong before the voices are made and the videos recorded.
Be adversarial and concrete. You edit NO file except your own review file.

## Paths
- App (READ ONLY): `/home/user/suma-plus-android` (branch sim/usa-canada, 73c65f08). Strings: `app/src/main/res/values` (en), `values-es`, `values-pt-rBR`. Code: `app/src/main/java/com/example/...`. `CLAUDE.md` = map of rules (grep it).
- Pages: `/home/user/platata.app/demo-studio/demos/servicios/<ID>.html`; scripts `demo-studio/features/<ID>.json` (+ `<ID>-MX.json`); builder notes `demo-studio/handoff/research/services/build-notes/<ID>.md`; specs `handoff/research/services/V<n>.md` / `S<n>.md` (older code, 17d519ac — the code wins).
- Kit: `demo-studio/kit/services-data.js`, `kit/vkit.js`, `kit/engine.js`, `kit/material.css`.
- The rules the builders followed: `handoff/research/services/_HELPER-BRIEF.md` (read it: it says what is allowed). Example of a past review: `handoff/research/retail/REVIEW-R1.md`.

## What to check, per feature
1. **Truth vs the app at 73c65f08.** Every screen, button word, label, order of elements, colour, number on the page: is it what the app shows in that situation, for that business type (services), on that device, in that country? Open the composables and string files the page comment cites, and verify them; also look for what the page shows that the code cannot do. Money format per country (CurrencyUtils), country gates (cards: CO Wompi typed form, MX Stripe Tap to Pay, none elsewhere except US/CA; Pix only BR; tips only with Stripe), services rules (ServicesRules.kt: no fiado...).
2. **Voice vs screen.** Work out the video timeline: run the page with `?mode=video&country=CO&lang=es` (5 s per beat by default) and read `window.__timeline`, or reason from the steps' `beat` numbers. For each voice line (es and pt, and `-MX` es with `country=MX`), what is on screen while it is said? Does the line describe exactly that, with the app's own button words? Is anything said that the screen does not show, or that the app does not do? Beats == json steps (also -MX)? Script ≤ ~550 chars per language, tú (es) / você (pt), no greetings, jokes, filler; last line "Así … con Platata." / "Assim … com o Platata."; Brazil Pix lines say the QR carries the total.
3. **Look.** Run `cd /home/user/platata.app && python3 demo-studio/tools/check_demo.py servicios/<ID> CO:es BR:pt MX:es` and LOOK at the screenshots in `demo-studio/_check/servicios-<ID>-<CC>-<lang>/` (Read tool on the PNGs): cut or overlapping text, wrong language, wrong money, the ring on the wrong element, an empty or broken screen, anything that doesn't look like an Android app screen. Also try `&biz=` with the other three businesses for one country: must not crash or show nonsense.
4. **Hard rules.** No US/Canada video content (no US Employee pay, Stripe dashboard, deposits, card setup); no French; light theme; no Visa/Mastercard logos; no real brands; no camera card scan; no fee in Mexico; no fake people pretending to be AI.

## Output
Write `/home/user/platata.app/demo-studio/handoff/research/services/REVIEW-<your batch name>.md`:
- A summary table: feature × (es CO, pt BR, MX es if any) → OK / n MUST / n nice.
- Then per feature: each finding with **MUST** (wrong vs the app, wrong money, voice says something not on screen, broken look, hard-rule break) or **nice** (polish), the exact place (page line or beat number), the evidence (app file:line + the exact string), and the exact fix (what text/element to change to what).
- App bugs you notice that the builder did not list (with file:line), separately at the end.
Reply to me with ONLY: the review file path and the MUST list (one line each). Under 300 words.
