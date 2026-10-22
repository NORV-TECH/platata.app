# TS5 — Cobrar con tarjeta (shop, owner phone)

## Built
- Owner phone, two scanned products on the shop register → "Cobrar $X" → card. CO: Wompi typed card (number/CVC masked, expiry "12 / 28"),
  consent ticked, "Cobrar", "Enviando al banco…", Sale complete "Pago aprobado · VISA ••4242". US/CA: Stripe Tap to Pay with NO tip
  screen (RetailRules.tipDefaultOn = false): "Preparing the charge…" → "Tap the card" → "Processing…" → approved.
- MX PE CL EC AR PA BR: no card in the app; the page shows Exacto + the Payment methods list without a Card row (with Fiado).
  Voice: TS5.json (es CO, pt BR no-card, en US) + TS5-US.json and TS5-MX/PE/CL/EC/AR/PA.json (es). Checked at 6736ddfb.

## Left out
- The real Tap to Pay (TapToPayMode.REAL_TAP_TO_PAY = false today; the build uses Stripe's simulated reader).

## New UX/UI problems
- None new.
