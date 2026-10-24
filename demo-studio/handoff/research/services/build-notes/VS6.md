# VS6 — Otras formas de pago (services, owner phone)

## 1. Built
- Owner phone, Veterinaria Patitas (`?biz=` works for the other three). Métodos de pago (no Fiado row) → "+ Nuevo" →
  "Agregar método de pago", the box example follows the country (PaymentMethodExample: CO Nequi, PE Yape, AR/MX Mercado Pago,
  US Zelle, CA Interac; CL/EC/PA/BR "Transferencia/Transferência") and the demo types that name → Agregar (on at once) → till
  with Desparasitación (Perro mediano) → Cobrar → "Otro método de pago (2)" → sheet (Cortesía + the method; Mercado Pago sorts
  first) → the method → "Confirma que recibiste el pago de $ 40.000 en Nequi." → "Sí, cobrar" → ¡Venta completada!. 6 taps.
- No Save/Fiar on the services pay screen (paying later = booking). The voice names Cortesía as the way to give a service free.
- VS6-MX.json (Mercado Pago). MX/US/CA: Stripe not connected on this page ("+ Tarjeta · Configurar"). Checked at 73c65f08.

## 2. Left out
- "Datáfono" is not in the code (no per-country list of methods beyond the one example name); the demo types the app's example.
- The Cortesía flow itself ("¿Regalar esta venta?" + motivo): named, not tapped (≤ 10 taps).

## 3. New UX/UI problems (73c65f08)
- Same "Artículos (1)" link and tile-price cut as VS4.

## 4. The 52 items checked here
- 42 (comp dialog "¿Regalar este pedido?"): fixed — "¿Regalar esta venta?" (values-es:3904, pt "Dar esta venda de graça?").

## 5. After REVIEW-VS4-7
- The method tap waits 4.0 s into beat 4 (the sheet stays up while Cortesía is named).
- pt line 3 now also says the Pix (its button is on screen) already carries the sale total (helper brief, Brazil rule).

## Round 3 (37db6d6c)
- Page changed: the service tiles (same block as VS5: "Desde" line, whole amount, minutes line), the pay screen link
  "Servicios (1) ›" (item 14), the two-row link slot and the receipt rules (shared code; no link shows on this page: QR set up,
  CO card connected, MX Stripe not connected). Payment methods, the add dialog, the "Otro método de pago" sheet and the custom
  confirm are unchanged at 37db6d6c.
- Script: unchanged (VS6.json, VS6-MX.json). check_demo CO/BR/MX OK. Timing VS6 es:CO, pt:BR, VS6-MX es:MX: lines over their
  screens as before, no wait changed. No video exists (no cut_price_scan).
- New app bugs: none.
- Round-2 items seen: 2, 9, 17 (tile) fixed; 14 fixed; 31 fixed (no Stripe location warning in Colombia).
