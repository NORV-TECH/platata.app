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
