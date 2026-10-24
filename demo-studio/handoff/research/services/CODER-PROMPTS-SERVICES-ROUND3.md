# Services round 3: problems for the coder (found while re-checking the demos at 37db6d6c, 24 Oct 2026)

App commit read: **37db6d6c** (sim/usa-canada, Fusion 28). Monti passes this to the coder. **Status: READY** (24 Oct 2026).
Each item: what is wrong, where (file:line), a one-line fix, and how much it matters. Every item was found by a builder or an independent
reviewer while re-checking a demo, verified in the code by them, and re-checked by me before it went in.
Totals: **2 blocking** (1 blocks two demo videos, 1 blocks real bookings), **3 money display**, **19 small**.
Mexico card items are in `handoff/research/mexico/CODER-PROMPTS-MEXICO.md` (round 3 section: the lower-case "visa ••4242" after a tap sale).
Round 2 (`CODER-PROMPTS-SERVICES-ROUND2.md`): every item the demos touch was seen FIXED at 37db6d6c, except the half-fixed words in items 4, 13, 22 below.

## Blocking

### 1. MONEY DISPLAY, BLOCKS A DEMO. The online booking page's "Desde" price is the FIRST stored choice, not the cheapest (round 2 item 9 fixed only the till)
- Where: `functions/storefront-projection.js:278` (`const v = firstVariation.get(it.id)`) and `:291` (`price: v.price`); drawn by
  `public/store/app.js:358` (`service_from` with `svc.price`). The till and "Mis servicios" show the cheapest choice (round 2 item 9).
- Seen: Colombia "Peinado social" Desde $ 90.000 on the booking page vs $ 55.000 on the till; Brazil "Coloração completa" A partir de R$ 125,00 vs
  R$ 80,00 (the second card on the first screen); Mexico card 1 $430.00 vs $280.00.
- Also: the page's "Pagas en el negocio · $X" line (`public/store/app.js:481-484`) prints that same first-choice price as if it were fixed.
- Fix (one line): for a FROM service, publish the lowest PRICED choice (the till's rule for item 9) instead of the first variation; say "Desde $X" on
  the pay-at-the-shop line too.
- BLOCKS: the Brazil videos of V9 (Reservas en línea) and VS20 (Vender en línea). The Colombia videos are recorded (their wrong cards are below the fold).

### 2. BLOCKS REAL BOOKINGS. The booking page offers times on the service's own minutes, but the server checks them on the shop's slot length
- Where: page `public/store/app.js:396-404` (`daySlots`: `slotMinutes = svc.durationMin`, SVC-3 item 44); server `functions-public/index.js:231-238`
  (`slotFits(hours, start, store.slotMinutes)`, the shop's "Duración de la cita", 20 min by default).
- Seen: a 30-min service offers 9:30; the server refuses it with "Esa hora ya no se puede reservar". The demo's 14:00 slot fits both, so no video is blocked.
- Fix (one line): the server checks the slot with the service's own minutes (`serviceMinutes[name]`, the same map the page reads), falling back to `slotMinutes`.

## Money display

### 3. A "Desde" service whose first choice has no price shows "Desde $ 0" on the booking page
- Where: `functions/storefront-projection.js:197` (with item 1's first-variation price); seeded catalogue `CatalogoInvestigadoATienda.kt:122`
  (e.g. Colombian "Retoque de raíz"). Fix: with item 1, take the lowest PRICED choice; a service with no priced choice says "Precio en el local".

### 4. The combo sheet's "Completa tu…" shows the first choice's price, not the lowest
- Where: `ui/screens/home/ProductSheetHost.kt:245`. Round 2 item 9 made the tile show the cheapest choice; this line still reads the first.
- Fix (one line): use the same lowest-priced choice as the tile.

### 5. The owner's own Sell online category page shows the first choice's price with no "Desde"
- Where: `sync/OnlineStoreSellable.kt:115` → `SellOnlineScreen.kt:777`. Fix: show "Desde" + the lowest priced choice, like the till.

## Small

### 6. Round 2 item 42 half fixed on Sell online: "pedidos" / "productos" words in a services shop
- Where: `SellOnlineText.kt:63`; `SellOnlineScreen.kt:313`, `:329`, `:376`, `:471`, `:551` ("pedidos"); `:735` "Encender la tienda", `:416` "Estos productos…",
  `:758` "productos"; the connections dialog says "Tu tienda online" (`ConnectionDialogs.kt:107`, `:117`).
- Fix: use the services words (citas / reservas, servicios) where `rules.isServicesType`, as round 2 did elsewhere.

### 7. "productos" / "cosa" in the combo screens of a services shop (round 2 item 47, half fixed)
- Where: `DealListScreen.kt:133`, `NewDealScreen.kt:383`. Fix: the services words.

### 8. The panel's search bar says "productos" in a services shop
- Where: `ui/screens/home/PanelSearchBar.kt:34` (string `wsearch_bar`, "Busca ajustes, productos, clientes…"). Fix: a services wording ("servicios").

### 9. Security: the services "delete data" line still says "categorías"
- Where: string `security_protect_delete_data_desc_services` (shown by `ui/screens/settings/SecurityScreen.kt:182-191`). A services owner cannot create,
  rename or delete categories (choke point 23). Fix: "Servicios, adicionales y opciones" (and the pt/en/fr values).

### 10. Every Agenda row and appointment page of a shop with one way of working says "En el local" (the line round 2 item 15 removed from receipts)
- Where: `ui/screens/transactions/ServicesTransactionsScreen.kt:449-466` (`whereText`) and `AppointmentDetailScreen.kt:249-259`.
  Fix: skip `WhereMode.LOCAL` in both when the shop works only in the shop, the receipt's rule.

### 11. A client's purchase row labels the person who did the work "Vendido por:"
- Where: `ui/screens/customers/CustomerPage.kt:268-273`. The receipt and the Agenda say "Atendió". Fix: "Atendió: <name>" for a services sale.

### 12. The combo list row reads "1 Corte de dama + 1 Cepillado"
- Where: `ui/screens/combos/DealListScreen.kt:159-163`. Fix: join the service names with no count, as `ComboListScreen` does.

### 13. Branch setup: "Se llamará ." when the branch name opens empty
- Where: `BranchSetupScreen.kt:277-279`: a parent name of 22 or more letters opens the field empty (item 50's rule), and the line under it then reads
  "Se llamará ." Fix: draw that line only when the name is not blank.

### 14. The card-surcharge idea's note still reads machine-translated (es / pt)
- Where: `values-es/strings.xml:838`, `values-pt-rBR/strings.xml:837`. Fix: rewrite in plain Spanish / Portuguese.

### 15. Services trade categories get the plate emoji
- Where: `data/repo/CatalogDaoStore.kt:242` falls back to `data/CategoryEmoji.kt:24` (🍽️) for a trade category (e.g. "Peluquería"). Shows on Sell online
  (`SellOnlineScreen.kt:394`, `:753`) and on the customer's Products chips (`public/store/app.js:247`).
- Fix: give the services trades their own emoji (or none) in `CategoryEmoji`.

### 16. The customer's Products tab shows a chip for the empty, hidden "Otros servicios" category
- Where: `functions/storefront-projection.js:255`, `public/store/app.js:201`. Fix: leave out a category with no published product.

### 17. Right after turning the store on, a new owner briefly reads "Tu página dice Cerrado"
- Where: `SellOnlineText.kt:64` (the status listener started when Sell online opened, `SellOnlineScreen.kt:125-128`, before the store was on). Fix: say
  "Abriendo tu página…" until the first status after the switch.

### 18. The booking page asks for "Celular (con código de país)" but the number is used only for WhatsApp
- Where: `public/store/strings.js:49, 176, 303`; the number is the client's WhatsApp (`functions-public/index.js:279, 299`). A client who types a
  non-WhatsApp number never gets the shop's confirmation. Fix: "WhatsApp (con código de país)" / "WhatsApp (com código do país)".

### 19. Portuguese booking page dates: "Reservar sex., 23 14:00" and "sex., 23 · 14:00"
- Where: button `public/store/app.js:409-412`, `:488`; done page `public/store/logic.js:480-484` (`dayTimeIn`), the same Intl short form. Fix: one pt-safe
  day label ("Reservar sexta, 23 às 14:00").

### 20. Booking page: the notes on the "¿Cuándo?" step touch the left edge
- Where: `public/store/store.css:109`. Fix: give the notes the page's side padding.

### 21. Booking page: the browser tab says "Tienda en línea"; the shop name is always blue
- Where: tab title `public/store/app.js:990`; shop name colour `public/store/store.css:23` (`--blue`). Fix: "Reservas" for a services shop; the shop's colour.

### 22. The booking alert's time follows the phone's 12/24-hour setting; every other booking screen uses the app's format
- Where: `ui/pos/OnlineOrderAlerts.kt:134-137` (`bookedWhen`) vs `fmtTimeCO` (`WhenPicker.kt:76-93`): a default phone shows "14:00" in the alert and
  "2:00 p. m." on the page it opens. Fix: use `fmtTimeCO(minsOf(millis))` in `bookedWhen`.

### 23. Every notification's small icon is the full-colour launcher icon, so Android draws a grey blob
- Where: `setSmallIcon(R.mipmap.ic_launcher)` in `ui/pos/OnlineOrderAlerts.kt:168,172`, `work/AlertNotifier.kt:114,181`, `work/HostStoppedAlert.kt:44`,
  `work/AgendaEdificioWorker.kt:232`, `sync/SyncHostService.kt:925`, `MenuImportService.kt:202`. Fix: one monochrome `ic_stat_platata` vector for all eight.

### 24. The Agenda row gives no sign when an online booking lands on a time already taken
- Where: the Agenda list (owner phone). Fix: mark a row that overlaps another booking.
