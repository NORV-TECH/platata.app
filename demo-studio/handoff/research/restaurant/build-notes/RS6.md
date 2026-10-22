# RS6 — Otras formas de pago (build notes)

## Built
- Owner phone: Métodos de pago → "+ Nuevo" → "Agregar método de pago", field "Nombre (ej. Nequi)" (example by country: Nequi CO, Yape PE, Mercado Pago MX/AR, Zelle US, Interac e-Transfer CA, else "Transferencia"/"Transferência") → Agregar (on) → till: Cobrar → "Otro método de pago (2)" sheet → the method → "Confirma que recibiste el pago de $X en Nequi." → "Sí, cobrar" → "¡Venta completada!"; then a second sale → Cortesía → "¿Regalar este pedido?" + "Motivo — opcional" → Regalar → done.
- Order follows the app: "Mercado Pago" sorts right after QR (PosViewModel.paymentMethods), so in MX/AR it is first in the sheet; elsewhere Cortesía comes first.
- 7 beats = 7 voice steps. Code checked: app-head 6736ddfb (the confirm title changed in this commit from "¿Ya viste el pago…?" to "Confirma que recibiste el pago…"; page and voices follow it).

## Left out
- Delete method, the per-method drawer switch, the waiter-phone permission for Cortesía.

## New UX/UI problems
- None new.
