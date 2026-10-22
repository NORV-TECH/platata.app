# VS3 — Cobrar en efectivo (services, owner phone)

## 1. Built
- Peluquería Carolina, "Tu teléfono", 12:41 (register open since 8:05). Tap "Corte de caballero / hombre" → option sheet → "Agregar a la venta · $X" →
  "Cobrar $X" → pay screen (Total, Artículos (1), Otro método de pago (1)=Cortesía, keypad) → type the note → Recibido / green Cambio → Efectivo →
  "¡Venta completada!" CAMBIO hero → "Nueva venta · Sin recibo". 7 beats, 6 taps (CO: $ 25.000 paid with $ 50.000).
- Differs by country: money and keypad key; cash rounding line in CL/PE/CA (none at these prices); pay row by PayWaysVisibility: CO "Configurar QR o tarjeta",
  BR "Configurar Pix", PE/CL/EC/AR/PA "Configurar QR"; MX/US/CA Stripe card connected → Card is the big button, "Exacto" short, MX also "Configurar QR";
  US/CA receipts by text/email. No -MX script: the Spanish words are the same (MX video can use VS3.json with ?country=MX).
- App checked at 73c65f08. ?biz= works for the other three trades.

## 2. Left out
- "¿Dónde se hace?" chips: the demo salon works only in the shop (factory), so the gate is not drawn (CheckoutSheetBody.kt:302-311).
- Card / QR payments (other features). No Save / Fiar for services (ServicesRules.hasSaveTicketButton = false, fiadoEnabled = false).

## 3. New UX/UI problems
- small: the pay screen still says "Artículos (1) ›" / "Itens (1)" for a haircut (CheckoutPayBlock.kt:238 checkout_items_link); item 42 fixed only the
  strip above Cobrar. Fix: a services plural like home_current_sale_services.
- small (likely): tile prices cut on a 412 dp phone (see VS2 notes, ProductCard.kt:307-330).

## 4. The 52 items
- 1 option-sheet CTA: FIXED. 46 "Elige uno" $0 / cart icon: FIXED (VariationSelectionSheet.kt:100-118). ROUND3 #20 "Tienda Local" seller: FIXED
  (CheckoutActions.kt:286-291 saves the owner's name). 2 Agenda › Cobrar with the register closed: FIXED (SavedTicketActions.kt:678 REGISTER_CLOSED,
  ReportsNavGraph.kt:141; CheckoutActions.kt:194 refuses a cash sale on a closed register).
