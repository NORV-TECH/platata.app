# REVIEW-R2: shop demos TS9 TS10 TS11 TS12 TS13 TS14 TS15 TS19 TS20 (+ TS20-US-es) TS21 TS22 TS23 TS24

Reviewer: independent pass, 21 Oct 2026. App checked at /home/claude/app-head 6736ddfb. I edited no file.
Method: I rebuilt each video's beat timeline from its own audio clips (same `__timeline` the recorder uses). For every es (CO) video
I pulled a frame at the start and end of every voice line plus one in every gap over 1.5 s, and extra frames where something looked
off. For pt (BR), en (US) and TS20-US-es one frame per line (at 70%). Strings checked against values / values-es / values-pt-rBR,
claims spot-checked in the code.

ffprobe: all 40 videos open and decode: 1080x1920, h264 + aac, 21 to 53 s. TS20-US-es 49.7 s.

## Summary
| Feature | es (CO) | pt (BR) | en (US) |
|---|---|---|---|
| TS9 Meter y sacar efectivo | 1 MUST (strip colour, file only), 1 nice | same | same |
| TS10 Cerrar la caja | 1 MUST (strip colour, file only), 1 nice | same | same |
| TS11 Reportes | 2 MUST, 1 nice | same | same |
| TS12 Enviar al contador | 1 MUST (strip colour) | same | same |
| TS13 Clientes | 1 MUST (strip colour) | same | same |
| TS14 Equipo y claves | 3 MUST, 1 nice | same | same |
| TS15 Pago a empleados | 1 MUST (strip colour) | same | same |
| TS19 Otro celular o tableta | 1 MUST | same | same + 1 nice (app words) |
| TS20 Vender en línea | 1 nice | 1 nice | 1 nice (en + US-es) |
| TS21 Funciona sin internet | OK | OK | OK |
| TS22 Respaldo | OK (2 known app issues on screen) | OK | OK |
| TS23 Huella / deudas | 2 nice | same | same |
| TS24 Sucursales | OK (known app words "menú") | OK | OK |

Claims verified in the code:
- Cash in/out lines, "Abonos de fiado" in the drawer, expected = start + cash sales + tab payments − cash out: RegisterStatusScreen.kt:351-398 (TS9 numbers add up in all 3 countries).
- Closed summary: Net sales, Taxes, "En fiado (sin cobrar)" −X, Total collected; the WhatsApp text starts with the shop name and ends with the signature: RegisterClosedScreen.kt:262, ShiftSummaryText.kt:61-62.
- Reports "En fiado (sin cobrar)" leaves Total collected (REVFIX-5, ReportsScreen.kt:332-338); accountant rows and order = EmployeePayActions.kt:358-385 (incl. "Ventas fiado (a crédito)" and BR "Impostos recolhidos R$ 0,00" always printed).
- Fiado age colours (green <15 d, amber ≤30 d, red >30 d): CustomerCrmScreen.kt:651-655. Remind text = fiado_remind_message; "Salda 2 fiados completos…", "Recibiste", "quedó al día" are real.
- A customer who owes cannot be deleted (crm_delete_blocked_*), with no debt the delete asks the fingerprint when protectDeleteHumans: CustomerCrmScreen.kt:1034-1074.
- Online store unlock "tercera conexión" = conn_dlg_store; dialog = conn_store_dlg_body_add; US/CA free.
- Branch options (Menú y precios Siempre, Equipo, Clientes, Ajustes) and "Sales and open tickets never carry over"; customers copied by includeCustomers, tabs stay (orders are not copied).
- Tablet scan tab reads a hardware scanner too (MamaScanPane.kt:108 onPreviewKeyEvent), so "con un lector" is true.

---

## Cross-cutting MUST: restaurant colour on the support strip (TS9, TS10, TS11, TS12, TS13, TS14, TS15)
The "Soporte / Reporta un problema aquí" strip badge is drawn in the RESTAURANT button colour #C44B28 (orange-red). The app uses the
business accent (`SupportStrip.kt:154` c.accentBtn); a shop is TIENDA = #188448 (`PaperColor.kt:52` TiendaBtn). TS19–TS24 already draw
it green, so a viewer sees the colour change between videos. Visible whenever the strip is on screen (TS11 2–21 s, TS12 1–16 s, TS13
2–22 s, TS14 2–20 s, TS15 2–16 s; TS9/TS10 have the CSS but the strip never shows).
Fix in each of `demos/tienda/TS9.html … TS15.html`, line 284: `background:#C44B28` → `background:#188448`. Re-render es, pt, en of TS11–TS15.

---

## TS9 (Meter y sacar efectivo): es, pt, en
1. MUST (file only, not on video): strip colour, see above.
2. Nice, all 3. After "Toca Guardar" there are 4.3 s with no voice (es 11.5–15.8, pt 12.1–16.0, en 12.3–16.5) on the "Guardado" snackbar. Fix: in `TS9.html` start beat 6 sooner (shorten the snackbar wait in the Save step, or let the "6-anotado" line begin on the snackbar).

## TS10 (Cerrar la caja): es, pt, en
1. MUST (file only): strip colour.
2. Nice, all 3. 4.6 s silent on "Caja cerrada" (es 11.4–16.0, pt 11.1–15.6, en 12.9–17.1) before "El resumen…". Same fix shape: let line 5 start when the summary appears.

## TS11 (Reportes): es, pt, en
1. **MUST, all 3 — the same timing bug RS11 had.** Line 3 "Ventas brutas, menos descuentos y devoluciones: tus ventas netas" (es 5.6–9.5, pt 6.8–11.7, en 7.4–12.4) plays over the **Devoluciones (1) detail page**, not over the table it describes (the page opens ~0.7 s into the line, es 6.3 s). Then line 5 "Los impuestos van aparte, y lo fiado no cuenta como cobrado" (es 12.1–15.6) plays over the **Impuestos page**, where the "En fiado (sin cobrar)" row it talks about is not visible.
   Fix in `demos/tienda/TS11.html`:
   - line 788: `beat:2` → `beat:3` (refunds open on "Cada línea abre sus ventas").
   - line 789: `beat:3` → `beat:4` (back to the table; its after-scroll to LINE_SCROLL shows Impuestos + En fiado during line 5).
   - line 790 (open the tax / BR discounts page): delete.
   - line 791: make it `{beat:5, hint:<same "Baja…"/keep>, target:'[data-t="on-tab"]', tap(st,E){ st.scroll=SCROLL_PAY; }}` so "Cómo te pagaron" scrolls in on line 6.
   - `features/TS11.json` step `5-impuestos` pt: "Os descontos se abrem, e o fiado não conta como recebido." → "O fiado ainda não conta como recebido." (and the pt subtitle of beat 5: "O fiado ainda não é recebido"). Re-render es, pt, en.
2. MUST: strip colour (above).
3. Nice, all 3. The strip subtitle is cut "Reporta un problema …" / "Relatar um problema …"; the app wraps it (no maxLines, SupportStrip.kt:161). Fix in TS11–TS15 line 287: remove `white-space:nowrap;overflow:hidden;text-overflow:ellipsis`.

## TS12 (Enviar al contador): es, pt, en
1. MUST: strip colour. Otherwise OK: rows, order and sums match (CO 4.716.737 + 869.719 − 1.144.600 = 4.441.856 = cash + card).

## TS13 (Clientes): es, pt, en
1. MUST: strip colour. Otherwise OK. (BR number "+55 319 123 456 17" = known R11; Juan green = known R7; owner phone only.)

## TS14 (Equipo y claves): es, pt, en
1. **MUST, all 3 — same as RS14.** "El PIN se muestra una vez" / "O PIN aparece uma vez" / "The PIN shows once" is false: the form always has PIN ●●●● + **Mostrar** (EmployeeCodeRow), visible in this video 5–15 s. The app dialog's own text is wrong too (known #26).
   - `features/TS14.json` step `6-pin`: es "Aquí está su PIN. Anótalo y dáselo; luego lo ves en su ficha con Mostrar." pt "Aqui está o PIN. Anote e entregue; depois você o vê na ficha, em Mostrar." en "Here's their PIN. Write it down and hand it over; you can see it later with Show."
   - `TS14.html` lines 494-496, beat 6: es "Su PIN: anótalo y dáselo", pt "O PIN: anote e entregue", en "Their PIN: write it down and hand it over".
2. **MUST, all 3.** Line 4 sells the staff stock permission ("por ejemplo, contar el stock", 10.7–13.7, chip "Controlar el stock" ticked). Monti has not decided stock across devices (a count on a staff phone is overwritten by the owner's next sync), and the brief says never market stock on a staff device. Use the RS14 example:
   - `TS14.html` line 508: `perm_can_control_stock` → `perm_can_close_shift` (hint and `data-t="chip-perm_can_close_shift"`, `st.perm.perm_can_close_shift=true`).
   - `features/TS14.json` `4-permisos`: es "Elige qué puede hacer: por ejemplo, abrir y cerrar caja." pt "Escolha o que pode fazer: por exemplo, abrir e fechar o caixa." en "Choose what they can do: for example, open and close the register."
   - `TS14.html` 494-496 beat 4: es "Elige qué puede hacer: abrir y cerrar caja", pt "O que pode fazer: abrir e fechar o caixa", en "Choose what they can do: open and close the register".
3. MUST: strip colour.
4. Nice, all 3. The "PIN nuevo" dialog closes ~0.7 s into line 6 (es 18.0 s), so the PIN line plays over the plain list. Fix: delete the OK step, `TS14.html` line 511.

## TS15 (Pago a empleados): es, pt, en
1. MUST: strip colour. Otherwise OK (consent page, "Cada persona necesita un monto…", Activar, "Pago de octubre", Todo pagado all real strings).

## TS19 (Otro celular o tableta): es, pt, en
1. **MUST, all 3.** The counter tablet's Catálogo grid is broken: tiles overlap, the prices of rows 1–3 are cut in half by the next row ("$ 9.800" half hidden), es 26.7–29.4 s, pt/en same moment. Cause: `.mgrid` rows are 50 px but the square tiles are 71 px.
   Fix `demos/tienda/TS19.html` line 326: `.k9left .mgrid{grid-template-columns:repeat(4,1fr);grid-auto-rows:max-content}` (tested: rows land at 326 / 403 px, no overlap). Re-render es, pt, en.
2. Nice, en/pt only (app words, not a demo error): the owner's chooser says "A register" / "Um caixa" (conn_opt_register) while the tablet says "Counter tablet" / "Tablet do balcão"; es says "Tablet de mostrador" in both. App fix: values/strings.xml conn_opt_register → "Counter tablet", values-pt-rBR → "Tablet do balcão".

## TS20 (Vender en línea): es, pt, en, US-es
1. Nice, all 4. 20.8–24.9 s (es) the page shows five "0 de 0 en línea" categories (known R20) for 4 s with no voice before "Comparte tu enlace". Fix: start line 5 earlier or scroll straight to the "Fuera de tu tienda online" card.
Otherwise OK: unlock words, US/CA free, pickup / pay at pickup, weighed items left out, notification text.

## TS21 (Funciona sin internet): OK
"Sin internet" strip, scan, pay screen (wordmark header is real, CheckoutSheetBody.kt:970), Exacto, Sale complete; US shows "+ Card · Set up" (visibility only, correct).

## TS22 (Respaldo): OK
On screen but already sent: "Drive/Platata/[Negocio]" (A3) and "…la instantánea del Tienda Doña Rosa — 20/10/2026, 12:42 p. m.." (#29, also a double period).

## TS23 (Huella / deudas): es, pt, en
1. Nice, all 3. The client page's purchase rows lack the bold "#131" / "#96" line the app always prints (CustomerPage.kt:203; TS13 has it). Fix `TS23.html` line 540: add a bold "#131" / "#96" line (the sale numbers TS13 uses) above the date.
2. Nice. The feature name "Huella para borrar o quitar cargos" (page title, json name) promises removing charges, which the video never shows (rightly: a shop's seeded service charge is known R5). Rename to "Huella y deudas" / "Digital e dívidas" / "Fingerprint and debts".

## TS24 (Sucursales): OK
"Copia este menú", "su propio menú", "Menú y precios" on a shop are known app bugs (#34 / R23).

---

## App issues (new, not in CODER-PROMPTS / ROUND3)
- A1 (small, visible in TS11 17.8 s): Reports "Cómo te pagaron" lists **Fiado $38.800** as a way you got paid, so its rows add to $184.650 while "Total cobrado" is $145.850 (REVFIX-5 took fiado out of the total but not out of the payment card). Fix: drop the fiado tender from `paymentMethodRevenue` (ReportsScreen.kt:404) or label it "En fiado (sin cobrar)".
- A2 (small): conn_opt_register en/pt (see TS19.2).
