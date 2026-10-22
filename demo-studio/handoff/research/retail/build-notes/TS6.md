# TS6 — Otras formas de pago (shop, owner phone)

## Built
- Owner phone: Métodos de pago (Efectivo, Pago QR, Fiado without a switch + its note, Tarjeta CO only, Cortesía) → "+ Nuevo" → the
  country's own method (Nequi CO, Yape PE, Mercado Pago AR/MX, Transferencia CL/EC/PA/BR, Zelle US, Interac e-Transfer CA) → register with
  two scanned products → "Cobrar" → "Agrega un cliente a la venta" → client picker (Seleccionar cliente) → Ana: the button reads "Fiar a Ana"
  → "Otro método de pago (2)" → the method → PAY-1 confirm "Sí, cobrar" → Sale complete. 8 taps.
- Voice: TS6.json (es CO/Nequi, pt BR/Transferência, en US/Zelle) + TS6-PE/AR/MX/CL/EC/PA/US.json. Checked at 6736ddfb.

## Left out / will change
- The fiado sale itself: "Fiar a Ana" is shown live but NOT tapped. At 6736ddfb it saves the sale and leaves the screen on the pay step
  with an empty $0 sale (R1). When R1 lands, add one step: tap "Fiar a Ana" → "Fiaste $X a Ana / AHORA TE DEBE $Y" (and the voice line 4
  can then say it is a tab sale).
- Tablet / staff phone fiado not shown (brief: never show fiado there).

## New UX/UI problems
- None new (dim Fiar hint and staff canFiar are already sent).
