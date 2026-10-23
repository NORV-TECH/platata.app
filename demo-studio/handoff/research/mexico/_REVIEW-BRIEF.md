# Brief for an INDEPENDENT reviewer of the Mexico card demos (23 Oct 2026)

You did not build these pages. Find what is wrong before the voices are made and the videos recorded.
Be adversarial and concrete. You edit NO file except your own review file. Use your own scratch folder for anything temporary.

## Paths
- App (READ ONLY): `/home/user/suma-plus-android` (sim/usa-canada, d30ffa1). Strings `app/src/main/res/values` (en), `values-es`;
  code `app/src/main/java/com/example/...`; `CLAUDE.md` (grep STRIPE-MX-1, LINK-1, LINK-2, LINK-3, LINKFIX-1, QR-2, choke point 19).
- What the builders were told: `/home/user/platata.app/demo-studio/handoff/research/mexico/_MEXICO-BRIEF.md` (read it).
- Pages: `demo-studio/demos/restaurante/RS5.html`, `RS25.html`, `demo-studio/demos/tienda/TS5.html` (+ the pages listed in
  `handoff/research/mexico/build-notes/MX-SWEEP.md`); scripts `demo-studio/features/RS5-MX.json`, `TS5-MX.json`, `RS25-MX.json`;
  notes `handoff/research/mexico/build-notes/*.md`.
- Example of a past review: `handoff/research/services/REVIEW-*.md`.

## What to check
1. **Truth vs the app** for `?country=MX&lang=es`: every screen, word, number, order, colour. Mexico: Stripe Tap to Pay; QR kept;
   WhatsApp receipt route; dd/MM dates; tips per type (restaurant yes, shop no); no fee anywhere; the "Cobrar con enlace" link slot and the
   link flow exactly as `PosLinkScreen.kt` / `CheckoutSheetBody.kt` / `CheckoutPayBlock.kt` draw them; Sale complete as `ReceiptOptionsScreen.kt`.
   Also: is anything drawn that the app cannot do (e.g. Stripe's own payment page, a fee, a card brand logo)?
2. **Voice vs screen.** Run each page with `?mode=video&country=MX&lang=es` (5 s per beat) and read `window.__timeline`, or reason from the
   steps' beats. For each line of the -MX scripts: is exactly that on screen while it is said, with the app's own words? Beats == steps?
   ≤ ~550 chars, tú, neutral Mexican Spanish (no Colombianisms), no fee/cost talk, last line "Así … con Platata."
3. **Other countries unchanged.** The CO, BR and US renders of RS5/TS5 and of the sweep pages must play exactly as before (their videos are
   already recorded). Compare with `git -C /home/user/platata.app show HEAD~5:demo-studio/demos/...` or `git diff` against the commit before
   the Mexico work (`git log --oneline -8` to find it) and say if a non-Mexico path changed.
4. **Look.** `cd /home/user/platata.app && python3 demo-studio/tools/check_demo.py restaurante/RS5 MX:es CO:es US:en` (same for
   `restaurante/RS25 MX:es US:en`, `tienda/TS5 MX:es CO:es US:en`, and 3–4 sweep pages with a pay screen) and LOOK at the MX screenshots
   (`demo-studio/_check/<folder>-<ID>-MX-es/*.png`): cut or overlapping text, wrong money, ring on the wrong element, broken screen.
5. **Hard rules.** No French, light theme, no Visa/Mastercard logos, no real brands, no fee in Mexico, no US/Canada video content.

## Output
Write `demo-studio/handoff/research/mexico/REVIEW-MX1.md`: a summary table (feature → OK / n MUST / n nice), then per feature each finding
marked **MUST** or **nice**, the exact place (page line or beat), the evidence (app file:line + exact string), the exact fix.
App bugs you notice, separately at the end (file:line).
Reply with ONLY: the review file path and the MUST list (one line each). Under 300 words.
