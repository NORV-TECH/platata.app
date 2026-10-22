# RS5 — Cobrar con tarjeta (build notes)

## Built
- Colombia (Wompi): Cobrar → Tarjeta → typed form (number and CVC masked, Vence plain "1228", name, both consent boxes pre-ticked) → "Cobrar $X" → "Cobrando / Enviando al banco… / Tarjeta · 1 cuota" → saved by itself → "¡Venta completada! Pago aprobado VISA ••4242" → Nueva venta.
- US/CA (Stripe Tap to Pay): Cobrar → big Card → "Add a tip?" (18% starts the charge) → "Total to charge" + "Tap the card" → card graphic taps → "Processing…" → "Sale complete! Payment approved" → New sale. Voice says "credit or debit card", never Interac.
- Other countries (MX PE CL EC AR PA BR): the pay screen has no Card button and Payment methods has no Card row; the page shows that (Exacto in cash). **The tree should hide RS5 there.** Voices: RS5.json (es = CO Wompi, pt = BR no card, en = US Stripe), RS5-US.json (es Stripe), RS5-MX.json (es no card, for MX PE CL EC AR PA).
- 5 beats = 5 voice steps. Code checked: app-head 6736ddfb.

## Left out
- Wompi/Stripe setup (keys, Connect), offline "Sin conexión", declined/timeout screens, "Other amount" tip.
- TapToPayMode.REAL_TAP_TO_PAY = false (simulated reader) — already an open question in S5.md; the demo draws a plain card graphic. The VISA ••4242 line on the US Sale complete assumes the simulator's default test card.

## New UX/UI problems
- Colombia's set-up link says "Configurar QR o tarjeta" even when the card IS set up (only QR is missing). `sync/PayWaysVisibility.kt:64` (`f.wompiCountry -> SetupLink.QR_AND_CARD`). Fix: return QR_ONLY when `cardConnected`. small.
