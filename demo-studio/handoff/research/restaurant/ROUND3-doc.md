# Marketer to coder: round 3 (updated 21 Oct 1:10 AM PT: R24–R27 are new; R26 is money shown wrong in Reports)

All items were read at 6736ddfb; nothing was run on a phone. FOLLOW-1 items are not repeated. pt refund_paid_left needs no change. The project is full, so the complete retail list (34 items) is kept by the marketer; the most important retail items are below.

```
Code at 6736ddfb, branch sim/usa-canada. Edit only. Do not build, run, install or verify.

URGENT
A. dict_download_url: es, pt-BR and fr point to v1.1 (606 MB), en to v1.2 (31 MB). A shop can't be created without this download. Use v1.2 for every language, keep the URL in one Kotlin constant, add a test. The page also says "Creando tu negocio…" for an existing shop. Check that the launch gate never sends a counter tablet there.
B. Every new shop's receipt ends with the English "Thank you for shopping with us!" (ReceiptConfig.kt:24; SeedStore.kt:75 and 245 set only storeName). Seed the footer in the shop's language.
C. Menu from a photo picks the wrong photos: Cheeseburger gets a fish burger, Mac & cheese gets cheesecake, Lemonade gets limonada de coco, Soda gets guaraná. A word inside another word counts as a match (MenuImageMatcher.kt:70-74). Match whole words only and prefer the longest match.

Restaurant
1. The refund note "La devolución incluye su parte de la propina" (es/pt:406, en:423; TransactionsScreen.kt:1803) is false: a tip is refunded whole, and only when its own line is ticked. Say "La propina va en su propia línea: márcala para devolverla." / "A gorjeta tem sua própria linha: marque-a para devolvê-la." / "The tip has its own line: tick it to refund it."
2. An unnamed ready order reads "Pedido lista" / "Pedido pronta" (OrderReadyEffect.kt:27). Add "Pedido listo" / "Pedido pronto" / "Order ready". The ready message uses the full name ("¡Juan Restrepo, tu pedido…", OrderFlowActions.kt:118-120); use the first name only.
3. combo_error_no_items now says "plato", but NewDealScreen.kt:231 (via ComboSaving.kt:78) also uses it for services and shops. Split the string.
4. The pairing screen still says "celular principal" (connect_device_where, connect_device_code_changes). Use "teléfono principal". pt "Conectar uma tela de cozinha" (pt:5540): use "Tela da cozinha" like everywhere else.
5. Lowercase pt "Enviar para Cozinha" (pt:354) and en "Send to Kitchen" (en:369).
6. Restaurant screens still say "productos": combo_empty_line, combo_slot_overline_main, menu_onboarding_page_cap_body, menu_review_add_btn ("Agregar N artículos"). Use "platos" / "pratos".
7. The employee-pay "switched itself off" notice shows only on Team (TeamManagementScreen.kt:300, 462). Also show it once on Home, like OpenRegisterNoticeEffect.
8. With no name and no table, the save message and the amber bar show the device's own "#id" (SavedTicketNotice.kt:39, OpenTicketBanner.kt:131). Show the order type ("Para llevar") instead.
9. Round 2 #15 never reaches the waiter: the button beside Cobrar is on the cart step, which a restaurant's cart bar skips (MiniPosSellScreen.kt:412-420, 519-520, 750-756). Put it beside Cobrar on the pay step.
10. US/CA: a business with no device yet has no Connect button on the Connections page (ConnectionsScreen.kt:117, 141-163).
11. Kitchen ticket window: it shows the table twice ("Mesa 7 … Mesa 7"), and for an unnamed to-go order "Para llevar" twice (KdsTicketDetailDialog.kt:97-118). Hide the right-hand label when it equals the title. Two unnamed to-go cards look the same (KdsTicketCard.kt:93): add the time or the first name. The add flow's "Tipos de pedido" lists dining options that are switched off (KdsAddFlowScreen.kt:145). On a tablet the two choice tiles are different widths (PaperChoiceTile.kt:33).
12. Google sign-in: the subtitle and the first benefit line are the same sentence (GoogleAuthScreen.kt:381, 389).
13. The WhatsApp register summary is padded for a 32-column printer, so its columns are crooked in WhatsApp (ShiftSummaryText.kt:53-108). Send plain lines.
14. One sale has three names: "Venta #27", "#27" and "Venta n.º: 27" (ReceiptFormatter.kt:328). Pick one.
15. The receipt date is always dd/MM/yyyy, also in the US (ReceiptFormatter.kt:157). Follow the locale.
16. Colombia: the pay screen offers "Configurar QR o tarjeta" when the card is already set up (PayWaysVisibility.kt:64).
17. The camera's "Listo (N)" button is dark on the black camera panel (MenuCameraScreen.kt:195-205). The Support strip shows under the camera (ReportLevels.kt:47); set that page to NEVER.
18. The dish form's price box shows the raw "38000" (ItemsScreen.kt:1135-1143); use MoneyVisualTransformation. "Vinculado a N platos" should be "Vinculada" (an adición). "Elegir todos" and the dish chips in the add-on dish chooser are under 48 dp (ModifiersManagementScreen.kt:903-940).
19. Combos: no combo pill on the waiter phone or tablet tiles (only HomeScreen.kt:972 passes it). "Completa tu combo" rows are about 40 dp tall with no prices (ComboLinkedItemPickerSheet.kt:52-66).
20. Printers: the kitchen slip prints "Mesero: <owner>" on the owner's own sale, and the fallback name "Tienda Local" is Spanish in every language (CheckoutActions.kt:608, PosViewModelTypes.kt:545). With only an order printer, the footer says "Enviar a cocina" but the pay step says "Guardar": the pay step counts kitchen screens, not printers (CheckoutSheetBody.kt:315). The paper says "Página de prueba" while the screen says "hoja de prueba" (es:2278, 2883). The pt text says "toque em Buscar" but the button reads "Procurar impressoras" (pt:2866).
21. Offline, the waiter phone shows "Enviado a cocina: Mesa 4" while its own strip says the order hasn't reached the kitchen (MiniPosSellScreen.kt:232: pass kitchenKnown && isOnline).
22. Security: tapping "Mostrar" on the refund PIN asks "¿Cambiar la configuración de seguridad?" though nothing changes (SecurityScreen.kt:66-70). Give it its own "see your PIN" title.
23. Back office words: Colombia's card-fee note squeezes the card-sales label to three lines (ShareAccountantScreen.kt:367). team_code_sub doesn't say the PIN is also used to join a waiter phone (TeamManagementScreen.kt:1612). Saved discount cards are white on white with no edge (DiscountsManagementScreen.kt:455). Before a value is typed, the discount sentence reads "Descuenta — …" (DiscountFormScreen.kt:255). The empty taxes list says "Toca +" but the button reads "+ Nuevo" (TaxesManagementScreen.kt:341). "Nombre del Impuesto" is in title case.

24. combo_category_item_count is not a plural: it shows "1 pratos" / "1 dishes". Use <plurals>.
25. The printer test page splits words at 32 columns ("la impresor / a funciona"). Wrap on spaces, as TicketWrap does.
26. team_new_pin_notice says the PIN "no se vuelve a mostrar completo" / "will not be shown in full again", but the employee form shows it again with Mostrar (TeamManagementScreen.kt:349; EmployeeCodeRow 1422, 1624). Say: "PIN de %1$s: %2$s. Anótalo y dáselo. Lo ves de nuevo en su ficha con Mostrar." (same in pt, en).
27. The Add connections page builds its circles with ConnectionsOverview.build(false, pending, null, emptyMap(), 0) (AddConnectionsScreen.kt:252), so included slot 2 reads "Libre" while a register is in it and the page before says "Caja principal". Pass the same device infos the Connections page uses.
28. backup_drive_note prints a literal "Drive/Platata/[Negocio]" ("[Business]", "[Negócio]"). Use %1$s with the business name.
29. restore_confirm_body: "con la instantánea del %s", where %s is "<negocio> — <fecha>", reads "la instantánea del La Fonda de Marta — 20/10/2026…". Say es "…con el respaldo «%s»…", pt "…pelo backup «%s»…", en "…with the backup “%s”…".

Retail
R1. Owner phone, "Fiar a Juan": the sale is saved, but the screen stays on the pay step with an empty $0 sale and no "Fiaste $X" screen (fiarCurrentCart in CartActions.kt:684 finalizes; only the charge button navigates, HomeScreen.kt:1240-1290). Also look up the fiado tender by systemKey "fiado", not getPaymentMethodByName("Fiado").
R2. A partial refund of a fiado sale says "Se descuenta de la cuenta de Ana", but the debt does not change.
R3. The picker says "3.523 productos con código", but 3,523 is the NO-barcode catalogue.
R4. "Sin código" picks are filed under new English categories ("Fruits & Vegetables"); map them onto the 24 ready-made categories. Searching "pan" finds pana, panko, paneer… but no bread.
R5. Shops are seeded with the restaurant "Cargo por servicio" and are offered Impoconsumo 8%.
R6. Unit names are untranslated ("Kilogram") in the weight keypad, the Sin código grid and the receipt. In US/CA the Sin código default unit is Kilogram, not Pound.
R7. Not plurals: "1 llevan…", "Salda 0/1 fiados completos". A debt under 15 days is green, the colour for "paid".
R8. Settle with "Todo": "Salda 2 fiados completos. Le quedan debiendo $ 0." — say the client is fully paid when nothing is left (FiadoMoneyScreens.kt:293).
R9. A staff PIN session on the owner's phone sees every balance and can Settle/Forgive: CustomerCrmScreen.kt:119 checks the device role, not ReportsAudience.isOwnerView; CustomerFiadoActions.kt:87-95 has no check.
R10. Clientes total and each client's amount use the global CurrencyConfig (CustomerCrmScreen.kt:303, 658) — same bug class PHONEFIX-1 fixed on the register card.
R11. Brazil and Argentina WhatsApp numbers grouped wrongly on the client page: "+55 119 123 456 78" (WhatsappUtils.kt:132-153).
R12. A cash payment on a tab taken while the register is closed lands in no drawer, with no warning (CustomerFiadoActions.kt:87-89).
R13. The client's purchase list doesn't mark which sales went on the tab (CustomerPage.kt:212).
R14. The WhatsApp reminder greets with the full name; other fiado screens use the first name (CustomerPage.kt:92).
R15. (Product) Nothing records when a reminder was last sent.
R16. Camera "Cobrar" badge counts lines while the pay screen counts units (2 vs 3): ScannerScreen.kt:65 uses cart.size; use sumOf { it.quantity }.
R17. Scan form and "Sin código" price fields show a raw "7.90" with a dot in comma countries (ScannerScreen.kt:443, BarlessShelfScreen.kt:521): MoneyVisualTransformation.
R18. Tablet "Catálogo" chips list all 24 seeded categories, most empty (ProductLibraryView.kt:206, fed by MamaPosScreen.kt:1095): pass only categories with a product.
R19. Counter tablet code page says "Conecta este celular y la tablet al mismo WiFi", but a counter tablet pairs over the internet (CounterRegisterSyncInfoScreen.kt:85-88).
R20. Sell online page lists all 24 shop categories, ~20 of them "0 de 0 en línea", pushing "Fuera de tu tienda online" far down (OnlineStoreSellable.kt:100-111): list only categories with products.
R21. Deleting a customer the shop OWES money to: confirm + fingerprint, the form closes, but the delete is silently refused (CustomerCrmScreen.kt:1035, CustomerFiadoActions.kt:227-233, FiadoStore.kt:182-185). Say why.
R22. English blocked-delete message says "in fiado" and "this customer" (values/strings.xml:1005).
R23. A shop's Businesses list says "Copia este menú" / "su propio menú y equipo" (ContextSwitcher.kt:355, 387): "productos" for shops.
R24. The no-barcode catalogue's pt-BR file has Spanish names ("tomate riñón", "tomate chonto"), and the English file has Colombian varieties (catalog_pt-br.db, catalog_en.db). Brazil and the US see them in Sin código search.
R25. The icon backfill fails on plural names ("Tomatoes" gets no drawing).
R26. MONEY DISPLAY: Reports "Cómo te pagaron" lists Fiado as a way you got paid; its rows add up to $184.650 while "Total cobrado" is $145.850 (fiado is not money collected). Leave Fiado out of "How you got paid" (it has its own "En fiado (sin cobrar)" line), so the rows add up to Total collected.
R27. English and Portuguese owner chooser says "A register" / "Um caixa", but the tablet calls itself "Counter tablet" / "Tablet do balcão". One name.
```

On videos already (fix these first, please): B (receipt footer), C (menu photo match), R1 (screen after "Fiar a Juan"), R5 (shop seeded with the service charge), 26 (the new-PIN message), R6 (unit names).

For Monti tomorrow (no change yet):
- Stock drops only on the device that made the sale, and the owner's next sync overwrites the tablet's count. Should stock be one number for the whole shop?
- Staff can never sell on fiado (no screen gives canFiar), yet the tablet and staff phone show a "Fiar a Juan" button that looks live. Should staff be allowed to?
- The barcode list is in Spanish with Colombian prices. Should it go to Brazil and the US?

## Marketer check of MERGE-12 (2fd8f9a3), 21 Oct 4:15 AM PT

Thank you: A, B, C, 9–20 and R1–R7 are in the demos now and being re-recorded. R1 English (menu from a photo) is released. Still open, small:

```
Code at 2fd8f9a3, branch sim/usa-canada. Edit only. Do not build, run, install or verify.
M1. TaxesManagementScreen.kt:173: TaxPresets.rivalOf ignores the business type, so a SHOP in Colombia that picks IVA sees "los restaurantes cobran impoconsumo…". Show that line only for restaurants. (On the TS17 video.)
M2. CustomerPage.kt:203: the client's purchase rows still say "#27", not "Venta #27" like the receipt, sales list and reports.
M3. MenuImageMatcher: in the US, "Soda" gets the Postobón bottle photo. Please give it no photo (a branded bottle on a US menu looks wrong).
M4. NoBarcodeCatalog search ranks "toma corriente" above "tomate" for "toma" (minor; food first, or whole word first).
```
