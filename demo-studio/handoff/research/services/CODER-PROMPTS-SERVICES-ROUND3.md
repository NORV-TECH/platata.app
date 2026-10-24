# Services round 3: problems for the coder (found while re-checking the demos at 37db6d6c, 24 Oct 2026)

App commit read: **37db6d6c** (sim/usa-canada, Fusion 28). Monti passes this to the coder. Each item: what is wrong, where (file:line),
a one-line fix, and how much it matters ("BLOCKS A DEMO", "money", "small"). Items are verified in the code by the builder who found them
and re-checked by me before they go in. Status: IN PROGRESS (more items arrive as the re-check of every services page finishes).

## Blocking / money

### 1. MONEY DISPLAY. The online booking page's "Desde" price is the FIRST stored choice, not the cheapest (round 2 item 9 fixed only the till)
- Where: `functions/storefront-projection.js:278` (`const v = firstVariation.get(it.id)`) and `:291` (`price: v.price`); drawn by
  `public/store/app.js:358` (`service_from` with `svc.price`). The till and "Mis servicios" show the cheapest choice (round 2 item 9).
- Seen: Colombia "Peinado social" Desde $ 90.000 on the booking page vs $ 55.000 on the till; Brazil "Coloração completa" R$ 125,00 vs R$ 80,00.
- Fix (one line): for a FROM service, publish the lowest priced choice (the same rule the till uses for item 9) instead of the first variation.
- BLOCKS A DEMO: the VS20 / V9 videos show the booking page's service cards.

- Also: the page's "Pagas en el negocio · $X" line (`public/store/app.js:481-484`) prints that same first-choice price as if it were fixed, for a
  "Desde" service. Fix with item 1: say "Desde $X" there too (or no amount) when the service is FROM.

### 1b. BLOCKS REAL BOOKINGS. The booking page offers times on the service's own minutes, but the server checks them on the shop's slot length
- Where: page `public/store/app.js:396-404` (`daySlots`: `slotMinutes = svc.durationMin`, SVC-3 item 44); server `functions-public/index.js:231-238`
  (`slotFits(hours, start, store.slotMinutes)`, the shop's "Duración de la cita", 20 min by default).
- Seen: a 30-min service offers 9:30; the server refuses it with "Esa hora ya no se puede reservar". The demo's 14:00 slot fits both, so the V9 video is not blocked.
- Fix (one line): the server checks the slot with the service's own minutes (`serviceMinutes[name]`, the same map the page reads), falling back to `slotMinutes`.

## Small

### 2. Services trade categories get the plate emoji
- Where: `data/repo/CatalogDaoStore.kt:242` falls back to `data/CategoryEmoji.kt:24` (🍽️) for a trade category (e.g. "Peluquería"). Shows on Sell online
  (`ui/screens/.../SellOnlineScreen.kt:394`, `:753`) and on the customer's Products chips (`public/store/app.js:247`).
- Fix: give the services trades their own emoji (or none) in `CategoryEmoji`.

### 3. The customer's Products tab shows a chip for the empty, hidden "Otros servicios" category
- Where: `functions/storefront-projection.js:255`, `public/store/app.js:201`.
- Fix: leave out a category with no published product.

### 4. Round 2 item 42 half fixed on Sell online: "pedidos" / "productos" words in a services shop
- Where: `SellOnlineText.kt:63`; `SellOnlineScreen.kt:313`, `:329`, `:376`, `:471`, `:551` ("pedidos"); `:735` "Encender la tienda", `:416` "Estos productos…",
  `:758` "productos"; the connections dialog says "Tu tienda online" (`ConnectionDialogs.kt:107`, `:117`).
- Fix: use the services words (citas / reservas, servicios) where `rules.isServicesType`, as round 2 did elsewhere.

### 5. The notes on the booking page's "¿Cuándo?" step touch the left edge (no side padding)
- Where: `public/store/store.css:109`. Fix: give the notes the page's side padding.

### 6. Portuguese booking button reads "Reservar sex., 23 14:00"
- Where: `public/store/app.js:409-412`, `:488` (the weekday short form keeps its "." and a comma before the day). Fix: build the label from the pt
  date words ("Reservar sex. 23, 14:00" or "Reservar sexta, 23 às 14:00").

### 7. Booking page: the browser tab says "Tienda en línea"; the shop name is always blue
- Where: tab title `public/store/app.js:990`; shop name colour `public/store/store.css:23` (`--blue`). Fix: "Reservas" title for a services shop;
  the shop's own colour.

### 8. The Agenda row gives no sign when an online booking lands on a time already taken
- Where: the Agenda list (owner phone). Fix: mark a row that overlaps another booking.
