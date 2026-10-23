# MX-SWEEP: Mexico takes cards (Stripe) on the restaurant and shop pages

App checked: `/home/user/suma-plus-android` at d30ffa1 (sim/usa-canada). Not touched: `demos/restaurante/RS5.html`,
`demos/tienda/TS5.html` (another helper), voice scripts, tools/, index.html, servicios pages (they read their own
`kit/services-data.js`, not these kits).

## The rule split (what every change follows)

| Question | App answer | File:line |
|---|---|---|
| Card gateway | Stripe = US, CA, **MX**; Wompi = CO; else none | `sync/CardCountryGate.kt:32-37` |
| QR exists | everywhere but US, CA (Mexico keeps QR) | `sync/QrCountries.kt:10-12` |
| Receipt by text/email | US, CA only (Mexico: WhatsApp) | `sync/ReceiptSendRoute.kt:23-27` |
| Receipt date month-first | US, CA only (Mexico dd/MM) | `utils/ReceiptFormatter.kt:185-187` |
| Card set-up button on the pay screen | Stripe country + owner + Stripe not connected | `sync/PayWaysVisibility.kt:59`, `ui/screens/home/CheckoutSheetBody.kt:241-260` |
| Owner's set-up link | owner, not dismissed, **QR country**, something not set up; Mexico = "Configurar QR" (CARD_ONLY/QR_AND_CARD are Wompi only) | `sync/PayWaysVisibility.kt:63-70` |
| Card is the big button (Exact 1.2 / Card 2) | Stripe country + card chargeable | `CheckoutSheetBody.kt:260`, `CheckoutPayBlock.kt:330` |
| Payment methods rows | Card row in CO/US/CA/MX; QR row where `QrCountries.hasQr` | `ui/screens/settings/PaymentMethodsScreen.kt:289-294` |
| Net sales note | tip wording in every Stripe country (MX too) | `sync/NetSalesWords.kt:16-21` |
| Panel "Hoy · $X" net words | outside US/CA (MX unchanged) | `sync/NetSalesWords.kt:25-26` |
| Onboarding pay line | "Efectivo, QR y tarjeta" for MX (card gateway + QR) | `ui/screens/onboarding/BusinessTypeOptions.kt:348-358` |
| Online store card row | `forOnlineStore(MX) = NONE` -> row hidden | `sync/CardCountryGate.kt:44-45`, `sync/SellOnline.kt:41-49` |
| Tips asked | restaurant yes, shop no (per type, every Stripe country) | `data/business/RestaurantRules.kt:32`, `RetailRules.kt:32` |

## Files changed

**Kits**
- `kit/restaurant-data.js`: MX `pay:{card:"stripe", qr:"bank", tips:true}`; header says US/CA/MX and that QR and the receipt route are
  their own sets.
- `kit/shop-data.js`: MX `pay:{card:"stripe",qr:"bank",tips:false,tipOption:true}`; header likewise.

**Shared pay block (the copy in RS3..RS7 / TS pages)**: `STRIPE` now = US/CA/MX (card gateway), new `NO_QR` = US/CA
(QR row, owner set-up link, the US "own method" flow), `TEXT_ROUTE` = US/CA (no longer `= STRIPE`).
- Visible Mexico change (owner phone pay screen: Exacto + "+ Tarjeta · Configurar" + "Configurar QR · No, gracias";
  Payment methods: QR row AND Tarjeta row; receipt still WhatsApp): `restaurante/RS3, RS6, RS7`, `tienda/TS3, TS6, TS7, TS21, T8`.
- `restaurante/RS4`, `tienda/TS4` (Cobrar con QR): the US "own method" flow is now chosen by `NO_QR` (not by the card
  gateway), so Mexico keeps the QR flow; its pay screen is Exacto · QR · "+ Tarjeta · Configurar" (Stripe not connected yet).
  `if(STRIPE) renderUS`, beats, steps, endText -> `NO_QR`; QR-flow pay `card:STRIPE?"setup":"none"` (CO/BR/PE.. still "none").
- Block edited, no visible change (they carry the copy but never draw the pay screen / payment methods): `tienda/TS1, TS2,
  TS8, T6, T7, T9, T10, T12`.

**Own pay blocks**
- `tienda/T1, T2, T3, T4, T5, T11`: same split (`STRIPE` incl. MX, `NO_QR`, `TEXT_ROUTE`): Mexico pay screen = Exacto +
  "+ Tarjeta · Configurar" + "Configurar QR"; Sale complete keeps WhatsApp.
- `restaurante/R5`: the set-up link now keys on `NO_QR`, so Mexico shows the card set-up button AND "Configurar QR".

**Other readers**
- `restaurante/RS1`, `tienda/TS1`, `tienda/T12`: pay line "Efectivo, QR y tarjeta · Gratis, para siempre." for MX (beats unchanged;
  `T12-MX.json` still 1:1).
- `restaurante/RS11`, `tienda/TS11`: card sales appear in Mexico through the kit (restaurant: with its 18 % tip, so a "Propinas"
  line); Net sales note = "Antes de impuestos, propinas y cargos" for MX.
- `restaurante/RS12`, `tienda/TS12`: same note; Mexico keeps NO card sales in this demo (`HAS_CARD` false for MX) because a card
  sale makes the accountant sheet print a card-fee line (`accountant_card_fees_none_note` / the fee row) and the Mexico brief
  forbids showing a fee. The figures are the old Mexico figures.
- `restaurante/RS20`, `tienda/TS20`: the "Tarjeta en línea" row stays hidden for MX (`forOnlineStore`), so Mexico looks as before.
- `restaurante/RS21`: comment only ("US/CA/MX Stripe"); its Mexico card "Sin conexión" button comes from the kit, like the US.

## Left as they are (and why)
- "Cobrar con enlace" under the pay row: not added anywhere. No page in this sweep draws a CONNECTED card (every Mexico pay
  screen shows the card as "+ Tarjeta · Configurar", or offline in RS21), and `PayByLinkOffer.decide` (`sync/PayByLinkOffer.kt:29-36`)
  answers NONE without a connected account or offline. The US copies do not draw it either (built before LINK-3); not changed.
- `restaurante/R4, R9, R10`: waiter phone / tablet / printer pay rows show only "Exacto" in every country (US too); not split.
- `RS8/TS8`, `R9`, `R10`, `RS21`/`TS21` done screens: receipt route is already US/CA only; Mexico already WhatsApp.
- Receipt date: pages write month-first for US only; the app also does it for CA (`ReceiptFormatter.kt:186-187`). Canada must
  not change in this sweep, so the CA date is left as is. Mexico (dd/MM) is right.
- "Free" (Entitlement US/CA) pages RS19..RS24, TS19..TS24, R6, tax pages RS17/TS17, panel "Hoy" row: already right for Mexico.
- `tienda/TS13` (abono): the app never offers Card when settling a tab (`ui/screens/customers/FiadoMoneyScreens.kt:157`); unchanged.
- `kit/pos.js` reads `pay.card`, but no page loads it.

## Checks
(results below)
