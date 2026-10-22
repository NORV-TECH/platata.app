# REVIEW-R3: retail demos TS1 TS2 TS3 TS4 TS5 TS7 TS8 (+ US-es TS5 TS7)

Reviewer: independent pass, 21 Oct 2026. App checked at /home/claude/app-head 6736ddfb. I edited no demo or app file.
Method: I rebuilt each video's voice timeline from its own audio clips (the same `__timeline` the recorder uses). For every es
video I pulled a frame 0.4 s after the start and 0.15 s before the end of every voice line, plus one in every silent gap
over 1.5 s, and extra frames wherever something looked wrong. For pt, en and US-es I pulled one frame per line (at 70%).
Frames: /tmp/claude-0/-home-claude/b81398e0-b7d9-57cf-b753-63da5401d97f/scratchpad/review7/.

All 21 videos open and decode in ffprobe: 1080x1920, h264 + aac, 19.4 to 35.4 s.

## Summary
| Feature | es (CO) | pt (BR) | en (US) / US-es |
|---|---|---|---|
| TS1 Crear el negocio | 1 MUST, 2 nice | 1 MUST, 1 nice | 1 MUST, 1 nice |
| TS2 Abrir caja | 1 nice | 1 nice | 1 nice |
| TS3 Cobrar en efectivo | OK | OK | OK |
| TS4 QR / Pix | 1 nice | 1 nice | (no video) |
| TS5 Tarjeta | OK | (no video) | 1 nice (en + US-es) |
| TS7 Recibo | 1 MUST | 1 MUST | 1 MUST, 1 nice (en + US-es) |
| TS8 Devolver | 1 MUST, 1 nice | 1 MUST, 1 nice | 1 MUST, 1 nice |

Claims verified in the code:
- Camera bar badge counts LINES, the pay screen counts UNITS: ScannerScreen.kt:65 `cartCount = uiState.cart.size`, so "Cobrar $10.100 · 2" next to "Artículos (3)" is right.
- Colombia keeps "Configurar QR o tarjeta" after QR is set up because Wompi is not connected: PayWaysVisibility.kt:60-64.
- Wompi consent boxes come pre-ticked and cannot be unticked: WompiPaymentOverlay.kt:401 + 634. The expiry field shows "12 / 28" unmasked (PAY-1).
- A shop does not ask for a tip by default: RetailRules.kt:32 `tipDefaultOn = false` (the owner can switch it on; the voice says "Una tienda no pide propina", true for the default).
- Receipt route: CO/BR WhatsApp, US Text + Email (ReceiptSendRoute); email subject = `receipt_dlg_title` (ReceiptOptionsScreen.kt:83); SMS and email are not signed, WhatsApp is (WASIG-1). Receipt date is always dd/MM/yyyy (ReceiptFormatter.kt:157), so "20/10/2026" in the US is the app.
- A FULL refund puts the goods back, only for a sale rung on this phone: StockStore.returnSaleToStock (called from PlatataRepository.kt:1723). TS8 refunds every item, so "vuelven a tu inventario" is true.
- Refund flow: button, "Confirmar devolución / Sí, devolver", then the PIN pad; "Entrega $8.300 en efectivo" line; matches S7-B6/B7.
- "Tamaño: 31 MB" is the size after ROUND3 item A (noted in build-notes/TS1.md), not the 606 MB file.
- The duplicate "Tu negocio queda ligado a tu cuenta de Google" on the Google page is the app (GoogleAuthScreen.kt:381 + 389), see App issue A1.

---

## TS1 (Crear el negocio): es, pt, en
1. **MUST, all 3.** The "Configurando tu negocio…" card (es 20.8–24.5 s, pt 22.0–25.8, en 21.3–25.3): the spinner of the row in progress
   is drawn with `class="ring"`, which is ALSO the kit's tap-highlight class (kit/edif.css:152 `.ring{position:absolute; amber glow}`).
   So the spinner floats over the row text as an amber tap ring ("M◯neda: peso colombiano", "Pre◯parando tu caja"). It looks like a tap on the wrong thing and covers the words.
   Fix in `demos/tienda/TS1.html`: rename the class to `spin` in all three places: line 610 `<span class="ring"></span>` → `<span class="spin"></span>`;
   line 1043 `.mat .ring{` → `.mat .spin{`; line 1065 `.mat .ring{` → `.mat .spin{`. Re-render es, pt, en.
2. Nice, all 3. 3.9 s with no voice and no subtitle while "Configurando…" runs (es 21.0–24.9, pt 22.2–26.0, en 21.5–25.5). Fix in TS1.html
   line 645: shorten the setup timeline, e.g. `E.after(3300,…setup…)` → 2600, done=1 at 3300, done=2 at 3900, done=3 at 4400, ready at 4900.
3. Nice, es. The name page leaves for the Google page at ~12.9 s while the line "Escribe el nombre… Así sale en tus recibos" plays to 14.0
   (pt/en same, ~1 s). Fix: TS1.html line 641, change `beat:3` to `beat:4` (the "Continuar" tap then opens line 5 "Entra con tu cuenta de Google").

## TS2 (Abrir caja): es, pt, en
1. Nice, all 3. Beat 5 subtitle says "Escanea y el producto entra a la venta" / "Escaneie…" / "Scan and the item…", but the voice and the
   screen say tap the screen ("TOCA LA PANTALLA PARA ESCANEAR"). Fix in TS2.html line 514 (+ the pt/en arrays below it): es "Toca la pantalla y el producto entra a la venta",
   pt "Toque na tela e o produto entra na venda", en "Tap the screen and the item goes into the sale".

## TS3 (Cobrar en efectivo): OK
- es, pt and en are OK. Change is right in all three (CO 20.000−10.100=9.900, BR 20,00−18,49=1,51, US 10.00−9.27=0.73).

## TS4 (Pagos QR / Pix): es, pt
1. Nice, es 9.5–11.7 s and pt 7.9–11.3 s. "Entendido, activar…" is tapped mid-line, so the "Configurar código QR / QR do Pix" chooser shows for 2–3 s under the
   subtitle "Lee el aviso…" while the voice still says "Marca la casilla y toca Entendido". Fix in `demos/tienda/TS4.html` line 557 (the `qr_terms_cta` step): `beat:1` → `beat:2`
   (the chooser then opens on "Sube la foto del QR…"). Re-render es, pt.
- Pix with the sale amount (QR-2) is voiced only in BR; Colombia says QR. Correct.

## TS5 (Tarjeta): es OK; en + US-es
1. Nice, en 12.5 s / US-es 11.7 s. "Sale complete! · Payment approved" appears ~1.8 s before the line "Payment approved…", while the voice still says "The customer taps their card".
   Fix in TS5.html line 556 (Stripe step, beat 2): make the approval inside its `E.after` fire ~1500 ms later, or move the approval to its own step on `beat:3`.

## TS7 (Recibo): es, pt, en, US-es
1. **MUST, all 4.** The receipt ends with the English "Thank you for shopping with us!" in the Spanish and Portuguese videos too: in the viewer
   (es 10.3–11.4 s), in the WhatsApp text (es 16–19 s, pt 16–20 s), in the SMS and email (en / US-es 13–23 s). Hard-coded at `demos/tienda/TS7.html` line 389.
   Fix (same as restaurant RS7.html:163): line 389 →
   ``s += `${o.method}\n\n${R.pick({es:"¡Gracias por tu compra!",pt:"Obrigado pela compra!",en:"Thanks for shopping with us!"})}`; /* demo setup: the owner wrote her own closing message in Recibos (the default is still English, ReceiptConfig.kt:24) */``
   Re-render es, pt, en, US-es. (The same literal is in TS1/TS2/TS3/TS4/TS5 receiptText but never drawn in those videos; fix it there too so the pages are safe.)
2. Nice, en + US-es 20–23.5 s. In the email body the first letter of the first and last lines is clipped ("ʀosa's Corner Market", "ʼhank you…"):
   `.x-sms .msg` keeps `border-radius:18; overflow:hidden` while mailApp sets `padding:0`. Fix TS7.html line 520: style → `background:none;padding:0;border-radius:0`.

## TS8 (Devolver una venta): es, pt, en
1. **MUST, all 3.** The sale paper shows "Thank you for shopping with us!" before and after the refund (es 5–27 s). Fix `demos/tienda/TS8.html` line 518:
   `L.push(t("payment_method_cash"), "", R.pick({es:"¡Gracias por tu compra!",pt:"Obrigado pela compra!",en:"Thanks for shopping with us!"}));` and the same at line 391. Re-render es, pt, en.
2. Nice, all 3. 4.5 s with no voice after the PIN (es 18.8–23.4, pt 19.7–24.2, en 18.9–23.2). The PIN step waits for its last `E.after(4300,…scroll…)` before line 7 starts. Fix `demos/tienda/TS8.html` line 590: `E.after(4300,` → `E.after(1700,`.

## App issues seen on screen (for the coder, not demo errors)
- A1 small: GoogleAuthScreen.kt:381 subheadline and :389 first benefit row say the same sentence ("Tu negocio queda ligado a tu cuenta de Google") one under the other. Fix: drop the subheadline or reword `auth_benefit_account`.
