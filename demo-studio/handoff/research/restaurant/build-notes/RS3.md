# RS3 — Cobrar en efectivo (build notes)

## Built
- Owner phone (Material look): Catálogo tab, two dishes, "Cobrar $X" → pay screen with the "¿Qué mesa?" gate (Mesas on as the only dining option) → Mesa 4 → type the note the customer hands over (whole units, "000" key for COP/CLP, decimal key elsewhere) → Recibido + green Cambio → Efectivo → "¡Venta completada!" CAMBIO hero → "Nueva venta · Sin recibo".
- Device: owner phone only ("Tu teléfono" / "Seu celular" / "Your phone"). 6 beats = 6 voice steps.
- Countries differ: set-up link (CO "Configurar QR o tarjeta", BR "Configurar Pix", other LatAm "Configurar QR", US/CA none + "+ Card · Set up" button and Exact without amount); cash rounding line under Total in CL/PE/CA when the total is not round (kit prices are round, so it does not show); US/CA Sale complete shows Text/Email receipt.
- Code checked: app-head 6736ddfb (2026-10-20 19:57 -0700); strings regenerated from it.

## Left out
- Printer and kitchen screen (not needed; with a kitchen target the left footer button would read "Enviar a cocina").
- "Borrar"/Deshacer, the customer field.

## New UX/UI problems
- See RS7.md (receipt footer in English, US receipt date day-first) and RS5.md ("Configurar QR o tarjeta" when the card is already set up).
