# RS4 — Cobrar con QR (build notes)

## Built
- Owner phone: Métodos de pago → switch "Pago QR" (BR "Pix") → full warning page (paper look, tick + "Entendido, activar pagos QR/Pix") → "Configurar código QR" chooser → "Subir código QR" → Android file picker → toast "Código QR guardado." → till: Cobrar → QR (BR Pix) → QR overlay (total, QR, "Que el cliente escanee…", red note, "Pagó · Foto del pago" / "Pagó · Sin foto") → "¡Venta completada!".
- Brazil: Pix words everywhere (`_pix` strings), the QR picture changes with the amount (QR-2); voice says the client types nothing.
- US/CA: the app has NO QR (no row in Payment methods, PayWaysVisibility needs !stripeCountry). The page shows the honest alternative: the shop's own method (Zelle / Interac e-Transfer from PaymentMethodExample) with the confirm dialog. **The tree should hide RS4 for US/CA.** Voice: RS4.json en and RS4-US.json (es) describe that alternative.
- 6 beats = 6 voice steps. Code checked: app-head 6736ddfb.

## Left out
- "Fotografiar código QR" (camera), the accordion "Código QR y nota del cajero", "Foto de recibo obligatoria".
- The bank QR in the page is a placeholder pattern (not scannable): the real one is the owner's photo.
- No per-country Spanish variant: the app's words are the same in every Spanish QR country (only the set-up link differs, not voiced).

## New UX/UI problems
- None new beyond RS5.md / RS7.md.
