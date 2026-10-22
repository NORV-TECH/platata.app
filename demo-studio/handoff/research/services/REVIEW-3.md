# REVIEW-3 — check of section 6 in S13–S24 (services)

Code read: `/home/claude/app-head` @ `17d519ac`. Paths under `app/src/main/java/com/example/` unless they start with `public/`, `functions/` or `res/`.
Every item was traced in code. Duplicates are merged (S19.2 is folded into S14.1).

**Counts (56 unique items):** 47 CONFIRMED · 8 PARTLY · 1 INTENDED · 0 WRONG. There is also 1 new finding (N1) that the helpers missed.

Severity: **BLOCKS A DEMO** = the scene shows the bug on screen. **MONEY** = the wrong amount is charged or stored. **small** = words, layout, or an edge case.

## Table

| ID | Problem (one line) | Verdict | Evidence | Severity |
|---|---|---|---|---|
| S13.1 | Custom fields (Mascota/Placa) and Notas are shown only in the edit form, not on the client page | CONFIRMED | `ui/screens/customers/CustomerPage.kt:157-170` draws WhatsApp/ID/address/visits only; values load only in the form `CustomerCrmScreen.kt:792` | BLOCKS A DEMO only if the vet or taller script shows the client page. Workaround: open "Editar" |
| S13.2 | Client search matches name and WhatsApp only, not plate or pet | CONFIRMED | `CustomerCrmScreen.kt:292-298` | small |
| S13.3 | The client page has no "next appointment" line. Bookings are PENDING, so they are left out of "Compras" | CONFIRMED (gap) | `sync/CustomerPurchases.kt:14-21` | small |
| S13.4 | A purchase row says "#27" with no service name | CONFIRMED (already flagged as M2, not fixed) | `CustomerPage.kt:203` | small |
| S13.5 | Agenda and services sales search by `phoneNumber`, which no screen fills | CONFIRMED | `ServicesTransactionsScreen.kt:208,282`; every customer writer sets `phoneNumber = null`/"" (`CustomerCrmScreen.kt:858-860`, `CustomerFiadoActions.kt:132,186`) | small |
| S14.1 (+S19.2) | Staff without "Cancelar recibos" tap "No asistió" or "Cancelar cita", confirm, the page closes, and nothing happens | CONFIRMED | buttons always drawn `AppointmentDetailScreen.kt:186-212`; dialog calls `cancelAppointment` then `onDone()` `:363-380`; silent return `ui/pos/AppointmentActions.kt:84`; grant defaults to false `data/Employee.kt:47`, `TeamManagementScreen.kt:1059`. Hits the counter tablet, staff phones and staff PIN sessions (`actorAllows`, `ui/pos/PosViewModelTypes.kt:440`). The owner's own phone is not affected | BLOCKS A DEMO only in a staff no-show scene. S19's "small" is too low for that scene |
| S14.2 | The grant that controls bookings is labelled "Cancelar recibos" | CONFIRMED | `res/values-es/strings.xml:3768` | small |
| S14.3 | Services offer no "Controlar el stock" chip, so only the owner counts product stock | PARTLY | True (`ServicesRules.kt:62`). This follows the documented rule C34 "`offersStockPermission` = isRetailLike" (`BusinessRules.kt:179`). It is not a bug, it is a product question | small |
| S14.4 | `team_new_pin_notice` says the PIN "won't be shown in full again", but the form can show it again | CONFIRMED (already flagged ROUND3 #26) | `strings.xml:686`, reveal at `TeamManagementScreen.kt:1560-1575` | small |
| S14.5 | `team_code_sub` does not say the PIN is also used to join a phone | CONFIRMED (already flagged ROUND3 #23) | `strings.xml:2425` | small |
| S16.1 | "Promo nuevo cliente" gives 10 % to ANY attached client, not only new clients | CONFIRMED | idea `sync/DiscountIdeas.kt:24` (`requiresCustomer = true` only); `ui/pos/AutoRules.kt:66` checks only `selectedCustomer != null`. Offered to services `ServicesRules.kt:75`. Not in any flag file | **MONEY** (BLOCKS A DEMO if it is demoed) |
| S16.2 | After saving a new extra charge, the host jumps to tab 0 (Descuentos), which hides charges | CONFIRMED | `DiscountsManagementScreen.kt:186-189` (`selectedTabIndex = 0`); tab 0 = DISCOUNTS, which shows no fees (`:95, :266`) | small |
| S16.3 | "Cargo nocturno" opens with ask-at-checkout OFF. With items picked it adds 15 % at every hour | CONFIRMED | `sync/DiscountDraft.kt:84-91` (no `asksAtCheckout`), `:52` | small (money-adjacent) |
| S16.4 | Discount screens say "artículos" to a services owner | CONFIRMED | `strings.xml:740-785` | small |
| S16.5 | The title "Descuentos y combos" leaves out the third tab, "Cargos" | INTENDED | CLAUDE.md S8-B21/E-27 sets the services host title to "Discounts and combos" (`disc_title_with_combos`). Changing it is a wording choice | small |
| S16.6 | "Cargo por tarjeta de crédito" is offered in Colombia, where it may be illegal | PARTLY | Code fact true: offered in every card country (`DiscountsManagementScreen.kt:88`, `DiscountIdeas.offered`). Legality cannot be decided from code, so it is a question for Monti | small |
| S16.7 | Idea names are in Title Case | CONFIRMED (already flagged retail #32) | `strings.xml:801` etc. | small |
| S16.8 | The item picker has no search and mixes services and products | CONFIRMED (already flagged retail) | `DiscountAssociationWindow` groups by category only, with no field | small |
| S17.1 | Services cannot be made tax-free (matters in US/CA) | PARTLY | TRUE for every walk-made service (default `isTaxable = true`, `data/Product.kt:39`) and for EVERY later edit: editing a service opens `ServiceEditScreen`, which has no tax row (`CatalogNavGraph.kt:150-163`). NOT true at creation: a NEW service made by hand goes through `ItemEditorScreen`, which draws the "Cobrar impuesto" box for every type (`ItemsScreen.kt:1428`, outside the advanced block; routes `CatalogNavGraph.kt:102`, `HomeScreen.kt:895/960/1067`) | **MONEY** — BLOCKS A US/CA tax demo with walk-made services |
| S17.2 | Colombian services see the restaurant line "los restaurantes cobran impoconsumo…" | CONFIRMED (already flagged M1, not fixed) | `TaxesManagementScreen.kt:172-180`, `strings.xml:1013` | small |
| S17.3 | The toast says "Se aplica a los artículos marcados" but "services have no mark" | PARTLY | The wording ("artículos") is wrong for services. The reason given is wrong: services DO carry `isTaxable = true`, and tax applies only to marked lines. They just cannot be unmarked after creation (S17.1) | small |
| S17.4 | No screen shows which services are taxed | CONFIRMED | no tax row or badge in `ServiceEditScreen.kt` or `ServicesMenuScreen` | small |
| S18.1 | A combo's second service is rung at its FIRST stored price: no choice, no "En la caja", no extras | CONFIRMED | `ui/pos/CatalogActions.kt:634` passes `variation = null`; `CartActions.kt:191` takes `getVariationsForProduct(...).first().firstOrNull()` (ORDER BY id, `PosDao.kt:1563`); an ASK service rings `UNSET_PRICE = 0.0` (`Product.kt:62`). Not in any flag file | **MONEY** |
| S18.2 | The same flow says both "Combo" and "Oferta" | CONFIRMED | `strings.xml:759-761` vs `3899-3941` | small |
| S18.3 | A combo row reads "1 Uñas + 1 Uñas" (it counts per category) | CONFIRMED | `ui/screens/combos/DealListScreen.kt:121-126` | small |
| S18.4 | The combo row crams text, 2 badges, a switch and a trash can into one line; the helper says about 20 dp is left for text | PARTLY | One-row layout is true (`ComboRowCard.kt:72-125`). By my estimate about 50 dp is left at font 1.0, not 20; it gets tighter at 1.3 | small |
| S18.5 | The summary says "Oferta creada" before anything is saved | CONFIRMED (already flagged restaurant) | `strings.xml:3941` | small |
| S18.6 | Product words in the deal builder ("Producto principal", feminine "una de las tuyas", "TERCERA COSA" in capitals) | CONFIRMED | `strings.xml:3899-3914` | small |
| S18.7 | The pick list shows the lowest price with no "Desde", or the category name when one choice has price 0 | CONFIRMED | `NewDealScreen.kt:392-398`; `comboPickPriceText` exists but is not used (`ComboBottomButton.kt:40`) | small |
| S18.8 | On the services tile, the combo pill sits on top of the trade icon | CONFIRMED (overlap is likely; not seen on a device) | pill `TopStart` + 6 dp (`ProductCard.kt:208-211`); icon box top-left inside 12 dp padding (`:265-283`) | small |
| S18.9 | A deal with a blank name saves as the English "Deal" | CONFIRMED | `NewDealScreen.kt:225` | small |
| S19.1 | No "who does it" on a booking; "Ventas por empleado" credits whoever charged | CONFIRMED (product gap, not a bug) | `CheckoutActions.kt:395` `employeeName = currentUser`; the booking screen has no staff field | question (see below) |
| S19.3 | The tablet's "Ventas" tab uses the generic list; the staff phone and owner use the services list | CONFIRMED | `MamaPosScreen.kt:1207` (`TransactionsScreen`) vs `MiniPosSellScreen.kt:682` (`renderServicesTx`) | small |
| S19.4 | Counter tablet code page says "same WiFi" | CONFIRMED (already flagged R19) | `strings.xml:2643` | small |
| S19.5 | Connections calls the device "caja"; quotes "Conecta tu segunda caja" | PARTLY | "Cajas" and "primera caja" exist (`strings.xml:5493, 5516, 5774`). The quoted "Conecta tu segunda caja" does NOT exist (it is "Conecta tu primera caja"). "Caja" is also a normal word for a salon's till in Latin America | small |
| S19.6 | An online booking rings on every device, up to 11 times each | CONFIRMED | `ui/pos/OnlineOrderAlerts.kt:63-78`; `MAX_REPEATS = 10` (`sync/OnlineOrderAlertRules.kt:27`); a booking stays PENDING, so it does not stop until it is opened on that device | small |
| S19.7 | Stale comment says the tablet has no "Agendar" branch | CONFIRMED (not user-visible) | `MamaPosScreen.kt:1423-1428` vs `:1373-1376` | none |
| S20.1 | Walk-made services and products often do not go online | CONFIRMED | Any walk service with an add-on gets an `ItemOptionSetCrossRef` (`ui/pos/GuideActions.kt:700`), so it is omitted as `option_builder` (`functions/storefront-projection.js:196`). Unreviewed Colombian corpus prices keep `suggestedPrice` (`GuideActions.kt:550`), so `suggested_price` omits them too | BLOCKS A DEMO (online booking) |
| S20.2 | Sell-online words talk about "pedidos" to a services owner | CONFIRMED | `strings.xml:5234-5368`; `SellOnlineWords.SERVICES` only hides blocks, it swaps no words (`data/business/SellOnlineWords.kt`) | small |
| S20.3 | "Fuera de este horario tu página dice Cerrado" is wrong for services | CONFIRMED | The services tab shows `shop_confirms` with no closed state (`public/store/app.js:345-358`); the line is shown to every type (`SellOnlineScreen.kt:717`) | small |
| S20.4 | The hidden-items card and the category count say "productos" | CONFIRMED | `strings.xml:5324-5326` | small |
| S20.5 | Appointment length tops out at 60 min, one value for every service | CONFIRMED | `sync/SellOnline.kt:120` `PREP_CHOICES` max 60; the server accepts up to 180 (`OnlineStoreHours.PREP_MAX`); peluquería catalogue has services of 240–360 min | small |
| S20.6 | Empty categories show "0 de 0 en línea" | PARTLY | Same code as retail R20 (`sync/OnlineStoreSellable.kt:100-111`), but a services shop has 1–2 categories, so the effect is tiny | small |
| S21.1 | Two devices can book the same slot while one is offline | PARTLY | The slot list uses only this device's open orders (`BookingScreen.kt:108-117`). This is an inherent offline limit, not a code slip | small |
| S21.2 | The held strip calls bookings "ventas" | CONFIRMED | `strings.xml:2666-2669`; count = every unsynced order (`PosDao.kt:478-483`) | small |
| S21.3 | The owner cannot see an offline register holding sales | CONFIRMED (already flagged restaurant #3) | — | small |
| S21.4 | "Dónde atiendes" (domicilio / recogida + charge) never reaches the tablet or staff phone | CONFIRMED | `where_modes` lives only in the owner's `app_metadata` (`data/repo/ShopSettingsStore.kt:96-99`); it is not in the reference or the owner-settings block (`data/repo/BranchSnapshotStore.kt:400-428`). Clients use the default `WhereModes()` = local only (`data/WhereModes.kt:71-79`), so they never ask "¿Dónde?" and never add the travel charge | BLOCKS A DEMO if a tablet or staff phone sells a home visit (MONEY: the charge is missing) |
| S22.1 | The restore warning does not count booked appointments | CONFIRMED | `BackupSettingsScreen.kt:806-813` (PAID/COMPLETED/PARTIALLY_REFUNDED only) | small |
| S22.2 | The backup-risk card names "categorías, opciones y productos" | CONFIRMED | `strings.xml:1147` | small |
| S23.1 | Deleting a service skips the phone lock | CONFIRMED | `ServiceEditScreen.kt:282-290` calls `deleteItem` directly; the item form gates it (`ItemsScreen.kt:395-410`) | small |
| S23.2 | The service page's delete says "Eliminar artículo" | CONFIRMED | `ServiceEditScreen.kt:274`, `strings.xml:637` | small |
| S23.3 | "Eliminar datos" subtitle lists categories and modifiers | CONFIRMED | `strings.xml:2387` | small |
| S24.1 | A services branch loses its trades and "Dónde atiendes" | CONFIRMED | A new DB plus snapshot (`ui/pos/WorkspaceSwitchActions.kt:365-470`); `applyBranchSnapshot` writes only type/currency/country/online/owner keys/language (`BranchSnapshotStore.kt:400-428`); with empty slugs `tradeActionFor` returns AGENDAR (`data/TradeFamily.kt:112-114`) | small; BLOCKS A DEMO only for a Taller branch |
| S24.2 | Branch screens say "menú" | CONFIRMED (already flagged R23 / retail 34) | `strings.xml:2969-2983` | small |
| S24.3 | The switch warning says "pantalla de cocina" to a services shop | CONFIRMED | `HostSwitchWarningDialog.kt:21`, `strings.xml:5858` | small |
| S24.4 | The branch note does not say appointments stay behind | CONFIRMED | `strings.xml:2968` | small |
| **N1 (new)** | **Trades never reach the tablet or staff phone, so a Taller de motos tablet or employee phone shows "Agendar" instead of "Crear orden"** | CONFIRMED | `trade_slugs` is only in the owner's `app_metadata` (`data/repo/BusinessProfileStore.kt:120-124`); there is no writer on the sync path (only `GuideActions.kt:170,608`); the button reads the local `viewModel.tradeSlugs` (`CartSheetContent.kt:857-859`, `MiniPosSellScreen.kt:131,723`). S19 §1 says the devices show "Crear orden"; that is not what the code does | BLOCKS A DEMO (Taller tablet/staff phone) |

### Other points checked
- **Online store / booking connection rule (choke 13/25):** S20's statement is correct. The store opens when the country is free (US/CA), or when a tablet or employee phone USES a paid connection (`sync/ConnectionAllocator.kt:77` `storeOpen = take >= 1`; `sync/StoreLockRule.kt`). Phone + first device are included, so it is the "3rd connection". The server reads the same fact as `patron` (`sync/EntitlementDoc.kt:51`).
- S19 §2 also quotes the nudge as "Conecta tu segunda caja". The real string is "Conecta tu primera caja" (`nudge_connect_title`).

## Open product questions for Monti (not bugs)
1. **Who did the service?** Should a booking or sale record the stylist / groomer / mechanic, so "Ventas por empleado" and future commissions credit the person who did the work rather than the person who charged? (S19.1, S15)
2. **Bookings and the 3rd connection:** should a services shop's online BOOKING page open without a paid connection, since nothing is charged online? (S20)
3. **Card surcharge in Colombia (and some US states):** keep offering the "Cargo por tarjeta de crédito" idea there? Lawyer check. (S16.6)
4. **Staff and services stock:** should services offer the "Controlar el stock" grant? Today it is owner-only by rule. (S14.3)
5. **"Promo nuevo cliente":** should it mean first visit (needs a check on past paid sales), or be renamed "Descuento con cliente"? (S16.1)
6. **Tax on services in US/CA:** is the default "taxable" right for a salon or vet? Many states do not tax services. Should the walk create services exempt in US/CA? (S17.1)
7. **Should trades and "Dónde atiendes" travel to tablets, staff phones and branches?** This needs two more keys in the reference/owner-settings block (N1, S21.4, S24.1).
8. **Discounts host title:** keep "Descuentos y combos", or say all three tabs? (S16.5, a stated design)
