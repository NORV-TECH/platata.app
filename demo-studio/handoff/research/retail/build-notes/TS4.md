# TS4 — Cobrar con QR (shop, owner phone)

## Built
- Owner phone. QR countries (CO MX PE CL EC AR PA, BR = Pix): Métodos de pago (the shop's list: Efectivo, Pago QR, Fiado with no switch
  and its note, Tarjeta in CO only, Cortesía) → Pago QR switch → the responsibility page → tick + "Entendido" → "Subir código QR" → file
  picker → "Código QR guardado." → register with two scanned products → "Cobrar $X" → QR/Pix → "Pagó · Sin foto" → Sale complete. 8 taps.
- US/CA: no QR in the app; the page shows the honest alternative (own method Zelle / Interac e-Transfer, "+ Nuevo", the PAY-1 confirm).
  Voice: TS4.json (es/pt QR flow, en US flow) + TS4-US.json (US in Spanish). Checked at 6736ddfb.

## Left out
- Nothing R1-R7 related on these screens.

## New UX/UI problems
- None new.
