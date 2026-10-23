# TS5-MX: Cobrar con tarjeta, Mexico (shop; `&type=pharmacy` uses the same page)

App checked: `/home/user/suma-plus-android` at d30ffa1 (sim/usa-canada). Page: `demos/tienda/TS5.html?country=MX&lang=es`.
Script: `features/TS5-MX.json` (5 steps = 5 beats for `?country=MX`). Device: owner phone only ("Tu teléfono").

## What changed in the page
- Same split as RS5: `STRIPE` = card gateway US/CA/MX (`sync/CardCountryGate.kt:34`), `NO_QR` = US/CA (`sync/QrCountries.kt:10`),
  `TEXT_ROUTE` = US/CA (`sync/ReceiptSendRoute.kt:23`), receipt date month-first only US/CA (`utils/ReceiptFormatter.kt:186`).
  `MX` picks the Mexico steps/beats; US/CA keep their old steps, beats and look.
- Set-up link keys on `NO_QR` (`sync/PayWaysVisibility.kt:64`); new "Cobrar con enlace" slot (LINK-3 UNDER_TAP), Mexico only, drawn, never tapped.
- Sale complete: Mexico shows "Pago aprobado" with no card line (see problems).
- STR: added `pay_card_link_under`; refreshed en `qr_payment_default_message` and pt `scan_row_reports_today_net` to the app's
  current text (neither is drawn by this page).
- Video-only `wait` on the Tarjeta and card taps.

## Screens (MX), with the app code
1. Scan register with two scanned products, "Cobrar $66.00": `ui/screens/home/ScanCheckoutTab.kt` (unchanged page piece).
2. Pay screen: Exacto 1.2 : QR 1 : Tarjeta 2 (`CheckoutPayBlock.kt:330/367/431`, `cardIsPrimary` `CheckoutSheetBody.kt:260`),
   "Cobrar con enlace" under it (`CheckoutSheetBody.kt:494-506`), Fiar button below the client field (shop, unchanged).
3. Tips off for shops/pharmacies (`data/business/RetailRules.kt:32`): the Card tap sets a zero tip and starts the charge itself
   (`CheckoutSheetBody.kt:636-643`): "Preparando el cobro…" `StripePaymentSheet.kt:350` -> "Acerca la tarjeta" `:367` -> "Procesando…" `:400`.
4. Sale complete: `ReceiptOptionsScreen.kt:213/569`, WhatsApp route `:81`.

## Left out
- The link flow (separate video), the failure screen, Payment methods. No fee anywhere.
- Voice says "en una tienda no se pide propina": that is the shop default; the owner can turn "Pedir propina" on.

## App problems found
- `utils/TerminalReaderManager.kt:445`: Tap to Pay sales carry no brand/last four, so no "VISA ••4242" on Sale complete or the receipt. Small.
- `sync/TapToPayMode.kt:25` `REAL_TAP_TO_PAY = false`: still the simulated reader.
- `CheckoutSheetBody.kt:231` + `CheckoutPayBlock.kt:451`: reader not ready yet -> Card shows "+ Tarjeta · Configurar" though the tap charges. Small.
