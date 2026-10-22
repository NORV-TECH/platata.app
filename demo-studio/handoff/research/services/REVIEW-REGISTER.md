# REVIEW-REGISTER: one day of the register at Peluquería Carolina (VS2, VS3, VS9, VS10)

Reviewer: independent pass, 22 Oct 2026. App read-only at /home/user/suma-plus-android, sim/usa-canada 73c65f08 (clean). I edited no file except this one.

How I checked:
- Ran `check_demo.py servicios/<ID> CO:es BR:pt MX:es` for all four pages: 12/12 print OK. Looked at every demo-mode PNG for CO, plus the MX VS3 pay screen.
- Video timeline: ran each page with `?mode=video` and read `window.__timeline`. Took frames at +0.3 / +1.6 / +3.0 / +4.6 s into every beat (CO es) and one frame per beat for BR pt and MX es. Ran it again with `&dur=` set to clip lengths guessed from the text (about 14.5 chars/s), because the recorder uses the real clip lengths and most lines are 1.2–3.7 s, not 5 s.
- Beats == json steps for CO es, BR pt and MX es: 6/6, 7/7, 7/7, 7/7, and every subtitle equals its json line. Script length: es 220–255 chars, pt 236–270. Uses tú / você, no greetings, and the last line has the right form.
- `?biz=veterinaria|taller-motos|unas` × CO/BR, video mode: no errors, every tap lands.
- Read the composables and strings each page cites (listed under "Verified" at the end).

## Money across the day (recomputed from kit/services-data.js with the pages' own rules)

| | CO | BR | MX |
|---|---|---|---|
| Opening (VS2) | $ 100.000 | R$ 150,00 | $500.00 |
| VS3 walk-in, cash | 25.000 paid 50.000 → change 25.000 | 40,00 / 50,00 → 10,00 | 140.00 / 200.00 → 60.00 |
| 13:10 cash sales / other | 252.000 / QR 132.000 (panel 384.000) | 330,00 / Pix 320,00 (650,00) | 670.00 / – |
| Should be in the drawer, before → after cash out (VS9) | 352.000 → 312.000 (−40.000) | 480,00 → 420,00 (−60,00) | 1,170.00 → 970.00 (−200.00) |
| 19:40 cash / net (VS10) | 425.000 / 557.000 | 560,00 / 880,00 | 1,480.00 / 1,480.00 |
| Expected = counted (VS10) | 485.000 | 650,00 | 1,780.00 |

The numbers add up on all four pages and in all three countries. 557 − 384 = 173 = today's four booked services (45+78+25+25). No total needs cash rounding: CL prices are multiples of $10, PE prices are whole soles and CA prices are multiples of 5¢, so no rounding line shows anywhere. That matches CashRounding.kt, which has no rule for CO, BR or MX.

## Summary

| Feature | es (CO) | pt (BR) | es (MX) |
|---|---|---|---|
| VS2 Abrir la caja | 1 MUST, 1 nice | 1 MUST, 1 nice | 1 MUST, 1 nice |
| VS3 Cobrar en efectivo | 1 MUST, 1 nice | 1 MUST, 1 nice | OK, 1 nice (the card button is right) |
| VS9 Meter y sacar efectivo | OK, 2 nice | OK, 2 nice | OK, 2 nice |
| VS10 Cerrar la caja | OK, 4 nice | OK, 4 nice | OK, 4 nice |

---

## VS2 (Abrir la caja)
1. **MUST, all 3. Beat 0 "Empieza el día: la caja está cerrada. Toca Abrir."** The Abrir tap fires 0.8 s into the line (VS2.html:303 has no `wait`). The amber "Caja cerrada · Abrir" bar is on screen only from 0.6 to 1.4 s. For the rest of the line (es is about 3.7 s long) the screen shows the "Abrir caja" keypad page. So "la caja está cerrada… Toca Abrir" describes a bar that is already gone, and the tap happens before the words ask for it (frames: CO 2.2 s and 3.6 s show the keypad page while that line plays).
   Fix VS2.html:303: `{beat:0, hint:…, target:'[data-t="bar-open"]', wait:2.2, tap(st){ st.screen="open"; }},`
2. nice, all 3. Beat 3 "La caja quedó abierta: toca un servicio": the tile tap fires at 0.8 s, so the option sheet is already up when "toca un servicio" is said. Fix VS2.html:307: add `wait:1.4,`.
- Otherwise OK. RegisterClosedBar (#FEF3C7 / #856404 / #FF9500 pill) sits under the TabRow (HomeScreen.kt:682-686). The keypad uses "000" in CO and the "," / "." key in BR / MX (MoneyKeypadEntry.zeroKeyFor). onOpened goes back to the till (RegisterNavGraph.kt:236-246). The option sheet shows "Lavado" switched on and "Cepillado / secado · se pregunta en la caja" switched off (OptionSelectionSheet.kt:255-262, toggleFor). The button reads "Agregar a la venta · $ 25.000". "Venta actual · 1 servicio" is right (CurrentSaleStrip.kt:46).

## VS3 (Cobrar en efectivo)
1. **MUST, CO es and BR pt. The pay screen contradicts the rest of the day.** VS3 at 12:41 draws QR as not set up: there is no QR button, and the link says "Configurar QR o tarjeta" (CO) or "Configurar Pix" (BR) (VS3.html:314). The same salon, on the same day and the same owner phone, shows QR money taken this morning in VS9 and VS10: CO "Pago QR $ 132.000", BR "Pix R$ 320,00". Both are listed on the Register screen under the owner as collector, and again in the closing summary. A shop that took Pix at 09:49 has its QR saved, so `PayWaysVisibility.decide` (PayWaysVisibility.kt:57-80) gives showQr = true. In Colombia (no Wompi key) the link is then CARD_ONLY "Configurar tarjeta". In Brazil there is no link at all.
   Fix VS3.html (copy the TS4 shape, tienda/TS4.html:325-338 and CSS :654-655):
   - after line 288: `const QR_SET = QR_COUNTRY && SALES_AT("night").some(s => s.pay==="qr");` (true for CO, BR and PA; false for MX, so the MX video does not change)
   - line 314: `const link = !QR_COUNTRY ? null : WOMPI ? (QR_SET ? "pay_setup_link_card" : "pay_setup_link_qr_card") : QR_SET ? null : PIX ? "pay_setup_link_pix" : "pay_setup_link_qr";`
   - line 322: `const cashW = cardPrimary ? 1.2 : (cardReady && QR_SET) ? 1.3 : QR_SET ? 2 : 1;` (CheckoutPayBlock.kt:330). With QR on and no card, CO keeps "Exacto · $ 25.000" and BR keeps "Exato · R$ 40,00".
   - before line 325: ``if(QR_SET) btns += `<div style="flex:1" class="ob" data-t="qr"><i class="x-qrg"></i>${esc(PIX?"Pix":t("pay_qr_short"))}</div>`;`` (CheckoutPayBlock.kt:367-383, `payQrShortLabel`)
   - STR: add `"pay_qr_short": {"en":"QR","es":"QR","pt":"QR"}` and `"pay_setup_link_card": {"en":"Set up card","es":"Configurar tarjeta","pt":"Configurar cartão"}`. Add the `.x-qrg` CSS from TS4.html:654-655.
   - The voice is unchanged. "Platata te dice el cambio: toca Efectivo" stays true, and the Pix button is a button, not a QR code, so the QR-2 voice rule does not apply.
2. nice, all 3. Beat 4 "Platata te dice el cambio: toca Efectivo": the tap fires at 0.8 s, so "toca Efectivo" is said over the sale-complete screen. Fix VS3.html:376: add `wait:1.4,`.
3. nice (not on video). For CL, AR, PA and US, the kit day has "Transferencia" sales, so that custom method is active. The pay screen should then say "Otro método de pago (2)", but VS3.html:327 hard-codes 1. Fix: `const OTHERS = 1 + (C.sales.some(s => s.pay==="transfer"||s.pay==="other") ? 1 : 0);` and use it in place of the 1.
- MX es OK (the brief's question). Mexico gains only the Card button. Card is primary (`cardIsPrimary = stripeOn && cardConfigured`, CheckoutSheetBody.kt:260): Cash 1.2 against "Tarjeta" 2, the short "Exacto" (CheckoutPayBlock.kt:349-352), a credit-card icon and no brand logo. The link is "Configurar QR", because MX has no QR sale today. "Cobrar con enlace" correctly does not show while a setup link is present (CheckoutSheetBody.kt:487-509). There is no tip prompt on cash and no fee. The Spanish words match CO, so no -MX json is needed.
- Otherwise OK. Total, "Artículos (1) ›", "… Otro método de pago (1)" (Cortesía, seeded active, PaymentConfigStore.kt:469), Recibido / green Cambio, "Efectivo", the CAMBIO hero "de $ 50.000 recibidos", WhatsApp / Ver recibo / "Nueva venta · Sin recibo", "Aviso de privacidad": all real strings. Change is right in all three countries.

## VS9 (Meter y sacar efectivo)
1. nice, all 3. Beat 0 "¿Sales a comprar insumos? Abre Mi negocio": the Mi negocio tap fires at 0.8 s, so the fingerprint sheet is already up when "Abre Mi negocio" is said. Fix VS9.html:317: add `wait:1.3,`.
2. nice, all 3 (and VS10). The Register top bar draws both arrows dim (VS9.html:243 and VS10.html:243). The salon has 6 weeks of earlier days in the kit, so earlier shifts exist and the "‹" arrow is enabled. `canGoPrev = currentIndex < shifts.size - 1` (RegisterStatusScreen.kt:82) draws it in onSurface. Fix: the first `<span class="dim">${I.chevL}</span>` → `<span>${I.chevL}</span>` in the common block of VS9 and VS10.
- Otherwise OK. The panel matches HomeScreen.kt:1550-1830: the register card "Caja abierta · Ventas" with the shift total (`paymentBreakdownSinceShift`), "Vender en línea" APAGADO, "Día a día", Clientes (no fiado wording), Facturas, Equipo "2 empleados · 2 en celular", Reportes "Ventas netas hoy · $ 384.000", Configuración, and no Items or Inventory rows. On the Register screen, the drawer card has the red movement line "Sacar efectivo · Proveedor · 13:10 -$ 40.000" with "Anular" (CashMovementLine :542-580), then a divider and "Debe haber en la caja". Sacar comes before Meter. The cash line reads "Todo el efectivo desde que abrió" because there is one register (`lowerMoneyCardIsShiftWide`, :50). The entry screen shows Monto / Motivo chips in the order Proveedor, Retiro del dueño, Otro, and "Guardar" stays off until there is an amount and a reason (CashMovementEntryScreen.kt:47-48, 145). There is no voice gap after Guardar.

## VS10 (Cerrar la caja)
1. nice, all 3. Beat 0 "Al final del día, toca la caja abierta": the tap fires at 0.8 s, before "toca la caja abierta" is said. Fix VS10.html:357: add `wait:1.2,`.
2. nice, all 3. Beat 1 "Baja y toca Cerrar caja": the scroll down happens in beat 0 (`E.after(900, scroll)` at VS10.html:357), so the line starts on a screen that has already scrolled. Fix features/VS10.json step 2-cerrar and the page beats (VS10.html:349-351): es "Abajo, toca Cerrar caja.", pt "Embaixo, toque em Fechar caixa.", en "At the bottom, tap Close register."
3. nice, all 3. Beat 3 "Cuadrado. Toca Cerrar caja y confírmalo": with a real clip of about 3 s the two taps are 1 s apart. The confirm dialog shows only from 0.8 to 1.9 s, and "y confírmalo" is said over "Caja cerrada". Fix VS10.html:362: add `wait:1.0,` to the dlg-close step.
4. nice: the chevron, same as VS9 item 2.
- Today's bookings at close are right. `OpenTablesAtClose.of` (sync/OpenTablesAtClose.kt:36-44) counts only unpaid tickets whose day is today or earlier. The kit's bookings for tomorrow and Saturday do not count, and today's four are charged, so "Cerrar caja" goes straight to the confirm and no "Antes de cerrar" dialog shows. The page draws exactly that. Neither the voice nor the screen claims anything about bookings.
- Otherwise OK. The close screen matches CloseRegisterScreen.kt:365-530: the tight card with "Debe haber en la caja", the red "Sacar efectivo -$ 40.000" row, and "Ver dinero por forma de pago ›" (shown because cashOut > 0, :141-143). After that come Contado, "Diferencia · Cuadrado", the keypad, and "Cerrar caja" off until a digit is typed. The dialog says "¿Cerrar la caja con $ 485.000 contados?" with "Cuadrado", "Seguir contando" and "Cerrar caja" (:306-351). The summary matches RegisterClosedScreen.kt:190-322: a green headline, times, Ventas netas, the bold "Total cobrado", "Dinero por forma de pago", the drawer card, "Enviar por WhatsApp", and "Listo" pinned. The "Cargos…" row is correctly absent because there are no charges. The WhatsApp text matches `ShiftSummaryText.build(plain = true)` line for line, and the signature is right ("Hecho con Platata · platata.app" / "Feito com Platata · platata.app"). pt "Fechado exato" is the app's own word. BR shows only a "Pix" total line and no QR, so the QR-2 voice rule is not triggered.

---

## App bugs and notes the builder did not list
- small: when a setup link shows, it hides "Cobrar con enlace". CheckoutSheetBody.kt:487-509 picks the setup link first (`?: if (payWays.showCard && linkOffer == UNDER_TAP)`). A Mexican owner with Stripe connected and no QR therefore never sees "Cobrar con enlace" until "No, gracias" is tapped. Fix: when both apply, draw both links (the setup link first, "Cobrar con enlace" under it).
- Severity note on the builder's VS2 item "tile prices cut" (ProductCard.kt:307-330). The layout math confirms it at 412 dp. ShrinkToFitText's 12 sp floor still does not fit next to the minutes, so every price on the services grid is cut: CO "$ 45.0…", "Desde …"; BR "A parti…", even "R$ 40,…". The grid is on screen for 6–10 s in VS2, VS3 and VS9, and in every other services till video. I would treat it as "BLOCKS THE DEMO" for the look, and have the coder fix it before recording (minutes on their own line, or under the price).

## Verified (no finding)
- Strings, es and pt: all the keys the pages use, checked against values-es and values-pt-rBR, including the pay screen, receipt options, register status, close, closed summary, cash movement, panel and setup links.
- Money format: `formatCurrency` + `localeForCurrency` (CurrencyUtils.kt:187-217); the keypad bottom-left key is `zeroKeyFor`.
- No fiado and no Save button for services (ServicesRules.kt:15, :47). Security is on by default, so the flag shows a fingerprint (SeedStore.kt:139, PlatataApp.kt:617-640). Nav labels: Caja, Agenda, Mi negocio (NavLabels.kt:22-27).
- Hard rules: no US/CA content in CO/BR/MX, no French, light theme, no card logos or brands (the WhatsApp screen follows the TS10 precedent), no camera scan, no Mexico fee, no fake people.
