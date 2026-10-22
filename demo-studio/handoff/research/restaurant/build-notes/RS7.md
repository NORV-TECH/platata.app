# RS7 — Recibo por WhatsApp o impreso (build notes)

## Built
- Owner phone with a receipt printer saved: Cobrar → Exacto → "¡Venta completada! Recibiste $X" → "Imprimir otra vez" (toast "Recibo enviado a la impresora") → "Ver recibo" (full page, the receipt text of generatePastPlainTextReceipt) → X → WhatsApp → box "WhatsApp del cliente" pre-filled with the dial code → number → Enviar → WhatsApp opens with the receipt and "Hecho con Platata · platata.app" → send → back on Sale complete (the sale does not end) → "Nueva venta".
- US/CA: "Text receipt" (black) opens Messages with the receipt (To empty, not signed) and "Email receipt" opens the mail app (subject "Receipt"); voice RS7.json en + RS7-US.json (es).
- 8 beats = 8 voice steps. WhatsApp / Messages / Email are drawn plainly (not Platata screens). Code checked: app-head 6736ddfb.

## Left out
- Customer with a saved number (WhatsApp opens directly), a failed print, the receipt viewer's own Send/Print buttons.

## New UX/UI problems
- Every new shop's receipt ends with the English line "Thank you for shopping with us!" in every language (the WhatsApp/SMS/email/paper text). `data/ReceiptConfig.kt:24` default; `data/repo/SeedStore.kt:75,245` set only `storeName`. Fix: seed `customFooterMessage` from a localized string (shop language) at creation. BLOCKS THE DEMO (visible in the receipt viewer and the WhatsApp text of every country).
- The receipt date is always day-first "dd/MM/yyyy HH:mm", also in the US ("20/10/2026" reads as month 20). `utils/ReceiptFormatter.kt:157`. Fix: a locale date pattern (MM/dd/yyyy for US) or a written month. small.
