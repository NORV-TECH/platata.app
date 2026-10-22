# TS9 — Meter y sacar efectivo (shop / pharmacy, owner phone)

## Built
- Owner phone: Register tab (locked flag) → fingerprint → panel → "Caja abierta" → Register screen (one register, no tab row; Efectivo
  inicial, Ventas en efectivo (esta caja), Abonos de fiado, Debe haber en la caja) → "Sacar efectivo" → keypad + chip "Proveedor" →
  Guardar → back on the Register screen with the new line "-$ X" and the expected cash lower, snackbar "Guardado". 8 beats, 7 taps.
- Countries differ only in money (keypad "000" for COP/CLP, decimal key elsewhere) and words. Pharmacy: same screens, the pharmacy's name.
  Checked at app-head 6736ddfb.

## Left out / will change
- "Meter efectivo" is shown, not tapped. Cash in/out exists on the owner phone only (REGISTER-2, decided). Nothing from R1–R7 is on screen.

## New UX/UI problems
- None new. (A "Proveedor" cash-out is not a supplier invoice — by design, CLAUDE.md S7-D14a.)
