# REVIEW-3 — restaurant demos RS1 RS2 RS8 RS9 RS10

Reviewer: independent pass, 20 Oct 2026 ~23:00 PT. App checked at /home/claude/app-head 6736ddfb.
Method: frames every 2 s of every es video (plus 0.5 s around transitions), 4–8 frames of each pt/en video,
`silencedetect` on the es audio to line voice up with screens; strings checked in values / values-es /
values-pt-rBR; claims spot-checked in code. No file was edited.

All 15 videos re-probed after the re-record (files 21:59–22:04): every one opens, 1080x1920 h264 + audio,
durations 18.8–38.5 s. No broken file.

Summary
| Feature | es | pt | en |
|---|---|---|---|
| RS1 | 2 MUST | 1 MUST (same as es #1) | 1 MUST (same as es #1) |
| RS2 | OK | OK | 1 nice |
| RS8 | 2 nice | OK | OK |
| RS9 | 2 nice | OK (panel nice) | OK (panel nice) |
| RS10 | 3 nice | OK (panel nice) | OK |

---

## RS1 (create the business)
Verified: welcome_start_cta, biz_start_cta, ready_cta_menu, auth_subheadline/auth_benefit_account (the doubled
sentence is the app's own, already in build notes), pitch pay line by country (CO "Efectivo, QR y tarjeta · Gratis,
para siempre.", BR "Dinheiro e Pix · Grátis, para sempre."), Edificios tile only in CO, 3 tiles in BR/US, backup bar
on Home after creation (WarningBars: backup wins the slot) — all true.

1. MUST-FIX — all three videos, "Configurando tu negocio…" (es 16–20 s; pt ~18–21 s; en ~21 s): the "working" ring
   is drawn ON TOP of the line's text (it covers "Mo" of "Moneda", "Pre" of "Preparando") with a big orange halo, and
   the line loses its circle slot. Cause: the page uses `<span class="ring">`, and `kit/edif.css:152` styles `.ring`
   as the engine's tap-guide ring (`position:absolute`, glow box-shadow). The app draws a plain 24 dp accent ring in
   the circle's place (`SettingUpScreen.kt` `WorkingRing`). Fix: `demos/restaurante/RS1.html:358` change
   `<span class="ring"></span>` to `<span class="wring"></span>`, and line 469 `.mat .ring{` to `.mat .wring{`.
   Re-record RS1 es/pt/en.
2. MUST-FIX — es (and pt/en, same structure): voice and screen are one screen apart from 16 s to 28 s. The
   "Configurando" screen plays under "Entra con tu cuenta de Google" (16–20 s); the line "Platata pone tu moneda y
   prepara tu carta y tu caja" plays over "¡Tu negocio está listo!" (22–25 s); then "Tu negocio está listo. Toca
   Armar mi carta…" plays over Home. Cause: the Google tap (RS1.html:398-399) schedules the ticks and the ready screen
   with `E.after(... 4300)`, and the engine starts beat 5 only after every timer has run. Fix (simplest): merge beats
   4 and 5. `features/RS1.json`: step "5-google" voice es "Entra con tu cuenta de Google. Platata pone tu moneda y
   prepara tu carta y tu caja." pt "Entre com sua conta Google. O Platata coloca sua moeda e prepara o cardápio e o
   caixa." en "Sign in with your Google account. Platata sets your currency and gets your menu and register ready.";
   delete step "6-prepara" (renumber "7-listo"→"6-listo", "8-fin"→"7-fin"). `RS1.html:386-388`: delete the 6th beat
   ("Platata prepara tu negocio" / "O Platata prepara seu negócio" / "Platata sets up your business"); line 400
   change `beat:6` to `beat:5`. Re-record.

## RS2 (open the register)
Verified: register_open_title / register_open_amount_hint ("Efectivo inicial" / "Troco inicial" / "Starting cash"),
the "Caja cerrada · Abrir" bar under the tabs (HomeScreen.kt:672, workspace_register_closed + _open_action), keypad
typing whole units with "000" in COP and "," / "." elsewhere (50.000, R$ 200,00, $100.00), back to Home after opening
(Cobrar $ 28.000 after one dish). es and pt OK.
1. NICE — en ~13 s: the tile "Cheeseburger" is cut to "Cheeseburg" with no ellipsis. The app's ProductCard
   (maxLines 2) breaks a long word onto the next line. Fix: `kit/material.css:44` add `overflow-wrap:anywhere;` to
   `.mtile b` (kit is shared, ask Claude), or put `.mat .mtile b{overflow-wrap:anywhere}` in RS2.html's `<style>`.

## RS8 (refund a sale)
Verified: refund_paid_left, refund_goes_cash, tx_confirm_refund_title/body, tx_yes_refund, refund_pin_title/subtitle +
refund_pin_where, tx_status_part_refund, receipt "Devuelto / Neto tras devolución", US "Text" instead of WhatsApp
(ReceiptSendRoute); the PIN pad appears only because Security is on (`TransactionsScreen.kt:1417,1538`) — consistent
with the fingerprint on Home. Sums: 82.000−28.000=54.000; R$ 64−12=52; $22.50−4.50=18.00; day headers add up.
1. NICE — es 17–21 s (pt/en similar): ~5 s with no voice and no subtitle while the PIN fills and the refunded sale
   shows; the receipt then scrolls before "La venta queda con la devolución…". Cause: `E.after(4300, scroll)` in the
   PIN step (RS8.html:357) holds back beat 6. Fix: delete `E.after(4300,()=>{ st.scroll=200; });` at line 357 (the
   whole receipt incl. Devuelto / Neto lines already fits unscrolled).
2. NICE — es 3–5 s: Home's "Mi negocio" shows the fingerprint (locked) but the Ventas list shows the flag; in the
   app the lock does not lift by changing tab (`PlatataApp.kt:499`). Fix: RS8.html:301 `nav("ventas")` →
   `nav("ventas",{locked:true})`.
(Receipt footer "Thank you for shopping with us!" in English and the dd/MM date are app issues, already in build notes.)

## RS9 (cash in / cash out)
Verified: settings_gate_title/subtitle sheet, panel register card, cash_movement_* words and reasons, "Guardado"
snackbar, red "-$ 20.000 · Anular" line, 50.000+186.000−20.000=216.000 (R$ 606,00; $274.50), "Ventas en efectivo
(esta caja)" vs "Todo el efectivo desde que abrió" (one register), owner phone only (decided).
1. NICE — es 13.5–17.7 s: ~4 s without voice or subtitle after "Toca Guardar" (snackbar showing). Cause: snackbar
   timer `E.after(3600, …)` at RS9.html:310 holds back beat 5. Fix: change 3600 to 1200.
2. NICE — es/pt/en, the business panel (es 7 s): the restaurant panel in the app also has Facturas, Equipo, a
   divider and Ajustes (HomeScreen.kt:1716, ~1774, 1802, 1818); the demo stops after Reportes and leaves half the
   screen empty. Fix: RS9.html panel() after the Reports row (~line 149) add rows workspace invoices ("Facturas"),
   Team ("Equipo"), the divider and Settings ("Ajustes") with the app's own strings/subtitles from PanelRowSpecs.

## RS10 (close the register)
Verified: register_close_* (title, expected, see breakdown, counted, diff, "Faltante %s" / "Falta %s" / "Short %s"),
confirm dialog "¿Cerrar la caja con $ 214.000 contados?" + Seguir contando / Cerrar caja, summary (Ventas netas,
Total cobrado, drawer card, Contado), "Enviar por WhatsApp", signature line. Sums: 216.000−214.000=2.000;
R$ 606−600=6,00; $274.50−270.00=4.50.
1. NICE — es 15–19.6 s: the "Caja cerrada" summary sits ~4 s silent, then scrolls the "Faltante $ 2.000" headline
   away just before the voice says "lo que debía haber y lo que contaste". Cause: `E.after(4200, scroll)` at
   RS10.html:345. Fix: delete `E.after(4200,()=>{ st.scroll=150; });` (the summary + WhatsApp button fit unscrolled).
2. NICE — es 0–3 s: voice says "abre Mi negocio y toca la caja abierta" but the video opens with the panel already
   open. Fix: `features/RS10.json` step 1 es "Al final del día, en Mi negocio, toca la caja abierta." pt "No fim do
   dia, em Meu negócio, toque no caixa aberto." en "At the end of the day, in My business, tap the open register."
3. NICE — same panel gap as RS9 #2 (RS10.html panel function).
(The zig-zag of the padded summary inside WhatsApp is the app's real text, already flagged in build notes RS10.)
