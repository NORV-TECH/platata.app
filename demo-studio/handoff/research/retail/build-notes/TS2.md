# TS2 — Abrir la caja (shop, owner phone)

## Built
- Owner phone, shop register with the amber "Caja cerrada · Abrir" bar → Abrir caja keypad ("Efectivo inicial", whole units, "000" in
  COP/CLP) → "Abrir caja" → register open (bar gone) → "Agregar productos" → one scan, the product is in the sale. 6 beats, 5 taps.
- Differs by country: starting cash (50.000 CO/CL/AR, 1.000 MX, 200 PE/BR, 100 USD/CAD) and the bottom-left key. Checked at 6736ddfb.

## Left out
- The "scan while closed → Abrir caja pops up" path (CartActions.kt:173-185): skipped, see S2 problem 1 (the scan session is written before
  the gate). Demo assumes the backup is connected (else TopStrips shows the backup bar instead of "Caja cerrada").

## New UX/UI problems
- None new.
