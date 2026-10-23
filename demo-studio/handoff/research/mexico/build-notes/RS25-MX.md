# RS25-MX — Cobrar con enlace (restaurant, owner phone that cannot tap cards, Mexico)

## 1. Built
- Page `demos/restaurante/RS25.html`, script `features/RS25-MX.json` (8 steps = 8 beats for `?country=MX`, 440 chars, tú).
  Checked at sim/usa-canada d30ffa1. Device: owner phone ("Tu teléfono") only; Fonda Lupita, Pozole rojo + Agua de horchata $190.00.
- Flow (LINK-3, every screen verified): register -> Cobrar -> pay screen Exacto · Tarjeta "Por enlace · QR o WhatsApp" + amber
  `pay_card_link_bar` (CheckoutPayBlock.kt:416/519-547, CheckoutSheetBody.kt:486-517) -> Tarjeta -> notice page (red box, reason NO_NFC,
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
