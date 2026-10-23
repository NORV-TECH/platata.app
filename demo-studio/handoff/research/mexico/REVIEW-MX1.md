# REVIEW-MX1: RS5 (cards, restaurant), TS5 (cards, shop / pharmacy), RS25 (Cobrar con enlace), Mexico in Spanish

Reviewer: an independent pass, 23 Oct 2026. I read the app at `/home/user/suma-plus-android` sim/usa-canada **d30ffa1** (clean tree).
I edited no file except this one. (Running the checker rewrote the screenshots in `demo-studio/_check/`.)
Scope: only `RS5.html` + `RS5-MX.json`, `TS5.html` + `TS5-MX.json`, `RS25.html` + `RS25-MX.json`, with `?country=MX&lang=es`, plus the
"other countries unchanged" check for RS5 and TS5. I did not look at the sweep pages.

How I checked:
- **Strings.** I took `STR`/`PLU` out of each page and compared every key and language with `values`, `values-es` and `values-pt-rBR` at
  d30ffa1: **0 differences** (RS5 324 entries, TS5 459 + 12 plurals, RS25 180). The words on screen are the app's own words.
- **Checker.** `check_demo.py restaurante/RS5 MX:es CO:es US:en BR:pt`, `tienda/TS5 MX:es CO:es US:en BR:pt`,
  `restaurante/RS25 MX:es US:en CO:es`: **all 11 runs OK**. `TS5 MX:es &type=pharmacy` also plays to the end with no error.
  `validate_scripts.py RS5-MX TS5-MX RS25-MX`: beats == steps (6/6, 5/5, 8/8). Lengths 341 / 362 / 440 characters.
- **Other countries unchanged.** I put `f19b79b`'s RS5.html, TS5.html and kit/ in a scratch folder. I played old and new side by side in video mode
  (I compared the DOM every 0.1 s and the beat start times) and in demo mode (the DOM at every step). The result is **identical** for RS5 CO es, BR pt, US en, US es, CA en and PE es. It is
  also identical for TS5 in the same six, and for TS5 `type=pharmacy` CO es, BR pt and US en. The changed strings (`qr_payment_default_message` en, `scan_row_reports_today_net`
  pt) belong to pieces these flows never draw. The DATE change (CA becomes month-first) is never drawn in these flows either. **No non-Mexico path changed.**
- **Voice vs screen.** No clips exist yet, so I timed each line with the speed of the existing Spanish clips. I fitted it from 45 clips
  (RS3/4/5/7, TS5, VS5-MX, VS18-MX): **0.067 s per character, about 14.9 characters per second**. Then I played each page with that `dur=` and logged
  every screen change and every tap against the moment each phrase is said.
- **Hard rules.** No French, light theme, no card logo: the card is a plain blue rectangle and "VISA ••4242" is text only. No real
  product brands. No fee in the voice. "Apple Pay o Google Pay" appears only inside the app's own `link_notice_step_3`. No US/CA script was
  added.

## Summary

| Feature | MX es |
|---|---|
| RS5 Cobrar con tarjeta (restaurant, Tap to Pay with tip) | OK, 4 nice |
| TS5 Cobrar con tarjeta (shop / pharmacy, Tap to Pay, no tip) | OK, 3 nice |
| RS25 Cobrar con enlace (phone that cannot tap) | **2 MUST**, 4 nice |
| Other countries (RS5, TS5) | OK: byte-for-byte the same playback as f19b79b |

---

## RS5 Cobrar con tarjeta: OK, 4 nice

Verified on screen against the app:
- **Pay row.** Exacto 1.2 : QR 1 : Tarjeta 2. The source is `CheckoutPayBlock.kt:330` with `cardIsPrimary = stripeOn && cardConfigured` (`CheckoutSheetBody.kt:260`), the QR rule at :367 and the card rule at :431. Exacto is
  the short label because Card is on (:350-351).
- **The link under the row.** "Cobrar con enlace" sits centred and underlined, grey SemiBold 12 sp, with no "No, gracias". The source is `CheckoutSheetBody.kt:494-506` (UNDER_TAP,
  `onDismiss` not passed) and `CheckoutPayBlock.kt:457-490`. The set-up link does not take the slot, because QR is set up (`PayWaysVisibility.kt:64-70`).
- **Tip screen.** It shows 15/18/20 % over $190.00, then Sin propina, Otro monto and Cancelar (`StripePaymentSheet.kt:262-347`, restaurant `tipDefaultOn`).
- **Charge.** After the tip: "Preparando el cobro…", then "Acerca la tarjeta" + Cancelar, then "Procesando… / No retires la tarjeta". "Total a cobrar" reads $224.20 = 190 + 34.20 (:176).
- **Sale complete.** It shows "¡Venta completada!", "Pago aprobado" and no card line, which is right for Tap to Pay (`StripePaymentActions.kt:41-42`, decided). The receipt goes
  by WhatsApp, then Ver recibo and "Nueva venta · Sin recibo" (`ReceiptOptionsScreen.kt:81, 213-216, 386-461`).

1. **nice, beat 0.** The Cobrar tap lands at +0.8 s, but "toca Cobrar" is only said from about +1.3 s. The pay screen appears before the word is spoken.
   Fix: in `RS5.html:296` (stepsMx beat 0), add `wait:0.6`.
2. **nice, beat 3 → 4.** Sale complete appears at +4.1 s of line 4, which runs about 5.0 s. So "…o su celular, al tuyo" is said over "¡Venta completada!".
   Fix: `RS5.html:300`, change `E.after(2000` to `E.after(2800` (Mexico steps only).
3. **nice, line 5 (`RS5-MX.json:39`).** "Pago aprobado, con la propina incluida." is said over a Sale complete screen that shows no amount and no tip
   (`ReceiptOptionsScreen.kt:213-216`, `CardApprovedLines` :569-586). The $224.20 was on the previous screen.
   Fix: "Pago aprobado: la venta queda guardada sola. El recibo lo mandas por WhatsApp." (the same wording as TS5).
4. **nice, wording, line 3 (`RS5-MX.json:27`).** In Mexico, "Pásale" alone first reads as "come in". Fix: "Pásale tu celular al cliente: elige la
   propina y el cobro empieza."

## TS5 Cobrar con tarjeta: OK, 3 nice

Verified on screen against the app:
- **Register.** The scan register shows Fiado / Sin código / Teclado and "Escanear más · Cobrar $66.00". This is true: the tab does not list the lines (`ScanCheckoutTab.kt:61-100`).
- **Pay row.** It is the same row as RS5, plus Fiar in the save slot (`CheckoutSheetBody.kt:343-346`).
- **Tips off.** With tips off, the Card tap starts the charge by itself (`CheckoutSheetBody.kt:636-643`, `RetailRules.kt:32`). There is no tip screen, and the total is $66.00.
- **Sale complete.** It is the same screen as RS5 (WhatsApp route).
- **Pharmacy.** With `type=pharmacy` the products are Paracetamol and Suero oral, total $67.00, and the page plays clean.

1. **nice, beat 0.** The Cobrar tap lands at +0.8 s, but "toca Cobrar" is said at about +2.0 s.
   Fix: in `TS5.html:576`, add `wait:1.2`.
2. **nice, line 2 (`TS5-MX.json:21`).** "en una tienda no se pide propina" is the shop *default*: the owner can turn "Pedir propina" on. The same script
   also plays for `type=pharmacy`. Fix: "Toca Tarjeta: aquí no se pide propina, así que el cobro empieza de una vez."
3. **nice.** The stale-ring look in the checker's `demo-02.png` is only the ring's 1 s CSS transition caught mid-flight. Measured settled, the ring sits on
   `[data-t="tapcard"]` (the same in US). Nothing to fix. I list it so nobody chases it.

## RS25 Cobrar con enlace: 2 MUST, 4 nice

Verified against `PosLinkScreen.kt` and the rules:
- **Who gets the link.** `PayByLinkOffer.decide` gives INSTEAD_OF_TAP. Card is weight 1, because `cardIsPrimary` is false: `StripeCardGate` folds `deviceCanTakeCards` into
  chargeable.
- **Pay screen.** The Card button shows "Tarjeta / Por enlace · QR o WhatsApp". It fits at 12 sp. The amber `LinkPayHint` sits under the row (colours `Color.kt:140-142`).
- **Notice page.** Every piece matches the app (`PosLinkScreen.kt:103-184`): the red box (#FF3B30 border, #FFE5E3, #7A0000), the 3 steps, the small `link_notice_cost` line, and Continuar /
  Cobrar de otra forma.
- **Tip, then the link.** The same tip page comes next. Then "Creando el enlace…", then the QR page: $218.50, "Incluye propina $28.50", the QR 200 dp on white,
  "Esperando el pago…", Enviar por WhatsApp / Revisar el pago / red Cancelar (:244-375). Then "Pago recibido. Guardando la venta…".
- **Sale complete.** "Pago aprobado VISA ••4242" with no cuota, which is right for a link sale (`PosLinkRules.kt:149-166`, installments 0 → no count). WhatsApp route.
- **The customer's side.** Stripe's page is never drawn. The hop card stands in for it.

1. **MUST, beat 0 (register screen).** The app draws a red strip at the top of the register on a phone without NFC in a Stripe country, and
   the page leaves it out. The strip reads **"ESTE TELÉFONO NO PUEDE COBRAR CON TARJETA"**.
   - Evidence: `HomeScreen.kt:441-443` (`cardStripText = CardDeviceCopy.stripRes(...)` when `stripeTenderAvailable`), drawn at
     `HomeScreen.kt:588-590` through `WarningBars` (nothing outranks it in the demo setup). It looks like `CardDeviceNotice.kt:87-118`:
     background errorContainer #FFE5E3, text #7A0000, 11 sp bold, an info icon of 13 dp, padding 14/6 dp, one line. The text is `values-es:1367`. The page states NO_NFC
     (`RS25.html:138`, `link_notice_reason_no_nfc`), so the strip is due.
   - Fix (pick one).
     - **(B), recommended:** make the demo phone an *old Android* instead. `OS_TOO_OLD` gets no strip (`CardDeviceCopy.stripRes`:
       `state != NO_NFC -> null`), and it still gives INSTEAD_OF_TAP and the same pay screen. In `RS25.html:138` use
       `t("link_notice_reason_old_os", "12")` ("Tiene Android 12. Se necesita Android 13 o más nuevo."). Add that key to STR and update
       the header comment. The voice already fits.
     - **(A):** keep NO_NFC and draw the strip above `x-tabs` in `regScreen` (`RS25.html:101`). That is true, but it shouts "can't take cards" in a
       video about taking cards (see the app bug below).
2. **MUST, beat 1.** "Toca Tarjeta." starts at character 86 of a 100-character line (about +5.8 s; about +6.6 s at a slower 13/s). But the tap
   lands at +3.2 s (`wait:2.4`). So for about 2.5 s the voice says "…con un enlace. Toca Tarjeta." over the red notice page, with Tarjeta already gone.
   Fix: `RS25.html:202`, change `wait:2.4` to `wait:4.9`. The beat still ends cleanly at about +7.2 s.
3. **nice, beat 3.** "El cliente elige la propina." lasts about 2.0 s. The 15 % tap lands at +0.8 s, so "…la propina" is said over the spinner "Creando el
   enlace…". Fix: make line 4 "El cliente elige la propina en tu celular." (`RS25-MX.json:33`) and add `wait:1.0` to `RS25.html:204`.
4. **nice, beats 5–6.** The tap on the QR fires settle at +3.4 s and Sale complete at +4.8 s, both inside line 6. So "…y paga ahí con su
   tarjeta" plays over "Pago recibido. Guardando la venta…", and line 7, "El pago llega y la venta se cierra sola", plays over a Sale complete that is already up.
   Fix: at beat 5, the QR tap shows only the hop card (drop both `E.after` in `RS25.html:207`). Add a beat-6 step: `{beat:6,
   hint:H("El pago llega a tu teléfono",…), target:'.rhop-dev.on', tap(st,E){ st.link="settle"; E.after(1400,()=>{ st.link=null;
   st.screen="done"; }); }}`. The beats stay at 8.
5. **nice, wording, line 2 (`RS25-MX.json:21`).** In Mexico "igual cobras" can read as "maybe" or "the same way". Fix: "…aun así cobras con
   tarjeta, con un enlace. Toca Tarjeta."
6. **nice, voice and cost.** The voice never talks about cost. The small `link_notice_cost` line is drawn because it is the app's text (the brief allows it). See the app
   note below about whether it is true in Mexico.

---

## App bugs and notes (the app, not the pages)

- `HomeScreen.kt:441-443` + `sync/CardDeviceCopy.kt` `stripRes`: on a phone without NFC in a link country (US/CA/MX), the register shows
  "ESTE TELÉFONO NO PUEDE COBRAR CON TARJETA". The pay screen of the same phone offers the card by link (`PayByLinkOffer.INSTEAD_OF_TAP`), and
  LINK-3 already made the pay-screen bar link-aware (`LinkPayHint`). The strip contradicts it. The panel warning row has the same problem. Fix: when the link is offered, show a link-aware strip
  or none.
- Confirmed (builder's): `CheckoutSheetBody.kt:231` sets `cardConfigured = stripeChargeable`, which needs `readerReady`. Then `CheckoutPayBlock.kt:451` (else branch,
  `showPlus = true`) draws "+ Tarjeta · Configurar" for a *connected* account whose reader is not connected yet. This contradicts
  `PayWaysVisibility.kt:13-14`. It also drops `cardIsPrimary`, so the row weights change.
- Known and decided: `TerminalReaderManager.kt:445` gives a Tap to Pay sale no brand and no last four. `TapToPayMode.kt:25 REAL_TAP_TO_PAY = false` (simulated
  reader). Once real Tap to Pay ships, Stripe's own tap screen may cover "Acerca la tarjeta". Re-check the pages then.
- `values-es:1325` `link_notice_cost` says the link "cuesta un poco más que acercar la tarjeta". In Mexico neither path carries a Platata fee
  (LINK-1, STRIPE-MX-1). The claim therefore rests only on Stripe's own Mexican rates. Confirm it, or word it per country.
- Doc drift only: the comment at `CheckoutPayBlock.kt:326-327` says Card is 2.4 and Cash 0.6, but the code is 1.2 / 2. `CardDeviceCopy.kt` comments still say "US / Canada" only.
