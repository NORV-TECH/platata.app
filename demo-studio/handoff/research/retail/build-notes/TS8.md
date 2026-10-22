# TS8 — Devolver una venta (shop, owner phone)

## Built
- Owner phone: shop register → Ventas (a shop's ONE list: back arrow, "Ventas", search box, "Hoy" header, rows; one fiado sale wears the
  amber "FIADO · Ana Gómez" badge) → sale #27 (receipt card, outlined red Devolver) → Devolver → "Seleccionar todos los artículos" →
  "Entrega $X en efectivo" / "Devolver $X" → confirm → PIN → "Devuelta" badge, receipt with Devuelto / Neto. 7 taps, full refund in cash.
- Same in every country (money, WhatsApp vs "Mensaje" in US/CA). Checked at 6736ddfb.

## Left out / will change
- Partial refund (stock does not move) and refunding the fiado sale: the partial fiado refund is R2; it will be shown after it lands.
- The Inventario screen with the products back on the count is not drawn (the voice says counted products go back; true only on the
  device that rang the sale, StockStore.kt:108).

## New UX/UI problems
- None new.
