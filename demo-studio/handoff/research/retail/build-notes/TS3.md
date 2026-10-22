# TS3 — Cobrar en efectivo (shop, owner phone)

## Built
- Owner phone, shop register (ScanCheckoutTab: Fiado / Sin código / Teclado rows, "Agregar productos"), the camera (ScannerScreen: tap the
  preview to read; known product goes in, the same code again = "Otra más · X × 2"), "Cobrar $X" in the camera bar, the pay screen
  (CheckoutSheetBody + CheckoutPayBlock: keypad, Received / Change, Efectivo; Save slot reads "Fiar", dim with no client), Sale complete
  with the change (ReceiptOptionsScreen). 7 beats, 8 taps.
- One device: owner phone ("Tu teléfono"). Differs by country: money and cash rounding (cashDue), decimal key vs "000", QR/Pix set-up
  link (not US/CA), card "+ Tarjeta · Configurar" button only US/CA, WhatsApp vs Text/Email receipt buttons (US/CA). ?type=pharmacy sells
  pharmacy items.
- Checked at app-head 6736ddfb.

## Left out
- The stock count going down after the sale (StockStore) is real but not drawn (one sale, nothing to see on this screen).
- When R1-R7 land: nothing on these screens changes (the "Fiar" button is drawn but not tapped; R1 is TS6's).

## New UX/UI problems
- None found.
