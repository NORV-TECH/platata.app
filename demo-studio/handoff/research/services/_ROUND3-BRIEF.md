# Round 3 brief: re-check the services (and Mexico) demos at the new app commit (24 Oct 2026)

The coder finished services round 2 and more. The app moved from d30ffa1 to **37db6d6c** (39 commits). Every page was built at
73c65f08 / d30ffa1, so every page must be re-checked before its video is recorded again. Nobody answers questions: take the honest option
and write it in your notes.

## Paths
- App (READ ONLY, never edit, never commit): `/home/user/suma-plus-android`, checked out at 37db6d6c. Old code for comparison:
  `git -C /home/user/suma-plus-android show d30ffa1:<path>`. What changed: `git -C /home/user/suma-plus-android log --format='%h %B' d30ffa1..37db6d6c`
  and `git -C /home/user/suma-plus-android diff d30ffa1..37db6d6c -- <file>`. `CLAUDE.md` is the rules map (new entries: WSEARCH-1, R2-4, REVIEW-16 F1).
- Website: `/home/user/platata.app/demo-studio`. Read first: `handoff/research/services/_HELPER-BRIEF.md` (all its rules still apply, but the
  commit is now 37db6d6c), `handoff/research/services/CODER-PROMPTS-SERVICES-ROUND2.md` (what we asked the coder for), your pages' build notes
  `handoff/research/services/build-notes/<ID>.md` and reviews `REVIEW-*.md`.
- Your own scratch folder: `/tmp/claude-0/-home-user/96476401-bbfa-5681-be22-524ea1c374e3/scratchpad/r3-<your batch>/` (never another helper's).

## What changed in the app that many pages show (verify each in the code)
- **Service tile price** (round 2 item 2, REVIEW-16 F1): `ProductCard.kt` `ServicePriceBlock`: the price is whole; "Desde" sits on its own line and the
  minutes moved to their own line (photo tile and plain tile alike). The "Desde" price is the CHEAPEST choice (item 9); the minutes use the service's saved
  Duración (item 17). "Agregar" tile no longer repeats "+" (item 21).
- **Owner panel ("Mi negocio")**: a search bar is now the FIRST item of the panel's list (WSEARCH-1, `ui/screens/home/PanelSearchBar.kt`). Every page that
  shows the owner panel must draw it (exact words, icon, size). It opens a full search page (`ui/screens/search/WorkspaceSearchScreen.kt`) — do not add
  search to a video that doesn't need it, just draw the bar where the panel is drawn.
- **Counter tablet / staff phone Library**: an item search box (`TillItemSearchBox.kt`, `ProductLibraryView(itemSearch = true)`). Draw it where those
  devices' Library shows. The owner phone's register did NOT get it.
- **Pay screen** (`CheckoutPayBlock.kt`, `CheckoutSheetBody.kt`): items 7/8 and Arreglo 15 F8: the set-up link and "Cobrar con enlace" can both show and
  now take TWO rows, each with its label; Mexico card hint has a short version; a linked Stripe account shows the plain Card button.
- **Sale words** (items 8/14, `sync/SaleNoun.kt`): the sale says "servicios" or "artículos" by what the CART holds.
- **Combos** (items 10, 46, Arreglo 15 F2/F6/F7): the combo asks the researched options too, a paid option is charged and named, a combo names its chosen
  services, the pill says "−10%", the product sheet says "combo" (not "oferta").
- **Breakdown** (item 28): included vs charged options ("Lavado (Incluido)" vs "+ Cepillado"). One-value option not printed twice (item 27).
- **Agenda and service sale** (R2 2, `7871660d`): state without payment, readable phone, one time, one divider, paid sale title.
- **Appointment WhatsApp in Portuguese** fixed (item 3, `bc70fa95`).
- **"Cobrar" with the register closed** is remembered and opens the pay screen once the register is opened (item 16, Arreglo 16 F3).
- **New-client promo** says "en la primera visita" and doesn't stack with another discount (item 5, Arreglo 15 F5).
- **Delete with no screen lock** asks only if the phone can (items 6, 44, 45; Arreglo 15 F4).
- **Words**: services words in settings, connections, business list, combo builder; the receipt does not repeat "Incluido"; reports and the accountant
  summary (items 15, 29, 36–53). Seeded catalogue without brands (items 1, 11).
- **Mexico card** (item 7): Tap to Pay sales now carry the card brand and last four (Sale complete and receipt show "VISA ••4242"); the "can't take cards"
  strip is gone on a phone that charges by link; the link notice no longer has the "cuesta un poco más" sentence (LINKCOST-1, `328cd4c3`).

## Your job, per feature in your batch
1. Re-verify EVERY screen of the page against 37db6d6c: read the files the page comment cites (and their diff since d30ffa1) and the es / pt-BR strings
   (`git diff d30ffa1..37db6d6c -- app/src/main/res/values-es/strings.xml` etc.). Fix the page so it shows exactly what the app shows now. Update the
   page's STR table from the app strings where words changed. Update the file:line comments.
2. Voice script: change a line ONLY when it no longer matches the screen or the app. Keep every other line byte-identical (unchanged lines are not
   re-voiced). If you change a line, keep the rules (tú / você, ≤ ~550 chars, last line "Así … con Platata." / "Assim … com o Platata.", steps == beats).
3. Check: `cd /home/user/platata.app && python3 demo-studio/tools/check_demo.py servicios/<ID> CO:es BR:pt MX:es` (OK for every run), and LOOK at the
   screenshots. Run ONE checker at a time (the machine has 4 CPUs shared with other helpers).
4. Timing: if the script is UNCHANGED, run `python3 demo-studio/tools/timing_frames.py <ID> es:CO pt:BR` (and `<ID>-MX es:MX` if it exists) — it uses the
   real clip lengths — and look at the frames: each line must be said over the screen it describes; fix the page's `wait:` values if not. If you changed
   a line, use 0.067 s per character for that line and say so in your reply (I re-run the timing after the new voice).
5. Cut text: the tile prices must be whole now. Look at every tile in your frames; also run
   `python3 demo-studio/tools/cut_price_scan.py <ID>` after your timing check passes if the page shows tiles (it reads recorded videos only, so skip it if
   no video exists; tell me).
6. Do NOT record and do NOT touch voice-ready.txt: I record.

## Write ONLY
Your pages `demos/servicios/<ID>.html`, their scripts `features/<ID>.json` (+ `-MX.json`), and a section "## Round 3 (37db6d6c)" appended to each
`handoff/research/services/build-notes/<ID>.md`: what changed, file:line, what the app still does wrong (new bugs only, each with file:line, one-line fix,
and "BLOCKS A DEMO" / "money" / "small"), and which round-2 items you saw fixed or NOT fixed for your feature.
Never kit/, tools/, index.html, other pages, the app repo. No git commands that change anything.

## Reply (under 300 words)
Per feature: page changed yes/no (what), script lines changed (ids) or "unchanged", checker result, timing result, ready to record yes/no.
Then new app bugs (one line each, file:line).
