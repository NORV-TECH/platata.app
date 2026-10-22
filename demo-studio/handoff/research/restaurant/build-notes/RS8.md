# RS8 "Devolver una venta" — build notes

## 1. Built
- Owner phone: Ventas tab (day header "Hoy · net · 4 ventas", rows with time, first dish "y 2 más", method · who · #id, Pagada), sale "Venta #27" (WhatsApp / Compartir, Empleado, the receipt card text from `generatePastPlainTextReceipt`, red outlined Devolver, void link), "Devolver" (Pagado · Queda por devolver, Artículos tab, one dish ticked, "Entrega $X en efectivo", red "Devolver $X"), confirm "Sí, devolver", the refund PIN pad (with the new "Está en Configuración › Seguridad" line), then the sale with the green "Devuelto $X" banner, "Devolución parcial" and the receipt's Devuelto / Neto tras devolución lines.
- Device: owner phone. Differs by country: money, US/CA show "Mensaje" instead of WhatsApp (`ReceiptSendRoute`).
- Checked at app-head 6736ddfb (refund_pin_where line added; confirm title en "Confirm refund").

## 2. Left out / assumptions
- Dishes are not stock-tracked (else the confirm adds `tx_refund_stock_partial`).
- No printer (so no Imprimir button), cash sale paid exact (no change line on the receipt).

## 3. New UX/UI problems
- small (every customer receipt) — A new shop's receipt ends with the English "Thank you for shopping with us!" in every language: `data/ReceiptConfig.kt:24` default, copied as-is by `data/repo/SeedStore.kt:75` and `:245`; nothing localizes it. Shown as-is in this demo. Fix: seed `customFooterMessage` from a string in the shop's language (`ShopLanguageText`, e.g. "¡Gracias por tu compra!").
- small — One sale, three names: the title says "Venta #27", the list "#27", the receipt "Venta n.º: 27" (`receipt_label_order_number`, `utils/ReceiptFormatter.kt:328`). Fix: print "Venta #27" on the receipt too.
