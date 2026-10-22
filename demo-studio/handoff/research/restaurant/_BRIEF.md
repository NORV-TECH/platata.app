# Brief for every research helper (read this first)

You research ONE group of Platata features against the REAL app code, for marketing demos + narrated videos.
App source (READ ONLY — never edit, create or delete anything there): /home/claude/suma-plus-android  (branch sim/usa-canada, commit d1b7698d).
Read /home/claude/suma-plus-android/CLAUDE.md first (map of invariants; long — skim the parts relevant to your features).
Code lives in app/src/main/java/com/example/... (package tata.fijando.su.plata). Strings: app/src/main/res/values (en), values-es, values-pt-rBR.
Screenshots (some stale!): app/src/test/screenshots/ — open PNGs with the Read tool; always say how current one is vs the code.
_OLD-NOTES-unverified.md in this folder is an older map written from notes: use it only as a pointer, VERIFY everything in code.

Business: RESTAURANT. Countries: CO MX PE CL EC AR PA (Spanish), BR (Portuguese), US (English, also Spanish), CA (English). French is dropped.
Known per-country facts to verify, not assume: currency/money format (utils/CurrencyUtils.kt), card only CO (Wompi) and US/CA (Stripe), Pix QR with amount only BR, tips only US/CA (Stripe), cash rounding in some countries, "Venta"/"Cobrar" wording, US/CA pay nothing for connections.
Devices (app's own words): owner's phone "Tu teléfono"; counter tablet "Tablet de mostrador" (MamaPos, landscape, always light); employee phone "Teléfono de empleado" (Mini POS); kitchen screen "Pantalla de cocina" (KDS, always dark, landscape). The sell screens use plain Material LightColorScheme (white bg, near-black #1C1C1E buttons), NOT the paper look — check per screen which theme applies.

Facts already established (do not re-research, but use): waiter phone (Mini POS) sell screen = tabs Catálogo/Ventas/Abiertas, category chips, product grid, "Teclado" link, bar "Cobrar $X · N artículos" -> dining step -> pay step with "Guardar". A waiter order reaches the kitchen only via the owner's phone (Firestore -> owner phone app open/online -> Wi-Fi -> KDS). Dish tap: weight sheet / size sheet / option sheet / add-ons sheet / combo bar / ask-price keypad / else straight in.
ASSUME FIXED (Monti is having these fixed; describe the app as if they're done, and say so): waiter phone shows snackbar "Guardado: Mesa 4" after Guardar; open-ticket card title is "Mesa 4" when it has a table and no customer; "Caja" stays lit on all waiter-phone tabs; kitchen screen shows connection status; kitchen ticket header shows "Mesa 4" + waiter first name; tablet amber bar shows "Mesa 4"; Abiertas shows a count; same number on every device.
Already flagged (don't repeat): the 20 items in /home/claude/research/restaurant/_FLAGS-ALREADY-SENT.md.

OUTPUT: for EACH feature in your group write /home/claude/research/restaurant/<ID>.md (only write inside /home/claude/research/restaurant/), with:
1. What it does (1-2 plain lines) and WHO uses it on WHICH device(s).
2. Setup needed before the demo (what the owner must have switched on / created; factory defaults from seeds).
3. Country differences (per country or "same everywhere"), incl. money format examples.
4. The screens in order, each with: file:line, layout top-to-bottom, exact strings es / pt / en, colors (hex from tokens), key sizes. Enough detail to redraw it in HTML faithfully.
5. A demo path of at most ~10 taps that shows the feature end to end (what is tapped, what appears). If the feature spans devices, show the hand-off.
6. UX/UI problems found (confusing words, missing feedback, dead ends, broken layout, wrong behaviour), each with file:line and one-line suggested fix. Only real ones, verified in code. Say "possible" when unsure.
7. Open questions for Monti (only if the code truly can't answer).
Plain short English. Exact strings quoted. No guessing: write "not found in code" when the code doesn't say.
Finally reply to me with ONLY: the list of files you wrote + the UX problems (one line each). Keep the reply under 400 words.
