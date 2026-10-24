# RS25-MX — Cobrar con enlace (restaurant, owner phone that cannot tap cards, Mexico)

## 1. Built
- Page `demos/restaurante/RS25.html`, script `features/RS25-MX.json` (8 steps = 8 beats for `?country=MX`, 456 chars, tú).
  Checked at sim/usa-canada d30ffa1. Device: owner phone ("Tu teléfono") only; Fonda Lupita, Pozole rojo + Agua de horchata $190.00.
- Flow (LINK-3, every screen verified): register -> Cobrar -> pay screen Exacto · Tarjeta "Por enlace · QR o WhatsApp" + amber
  `pay_card_link_bar` (CheckoutPayBlock.kt:416/519-547, CheckoutSheetBody.kt:486-517) -> Tarjeta -> notice page (red box,
  reason OLD_OS "Tiene Android 12. Se necesita Android 13 o más nuevo.",
  3 steps, `link_notice_cost` drawn small as the app does, Continuar / Cobrar de otra forma; PosLinkScreen.kt:103-184) -> the tap's tip page
  (StripeTipScreen, restaurant tip default on) 15 % · $28.50 -> "Creando el enlace…" -> QR page $218.50 "Incluye propina $28.50",
  Esperando el pago…, Enviar por WhatsApp / Revisar el pago / Cancelar -> hop card "Celular del cliente · Paga ahí con su tarjeta" (Stripe's
  page is never drawn) -> "Pago recibido. Guardando la venta…" -> ¡Venta completada! Pago aprobado VISA ••4242 (link sale: brand + last four
  from the Checkout session, no "cuota"), WhatsApp receipt route. No fee or cost in the voice.
- Demo shop has NO bank QR in every link country (coordinator, 23 Oct): with QR the row is Exacto 1.3 : QR 1 : Tarjeta 1 and the hint
  clips even at 10 sp (CheckoutPayBlock.kt:614-650 FitOneLine, DesignTokens.CheckoutHintSteps 12/11/10). A Mexican shop without bank QR
  is a normal state: QR not set up + owner tapped "No, gracias" (PayWaysVisibility.kt: showQr false, setupLinkDismissed -> NONE) ->
  CheckoutSheetBody.kt:486-505 passes no slot (no "Configurar QR"; "Cobrar con enlace" small link is UNDER_TAP only), no QR button
  (CheckoutPayBlock.kt:367), row Exacto 1 : Tarjeta 1 (:330, :416). Measured in the page at 412 dp: hint fits at 12 sp (es 150.5 dp,
  en 133.5 dp, room 174 dp), one line, nothing cut. Voice lines name QR only as the link page's code, never as a pay button.
- US / CA (en and es): same flow (no QR there anyway, QrCountries NO_QR), text + email receipt, tip 15 % ($1.20 / $2.48).
- Every other country: one honest card "Cobrar con enlace existe solo en México, Estados Unidos y Canadá." (page language), one tap, no voice.
- Checker: MX:es US:en US:es CO:es CA:en CA:es BR:pt MX:en PE:es all OK.

## 2. Left out
- WhatsApp send, "Revisar el pago", Cancel, the ended/problem pages, the UNDER_TAP small link (phone that can tap), the recovery paths.
- The receipt viewer ("Tarjeta (enlace) VISA ••4242", `receipt_card_by_link`): not opened, to keep 8 beats.

## 3. Problems found
- BLOCKS THE DEMO (MX): the Card button's hint is CUT in Mexico. With QR on, the row is Exacto 1.3 : QR 1 : Tarjeta 1
  (CheckoutPayBlock.kt:330, :416), so on a 412 dp phone the Card button is ~113 dp; HintLine/FitOneLine (:545, :630-648) shrinks only to
  10 sp and then clips (softWrap=false). "Por enlace · QR o WhatsApp" needs 125 dp at 10 sp (en 111, pt 118) vs ~97 dp of room: it shows
  "Por enlace · QR o Wha", the "P" under the 27 dp corner. RS25 avoids it by showing a shop without bank QR (two buttons fit).
  Fix: let CardLinkButton's hint take 2 lines (or a shorter hint, e.g. "Por enlace", when qrOn).
- small (brief vs code): the amber bar is drawn DIRECTLY UNDER the pay buttons (CheckoutSheetBody.kt:1158-1161), not above; the page follows the code.
- For the planner (not the app): kit/restaurant-data.js MX still says `pay:{card:null, tips:false}` and RS5 treats Mexico as a no-card
  country (`STRIPE = US || CA`); both are stale since STRIPE-MX-1. RS25 does not read them.

## 4. After REVIEW-MX1 (23 Oct)
- MUST 1, fix (B): the demo phone is an OLD Android 12 phone WITH NFC (CardDeviceGate.kt:79-84 -> OS_TOO_OLD), not a phone without NFC.
  NO_NFC would add the red "ESTE TELÉFONO NO PUEDE COBRAR CON TARJETA" strip on the register (HomeScreen.kt:441-447, 588-590);
  OS_TOO_OLD gets none (CardDeviceCopy.kt:68-72 stripRes) and the same INSTEAD_OF_TAP pay screen. The notice says
  `link_notice_reason_old_os` with "12" (PosLinkScreen.kt:118-119, LinkNoticeReason.of(OS_TOO_OLD) = OLD_OS); STR has the key (en/es/pt).
- MUST 2 / nice 3-5 applied: line 2 "…aun así cobras con tarjeta, con un enlace. Toca Tarjeta."; line 4 "El cliente elige la propina en tu
  celular."; the QR tap (beat 5) shows only the hop card; a new beat-6 step (tap on "Tu teléfono" in the hop) does settle -> Sale complete.
  8 beats = 8 steps. "Creando el enlace…" now 1.0 s.
- Re-timed at 0.067 s/char (played ?mode=video&country=MX&lang=es&dur=2.14,6.83,3.95,2.81,4.89,4.89,2.68,2.35), tap = beat start
  + 0.8 + wait, each just after its words: Cobrar +2.20 ("toca Cobrar" ends +2.08), Tarjeta +6.80 (ends +6.77; so wait 6.0, not the
  review's 4.9, which would tap while "Toca Tarjeta" is still unsaid), Continuar +3.90 (ends +3.89), 15 % +2.80 (line ends +2.81), QR +1.66
  ("escanea el QR" ends +1.61, hop up for "…paga ahí con su tarjeta"), hop pill +0.92 ("El pago llega" ends +0.87; settle, Sale complete at
  +2.32 under "se cierra sola"). Pay screen up for all of line 2, notice for line 3, tip for line 4, QR page for line 5. Silent gaps:
  0.9 s (1->2), 1.9 s (4->5, spinner then QR).

## Round 3 (37db6d6c)

App re-read at sim/usa-canada 37db6d6c. Page `demos/restaurante/RS25.html`; script `features/RS25-MX.json` UNCHANGED (byte-identical,
8 steps = 8 beats, 456 chars).

### Decision: the Mexico demo state
Round 2 used an Android 12 phone (OS_TOO_OLD) and a shop without bank QR only to dodge two app bugs. Both are fixed at 37db6d6c:
- the red "ESTE TELÉFONO NO PUEDE COBRAR CON TARJETA" strip is not drawn on a phone that charges by link (`HomeScreen.kt:441`
  `CardDeviceCopy.stripResForDevice` -> `stripRes(linkOffered = true) = null`, `sync/CardDeviceCopy.kt:72-104`; panel row `HomeScreen.kt:1543` too);
- the Card hint has a short wording when it cannot fit (`CheckoutPayBlock.kt:571-574` HintLine(text, shortText), `:646-654`, FitOneLine `:662-682`).
So Mexico now shows the common case: **a phone WITHOUT NFC** (`CardDeviceGate.kt:80` NO_NFC) in the **same Fonda Lupita that keeps its
bank QR in RS5-MX** (QR saved and on). Line 2 ("Si tu teléfono no lee tarjetas al acercarlas…") now says exactly the phone's problem.
US/CA paths keep the round-2 state byte for byte (on hold).

### What changed in the page (Mexico only)
- Pay screen: Exacto 1.3 : QR 1 : Tarjeta 1 (`CheckoutPayBlock.kt:341/378/427`; `cardIsPrimary = stripeOn && stripeChargeable` = false,
  `CheckoutSheetBody.kt:265`). Card = CardLinkButton "Tarjeta" + **"Por enlace"** (`pay_card_link_hint_short`): at 412 dp the button is ~113 dp,
  the long hint needs ~125 dp at 10 sp, the short one fits at 12 sp. No small row under the buttons (QR set up; setupLink2 is UNDER_TAP only,
  `CheckoutSheetBody.kt:504`). Amber LinkPayHint under the buttons as before (`:524-526`, `:1181`). `fitOne` now takes the candidate list.
- Notice page: reason **"Le falta el lector de tarjetas (NFC)."** (`link_notice_reason_no_nfc`, `sync/PosLinkScreenRules.kt:36`); the
  **"Cobrar así cuesta un poco más…" line is gone** (LINKCOST-1 `328cd4c3`: removed from `PosLinkScreen.kt` and from the four string files).
- STR: added `link_notice_reason_no_nfc`, `pay_card_link_hint_short` (en/es/pt from the app). `link_notice_cost` is kept ONLY because the
  US/CA paths (on hold, byte-for-byte) still draw it; noted in the page header.
- Tip page, QR page, hop, settle, Sale complete ("VISA ••4242": a link sale upper-cases its brand, `sync/PosLinkRules.kt:149-150`, 0 installments
  = no cuota): unchanged at 37db6d6c. Header comments re-cited at 37db6d6c lines.

### Checks
- Byte-for-byte: CO:es BR:pt PE:es (the honest "only in MX/US/CA" card) and US:en US:es CA:en CA:es: SAME. MX:es / MX:en differ from the pay
  screen on (t = 2.8 s).
- `check_demo.py restaurante/RS25 MX:es CO:es BR:pt US:en`: 4 x OK; pay screen and notice looked at (hint whole, no cost line).
- `timing_frames.py RS25-MX es:MX` (real clips): taps +2.2 / +6.8 / +4.0 / +2.9 / +1.7 / +0.9 s as in round 2; every line over its screen.
- `cut_price_scan.py`: services videos only, not applicable. Dish tiles whole.

### Round-2 / Mexico items seen
- CODER-PROMPTS-MEXICO 1 (cut hint): FIXED. 3 (strip on a link phone): FIXED. 4 (cost sentence): resolved, sentence removed. 2 (reader not ready
  -> "+ Tarjeta · Configurar"): FIXED (`CheckoutSheetBody.kt:235` cardConfigured = stripeConnected).

### New app problems
- None for this flow. Still open on the US/CA paths (on hold, not changed): Android 12 / no-QR state and the removed cost line.
