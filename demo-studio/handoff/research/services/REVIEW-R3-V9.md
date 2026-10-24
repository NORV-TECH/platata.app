# REVIEW-R3-V9: services demo V9 "Reservas en línea" (client's phone on the booking page + owner phone)

Reviewer: independent pass, 24 Oct 2026. App READ ONLY at `/home/user/suma-plus-android`, **37db6d6c** (`git rev-parse HEAD`).
I edited only this file. Scratch: `/tmp/claude-0/-home-user/96476401-bbfa-5681-be22-524ea1c374e3/scratchpad/rev-v9/`.

Method
- Read: `public/store/app.js` (services view, `viewWhen`, `placeBooking`, `viewDone`, `render`), `logic.js` (dayStrip, slotsForDay,
  dayTimeIn, formatClock, phonePrefill, isBookable/isOrderable), `store.css`, `strings.js`, `money.js`, `online-store-hours.js`, `whatsapp.js`;
  `functions/storefront-projection.js` (sellContext, omissionReason, includedOptionNames, project); `functions-public/index.js` `submit`
  (:187-340); app: `OnlineOrderAlerts.kt`, `NavigationEventEffects.kt`, `AppointmentDetailScreen.kt`, `ServicesTransactionsScreen.kt`,
  `OnlineOrderUi.kt`, `AppointmentText.kt`, `WhatsappOpen.kt`, `WhatsappUtils.formatWhatsappForReading`, `WhenPicker.kt`, `PlatataApp.kt`
  (bottom-bar badge), `OnlineOrder.kt`, `BranchSnapshotStore.kt`, `PosDao.kt`, `GuideActions.ensureResearchedOptions`,
  `ResearchedOptionStates.kt`, `SupportStrip.kt`, `ReportLevels.kt`, `NavLabels.kt`, `Theme.kt`/`Color.kt`, `AppLanguage.kt`. Diff
  d30ffa1..37db6d6c of all of them: only AppointmentDetailScreen (R2-2 items 12/13/26), ServicesTransactionsScreen (items 12/24/33/4),
  OnlineOrderAlerts (R2-4 L4 "1 servicio"), AppointmentText (pt) and a comment in strings.js moved. The page already follows all of them.
- Every key of the page's `STR` (35 keys) against values / values-es / values-pt-rBR, and `WS` (26 keys) against `strings.js` es/pt:
  **all match**. `MT` = `money.js` CO/MX/BR/PE.
- `check_demo.py servicios/V9 CO:es BR:pt MX:es`: **OK / OK / OK**. Looked at every demo screenshot of the three runs. (The rings on
  demo-04 and demo-05 sit half-way between two targets: that is the ring's 0.25 s `transition`, caught by the screenshot. Measured after
  700 ms the ring is on the right element at every step: not a page bug.)
- `validate_scripts.py V9`: steps 9, es 440 / pt 453, OK. Page `VOICE` == json byte for byte. Beats 9 == steps 9 for CO, BR and MX.
  All subtitles <= 60 chars. tú / você. Last lines "Así recibes reservas en línea con Platata." / "Assim você recebe reservas online com o Platata.".
- No clips exist: video mode with `dur` = 0.067 s per character, frames at 5 / 50 / 95 % of every line (es:CO, pt:BR, es:MX).
- `?biz=unas|veterinaria|taller-motos` CO es and `taller-motos` BR pt, tapped through.
- No recorded video exists, so `cut_price_scan.py` cannot run. The web cards print whole prices ("Desde $ 248.000", "A partir de R$ 125,00").

## Summary

| Feature | es (CO) | pt (BR) | MX es (render only, no -MX json needed) |
|---|---|---|---|
| V9 Reservas en línea | 2 MUST, 8 nice | 3 MUST (1 blocked by the app), 8 nice | same MUST 1 and 2; card 1 shows the app's wrong "Desde" (MUST 3) |

No `V9-MX.json` is right: Mexico has the same screens and words (no card on a booking in any country: `functions-public/index.js:212`,
`CardCountryGate.forOnlineStore` MX = NONE; MX is not free, so the hop note's lock sentence is right; money "$140.00", phone read
"+52 334 567 8901" = `formatWhatsappForReading` 3-3-4). No line says an amount.

### Verified true (what the screens and the voice claim)
- Booking page: shop name #007AFF 24/900 + `shop_confirms`; tabs Servicios | Productos (to_go is seeded, settings default `["to_go"]`
  `storefront-projection.js:60`, products published); "Incluye: …" = names of the free, not-ask option sets (`:214-234`; INCLUIDO sets
  are 0, COBRA MÁS sets are priced or `askAtTill`, `ResearchedOptionStates.kt:16-52`, `GuideActions.kt:763-790`); card colour #2196F3 at
  12 % / 35 % (`Product.kt:22`, `app.js:367-370`).
- A service with no modifier sets goes straight to "¿Cuándo?" (`app.js:383-396`); the day strip is 21 days from today, Sunday struck at
  0.45 opacity (`app.js:441-450`); the grid is built on the service's `durationMin` (30) (`app.js:400-405`), past and < 1 h slots
  dashed and struck (`online-store-hours.js:139`, `logic.js:446-454`): today 09:00-13:30 dashed at 12:41 is exact. Phone prefilled "+57 "
  (`app.js:131`, `logic.js:278-281`). Button "Elige una hora" -> "Reservar vie 23 14:00" -> "Enviando…" (`app.js:485-490`). Done:
  "Reserva solicitada", "vie 23 · 14:00" (`logic.js:480-484` with readyAt = scheduledFor, `index.js:329`), "RESERVA #3FA9C1",
  `shop_confirms`, "Hacer otra reserva" (`app.js:968-977`).
- Nothing is charged online for a booking in any country (`index.js:212`); "Pagas en el negocio · $ 25.000" (`app.js:481-484`) for a
  FIXED service. The 14:00 slot also passes the server's check on the shop's `slotMinutes` (`index.js:231-239`).
- Owner phone: the booking is PENDING with `scheduledFor` (`index.js:282-326`); no bottom-bar badge for a booking
  (`OnlineOrder.waiting` excludes bookings, `OnlineOrder.kt:43-44`); the Agenda row: "Viene" + hour only, typed name + EN LÍNEA,
  "service · +57 320 555 7788", price (`ServicesTransactionsScreen.kt:262-287, 389-476`); no "Activar avisos" line (permission
  granted, `OnlineOrderUi.kt:146-159`). Alert title `online_alert_booking_title` + "vie 23 · <time>", body "<typed name> · 1 servicio ·
  #3FA9C1", kind BOOKING (`OnlineOrderAlerts.kt:62-67, 134-166`). Tap -> `AppointmentDetail` over the Agenda
  (`NavigationEventEffects.kt:59-68`); Back from the page returns to the Agenda.
- Appointment page order and words: SumaTopBar typed name; Servicios / line + money / "… · Dura 30 min"; Cobrar / Reprogramar / Cancelar
  cita (no "No asistió": the hour is tomorrow); "¿Cuándo viene?" "Mañana · 2:00 p. m. | Cambiar"; "2:00 p. m. → 2:30 p. m. · Dura 30 min";
  EN LÍNEA + `online_booking_confirm`; TextButton "WhatsApp · +57 320 555 7788"; "¿Para quién?"; Guardar; Support strip (LEVEL_2)
  (`AppointmentDetailScreen.kt:200-466`). The WhatsApp button opens the client's chat with `appt_wa_booked` in the shop's language, day
  "viernes 23" / "sexta-feira 23" and "14:00", signed after one blank line (`AppointmentText.kt:30-62, 84-98`; WASIG-1).
- Hard rules: no US/CA content, no French, light theme, no card logos, no fee, no card scan, no product brand. (WhatsApp's own screen is
  drawn, as in V3/V4/V5 and the restaurant pages.)

### Voice vs screen (0.067 s/char; taps measured in video mode)

| # | Line (es) | es CO s | on screen | pt BR s |
|---|---|---|---|---|
| 1 | Tu cliente abre tu página… elige un servicio. | 0.6-4.5 | menu; tap card +2.4 | 0.6-4.6 same |
| 2 | Elige el día y una hora dentro de tu horario. | 4.8-7.9 | day +0.9, 14:00 +1.9 | 4.9-8.4 same |
| 3 | Escribe su nombre y su WhatsApp. | 8.2-10.3 | typing +0.9 … +2.9 | 8.7-10.6: number typed after the line (nice 2) |
| 4 | Reserva sin pagar nada en línea: paga en tu negocio. | 11.9-15.4 | sum row 0-1.1, Enviando, done from +2.0 (nice 3) | same |
| 5 | Tu teléfono te avisa: nueva reserva en línea. Tócala. | 16.6-20.1 | hop, Agenda +0.8, alert +1.5, tap +3.5 | same |
| 6 | Ahí dice En línea: confirma la hora con el cliente. | 21.0-24.4 | appointment page; WhatsApp opens +2.8 (nice 5) | same |
| 7 | WhatsApp abre su chat con el mensaje listo. Envíalo. | 24.7-28.2 | chat with text; sent +2.5, before "Envíalo" (nice 4) | same |
| 8 | Vuelve: la cita ya está en tu Agenda, marcada En línea. | 28.6-32.2 | back +0.8, Agenda +2.1 with the EN LÍNEA row | same |
| 9 | Así recibes reservas en línea con Platata. | 33.4-36.2 | end card | 34.4-37.6 |

Every line is said over the screen it describes; the four timing items below are polish.

---

## V9 findings

### MUST 1 (CO es, BR pt, MX) — the booking page lists the services in the wrong order
- Where: page line 269-272 (`PAGE_SVCS` sorted by the trade catalogue `CAT.indexOf`), comment "snapshot.products order = the order the
  setup saved them". Visible on beat 1 (menu) in every video.
- Evidence: the reference snapshot reads the products with `productDao.getAllProductsSync()` (`BranchSnapshotStore.kt:99`) =
  `@Query("SELECT * FROM products ORDER BY name ASC")` (`PosDao.kt:353-354`); `project()` keeps that order into `doc.services`
  (`storefront-projection.js:269-301`) and `viewServices` draws `doc.services` in order (`app.js:379`). The sibling page VS20 already
  draws it so (`demos/servicios/VS20.html:290-291`, `byName`), and REVIEW-R3-VS20 verified it. So today V9 and VS20 show the same page in
  two different orders.
  - App's CO first screen: Aplicación de tinte, Balayage, Cepillado, Corte de caballero / hombre, Corte de dama, Corte de niño / niña.
    V9 now: Corte de dama, Corte de caballero, Corte de niño, Cepillado, Aplicación de tinte, Retoque de raíz.
  - BR: Balayage, Coloração completa, Corte feminino, Corte infantil, Corte masculino, Escova (V9: Corte feminino, Corte masculino, …).
- Fix: `const byName = (a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0;   // ORDER BY name (SQLite BINARY), PosDao.kt:353`
  `const PAGE_SVCS = V.services.slice().sort(byName);` drop `CAT`, and rewrite the comment (cite `BranchSnapshotStore.kt:99`,
  `PosDao.kt:353`). The booked card then sits at #4 (CO, MX) / #5 (BR), still on the first screen. No voice change. With the fix, CO's
  first screen no longer shows a wrong "Desde" (Retoque de raíz and Peinado social move to cards 10 and 9, below the fold).

### MUST 2 (all) — `?biz=taller-motos` is stuck at step 1 (and `?biz=veterinaria` will be after MUST 1)
- Where: `render()` page line 485: only the "¿Cuándo?" view goes through `scrolled()`; the menu never scrolls to the card to tap.
  Taller: "Revisión de gases (prep. tecnomecánica)" is card 12 of 12 today (card 7 after MUST 1), below the fold: no ring, a tap anywhere
  only nudges the hint, the demo never advances (CO es and BR pt runs: `si` stays 0). Veterinaria works today (Vacunación is card 3) but
  becomes card 10 with the name order. In a video the tap would land off screen.
- Fix: in `render()`, cust branch: `if(st.w === "menu") return scrolled(h, \`[data-t="w-svc-${SVC.id}"]\`);` (the helper already
  measures `.wscr` / `.wscr-in`, which `webMenu` has). Peluquería stays unscrolled (the card is in view, `scrolled` returns the html
  unchanged).

### MUST 3 (BR pt video; MX render) — APP money: a "Desde" card shows the first stored choice, not the cheapest (builder's problem 1, VERIFIED; round-3 item 1 "BLOCKS A DEMO")
- Where (after MUST 1): BR card 2 "Coloração completa · A partir de R$ 125,00" on beat 1 (0.6-4.6 s), while the shop's till and Mis
  serviços say "A partir de R$ 80,00". MX card 1 "Aplicación de tinte · Desde $430.00" vs $280.00. CO: the two wrong cards (Peinado social
  $ 90.000 vs $ 55.000, Retoque de raíz $ 70.000 vs $ 40.000) are off screen once MUST 1 is done; with today's page order Retoque de raíz
  IS on the CO first screen.
- Evidence: `storefront-projection.js:145-149` (first variation = first row by id), `:279` `const v = firstVariation.get(it.id)`,
  `:291` `price: v.price`; `app.js:358` prints `service_from` with it. The till uses the lowest priced choice
  (`sync/ServicesMenuRule.kt:37-42`, round 2 item 9). The page copies the web page faithfully (`pagePrice`, line 273).
- Fix: record CO only (after MUST 1/2); hold BR until the coder publishes the lowest priced choice and the function is deployed; then
  change page line 273 FROM branch to `s.price` (the kit's `price` for "from" is already the lowest choice) and update the comment.

### nice 1 — beat 3 says "WhatsApp", the field says "Celular (con código de país)"
- `strings.js:49` / `:176`; page line 386. The number IS the client's WhatsApp (stored as `customerWhatsapp`, `index.js:303`; the shop's
  only reply road is the WhatsApp button), so the line is true, but the word is not on screen. Keep, or ask the coder (app bug A3) to label
  the field "WhatsApp (con código de país)". No re-voice needed if the app changes.

### nice 2 — pt beat 3: the phone number is typed after the line ends
- pt line 1.88 s; the name (13 chars × 60 ms) ends ~+1.7 s, the number is typed +2.0 … +2.8 s (page lines 510-511: 60 ms/char,
  250 ms and 350 ms pauses). "e o WhatsApp" is said over the name. Fix: `E.type(…, 35)` for both fields and the pause 250 → 120.

### nice 3 — beat 4: "paga en tu negocio" is said over "Reserva solicitada"
- The "Pagas en el negocio · $ 25.000" row is on screen only for the first 1.1 s of the line (tap at +1.1, done at +2.0); "paga en tu
  negocio" starts at ~2.3 s (es) / 2.4 s (pt). Fix: step at line 512 `wait: 0.3` → `wait: 1.5`, and the hop delay `E.after(1800 …)`
  (line 513) → `1000` so the silence before beat 5 does not grow.

### nice 4 — beat 7: the message is sent before "Envíalo" / "Envie"
- Tap at +2.5 s; "Envíalo" starts ~2.9 s (es), "Envie" ~3.35 s (pt). Fix: line 518 `wait: 1.6` → `2.2`.

### nice 5 — beat 6: WhatsApp opens 0.6 s before the line ends
- "…con el cliente" is said over the WhatsApp chat (tap at +2.8 of 3.42 s). Fix: line 517 `wait: 2.0` → `2.4`.

### nice 6 — the booking page's set-up disagrees with VS20
- VS20 (the video that turns this page on, same Peluquería Carolina) shows "Todos los días 9:00 – 18:00 · 20 min por cita"; V9 strikes
  Sunday ("dom 25", line 268) and assumes `SHOP_SLOT = 30` (line 267). Fix: `closedDay = () => false` and `SHOP_SLOT = 20`. 14:00 stays on
  both the 30-min service grid and the server's 20-min check. (The struck day disappears from the strip; nothing else moves.)

### nice 7 — the alert's time may read "14:00" on a real Colombian phone
- `OnlineOrderAlerts.kt:134-137` uses `DateFormat.getTimeFormat(context)` (the phone's 12/24 setting); the app's locale is the bare tag "es"
  (`AppLanguage.kt:41`), whose Android locale default is 24-hour, so with "Usar el formato local" the title reads "Nueva reserva en línea ·
  vie 23 · 14:00". The page prints "2:00 p. m." (`fmtTime`, line 247), which is what a phone set to 12-hour shows. Device-setting dependent:
  either is true; "14:00" would also match the web page and the WhatsApp text. App inconsistency listed as A2.

### nice 8 — small honesty polish
- The notification's small icon is drawn as the coloured potato; the app posts the full-colour launcher mipmap as small icon
  (`OnlineOrderAlerts.kt:168,172`), which Android draws as a plain grey shape (A1).
- "Toca la flecha de atrás" targets WhatsApp's own header arrow (line 519); in WhatsApp that arrow goes to its chat list, the way back to
  Platata is the phone's Back (same in V3/V4). Optional hint "Vuelve a Platata".
- The Agenda shows the online client twice: "Luis · Corte de caballero" today 6:30 p. m. (a kit booking, after the 18:00 close the page
  offers) and "Luis Torres EN LÍNEA" tomorrow. Reads odd but not false.
- Lines 2 and 4 ("Elige el día…", "Reserva sin pagar…") use the client as subject in the 3rd person, which sounds like an order to the owner.
  Only if re-voicing anyway: "Él elige…" / "Reserva sin pagar…" → "Reserva y no paga nada en línea…".
- pt hop note "enquanto o Platata está aberto" while the app's own pt string says "Deixe a Platata aberta" (`sell_online_keep_open`); the
  videos use "o Platata" everywhere, keep.

### Builder's known list (verified)
1. "Desde" = first stored choice: VERIFIED (`storefront-projection.js:145-149, 279, 291`; `app.js:358`); also the sum
   (`app.js:483`, `bookingMinor`) prints that price as if fixed (seen with `?biz=veterinaria`: "Pagas en el negocio · $ 32.000" for a
   "Desde" service). = round-3 item 1.
2. Server checks on `store.slotMinutes` (`index.js:231, 239`; `doc.slotMinutes = settings.prepMinutes`, projection `:389`, default 20
   `:59`) while the page builds on `svc.durationMin` (`app.js:401-405`): VERIFIED. Not hit by the demo (14:00).
3. `.tnote` no side padding (`store.css:109`): VERIFIED, visible on every "¿Cuándo?" frame ("Incluye: Lavado", "El negocio te confirmará la hora.").
4. pt "Reservar sex., 23 14:00" (`app.js:409-412, 488`): VERIFIED; the done line "sex., 23 · 14:00" has the same comma (`logic.js:480-484`, A4).
5. Tab title "… · Tienda en línea" (`app.js:990`, `strings.js:11`) and the always-blue name (`store.css:23`): VERIFIED; neither is on screen.

### Round-2 items seen
- FIXED: "1 servicio" in the alert body (R2-4 L4, `OnlineOrderAlerts.kt:157-163`); readable phone and one time on the Agenda row (R2-2
  items 12/24); pt WhatsApp text (item 3, `appt_wa_booked` pt); alert stopped when the page opens (`AppointmentDetailScreen.kt:97-102`).
- NOT FIXED on the web page: item 9 (MUST 3).

---

## App bugs not in the builder's list
- **A1 (small)** — Every notification posts `setSmallIcon(R.mipmap.ic_launcher)` (`ui/pos/OnlineOrderAlerts.kt:168,172`,
  `work/AlertNotifier.kt:114,181`, `work/HostStoppedAlert.kt:44`, `work/AgendaEdificioWorker.kt:232`, `sync/SyncHostService.kt:925`,
  `MenuImportService.kt:202`): Android uses only the icon's alpha, so the status bar and the alert header show a grey blob. Fix: one
  monochrome `ic_stat_platata` vector for all eight.
- **A2 (small)** — The booking alert's time follows the phone's 12/24 setting (`OnlineOrderAlerts.kt:134-137`), every other booking screen
  prints `fmtTimeCO` (12-hour in es, `WhenPicker.kt:76-93`); with the app tag "es" a default phone gets "14:00" in the alert and "2:00 p. m."
  on the page it opens. Fix: use the same `fmtTimeCO(minsOf(millis))` in `bookedWhen`.
- **A3 (small)** — The booking page asks for a "Celular (con código de país)" (`public/store/strings.js:49, 176, 303`) but the number is used
  only as the client's WhatsApp (`functions-public/index.js:294-296, 303`; the shop answers with the WhatsApp button). A client who types a
  non-WhatsApp number never gets the confirmation. Fix: "WhatsApp (con código de país)" / "WhatsApp (com código do país)".
- **A4 (small)** — `logic.js:480-484` `dayTimeIn` prints pt "sex., 23 · 14:00" on "Reserva solicitada" (same Intl short form as round-3
  item 6). Fix both with one pt-safe day label.
