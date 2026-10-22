# REVIEW-1 — restaurant demos R4 R5 R6 R11 RS3 RS4 RS5 RS6 RS7

Reviewer: independent pass, 20 Oct 2026 ~21:40 PT. App checked at /home/claude/app-head 6736ddfb.
Method: frames every 2 s (plus 2-3 fps around transitions) of every es video and pt/en spot checks; strings
checked against values / values-es / values-pt-rBR; claims spot-checked in code. No file was edited.

Summary
| Feature | es | pt | en / US-es |
|---|---|---|---|
| R4 | OK (1 nice) | BROKEN FILE | BROKEN FILE |
| R5 | OK | OK | BROKEN FILE |
| R6 | OK | OK | OK |
| R11 | OK | OK | OK |
| RS3 | OK | OK | OK |
| RS4 | 1 nice | 1 MUST | (no video) |
| RS5 | 1 MUST | (no video) | 1 MUST (en + US-es), 2 nice |
| RS6 | OK (1 nice) | OK | OK |
| RS7 | 1 nice | OK | OK |

---

## Broken videos (MUST-FIX)
1. `video/R4-pt.mp4`, `video/R4-en.mp4`, `video/R5-en.mp4` do not open: ffmpeg says "moov atom not found".
   Sizes are 1,048,624 / 1,310,768 / 786,480 bytes (exact 256 KiB multiples + 48) — truncated copies, last
   written 21:15–21:18 and not touched since. Fix: re-render these three (R4 pt, R4 en, R5 en) and check each
   with `ffprobe` before publishing. They could not be reviewed.

## R4 (waiter takes the order)
- es: OK. Words, money ($ 42.000 / $ 82.000 = 42+28+12), "1 extra" (modifiers_extras_count), "Enviado a cocina:
  Mesa 4", Abiertas row "Toca para cargar", KDS card "Mesa 4 · Carlos" + "Término medio" all match the code.
- NICE 1 (26–31 s): no subtitle for ~4 s while the hop card and the kitchen screen are already showing (voice line
  8 starts at ~32 s). Fix: in `demos/restaurante/R4.html` start beat 8 (index 7) on the hop step, or shorten the
  pause after the "Abiertas" beat so the kitchen line plays when the kitchen screen appears.

## R5 (dine in / to go / delivery)
- es + pt: OK. List order (DAO name order), "Predeterminada"/"Padrão" chip only on switched-on non-Tables options
  (DiningOptionsScreen.kt:155), "No puede estar activa a la vez que Mesas", gate "¿Cómo sale este pedido?" with
  "+$ 3.000", total $ 31.000 / R$ 15,00, pt keypad decimal key "," — all true.

## R6 (employee phone)
- es / pt / en: OK. Strings verified (join_biz_*, welcome_sheet_*, conn_pick_*, phone_reg_share_message, "Invitado"),
  code boxes with the "-" are real (PaperCodeBoxes), "Esto usa 1 de tus conexiones" hidden in US (free country) — correct.
  The PIN inside the WhatsApp invite is on Monti's decided list (not flagged).

## R11 (order ready → WhatsApp)
- es / pt / en: OK. KDS card title "Para llevar" is the real fallback (KdsTicketTitle.kt: dining option when no
  name/table), LISTO/PRONTO/MARK READY, ready panel "Notificaciones y Entrega" + "Ignorar", message
  order_ready_whatsapp + signature — all match.

## RS3 (cash)
- es / pt / en: OK. 28.000+12.000 = 40.000, received 50.000, change 10.000; BR R$ 19,00 / 20,00 / 1,00 with ","
  key; US $8.00 / $10.00 / $2.00, "+ Card · Set up" for an unconnected US owner. Sale complete strings match.

## RS4 (QR / Pix)
1. MUST-FIX — pt, 2–6 s: on "Pagamentos por Pix" a big stray fragment **"seu banco"** sits under the top bar. It is
   the second line of the h1 `qr_terms_title` ("Confira cada pagamento no seu banco"), half scrolled away by the
   fixed `translateY(calc(var(--u)*-150))` in `termsPage()` (`demos/restaurante/RS4.html` ~line 230). In es the
   title is one line shorter so it vanishes completely. Fix: either drop the scroll (`st.scrolled` → no transform;
   the page fits), or scroll to a measured offset (scroll the `.x-pinner` so the `.sub` line is the first visible
   element, e.g. compute `-(h1.offsetTop + h1.offsetHeight)` at render instead of the fixed -150).
2. NICE — es: because of the same scroll the warning page never shows its potato and its title "Revisa cada pago en
   tu banco" — the strongest line of that screen. Fix: show the unscrolled page for the first ~1.5 s of beat 1 and
   scroll only when the tick box is tapped.
- Everything else OK: QR switch → full-page warning → tick → chooser "Configurar código QR" → upload → "Código QR
  guardado." → Cobrar → "QR" button → overlay "Revisa en tu app del banco…" → "Pagó · Sin foto" → Sale complete.
  CO still shows "Configurar QR o tarjeta" after QR is set up — true to PayWaysVisibility.kt:64 (already noted in
  build-notes/RS5.md).

## RS5 (card)
1. MUST-FIX — es (~11–16 s), en (~13–18 s), US-es: voice/subtitle out of step at the payoff. "Cobrando / Enviando
   al banco…" and the green "Pago aprobado VISA ••4242" Sale-complete screen play under the PREVIOUS line ("Las
   casillas ya vienen marcadas: toca Cobrar" / "They tap their card…"); then the "New sale" tap fires at the start of
   the last beat, so "El banco aprueba y la venta queda guardada sola. Toca Nueva venta." / "Payment approved, tip
   included. Tap New sale." is spoken over an EMPTY register. Fix (simplest): in `demos/restaurante/RS5.html` delete
   the beat-3 "new" step (line 272 Wompi, line 280 Stripe) so the approved screen stays up for the whole beat, and in
   `features/RS5.json` (es 4-approved, en 4-approved) and `features/RS5-US.json` (4-approved) drop the last
   sentence ("Toca Nueva venta." / "Tap New sale."). Re-render RS5-es, RS5-en, RS5-US-es.
2. NICE — US-es page hint, line 280: `H("Toca New sale","Toque em New sale","Tap New sale")` puts English in the
   Spanish hint. Fix: `tapW(t("receipt_opt_new_sale"))` (or drop the step per #1).
3. NICE — US-es video: categories "Desserts / Drinks / Mains / Sides" and dishes in English next to Spanish UI
   ("Todos", "Cobrar"). It is menu data, but in a Spanish video it reads as English leaking. Fix (optional): for
   `?country=US&lang=es` use Spanish category names in kit data (Postres, Bebidas, Platos fuertes, Acompañantes).
- Verified true: Wompi consent boxes pre-ticked and untickable (WompiPaymentOverlay.kt:401,634); expiry shown plain;
  18 % of $8.00 = $1.44 → $9.44.

## RS6 (other payment methods + comp)
- es / pt / en: OK. "Nombre (ej. Nequi)" is real (PaymentMethodExample CO → Nequi; BR/elsewhere "Transferência"),
  confirm "Confirma que recibiste el pago de $ 40.000 en Nequi." / "Volver" / "Sí, cobrar", comp dialog
  "¿Regalar este pedido?" / "Motivo — opcional" / "Regalar" all match strings.
- NICE (es ~8 s): one frame of the register with no subtitle between "Toca Agregar" and the next line. Cosmetic.

## RS7 (receipt)
- es / pt / en: OK. Exact hero "Recibiste $ 40.000", "Imprimir otra vez" + toast "Recibo enviado a la impresora",
  receipt viewer, "WhatsApp del cliente" dialog, WhatsApp with signature, sale stays open after WhatsApp (PAY-1), US
  Text/Email route — all true. Closing message "¡Gracias por tu visita!" is a documented demo setup (ReceiptConfig.kt:24).
- NICE — es last beat and en "Back in Platata…": the New-sale tap fires before the line, so "Toca Nueva venta" is
  heard over the empty register (~1 s). Fix: let beat 7 ("7-new") explain without a tap, or move the tap to the end.
