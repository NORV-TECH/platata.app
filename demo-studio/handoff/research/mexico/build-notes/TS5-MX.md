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
- Video-only `wait` timed against TS5-MX.json at 0.067 s per character: Cobrar +2.4 s (on "Cobrar"), Tarjeta +0.8 s (right after
  "Toca Tarjeta", no wait: the new line 2 starts with it), card +2.0 s (after "acerca su tarjeta"); "Procesando…" now 2.8 s so Sale
  complete arrives as line 3 ends.
- REVIEW-MX1 applied: TS5 nice 1 (I used `wait:1.6`, not 1.2, so the tap lands on "Cobrar") and nice 2 (line 2: "aquí no se pide propina",
  true for the shop and the pharmacy default). Nice 3 needed nothing.
- Other countries: video playback compared with the old page (DOM every 0.1 s) for CO, BR, US en/es, CA, PE and pharmacy CO/US: identical.

## Screens (MX), with the app code
1. Scan register with two scanned products, "Cobrar $66.00": `ui/screens/home/ScanCheckoutTab.kt` (unchanged page piece).
2. Pay screen: Exacto 1.2 : QR 1 : Tarjeta 2 (`CheckoutPayBlock.kt:330/367/431`, `cardIsPrimary` `CheckoutSheetBody.kt:260`),
   "Cobrar con enlace" under it (`CheckoutSheetBody.kt:494-506`), Fiar button below the client field (shop, unchanged).
3. Tips off for shops/pharmacies (`data/business/RetailRules.kt:32`): the Card tap sets a zero tip and starts the charge itself
   (`CheckoutSheetBody.kt:636-643`): "Preparando el cobro…" `StripePaymentSheet.kt:350` -> "Acerca la tarjeta" `:367` -> "Procesando…" `:400`.
4. Sale complete: `ReceiptOptionsScreen.kt:213/569`, WhatsApp route `:81`.

## Left out
- The link flow (separate video), the failure screen, Payment methods. No fee anywhere.
- Voice says "aquí no se pide propina": that is the shop/pharmacy default; the owner can turn "Pedir propina" on.

## App problems found
- `utils/TerminalReaderManager.kt:445`: Tap to Pay sales carry no brand/last four, so no "VISA ••4242" on Sale complete or the receipt. Small.
- `sync/TapToPayMode.kt:25` `REAL_TAP_TO_PAY = false`: still the simulated reader.
- `CheckoutSheetBody.kt:231` + `CheckoutPayBlock.kt:451`: reader not ready yet -> Card shows "+ Tarjeta · Configurar" though the tap charges. Small.

## Round 3 (37db6d6c)

App re-read at sim/usa-canada 37db6d6c. Page `demos/tienda/TS5.html` (also `&type=pharmacy`); script `features/TS5-MX.json` UNCHANGED
(byte-identical, 5 steps = 5 beats, 304 chars).

### What changed in the page (Mexico only)
- Sale complete shows the card line **"visa ••4242"** (`TTP_LINE`): same evidence as RS5-MX round 3 (`utils/TerminalReaderManager.kt:600`,
  `:646-651` readCardIdentity -> `ui/pos/StripePaymentActions.kt:104-106`; printed by `ReceiptFormatter.cardTenderLine`,
  `ReceiptOptionsScreen.kt:215`, `:569-587`; the raw lower-case Stripe brand, not upper-cased on this path, unlike `sync/PosLinkRules.kt:149-150`).
  Set `TTP_LINE = LINE` if the coder upper-cases it.
- Pay screen: no visible change; `payScreen` follows the two-row rule (`CheckoutSheetBody.kt:492-517`, `CheckoutPayBlock.kt:470-475`); QR is
  set up, so only "Cobrar con enlace" shows. `cardIsPrimary = stripeOn && stripeChargeable` (`CheckoutSheetBody.kt:265`). Tips off for
  shops/pharmacies: the Card tap still sets a zero tip and starts the charge (`CheckoutSheetBody.kt:645-656`).
- Scan register (`ScanCheckoutTab.kt`, no diff since d30ffa1), Fiar button: unchanged. STR: no used string changed.

### Checks
- Byte-for-byte: CO:es BR:pt US:en US:es CA:en CA:es PE:es and pharmacy CO:es / US:en: SAME. MX (shop and pharmacy) differ only from
  Sale complete on (t = 16.2 s).
- `check_demo.py tienda/TS5 MX:es CO:es BR:pt US:en`: 4 x OK; screenshots looked at.
- `timing_frames.py TS5-MX es:MX`: taps +2.4 / +0.9 / +2.1 s as in round 2; each line over its screen; no wait change.
- `cut_price_scan.py`: services videos only, not applicable (no tiles on this register).

### Round-2 / Mexico items seen
- Item 7 (both links, card line on a Tap to Pay sale): FIXED (card line lower-case, see RS5-MX round 3). Mexico card 2: FIXED.

### New app problems
- small (visible in this video): "visa ••4242" lower-case on a Tap to Pay sale, `utils/TerminalReaderManager.kt:646-651` (fix in RS5-MX round 3).
