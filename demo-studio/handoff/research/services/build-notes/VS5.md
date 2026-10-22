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
