# REVIEW-2 — restaurant demos R1 R2 R3 RS18 R7 R8 R9 R10

Reviewer: independent pass, 20 Oct 2026. App checked at /home/claude/app-head (read only).
Method: every es video framed every 2 s (finer around hops and payoffs), pt/en 4 frames each plus extra around
gaps; key text cropped at full 1080 px; strings checked in values / values-es / values-pt-rBR; claims
spot-checked in code. `ffprobe` + a full decode (`ffmpeg -f null`) on all 23 videos: all clean, none truncated.
Pages: `tools/check_demo.py` run on a SCRATCH COPY (CO:es BR:pt US:en): all 24 runs OK. No repo file was edited.

Summary
| Feature | es | pt | en |
|---|---|---|---|
| R1 | 1 nice | OK | (on hold) |
| R2 | 1 nice | OK | OK |
| R3 | OK | OK | 1 nice (shared) |
| RS18 | 1 nice | 1 nice | 1 nice |
| R7 | 1 MUST, 2 nice | 1 MUST | 1 MUST |
| R8 | 1 nice | OK | OK |
| R9 | 1 nice (shared) | 1 nice (shared) | 1 nice (shared) |
| R10 | 1 nice | 1 nice | 1 nice |

---

## R7 (kitchen display)
1. **MUST-FIX — es/pt/en, ~5–27 s (every kitchen frame):** the card headers are garbled: the table name is
   drawn ON TOP of the status. Full-res crop at 9 s: "M̶e̶s̶a̶ 6m – URGENTE / 2", "Mesa̶1̶1m – CRÍTICO / 7"; History
   card at 27 s: "Mesa 7" over "Enviado a las 12:44" (en: "Table 7" over "Bumped 12:44 PM"). The real card
   (ui/components/KdsTicketCard.kt:135-148, a Row with the title `weight(1f)`) never overlaps. Cause: in
   `demos/restaurante/R7.html:35-36` the `<b>` has `flex:1;min-width:0`, so "Mesa" overflows its box into the
   status span. Fix (line 36): `.kds .hrow b{flex:1 1 auto;min-width:min-content}` and add
   `.kds .hrow span{min-width:0;text-align:right}` (the status wraps instead of being overdrawn). Re-render
   R7-es, R7-pt, R7-en.
2. NICE — es/pt/en 27 s: History says "Enviado a las 12:44" / "Bumped 12:44 PM" while the status bar says 12:41
   (a time in the future). Fix `R7.html:97,103,109` sentAt → "12:41" / "12:41 PM".
3. NICE — es 1–3 s: device label "Celular del mesero" here, "Teléfono de empleado" in R3/RS18 for the same
   phone. Pick one (the R3/RS18 one) in R7.html.
- Claims OK: Todo listo = only that dish (DB-2), Deshacer bar, LISTO in the big card, Historial. Strings
  (kds_status_*, kds_bumped_at, Historial, Pedidos activos) match.

## RS18 (combos)
1. NICE — es 23–25 s (pt/en same): the payoff "el descuento se aplica solo" is never SHOWN: the pick sheet is up
   <1 s and the screen only says "Cobrar $ 45.000 · 2 artículos" (= 50.000 − 10 %, correct, but invisible as a
   discount). Fix in `RS18.html` after line 300: add a beat-6 step that taps the charge bar and shows the pay
   screen with the line "Descuento de combo −$ 5.000" (`home_combo_discount`), or show that line in the sheet.
2. NICE — pt 5 s "Sobremesas 1 pratos", en 5 s "Desserts 1 dishes": `combo_category_item_count` is not a
   plural in the app (values/strings.xml:3856, values-pt-rBR:3700, values-es:3701). App fix: make it `<plurals>`;
   demo stopgap: give Desserts/Sobremesas a second dish in kit/restaurant-data.js.
- Claims OK: auto name "Combo X + Bebidas", 10 % chips, green bar "X está en un combo · Hacerlo combo",
  "Completa tu …" sheet.

## R1 (menu from a photo)
1. NICE — es 2–6 s: the tips card is on screen during line 1 and disappears at 6.4 s exactly when line 2 ("La
   primera vez ves unos consejos…") starts, so that line plays over a camera with no tips. Fix `R1.html:298`:
   `tap(st,E){ E.after(2500,()=>{ st.tips=false; }); }`.
- Strings, 4.200→42.000 fix, "8 platos agregados", photo matches in CO/BR all fine. (Page-check screenshots
  show the highlight ring mid-move — animation, not a bug.)

## R2 (edit menu)
1. NICE — "Con Ordenar… la caja los muestra en ese orden": the register uses that order only when the category
   chip is picked; "Todos" stays A-Z (DB-2). Fix `features/R2.json` 7-order: es "…y la caja los muestra en ese
   orden dentro de la categoría." (pt "…dentro da categoria.", en "…in that order inside the category.").
- pt price typed "38.00" with a dot is true to the app (formatAmountForInput); app UX issue, not a demo bug.

## R3 (add-ons) — OK. Strings, "1 extra", $ 42.000 → $ 44.000, R$ 45,00 → 48,00, $14.50 → 15.50 all right.

## R8 (kitchen screen settings)
1. NICE — es 17–19 s: on the tablet "¿Qué vas a conectar?" the chosen "Pantalla de cocina" tile is half hidden
   under Continuar (description cut). Scroll the list up a little in R8.html before the tile tap.
- Strings (kds_ux_*, connect_device_*, "Conectada ✓") match.

## R9 (counter tablet)
1. NICE (also R3-en, RS18-en, R10-en): tablet/waiter tile names are clipped mid-word with no ellipsis:
   "Churrascc", "Cheesebu", "Lemonad", "Frango à parmegiai". Compose would break the word onto line 2. Fix
   `kit/material.css:44` `.mtile b{…}` add `overflow-wrap:anywhere`.
- Flow/strings OK (Caja bloqueada, Elige tu perfil, ¿Qué mesa?, Exacto, Nueva venta · Sin recibo, KDS "Mesa 7").

## R10 (printing)
1. NICE — es 11 s / pt 13 s / en 13 s: the test page prints "la impresor / a funciona" ("the printe / r works"):
   true to the app (32-column wrap cuts words, known limit), but it looks like a broken printer. App fix: wrap
   the test sentence on spaces in the test-page builder. Also en ~29 s: "Charge with Exact" still on screen
   while the paper prints (~2 s late).
- Note (app, not demo): ReceiptConfig.customFooterMessage default is English "Thank you for shopping with
  us!" (data/ReceiptConfig.kt:24); a new Colombian shop prints English, unlike the demo's "¡Gracias por tu visita!".
