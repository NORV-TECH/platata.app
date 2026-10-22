# TS7 — Recibo por WhatsApp o impreso (shop, owner phone)

## Built
- Owner phone, shop register with two scanned products (one twice) → "Cobrar" → "Exacto" → Sale complete (printer saved: "Imprimir otra
  vez", "Nueva venta") → reprint toast → "Ver recibo" (2x … @ $x c/u) → WhatsApp box with the dial code → WhatsApp with the signed receipt →
  back, the sale still there → "Nueva venta". US/CA: "Text receipt" and "Email receipt" (messages / mail apps), neither ends the sale.
- Voice: TS7.json (es/pt WhatsApp, en US text+email) + TS7-US.json. Checked at 6736ddfb.

## Left out
- Weighed lines ("1,5 kg × $ 7.000") on purpose: unit names are R6 (untranslated) until it lands.
- A fiado sale's receipt (R1).

## New UX/UI problems
- None new.
