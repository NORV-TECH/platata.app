# Brief for the MEXICO card helpers (23 Oct 2026)

You build or change marketing demo pages + voice scripts for Platata (an Android POS) so Mexico shows the card
the way the app does it now. Nobody answers questions: when unsure, take the honest option and write it in your notes.

## Paths
- App (READ ONLY, never edit, no git that changes anything): `/home/user/suma-plus-android` (branch sim/usa-canada,
  commit d30ffa1). Strings `app/src/main/res/values` (en), `values-es`, `values-pt-rBR`; code `app/src/main/java/com/example/...`;
  `CLAUDE.md` is the rules map (grep "STRIPE-MX-1", "LINK-1", "LINK-2", "LINK-3", "LINKFIX-1", "QR-2").
- Website: `/home/user/platata.app/demo-studio` (pages `demos/restaurante/RS<n>.html`, `demos/tienda/TS<n>.html`,
  scripts `features/<ID>.json`, kits `kit/restaurant-data.js` + `kit/rkit.js`, `kit/shop-data.js` + `kit/skit.js`, `kit/engine.js`).
- Read first: `handoff/research/retail/_BUILD-BRIEF.md` (machinery, page rules, voice rules, checker) and
  `handoff/research/services/_HELPER-BRIEF.md` (same rules, newer). Everything there applies.
- Your notes: `handoff/research/mexico/build-notes/<ID>.md`.

## What the app does in Mexico (verified at d30ffa1; re-check what you draw)
- Card gateway: `sync/CardCountryGate.kt` US, CA **and MX** -> STRIPE (Tap to Pay on the phone), CO -> WOMPI (typed form), all others none.
- QR is a SEPARATE decision: `sync/QrCountries.kt` NO_QR = US, CA only. **Mexico keeps its QR.** Never use "Stripe country"
  to mean "no QR" (that was the app's own bug, fixed by STRIPE-MX-1).
- Receipt route: `sync/ReceiptSendRoute.kt` TEXT_COUNTRIES = US, CA. **Mexico sends the receipt by WhatsApp.**
- Receipt date: MM/dd/yyyy only in US and CA; Mexico dd/MM/yyyy.
- Tips: same as the US, per business type (`StripeTip.PERCENTS` 15/18/20; `tipDefaultOn` restaurant TRUE, shop/pharmacy FALSE,
  services TRUE). Tip off = the Card tap starts the charge itself (no tip screen).
- **No Platata fee in Mexico. Never mention a fee, a commission or a percentage** (not on screen, not in the voice).
  The link notice has its own line `link_notice_cost` ("Cobrar así cuesta un poco más que acercar la tarjeta...") — it is
  the app's text; you may draw it, but the voice never talks about cost.
- Mexico is NOT a free-connections country (`Entitlement.FREE_COUNTRIES` = US, CA). Not relevant to cards; don't say "free".
- Pay screen (`ui/screens/home/CheckoutSheetBody.kt`, `CheckoutPayBlock.kt`, `sync/PayWaysVisibility.kt`, `sync/PayByLinkOffer.kt`):
  Cash, QR (switch on + photo saved), Card. One small link slot under the pay row: the owner's set-up link
  ("Configurar QR" when QR is not set up) WINS the slot; otherwise, on a phone that CAN tap, the slot shows
  "Cobrar con enlace" (`pay_card_link_under`, LINK-3 UNDER_TAP). On a phone that CANNOT tap (no NFC, Android below 13,
  developer options on) the Card button itself reads "Tarjeta" + "Por enlace · QR o WhatsApp" (`card_link_btn`,
  `pay_card_link_hint`) and the amber bar `pay_card_link_bar` sits above (INSTEAD_OF_TAP).
  Demo shops have their QR set up, so in Mexico the slot shows "Cobrar con enlace" on a tap phone.
- The tap charge (`ui/screens/home/StripePaymentSheet.kt`): tip screen (if asked) -> "Preparando el cobro…" -> "Acerca la tarjeta"
  -> "Procesando…" -> the sale is saved -> Sale complete (`ReceiptOptionsScreen.kt`). Failed = "Cobro no completado" with
  "Intentar de nuevo", "Cobrar con enlace" (only where the link is offered) and "Cobrar de otra forma".
- "Cobrar con enlace" (`ui/screens/home/PosLinkScreen.kt`, `sync/PosLinkScreenRules.kt`): notice page (only on a phone that cannot
  tap, or after a failed tap: title `link_notice_title`, the RED box `link_notice_headline` + reason + `link_notice_not_platata`,
  "Así se cobra..." + 3 numbered steps, `link_notice_cost`, buttons Continuar / Cobrar de otra forma) -> the SAME tip page as the tap
  (only when tips are asked) -> the QR page (`link_title` "Cobrar con enlace": big total, "Incluye propina $X" when a tip,
  black-on-white QR, `link_scan_help`, spinner + "Esperando el pago…", green "Enviar por WhatsApp", "Revisar el pago", red outlined
  Cancelar) -> when the customer pays on his own phone the sale closes by itself ("Pago recibido. Guardando la venta…") -> Sale complete.
  A link sale's receipt line is `receipt_card_by_link` "Tarjeta (enlace) %1$s" (no "1 cuota").
- Money: MXN, "$1,234.50" style (CurrencyUtils; the kits already format it).

## Hard rules
No French. Light theme only. No Visa/Mastercard logos (a card brand WORD in a receipt line is the app's text and is fine in small
print, never a logo). No real brands in products. No fake AI humans. Never draw Stripe's own payment page (it is Stripe's UI, not the
app): the customer's side is a honest "hop" card (RKIT.hop / SKIT.hop) or nothing. The voice only explains the feature. Spanish = tú,
neutral Mexican Spanish ("celular", "tarjeta", "propina"; avoid Colombianisms like "datáfono"). Script ≤ ~550 characters, steps == beats,
last line "Así … con Platata.". No US/Canada videos (US is on hold): keep the pages working for US/CA but do not change their look.

## Write ONLY your own files
Listed in your task. Never kit/, tools/, index.html, other pages, the app repo. No git commands that change anything.

## Check (required)
`cd /home/user/platata.app && python3 demo-studio/tools/check_demo.py <folder>/<ID> MX:es CO:es BR:pt US:en` until every run prints OK,
then LOOK at the MX screenshots (Read tool on `demo-studio/_check/<folder>-<ID>-MX-es/*.png`) and fix cut text, wrong money, rings on
the wrong thing. Count beats == steps in the -MX script for `?country=MX`.
Playwright here must be 1.56.0 (`pip install playwright==1.56.0` if the checker complains about the browser).

## Reply
ONLY: files written, checker result lines, and problems found in the app (one line each, file:line). Under 300 words.
