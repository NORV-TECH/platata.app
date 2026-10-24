# RS5-MX: Cobrar con tarjeta, Mexico (restaurant)

App checked: `/home/user/suma-plus-android` at d30ffa1 (sim/usa-canada). Page: `demos/restaurante/RS5.html?country=MX&lang=es`.
Script: `features/RS5-MX.json` (6 steps = 6 beats for `?country=MX`). Device: owner phone only ("Tu teléfono").

## What changed in the page
- The old `STRIPE = US||CA` meant three things. It is now split: `STRIPE` = card gateway US/CA/MX (`sync/CardCountryGate.kt:34`),
  `NO_QR` = US/CA (`sync/QrCountries.kt:10`), `TEXT_ROUTE` = US/CA (`sync/ReceiptSendRoute.kt:23`), receipt date month-first
  only US/CA (`utils/ReceiptFormatter.kt:186`). `MX` picks the Mexico steps/beats; US/CA keep their old steps, beats and look.
- The set-up link under the pay row now keys on `NO_QR` (`sync/PayWaysVisibility.kt:64`), not on "Stripe country".
- New link slot "Cobrar con enlace" (LINK-3 UNDER_TAP): drawn only in Mexico, never tapped, no "No, gracias".
- Sale complete: a card hero can have no card line (Mexico shows none, see problems).
- STR: added `pay_card_link_under` (en/es/pt); refreshed en `qr_payment_default_message` to the app's current text (not drawn here).
- Video-only `wait` on every Mexico tap, timed against RS5-MX.json at 0.067 s per character (no clips yet): Cobrar +1.7 s (on
  "Cobrar"), Tarjeta +3.7 s (on "Tarjeta"), 18 % +3.2 s (after "elige la propina"; "Preparando el cobro…" under "y el cobro empieza"),
  card +2.0 s (after "acerca su tarjeta"); "Procesando…" now lasts 2.8 s, so Sale complete arrives as line 4 ends.
- REVIEW-MX1 applied: RS5 nice 1-4. Nice 1 asked for `wait:0.6`; I used 0.9 so the tap lands on the word "Cobrar", not on "toca".
  Lines 3 and 5 of the script use the review's wording (line 5 no longer says "con la propina incluida": Sale complete shows no amount).
- Other countries: video playback compared with the old page (DOM every 0.1 s) for CO, BR, US en/es, CA, PE: identical.

## Screens (MX), with the app code
1. Pay screen: `ui/screens/home/CheckoutSheetBody.kt:240-260` (payWays, `cardIsPrimary = stripeOn && cardConfigured`),
   `CheckoutPayBlock.kt:330` (Exacto weight 1.2), `:367` (QR, shop QR saved and on), `:431` (Tarjeta weight 2),
   link slot `CheckoutSheetBody.kt:494-506` + `CheckoutPayBlock.kt:457-490`, rule `sync/PayByLinkOffer.kt` (UNDER_TAP, tap phone).
2. Card tap with tips on (restaurant default, `data/business/RestaurantRules.kt:32`): `CheckoutSheetBody.kt:632-644` -> tip screen
   `StripePaymentSheet.kt:262` (15/18/20 from `sync/StripeTip.kt:23`, amounts `presetTip` :29).
3. "Preparando el cobro…" `StripePaymentSheet.kt:350` -> "Acerca la tarjeta" `:367` -> "Procesando…" `:400` (total includes the tip, `:193`).
4. Sale complete: `ReceiptOptionsScreen.kt:213` (card hero) + `:569` CardApprovedLines ("Pago aprobado"), route WhatsApp `:81` / `:351`.

## Left out
- The link flow itself (notice / QR page): a separate video covers it; the link is only drawn.
- The failure screen ("Cobro no completado"). No fee anywhere (none in Mexico).

## App problems found
- `utils/TerminalReaderManager.kt:445`: the Tap to Pay `StripeChargeContext` is built without brand/last four and never filled, so
  `ReceiptFormatter.cardTenderLine` returns null: Sale complete and the receipt show no "VISA ••4242" for a Tap to Pay sale (US/CA/MX).
  Small. (The US/CA pages still draw "VISA ••4242"; not changed because US is on hold.)
- `sync/TapToPayMode.kt:25` `REAL_TAP_TO_PAY = false`: the build still uses Stripe's simulated reader; no real card in Mexico until it flips.
- `CheckoutSheetBody.kt:231` + `CheckoutPayBlock.kt:451`: connected Stripe account but reader not ready yet -> Card draws as
  "+ Tarjeta · Configurar" while the tap goes to the charge (contradicts `PayWaysVisibility.kt:13-14`). Small, not proven on a device.
- Page-only (not the app): the US/CA pages lack the "Charge by link" slot the app now draws there; left as is (US on hold).

## Round 3 (37db6d6c)

App re-read at sim/usa-canada 37db6d6c (diff since d30ffa1: `d4967d3a` México 1/2/3, `a5356517` Arreglo 15 F8, `328cd4c3` LINKCOST-1).
Page `demos/restaurante/RS5.html`; script `features/RS5-MX.json` UNCHANGED (byte-identical, 6 steps = 6 beats, 346 chars).

### What changed in the page (Mexico only)
- Sale complete now shows the card line: R2-1 item 7 reads brand + last four off the reader's PaymentIntent
  (`utils/TerminalReaderManager.kt:600` + `:646-651` readCardIdentity -> `ui/pos/StripePaymentActions.kt:104-106`), printed by
  `ReceiptFormatter.cardTenderLine` (`ReceiptOptionsScreen.kt:215`, `:569-587`). The Tap to Pay path does NOT upper-case the brand
  (the link path does, `sync/PosLinkRules.kt:149-150 brandForReceipt`) and Stripe's `card_present.brand` is the lower-case API word
  (the app's own notes: `StripePaymentActions.kt:41` "visa", `utils/StripeGatewayAdapter.kt:51` "visa"), so the page draws
  **"visa ••4242"** (`TTP_LINE`). Honest choice, not proven on a device; if the coder upper-cases it, set `TTP_LINE = LINE` (one line).
- Pay screen: no visible change. The shared `payScreen` now follows the app's two-row rule (set-up link row, then the
  "Cobrar con enlace" row, `CheckoutSheetBody.kt:492-517` setupLink2, `CheckoutPayBlock.kt:470-475`, `SetupLinkRow :496`). In this demo
  QR is set up, so only the "Cobrar con enlace" row shows, exactly as before. Card is still primary: `cardIsPrimary = stripeOn &&
  stripeChargeable` (`CheckoutSheetBody.kt:265`), Exacto 1.2 : QR 1 : Tarjeta 2 (`CheckoutPayBlock.kt:341/378/424`).
- Header comments: new file:line references. STR: no string used here changed (checked all three languages).

### Checks
- Other countries byte-for-byte: video timeline DOM every 0.2 s + demo first screen for CO:es BR:pt US:en US:es CA:en CA:es PE:es,
  before vs after: SAME. MX:es / MX:en differ only from the Sale complete screen on (t = 21.6 s).
- `check_demo.py restaurante/RS5 MX:es CO:es BR:pt US:en`: 4 x OK. Screenshots looked at (pay screen, Sale complete).
- `timing_frames.py RS5-MX es:MX` (real clips): taps at +1.7 / +3.7 / +3.2 / +2.1 s as in round 2; each line over its screen; line 5 over
  Sale complete with "Pago aprobado · visa ••4242". No wait change needed.
- `cut_price_scan.py` reads services videos only (`demos/servicios`, `video/V*.mp4`): not applicable. Dish tiles checked by eye: whole.

### Round-2 / Mexico items seen at 37db6d6c
- Item 7 (both links): FIXED, two rows, set-up first (`CheckoutSheetBody.kt:492-517`). Item 7b (card line on a Tap to Pay sale): FIXED,
  but lower-case brand (new bug below). Mexico card 2 (linked account = plain Card): FIXED (`CheckoutSheetBody.kt:235`, `:265`).

### New app problems
- small (visible in this video): Tap to Pay prints "visa ••4242" while a link sale prints "VISA ••4242". `utils/TerminalReaderManager.kt:646-651`
  returns the raw `cardPresentDetails.brand`. Fix: return `PosLinkResult.brandForReceipt(details.brand)` there (as `sync/PosLinkRules.kt:160`).
- doc drift only: `ui/pos/StripePaymentActions.kt:41` still says "null in v1; see notes"; `:107` says "US/Canada card-present" (Mexico too).
- Still open (US on hold, page not changed): the US/CA paths draw "VISA ••4242" and no "Cobrar con enlace" row; the app now draws "visa" and the row.
