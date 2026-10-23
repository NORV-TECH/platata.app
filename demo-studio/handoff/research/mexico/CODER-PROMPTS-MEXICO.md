# Mexico card: problems for the coder (from the Mexico demos, 23 Oct 2026)

App commit read: d30ffa1 (sim/usa-canada). Monti passes this to the coder. Each item: what is wrong, where, a one-line fix.
Items from the services list that are also about Mexico stay there (round 2 item 7: in Mexico "Configurar QR" takes the slot of
"Cobrar con enlace" on the pay screen).

## 1. MONEY DISPLAY / TEXT CUT. The Card button's "Por enlace · QR o WhatsApp" hint is cut when QR is also on (Mexico)
- Where: `ui/screens/home/CheckoutPayBlock.kt:614-650` (`HintLine` -> `FitOneLine`, steps `DesignTokens.CheckoutHintSteps` = 12/11/10 sp,
  `maxLines = 1`, `softWrap = false`, no ellipsis) inside `CardLinkButton` (`:530-546`). In Mexico QR stays (QrCountries), so three buttons
  share the row (Exact 1.3 : QR 1 : Card 1, `:330`, `:416`) and Card gets about 110 dp on a 412 dp phone (97 dp on 360 dp). The hint stops at
  10 sp and clips: "Por enlace · QR o Wha", the "P" under the rounded corner. The US and Canada have no QR, so their two-button row fits.
- Fix (one line): give `HintLine` a shorter second candidate for the link button (e.g. `pay_card_link_hint_short` "Por enlace") — `FitOneLine`
  already takes `candidates` and uses the first that fits.
- Blocks a demo: the Mexico "Cobrar con enlace" video (RS25-MX) is built on a shop WITHOUT QR (two buttons) so nothing is cut; a shop that
  has its QR on would show the cut hint.

## 2. SMALL. Stripe connected but the reader not ready yet: the Card button says "+ Tarjeta · Configurar"
- Where: `ui/screens/home/CheckoutSheetBody.kt:231` (`cardConfigured = stripeChargeable`, which needs `readerReady`) and
  `ui/screens/home/CheckoutPayBlock.kt:449-451` (`else -> CardNudge(pay_card_setup_hint, showPlus = true)`). `PayWaysVisibility.kt` says a linked
  account with no reader yet "still shows Card — the Stripe sheet pairs the reader", and the tap goes to the charge, yet the button reads like setup.
- Fix (one line): for Stripe, decide the plain Card button on `stripeConnected` (account linked), not `stripeChargeable`; keep the nudge for
  "not connected". (Read from the code only; not seen on a phone.)

## 3. TEXT CONTRADICTS. A phone with no NFC is told "ESTE TELÉFONO NO PUEDE COBRAR CON TARJETA" while the same phone charges cards by link
- Where: `ui/screens/home/HomeScreen.kt:441-443` (`cardStripText = CardDeviceCopy.stripRes(...)` when `stripeTenderAvailable`), drawn at `:588-590`
  (WarningBar.CARD_DEVICE), text `card_device_strip_phone` (values-es:1367); `sync/CardDeviceCopy.kt:68-72` (`stripRes` only for NO_NFC). The panel warning row
  says the same. In a link country (MX, US, CA) the pay screen of that phone offers the card by link (`PayByLinkOffer.INSTEAD_OF_TAP`) and LINK-3 already made the
  pay-screen bar link-aware (`LinkPayHint`), but the register strip was not.
- Fix (one line): in `stripRes`, return a link-aware text (or null) when the link is offered, e.g. pass `linkOffered` and use `pay_card_link_bar`'s wording.
- Blocks a demo the honest way only: the Mexico "Cobrar con enlace" video uses an old Android (no strip) instead of a phone with no NFC.

## 4. QUESTION (Monti / architect). "Cobrar así cuesta un poco más que acercar la tarjeta" in Mexico
- Where: `values-es` `link_notice_cost` (line 1325), shown on the link notice page in every link country. In Mexico Platata takes no fee on either path
  (STRIPE-MX-1, LINK-1), so the sentence rests only on Stripe's own Mexican rates (online Checkout vs card present). It is probably true, but nobody has
  checked it for Mexico. Confirm it, or word it per country. The demo draws the app's text as it is; the voice never talks about cost.

## Doc drift only (no behaviour)
- `CheckoutPayBlock.kt:326-327` comment says Card 2.4 / Cash 0.6; the code is 2 / 1.2. `CardDeviceCopy.kt` comments still say "US / Canada" only.

## Already on the services list (round 2), also true in Mexico
- Item 7: in Mexico "Configurar QR" takes the slot of "Cobrar con enlace"; and a Tap to Pay sale has no card line ("VISA ••4242") on Sale complete
  or the receipt: `ui/pos/StripePaymentActions.kt:41-42` (`StripeChargeContext.brand` / `lastFour` "null in v1"), filled nowhere
  (`utils/TerminalReaderManager.kt:445`). A LINK sale does carry them (`sync/PosLinkRules.kt:160-161`).

## For the architect (not a coder bug, a release fact)
- `sync/TapToPayMode.kt:25` `REAL_TAP_TO_PAY = false`: the build still selects Stripe's simulated reader in every Stripe country. The Mexico tap
  videos show the flow the app is built for; a real card can be taken only once that flag (and the TapToPayProfile) ships.
