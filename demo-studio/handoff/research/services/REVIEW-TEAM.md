# REVIEW-TEAM: services demos VS14 (team and PINs), VS15 (employee pay, not US), VS18 (combos), VS19 (second phone / connections)

Reviewer: independent pass, 22 Oct 2026. App read at `/home/user/suma-plus-android` sim/usa-canada **73c65f0**, clean tree.
I edited no file except this one. Running the checker rewrote the screenshots in `demo-studio/_check/`. My own frames are in
`/tmp/claude-0/-home-user-platata-app/96476401-bbfa-5681-be22-524ea1c374e3/scratchpad/review-team/`.

How I checked:
- **Strings.** I pulled `STR`/`PLU` out of each page and compared every key in every language with `values`, `values-es` and
  `values-pt-rBR`. There are **0 differences** (VS14 101 keys, VS15 98, VS18 102, VS19 121). The only words written by hand
  are "+ Nuevo/+ Novo", which equal `common_new_short`, plus the demo's hints, cards and hop notes.
- **Checker.** `check_demo.py servicios/VSn CO:es BR:pt MX:es` gave **12/12 OK**. `validate_scripts.py VS14 VS15 VS18 VS18-MX VS19`
  gave OK for all five: beats == steps (7, 9, 9, 9 and MX 9). All subtitles are ≤ 60 characters.
- **Video timeline.** I played each video with `dur=` set from the script lengths (about 14 chars/s + 0.6 s). I took frames at
  10 %, 55 % and 95 % of every line for CO es, BR pt and MX es (VS18-MX, VS19 MX).
- **Scripts.** es 396 / 515 / 433 / 509, pt 447 / 546 / 469 / 538, VS18-MX 451. All are ≤ 550. tú and você are used correctly.
  Each last line is "Así … con Platata." / "Assim … com o Platata.". There are no greetings or filler.
- **`?biz=`.** I ran veterinaria, taller-motos and unas on all four pages, in CO and BR, in video mode. **VS15 + taller-motos
  crashes.** Every other combination finishes every step with no errors.
- **Hard rules.** There is no US/CA script and no Stripe, price, deposit or card setup. Nothing is in French, and the theme is
  light only. There is no Visa or Mastercard logo, no card scan, no fee in Mexico and no fake AI people. The names on screen
  that look like brands come from the app's own strings: WhatsApp and Google Play.

## Summary

| Feature | es CO | pt BR | MX es |
|---|---|---|---|
| VS14 Equipo y PIN | **4 MUST**, 4 nice | **4 MUST**, 4 nice | no -MX: same page, same 4 MUST |
| VS15 Pago a empleados | **3 MUST** (1 is page-wide: `?biz=` crash), 3 nice | **3 MUST**, 3 nice | no -MX: same page |
| VS18 Combos | OK (4 nice) | OK (5 nice) | VS18-MX OK (3 nice) |
| VS19 Otro teléfono | **1 MUST**, 6 nice | **1 MUST**, 6 nice | no -MX (MX pays like CO, same words): same 1 MUST |

Two things the caller asked me to confirm:
- **VS19's free and paid rules are right for every country.** `ConnectionAllocator.allocate` (sync/ConnectionAllocator.kt:51-72)
  includes the owner's phone and the oldest device. Every later device takes a paid connection (`PaidConnectionsStore`, steps
  0..8 from Play). The store opens only when a paid connection is used (`storeOpen = take >= 1`). The only free countries are
  `Entitlement.FREE_COUNTRIES = setOf("US","CA")` (sync/Entitlement.kt:22), so Mexico and Brazil pay like Colombia. No price is
  drawn anywhere, which is honest: `ConnectionPricing` (billing/ConnectionPricing.kt) has only Play's prices and no constants,
  and `ConnMoneyBox` prints the labels alone when `unit == null` (ConnectionParts.kt:215-220). The page draws "1 de 2" → "2 de 2",
  "Todas tus conexiones están en uso.", "Incluida" for Carla, and the LOCKED store card (`StoreCardRule`, ConnectionsOverview.kt:182-186).
- **VS18 asks the second service's choice the way the app now does.** `ComboLinkedItemPickerSheet.kt:185-260` (`ComboPickQuestions`)
  shows "Atrás", the name, "Elige uno" and FilterChips with "Corto · $ 18.000". "Agregar" stays off until a choice is made, and
  there are no researched option sets, only LIST add-ons, of which the salon has none. The page matches (07-95 / 08-10 frames).
  The money is also right: (45.000 + 20.000) × 0.9 = **$ 58.500**, BR (70 + 32) × 0.9 = **R$ 91,80**, MX (250 + 110) × 0.9 = **$324.00**.
  Each is `grandTotal` through `KeypadCharge.totalWithTypedAmount` (HomeScreen.kt:704) with `ComboDiscount.discountForGroup`.

---

## VS14 Equipo y PIN: es 4 MUST, pt 4 MUST

What I verified as right:
- Panel "Equipo · 1 empleado · 1 en celular" (HomeScreen.kt:1776-1781).
- The list header is "Equipo (1)" with "+ Nuevo" (`common_new_short`, ListScreenHeader.kt:96). The search box is on its own line.
- `BusinessCodeCard` comes before the pay switch, which comes before the roster (TeamManagementScreen.kt:445-449).
- Rows show the job title line plus the job-title badge, the green "En su celular" pill and "Dueño" for the owner (:690-760).
- The form's field order is name, WhatsApp seeded with "+57", Cargo, 🔑 Permisos, ⚙️ Avanzado, then the PIN row (:1240-1435).
- Services get 8 chips: no stock chip (`offersStockPermission`) and no fiado chip (`fiadoEnabled`) (:1464-1535).
- The dialog reads "PIN nuevo", "PIN de Carla Gómez: 4821. Anótalo y dáselo…" (:356-370).
- Line 4 is true: "No asistió" and "Cancelar cita" need `canCancelReceipt` (AppointmentDetailScreen.kt:144-152, `ax_no_show`/`ax_cancel`).

1. **MUST, all countries: the new-employee form shows a PIN that the app does not show.** Page line 505 draws `PIN ••••` with
   "Mostrar". For a new hire the app passes `pin = if (pinChanged) pin else employee?.pin` (TeamManagementScreen.kt:1428-1429).
   `employee` is null there, so `EmployeeCodeRow` gets null. It then draws `team_code_none` ("Aún no hay PIN" / "Nenhum PIN
   definido ainda", :1609-1613) and no Show button (`if (code.isNotEmpty())`, :1634). This row is on screen during beats 2-4.
   **Fix:** on line 505, replace `<b>••••</b>` with `<b class="none">${esc(S("team_code_none"))}</b>` (bodyLarge 16, regular,
   `--m-onv`) and delete the `<span>${S("team_code_show")}</span>`. Add `team_code_none` to STR:
   es "Aún no hay PIN", pt "Nenhum PIN definido ainda", en "No PIN set yet".
2. **MUST, es + pt, line 2: the list is gone while the voice describes it.** The "+ Nuevo" tap lands at +0.8 s, but the line
   runs 4.7 s (pt 5.0 s). "Aquí ves a tu equipo y el código del negocio" is therefore spoken over the empty "Nuevo empleado"
   form (frames 02-10 and 02-55). **Fix:** on line 528, add `wait:2.8` to the "+ Nuevo" step, so the tap lands on "Toca Nuevo".
3. **MUST, es + pt, line 6: the PIN dialog closes before "Anótalo y dáselo".** The OK tap is at +0.9 s of a 7.0 s line
   (frame 06-55 shows the list with no dialog). **Fix:** on line 536, add `wait:5` to the OK step.
4. **MUST, es + pt, line 6 and subtitle: the voice promises that code + PIN is enough to join from her phone. The app refuses
   it.** The join matches only an employee the owner has switched on (`it.phoneRegisterEnabled`, PairingActions.kt:555). The
   owner does that with Conexiones › Conectar, which is VS19. Otherwise she gets "Ese código no coincidió. Revisa ambos números."
   (`employee_join_error_no_match`). VS14 never switches her phone on.
   **Fix:** voice es "Anótalo y dáselo. Para que entre desde su teléfono, conéctala en Conexiones."
   / pt "Anote e entregue. Para ela entrar pelo celular, conecte em Conexões.".
   Subtitle (line 519) es "Anótalo y dáselo. Su teléfono: en Conexiones" / pt "Anote e entregue. O celular dela: em Conexões".

nice:
- es + pt, line 1: the "Equipo" tap is at +0.8 s of a 2.5 s line. Add `wait:1` (line 527).
- Line 5, "Su PIN se crea solo", plays while the row (after fix 1) reads "Aún no hay PIN". Better: es "Toca Guardar: Platata le crea
  su PIN." / pt "Toque em Salvar: o Platata cria o PIN dela.".
- The business code "K7Q2M9XD4P" is a shape the app cannot make. `generatePairingToken()` is a stripped UUID, `take(10).uppercase()`,
  so it holds only 0-9 and A-F (PlatataRepository.kt:58-59). Use e.g. `"7C4E91A2B0"` here (line 472) and in VS19 (line 489).
- `?biz=taller-motos` (not recorded): when OLD is null, the page hides the code card (line 487). The app always shows it on the
  owner's phone (`TeamBusinessCode.mayShow`, :276), with `team_business_code_none` when there is no register yet
  (BusinessCodeCard.kt:50-55). Render that text instead of nothing.

## VS15 Pago a empleados: es 3 MUST, pt 3 MUST

What I verified as right:
- The switch is drawn in every country (:449, :900).
- `EmployeePayConsentScreen` has the 📅 🔔 ⏻ rows (the last on amber), "Listo, entiendo" and "Ahora no".
- Amount entry: a field under each payable person, the red `employee_pay_needs_all`, "Activar" and "Cancelar" (:420-600).
  When the feature is on, each amount shows with a pencil, plus the "Meses anteriores ›" bar.
- The ask is a FullScreenDialog over the Caja with no back (HomeScreen.kt:1396-1412). "Pago de octubre" is prefilled from
  `monthlyPay` through `payAskEntryFor` (EmployeePayAskScreen.kt:140-143). The first ask is on 5 November for October
  (`employeePayAskSlot`; `askedMonthBeforeTrackingStarted` lets October through).
- History reads "2026 · $ 3.250.000 pagado hasta ahora" and "octubre · 2 personas" (EmployeePayHistoryScreen.kt:59-135).
- "Todo pagado" does not change `monthlyPay` (EmployeePayActions.kt:138-160).
- Nothing computes commission, so the voice's "Platata no calcula" is true. This is the LatAm pay ask, not a US payroll or time-clock screen.

1. **MUST, all countries: the Team page is missing the business-code card.** The app always draws `BusinessCodeCard` above the
   pay switch on the owner's phone (TeamManagementScreen.kt:276 and :445; `TeamBusinessCode.mayShow` = owner device + owner view).
   This shop has no employee phone ("0 en celular"), so the card reads "Código del negocio / Aún no hay código. Se crea cuando
   conectas el primer teléfono de un empleado." (BusinessCodeCard.kt:46-55). Page line 498 jumps straight from the search box
   to the switch. The keys `team_business_code_*` are even listed in the page's KEYS comment, but they are never drawn.
   **Fix:** on line 498, before `tm-sw`, insert
   `<div class="tm-code"><small>${esc(S("team_business_code_title"))}</small><p class="none">${esc(S("team_business_code_none"))}</p></div>`
   (bodyMedium 14, `--m-on`). Add `team_business_code_none` to STR: es "Aún no hay código. Se crea cuando conectas el primer
   teléfono de un empleado." / pt "Ainda não há código. Ele é criado quando você conecta o primeiro telefone de um funcionário."
   / en "No code yet. It is created when you connect the first employee phone.".
2. **MUST, es + pt, line 3: the consent screen is gone after 0.9 s of a 7.6 s line.** The line (pt 8.1 s) explains that screen:
   "te pregunta cada mes … si no contestas, te recuerda. Toca Listo, entiendo". Frames 03-10 and 03-95 show the amount entry
   for the rest of the line. **Fix:** on line 550, add `wait:5.2` to the "Listo, entiendo" step.
3. **MUST, page-wide: `?biz=taller-motos` crashes.** The page throws "Cannot read properties of undefined (reading 'n')" and the
   engine never starts. The kit's workshop has one mechanic, so `PEOPLE = TEAM.slice(0, 2)` (line 467) holds one person and
   `PAYABLE[1]` (line 552) is undefined. **Fix:** build the amount steps from the list:
   `...PAYABLE.map(p => ({beat:3, hint:HINT(p.n,p.n,p.n), target:\`[data-t="pay-${p.i}"]\`, tap(st,E){ st.focus = p.i; E.type("p"+p.i, String(p.pay), null, 80); }}))`
   in place of the two fixed steps on lines 551-552. Everything else already works for one or two people.

nice:
- es + pt, line 2: the switch tap at +0.8 s replaces the Team page with the consent screen while the line still says
  "Prende Llevar la cuenta…". Add `wait:2` (line 549).
- **Length:** pt is 546 characters, which is fine but close to the limit. If you cut, cut line 8 to es "Meses anteriores guarda lo
  que pagaste." / pt "Meses anteriores guarda o que você pagou." (−20 / −23). The taps on Mi negocio › Equipo still show on screen.
- The page also runs for US/CA in English ("Employee pay" as the consent title, `employee_pay_title`). US videos are not made,
  but keep this page off any US/CA link on the site while the US is on hold.

## VS18 Combos: es OK, pt OK, MX OK

What I verified as right:
- "Descuentos y combos" has "+ Nuevo" and the tabs Descuentos · Combos · Cargos (DiscountsManagementScreen.kt:202-245). The
  empty Combos tab has "Crear combo".
- The builder is titled "Nueva oferta". It has the overlines "1 · Principal" / "2 · Acompañante" / "TERCERA COSA (OPCIONAL)",
  "Escoge una de las tuyas", "Quitar", and "Siguiente" off until slots 1 and 2 are filled.
- The pick list has services and products A-Z with `comboPickPriceText`.
- "Tu combo" has the name joined with " + " and the lowest prices. The discount switch starts at 10. The hint is
  "≈ 28% … Cepillado gratis" (NewDealScreen.kt:429-446: 18.000/63.000 = 28; BR 29).
- The row reads "2 Peluquería · 10% DESCUENTO · ACTIVO" (DealListScreen.kt:119-124).
- The tile pill "Oferta de Comb…" is top-right and ellipsized (ProductCard.kt:201-240).
- The option sheet comes before the deal (CartActions.kt:553-559). MX and BR first ask "Elige uno" for Corte de dama. The sheet
  ends with "Agregar a la venta · $ 45.000" and then "Agregar oferta" (OptionSelectionSheet.kt:366-391).
- The combo picker is as described above. The footer reads "Venta actual · 2 servicios" and "Cobrar $ 58.500".

nice:
- es + pt + MX, line 1: "Crear combo" is tapped at +0.8 s of 4.7 s, so "En Descuentos y combos, pestaña Combos" is spoken over
  "Nueva oferta". Add `wait:2.6` (line 566).
- All, line 8: "Medio" is picked at +0.8 s, before the voice says "elige Medio" (about 2.5 s). Add `wait:1.8` to the choice
  step (line 584). The "Agregar" tap stays at about +4.3 s, as it should.
- Line 8 wording: "te pregunta el largo" is said while one of the chips is literally "Largo". The screen says "Elige uno".
  es "El cepillado te pide elegir uno: elige Medio y toca Agregar…" / pt "A escova pede para escolher um: escolha Médio…".
- BR and MX subtitle 6 is "En la caja, toca Corte de dama" / "No caixa, toque em Corte feminino", but the voice adds "y elige
  el estilo" / "e escolha o estilo". Add those words to `beats[5]` when `MAIN.choices.length` is not 0 (lines 558-560, the `beats` es/pt/en arrays).
- "Los dos salen con diez por ciento menos" plays over a bare total ($ 58.500). Nothing on screen says −10 %. Optional:
  tap "Venta actual · 2 servicios" so the discounted lines show, or accept it.

## VS19 Otro teléfono: es 1 MUST, pt 1 MUST

What I verified as right:
- The panel's Configuración leads to the hub's "Conexiones" (`workspace_registers_and_printers`).
- The paper Connections page reads "CONEXIONES EN USO 1 de 2". It shows INCLUIDAS (Tu teléfono, Libre 2) and DE PAGO (Agregar 3,
  dashed), with `conn_hero_new`, the money box (no price) and "+ Conectar" inside the card while new (ConnectionsScreen.kt:84-170).
- The chooser, "¿Qué quieres conectar?", uses the potato accent.
- The picker has "¿Qué empleado lo va a usar?", "Conectar" (FilledAccent Small), then "Invitado" with
  "Código del negocio … · PIN …" and "Enviar invitación", plus `conn_pick_note` outside US/CA
  (ConnectEmployeePhoneScreen.kt:64-245).
- The join page reads "Únete a tu negocio" and has code boxes in groups of 5 (PaperCodeBoxes.kt:78-128), 4 PIN boxes and
  "Unirme"/"Entrar". `phone_reg_share_message` carries the Play link, the code and the PIN, so line 5 is true.
- The Mini POS has the tabs Servicios · Productos · Ventas · Agenda (MiniPosSellScreen.kt:623-640) and plain tiles.
- Back on the owner's phone, the page shows "2 de 2", "Todas tus conexiones están en uso.", "Teléfonos de empleados · Incluida
  · Quitar" and the LOCKED store card.

1. **MUST, es + pt (and MX), line 2: the free and paid rule is spoken over the chooser sheet.** "Conectar" is tapped at +0.8 s of
   a 4.7 s line (pt 5.3 s). For the rest of "Tu teléfono y un equipo más van incluidos" the screen is dimmed under
   "¿Qué quieres conectar?", and the sheet covers the money box (frame 02-55). This line carries the video's key message (what is
   free). **Fix:** on line 636, add `wait:2.6` to the hero "Conectar" step, so the tap lands on "Toca Conectar".

nice (the two cuts also answer the length question: es 509 → 432, pt 538 → 465):
- Line 7: "…y tú sigues vendiendo desde el tuyo" / "e você continua vendendo pelo seu" is never on screen, which shows only her
  phone. Cut it: es "Ya vende desde su teléfono, como una caja." / pt "Ela já vende pelo próprio celular, como um caixa."
- Line 8: "como la tablet del mostrador, se paga en Google Play" is not on screen. The screen shows "DE PAGO" and "Cada conexión
  extra · La tercera y las siguientes". Cut it to es "Usas 2 de 2: la tercera conexión ya es de pago." / pt "Você usa 2 de 2: a
  terceira conexão já é paga." This also matches subtitle 8.
- Line 8 scroll: at +3.2 s the page scrolls the circles away to show "Desbloquea tu tienda online … Tus clientes piden desde un
  enlace". That is true to the app, but it is retail wording on a salon (see the app bugs). Drop the `csc` scroll (line 657),
  so the end frame keeps "2 de 2", the circles and the money box.
- The name on the Connections page: the circle and the device row say "Carla" (lines 511, 514, 527: `FIRST`). The app names a
  phone by `e.preferredName` (ui/pos/ConnectionsPageActions.kt:93). Since F-22 that holds the whole typed name, "Carla Gómez"
  (TeamManagementScreen.kt:1019, :1150-1151), which is also what the picker on the same video shows. Use `NEW.name` (the circle
  wraps to 2 lines, kvLabel).
- The business code shape: same as VS14 (hex only).
- The page comment says "cap 10 devices everywhere". It is 9 registers + the owner's phone = 10 connections
  (`MAX_DEVICES = MAX_PAID + 1`, MAX_PAID = 8). This is a comment only.

---

## App bugs not in the builders' notes (verified at 73c65f0)

1. **The Team page says code + PIN is enough to join, but it is not.** BusinessCodeCard `team_business_code_sub` ("Tus empleados lo
   escriben junto con su PIN para entrar."), `team_code_sub` and the new-PIN dialog all say so. The join accepts only an
   employee the owner switched on in Conexiones (PairingActions.kt:551-556), and otherwise answers "Ese código no coincidió"
   with no hint. Fix: add "Para su teléfono, conéctala en Conexiones" to `team_new_pin_notice`, or a "Conectar su teléfono"
   button in the dialog. Severity: small; it confuses the first hire.
2. **A new hire's PIN row says "Aún no hay PIN" even though a PIN is already made.** It is made by `generateUniquePin` and shown
   right after Save. Cause: TeamManagementScreen.kt:1428-1429 passes `employee?.pin`, which is null for a new hire, instead of
   the local `pin`. Fix: pass `pin` when `employee == null`, masked, or say "Se crea al guardar". Severity: small.
3. **The device name in Connections differs from the picker for an older employee row.** Connections uses `preferredName` only
   (ConnectionsPageActions.kt:93), while the picker joins `preferredName + lastName` (ConnectEmployeePhoneScreen.kt:98), so an
   older row reads "Carla" in one place and "Carla Gómez" in the other. Fix: use the joined name in `infos()`. Severity: small.
