# VS7 — Recibo por WhatsApp o impreso (services, owner phone)

## 1. Built
- Owner phone, Peluquería Carolina (`?biz=` works for the other three; the nail salon has no team, so no "Atendió").
  Bottom tab "Agenda" (Agenda half, day headers Hoy / Mañana) → the 11:30 appointment of Sofía (Corte de dama + Cepillado /
  secado, booked with Carla) → appointment page (lines with money, "Dura 40 min", "Atendió: Carla Gómez", Cobrar / No asistió /
  Reprogramar / Cancelar cita) → Cobrar → pay screen with the amber bar and Sofía already on the sale → Exacto → ¡Venta
  completada! (receipt printer saved) → WhatsApp opens straight on Sofía's chat (she has a WhatsApp number, no number box) →
  send → back, sale still open → Imprimir otra vez (toast) → Nueva venta. 7 taps.
- The receipt (stored sale): "1x Corte de dama" (BR "Corte feminino (Em camadas)": option in brackets, no blank "()"),
  "+ Cepillado / secado con secador", "Lavado (Incluido)", "Atendió: Carla Gómez", "¡Gracias por tu visita!", signed
  "Hecho con Platata · platata.app". US/CA: text + email route (no video). No MX json (same words). Checked at 73c65f08.
- The 11:30 booking is this page's own (kit bookings start at 14:00); client, service, add-on and stylist are the kit's.

## 2. Left out
- "Ver recibo" (same text as the WhatsApp message) to stay at 7 taps; "Compartir" from Venta #N.

## 3. New UX/UI problems (73c65f08)
- small: item 51 only half fixed — the Agenda row still shows the raw number "+573014449911" (ServicesTransactionsScreen.kt:271-274);
  the appointment page reads it (formatWhatsappForReading). Fix: the same call on the row.
- Same "Artículos (1)" link as VS4.

## 4. The 52 items checked here
- 13 fixed (CheckoutActions.kt:305-307 + SavedTicketActions.kt:342,395 SaleLineName.of). 14 fixed (ReceiptActions.kt:172).
- 45 fixed (ReceiptFormatter.kt:398-400 "(Incluido)"; PrintManager.kt:367-375 wraps; footer "¡Gracias por tu visita!").
- 21 fixed for receipts and the appointment page (ReceiptBuilder.kt:84-85, CheckoutActions.kt:615-616).
- 2 fixed (SavedTicketActions.kt:700 register gate on Agenda > Cobrar). 33 fixed (:830-900). 35, 23, 24 fixed. 51 partly.

## 5. After REVIEW-VS4-7 (both MUSTs done)
- The receipt now has the where line "En el local" / "No local" under the Subtotal: a services sale stores its single where mode
  (CartActions.kt:726-737, gateSelection) and the past receipt prints it at no cost (ReceiptFormatter.kt:90-102, whereModeLine).
- Timing: WhatsApp/SMS send waits 5.8 s (the receipt stays on screen while the line describes it); "Imprimir otra vez" waits 2.8 s.
- `?biz=taller-motos`: subtitles say "la orden de" (a work order).
- Not done: moving the 11:30 booking into kit/services-data.js (kit owner's call); a Pix sentence in the pt receipt script (the
  scene is about receipts).
- App bugs the reviewer found, checked real at 73c65f08:
  - small: receipts say "Filtro de aceite incluido (Incluido)": 30 included options in catalogo_investigado/taller-motos.json
    already end in "incluido/a" and ReceiptFormatter.kt:289,400 adds " (Incluido)". Fix: drop the word from those names, or skip
    the suffix when the name already ends with it.
  - small: every in-shop services receipt prints a bare "En el local" line (whereModeLine returns a label for LOCAL too; item 43 was
    meant for an unpaid home visit). Fix if Monti agrees: null for WhereMode.LOCAL (then remove the line from this page).

## Round 3 (37db6d6c)
- Page changed: Agenda rows show only the hour (the day is the header's, R2-2 item 24, ServicesTransactionsScreen.kt:400-415) and the
  phone READ ("+57 301 444 9911", item 12, :270-276); each row now also shows the booking's where line "En el local" / "No local"
  (a one-way shop stores it on every booking, SavedTicketActions.kt:294 + CartActions.kt:726-737; the row prints it, :452-466; it
  was missing on this page, VS8 already had it). Appointment page says "Agendado con: Carla Gómez" while unpaid (item 13,
  AppointmentWording.kt:24-29, AppointmentDetailScreen.kt:271-281). Pay screen "Servicios (1) ›". Receipt: no "En el local" line
  (item 15); "Lavado (Incluido)" stays (the name does not say "incluido"). The till after Nueva venta has the new tiles.
  STR: + appt_performer_pending, ax_cancel_order pt "Cancelar ordem de serviço".
- Script: unchanged (line 4 still true: the PAID receipt says "Atendió: Carla Gómez"). check_demo CO/BR/MX OK (also PE, US).
  Timing VS7 es:CO, pt:BR: every line over its screen. No video exists (no cut_price_scan).
- New app bug: small: every Agenda row of a one-way shop says "En el local" (ServicesTransactionsScreen.kt:452-454 whereText), the
  same ordinary-case line item 15 removed from the receipt (ReceiptFormatter.kt:101). Fix: skip WhereMode.LOCAL in whereText.
- Round-2 items seen: 12, 13, 15, 24 fixed; 26 (pt "ordem de serviço") fixed in the strings (shown only with ?biz=taller-motos);
  29 fixed (not visible here).
