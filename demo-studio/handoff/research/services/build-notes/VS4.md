# VS4 — Cobrar con QR (services, owner phone)

## 1. Built
- Owner phone ("Tu teléfono"), Peluquería Carolina (`?biz=` works for the other three). Métodos de pago (services: no Fiado row)
  → switch Pago QR → the responsibility page (paper look, pointing potato, the three tips with the app's drawn icons) → tick →
  "Entendido, activar pagos QR" → "Subir código QR" → the phone's picker → "Código QR guardado." → the services till
  (Servicios · 11 | Productos · 4, service tiles, "Venta actual · 1 servicio", Agendar | Cobrar $ 25.000) with Cepillado (Largo)
  → Cobrar → QR → "TOTAL A COBRAR", bank QR, red cashier note → "Pagó · Sin foto" → ¡Venta completada!. 8 taps.
- Brazil: every word is Pix (PixLabels PIX_TEXT_RES), and voice line 4 says the Pix QR already carries the sale total
  (QrPaymentOverlay.kt:182 PixBrCode.withAmount, QR-2). US/CA: no QR (QrCountries) → the shop's own method (Zelle / Interac).
- Country differences: CO pay row Exacto · QR · Tarjeta (Wompi connected); MX/US/CA Stripe not connected on this page →
  "+ Tarjeta · Configurar" (PayWaysVisibility.kt:59) and Payment methods' Card row off; no "Ver depósitos" (a connected
  Stripe account shows it even with the switch off, PaymentMethodsScreen.kt:375-380). No VS4-MX.json: Mexico's words are CO's.
- Checked at 73c65f08. Shared screens come from one source for VS4–VS7 (same pay screen, sale complete, receipt).

## 2. Left out
- "Fotografiar código QR" (camera) and "Pagó · Foto del pago": shown, not tapped.

## 3. New UX/UI problems (73c65f08)
- money (display): on a 412 dp phone the service tile cannot show a "Desde" price: 3 columns (Adaptive 120 dp, ProductLibraryView)
  leave 97 dp inside a tile, the minutes take ~44 dp, and ShrinkToFitText stops at 12 sp then cuts ("Desde…", BR "A part…",
  MX even "$45…") — ProductCard.kt:307-330, ShrinkToFitText.kt:29,43. Fix: minutes on their own line under the price.
- small: the services pay screen says "Artículos (1) ›" for a service sale (CheckoutPayBlock.kt:238 checkout_items_link for every
  type); item 42 fixed the strip ("1 servicio") but not this link. Fix: a services word ("Servicios (1)").

## 4. The 52 items checked here
- 42 (English QR note "hand over the order"): fixed — en now "before you complete the sale".
- FiadoScope: no Fiado row for services — confirmed (data/FiadoScope.kt:12).
