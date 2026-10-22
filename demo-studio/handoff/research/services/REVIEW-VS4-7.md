# REVIEW-VS4-7: services demos VS4 (QR / Pix), VS5 (card: CO Wompi, MX Stripe), VS6 (other ways to pay), VS7 (receipt)

Reviewer: independent pass, 22 Oct 2026. App read at `/home/user/suma-plus-android` sim/usa-canada **73c65f0**, clean tree.
I edited no file except this one. (Running the checker rewrote the screenshots in `demo-studio/_check/`.)

How I checked:
- Every string: I pulled `STR`/`PLU` out of each page and compared every key and language with `values`, `values-es` and
  `values-pt-rBR`: **0 differences** (VS4 147 keys, VS5/VS6 120, VS7 140). So the words are the app's own. What remained was
  whether the right words sit in the right places, plus layout and timing.
- `check_demo.py servicios/VSn CO:es BR:pt MX:es`: **all 12 runs OK**. I looked at every demo screenshot.
- Video timeline: I ran each video in `mode=video` with `dur=` set from the script lengths (about 14 chars/s + 0.6 s). I took
  frames at 0.3 s, 55 % and the end of every beat (CO es, BR pt, VS5-MX, VS6-MX). Beats == json steps everywhere: VS4 6/6,
  VS5 5/5 (MX 5/5), VS6 6/6 (MX 6/6), VS7 7/7.
- Scripts: es 228–364 chars, pt 315–407, MX 280/314 (all ≤ 550). tú / você are right. The last lines are right. No greetings.
- `?biz=` peluqueria / veterinaria / taller-motos / unas × all 4 pages, CO, video mode: no errors, every tap is done.
- Hard rules: no US/CA script, no French, light theme only. "VISA" appears only as text, with no logo. No card scan. No fee
  in Mexico. No fake AI people. Brand names on screen are the app's own: Wompi in its legal consent text, and Nequi /
  Mercado Pago as the add-box example. TS6 already used Nequi and passed REVIEW-R4.

## Summary

| Feature | es CO | pt BR | MX es |
|---|---|---|---|
| VS4 Cobrar con QR / Pix | OK (2 nice) | OK (2 nice) | no video (page OK) |
| VS5 Cobrar con tarjeta | **3 MUST**, 1 nice | OK (2 nice) | **1 MUST**, 1 nice |
| VS6 Otras formas de pago | OK (1 nice) | OK (3 nice) | OK (1 nice) |
| VS7 Recibo WhatsApp / impreso | **2 MUST**, 3 nice | **2 MUST**, 4 nice | no video (page OK) |

## The four builder choices you asked me to judge

1. **Mexico: Stripe connected only in VS5. VS4/VS6/VS7 show "+ Tarjeta · Configurar". → Right, keep it.** The set-up
   button is real: `PayWaysVisibility.kt:59` (Stripe country, owner, not connected) and `CheckoutPayBlock.kt:451`
   (`showPlus`). The weights are also right (Exacto 1.3 · QR 1 · nudge 1). A *connected* account would change Payment
   methods, which VS4 and VS6 open on. It would add "Ver depósitos" even with the switch off (`PaymentMethodsScreen.kt:377`).
   With the switch on it would also add the Stripe status card, the reader row and "Ajustes de Stripe" (:420-500). That is
   hold content (deposits, Stripe). Showing it "not connected" is the honest way to stay clear of it.
2. **VS7's 11:30 booking made in the page. → Acceptable.** The client, service, add-on and stylist all come from the kit.
   The 11:30 time is what makes the page true. At 12:41 an 11:30 booking has reached its hour, so "No asistió" appears
   (`AppointmentDetailScreen.kt:149-151`). Charging after the service is the natural story. The kit's bookings (14:00 and
   later) would mean charging before the work. nice: add this booking to `kit/services-data.js` bookings (kit owner's
   call), so every services page's agenda agrees.
3. **Colombia "VISA ••4242" as plain text. → Correct, it is exactly what the app shows.** Wompi's tokenizer answer
   carries `brand:"VISA"`, upper-case text (`WompiTokenizer.kt:74-83`). It is copied at approval
   (`WompiPaymentOverlay.kt:143`). Sale complete draws "Pago aprobado" and then `cardTenderLine` = "VISA ••4242", with the
   installments only when there are more than 1 (`ReceiptOptionsScreen.kt:569-586`, `ReceiptFormatter.kt:124-137`). While
   sending, the pill really is "Tarjeta · 1 cuota", because the brand is not known yet (`CardPill` :572-576). There is no logo
   anywhere, so the no-logo rule is kept.
4. **Service tiles with a cut "Desde…" price. → True to the app, so it is not a page MUST. But it reads as broken in every
   video.** The math is right. The grid is Adaptive(120 dp) with 16 dp padding and 8 dp gaps
   (`ProductLibraryView.kt:182, 325-326`). On a 412 dp phone (`material.css:5`) that gives 3 columns, so 97 dp inside a
   tile (SpaceSm 12). The price stops shrinking at 12 sp and then gets "…" (`ShrinkToFitText.kt:31-43`), next to the
   minutes (`ProductCard.kt:304-323`). Worth knowing: only phones **404 dp or wider** get 3 columns. On a 393 dp phone
   (Pixel 7/8) or a 360 dp phone the till has 2 columns and "Desde $ 25.000 · 40 min" fits. Recommendation: have the
   coder move the minutes under the price (the builder's fix) before recording, or accept it. Do not fake 2 columns inside
   the 412 dp frame.

---

## VS4 Cobrar con QR / Pix: es OK, pt OK

Verified: the QR switch opens the full-page responsibility screen first (`PaymentMethodsScreen.kt:323`,
`QrResponsibilityScreen.kt:139-264`). Its order on the page is the same: potato, h1, red card, three drawn tips, tick, CTA,
"Ahora no". After "Entendido" comes the source chooser (`QrTermsGate` → OPEN_CHOOSER, :660-670). The QR turns on only after
a good upload, with the toast `qr_setup_saved(_pix)`. Brazil uses Pix words everywhere (`PixLabels.kt:36-56`,
`localizedPaymentMethod` "Pix"). The overlay redraws the QR with the total (`QrPaymentOverlay.kt:180-185`). The red cashier
note shows by default (customMessage "" → default). Exacto 2 : QR 1 in BR; Exacto(short) · QR · Tarjeta in CO. There is no
Fiado row (`FiadoScope.kt:12`). pt line 4 says the QR carries the total while the Pix QR with R$ 40,00 is on screen.

1. nice, es + pt, beat 5. The "Pagó · Sin foto" tap lands at 0.8 + 1.2 = 2.0 s (`VS4.html:447`). The es line is about
   6.3 s, so "Revisa que el pago llegó y toca Pagó" (pt "…toque em Pago") is said over "¡Venta completada!". Fix:
   `VS4.html:447` `wait:1.2` → `wait:4.5`.
2. nice, all. The cut "Desde…" tiles (choice 4 above). Also "Artículos (1) ›" for one service. That is the app's
   `checkout_items_link` (`CheckoutPayBlock.kt:238`), already in the builder's notes.

## VS5 Cobrar con tarjeta: es 3 MUST, MX 1 MUST, pt OK

Verified: Wompi typed form (`WompiPaymentOverlay.kt:340-405`). Number and CVC are masked. The two consents are pre-ticked.
The sale saves itself on APPROVED (no "Pago aprobado" screen of its own). There is no camera scan. Mexico: Stripe
(`CardCountryGate.kt:112`), weights Exacto 1.2 · QR 1 · Tarjeta 2. "Cobrar con enlace" sits under the row because the phone
can tap and QR is set up (`PayByLinkOffer.kt:29-36`, `CheckoutSheetBody.kt:487-505`). The services tip is on
(`ServicesRules.kt:171` + `OwnerSettings.kt:58-63`). The tip screen comes first, and a preset tap starts the charge
(`StripePaymentSheet.kt:153-170, 285-300`). 18 % of $180.00 = $32.40, total $212.40. After approval the screen shows only
"Pago aprobado", with no card line. No fee is shown. BR/PE…: no Card button and no Card row (`PaymentMethodsScreen.kt:288-293`).

1. **MUST, es CO, beat 3 (voice vs screen).** "Las casillas ya vienen marcadas. Toca Cobrar." is about 3.8 s long, but the
   Cobrar tap lands at 0.8 s (`VS5.html:411`). The consents leave the screen ("Enviando al banco…") while the voice is
   still talking about them. Fix: on `VS5.html:411` add `wait:2.2`, and change `E.after(2600,…)` to `E.after(1800,…)` so
   the approval lands right at the start of beat 4 ("El banco aprueba…").
2. **MUST, es CO, beat 2 (wrong vs app).** The expiry shows "12 / 28". The app's expiry field is a plain numeric EditText
   holding "MMYY, 4 digits" with no formatter (`WompiPaymentOverlay.kt:123, 380-385`, `HardenedCardField` :682-765). Once
   typed it shows **"1228"**, and "MM / AA" is only the empty hint. Fix: `VS5.html:356`
   `const exp = st.exp.length>2 ? …` → `const exp = st.exp;`.
3. **MUST, es CO, "Enviando al banco…" layout (wrong vs app).** The page centres everything, label and amount included
   (`VS5.html:348-353`). In the app, SendingScreen puts "COBRANDO" + "$ 32.000" at the **top-left**, the same place as the
   entry header. Then come weighted spacers, with the spinner, title, subtitle and pill centred between them
   (`WompiPaymentOverlay.kt:426-452`). Fix: render `<div><div class="lb">COBRANDO</div><div class="am">$…</div></div>`
   first in a normal `.x-wo` column. Then add a `flex:1` spacer, the centred spinner block, and another `flex:1` spacer.
4. **MUST, MX, beat 3 (voice vs screen).** "Acerca su tarjeta o su teléfono al tuyo. El total ya lleva la propina." is
   about 5.6 s. The tap-card step fires at 0.8 s and the sale completes at about 3 s (`VS5.html:418`). So "El total ya
   lleva la propina" plays over "¡Venta completada!", where no total is shown. Fix: change `VS5-MX.json` step `3-tap` to
   "El total ya lleva la propina. El cliente acerca su tarjeta o su teléfono al tuyo." Add `wait:2.6` to
   `VS5.html:418`. Change the STRIPE es subtitle 3 (`VS5.html:435`) to "El total ya lleva la propina: acerca la tarjeta".
5. nice, MX, beat 2. The 18 % tap lands at 2.0 s, before "…o Sin propina" ends, so the tip screen is gone when "Sin propina"
   is said. Fix: `VS5.html:417` `wait:1.2` → `wait:2.4`.
6. nice, pt BR, beat 3. "Nova venta" goes to the till, and 1.5 s later the page jumps straight to Formas de pagamento, while
   the line is still "Toque em Nova venda". Fix: `VS5.html:424` (`stepsNone[2]`) `E.after(1500,…)` → `E.after(2600,…)`. The jump itself (no
   Meu negócio → Formas de pagamento path) is the same cut TS5 uses, so it is OK.
7. nice, `?biz=` other businesses. Subtitles and beats always say "Con la vacuna en la venta" (`VS5.html:431, 435`), which
   is nonsense for a salon or a workshop (no video is made for them). Fix: when `V.biz!=="veterinaria"` use
   "Con el servicio en la venta: …" (pt "Com o serviço na venda: …").

## VS6 Otras formas de pago: OK

Verified: "+ Nuevo" (`common_new_short`), and the add box example per country (`PaymentMethodExample`). A new method is
`isActive = true` (`PaymentConfigActions.kt:172-182`), and Cortesía is seeded active (`PaymentConfigStore.kt:469`). The order
is cash, qr, "Mercado Pago", then the rest (`PosViewModel.kt:2109-2124`), so MX shows Mercado Pago above Tarjeta, and the
sheet lists Mercado Pago before Cortesía. In CO/BR, Cortesía comes before the new method. The sheet is title + total line +
rows (`OtherPaymentSheetContent.kt`). The PAY-1 confirm reads "Confirma que recibiste el pago de $ 40.000 en Nequi." with
Volver / Sí, cobrar. There is no Save/Fiar.

1. nice, es/pt/MX, beat 4. The method tap lands at 2.8 s (`VS6.html:418`). The confirm dialog covers the sheet while
   "…para regalar un servicio. Toca Nequi" is still being said (lines 5.3 / 6.3 / 7.0 s). Fix: `wait:2.0` → `wait:3.8`.
2. nice, pt BR. Pix is on screen (the Formas de pagamento row and the "Pix" button), but the script never says the Pix QR
   carries the total. A strict reading of the helper brief ("every Brazil video that shows QR/Pix") makes that required.
   If wanted: change line 3 to "No caixa, toque em Cobrar e em Outra forma de pagamento. O Pix tem seu botão e já leva o
   valor." (+45 chars, the script stays under 410).
3. nice, pt BR. The last subtitle "Assim você cobra com outras formas de pagamento, com o Platata." is 63 chars (> 60).
   This is the same as TS6/RS6, so accept it or shorten the subtitle only.

## VS7 Recibo por WhatsApp o impreso: es 2 MUST, pt 2 MUST

Verified:
- The bottom tab is "Agenda" (`NavLabels.kt:24-31`), with a back arrow and Ventas | Agenda N
  (`ServicesTransactionsScreen.kt:128-180`). Rows are grouped by day.
- BookingRow shows "Viene/Hoy/11:30 a. m." and the raw "+57…" (:369-470, item 51 is still half done, as the builder noted).
- The appointment page lists each line with its money, then "· Dura 40 min", "Atendió: Carla Gómez", Cobrar / No asistió /
  Reprogramar / Cancelar cita, ¿Cuándo viene?, the end hint, ¿Para quién? with the formatted number, and Guardar
  (`AppointmentDetailScreen.kt:215-460`).
- The pay screen shows the amber bar with the client and no Borrar.
- With a printer saved, the receipt prints on its own (`CheckoutActions.kt:620-630`). Sale complete then shows WhatsApp /
  Imprimir otra vez / Ver recibo / "Nueva venta" (`saleCompleteNewSaleLabelRes`).
- WhatsApp opens straight on the client's number (`WhatsappReceipt.kt:95-103`), signed "Hecho con Platata · platata.app".
- Reprint shows the toast `tx_receipt_sent_to_printer` (`ReceiptOptionsScreen.kt:74-78`).
- The receipt body follows `generatePastPlainTextReceipt` (`ReceiptFormatter.kt:343-470`) line by line, except item 2 below.

1. **MUST, es + pt, beat 4 (voice vs screen).** WhatsApp "send" fires at 0.8 + 2.0 s, and the page returns to Sale
   complete 1.8 s later (`VS7.html:490`). The line is about 7.9 s (pt 8.4 s), so "…lo que estaba incluido y quién atendió.
   Envíalo." (pt "…o que estava incluído e quem atendeu. Envie.") is said over "¡Venta completada!", where no receipt is
   visible, and after it was already sent. Fix: `VS7.html:490` (and the SMS twin :496) `wait:2.0` → `wait:5.5`.
2. **MUST, es + pt, beat 3–4 (wrong vs app).** The receipt lacks the where line. A services sale stores its where mode even
   when it is the only one: `diningOptionName = resolvedWhereModeName()` (`CheckoutActions.kt:429`, `CartActions.kt:726-737`,
   `gateSelection` returns the single active mode). The past receipt then prints it under the Subtotal when it cost
   nothing: `whereModeLine` (`ReceiptFormatter.kt:90-102, 421`). It resolves through `diningNames["where_local"]`
   (`ReceiptActions.kt:126`). So the WhatsApp text the app sends has **"En el local"** (pt **"No local"**) between
   "Subtotal: …" and the "=====" line. Fix: `VS7.html:280` in `receiptText`, after the Subtotal line add
   `s += t("where_mode_local") + "\n";`. Add `where_mode_local` (es "En el local", pt "No local", en "In the shop") to STR.
   Only VS7 shows the receipt, but the function is the shared one.
3. nice, es + pt, beat 5. "Imprimir otra vez" is tapped at 0.8 s, before "Si hace falta, toca Imprimir otra vez" is said.
   Fix: `VS7.html:491` (and :497) add `wait:2.6`.
4. nice, pt BR. Like VS6, the pay screen shows the Pix button and the script never says the QR carries the total. It is
   less needed here because the scene is about receipts. Owner's call.
5. nice, pt BR. The last subtitle is 68 chars (> 60). This is the same as TS7, so accept it.
6. nice, `?biz=taller-motos`. The subtitles say "toca la cita de Sofía", but a workshop has an order (the row says
   "Listo", the button "Cancelar orden"). Fix: in `VS7.html:510-512` use "la orden de" when `V.isOrder`.
7. nice. Move the 11:30 booking into the kit (choice 2 above).

---

## App bugs I found that the builder did not list (73c65f0)

1. **small, Colombia shows the card location warning.** `PaymentMethodsScreen.kt:436`
   `CardLocationWarning(cardOn = method.isActive && isCard)` is not gated on the Stripe country. A Colombian owner whose
   phone never granted location gets "Los pagos con tarjeta necesitan que este teléfono permita ubicación"
   (`values-es:5236`) in the Wompi block. Wompi's typed card needs no location (the start-up ask is Stripe-only,
   `StartupCardLocationGate.kt:71`). Fix: `cardOn = method.isActive && isCard && stripeTenderAvailable`.
2. **small, receipts say "incluido (Incluido)".** About 30 included options in `catalogo_investigado/taller-motos.json`
   already end in "incluido/incluida", for example "Filtro de aceite incluido". The receipt adds " (Incluido)"
   (`ReceiptFormatter.kt:289, 400`), giving "Filtro de aceite incluido (Incluido)". You can see it in VS7 with
   `?biz=taller-motos`. Fix: drop the word from those catalogue names, or skip the suffix when the name already ends with it.
3. **small, every in-shop services receipt prints "En el local".** `whereModeLine` returns a label for LOCAL too
   (`ReceiptFormatter.kt:90-102`). Item 43 was meant for home visits with no charge. On a salon's receipt a bare
   "En el local" line is noise. Fix, if Monti agrees: return null for `WhereMode.LOCAL`. If that fix lands, VS7 MUST 2
   goes away.
4. **small, the expiry field shows bare digits.** Once typing starts, the Wompi expiry shows "1228" with no separator,
   because the "MM / AA" hint disappears (`WompiPaymentOverlay.kt:380-385`). Fix: a visual transformation that draws
   "12 / 28" while still storing MMYY.
