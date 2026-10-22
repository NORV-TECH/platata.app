# REVIEW-AGENDA: services V3, V4, V5, VS21 (Peluquería Carolina)

Independent reviewer, 22 Oct 2026. App read at /home/user/suma-plus-android, sim/usa-canada 73c65f0 (clean tree). I edited no file except this one.

How I checked:
- I read the four pages, the four jsons and the build notes.
- Every screen was checked against its composable: BookingScreen, WhenPicker, AppointmentDetailScreen, ServicesTransactionsScreen, HomeScreen, CartActions, CheckoutPayBlock, AppointmentText, OfflineStrip, and the strings in values / values-es / values-pt-rBR.
- `check_demo.py` printed OK for all 12 runs (V3, V4, V5, VS21 × CO:es BR:pt MX:es). I looked at the screenshots.
- `validate_scripts.py`: beats == json steps for all 4 pages (8 / 7 / 9 / 9). Characters: V3 341/343, V4 316/324, V5 340/342, VS21 368/367. Every line is ≤ 60 characters. The page VOICE copies are identical to the jsons.
- Video timelines: I drove `__frame(t)` with beat durations estimated from line length (~14.5 chars/s). For each run I logged what is on screen under each subtitle and grabbed frames where the two might not match.
- `?biz=` veterinaria, taller-motos and unas, CO:es, all 4 pages, plus BR unas (V3) and BR taller-motos (V5): every run reaches the end with no console error.

**No -MX files is correct.** There is no `values-es-rMX`, and none of the booking, agenda or appointment code branches on MX. In Mexico only the money ($140.00), the names, the phone groups and VS21's card button change. VS21's card button is Stripe, primary, "Tarjeta · Sin conexión". The es lines fit those screens.

**V5's 2:20 p.m. clock is right and needed.** AppointmentDetailScreen.kt:149-151 shows "No asistió" only when the booking's minute is at or before now. The first booking is at 2:00 p.m. The agenda is the same as V4's (10 bookings, the V3 booking included).

## Summary
| Feature | es CO | pt BR | es MX |
|---|---|---|---|
| V3 Agendar | 2 MUST, 3 nice | 2 MUST, 4 nice | 2 MUST, 3 nice |
| V4 Agenda | 1 MUST, 1 nice | 1 MUST, 2 nice | 1 MUST, 2 nice |
| V5 Mover / no asistió | 2 MUST, 2 nice | 2 MUST, 3 nice | 2 MUST, 2 nice |
| VS21 Sin internet | 1 MUST, 2 nice | OK (2 nice) | 1 MUST, 2 nice |

---

## V3: Agendar una cita

**M1. MUST, all countries. The "¿Quién lo hace?" list is in the wrong order.**
- The page lists Nadie, Carolina Restrepo, Carla Gómez, Andrés Ruiz (owner first; V3.html:291).
- The app lists the employees A–Z by first name: BookingScreen.kt:250-261 reads `viewModel.employees` = `SELECT * FROM employees ORDER BY preferredName ASC` (PosDao.kt:1399).
- So on the phone the list is: **Nadie, Andrés Ruiz, Carla Gómez, Carolina Restrepo**. BR: Nadie (Ninguém), André Lima, Carla Santos, Carolina Souza. MX: Andrés Martínez, Carla Hernández, Carolina López.
- Build note V3.md §4 ("owner row first, SeedStore.kt:120-134") is wrong. SeedStore only inserts the owner; it does not order the list.
- Fix in the shared block of all 4 pages (V3.html:291/296, V4.html:292/297, V5.html:295/300, VS21.html:338/343):
  - `const TEAM = [C.owner].concat(C.staff.map(s => s.name)).sort((a,b) => a < b ? -1 : a > b ? 1 : 0);`
  - `V3_BOOKING.who: C.staff.length ? C.staff[C.staff.length-1].name : C.owner`. This keeps "Atendió: Andrés Ruiz" in V4/V5.
- And V3.html:574 `PERF = TEAM.indexOf(V3_BOOKING.who)`. The tap then lands on the 2nd row (Andrés), not the last.

**M2. MUST, all. Voice line 3 talks about the busy slots after they have disappeared.**
- Line 3: "Escoge el día y la hora. Lo ocupado dice de quién es." (pt "O ocupado mostra de quem é.").
- The 10:00 tap lands about 2.3 s into the line and collapses the picker (WhenPicker.kt:304-307: `if (!forceOpen) open = false`). The slots marked "Marcela" (pt/MX "Mariana") vanish.
- So "Lo ocupado dice de quién es" plays over just "sáb 24 de oct · 10:00 a. m. · Cambiar". My frame at 11.5 s of the CO timeline shows only that row under this subtitle.
- Fix V3.html:612 (the `arr-slot-${BOOK_MIN}` step): add `wait:1.6`, so the time is picked after the sentence.

**n1. nice, all. Voice line 2: "La caja está cerrada, y agendas igual. Toca Agendar."**
- The Agendar tap lands at 0.8 s. The amber "Caja cerrada" bar is gone for the rest of the sentence, which plays over "¿Cuándo?".
- Fix V3.html:609: add `wait:2.0` to the `book` step.

**n2. nice, all. Voice line 7 ends on "Envíalo / Envie".** The send tap happens at 0.8 s, so the message is already a sent bubble. Fix V3.html:624: add `wait:2.2`.

**n3. nice, all (cross-page). The register is closed in V3 but open in V4 at the same moment.**
- V3 shows the register closed at 12:41.
- V4 is the same phone, at the same 12:41, and its agenda already holds V3's booking, yet its till shows the register open (no bar).
- The kit also has sales this morning.
- Fix: put V3 before opening. V3.html:594 `clock:"8:05"` and :575 `NOW = 8*60+5`. Booking Saturday is unaffected; only the WhatsApp time stamp changes.

**n4. nice, pt.** The WhatsApp text reads "seu agendamento em Salão da Carol". Portuguese needs "no Salão da Carol". This is the app's string (see app bugs), and it is true to the app. Keep it, or wait for the string fix.

Verified true:
- With the register closed the tile is let through for a services shop (CartActions.kt:182-183, 196). Agendar is not gated (HomeScreen.kt:813-818). Only Cobrar asks for an open register (:707-711).
- Option sheet rows and switches (OptionSelectionSheet.kt:175-180, 251-258). "Agregar a la venta · $ 25.000".
- Only "¿Cuándo viene?" for a salon (TradeFamily.kt:131-138).
- The red "Elige para quién", and Guardar dim until a client is picked (BookingScreen.kt:274-292).
- "Guardar y avisar por WhatsApp" only appears once the client has a number (:334-368). WhatsApp opens after the save job, over the till that shows "Agendado para sáb 24 de oct · 10:00 a. m. · Ver agenda" (:357-365, HomeScreen.kt:312-326).
- WhatsApp text es/pt: AppointmentText.booked + signature. Saturday reads "no sábado", which is correct pt.

## V4: La agenda

**M1. MUST, all (also V5). The phone on the appointment page is formatted on the page but raw in the app.**
- The page shows "Ana · +57 300 123 4567". The app shows **"Ana · +573001234567"** (BR "+5531912345678", MX "+523312345678").
- Why:
  - AppointmentDetailScreen.kt:92-93 builds `rawTel = "+" + whatsappNumber`. `phoneNumber` is always null: CustomerCrmScreen.kt:895 saves `phoneNumber = null`, and ServicesTransactionsScreen.kt:223-224 says so too.
  - formatWhatsappForReading returns any input that holds a non-digit unchanged (utils/WhatsappUtils.kt:133).
  - So the formatter never runs. Item 51 is not fixed on this page either.
- Page fix (until the app is fixed): shared block V4.html:557 / V5.html:560 / V3.html:556 / VS21.html:603: `c.waRead` → `c.waRow`. Also fix the comment at V4.html:262 (and the copies).
- Better: the coder strips the "+" (app bug 1), then keep the page as it is.

**n1. nice, all.** The search is typed with no keyboard on screen. A real phone keeps it up through lines 4-5 and it covers the lower half. Juan's 3 results still fit above it, so this is only a look issue.

**n2. nice, pt/MX (kit data).**
- Outside Colombia, Juan's 3:30 booking is tinte choice 1. BR reads "Coloração completa (Sem produto (cliente traz a tintura))": nested brackets, shown in the search result (line 5).
- MX reads "Sin producto (la clienta trae el tinte)" for a man.
- Fix in kit/services-data.js BOOK.peluqueria[1] (the owner's call, not this page): `["tinte-completo",0]` outside CO, or another service.

Verified true:
- The bottom tab is "Agenda" for services (NavLabels.kt:22-27). The screen opens on the Agenda half (ServicesTransactionsScreen.kt:99). "Ventas | Agenda 10".
- Day headers Hoy / Mañana / "sáb 24 de oct"; the row prints the raw "+57…" (:245-284, 369-476).
- Searching "310" matches the WhatsApp digits and finds only Juan's three bookings (:218-227, 581-585). BR types "3198", MX "332".
- Appointment page in the app's order: "Corte de dama · Dura 40 min" (stored minutes), "Atendió: Carla Gómez", Cobrar / Reprogramar / Cancelar cita, no "No asistió" at 12:41, "2:00 p. m. → 2:40 p. m. · Dura 40 min" (:216-341).
- Lines 2 and 3 describe exactly what is on screen.

## V5: Mover una cita, no asistió

**M1. MUST, all.** The same raw-phone problem as V4 M1 on the appointment page: Luis / Lucas / Ana, lines 1-3 and 6-7. Same fix.

**M2. MUST, pt (BR video). The no-show half shows a flow the app does not do.**
- After "Sim, não compareceu" the app always opens the client's WhatsApp chat (AppointmentDetailScreen.kt:492-506, `openClientChat`). There is no setting to stop it (utils/WhatsappOpen.kt:27-33).
- That chat holds the broken text "Olá Ana, em Salão da Carol não pudemos te atender **no quinta-feira** 22 às 14:00…".
- The page (V5.html:628) goes from the dialog straight to the agenda. A Brazilian owner who copies the video gets WhatsApp popping up with bad Portuguese.
- The move half is true: plain "Salvar" exists and opens nothing (:429-433).
- Beats are 9 = 9 json steps. Lines 4/5/7 pt describe the screen ("Pronto: ele passa para amanhã" over the agenda with Lucas under Amanhã 18:00).
- So the BR video is complete, but its no-show half is not true.
- Fix: do not record V5 pt until values-pt-rBR `appt_wa_when` is fixed (builder's V5.md §3). Then:
  - drop the `PT` branches (V5.html:210 comment, :580, :616-621, :627-633) so pt runs the es flow;
  - set the pt json lines: 4-guardar "Toque em Salvar e avisar pelo WhatsApp." / 5-aviso "A mensagem já vai escrita. Envie." / 8-whatsapp "E você escreve pelo WhatsApp. Envie.".
- If BR cannot wait: ship a V5-BR.json with only the move (1-cita, 2-reagendar, 3-hora, 4-salvar, 5-fim) and stop the BR page after the agenda beat.

**M3. MUST, es CO/MX. Voice line 7 plays over WhatsApp instead of the dialog.**
- Line 7: "Confírmalo: sale de la agenda, sin cobrar nada."
- The confirm tap lands at 0.8 s and WhatsApp opens at once. The whole sentence plays over the WhatsApp chat (my frame at 22.5 s); the dialog that says it is gone.
- Fix V5.html:630 (the es `dlg-yes` step): add `wait:2.4`.

**n1. nice, es.**
- The demo hint "Toca Mañana" (V5.html:611) points at the day chip "vie 23 oct", while a "Mañana" (morning) pill sits right under it.
- Fix: the hint names the chip, `tapHint(DOW[dayDate(MOVE_DAY).getDay()]+" "+dayDate(MOVE_DAY).getDate(), …)` → "Toca vie 23" / "Toque em sex 23".

**n2. nice, all.**
- The yellow flash on the moved row (`.arow.flash`, back(st, MOVE_ID) at V5.html:605/617/622) is not app behaviour: BookingRow has no highlight. In the checker it stays yellow until the next tap.
- Fix: `back(st)` without MOVE_ID, or accept it as an emphasis everyone knows is not the app.

**n3. nice, pt.** "Movida de Hoje · 18:30 para Amanhã · 18:00" is the app string. "Agendamento" is masculine, so it should be "Movido" (app bug 3).

Verified true:
- Reprogramar = forceOpen. Picking a day keeps the hour, and the picker stays open (WhenPicker.kt:223-226, 304-307). The time period is chosen from the hour (:532-538).
- "Movida de Hoy · 6:30 p. m. a Mañana · 6:00 p. m." and the two buttons appear once the time changed (:424-456).
- "Guardar y avisar" opens the chat, then saves and goes back to the agenda (:441-454).
- Dialog title, body, "Sí, no asistió" in red and "Dejarla como está" (:486-510, 572-592).
- The no-show is stored apart (`noShow = true`).
- The es WhatsApp texts are word-for-word the app's.

## VS21: Funciona sin internet

**M1. MUST, es CO/MX. Voice line 7 talks about the card after the pay screen is gone, and "espera" is misleading.**
- Line 7: "Toca Exacto. La tarjeta espera a que vuelva el internet."
- The Exacto tap lands at 0.8 s. The clause about the card plays over "¡Venta completada!" (frame at 25.0 s); the "Tarjeta · Sin conexión" button is no longer on screen.
- "Espera" also suggests the charge is held. The app only says `pay_card_offline_explain` "Los pagos con tarjeta necesitan conexión a internet".
- Fix `features/VS21.json` 7-exacto es → "La tarjeta necesita internet. Toca Exacto." (42 characters). Copy it into VS21.html:263 VOICE.es.
- At VS21.html:670 the CARD_ON pt variant becomes "O cartão precisa de internet. Toque em Exato.".
- At VS21.html:693 add `wait:2.0` to the `exact` step.
- pt BR is fine: "Em dinheiro: toque em Exato.", and there is no card in Brazil.

**n1. nice, all.** The booking snackbar stays about 5.5 s in the video (line 5 plus the start of line 6). The app's lasts 4 s (`SnackbarDuration.Short`, HomeScreen.kt:318-321). This is acceptable; if wanted, set `st.snack=false` with `E.after(4000)` in the Guardar step.

**n2. nice, all (cross-page).**
- VS21's Saturday picker does not show V3's Juan 10:00, and at 12:41 its register is open while V3's is closed.
- Fix: `takenOn(BOOKINGS.concat([V3_BOOKING]), …)` (pass `list` in the bookingScreen call, VS21.html:653) and V3's clock change (V3 n3). Optional.

Verified true:
- "Sin internet" strip under the tabs (OfflineStrip.kt, HomeScreen.kt:692). Booking and saving are local.
- Offline card = muted "Tarjeta · Sin conexión" (CheckoutPayBlock.kt:445-448). "Exacto" short with a card, "Exato · R$ 40,00" without (:344-353). Stripe card primary in MX.
- No Save button for services. "Artículos (1) ›" is the app's (builder listed it).
- "¡Venta completada! / Recibiste $ 25.000".

## ?biz= (CO es, all 4 pages × veterinaria / taller-motos / unas; BR unas V3; BR taller V5)
- All runs reach the end with no errors or empty screens.
- nice (kit, not a video): BR unas option sheet shows "Decoração adicional, por unha · R$ 3,00 **por uña**" (Spanish).
  - The kit's `extras.per` is the catalogue's untranslated `per_unit` ("uña").
  - Outside Colombia the app never builds a per-unit add-on, because amounts are stripped and CatalogoInvestigadoATienda.kt:153 needs one.
  - Fix in the shared `optionSheet`: use `x.per` only when `CC==="CO"`.

---

## App bugs the builders did not list (73c65f0)
1. **small (item 51 not really fixed).** The appointment page prints the phone raw "+573001234567".
   - AppointmentDetailScreen.kt:92-101 passes "+digits" to formatWhatsappForReading, which returns anything holding a non-digit unchanged (utils/WhatsappUtils.kt:133).
   - Fix: `formatWhatsappForReading(rawTel.removePrefix("+"))`, or pass `customer.whatsappNumber`.
2. **small (pt).** appt_wa_booked / appt_wa_cancelled / appt_wa_no_show say "em %3$s" / "em %2$s" before the shop name: "seu agendamento em Salão da Carol", where Portuguese needs the article ("no Salão…") (values-pt-rBR/strings.xml:214, 216, 217).
   - Fix: "Olá %1$s, seu %2$s (%3$s) é %4$s (%5$s)." or "…seu %2$s com %3$s…". Fix it together with the `appt_wa_when` fix.
3. **small (pt).** agenda_resch_moved_line "Movida de %1$s para %2$s" reads as feminine, but "agendamento" is masculine (values-pt-rBR/strings.xml:251). Fix: "Mudou de %1$s para %2$s".
