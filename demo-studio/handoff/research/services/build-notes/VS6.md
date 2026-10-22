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
