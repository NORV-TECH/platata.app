# REVIEW-1 — independent check of the UX problems in V1–V9 (section 6)

Code checked: `/home/claude/app-head` @ `17d519ac`. Paths under `app/src/main/java/com/example/` unless they start with `app/`, `functions/` or `public/`. Read only; nothing run on a phone.

Verdicts: **C** = confirmed in code, **W** = wrong, **I** = intended (decision cited), **P** = partly true (what is true is said).
Severity: **BLOCKS** = blocks a demo, **MONEY** = a wrong or missing money figure, **small**.

## 0. NEW finding (not in any V file, and two V files state the opposite)

| ID | Problem | Verdict | Evidence | Severity |
|---|---|---|---|---|
| NEW-1 | On a SERVICE the add button of the options sheet prints only the add-ons, not the service price, whenever the service has no PRICED pick-one among its option sets. Corte de dama 54.000 + Lavado 8.000 shows "Agregar a la venta · $ 8.000" but rings 62.000. Cepillado "Medio" (picked in the choice sheet, a variation) then the options sheet shows plain "Agregar" (total 0), rings 20.000. Breaks the S8-B18 rule "the printed number must equal the rung". | C (new) | `ui/screens/home/OptionSelectionSheet.kt:284-286` (when `pickerWins`, base = `pickedServicePrice(...) ?: 0.0`; the `basePrice` the host passes is ignored), `:470-481` (`pickedServicePrice` returns null when no PER_OPTION value has a price), `ui/screens/home/ProductSheetHost.kt:156-166` (`pickerWins = type == SERVICE`; `pickedLinePrice = null` → the variation price rings). The test `OptionSheetCtaTotalE24Test` covers only a priced pick-one. Corpus: Corte de dama "Estilo de corte" values have no `price_co`; Cepillado's priced picker becomes variations. Fix: when `pickedServicePrice` is null, use `basePrice` as the base. | MONEY + BLOCKS (any filmed tap on a researched service with an add-on) |

So these V statements outside section 6 are **WRONG**: V2 §4f and §5 step 8 ("Agregar a la venta · $ 62.000"), V6 §4 line 50 and §5 step 7 ("Agregar a la venta · $ 20.000" for Cepillado Medio), and V6 §4 line 51 ("Add-ons open the add-ons sheet instead" — not for a researched service, see V2-1).

## 1. Section 6 problems

Duplicates are merged: the row lists every ID that says the same thing.

| ID (dups) | Problem in one line | Verdict | Evidence | Severity |
|---|---|---|---|---|
| V1-1 | Picker lede and type pitch promise "servicios con precios" in every country; prices are stripped outside CO | C | `res/values-es/strings.xml:4535` `trade_picker_lede`, `:1634` `biz_picker_serv_1`; `data/investigado/CatalogoInvestigadoAssets.kt:76-90`; `data/PriceSuggestions.kt:57` | small |
| V1-2, V7-1 (also V2 §2/§5, V2-7 brand line) | Setup seeds every researched product of the trade, real brands included (Olaplex, L'Oréal, Bravecto, Royal Canin, Masglo, Mia Secret…), no tick | P — behaviour true; seeding products is intended (Round 268, "a services shop's Productos tab is not empty"); the brand NAMES are corpus content (a data/legal question). Taller-motos names are generic | `ui/pos/GuideActions.kt:583-602`; `assets/catalogo_investigado/peluqueria.json`, `veterinaria.json`, `unas.json` `products` | BLOCKS (any shot of Productos) |
| V1-3 | On a choices page "Según la opción" looks picked but the service is saved FIXED; tile shows the first choice's price flat, "Mis servicios" says "Desde" | C | `ui/screens/guide/BridgeScreen.kt:392-401` (`selectedIndex = if (modeIndex == 2) 1 else 0`; FIXED stored as null), `ui/screens/home/ProductCard.kt:101-107`, `ui/screens/home/ProductLibraryView.kt:331`, `sync/ServicesMenuRule.kt:45-55` | small (display; the tap opens the picker, so no wrong charge) |
| V1-4 | "En la caja" (ASK) service still shows a price on the till tile | C | `ui/screens/home/ProductCard.kt:101-107` (no ASK branch); `ui/pos/CartActions.kt:472-476` asks | small |
| V1-5 | Back from the price step to "pick services" loses trade index and ticks | C | `ui/screens/guide/PickServicesScreen.kt:124,140` (plain `remember`, not seeded from the walk) | small |
| V1-6 | Leaving a price card ("¿Salir sin guardar?") lands on a bare "¿Qué haces?" + "Volver" page | C | `ui/navigation/OnlineNavGraph.kt:126-130` (`cancelGuide()` then `popBackStack()`), `ui/screens/guide/PickServicesScreen.kt:103-121` | small |
| V1-7 | Outside CO the list has no way into "Lo que trae" for plain services; researched extras land as ask-at-till silently | C | `ui/screens/guide/ServicesPriceListScreen.kt:170-183`; `ui/ResearchedOptionStates.kt:44` (`askAtTill = upcharge == null`, amounts null abroad) | small |
| V1-8 | Service and category names written in the app's language, not the shop's `business_language` (choke 12, S10-B04) | C | `ui/pos/GuideActions.kt:487-489` (`app.getString(tradeNameRes)`) | small |
| V1-9 | "Usar estos 1 servicios" (no plural) | C | `res/values-es/strings.xml:4631`, `PickServicesScreen.kt:323-324` | small |
| V1-10 | Option editor from the setup is Material inside the paper flow | C | `ui/screens/guide/BridgeOptionEditor.kt` (FilterChip, TextButton) | small |
| V1-11 | Till has one chip per trade; researched categories (Corte, Color…) dropped | I — services are filed under the trade name on purpose (CU-21 reads the trade from the category name) and Monti decided 26 Sep that SERVICES does not manage categories | `GuideActions.kt:487`; `data/business/ServicesRules.kt:29-33`; CLAUDE.md CU-R09 | small |
| V1-12 | Ready screen "2 min" while abroad he types every price | C (opinion) | `res/values-es/strings.xml:5459` | small |
| V1-13 | Stale screenshot "38.000,00 ¤" | not a code problem (note) | — | — |
| V2-1 (contradicts V6 §4 l.51) | Owner-made "Adiciones" (modifier sets) never show at the till on a service that has option sets — every walked service in the 4 demo trades has them (taller-motos: 18 of 19) | C — but the researched "cobra más" extras DO show (they are option sets) | `ui/pos/CartActions.kt:478-482`, `:532-535`; `ui/screens/home/OptionSelectionSheet.kt:97` | BLOCKS only for a demo of the Adiciones page |
| V2-2 | Outside CO "Editar servicio" opens with an empty price box (current price not shown) | P — true; no data loss (blank = no change), so not a blocker | `ui/screens/services/ServiceEditScreen.kt:104,136,236-246`; `data/catalog/GuideLogic.kt:30-40` | small |
| V2-3 | Phone Back on "Editar servicio" drops edits; the arrow saves | C | `ServiceEditScreen.kt:165` (arrow commits), no `BackHandler` in the file or its route (`ui/navigation/CatalogNavGraph.kt:159`) | small |
| V2-4 | No price-mode control (Fijo / Desde / En la caja) on "Editar servicio" | C | `ServiceEditScreen.kt` (no `servicePriceMode`) | small |
| V2-5 | Restaurant words ("plato", "platos") on the services Adiciones pages | C | `ui/screens/items/CategoryHubScreen.kt:254,285,305`, `ui/screens/modifiers/AddOnDishesRow.kt:71,78`; values-es `addon_empty_line`, `mod_not_on_any_dish`, `your_menu_linked_items_count`, `modmgmt_on_which_dishes` | small (visible in a demo) |
| V2-6 | "Tus opciones" lists every walk option set (~50 rows, "Lavado" many times); "Lavado" then refused as a new name | C | `ui/screens/items/ItemsScreen.kt:1583-1593`; `OptionsPickerPage.kt:175` (checks `displayName`) | small |
| V2-7 | "Sugerencias" for a service are PRODUCT axes with brand names | C | `ui/pos/GuideActions.kt:255-281` (`oficio.productos`) | small |
| V2-8 | Hand-made item with an option set asks the same choice twice (variations, then the same set) | C (logic; not run) — also hits shops | `ui/pos/CatalogActions.kt:133,290-325`; `CartActions.kt:532-535` | small |
| V2-9 | No per-choice price boxes on the item form outside restaurants | C | `ItemsScreen.kt:1195` (`esRestaurante &&`) | small |
| V2-10 | Options of an existing service cannot be changed | P — included/extra options CAN be edited, added and removed (`WhatComesSection`, `ServiceEditScreen.kt:248-252`); only the priced choices are fixed (repriced only) | `ServiceEditScreen.kt` | small |
| V2-11 | Price boxes show "45000" (no `MoneyVisualTransformation`) | C | `ServiceEditScreen.kt:225`, `guide/PricePicker.kt:84`, `BridgeOptionEditor.kt` | small |
| V2-12 | "Eliminar artículo" on a service; pt "Escreve um nome" | C | `ServiceEditScreen.kt:274`; values-pt-rBR `:4643` | small |
| V2-13 | Five minute chips in a non-wrapping Row may clip at 360 dp | C (possible) | `BridgeOptionEditor.kt:241-249` | small |
| V2-14 | Option editor header hand-made; "✕" without a screen-reader label | C | `BridgeOptionEditor.kt:108-117,198-202` | small |
| V2-15 | Paper "Mis servicios" opens Material screens | C | — | small |
| V3-1, V4-2 | Ready date saved with "Sin hora" is stored as midnight and shows "12:00 a. m." | C | `ui/screens/services/BookingScreen.kt:92`; `transactions/ServicesTransactionsScreen.kt:343,367-373`; `AppointmentDetailScreen.kt:99` | BLOCKS for Taller (avoidable by picking an hour) |
| V3-2, V4-4, V5-4, V5-5, V9-7, V9-8 | No good WhatsApp to the client: none at booking, none on cancel/no-show; the reschedule text is "Ana (+57…) — sáb 24 · 10:00" through the share sheet; the online "WhatsApp" opens an empty chat | C | `BookingScreen.kt` (no WhatsApp); `AppointmentDetailScreen.kt:264` (no text), `:393-410` (`"$who ($tel) — $whenText"`, chooser) | BLOCKS only if the video narrates a client message |
| V3-3 | Every trade sees both date questions, both start open; `TradeFamily` is never read | P — true; looks odd but the demo works, so not a blocker | `BookingScreen.kt:136-160`; `WhenPicker.kt:168`; `data/TradeFamily.kt` (only `familyOf`, no caller) | small |
| V3-4 | Booking screen does not show what is booked | C | `BookingScreen.kt` | small |
| V3-5 | Past days and past slots of today can be picked | C | `WhenPicker.kt:418-429` (`past` only greys), `:459-560` (no "now") | small |
| V3-6 | Counter tablet: no confirmation after a booking | C | `MamaPosScreen.kt:1440-1446`; `bookingSavedEvent` collected only by Home and Mini POS | small |
| V3-7 | "L M M J V S D" hard-coded; en "8:00 a. m."; week starts Monday in US/CA | C | `WhenPicker.kt:380,397`; values `dp_hours` | small |
| V3-8 | With one work place, two dividers 24 dp apart | C | `BookingScreen.kt:160,166`; `where/WhereGate.kt:73` | small |
| V3-9 | Saving a booking prints an order slip at once with no date | C (KDS part possible) | `ui/pos/SavedTicketActions.kt:475-497` | small |
| V3-10 | Owner phone: snackbar AND the old jump to Ventas › Abiertas both fire | C | `SavedTicketActions.kt:513`; `HomeScreen.kt:1331-1350` (`parkToast` null → navigates) | small |
| V3-11 | Hours fixed 8:00–20:00 | C | `WhenPicker.kt:47-49` | small |
| V3-12, V5-10 | Clash ignores duration (hour bucket at booking, exact start minute in the detail) | C — note the service duration is NOT stored on purpose (CU-21 declined a `durationMin` column); the fix must read the catalogue by name like the detail already does | `ui/pos/GuideActions.kt:111-119`; `AppointmentDetailScreen.kt:118-133` | small |
| V3-13 | Booking needs an open register even for next week | C (the C-01 gate, not exempted for bookings) | `CartActions.kt:173-186` | small |
| V3-14 | Amber hint #FF9500 on white ≈2.2:1 | C | `ui/theme/Color.kt:113`; `BookingScreen.kt:203-215` | small |
| V3-15 | Tablet in MANUAL receipt mode asks a ticket name, then still needs a client | C | `MamaPosScreen.kt:1373-1376` | small |
| V4-1, V5-2 | Ready-date rows say "Domicilio" (es) / "Delivery" (en); ORDEN trades get "cita" words and "No asistió" | C | `ServicesTransactionsScreen.kt:357`; values-es `sx_delivery`, `ax_cancel` | BLOCKS for Taller (wrong word on screen) |
| V4-3 | Agenda is one flat list (no day headers), under a tab named "Ventas" | P — true; "blocks a demo" overstated | `ServicesTransactionsScreen.kt:229-245`; `ui/navigation/NavLabels.kt:24` | small |
| V4-5, V5-7, V8-2 | Note, where-mode and price not on the appointment detail; the row has no note or where | C | no `cartNote` / `diningOptionName` reader in `AppointmentDetailScreen.kt` or `ServicesTransactionsScreen.kt` | small |
| V4-6, V5-11 | Agenda search by phone never matches (app clients have `phoneNumber = null`); "Nadie con ese nombre." for a number | C | `ServicesTransactionsScreen.kt:208`; `customers/CustomerCrmScreen.kt:858-860` | small |
| V4-7, V5-1 | Without "Cancelar recibos" Cancel / No-show show, confirm, and silently do nothing | C | `ui/pos/AppointmentActions.kt:84`; `AppointmentDetailScreen.kt:186-213,365-381` (no permission read) | small |
| V4-8 | "No asistió" shows all day before the hour | C | `AppointmentDetailScreen.kt:115,186` (comment at :57 says "once the hour is here") | small |
| V4-9 | Detail shows only the first service and its duration | C | `AppointmentDetailScreen.kt:95-96` | small |
| V4-10 | A "both dates" booking can move only its arrival, and that picker offers "Sin hora" | C | `AppointmentActions.kt:52-55`; `AppointmentDetailScreen.kt:216-228` | small |
| V4-11, V5-12 | Agenda top bar has an X (hand-made Row, escapes G-08); detail uses raw `TopAppBar` / `Button` | C | `ServicesTransactionsScreen.kt:122-124`; `AppointmentDetailScreen.kt:143` | small |
| V4-12, V5-13 | Cancel button says "cita" for an ORDEN; pt mixes "reserva" / "agendamento" | C | values-pt-rBR `:186,198,203,210,4184` | small |
| V4-13 | Phone under the name is raw "+573001234567" | C | `ServicesTransactionsScreen.kt:236-238` | small |
| V4-14 | No reminder before an appointment (owner or client) | C (no such kind in `sync/NotificationKind.kt`) | — | small (feature gap) |
| V4-15 | Hour bucket by UTC hour (wrong only for Newfoundland −3:30) | C | `GuideActions.kt:117`; `AppointmentActions.kt:68` | small |
| V5-3 | Overdue ORDEN: Cancel hidden, only "No asistió" | C | `AppointmentDetailScreen.kt:186,203` | small |
| V5-6 | No-show and cancel stored the same (CANCELLED) | C | both call `cancelAppointment` (`AppointmentDetailScreen.kt:366,377`) | small (schema question) |
| V5-8 | Two ways to open the picker; "Guardar" when nothing changed | C | `AppointmentDetailScreen.kt:196-201,329-334` | small |
| V5-9 | No feedback after save / cancel / no-show | C | `AppointmentDetailScreen.kt:315,368,380` | small |
| V5-14 | An appointment being charged (ACTIVE) disappears from the Agenda | C (same for any open ticket) | `SavedTicketActions.kt:636`; `PosViewModel.kt:1510` (`"SAVED"` only) | small |
| V6-1, V8-3 | Charging a booking re-asks "¿Dónde se hace?" (pick not restored); a new pick can contradict the frozen travel fee | C | `SavedTicketActions.kt:758-826` (no `selectedWhereMode`); `CheckoutSheetBody` `whereAnswered` gate | small (possible wrong record) |
| V6-2 | Agenda › Cobrar charges with the register CLOSED: the gate is only on adding items | C — same hole for any saved ticket opened from Open | `ui/navigation/ReportsNavGraph.kt:115-123`; `CartActions.kt:173-186`; no shift check in `CheckoutActions` | MONEY (cash outside any shift) |
| V6-3 | Booked service locked like a kitchen dish (PIN, "Error de cocina") | C | `CheckoutBreakdownScreen.kt:596-597` (no type check); `home/VoidPinDialog.kt:230-234` | small |
| V6-4 | No way to add an add-on to the booked line | C (no line-edit path found) | — | small |
| V6-5 | No appointment context on pay screen, no "Agendar la próxima" | C (idea) | — | small |
| V6-6 | Ventas row of a paid appointment shows payment time only | C | `ServicesTransactionsScreen.kt:459` | small |
| V7-2 | Abroad every seeded product opens the price keypad | I — prices stripped on purpose outside CO (`PriceSuggestions`, Round 322) and an unpriced line is asked, never $0 (Slice 2) | `CartActions.kt:472-476` | small |
| V7-3 | Hand-made products land in the hidden system bucket ("Otros servicios") | P — the bucket is intended (Round 159: "a PRODUCT never inherits a trade's category"); the tablet/staff chip showing it is possible, not proven | `ItemsScreen.kt:586-596` | small |
| V7-4 | Stock hint says "en la tienda" for a salon / vet | C | values-es `stock_sheet_count_hint` | small |
| V7-5 | Staff can never count stock in a services shop | I — explicit rules member `offersStockPermission = false` (no reason written; ask Monti) | `data/business/ServicesRules.kt:62` | small |
| V7-6 | `editorHidesStockAndAdvanced` name vs behaviour | C (code note, no user impact) | `ServicesRules.kt:26` | — |
| V8-1 | Where-modes never reach the counter tablet / staff phone; their bookings save "En el local", no travel fee | C | `data/repo/ShopSettingsStore.kt:95-99`; not in `data/repo/BranchSnapshotStore.kt` nor `OwnerSettingsWire` | BLOCKS (multi-device home-visit demo) |
| V8-4 | Fee box round-trips through a Double each keystroke; Brazil shows "5.00" | P — round trip and dot display true (`formatAmountForInput` is the internal dot form); "cannot be cleared" depends on the cursor, not proven | `where/WhereScreen.kt:231-235`; `utils/CurrencyUtils.kt:336` | small |
| V8-5 | Reports "Ventas por tipo de consumo" for a salon | C | `reports/ReportsScreen.kt:430`; values-es `:3044` | small |
| V8-6 | Stored where name is in the app language of the moment | C | `CartActions.kt:709-721` | small |
| V8-7 | Three names for "where" | C | values-es `:94,4602,5664` | small |
| V8-8 | With no fee, receipt / sale screen do not say it was a home visit | C | `utils/ReceiptFormatter.kt:380-383` (only when upcharge > 0) | small |
| V9-1 | Walked services never reach the booking page: any option-set link = "option_builder" | C — 0 of 21 / 16 / 18 services pass in peluquería / veterinaria / uñas, 1 of 19 in taller-motos (711 services, 56 pass, all trades) | `sync/OnlineStoreSellable.kt:67`; `functions/storefront-projection.js:196`; `GuideActions.kt:689-703` | BLOCKS (online booking, all 4 trades) |
| V9-2 | An untouched suggested price keeps a service off the page; choice services are never "reviewed" | C (the suggested-price rule is deliberate; the setup path never clears it for choice services) | `GuideActions.kt:495,550`; `BridgeScreen.kt:185-199` | BLOCKS in CO |
| V9-3 | One slot length for every service, UI max 60 min (server accepts 180) | C | `sync/SellOnline.kt:121`; `sync/OnlineStoreHours.kt:42-43`; `storefront-projection.js:340` | small |
| V9-4 | Page shows "Desde" / "En la caja" services as a fixed price | C | `storefront-projection.js` (no `servicePriceMode`) | small |
| V9-5 | Opening the booking from the Agenda does not silence its alert | C | only `TransactionsScreen.kt:2094` calls `onlineOrderSeen` | small |
| V9-6 | Alert body "1 producto" for a booking | C | `ui/pos/OnlineOrderAlerts.kt:156`; values-es `:5369-5372` | small |
| V9-9 | Clash only inside the detail, not on the Agenda row | C | `ServicesTransactionsScreen.kt` (no overbook in the row) | small |
| V9-10 | Browser tab "<shop> · Pedir en línea" on a booking page | C | `public/store/app.js:962`; `strings.js:11` | small |
| V9-11 | Shop name iOS blue #007AFF, not services purple | C — already reported (CLAUDE.md BACKOFFICE-2 D, "Monti decides") | `public/store/store.css` | small |

### Checks on the specific claims asked about

- **Add button total**: NEW-1 above. The V files' figures ($ 62.000, $ 20.000) are wrong; the line rings those amounts, the button does not print them.
- **Combo price**: no combo money claim in any V section 6; not checked further.
- **Register shift**: V6-2 confirmed (MONEY).
- **"Add-ons never show at the till"**: V2-1 confirmed for owner-made Adiciones; researched "cobra más" extras do show (option sheet). V6 §4 says the opposite: wrong.
- **"Online booking page empty after setup"**: V9-1 confirmed (plus V9-2 in CO). Also needs the store open: US/CA free; elsewhere at least one PAID connection in use (owner phone + included device + a third device on a paid connection; choke 13/25, `StoreLockRule`). V9 §2 states this correctly.
- **"Brand products seeded"**: confirmed; seeding is intended (Round 268), the brands are corpus data.
- **"Duration never stored"** (V3 §1): true for `Product` / `Order`, and **intended** (CU-21: a `durationMin` column was declined, the minutes come from the researched service of the same name). Option sets do store `durationMin`.
- **"Who does the service not recorded"** (V3 §1): confirmed; `Order` has only `employeeName` (who saved it), no performer field (`data/Order.kt:94`).

## 2. Counts

Section 6 items (102, excluding the V1-13 note; duplicates counted once per file): **confirmed 91 · wrong 0 · intended 3 · partly 8**. Partly: V1-2, V7-1, V2-2, V2-10, V3-3, V4-3, V7-3, V8-4. Plus NEW-1 (confirmed, MONEY) and 4 WRONG statements outside section 6 (V2 §4f, V2 §5 step 8, V6 §4 l.50 / §5 step 7, V6 §4 l.51).

## 3. Open product questions for Monti (not bugs)

1. Should setup keep seeding the trade's researched products, and with real brand names? (V1-2)
2. Should online booking open for a one-person shop without a paid connection (today Uñas outside US/CA needs owner phone + 2 devices + a paid connection)? (V9)
3. How should the page publish services that carry options: options as text / add-ons on the page, or keep them off? (V9-1)
4. Should a booking record WHO does the service (stylist / vet / mechanic), and a per-person agenda? (V3 §1, V4)
5. Should the service duration be stored (a Room change CU-21 declined) so clashes and online slots use real lengths? (V3-12, V9-3)
6. Should a no-show be stored apart from a cancel (schema change)? (V5-6)
7. Should a booking for a future day need the register open? (V3-13)
8. Staff stock counting in services shops: off on purpose? (V7-5)
9. Opening hours: a "Horario" setting, or keep 8:00–20:00? (V3-11)
