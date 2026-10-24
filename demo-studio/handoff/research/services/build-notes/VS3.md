# VS3 — Cobrar en efectivo (services, owner phone)

## 1. Built
- Peluquería Carolina, "Tu teléfono", 12:41 (register open since 8:05). Tap "Corte de caballero / hombre" → option sheet → "Agregar a la venta · $X" →
  "Cobrar $X" → pay screen (Total, Artículos (1), Otro método de pago (1)=Cortesía, keypad) → type the note → Recibido / green Cambio → Efectivo →
  "¡Venta completada!" CAMBIO hero → "Nueva venta · Sin recibo". 7 beats, 6 taps (CO: $ 25.000 paid with $ 50.000).
- Differs by country: money and keypad key; cash rounding line in CL/PE/CA (none at these prices); pay row by PayWaysVisibility, following the day: where
  this morning has QR sales (CO, BR, PA) the QR / Pix button is drawn (Exacto 2 : QR 1) and CO's link is "Configurar tarjeta", BR none; PE/CL/EC/AR
  "Configurar QR"; MX/US/CA Stripe card connected → Card is the big button, "Exacto" short, MX "Configurar QR", US/CA "Cobrar con enlace" under it;
  "Otro método de pago (2)" where this morning has transfers (CL, AR, PA, US); US/CA receipts by text/email.
- Review fixes (REVIEW-REGISTER): QR/Pix button + links, the others count, a video wait before Efectivo. No -MX script: the Spanish words are the same (MX video can use VS3.json with ?country=MX).
- App checked at 73c65f08. ?biz= works for the other three trades.

## 2. Left out
- Kit: CO's 6-week history has card (Wompi) sales but today's do not; the page follows today (no Wompi key → no Card button).
- "¿Dónde se hace?" chips: the demo salon works only in the shop (factory), so the gate is not drawn (CheckoutSheetBody.kt:302-311).
- Card / QR payments (other features). No Save / Fiar for services (ServicesRules.hasSaveTicketButton = false, fiadoEnabled = false).

## 3. New UX/UI problems
- small (Mexico, from the review, verified): the owner's setup link takes the only link slot, so a Mexican owner with Stripe connected and no QR never
  sees "Cobrar con enlace" until "No, gracias" (CheckoutSheetBody.kt:487-505, setup link `?:` the LINK-3 link). Fix: draw both, setup link first.
- small: the pay screen still says "Artículos (1) ›" / "Itens (1)" for a haircut (CheckoutPayBlock.kt:238 checkout_items_link); item 42 fixed only the
  strip above Cobrar. Fix: a services plural like home_current_sale_services.
- small (likely): tile prices cut on a 412 dp phone (see VS2 notes, ProductCard.kt:307-330).

## 4. The 52 items
- 1 option-sheet CTA: FIXED. 46 "Elige uno" $0 / cart icon: FIXED (VariationSelectionSheet.kt:100-118). ROUND3 #20 "Tienda Local" seller: FIXED
  (CheckoutActions.kt:286-291 saves the owner's name). 2 Agenda › Cobrar with the register closed: FIXED (SavedTicketActions.kt:678 REGISTER_CLOSED,
  ReportsNavGraph.kt:141; CheckoutActions.kt:194 refuses a cash sale on a closed register).

## Round 3 (37db6d6c)
What changed on the page (shared block with VS2):
- Service tiles whole (ProductCard.kt:303), option sheet without a repeated header (OptionSelectionSheet.kt:449-451), "Todos" grid A-Z
  (PosDao.kt:334), scroll to the tapped tile in the US run.
- Pay screen: the link reads "Servicios (1) ›" (CheckoutPayBlock.kt:248). The set-up link and "Cobrar con enlace" can both show, each on its own row,
  set-up first (CheckoutSheetBody.kt:492-512, :1042): Mexico with Stripe connected now shows "Cobrar con enlace" under the card button.
- Timing: the option add tap waits 1.0 s (was 2.2) so it lands inside its line.
Script: unchanged. Checker OK CO/BR/MX (+US). Timing (real clips) OK after the wait fix (tap +1.9 s into the line).
New app bugs: none new on these screens.
Round-2 items: 7 (Mexico: setup link hid "Cobrar con enlace") FIXED; 8/14 ("Artículos (1)" for a haircut) FIXED; cut tile prices FIXED.
