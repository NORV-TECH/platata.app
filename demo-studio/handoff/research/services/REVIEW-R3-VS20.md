# REVIEW-R3-VS20: services demo VS20 "Vender en línea" (owner phone + client's phone)

Reviewer: independent pass, 24 Oct 2026. App READ ONLY at `/home/user/suma-plus-android`, detached at **37db6d6c**.
I edited only this file. My scratch: `/tmp/claude-0/-home-user/96476401-bbfa-5681-be22-524ea1c374e3/scratchpad/rev-vs20/`.

Method:
- Every key in the page's `STR` (71) and `PLU` (3) compared by script with values / values-es / values-pt-rBR at 37db6d6c: **all match**.
  The `WEB` block matches `public/store/strings.js` (es/pt).
- Read: `SellOnlineScreen.kt` (whole), `SellOnlineText.kt`, `SellOnlineWords.kt`, `sync/SellOnline.kt`, `sync/OnlineStoreRules.kt`,
  `sync/OnlineStoreSellable.kt`, `ui/pos/OnlineStoreActions.kt`, `PosViewModel.openSellOnlineDoor`, `ConnectionEventsHost.kt`,
  `ConnectionDialogs.kt` (StoreLockedDialog), `sync/StoreLockRule.kt`, `HomeScreen.kt` panel (:1510-1840), `PanelSearchBar.kt`,
  `StaffPhoneState.kt`, `StaffPhoneActions.kt`, `SupportStrip.kt`, `CategoryEmoji.kt`, `CatalogDaoStore.kt`, `SeedStore.kt`,
  `GuideActions.kt` (finishBridge / ensureResearchedOptions), `CatalogoInvestigadoATienda.kt`, `ServicesMenuRule.kt`, `ProductLibraryView.kt`,
  `functions/storefront-projection.js`, `functions/index.js` (projectStorefront :3700-3970), `public/store/app.js`, `logic.js`, `store.css`,
  `functions/test-vectors/money-format.json`, and the diff d30ffa1..37db6d6c of all of them (only HomeScreen, Connections and strings.js moved).
- `check_demo.py servicios/VS20 CO:es BR:pt MX:es`: **OK / OK / OK**. I looked at every demo screenshot of the three runs.
- Video timeline with `dur=` at 0.067 s/char (no VS20 clips exist), plus the REAL clip lengths of the two byte-identical TS20 lines
  (`1-abrir` es 2.43 s / pt 3.00 s, `5-compartir` es 2.43 s / pt 3.00 s). Frames saved at the key moments.
- `?biz=veterinaria|taller-motos|unas` (CO) and `veterinaria` (BR): no page error, right trade, right "+1 conexión" wording
  (tablet when the shop has fewer than 2 staff).
- `validate_scripts.py VS20`: steps=7, es 413 / pt 436 chars, OK. Beats == steps (7) for CO, BR and MX. tú / você, no greetings,
  last line "Así vendes en línea con Platata." / "Assim você vende online com o Platata.". Subtitles all <= 60 chars.
- MX: no `VS20-MX.json` is right: the Mexican flow has the same screens and words (services: no card row anywhere,
  `SellOnlineGate.cardOnlineRow` -> HIDDEN because `cardOnlineAllowed = false`); only money differs and no line says a price.

## Summary

| Feature | es (CO) | pt (BR) | MX es |
|---|---|---|---|
| VS20 Vender en línea | 3 MUST, 7 nice | 3 MUST + 1 app MUST (blocks the BR video), 7 nice | no video needed; renders OK (shows the same app price bug on card 1) |

### Verified true (what the screens and the voice claim)
- Panel: search bar first (`HomeScreen.kt:1516`, `PanelSearchBar.kt`, words/shape/size right), connect nudge hidden (devices exist),
  register card, "Vender en línea" row with "Apagado" + white "APAGADO" pill (`:1609-1655`), "Día a día", Clientes "5 clientes"
  (no tab money for services), Facturas "Escanea tu primera factura", Equipo, Reportes "Ventas netas hoy · $ 359.000"
  (`NetSalesWords.outsideUsCa`), divider, Configuración. No Items/Inventory row (`ServicesRules.workspaceHasItemsRow = false`).
  Bottom bar Caja · Agenda (Receipt icon, `Screen.kt:42`) · flag.
- Door: `openSellOnlineDoor` -> `ConnectionsGate.storeOpen()`; refused -> `StoreLockedDialog` over the panel, `need = ADD` for paid = 0
  (`ConnectionEventsHost.kt:52-67`, `StoreLockRule.needOf`), words `conn_store_dlg_title` / `conn_store_dlg_body_add` / "Agregar una conexión".
- The voice "Se abre cuando una tablet o un teléfono de empleado usa tu tercera conexión" = `conn_dlg_store`, true (owner phone 1 +
  included device 2 + paid 3, `ConnectionAllocator`).
- OFF page: switch card "Apagado" + intro `sell_online_intro_title_services` / `_body_services` (`SellOnlineScreen.kt:262-307`).
- Switch -> Paso 1 (address, `requestedSlug` blank) -> Next -> Paso 2 (hours empty) -> "Encender la tienda" (`:150-210`). Hours page:
  9:00-18:00 "Igual todos los días · Sí", "Cuánto dura cada cita / Duración de la cita 20 min" with no sub-line and no tip card, the
  services outside-hours line, "Horas en America/Bogota" (`:620-738`). Times "9:00" (es) / "09:00" (pt) match `ofLocalizedTime(SHORT)`.
- ON page order: status, keep-open line, link card (Copiar / Compartir / QR / Ver), no pickup block, "Pago al pedir en línea" +
  locked "Paga en el negocio / No se cobra nada al reservar" with NO card row (every country), Horario "Pedidos en línea · Todos los
  días 9:00 – 18:00 · 20 min por cita", one category line "🍽️ Peluquería · 15 de 15 en línea" (11 services + 4 products, all sellable:
  `GuideActions.kt:620,688,693` clear `suggestedPrice`), no HiddenItemsCard. The voice "No se cobra nada al reservar: te pagan en tu negocio"
  is exactly the locked row.
- Share text `sell_online_share_text_services` "Reserva aquí: https://…" / "Agende aqui: …" (`LinkCard`, :446-457).
- Client page: shop name in #007AFF 24/900, `shop_confirms`, tabs Servicios | Productos (both halves exist: `to_go` is seeded for every
  type, `SeedStore.kt:114-118`, so `isOrderable` holds and `tabsEl` draws), cards in name order (`PosDao.kt:353` ORDER BY name),
  "Incluye: …" = free, not-ask option sets (`storefront-projection.js:214-234`; researched pick-ones never become option sets,
  `ResearchedOptionStates.kt:10`), money format = `money-format.json` (CO "$ 65.000", BR "R$ 125,00", MX "$430.00"), card colour
  #2196F3 at 12 % / 35 %, no description (research writes none).
- Hard rules: no US/CA content in the videos (US/CA path exists but is not recorded), no French, light theme, no card logos, no real
  brand on screen, no card scan, no fee, no Pix/QR payment (the link card's QR is the store link, not a payment).

---

## VS20 findings

### MUST 1 (es + pt) — beat 3: "Revisando tu página…" after "Encender la tienda" is not what the app shows
- Where: page line 386-387 (`st.checked = false; E.after(1500, () => { st.checked = true; })`) and `sellPage` line 299/304. On video
  16.5-18.0 s (CO) / 17.2-18.7 s (BR) the status says "Revisando tu página…" / "Verificando sua página…" and the link card is missing.
- Evidence: `sell_online_checking` is shown only while `read == SellOnlineRead.Checking` (`SellOnlineText.kt:75-79`), and Checking is set
  only by `startSellOnlineStatusListener` (`OnlineStoreActions.kt:153-155`), called ONCE from `DisposableEffect(Unit)` at the top of
  `SellOnlineScreen` (`SellOnlineScreen.kt:125-128`). Address and Hours are `page` states of that same composable, so the listener is never
  re-armed. By the time the hours page saves, the status doc already says `{state:"closed", slug}`: the Paso 1 save pushed the reference
  and `projectStorefront` minted the slug with the store still off (`functions/index.js:3755-3775`). So the app shows, for the seconds
  until the turn-on push is projected, "Tu página dice Cerrado" (`sell_online_status_closed`) WITH the link card, then "Abierta,
  recibiendo pedidos".
- Fix: compress the time honestly — in the beat-3 tap set `st.checked = true` at once (drop the 1.5 s state and the `E.after(1500…)`).
  Remove `sell_online_checking` from STR/@S if nothing else uses it. (Showing "Tu página dice Cerrado" would be true but reads like
  a failure in a 1.5 s flash; the compressed jump is the honest demo choice.) No voice change.

### MUST 2 (es + pt) — beat 0/1: the Team row says "2 en celular" before the third connection exists
- Where: page line 263 (`p.phones != null ? p.phones : PHONES`, PHONES = 2 for peluquería / veterinaria) — the panel at 0.0-1.4 s, behind
  the dialog, and again 8.6-9.5 s. CO "2 empleados · 2 en celular", BR "2 funcionários · 2 no celular".
- Evidence: with 0 paid connections only ONE device can exist besides the owner's phone: `StaffPhoneActions.kt:36`
  `if (!mayAddPhone()) return@launch` refuses the second phone (`ConnectionsGate` -> `needsConnectionForNewDevice`), and
  `StaffPhoneState.onPhonesCount` counts joined phones (`StaffPhoneState.kt:33-34`). The dialog the page shows (`conn_store_dlg_body_add`,
  "Agrega una primero y luego conecta el dispositivo") and the skip card ("+1 conexión · un teléfono de empleado conectado") only make
  sense if the second phone is NOT connected yet.
- Fix: keep a flag set by the beat-1 "Agregar una conexión" tap (e.g. `st.added = true` together with `st.skip = true`) and render
  `panel({storeOn: st.on, phones: (THIRD_IS_PHONE && !st.added) ? PHONES - 1 : PHONES})`: "2 empleados · 1 en celular" before the skip,
  "· 2 en celular" after it. taller-motos / unas (third device = tablet) stay as they are.

### MUST 3 (es + pt) — every Sell online page: the Support strip's sub-line is cut ("Reporta un problema …", "Relatar um problema …")
- Where: page line 25 (`.sv-strip small {white-space:nowrap; overflow:hidden; text-overflow:ellipsis}`); visible on the OFF page, address,
  hours and ON pages (beats 1-4), screenshots demo-03..06 of CO and BR.
- Evidence: `SupportStrip.kt:161` `Text(supportSub, style = PaperType.small, …)` has no `maxLines` / overflow, and the strip "grows with
  the text" (`heightIn(min = SupportStripMinHeight)`, :140): the app wraps "Reporta un problema aquí" to two lines in the ~136 dp left
  half, it never ends it in "…".
- Fix: let the left half's `small` wrap (`white-space:normal`, no ellipsis; keep `min-height` 57 so the strip grows). The right half
  ("Aún no hay reportes") fits; it can keep its rule. (Same CSS sits in V6, V7, V8, VS14-16, VS18, VS19: not reviewed here.)

### MUST 4 (app, money) — BR video: card 2 of the booking page shows the wrong "from" price (builder's problem 1, VERIFIED)
- Where: beat 5 (the client's page, 25.5-31.7 s BR): "Coloração completa · A partir de R$ 125,00", while the shop's own till and Mis
  serviços say "A partir de R$ 80,00". The voice says "Seu cliente vê seus serviços com os preços" over it.
- Evidence: `storefront-projection.js:145-149` `firstVariation` = the first `productVariations` row, and the snapshot reads them
  `ORDER BY id` (`PosDao.kt:1599`), i.e. the research order; `:291` publishes `price: v.price`; `public/store/app.js:357-358` prints
  "Desde/A partir de" + that number. The till uses the lowest priced choice (`ProductLibraryView.kt:344-346` -> `ServicesMenuRule.shownPrice`,
  `ServicesMenuRule.kt:37-42`). The page reproduces the app faithfully (`webPrice`, line 290-295).
- Impact per video: **CO OK** (the wrong cards are Peinado social and Retoque de raíz, cards 9-10, below the fold: first screen = tinte
  65.000, Balayage 248.000, Cepillado 18.000, all = lowest); **BR wrong on screen** (card 2); MX wrong on card 1 ("Desde $430.00" vs $280.00,
  no MX video).
- Fix: app first (publish the lowest PRICED choice of a FROM service; see app bug A1 for the $0 case), deploy the function, then change
  the page's `webPrice` FROM branch to the lowest priced choice (`s.price` in the kit is already that minimum). Until then: record CO only,
  hold BR. The page itself is right for today's app.

### nice 1 — beat 0: the lock dialog appears before the voice says "toca Vender en línea"
- The tap lands at +0.8 s (CO 1.4 s); with the REAL TS20 clip of this exact line (es 2.43 s, pt 3.00 s), "toca/toque" starts at about
  1.7 s / 1.9 s, so the dialog "Tu tienda online aún no está abierta" covers the panel while "Vender en línea" is said. Same as the
  recorded TS20. Fix if wanted: `wait: 1.0` on the beat-0 step (video only).

### nice 2 — beat 4: "por WhatsApp o Instagram" is said, neither is shown
- The app opens the Android chooser (`SellOnlineScreen.kt:457-459`); the page shows only the hop card. TS20/RS20 were recorded with the
  same line, and the services intro (unlike menu/products) never names Instagram. Keep, or (re-voice) "Toca Compartir y envíalo a tus clientes."

### nice 3 — pt beat 2: voice "horários em que podem agendar", screen "Quando seus clientes podem reservar"
- `sell_online_hours_heading_services` pt. "podem reservar" would match the screen word (only if this line is re-voiced anyway).

### nice 4 — subtitle of beat 1: "Se abre cuando usas tu tercera conexión" / "Ela abre quando você usa sua terceira conexão"
- The owner does not "use" it, a device does (the voice says it right). "Se abre con tu tercera conexión" / "Ela abre com sua terceira conexão".

### nice 5 — Sell online cards are a shade too light
- `SectionCard` is a default M3 `Card` (`SellOnlineScreen.kt:844-851`); with compose BOM 2024.12.01 (material3 1.3.x) its container is
  `surfaceContainerHighest` = `PlatataOutlineVariant` #E5E5EA (`Theme.kt`, `Color.kt:78`). The page uses #F2F2F7 (line 72). Change `.scard`
  background to #E5E5EA (the panel rows stay #F2F2F7: `WorkspaceRow` sets surfaceVariant).

### nice 6 — the locked "Paga en el negocio" switch
- M3 disabled + checked: track `onSurface` at 12 % (very light grey), thumb `surface` (white). The page draws the ON switch at 38 % opacity
  (mid grey track). Use a #1C1C1E-at-12 % track with a white thumb.

### nice 7 — small things
- Address page: the keyboard disappears by itself 0.4 s after typing (page line 384); in the app it stays until Next. Harmless.
- Comment refs drifted: `MainPage` starts at `SellOnlineScreen.kt:245`, the status listener is :125-128.
- Info for the planner, not a page fix: the time-skip stands for a Google Play purchase; until the 8 `platata_connections_N` products
  exist in Play Console, `PlayConnectionsGateway` answers "not available" (CONN-4), and the booking page needs the storefront functions
  deployed (`_BUILD-BRIEF.md:12`). Record only after Monti says both are live.

### Builder's known list, re-verified at 37db6d6c
1. "Desde" = first stored choice: TRUE (MUST 4 above). Also on the owner's side, see A2.
2. Plate emoji: TRUE. `CatalogDaoStore.kt:242` names the trade category with `categoryEmojiFor(name)`, whose `else` gives "🍽️"
   (`CategoryEmoji.kt:5-24`); `PosViewModel.kt:752` backfills every blank emoji the same way. Shown on the ON page (`SellOnlineScreen.kt:394`)
   — beats 3-4 on both videos — and on the client's Products chips (`app.js:247`, not shown).
3. Empty "Otros servicios" chip: TRUE. Every services shop is seeded with the system category `services_cat_other` (`SeedStore.kt:176-191`,
   re-ensured at launch), `storefront-projection.js:254-257` publishes every non-hidden category, `app.js:247` draws a chip per category.
   Not in the video (Products tab never opened).
4. "pedidos"/"productos" words: TRUE at the lines given (`SellOnlineText.kt:63`, `SellOnlineScreen.kt:313,329,376,471,551,735,416,397`;
   `ConnectionDialogs.kt:107,117`). On the video: "Abierta, recibiendo pedidos", "…los pedidos nuevos", "Pago al pedir en línea",
   "Pedidos en línea", "Aquí es donde piden tus clientes". The voice avoids all of them. Round 2 gave the Connections page
   "Página de reservas" (`conn_store_*_services`) but not this dialog.

---

## App bugs the builder did not list

- **A1 (money)** — a FROM service whose FIRST stored choice is unpriced is published as "Desde $ 0". `storefront-projection.js:197` skips the
  unset-price check for bookable services and `:291` publishes the first variation's price; `Product.UNSET_PRICE = 0.0` (`Product.kt:67`).
  Real case: Colombian "Retoque de raíz", first choice "Con producto del salón" has `price_co: null` in `assets/catalogo_investigado/peluqueria.json`,
  so `CatalogoInvestigadoATienda.kt:122` stores 0.0; an owner who does not type it gets "Desde $ 0" on the booking page while the till says
  "Desde $ 40.000". (The demo hides it because the kit's owner typed 70.000.) Fix together with builder #1: lowest priced choice; none -> "Precio en el local".
- **A2 (small)** — the owner's Sell online category page lists a FROM service at its first choice's price, without "Desde":
  `OnlineStoreSellable.kt:115` (`ctx.firstVariation[p.id]?.price`) -> `SellOnlineScreen.kt:777`. Peinado social shows "$ 90.000". Fix: same
  lowest-priced rule + the "Desde" word for FROM.
- **A3 (small)** — right after "Encender la tienda" a new owner reads "Tu página dice Cerrado" for the seconds the turn-on push takes,
  because the Paso 1 push already minted the slug with the store off (`functions/index.js:3774-3775`; `SellOnlineText.kt:64`). Fix:
  while `settings.enabled` is true and the status is still CLOSED, show `sell_online_checking` (`SellOnlineScreen.kt:262-265`).
