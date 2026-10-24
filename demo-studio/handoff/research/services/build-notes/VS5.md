# VS5 — Cobrar con tarjeta (services, owner phone)

## 1. Built
- Owner phone, Veterinaria Patitas (`?biz=` works for the other three), Vacunación (Antirrábica) already in the sale.
- CO (Wompi, typed card): Cobrar → Tarjeta → number / "12 / 28" / CVC / name typed, consents pre-ticked → Cobrar $ 32.000 →
  "Enviando al banco…" → ¡Venta completada! "Pago aprobado" "VISA ••4242" (text, no logo). No camera card scan (not built).
- MX (Stripe Tap to Pay, CardCountryGate "MX" → STRIPE): pay row Exacto · QR · Tarjeta (big) + "Cobrar con enlace" under it
  (not tapped) → Tarjeta → "¿Agregar propina?" (services tip ON by default, ServicesRules.kt:34) → 18 % → "Acerca la tarjeta",
  total with the tip → "Procesando…" → "Pago aprobado". No fee anywhere. VS5-MX.json. US/CA run the same flow (no video).
- BR/PE/CL/EC/AR/PA: no card (follows TS5): Cobrar → Exacto → Nueva venta → Payment methods without Tarjeta. BR voice says the
  Pix QR already carries the total. Checked at 73c65f08.

## 2. Left out
- Real Tap to Pay: TapToPayMode.REAL_TAP_TO_PAY = false (sync/TapToPayMode.kt:25), the build uses Stripe's simulated reader.
- "Cobrar con enlace" / the phone-can't-tap path (another video). Card setup, Stripe dashboard, deposits: not shown.

## 3. New UX/UI problems (73c65f08)
- small: a Stripe sale (Mexico, US, CA) stores no brand and no last four (StripePaymentActions.kt:41 "null in v1",
  TerminalReaderManager.kt:445-447), so Sale complete and the receipt show only "Pago aprobado", with nothing to match a card
  statement. Fix: read brand/last4 from the PaymentIntent's card_present details.
- For the planner (demo pages, not the app): TS5/RS5 US show "VISA ••4242" after a Stripe sale; the app shows no card line.
- Same tile-price cut as VS4 (ProductCard.kt:307-330).

## 4. The 52 items checked here
- No item targets the card flow. FIX-1 item 7 (the "can't take cards" bar only in Stripe countries) confirmed
  (CardDeviceCopy.checkoutBarShown(stripeTenderAvailable)).

## 5. After REVIEW-VS4-7 (all six MUST/nice items done)
- Expiry now shows "1228" as typed (the app's field is a plain numeric EditText; "MM / AA" is only its empty hint).
- "Enviando al banco…": "COBRANDO" + amount top-left, spinner block centred between weighted spacers (WompiPaymentOverlay.kt:426-452).
- Timing: Cobrar waits 2.6 s, approval after 1.8 s; MX tip tap waits 2.6 s, card tap 3.0 s; the no-card jump to Payment methods
  after 2.6 s. MX line 3 now "El total ya lleva la propina. El cliente acerca su tarjeta…" (VS5-MX.json + subtitle).
- `?biz=` other than the vet says "Con el servicio en la venta".
- App bugs the reviewer found, checked real at 73c65f08:
  - small: Colombia (Wompi) shows the Stripe location warning when the phone never granted location: PaymentMethodsScreen.kt:436
    `CardLocationWarning(cardOn = method.isActive && isCard)` is not gated on the Stripe country. Fix: `&& stripeTenderAvailable`.
  - small: the Wompi expiry shows bare "1228" once typing starts (WompiPaymentOverlay.kt:380-385, HardenedCardField :682-765, no
    formatter); PAY-1 item 3 only added the hint. Fix: draw "12 / 28" while storing MMYY.
- For the planner: TS5/RS5 also draw "12 / 28" (the app shows "1228").

## Round 3 (37db6d6c)
- Page changed: service tiles follow ProductCard.kt:104-123 + ServicePriceBlock :295-333 + ServiceTileBody :340-422 ("Desde" on its
  own line, the amount whole on the tile's full width down to 8 sp, the minutes on their own line; tiles not stretched to the row,
  name 16/24 with 0.5 letter spacing); pay screen link "Servicios (1) ›" (CheckoutPayBlock.kt:245-251, SaleNoun); the small links
  under the pay row are now up to TWO rows (CheckoutSheetBody.kt:488-513, CheckoutPayBlock.kt:467-476: set-up link first, then
  "Cobrar con enlace"); Wompi expiry drawn "12 / 28" (WompiPaymentOverlay.kt:384-387, 684-692); MX Sale complete now shows the card
  line "visa ••4242" (TerminalReaderManager.kt:598-600, 641-651; StripePaymentActions.kt:105-106; ReceiptOptionsScreen.kt:569-588);
  receipt text (shared code) without "En el local" (ReceiptFormatter.kt:97-101) and with the "incluido" rule (MoneyLines.kt:113-116).
  STR: + items_price_from_only, bridge_mode_ask.
- Script: unchanged (VS5.json, VS5-MX.json). check_demo CO/BR/MX OK (also PE, US). Timing VS5 es:CO and VS5-MX es:MX: every line over
  its screen, no wait changed. No video exists, so no cut_price_scan; the tile frames show whole prices.
- The brief says "VISA ••4242" for Mexico. The app prints the brand exactly as the Stripe SDK gives it (`details.brand`, lowercase
  "visa"; the coder's own test feeds "visa", ServicesRound2R21Test.kt:286), so the page draws "visa ••4242".
- New app bug: small: a Stripe sale prints the brand in lowercase, "visa ••4242", while Wompi prints "VISA ••4242"
  (TerminalReaderManager.kt:650 readCardIdentity keeps `details.brand` as is; ReceiptFormatter.kt:138). Fix: uppercase the brand
  in readCardIdentity (or in cardTenderLine).
- Round-2 items seen: 2, 9, 17, 21 (tile) fixed; 7 fixed (both links, brand + last four); 14 fixed; 31 fixed (the Stripe location
  warning is gated on stripeTenderAvailable, PaymentMethodsScreen.kt:441); 32 fixed.
- Batch az (A-Z): the home grid with "Todos" picked now lists the services A-Z (PosDao.kt:334 getAllProducts "ORDER BY name ASC",
  SQLite binary order; ServicesLibrarySplit.kt only filters; MenuOrder.inCategory only for the trade chip, ProductLibraryView.kt:216-220);
  it used the menu order. A-Z puts the sold Vacunación on the last row, so the grid is scrolled to show it (scrollToTarget, as VS2),
  because line 1 says "Con la vacuna en la venta". Script unchanged; no tile is ringed; timing unchanged (real clips, CO and MX);
  checker OK CO/BR/MX; cut_price_scan OK.
