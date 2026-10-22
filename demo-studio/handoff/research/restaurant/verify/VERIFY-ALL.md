# Restaurant fixes checked against the code (20 Oct 2026, commit 0eac2554)

Totals: 213 items. 181 fixed, 26 partly, 5 not fixed (4 on purpose or by decision), 1 needs a device. Prompts for what is left: features/CODER-PROMPTS-RESTAURANT-ROUND2-20oct.md

---

# Check of PROMPT 1 and PROMPT 2 against the real code

Code read at 0eac2554 (sim/usa-canada, 20 Oct 2026), compared with d1b7698d. Read only. Paths are under
`app/src/main/java/com/example/` unless they start with `res/`.

Counts:
- PROMPT 1 (12 items): 11 fixed, 1 partly, 0 not fixed, 0 can't tell
- PROMPT 2 (25 items): 23 fixed, 2 partly, 0 not fixed, 0 can't tell

"Fixed" means the code does it. Items 1-10, 1-11 and 2-8, 2-14 also need a real device (printer, drawer, kitchen tablet, camera) before anyone can say they work on a phone. The code path is there and wired.

---

## 1. PROMPT 1: Money, drawer, serious problems

| # | Item (short) | Verdict | Evidence |
|---|---|---|---|
| 1 | Cash drawer never opens | FIXED | Switch "Abrir el cajón después de una venta en efectivo" on the receipt printer page: `ui/screens/onboarding/ReceiptPrinterTestSection.kt:80-99`, writes `cash_drawer_enabled` (`ui/pos/DrawerOpenActions.kt:37-39`, same HardwarePrefs file the sale reads). Sale kicks the drawer: `ui/pos/CheckoutActions.kt:599-600`. The per-method switch in Payment methods now appears once it is on (`ui/screens/settings/PaymentMethodsScreen.kt:107, 350-371`). es/pt/fr strings present. See new problem 1. |
| 2 | Order-ready WhatsApp never opens | FIXED | Number from `whatsappNumber`, `phoneNumber` only as fallback: `utils/ReadyWhatsappNumber.kt:15-21`, used in `ui/pos/OrderFlowActions.kt:113-122`. No number: card stays and toast `ready_ping_no_whatsapp` "Este cliente no tiene WhatsApp" (`ui/screens/mamapos/MamaPosScreen.kt:1501-1505`). |
| 3 | "Can't take cards" in every country | FIXED | Hint and bar only when `stripeTenderAvailable` (US/CA): `sync/CardDeviceCopy.kt:32-36`, `ui/screens/home/CheckoutSheetBody.kt:181, 482, 578`; Home strip too (`ui/screens/home/HomeScreen.kt:435-437`). Wompi path ignores NFC (`CheckoutSheetBody.kt:578`). |
| 4 | Tip / service fee only on owner phone | FIXED | `OptionalFeeGate` no longer excluded on `inlineCheckout` (tablet, waiter phone): `ui/screens/home/CheckoutSheetBody.kt:1171-1182`; never shown on an empty cart (`:643`). |
| 5 | Every included tax prints "IVA incluido" | FIXED | `utils/ReceiptTaxNames.kt` (own name, joined with " + ", fallback to old word); used for added AND included lines in `ui/pos/ReceiptActions.kt:109-119`; `receipt_tax_named_included` "%s incluido" / "%s incluído" / "%s included". Known limit: a reprint of an old sale uses the shop's CURRENT tax names. |
| 6 | Closing register with unpaid tables | FIXED | `sync/OpenTablesAtClose.kt`; asked before the held-money check: `ui/screens/cash/CloseRegisterScreen.kt:74-76, 157-158, 170-185, 255-285`. es "Tienes 3 mesas abiertas sin cobrar ($ …). ¿Cerrar igual?", pt and en present; non-restaurant says "pedidos". |
| 7 | Two keypad styles in one shift | PARTLY | Open register, Close register, Cash in/out and the client Settle/Forgive now use the pay-screen rule (`ui/screens/cash/MoneyKeypadEntry.kt`; `OpenRegisterScreen.kt:40-89`, `CloseRegisterScreen.kt:149-151`, `CashMovementEntryScreen.kt`, `customers/FiadoMoneyScreens.kt`). NOT done: the till's own Keypad tab (custom amount) still reads digits as cents with a "00" key in 2-decimal countries: `ui/screens/home/KeypadView.kt:52`, `ui/pos/CartActions.kt:69-80`, `utils/CurrencyUtils.kt:58-61` (÷100). So in the US 1-2-5 is $1.25 on the Keypad tab and $125 on the pay screen, in the same shift. Same in `ui/screens/guide/PriceKeypadPage.kt:87-89` (services setup). |
| 8 | Tip not on paper receipt (US/CA) | FIXED | `ReceiptPrintData.total = StripeTip.chargedTotal(...)` and `tipAmount = stripeTip`: `ui/pos/CheckoutActions.kt:557-560`; tip line printed above the total `PrintManager.kt:370`. Reprint also carries the tip (commit 2f4f76a7); the two fallback renderers too (c8779678). |
| 9 | "Término de cocción" allows two points | FIXED | Ideas page starts from the idea's own rule (pick one, optional): `ui/screens/modifiers/ModifiersManagementScreen.kt:122-126`; dish Ideas tab uses the same template values `ui/screens/modifiers/AddOnIdeasTab.kt:97-107`; template `data/ModifierTemplates.kt:54-59`. "¿En qué platos?" row now on the ideas-page editor and links are saved on create: `ModifiersManagementScreen.kt:460-473, 315-320`. |
| 10 | Kitchen settings never reach kitchen tablet | FIXED (code; not provable without a tablet) | Host sends both switches with every kitchen feed `sync/SyncHostService.kt:598-606` (`LanSync.K_KDS_MODS`); tablet stores them `sync/LanSyncClient.kt:454-457`, `sync/KdsModifierSettings.kt`; screen uses the host copy on a KDS `ui/screens/kds/KitchenDisplayScreen.kt:113-119`. |
| 11 | Waiter "Conectar" does nothing, no business code | FIXED | After Conectar the row shows "Invitado" and "Código del negocio XXXX · PIN 1234" plus "Enviar invitación": `ui/screens/connections/ConnectEmployeePhoneScreen.kt:64-66, 229-256`. Team page shows the business code card (owner view only): `ui/screens/team/BusinessCodeCard.kt`, `ui/screens/team/TeamManagementScreen.kt:276, 445`. es/pt/en strings present. |
| 12 | Comped dishes at full price in Reports | FIXED | Top items and by-category count a comp sale line at 0: `data/PosDao.kt:1276, 1284` (`pm.systemKey = 'comp'`). |

## 1. PROMPT 2: Menu from a photo, editor, add-ons

| # | Item (short) | Verdict | Evidence |
|---|---|---|---|
| 1 | False "Verificamos 3 veces" | FIXED | `menu_onboarding_phase_ai_hint` is now "Revisa los nombres y los precios antes de guardar." (es, pt, en, fr). One AI request: `MenuImportService.kt:107-145`. |
| 2 | AI errors hard-coded English / raw | FIXED | `data/MenuImportFailure.kt` (6 reasons, each a string in 4 languages); screen shows only `reason.textRes` (`ui/screens/items/MenuOnboardingScreen.kt:90-94`, `MenuImportService.kt:183`). |
| 3 | "Intentar de nuevo" does not retry | FIXED | `retryMenuImport()` reruns the same files, or the text already read (`ui/pos/MenuImportActions.kt:74-78`, `MenuImportService.kt:89, 102`). Small gap: a camera photo that fails BEFORE its text is read (blank photo) has nothing to retry, so the button resets to the start (and on the register-hosted page that closes the page). |
| 4 | "encontrados en la foto" for a PDF | FIXED | `menu_review_build_subtitle` = "%1$d platos encontrados en tu menú" (es), "pratos … no seu cardápio" (pt), "dishes found in your menu" (en). |
| 5 | Review: price looks like text, names not editable, no category | FIXED | Name is a text field, price is a real money field, category shown under the name: `MenuOnboardingScreen.kt:349-391, 401-418`; saved via `editedName` / `correctedPrices` (`data/MenuImportReview.kt:29-37, 145-155`). See new problem 4. |
| 6 | Sizes: only first size shown | FIXED | One line + price field per size: `MenuOnboardingScreen.kt:385-397`; every size saved with its own price `data/MenuImportReview.kt:145-155`. |
| 7 | AI not told country/currency | FIXED | `data/MenuImportPrompt.kt:12-56` builds the rule from the shop's currency separators; passed in `ui/pos/MenuImportActions.kt:95-96`, `MenuImportService.kt:109`. "29.200" only for a no-cents currency. |
| 8 | "OK (%d)", bare Sí/No, 20dp x, no shutter label, tips unused | FIXED | `menu_camera_ok` "Listo (%d)"/"Pronto (%d)"/"Done (%d)"; cancel dialog now "Descartar" / "Seguir editando" (`MenuOnboardingScreen.kt:97-108`); remove touch area 48dp + label `ui/screens/items/MenuCameraScreen.kt:222-231`; shutter label `:255`; tips card shown once per phone `:215, 267-277`. See new problem 6 (wording). |
| 9 | No "N agregados" after import from Tu menú | FIXED | Toast "N platos agregados" when the import ends in place (`ui/pos/MenuImportActions.kt` ~150-155, `announceInPlace`); register page has its own snackbar. |
| 10 | Stock photo matches half the words | FIXED | Every significant word of the shorter name must be in the other, fragments under 4 letters never count: `utils/MenuImageMatcher.kt:42-74`. |
| 11 | Second size price can't be seen/changed | FIXED | `ui/screens/items/DishSizePrices.kt`, drawn for a restaurant dish with 2+ sizes `ui/screens/items/ItemsScreen.kt:1189-1210`. See new problem 3 (first size shown twice). |
| 12 | Empty category blank; delete with no confirm | FIXED | Empty text "No hay platos en esta categoría" `ui/screens/items/CategoryItemsScreen.kt:143-153`; confirm dialog `:113-117, 219-226`. |
| 13 | Rows repeat category name; no "Desde" | FIXED | Row shows only the price, "Desde $X" for several sizes: `CategoryItemsScreen.kt:182, 191-196`, `DishSizePrices.kt:62-73`. |
| 14 | Photo from gallery only | FIXED (camera flow needs a phone) | Menu with "Tomar una foto", "Elegir de la galería", "Quitar la foto": `ItemsScreen.kt:1073-1090`, `ui/screens/items/ItemPhotoCamera.kt:31`. |
| 15 | "Producto"/"artículo" mixed; pt Menu/cardápio | PARTLY | Restaurant now gets "Editar plato", segment "Plato", button "Crear Plato" (`ItemsScreen.kt:1000, 1028, 1451`), lists and add-on strings say plato/prato. Still in the dish flow: delete button "Eliminar artículo" (`items_delete_item`), discard dialog "¿Descartar este artículo?" (`items_discard_title`), empty list "Aún no hay productos" (`items_empty_list`), import "agrega tus productos a mano" (`menu_onboarding_no_text`). pt: camera tip "✓ Menu completo dentro do quadro" (`res/values-pt-rBR` `menu_camera_tip_1`), now shown to everyone. |
| 16 | 34dp "+" and −/+ buttons | FIXED | `DesignTokens.RoundActionButtonSize = 48.dp` (`ui/theme/DesignTokens.kt:29`); add-on step buttons use it `ui/screens/home/ModifierSheetContent.kt:408-420`. |
| 17 | "N en uso" counts unused add-ons | FIXED | Only add-ons linked to a dish: `ui/screens/items/YourMenuScreen.kt:70-76, 105`. |
| 18 | Empty Tu menú says "Crea una categoría" first | FIXED | Two doors, photo first: `ui/screens/items/MenuLayoutParts.kt:210-231` ("Crear mi menú desde una foto", then "Crear una categoría"); wired for restaurants `YourMenuScreen.kt:92`. |
| 19 | Can't reorder | FIXED | Room 128 `sortOrder` (`data/PosDatabase.kt:64`, `data/PosDao.kt:169-182, 356-382`); "Ordenar" with up/down arrows on Tu menú and category page (`YourMenuScreen.kt:57-60, 94-96`, `CategoryItemsScreen.kt:155-169, 198-204`). Editing a dish keeps its place (commit cf24dc2a). |
| 20 | Ideas page title, no tabs, back leaves section | FIXED | Title "Ideas de adiciones"; Back from ideas returns to the list first: `ui/screens/items/CategoryHubScreen.kt:143-147, 190`. (Still no tabs, but the title and Back now make sense.) |
| 21 | Every idea says DESACTIVADO, one emoji | FIXED | No pill on idea cards (only made ideas could show one, and they are filtered out) `CategoryHubScreen.kt:204, 398-420`; own emoji per idea `:52-54`. |
| 22 | Two editors use different words; Requerido hidden | FIXED | Both editors use `modmgmt_pick_many/one` ("Elegir VARIOS / UNO") and show `common_required`: `ModifiersManagementScreen.kt:656, 682, 703, 1096, 1113, 1122`. |
| 23 | Optional pick-one can't be un-ticked | FIXED | `ui/screens/home/ModifierSelectionLogic.kt:27+` (second tap un-ticks an optional pick-one), used by `ModifierSelectionSheet.kt:205`. |
| 24 | Spanish words | FIXED | "Activa"; "…de todos los platos que la usan"; "¿En qué platos?" rows say "plato"; "Nivel de picante"; "Poco asado / Jugoso / Término medio / Tres cuartos / Bien asado"; dips "Aderezos aparte: Salsa rosada, Salsa de queso, Vinagreta, Salsa BBQ, Miel y mostaza" (`res/values-es/strings.xml`). pt keeps "Ranch"/"BBQ" (item was about Spanish). |
| 25 | Add-on picker shows names only | PARTLY | Choices and prices are listed only when the add-on has 3 choices or fewer: `ui/screens/items/AddOnChoicesLine.kt:9-12`, `ItemsScreen.kt:1776`. Most ready-made ideas have 4-5 choices (Término de cocción 5, Aderezos 5), so in the demo they still show the name only. |

---

## 2. New problems

1. **Drawer switch says "cash sale" but opens on every sale.** `ReceiptPrinterTestSection.kt:89` label "Abrir el cajón después de una venta en efectivo", while the hint below says "después de cada venta" and every payment method's own drawer switch defaults to ON (`ui/PosViewModel.kt:4845-4846`, `getBoolean("drawer_…", true)`). So after turning it on, a card, QR, Nequi, "Cortesía" or fiado sale also kicks the drawer open. Matters: the cashier sees the drawer pop on a card sale, and the label promises something else. Fix: default the per-method switch to on only for `systemKey == "cash"`, or reword the label.
2. **The till Keypad tab still types cents** (rest of Prompt 1 #7). `KeypadView.kt:52` "00" key, `CurrencyUtils.kt:58-61` ÷100. In US/CA/PE/PA/EC the same shift still has two keypad styles (Keypad tab vs pay screen, Open/Close register). Money typed wrong by 100x is easy.
3. **First size price box shown twice on a dish with sizes.** `ItemsScreen.kt:1131-1139` keeps the plain "Precio" box, and `DishSizePrices` row 0 (`:1193-1198`) is the SAME value (`priceStr`) again under "Precio de cada tamaño". Two boxes for one price, one of them without a size name; the owner may think the top one is a separate base price.
4. **Menu review: clearing a field does not do what it shows.** `data/MenuImportReview.kt:33`: an emptied name field silently saves the AI's original name. `MenuOnboardingScreen.kt:407-409`: an emptied price saves 0, so a restaurant dish can be created at $0 with no warning (the dish form itself refuses a 0 price, `ItemsScreen.kt:1173-1185`).
5. **Retry after a blank camera photo starts over.** `MenuImportService.kt:89, 101`: camera photos have no retry source before their text is read; "Intentar de nuevo" then resets (`MenuImportActions.kt:76`), and on the register-hosted import page Idle closes the page, so the owner lands on the register. Only this one case; files and the AI step retry fine.
6. **Cancel dialog words while the AI is working.** `MenuOnboardingScreen.kt:97-108`: "¿Perder tu escaneo?" with buttons "Descartar" / "Seguir editando", also shown during "Leyendo / Hablando con la IA", when nothing is being edited. Small, but confusing in the demo.
7. **"plato" leftovers in the dish flow** (rest of Prompt 2 #15): "Eliminar artículo", "¿Descartar este artículo?", "Aún no hay productos", "agrega tus productos a mano"; pt "Menu completo". Also the create button reads "Crear Plato" with a capital P (es title case).
8. **pt sizes question has no accents** (old, now on the restaurant dish form every time): `sizes_ask_title` "Voce vende outros tamanhos?" and `sizes_ask_subtitle` "Cada um com seu preco." (`res/values-pt-rBR/strings.xml`).

No dead taps or English left in es found in the changed screens. es uses "tú" in the new strings (Actívalo, Revisa, Intenta).

---

## 3. Demo changes

**R1 (menu from a photo)**
- Waiting screen hint now "Revisa los nombres y los precios antes de guardar." (no "Verificamos 3 veces").
- Camera: a "Para una buena foto" tips card the first time; button "Listo (N)" not "OK (N)".
- Review: each dish has an editable name box and a real price box per size; the category shows under the name; subtitle "N platos encontrados en tu menú".
- Errors are plain sentences (no internet, IA ocupada, tardó demasiado…); "Intentar de nuevo" retries the same menu without going back to the start.
- After saving from Tu menú: toast "N platos agregados". Cancel dialog buttons "Descartar" / "Seguir editando".

**R2 (edit the menu)**
- Empty Tu menú: big "Crear mi menú desde una foto" first, "Crear una categoría" second.
- New "Ordenar" button with up/down arrows (categories and dishes), "Se guarda al instante".
- Dish form: title "Editar plato", button "Crear Plato"; with 2+ sizes a block "Precio de cada tamaño" (one box per size; the first size also still in the top Precio box).
- Photo box opens a menu: Tomar una foto / Elegir de la galería / Quitar la foto.
- Category page: no repeated category name, "Desde $X" for dishes with sizes, "No hay platos en esta categoría" when empty, delete asks first.
- "N en uso" counts only add-ons on a dish. Black "+" buttons bigger (48dp).

**R3 (add-ons)**
- Ideas page title "Ideas de adiciones"; Back goes to the list first; no "DESACTIVADO" on idea cards; each idea has its own emoji.
- "Término de cocción" from either door is pick one, optional; options "Poco asado, Jugoso, Término medio, Tres cuartos, Bien asado".
- Ideas-page editor now has the "¿En qué platos?" row.
- Both editors say "Elegir VARIOS / Elegir UNO" and show "Requerido". Pill "Activa"; "Nivel de picante"; dips "Aderezos aparte".
- At the till a ticked optional pick-one choice can be un-ticked with a second tap; add-on −/+ buttons bigger.
- Dish form add-on picker lists the choices and prices only for add-ons with 3 choices or fewer.

**R6 (waiter phones) / S14 (team) / S19 (connections)**
- After "Conectar" the row shows "Invitado" and "Código del negocio XXXX · PIN 1234", plus "Enviar invitación".
- Team page has a "Código del negocio" card with Copy.
- Waiter phone pay step asks the propina / servicio Sí/No card.

**R7 / R8 (kitchen screen and settings)**
- "Mostrar en rojo" and "Ocultar en la pantalla de cocina" now take effect on the paired kitchen tablet (needs the tablet connected to the owner phone's Wi-Fi host).

**R9 (counter tablet)**
- Pay step asks the propina / servicio Sí/No card.

**R10 (printing)**
- Receipt printer page: new switch "Abrir el cajón después de una venta en efectivo" (off by default) under "Abrir cajón"; turn it on before demoing the drawer. Then each payment method gets its own "Abrir cajón" switch.
- Paper receipt: tax line uses the tax's own name ("Impoconsumo 8% incluido"); US/CA tipped sale prints "Propina $X" and the real total.

**R11 (order ready)**
- Green button opens WhatsApp with the customer's WhatsApp number; with no number the card stays and a toast says "Este cliente no tiene WhatsApp".

**S2 (open register) / S9 (cash in/out) / S10 (close register)**
- Keypads now type whole units with a decimal key (1-2-5 = 125), no "00" key in cents countries. (The Home Keypad tab still uses the old cents style.)
- Close register with open tables: dialog "Antes de cerrar · Tienes N mesas abiertas sin cobrar ($X). ¿Cerrar igual?" with "Cerrar igual" / "Atrás".

**S3 (cash) / S16 (fees)**
- Propina / servicio asked on every till, not only the owner phone.

**S5 (card)**
- Colombia: no "Este teléfono no puede cobrar con tarjeta" bar or "No disponible" label; the Tarjeta (Wompi) button works on a phone without NFC. The bar still shows in US/CA.

**S7 (receipt) / S17 (taxes)**
- Paper receipt prints the shop's tax name ("Impoconsumo 8% incluido", "IGV 18% incluido") instead of "IVA incluido"; added tax by its name too. US/CA: "Propina" line and real total.

**S11 (reports)**
- "Más vendidos" and "Por categoría" count comped (Cortesía) dishes at $0.

---

# Check of PROMPT 3 and PROMPT 4 against the code (commit 0eac2554)

Read only. Paths are under `app/src/main/java/com/example/` unless they start with `res/`.
Nothing was run on a phone, tablet or printer. The coder's status report is older than this commit: NET-1 ("Red 1") and LAST-1 ("Ultimo 1") landed after it, so items it calls NOT DONE (P3 #11, #22, P4 #11, #29) were checked again here.

Counts:
- PROMPT 3 (24): 20 fixed, 4 partly, 0 not fixed, 0 can't tell
- PROMPT 4 (29): 24 fixed, 3 partly, 1 not fixed (a decision), 1 can't tell

---

## 1. PROMPT 3: tables, dining options, waiter phones, counter tablet

| # | Item | Verdict | Evidence |
|---|---|---|---|
| 1 | Built-in dining names translated everywhere | FIXED | `utils/DiningOptionLabels.kt:31-45`. Used by the pay-screen link (`CheckoutSheetBody.kt:284`), the chooser (`CheckoutSheetBody.kt:1281-1288`), tablet chips (`CartSheetContent.kt:1004`), kitchen card banner (`KdsTicketCard.kt:204`), kitchen dialog (`KdsTicketDetailDialog.kt:109`), printed comanda (`PrintManager.kt:265`), receipts (`ReceiptActions.kt:130`), Reports (`ReportsScreen.kt:425`, `ReportLineDetailScreen.kt:111`), kitchen settings (`ConfigureKdsRulesScreen.kt:300`). es/pt/fr strings present. Search in Sales still matches the English stored name (minor). |
| 2 | Breakdown row "Domicilio · To Go" | FIXED | `CheckoutBreakdownScreen.kt:224-228`: the option's own translated name, or "Mesa 4". |
| 3 | "+ Nuevo" upcharge uses the shop money parser | FIXED | `DiningOptionsScreen.kt:358-360, 388, 408` (`parseMoneyInput`). Edit path keeps the internal form (`:283, :300`). |
| 4 | "¿Cómo sale este pedido?" shows the upcharge | FIXED | `CheckoutSheetBody.kt:1305-1313` ("+$ 2.000" under the option). |
| 5 | "¿Qué mesa?" marks busy tables | FIXED | `CheckoutSheetBody.kt:1233-1256` (tile tinted + "Ocupada"/"Ocupada"/"In use", 10 sp). Busy set from `sync/BusyTables`, passed on owner, tablet (`MamaPosScreen.kt:1387`) and waiter phone (`MiniPosSellScreen.kt:544`). |
| 6 | Reachable from Configuración, subtitle names Mesas | PARTLY | New Settings row `HubRow.DINING_OPTIONS`, subtitle `settings_dining_row_sub` "Para aquí, para llevar, domicilio y mesas" (`SettingsHubScreen.kt:98, 143, 257`). The old Menú › Otros row still uses `settings_dining_options_subtitle` with no Mesas (`YourMenuScreen.kt:133`). |
| 7 | Say Mesas and "Para aquí" exclude each other | FIXED | Note under both rows (`DiningOptionsScreen.kt:139-150`), dialog still there (`:340-352`). es/pt/fr present. |
| 8 | Portuguese "Opções de atendimento" vs "de serviço" | PARTLY | Both titles now "Opções de atendimento". Four pt strings still say "opção de serviço": `dining_master_on_blocked`, `dining_add_avenue`, `dining_new_avenue`, `dining_delete_confirm_title` (`res/values-pt-rBR/strings.xml:1039-1043`). The "+ Nuevo" pop-up title is one of them. |
| 9 | Waiter phone: reopened table not asked again | FIXED | `mamapos/ReopenedTicketSteps.kt`, wired in `MiniPosSellScreen.kt:298-326` (startBranch) and `:404-412` (openPayDirect). Not seen on a phone. |
| 10 | Typed name shows on the Abiertas card | FIXED | `components/OpenTicketTitle.kt:16-53` + `CartSheetContent.kt:1320-1332`: no customer = the typed name is the title; with a customer = "Juan · Mesa 4" under it. See new problem N3 (table disappears when a name is typed). |
| 11 | Owner phone "Enviado a cocina: Mesa 4"; reopened ticket says it too | FIXED | `ParkTicketDialog.kt:57-58` + `HomeScreen.kt:1216, 1340` (new sale) and `HomeScreen.kt:731-737` (reopened ticket, after the save job). Strings es/pt/fr/en present. Waiter phone still says "Guardado" (N2). |
| 12 | "Cobrar", "pedido" not "orden" | FIXED | `tx_pay_this_order` = "Cobrar" (es, pt), "Charge" (en); "Pedido abierto", "Anular pedido". Only `services_action_crear_orden` keeps "orden" (services, not this flow). |
| 13 | "Nombre o mesa": grid, picked table pre-selected | FIXED | `ParkTicketDialog.kt:83-110` (5 columns, scrolls), `:118-128` + `HomeScreen.kt:1212` (`initialTable`). Tiles are still bare numbers; busy tables are not marked here (only in "¿Qué mesa?"). |
| 14 | Guardar/Enviar a cocina label goes stale | FIXED | `HomeScreen.kt:197-200` follows `kdsDisplays` and `printers` flows. |
| 15 | Waiter phone can name a ticket with Mesas off | FIXED | `MiniPosSellScreen.kt:193-218` (`asksNameOnSave`, pop-up with just the name box). |
| 16 | "Entra con la cuenta que invitó tu jefe" | FIXED | es `welcome_sheet_work_sub`, `employee_login_subheadline`, `auth_employee_welcome_sub` say "código del negocio y tu PIN · cualquier cuenta de Google" (`res/values-es/strings.xml:1470, 1507, 1529`). Old "gerente" strings remain but nothing uses them (`minipos_onboarding_body`, `minipos_invite_wa_message`). |
| 17 | "Tu código" vs "Tu PIN"; one word for the boss | FIXED | Invite `phone_reg_share_message` "Código del negocio … / Tu PIN …" (`:2766`), join "Tu PIN", "dueño" everywhere in the join texts. |
| 18 | "Esto usa 1 de tus conexiones" not in US/CA | FIXED | `ConnectEmployeePhoneScreen.kt:122, 182-183` (`Entitlement.countryIsFree`). |
| 19 | Every non-owner shows "Cajero" | PARTLY | Team list now shows job title or "Equipo" (`TeamManagementScreen.kt:727`). Still "Cajero" for every CASHIER-role person on the counter tablet sign-in faces (`MamaPosScreen.kt:87-90`) and on the "Conectar un teléfono" list (`ConnectEmployeePhoneScreen.kt:79, 101-106`). |
| 20 | "Nombra esta tablet" waits for the connection check | FIXED | `CounterRegisterNameScreen.kt:66-80` (spinner, Next off) + `RegistersActions.kt:149-190` (answers true/false, old code cleared first at `:160`). |
| 21 | Tablet hint "Conexiones"; false "El código cambia cada vez" | FIXED | `connect_device_where` "…Configuración › Conexiones" (`:1489`); kitchen code page is the new `KdsConnectBody` with no "changes" line (`onboarding/KdsConnectParts.kt:59-118`); `connect_device_code_changes` now "Cada tablet y cada pantalla de cocina tiene su propio código". For a kitchen screen the code is one level deeper (Conexiones › Impresoras y pantallas); acceptable. |
| 22 | "Enviar a cocina" on tablet and waiter phone | PARTLY | NET-1: owner copies the kitchen-screen COUNT into the reference (`ui/pos/KitchenScreensFactActions.kt:25`); tills read it with `home/KitchenScreenKnown.kt:17-21`. Works for: tablet cart step inline link (`CartSheetContent.kt:1178`), reopened ticket with new lines on tablet/waiter pay step (`CheckoutSheetBody.kt:320, 331`), tablet amber-bar pill (`MamaPosScreen.kt:957, 1289`). NOT for a NEW sale on the waiter phone: its Cobrar bar jumps straight to the pay step (`MiniPosSellScreen.kt:741-742` -> `openPayDirect`), and that step's button is still "Guardar" because `sendToKitchen` needs a reopened ticket (`CheckoutSheetBody.kt:320, 332`). Same "Guardar" on the tablet's pay step for a new sale. |
| 23 | Tablet profile page Back; "Caja cerrada" before the PIN | FIXED | `MamaPosScreen.kt:394-402` (Back), `:420-440` ("Caja cerrada · El dueño la abre desde su celular", only when the register is KNOWN closed, `:237`). Not seen on a tablet. |
| 24 | Clear "Agregar a la mesa" button | FIXED | `components/OpenTicketBanner.kt:82-98`, passed on tablet (`MamaPosScreen.kt:1309`) and waiter phone (`MiniPosSellScreen.kt:486`). Not gated by business type: see N1. |

## 2. PROMPT 4: kitchen screen, kitchen settings, printers, order ready

| # | Item | Verdict | Evidence |
|---|---|---|---|
| 1 | Kitchen shows only today / this shift | FIXED | `data/repo/KdsLineStore.kt:22-27, 38` + `PosDao.kt:1076-1077`. A register left open for days keeps everything since it opened (floor = shift start). A paired kitchen tablet applies no floor of its own (`:23`). |
| 2 | "Todo listo · Hamburguesa" marks only that dish | FIXED | `kds/KitchenDisplayScreen.kt:503-522` (`markLinesReady` on that dish's lines), cards draw `stillToCook` (`:219, :416`). Tablet -> host messages `T_LINES_READY/UNREADY` (`sync/SyncHostService.kt:341-360`). Not seen over real Wi-Fi. |
| 3 | Order note drawn on the card | FIXED | `components/KdsTicketCard.kt:98` + note row "Nota: …"; detail dialog `KdsTicketDetailDialog.kt:127-135`. |
| 4 | Second round not shown twice | FIXED | `sync/AddonCardRule.kt:11` used at `ui/pos/SavedTicketActions.kt:392`: a blue card only when the main ticket is already ready; otherwise the main ticket grows and the screen beeps again (`KdsAlertRule`). |
| 5 | Add-on card "Mesa 4 · Adición" | FIXED | `KdsTicketCard.kt:95-97, 251-258`; strings `kds_addon_card_title` es "· Adición", pt "· Adicional", fr "· Ajout". |
| 6 | Single LISTO undo; crossed-off lines kept | PARTLY | Undo bar after a single LISTO done (`KitchenDisplayScreen.kt:541-562`, "Listo: Mesa 4"). Crossed-off lines in the ticket window are still screen memory only, lost on close (`KdsTicketDetailDialog.kt:81`). |
| 7 | Leave dialog wrong for a kitchen screen | FIXED | `KitchenDisplayScreen.kt:362` `kds_leave_body` "Esta pantalla deja de mostrar pedidos…". |
| 8 | Failed pairing says "Sin conexión a internet" | FIXED | `kds/ConnectDeviceScreen.kt:141-142` -> `connect_kitchen_wifi` "…debe estar en el mismo Wi-Fi que el teléfono principal". |
| 9 | Every row says "Conectada" | FIXED | `SyncHostService.kt:166-168, 937` live socket set, read by `PrintersAndOtherScreen.kt:113, 135`, `KdsListScreen.kt:51`, `KdsDetailScreen.kt:50`. Needs a real socket to see. |
| 10 | Empty cards on the other station | FIXED | `kds/KdsStationCards.kt:21`, used in `KitchenDisplayScreen.kt:214-221`. |
| 11 | LISTO on one station removes it everywhere | FIXED | NET-1: LISTO marks only this station's dishes (`KitchenDisplayScreen.kt:547-557`); the owner phone decides the ticket is done when every shown line is ready (`ui/pos/OrderFlowActions.kt:56`, `SyncHostService.kt:348-351`). Status report's NOT DONE is out of date. Not seen on two tablets. |
| 12 | Order-type names in English | FIXED | Checkboxes `ConfigureKdsRulesScreen.kt:300`, card banner `KdsTicketCard.kt:204`, add flow `KdsAddFlowScreen.kt:358`, detail page `KdsDetailScreen.kt:127`. |
| 13 | False "Mantén presionado" hint | FIXED | No such hint left on the kitchen pages (only `fav_arrange_subtitle`, a different screen). |
| 14 | Edit page dark, create page light | FIXED | No forced dark scheme in `ConfigureKdsRulesScreen.kt`; create is now the light 3-step `KdsAddFlowScreen`. |
| 15 | Role labels squeezed; -/+ 36 dp | FIXED | Roles stacked as two radio rows (`ConfigureKdsRulesScreen.kt:195-205`); -/+ 48 dp (`:457, :467`). |
| 16 | Tablet shows its station | FIXED | `KitchenDisplayScreen.kt:331-343` (name in the top bar). |
| 17 | Rule changes reach a tablet only on reconnect | FIXED | `SyncHostService.kt:545, 566-586` resends rules on save; tablet re-reads (`KitchenDisplayScreen.kt:165`). |
| 18 | Paying a sent ticket reprints the whole comanda | FIXED | `ui/pos/CheckoutActions.kt:244-249, 579-583`; empty slip never printed (`PrintManager.kt:262-263`). |
| 19 | Paper receipt ignores Receipts settings | FIXED | `utils/ReceiptFormatter.kt:287-298` -> `CheckoutActions.kt:569-570`, `ReceiptBuilder.kt:181-182`. Not printed on real paper. |
| 20 | Comanda: no note, no waiter, names cut | FIXED | `PrintManager.kt:411, 417-423` (`TicketWrap`, localized labels from callers `CheckoutActions.kt:594-596`, `SavedTicketActions.kt:489-491`, `WaiterTicketPrinter.kt:57-59`). |
| 21 | Tablet and waiter phone can't add a printer | NOT FIXED | Planner decision (printers live on the owner phone). Unchanged. |
| 22 | Accents / no-break space on paper | CAN'T TELL | Code page chosen per printer (PRINT-4, default Windows-1252) and a test page with accents exist; only a real printer shows the result. |
| 23 | Printer list says Recibos / Cocina; kitchen test print | PARTLY | Printer page says "Imprime: recibos / pedidos de cocina" (`onboarding/PrinterDetailScreen.kt:73, 83-86`) and the kitchen printer has a test print. Both LISTS still show only the device name (e.g. "PT-210") and the status line, never which job it does (`PrintersAndOtherScreen.kt:138, 233-245`; `PrinterListScreen.kt:120-134`; names come from the Bluetooth device, `ui/pos/HardwareActions.kt:189-192`). |
| 24 | Bluetooth permission asked for a Wi-Fi printer | PARTLY | The Wi-Fi search works with Bluetooth refused, and the scan permission is asked only on "Buscar impresoras" (`PrinterAddScreen.kt:152-218`). But the page still pops the Bluetooth CONNECT prompt as soon as it opens (`PrinterAddScreen.kt:128-130` -> `ask()` `:116-120`). |
| 25 | Orders from other devices reach the tablet without a customer | FIXED | Ready ticket carries the customer (`data/repo/OrderSyncStore.kt:229`). Not seen over Wi-Fi. The ready card still does not SHOW the name: N7. |
| 26 | "Pedido listo" switch only affects the owner phone | FIXED | Shop setting in the reference (`ui/pos/PaymentConfigActions.kt:67-76`, `NotificationsScreen.kt:152`), read by the tablet (`MamaPosScreen.kt:188`). |
| 27 | Empty list "Todo listo" | FIXED | `mamaship_empty` "No hay pedidos listos" / "Nenhum pedido pronto". |
| 28 | Tiny panel, button "Texto" | FIXED | `components/MamashipNotificationPanel.kt:62-66, 140-170` (14 sp+, 48 dp, "WhatsApp"). |
| 29 | Owner and waiter phone get no sign the kitchen finished | FIXED | Owner: `home/OrderReadyEffect` on `HomeScreen.kt:249`. Waiter: host writes the one field `readyTimestamp` to the shared order (`sync/ReadyFactPusher.kt:17-28`, called `SyncHostService.kt:721`), waiter shows only its own orders (`MiniPosSellScreen.kt:222`). Status report's PARTLY is out of date. Needs Firestore rules to allow that `update` and a real device to see. |

## 3. The earlier flags (`_FLAGS-ALREADY-SENT.md`)

| Flag | Now |
|---|---|
| 1 No message after Guardar on waiter phone | FIXED: "Guardado: Mesa 4" (`onboarding/SavedTicketNotice.kt:22-46`). But it says "Guardado" even when the button said "Enviar a cocina" (N2). |
| 2 Inline pay customer row squashes | FIXED: fixed height (`home/CheckoutCustomerField.kt:747-749`). |
| 3 Title "Cliente (N.° 27)" | FIXED on the Abiertas card (`OpenTicketTitle.kt`, plain "Cliente"). Device ids still shown elsewhere: N4, N5, N7. |
| 4 No bottom tab lit on Ventas/Abiertas | FIXED: `sync/PanelBarTap.kt:10`, `PlatataApp.kt:661`. |
| 5 Waiter must tap Cobrar to save; Exacto above Guardar | NOT CHANGED: Cobrar bar still opens the pay step, Guardar still last under Exacto (`CheckoutPayBlock.kt:302-345, 492`). |
| 6 Kitchen only gets orders via owner phone | NOT CHANGED (by design). See section 5. |
| 7 KDS no connection status | FIXED: amber bar + green dot (`KitchenDisplayScreen.kt:280-283, 327-330`). Bar words say "la caja" while the pairing text says "el teléfono principal" (N10). |
| 8 Android can stop the Wi-Fi host | FIXED in code: restart on app start (`ui/app/DeviceSyncEffects.kt:185-200`), one notification on timeout. Needs Android 14/15 to see. |
| 9 KDS follows whatever business is open | FIXED: `HostBinding` (`SyncHostService.kt:554, 705`), and a warning before switching (MyBusinessesScreen). |
| 10 Waiter phone may host too | FIXED: `sync/HostPolicy.kt:13, 22`. |
| 11 Owner kitchen printer skips waiter orders | FIXED: `ui/pos/WaiterTicketPrinter.kt:27`, switch on the printer list. |
| 12 KDS header local id, no waiter name | PARTLY: card header "Mesa 4" / typed name + waiter first name (`KdsTicketCard.kt:93-101`). Ticket window still "#57" / "#Juan" (N4); a to-go order with no name gets an EMPTY header (N5). |
| 13 Different number per device | PARTLY: open-ticket cards and amber bars no longer show it; still on the kitchen window, the comanda ("#57"), the tablet ready card ("Pedido #57"), the customer WhatsApp ("Tu pedido #57"), the open-order page ("Pedido #57") and the "Guardado: #57" fallback. |
| 14 Tablet amber bar "#57" | FIXED for table/name, but the amber bar puts the ORDER NOTE first (N6). |
| 15 Tablet not told of new waiter ticket | FIXED in code (`home/OpenTicketArrivalEffect.kt`, `MamaPosScreen.kt:1533`). CAN'T TELL whether the tablet ever receives a waiter ticket (section 5, register tokens). |
| 16 "Toca para cargar" wrong on owner phone | FIXED: "Toca para ver" on owner, "Toca para cargar" on tablet/waiter (`TransactionsScreen.kt:660`, `CartSheetContent.kt:1457`). |
| 17 Tablet dimmed catalog | FIXED (no dim). |
| 18 Open-ticket time hh:mm a | FIXED on cards (`CartSheetContent.kt:1412-1418`). Kitchen history "Listo a las" still "h:mm a" (`KdsTicketDetailDialog.kt:62-63`). |
| 19 Switch-person row no word | FIXED: `mamapos/MamaSwitchPersonRow.kt` ("Cambiar"). |
| 20 Mixed Spanish device names | FIXED in es ("Tablet de mostrador", "tablet", "Caja bloqueada"). pt still "PDV BLOQUEADO" in capitals (`mamaship_locked_title`). |

---

## 4. New problems (and old ones the fixes made more visible)

N1. "Agregar a la mesa" on shops that have no tables. `components/OpenTicketBanner.kt:82-98` draws it whenever `onAddItems` is passed, and `MamaPosScreen.kt:1309` passes it for services too (`if (isServices) 0 else 1`), `MiniPosSellScreen.kt:486` for every type. A salon, shop or pharmacy tablet/staff phone with an open ticket shows "Agregar a la mesa". Also wrong for a restaurant to-go ticket with a name. Matters: S demos with open tickets show a restaurant word.

N2. Waiter phone always says "Guardado: Mesa 4", even when its button said "Enviar a cocina" (reopened ticket with new lines, NET-1). `onboarding/SavedTicketNotice.kt:42` uses only `park_ticket_saved_toast`; the owner phone uses `ParkTicketRules.toastRes`. Matters: R6 shows two different words for the same action on two phones.

N3. Typing a name hides the table on the Abiertas card. With no customer, a typed name is the title and the line under it is the waiter's first name, not "Mesa 4" (`components/OpenTicketTitle.kt:51-52`). A ticket saved as "Juan" at table 4 shows "Juan / Carlos", no table. Matters: R4/R6 waiters find tables by number.

N4. The kitchen ticket window title does not match the card. Card says "Mesa 4"; tapping it opens a window titled "#57" (the device's own id) or "#Juan" (`components/KdsTicketDetailDialog.kt:77-79`). Matters: R7, the two numbers confuse the cook.

N5. Kitchen card with an EMPTY title. A to-go/delivery order with no typed name and no table: `TicketTitle.of(customerName = null, …)` returns nothing and the card header is blank (`KdsTicketCard.kt:93-97`; customer name is deliberately not passed). Two to-go orders can only be told apart by time. Matters: R7 to-go demo.

N6. The amber open-ticket bar shows the ORDER NOTE as the ticket name. `components/OpenTicketBanner.kt:127-131`: note first, then typed name, then table, then customer. A table with note "sin cebolla" reads "sin cebolla ›" instead of "Mesa 4" on owner phone, tablet and waiter phone. Also the order differs from the card rule (customer first). Matters: R4/R9.

N7. Tablet ready card still "Pedido #57". `components/MamashipNotificationPanel.kt:112, 128` uses the tablet's own id (or "#Juan"), not the table or the customer the ready ticket now carries. English is "Order ID #57". And the customer's WhatsApp says "Tu pedido #57 está listo" with that same device id (`ui/pos/OrderFlowActions.kt:116-119`), a number printed nowhere on the customer's receipt. Matters: R11.

N8. Waiter phone NEW sale still says "Guardar" with a kitchen screen (see P3 #22). The waiter's flow skips the cart step where NET-1 put "Enviar a cocina". On the tablet, the cart step says "Enviar a cocina" and the next (pay) step says "Guardar" for the same sale. Matters: R6/R9.

N9. "Todo listo" undo bar says "Enviado". After "Todo listo · Hamburguesa" the bar reads "Enviado Hamburguesa × 3" (es/pt `kds_bumped_undo`; en "Bumped"), while a single LISTO reads "Listo: Mesa 4". Matters: R7, "Enviado" reads as sent, not done.

N10. Kitchen connection words disagree. Bar: "Sin conexión con la caja" / "Conectando con la caja" (`kds_conn_*`); pairing error and connect page: "el teléfono principal" / "el mismo Wi-Fi del negocio". It is the same owner phone. Matters: R7/R8 setup.

N11. Printer hint describes something that cannot happen. `printer_waiter_orders_hint` "Desactívalo si el teléfono del mesero ya imprime en la misma impresora Wi-Fi", but a waiter phone cannot add a printer (P4 #21). Matters: R10.

N12. Kitchen add flow offers kitchen names to shops. `KdsAddFlowScreen.kt:251-255` always offers "Cocina, Parrilla, Bar, Postres, Empaque", also for a shop/pharmacy back-room screen; the printer page says "Imprime: pedidos de cocina" for a shop's order-slip printer (`PrinterDetailScreen.kt:73`). Matters: S demos with a back-room screen.

N13. Small wording: "Mesa 4 lista" uses the customer's name first, so a named customer reads "Juan lista" (`kitchen_order_ready_snack` "%1$s lista", title from `TicketTitle` customer-first, `home/OrderReadyEffect.kt:19`). "Enviar a Cocina" (capital C, `home_send_to_kitchen`, `CartSheetContent.kt:1163`) next to "Enviar a cocina" elsewhere. pt "Acréscimo de Atendimento (%s)" title case.

---

## 5. How an order travels today (for R4, R6, R7, R9, R10, R11)

Waiter phone (Mini POS) to kitchen screen to counter tablet:

1. Waiter taps Guardar: saved in the waiter phone's own database, then pushed to the cloud document `Platata_sync/{bizKey}/synced_orders/{id}` (`ui/pos/SavedTicketActions.kt:450` -> `ui/pos/OrderSyncController.kt:350-365` `pushOrderToSyncStore`, a Firestore `set`).
2. Owner phone receives it: its cloud listener downloads EVERY register's orders (owner scope is unscoped, `OrderSyncController.kt:175-195, 637-638`; `ingestAdmits` `:599`) and writes it into the owner's database (`applyRemoteOrder`, `OrderSyncController.kt:262`). The owner's kitchen printer prints it here once (`WaiterTicketPrinter.maybePrint`, from the same insert).
3. Owner phone to kitchen screen: the owner phone runs the Wi-Fi host (`sync/SyncHostService`, owner only `HostPolicy.kt:22`). Its kitchen feed watches the owner's database (`KdsLineStore.orders`) and sends a `T_KITCHEN` snapshot over the shop Wi-Fi (WebSocket) to every paired kitchen tablet (`SyncHostService.kt:542-560`). The kitchen tablet has NO cloud connection at all (`ui/app/DeviceSyncEffects.kt:46-58`); it receives only from the owner phone (`sync/LanSyncClient.kt:252`).
4. Cook taps LISTO / Todo listo: the kitchen tablet sends `T_BUMP` or `T_LINES_READY` back to the owner phone over Wi-Fi; the owner phone writes the ready time in its database (`SyncHostService.kt:325-351`).
5. Owner phone to counter tablet: the host's ready feed broadcasts `T_ORDER_READY` over Wi-Fi to the paired counter tablets (`SyncHostService.kt:700-726`); the tablet stores it and shows it on the ready list (`LanSyncClient.kt:315-322`).
6. Owner phone to waiter phone: in the same loop the owner writes the one field `readyTimestamp` on the shared cloud order (`sync/ReadyFactPusher.kt:17-28`, called `SyncHostService.kt:721`); the waiter phone's cloud listener merges it and shows "Mesa 4 lista" for its own orders only (`MiniPosSellScreen.kt:222`).

A counter-tablet sale goes the same way: tablet -> cloud -> owner phone -> Wi-Fi -> kitchen. The Wi-Fi link has no "upload an order" message (comment at `OrderSyncController.kt:575`).

Does the owner phone have to be on and open? YES, for every step after the waiter taps Guardar:
- It must be ON the same Wi-Fi as the kitchen tablet (step 3 is phone-to-tablet Wi-Fi).
- It must be ONLINE (step 2 and 6 are cloud).
- Platata must be running on it with the restaurant open: the cloud listener lives in the app's screen (ViewModel; torn down in `onCleared`, `ui/PosViewModel.kt:2987`), so if the owner swipes the app away, new waiter and tablet orders stop reaching the kitchen even if the Wi-Fi host notification is still up. The host also refuses to serve the kitchen when the owner opens ANOTHER business (`SyncHostService.kt:554`).
- If Android stops the host (Android 14/15 time limit), it restarts only the next time the owner brings Platata to the front (`DeviceSyncEffects.kt:185-200`).

CAN'T TELL (needs devices): whether the counter tablet and the waiter phone see EACH OTHER's open tickets in "Abiertas". Each staff device downloads only orders with its own register token or a blank token (`OrderSyncController.kt:637-638`), and a ticket is stamped with the device's register token (`SavedTicketActions.kt:241-245`). The owner phone always sees all of them. The arrival message on the tablet (flag 15) and "the tablet charges the waiter's table" (R9) depend on this.

---

## 6. What the DEMO must show differently

R4 (table order)
- "Nombre o mesa": tables in a grid (5 per row), the table already chosen is lit.
- After "Enviar a cocina" the owner phone says "Enviado a cocina: Mesa 4"; a reopened ticket's "Enviar a cocina" says the same.
- Open-order page button is "Cobrar" (not "Pagar esta orden"); "Pedido abierto", "Anular pedido".
- Abiertas card: typed name shows; with a customer the line under is "Juan · Mesa 4"; owner phone hint "Toca para ver".
- Abiertas tab has a number badge; a ticket from another device pops "Mesa 4 · Carlos" on the owner phone.
- Avoid a note on the demo table, or the amber bar shows the note (N6).

R5 (dining options)
- New row Configuración › Opciones de servicio ("Para aquí, para llevar, domicilio y mesas").
- Under Mesas and Para aquí: "No puede estar activa a la vez que …".
- "¿Cómo sale este pedido?" shows "+$ 2.000" under an option with a charge.
- "¿Qué mesa?" marks tables with an open ticket "Ocupada".
- Names are translated everywhere (kitchen "PARA LLEVAR", Reports, receipts); Breakdown row reads "Para llevar" or "Mesa 4".
- pt title "Opções de atendimento" (the "+ Novo" pop-up still says "Nova opção de serviço").

R6 (waiters)
- "Conectar" row turns "Invitado" with "Código del negocio X · PIN Y" and "Enviar invitación"; Team page has a business-code card with Copy.
- Join texts: business code + PIN, any Google account, "dueño".
- No connections note in US/CA. Team badges show job title or "Equipo".
- Guardar on an unnamed new sale opens "Nombre o mesa" first (also with Mesas off); then "Guardado: Mesa 4".
- Reopened table: no second name/table question; amber bar has "Agregar a la mesa".
- "Caja" tab stays lit on Ventas/Abiertas.
- "Mesa 4 lista" appears on the waiter phone when the kitchen finishes (only if the owner phone is hosting and online).
- New sale button still says "Guardar" even with a kitchen screen (N8).

R7 (kitchen screen)
- Add flow is now 3 steps: name (chips Cocina/Parrilla/Bar/Postres/Empaque), which dishes (all / some categories + order types), "Conecta la tablet" with the big code and "Esperando la tablet…" -> "Conectada ✓"; "Listo, la conecto después".
- List: one card per screen, "● Conectada" or "○ Sin conectar · código …", big "Agregar pantalla" at the bottom, "Gratis y sin límite…". No "+ Nuevo".
- Screen page: rows Nombre / Muestra / Tipos de pedido / Alertas / Estado / Código, "Ver cómo conectar la tablet", red remove button.
- Tablet: amber bar when the link is down, green dot when up, station name top right; only today's / this shift's orders.
- Card: "Mesa 4" + waiter first name, "Nota: …" line; ADICIÓN card "Mesa 4 · Adición" only if the first round was already marked ready (otherwise the ticket just grows and beeps).
- "Todo listo · Hamburguesa" takes only that dish; single LISTO leaves "Listo: Mesa 4 · Deshacer"; LISTO is per station.
- Leave dialog: "Esta pantalla deja de mostrar pedidos…". Failed pairing: "…mismo Wi-Fi que el teléfono principal".

R8 (kitchen settings)
- Settings page is light like the rest, roles stacked, -/+ 48 dp, no "Mantén presionado" hint, order types in Spanish.
- A saved rule reaches a connected tablet at once; a station with none of a ticket's dishes shows no card.

R9 (counter tablet)
- "Nombra esta tablet" shows a spinner and waits before the code page.
- Hint says "Configuración › Conexiones".
- Profile page: Back button; "Caja cerrada · El dueño la abre desde su celular" before picking a face.
- "Caja bloqueada"; switch row "Ana · Cambiar"; catalog not dimmed during an open ticket.
- Amber bar: "Mesa 4 ›" + "Agregar a la mesa" + "Enviar a cocina" (with a kitchen screen) + "Salir".
- Cart step link says "Enviar a cocina" when the owner has a kitchen screen; the pay step still says "Guardar".
- Abiertas badge and arrival snackbar (if the tablet receives that ticket at all, see section 5).

R10 (printers)
- Printers are on Configuración › Conexiones › Impresoras y pantallas; each printer shows "No probada" / "Imprimió bien a las 14:32" / the reason.
- Add page: printers listed first, "Buscar impresoras", Wi-Fi printers, "Recibos" / "Pedidos de cocina".
- Printer page: "Imprime: recibos" or "pedidos de cocina", paper 58/80 mm, letter table, test print for BOTH printers; cash-drawer switch on the receipt printer.
- Printer list: switch "Imprimir aquí los pedidos de los meseros" under the kitchen printer.
- Comanda: Nota, Mesero, long names wrap; paying a sent table prints only new lines.
- Paper receipt carries the Receipts settings (message, phone, address, website).

R11 (order ready)
- Ready panel: bigger text, 48 dp buttons "WhatsApp" and "Ignorar"; empty list "No hay pedidos listos".
- Customer without WhatsApp: card stays, "Este cliente no tiene WhatsApp".
- The owner's "Pedido listo" switch (Notificaciones) now turns the tablet's list on/off.
- Owner phone and waiter phone show "Mesa 4 lista".
- Card still "Pedido #57" and the WhatsApp still "Tu pedido #57" (N7).

S demos (services/shops with open tickets on a tablet or staff phone)
- Amber bar now has an "Agregar a la mesa" button (wrong word, N1).
- A back-room screen add flow suggests kitchen names (N12).

---

# Check of PROMPT 5 and PROMPT 6 (code 0eac2554, old code d1b7698d)

Read only. Every verdict below comes from the current code, not from the coder's report.
Paths are under `app/src/main/java/com/example/`; strings under `app/src/main/res/values*/strings.xml`.

---

## 1. PROMPT 5: First run, register, cash (16 items)

| # | Item (short) | Verdict | Evidence |
|---|---|---|---|
| 1 | Country step promises taxes | FIXED | `country_step_subtitle` now "Así ponemos tu moneda." / "Assim definimos sua moeda." / "This sets your currency." (es 1477, pt 1476, en 1574). Used in `ui/screens/onboarding/BusinessStartScreen.kt:1001`. |
| 2 | US/CA pitch promises QR | FIXED | `ui/screens/onboarding/BusinessTypeOptions.kt:141-147` drops the QR chip for Stripe countries; `lineaDePago` line 343 picks `biz_pitch_pay_cash_card` ("Efectivo y tarjeta" / "Dinheiro e cartão" / "Cash and card"). |
| 3 | Sign-in "guardado en tu cuenta" vs "no tiene respaldo" | PARTLY | Fixed: `auth_benefit_account` = "Tu negocio queda ligado a tu cuenta de Google", second line "Activa los respaldos automáticos en Drive cuando quieras" (`ui/screens/auth/GoogleAuthScreen.kt:389-390`). Missing: the subheadline right above still says `auth_subheadline` "Para que tu negocio nunca se pierda." / "So your business is never lost." (line 381), and the first Home then says "Este negocio no tiene respaldo". The promise is softer but still there. |
| 4 | Backup bar says "Esta tienda" | FIXED | `backup_off_banner_title` es "Este negocio no tiene respaldo", en "This business is not being backed up". No "tienda/store" left in backup strings. (pt "Este negócio não está sendo salvo" - see new problems.) |
| 5 | "Preparando tu caja" tick; lands on closed register | PARTLY | Tick: `CreationStage.REGISTER_READY` set at `ui/pos/WorkspaceActions.kt:561`, ticks line 3 in `ui/screens/auth/SettingUpScreen.kt:116,131`. But it is set a few lines before the `finally` that clears the screen (line 641), with no wait, so on a phone it may only flash (CAN'T TELL without a device). The register is still closed on landing, by the coder's decision ("opening it would invent a counted amount"). |
| 6 | First Home stacks three bars | FIXED | `sync/TopStrips.kt` + `ui/screens/home/HomeScreen.kt:446-451, 673-683`: warning bar, else "Caja cerrada", else connect nudge. Note: a 4th thin "Sin internet" line (`OfflineStrip`, line 683) can still show under any of them (by design, BACKOFFICE-2 D). |
| 7 | Panama "USD1,234.50" | FIXED | `utils/CurrencyUtils.kt:208-214` forces "$" for USD; golden file `functions/test-vectors/money-format.json` PA row = "$1,234.50". No other `getCurrencyInstance` for money on screen. |
| 8 | "Owner" saved as opener / closer / mover | FIXED | `ui/pos/ActorNameActions.kt` (owner's name, else `shift_actor_owner` = "Dueño"/"Proprietário" in the shop's language); used at `ui/pos/ShiftController.kt:93,150` and `ui/pos/CashMovementActions.kt:32`. Old rows that say "Owner" are shown through `rememberActorLabel` (`ui/screens/cash/RegisterStatusScreen.kt:233,245`, `RegisterClosedScreen.kt:137`), also in the WhatsApp/print summary. |
| 9 | Employee in PIN session can open the register | FIXED | `ui/pos/ShiftController.kt:82`: `if (!miniPosAllows { it.canCloseShift }) return ShiftOpenResult.NotAllowed` before any read/write; screen shows `register_open_not_allowed` ("No tienes permiso para abrir la caja"), 4 languages. Side effect for demos: `Employee.canCloseShift` defaults to false (`data/Employee.kt:37`). |
| 10 | Cash rounding not explained on phone pay screen | FIXED | `ui/screens/home/CheckoutPayBlock.kt:204-218`: "Redondeo en efectivo +$0.02" under the Total, from `cashDue - grandTotal` (string `cash_rounding_line`, 4 languages). |
| 11 | Register date "Hoy · oct 19" | FIXED | `RegisterStatusScreen.kt:101` now `shortDayFormatOf(Locale)` = best pattern for "MMMd" (`utils/ShortDay.kt:8-10`), so es gives "19 oct". |
| 12 | Gender / pt words | FIXED | es pills "● ABIERTA / ● CERRADA", "Abierta", "Cerrada"; pt "● ABERTO / ● FECHADO", "Aberto em", "Fechado", "Troco inicial" on both screens, "Sobra" on both. (Leftover pt "Faltante" vs "Falta": see new problems.) |
| 13 | Cash in/out only on owner phone | NOT FIXED | Confirmed by the code and by CLAUDE.md REGISTER-2 "NOT built". Tablet and waiter phone still have no Register page and no Meter/Sacar. |
| 14 | "Esperado" vs "Debe haber en la caja" | FIXED | `register_close_expected_label` = `register_status_expected` = "Debe haber en la caja" / "Deve haver no caixa" / "Should be in the drawer"; summary label uses the same (`RegisterClosedScreen.kt:70`). No "Esperado" left in the register strings. |
| 15 | Close summary has no business name | FIXED | `utils/ShiftSummaryText.kt:31,59` prints `labels.businessName` first; filled from `uiState.activeWorkspaceName` (`RegisterClosedScreen.kt:78,140`). Same text for Print and WhatsApp. |
| 16 | Permission called "Cerrar turno" | FIXED | `perm_can_close_shift` = "Abrir y cerrar caja" / "Abrir e fechar caixa" / "Open and close register" (`ui/screens/team/TeamManagementScreen.kt:1333,1471`). One leftover "turno": see new problems. |

### Special check: the one money keypad rule (item P1-7, asked by the planner)

- `ui/screens/cash/MoneyKeypadEntry.kt` copies the pay screen rule exactly (`ui/pos/CartActions.kt:668-688` + the zero key in `ui/screens/home/CheckoutSheetBody.kt:522-531`): whole units, decimal key where there are cents, "000" where there are none.
- Used by Open register (`OpenRegisterScreen.kt:40-90`), Close register (`CloseRegisterScreen.kt:83-151`), Cash in / out (`CashMovementEntryScreen.kt:75-94`), and the customer Settle / Forgive / Manual amount keypads (`ui/screens/customers/FiadoMoneyScreens.kt`).
- Result: typing 1-2-5 gives **125** in Colombia (COP, 0 decimals, bottom-left key "000") and **125.00** in the US (USD, 2 decimals, bottom-left key "."), on Open register, Close register, Cash in/out AND the pay screen. Same answer on all four. **FIXED for the four screens named.**
- NOT the same everywhere in the app: the till's **Keypad tab** (manual sale amount, `ui/screens/home/KeypadView.kt:52` + `CartActions.onKeypadDigit` line 69 + `utils/CurrencyUtils.kt:51-61`) still reads digits as cents with a "00" key. In the US, 1-2-5 there is **$1.25**, while on the pay screen right after it is **$125.00**. Same for the services setup price keypad (`ui/screens/guide/PriceKeypadPage.kt:87-89`). So "one rule for every money keypad" is only PARTLY true (this belongs to Prompt 1 #7, listed here because the planner asked).

---

## 2. PROMPT 6: QR, card, other payments, receipts, refunds (26 items)

| # | Item (short) | Verdict | Evidence |
|---|---|---|---|
| 1 | QR cashier note hidden by `if (false)` | FIXED | `ui/screens/home/QrPaymentOverlay.kt:210-222` draws `message` in red (tag `qr_overlay_cashier_note`); both callers pass it (`CheckoutSheetBody.kt:667`, `CartSheetContent.kt:1242`); Settings field back (`ui/screens/settings/PaymentMethodsScreen.kt:410`). The remaining `if (false)` (line 257) is an unused "Payment received" button, not the note. |
| 2 | Brazil says "QR", never "Pix" | PARTLY | Done (FIX-4 + PIX-2 commits b954968a, 7f913ffa, which the coder report says do not exist): method name everywhere through `localizedPaymentMethod` (`utils/PaymentMethodLabels.kt:98,107`), pay button `payQrShortLabel`, setup link "Configurar Pix", QR terms page "Pagamentos por Pix", red note, upload/change/delete/setup texts (`utils/PixLabels.kt` map, 20 `_pix` strings in 4 languages). Missing: the **first-run screens** in Brazil still say QR: the payment chips use `payment_method_qr` "Pagamento QR" (`BusinessTypeOptions.kt:147`) and the pitch `biz_pitch_pay_nocard` "Dinheiro e QR" (line 345). The online store page (`public/`) not checked by me. Also `qrIsPix()` reads the global `CurrencyConfig.current`. |
| 3 | "TOTAL A COBRAR" / "Monto a cobrar" / "Total a cobrar" | FIXED | QR, Wompi and Stripe all "Total a cobrar" / "Total to charge" (`qr_total_to_charge`, `card_overlay_total_label`, `stripe_total_label`). The QR overlay still shows it in capitals (`.uppercase()` at `QrPaymentOverlay.kt:131`), same words. |
| 4 | QR back arrow no label | FIXED | `QrPaymentOverlay.kt:123-128` `contentDescription = stringResource(R.string.common_back)`. |
| 5 | pt "Formas" vs "Métodos de pagamento" | FIXED | No "Métodos/Método de pagamento" left in values-pt-rBR. |
| 6 | Default note "toma una foto del recibo" | FIXED | `qr_payment_default_message` es "Revisa en tu app del banco que el pago llegó antes de entregar." (pt/en same idea). Old text gone. |
| 7 | Stripe voseo | FIXED | es 4997-5000: "Inserta / Acerca / Desliza / Presenta la tarjeta". No voseo imperatives found in values-es. |
| 8 | Waiter-phone card bar "pide efectivo o QR" | FIXED | `card_device_bar_phone` = "Este teléfono no puede cobrar con tarjeta. Pide efectivo". But a sibling text in the same US/CA flow still says QR: see new problems. |
| 9 | Wompi "Preguntar por cuotas" never read | FIXED | Switch removed (no `askInstallments` in screens); charge uses `defaultInstallments` (`WompiPaymentOverlay.kt:138`), 1 cuota. |
| 10 | Wompi expiry typed blind | FIXED | `WompiPaymentOverlay.kt:378-385`: `masked = false`, hint `card_field_expiry_hint` "MM / AA" (en "MM / YY"). Number and CVC stay masked. The typed digits show as "1226" with no slash. |
| 11 | Sending pill hard-coded "TARJETA · 1 cuota" | FIXED | `WompiPaymentOverlay.kt:570-586`: brand when known, else the method's own label, plus plural `card_installments`. In practice it still reads "Tarjeta · 1 cuota" while sending, but it is no longer a fixed string. |
| 12 | Stripe tip screen no Cancel | FIXED | `ui/screens/home/StripePaymentSheet.kt:165-166, 336-339` `TextButton` "Cancelar" (tag `stripe_tip_cancel`) = same exit as Back. |
| 13 | Card reader row only behind "Connect a different account" | FIXED | `PaymentMethodsScreen.kt:511-514` draws `CardReaderRow` right under the Stripe account card (Android 8+). Not seen on a device. |
| 14 | One tap on Nequi closes the sale | FIXED | `CustomMethodConfirmDialog.kt` + `CheckoutSheetBody.kt:779-803` and `CartSheetContent.kt:1112-1117, 1281-1291` (owner phone, tablet, waiter phone): "¿Ya viste el pago de $X en tu app de Nequi?" Sí, cobrar / Volver. Volver restores the old method. |
| 15 | Add-method example "Cheques" | FIXED | `sync/PaymentMethodExample.kt` (CO Nequi, PE Yape, AR/MX Mercado Pago, US Zelle, CA Interac e-Transfer, else "Transferencia"), used at `PaymentMethodsScreen.kt:792`. |
| 16 | "Más formas" vs "Otro método de pago" | FIXED | Link `checkout_other_method` "Otro método de pago (%d)" (`CheckoutPayBlock.kt:265`), sheet `checkout_other_method_title` "Otro método de pago"; pt "Outra forma de pagamento" both. |
| 17 | Cortesía paper receipt prints full price | FIXED | `ui/pos/CheckoutActions.kt:551-568`: comp prints total 0, subtotal as discount, no tax/fees. |
| 18 | US/CA "Enviar" always WhatsApp; Text button green | FIXED | `ReceiptOptionsScreen.kt:351-363` Text receipt is `colorScheme.primary`; viewer `ui/common/ShowReceiptDialog.kt:86-110` offers Text and WhatsApp when route is TextAndEmail; route passed from both callers (`ReceiptOptionsScreen.kt:153,184`). Real SMS not tried. |
| 19 | WhatsApp ends the sale | FIXED | `ReceiptOptionsScreen.kt:169-174` `onSent = { showWhatsAppPrompt = false }`. |
| 20 | pt Recibo / comprovante; question talks to customer | FIXED | `receipt_opt_how_receipt` es "¿Cómo envías el recibo?", pt "Como você envia o recibo?", en "How do you send the receipt?". pt "comprovante" left only for bank-transfer proof, which is the right word there. |
| 21 | Refund owner PIN never shown | FIXED | `ui/screens/settings/SecurityScreen.kt:144,226` `RefundPinCard` "PIN para devoluciones" (masked, Mostrar, Cambiar, 4 digits). The refund pad itself still does not say where to find it (see new problems). |
| 22 | Wompi refund: no "Abrir Wompi", id not copyable | FIXED | `ui/screens/transactions/WompiRefundActions.kt` "Abrir Wompi" + "Copiar número de transacción", wired at `TransactionsScreen.kt:2328`. Layout of the two buttons in one Row: see new problems. |
| 23 | Refund prices vs prorated amount | FIXED | `TransactionsScreen.kt:1789-1801` + `sync/RefundProrateNote.kt`: "La devolución reparte los descuentos y cargos de la venta." when the dish prices do not add up to the sale. Wording issue: see new problems. |
| 24 | English title case | PARTLY | Fixed the two named: `tx_select_all_items` "Select all items", `tx_yes_refund` "Yes, refund". Still title case on the same refund flow: `tx_confirm_refund_title` "Confirm Refund", `tx_refund_amount` "Refund Amount" (both used in `TransactionsScreen.kt`), and nearby `tx_total_due` "Total Due", `tx_add_to_order` "Add Items", `tx_order_inspection_title` "Open Order", `tx_dining_option` "Dining Option (%s)". |
| 25 | Interac line says "store credit" | FIXED | `refund_interac_line` "Interac no se puede devolver aquí. Entrega efectivo." / "Interac can't be refunded here. Give cash." No "store credit" in any language. |
| 26 | Refund banner uses global currency | FIXED | `TransactionsScreen.kt:1251-1273` takes `currencyCode`, caller passes `uiState.currencyCode` (line 1032). |

### Special checks asked by the planner

- **Tip:** Stripe tip screen has Cancel (6.12). Refund math was not touched (`git diff` shows no change in `RefundActions`/`RefundMath`), so "Select all" still refunds the tip (S7-B6 rule). The paper receipt now prints the tip line and the charged total (`CheckoutActions.kt:556-561`, Prompt 1 #8). One new oddity: the prorate note shows on every tipped or tax-added sale but only mentions "descuentos y cargos".
- **Refunds:** routes, PIN gate and Wompi road unchanged; only texts, banner currency, Wompi helpers and the note were added.
- **Pix in Brazil:** see 6.2: pay screen, payment names, QR terms and setup texts say Pix; first-run chips and pitch still say QR.

---

## 3. New problems (or leftovers) found in these screens

1. **Two keypad styles still in one shift (US, CA, PE, PA, EC...).** `ui/screens/home/KeypadView.kt:52`, `ui/pos/CartActions.kt:69-80`, `utils/CurrencyUtils.kt:51-61`. The till's Keypad tab still treats 1-2-5 as $1.25 with a "00" key, while Open/Close/Cash in-out/pay screen now treat it as $125.00. Why it matters: a cashier who rings a $125 custom amount on the Keypad tab after opening the register with "125" gets a 100x different number; this is exactly the confusion Prompt 1 #7 wanted gone. Same in `ui/screens/guide/PriceKeypadPage.kt:87`.
2. **US/CA card dialog still promises QR and fiado.** `card_device_dialog_still_works` "Todo lo demás funciona normal — efectivo, QR y fiado..." (es 1263, en 1336, pt 1262), shown by `ui/screens/home/CardDeviceIntroGate.kt:122`, which only fires in Stripe countries. QR does not exist there and fiado does not exist for restaurants. Same defect as 6.8 in a sibling text.
3. **Brazil first-run still says QR.** `BusinessTypeOptions.kt:147` chip "Pagamento QR", line 345 pitch "Dinheiro e QR". A Brazilian owner sees QR before the app starts saying Pix.
4. **Sign-in still promises "never lost".** `auth_subheadline` "Para que tu negocio nunca se pierda." (GoogleAuthScreen.kt:381) then Home says "Este negocio no tiene respaldo".
5. **pt backup bar is alarming.** `backup_off_banner_title` pt "Este negócio não está sendo salvo" reads as "your business is not being saved", which is false (it is saved on the phone, only not backed up). es/en say "no tiene respaldo / not being backed up".
6. **pt short/over words still differ by screen.** Register screen `register_status_short` "Faltante" vs Close `register_close_short` "Falta %s" (pt 3955 vs 3978). Same kind of mismatch the planner flagged for Sobrante/Sobra.
7. **One "turno" left.** `minipos_panel_close_register_desc` es "Contar el efectivo y cerrar el turno" (es 3702) on the waiter phone panel, while the permission is now "Abrir y cerrar caja".
8. **Prorate note names the wrong cause.** `refund_prorated_note` "reparte los descuentos y cargos" shows whenever item prices differ from the total (`RefundProrateNote.shown`), which is also every US/CA sale with added tax or tip and every rounded cash sale. The owner reads "discounts and charges" on a sale that had none.
9. **Custom method question can read oddly.** `pay_custom_confirm_title` "¿Ya viste el pago de %1$s en tu app de %2$s?" with a custom method like "Transferencia" or "Datáfono" gives "en tu app de Datáfono" (a card terminal is not an app). Small, but this is the S6 demo screen.
10. **Possible layout squeeze in the Wompi refund dialog.** `WompiRefundActions.kt:31-39`: "Abrir Wompi" and "Copiar número de transacción" are two OutlinedButtons in one Row with no weight, inside a dialog on a 360 dp phone. The long second label will wrap to several lines or crowd the first. CAN'T TELL without drawing it.
11. **Refund PIN pad does not say where the PIN is.** `refund_pin_subtitle` "Ingresa el PIN de un empleado autorizado" (es 2376). The owner can now see his PIN in Configuración › Seguridad, but nothing on the pad points there.
12. **Opening the register now needs a permission most people do not have.** `data/Employee.kt:37` `canCloseShift = false` by default, and `ShiftController.kt:82` now refuses opening without it. Correct per the item, but a waiter phone that used to open the register now gets "No tienes permiso para abrir la caja" until the owner turns it on. The owner gets one notice on Home (`open_register_notice_*`, "Ahora abrir la caja necesita el permiso Abrir y cerrar caja." / "Ir a Equipo"). Demos must grant it first.

---

## 4. Demo changes (what the demo must show differently)

**S1 Crear el negocio**
- Country step: "Así ponemos tu moneda." (no taxes).
- US/CA pitch: "Efectivo y tarjeta" (no QR chip). Brazil still shows "Pagamento QR" / "Dinheiro e QR".
- Google step: "Tu negocio queda ligado a tu cuenta de Google" + "Activa los respaldos automáticos en Drive cuando quieras".
- Setting-up screen: line 3 "Preparando tu caja" gets a tick (may be very quick).
- First Home: only ONE bar at a time (backup bar "Este negocio no tiene respaldo" first; "Caja cerrada · Abrir" only after it is gone). A thin "Sin internet" line can appear under it when offline.
- Panama prices show "$1,234.50".

**S2 Abrir la caja**
- Keypad: whole units. US: 1-2-5 = $125.00, key "." for cents. Colombia: 1-2-5 then "000" = $125.000.
- Header date "Hoy · 19 oct" (day first in es/pt).
- Pill "● ABIERTA / ● CERRADA"; "Abierta" / "Cerrada" rows; pt "Aberto em", "Troco inicial".
- "Abierta por" shows the owner's name (or "Dueño"), never "Owner".
- An employee without "Abrir y cerrar caja" sees "No tienes permiso para abrir la caja" instead of the Open button. Owner Home shows a one-time notice "Abrir la caja · Ahora abrir la caja necesita el permiso Abrir y cerrar caja. · Ir a Equipo".
- Team permission chip renamed "Abrir y cerrar caja".

**S3 Cobrar en efectivo**
- CA/CL/PE: line "Redondeo en efectivo +$0.02" under the Total.
- After the sale, WhatsApp no longer closes "Venta completada"; the cashier taps "Nueva venta".

**S4 Cobrar con QR**
- Red cashier note under the QR again; default "Revisa en tu app del banco que el pago llegó antes de entregar."
- Label "Total a cobrar" (shown in capitals on the QR screen).
- Brazil: pay button "Pix", method name "Pix", terms page "Pagamentos por Pix" / "Entendi, ativar pagamentos por Pix", setup "Configurar Pix", "QR do Pix e nota do caixa".
- pt: "Formas de pagamento" everywhere.

**S5 Cobrar con tarjeta**
- Stripe prompts: "Acerca / Inserta / Desliza / Presenta la tarjeta".
- Stripe tip screen has a "Cancelar" button.
- Wompi: expiry shows digits with hint "MM / AA"; no "Preguntar por cuotas" switch in settings; pill "Tarjeta · 1 cuota", then "VISA •• 4242 · 1 cuota".
- Settings › Formas de pago: "Lector de tarjetas" row right under the Stripe account card.

**S6 Otras formas de pago**
- Link and sheet both "Otro método de pago (N)" / "Otro método de pago".
- Tapping Nequi (or any method the shop made) asks "¿Ya viste el pago de $X en tu app de Nequi?" with "Sí, cobrar" / "Volver"; only "Sí, cobrar" closes the sale.
- Add-method box example: Nequi (CO), Yape (PE), Mercado Pago (AR/MX), Zelle (US), Interac e-Transfer (CA), else "Transferencia".
- Cortesía paper receipt prints total 0.

**S7 Recibo**
- Question "¿Cómo envías el recibo?".
- WhatsApp no longer ends the sale; the screen stays with "Imprimir de nuevo" / "Ver recibo" / "Nueva venta".
- US/CA: "Text receipt" button is the app color (not WhatsApp green); the receipt viewer's "Enviar" offers "Text receipt" and "WhatsApp".
- Paper receipt now has the tip line and the Receipts settings (Prompt 1/4 work).

**S8 Devolver una venta**
- Configuración › Seguridad starts with "PIN para devoluciones" (masked, Mostrar, Cambiar): show it before refunding.
- Refund screen can show "La devolución reparte los descuentos y cargos de la venta."
- Wompi refund dialog has "Abrir Wompi" and "Copiar número de transacción".
- English: "Select all items", "Yes, refund" (but "Confirm Refund" still title case).
- Interac (Canada): "Interac can't be refunded here. Give cash."
- Done banner shows the shop's currency.

**S9 Meter y sacar efectivo**
- Keypad: whole units (same as S2).
- The movement is saved under the owner's name.
- Still only on the owner phone (not on the tablet or waiter phone).

**S10 Cerrar la caja**
- Keypad: whole units (same as S2).
- "Debe haber en la caja" on Close, Register screen and the summary.
- Summary (print and WhatsApp) starts with the business name; "Cerrada por" shows the owner's name.
- pt: "Sobra" on both screens; "Faltante" on the Register screen but "Falta" on Close.
- With open unpaid tables, a warning appears before closing (Prompt 1 #6).

---

# Check of PROMPT 7 and PROMPT 8 against the code (commit 0eac2554, 20 Oct 2026)

Read only. Paths are under `app/src/main/java/com/example/` unless they start with `res/` (= `app/src/main/res/`).
Nothing was built or run. "FIXED" means the current code does it; nothing was seen on a phone.

---

## Monti's decision: US/Canada tips are their own line, never inside "Ventas netas"

**Yes, the code does this today** (round REPORTS-11, commit da6d16cd / a338c283).

- One pure function splits every sale: `data/SalesBreakdown.kt:85-93`. Per sale, Net = `totalAmount - cashRounding - service - dining - tax - tip`, so the tip is taken OUT of Net sales. `tips` is its own sum (`SalesBreakdown.kt:155`).
- Reports: "Ventas netas" = `lines.net` (`ui/screens/reports/ReportsScreen.kt:231, 266-269`) with the note "Antes de impuestos, propinas y cargos". "Propinas" is its own line, only when above 0 (`ReportsScreen.kt:316-322`), then "Total cobrado". The old "Propinas (ya incluidas)" row is gone.
- Accountant summary: first row "Ventas netas" = `s.netSales` (= `lines.net`, no tips) (`ui/pos/EmployeePayActions.kt:368`, sent text `:406`); "Propinas" is its own row/line after Taxes (`EmployeePayActions.kt:363`).
- Daily notification: `salesSummaryBetween` returns count + `b.net` (`data/repo/ReportsStore.kt:58-61`), so no tips. The text is "Hoy: N ventas, $X" (`res/values-es/strings.xml:5772`). It has no tips line and does not say "netas".
- Also the register close summary (`ui/screens/cash/RegisterClosedScreen.kt:249-261`), the panel "Hoy · $X" (`ReportsStore.kt:64-76`) and the sales-list day header follow the same rule.
- Outside US/CA: the only writer of `tipAmount` is the Stripe tip (`ui/pos/CheckoutActions.kt:460, 561`), so the "Propinas" line never shows there. A service charge goes to "Cargos por servicio", also outside Ventas netas.

Things to know (not against the decision, but they will show in demos):
- Ventas netas is now ALSO before tax and before every charge, in every country. A Colombian restaurant with IVA/impoconsumo inside its prices sees a smaller "Ventas netas", "Hoy · $X" and daily notification than what it collected.
- "Ventas por empleado", "Ventas por tipo de pedido", top dishes and categories were NOT converted: they still count the full amount paid, tips and tax included (`data/PosDao.kt:1144`). So in US/CA an employee's total includes his tips, and these lists do not add up to Ventas netas.
- The note "Antes de impuestos, propinas y cargos" is shown in Colombia too, where there are no tips.

---

## 1. PROMPT 7 - Reports, accountant, clients, team, employee pay (37 items)

| # | Item (short) | Verdict | Evidence |
|---|---|---|---|
| 1 | "Hoy" stops when Reports opens | FIXED | `data/ReportRange.kt:100` Today ends at start of tomorrow |
| 2 | Dining options English in Reports | FIXED | `ReportsScreen.kt:425`, `ReportLineDetailScreen.kt:111` use `localizedDiningOption` |
| 3 | "N tx", "Faltan N", "Sin nombre" in SQL | FIXED | plural `reports_tx_count` "N ventas" (`ReportsScreen.kt:460`); `held_owner_missing` "Faltan N ventas por llegar" + note; `employeeDisplayName` maps the SQL sentinel to `employee_unnamed` in 4 languages (`ui/components/EmployeeNameLabel.kt:10`) |
| 4 | Chart axis "1.2M" everywhere | FIXED | `ReportsSalesChart.kt:135, 287-292` uses the shop's decimal mark |
| 5 | US/CA tips counted as sales | FIXED | see the section above |
| 6 | Staff on owner phone told "only this register" | FIXED | `sync/ReportsAudience.kt:31-36`, used at `ReportsScreen.kt:188` |
| 7 | Plurals "1 meses", "(1 facturas)" | FIXED | `res/values-es` plurals `accountant_gap_months`, `accountant_msg_suppliers(_clean)`, `accountant_msg_months` (lines 4272-4291), pt too |
| 8 | Three names; "Ventas totales" vs "Ventas netas" | FIXED | `accountant_title` = `reports_send_to_accountant` = `rp_page_accountant` "Resumen para el contador"; first row `accountant_total_sales` "Ventas netas" = Reports' net |
| 9 | "Pagado a empleados $0" on short ranges | FIXED | row and text line left out when no whole month (`EmployeePayActions.kt:381, 418`) |
| 10 | Wompi card-fee row always $0 + warning | FIXED | row hidden when no fee known, note `accountant_card_fees_none_note` instead (`EmployeePayActions.kt:348-351`) |
| 11 | WhatsApp/PDF failure copies with no message | FIXED | `ShareAccountantScreen.kt:423-440, 489-491` copy + Toast `accountant_whatsapp_failed` / `accountant_pdf_failed`. Real share sheet not seen |
| 12 | PDF plain text dump, no wrap, one page | PARTLY | wraps and adds pages (`ShareAccountantScreen.kt:455-470`). It is still the same plain 12pt text, no title, no table, no bold |
| 13 | Copy only by long press | FIXED | visible copy icon per row (`ShareAccountantScreen.kt:368-372`) |
| 14 | Intro assumes a man | FIXED | es "tu contador o contadora", pt "quem cuida da sua contabilidade", en "they". Title and button still say "el contador" (generic) |
| 15 | Client can't be taken off a sale | FIXED | X on the chip, `ui/screens/home/CheckoutCustomerField.kt:764, 819, 847` -> `assignCustomerToCart(null)` |
| 16 | WhatsApp raw digits; label = button | FIXED | `CustomerPage.kt:160` `formatWhatsappForReading`; button "Escribir por WhatsApp" (:161) |
| 17 | "Cédula / NIT" and CO example everywhere | FIXED | `sync/IdDocumentLabel.kt` per country, neutral "Documento de identidad" elsewhere; hint "Código de país + número" (no number) |
| 18 | "Nombre (Nombre preferido)", "transacciones", accent sort | FIXED | `crm_field_first_name` "Nombre"; `crm_no_transactions` "No hay compras..."; `sync/CustomerOrder` Collator + base letter (`CustomerCrmScreen.kt:445-446`) |
| 19 | No client count on panel row | FIXED | `HomeScreen.kt:1694` "N clientes" |
| 20 | New hire PIN hidden until reopen | FIXED | one-time dialog `TeamManagementScreen.kt:317, 343-357` |
| 21 | Owner can block himself, no confirm | FIXED | `sync/BlockSelfRule.kt`, asks; only owner refused (`TeamManagementScreen.kt:268-272`) |
| 22 | Back on form drops changes | FIXED | `rememberSubNav` on the form (`TeamManagementScreen.kt:1104`) |
| 23 | "Agregar facturas de proveedor" does nothing | FIXED | switch no longer drawn (`TeamManagementScreen.kt:1522`) |
| 24 | Every non-owner "Cajero" | PARTLY | Team list shows job title or "Equipo" (`TeamManagementScreen.kt:728-733`). Still "Cajero" on the counter-tablet sign-in list when there is no job title (`ui/screens/mamapos/MamaPosScreen.kt:89`) and on "Conectar celular de empleado" for every default employee (`ui/screens/connections/ConnectEmployeePhoneScreen.kt:104`; default role is CASHIER, `data/Employee.kt:19`) |
| 25 | WhatsApp hint "+1 305…", no length check | FIXED | hint `crm_whatsapp_hint`, `teamWhatsappAcceptable` before Save (`TeamManagementScreen.kt:1130, 1273`); old phone field commented out |
| 26 | Two delete confirms; counts differ | FIXED | one `EmployeeRemoveDialog` (:629, :1436); `TeamFormRules.teamTitleCount` = panel rule (`HomeScreen.kt:1746`) |
| 27 | PIN can't change; PIN sent as plain text | PARTLY | "Cambiar PIN" for owner view (`TeamManagementScreen.kt:1425, 1630`). The WhatsApp invite still carries the PIN in plain text (`ui/screens/team/StaffInviteSection.kt:59-64`) |
| 28 | Green dot always on owner | FIXED | only the red blocked dot remains (`TeamManagementScreen.kt:669-676`) |
| 29 | "Propietario"/"dueño"; "PIN"/"Tu código" | FIXED (es) | es "Dueño" everywhere, `team_code_none` "Aún no hay PIN". pt still mixes: team "Dono", register actor "Proprietário" (`res/values-pt-rBR/strings.xml:655-656`) |
| 30 | Pay ask with salaries in staff PIN session | FIXED | ask checked and drawn only for owner view (`HomeScreen.kt:266, 1372`) |
| 31 | "Switched itself off" notice never shown | PARTLY | shown on the Team page under the switch (`TeamManagementScreen.kt:460-467`). Not shown on Home when it happens; the owner sees it only if he opens Team |
| 32 | "Meses anteriores" unreachable when off | FIXED | door shows when `hasConfirmedPayMonth` (`TeamManagementScreen.kt:591`) |
| 33 | No cancel while turning on | FIXED | Cancel button (`TeamManagementScreen.kt:583-587`) |
| 34 | "1 personas" | FIXED | plural `employee_pay_history_people` |
| 35 | Consent "if the month ends" vs 25th | FIXED | `employee_pay_consent_row3_title` "Si pasa el 25 sin respuesta, se apaga solo" |
| 36 | Month editor no guard; "Rastrear" | FIXED | `rememberSubNav` in `EmployeePayHistoryScreen.kt:178`; "Llevar la cuenta de los pagos a empleados" |
| 37 | Asks about month before tracking; cold-start miss | FIXED | `EmployeePayActions.kt:91-98` (since-month check, fresh roster). Real cold start not seen |

**Prompt 7 totals: 33 fixed, 4 partly, 0 not fixed, 0 can't tell.**

---

## 2. PROMPT 8 - Discounts, taxes, combos, connections, store, offline, backup, security, businesses (44 items)

| # | Item (short) | Verdict | Evidence |
|---|---|---|---|
| 1 | Service charge 15% in CO | FIXED | `sync/ServiceFeeSeed.kt:12-13` 10% CO; `data/repo/SeedStore.kt:220` |
| 2 | Fee only after restart | FIXED | seeded at creation after the country (`ui/pos/WorkspaceActions.kt:500-505`) |
| 3 | Wrong toast on saving a rule | FIXED | "Guardado" (`DiscountsManagementScreen.kt:187`). The other toast (`disc_links_updated`, :162) is still the robotic "Los vínculos del ajuste 'X' fueron actualizados exitosamente!" with no "¡" |
| 4 | Mixed "Recargo/Cargo:/Tarifa" | PARTLY | one word "cargo" in es (no recargo/tarifa left). But the new seed name makes the cart and receipt line read "Cargo: Cargo por servicio" (`CartSheetContent.kt:930`, `ReceiptActions.kt:91-95`, label `checkout_fee_label` "Cargo: %1$s") |
| 5 | Fingerprint prompt "¿Aplicar descuento?" | FIXED | "¿Quitar el cargo?" (`res/values-es:3008`) |
| 6 | Unnamed "Descuento" line; Sí/No card no money | FIXED | `CartDiscountLabel.kt` "Descuento: <name>"; `OptionalFeeValueText.kt` "10% · $2.000" |
| 7 | Comma in tax %; no 100% cap | FIXED | `sync/TaxPercentInput.kt` |
| 8 | Can't edit a tax; no "incluido"; no presets | FIXED | edit form (`TaxesManagementScreen.kt:57-123`), presets (`sync/TaxPresets.kt`), `CartTaxLabel.kt:18-21` "incluido" |
| 9 | "Combo creado" before saving | FIXED | "Tu combo" |
| 10 | Empty text "a un precio" | FIXED | "Vende varios productos juntos con descuento." |
| 11 | Small top-bar Siguiente/Guardar | FIXED | bottom buttons `NewComboScreen.kt:270, 661`, deals too |
| 12 | Save with zero items or blank % | FIXED | `sync/ComboSaveRule.kt` + Toast (`NewComboScreen.kt:241`) |
| 13 | Picker no prices, rows < 48dp | FIXED | `NewComboScreen.kt:591-610`, `DesignTokens.ComboPickRowMin` 48dp |
| 14 | ACTIVO always; no tile badge; combo not named | PARTLY | pause switch (`ComboRowCard.kt:99-119`), tile badge (`ProductCard.kt:201`). Cart says only "Descuento de combo", not the combo's name; the receipt does not name it |
| 15 | Remove dialog "Esta caja" for a phone | FIXED | `ConnectionDialogs.kt:203` phone text for the included case |
| 16 | "primera caja" vs "segunda caja" | FIXED | nudge "Conecta tu primera caja" |
| 17 | Top bar not paper; US/CA title twice | PARTLY | US/CA title no longer repeated (`ConnectionsScreen.kt:140`). Top bar is still the plain `SumaTopBar` (`ConnectionsScreen.kt:101`) |
| 18 | Locked store: untrue "Todas tus conexiones en uso" | FIXED | `StoreLockedDialog` with ADD / CONNECT texts (`sync/StoreLockRule.kt`, `ui/app/ConnectionEventsHost.kt:59`) |
| 19 | Store unlock vs "Agrega tu tercera conexión" | PARTLY | lock card and dialog now say a device must USE the connection. The Add connections page still shows "Agrega tu tercera conexión y tu tienda online queda incluida." (`AddConnectionsScreen.kt:214`, `conn_dlg_store`), which is not true until a device uses it |
| 20 | Link is platata-app.web.app | NOT FIXED | `sync/OnlineStoreSlug.kt:22` (left for Monti) |
| 21 | Orders heard only while app is open | FIXED | was already there: `SellOnlineScreen.kt:311` "Deja Platata abierta para oír los pedidos nuevos" |
| 22 | Dishes silently dropped from online menu | FIXED | `HiddenItemsCard` with the reason (`SellOnlineScreen.kt:404-410`) |
| 23 | Shop name iOS blue #007AFF | NOT FIXED | `public/store/store.css:6, 23` |
| 24 | Strip says "al teléfono del dueño" | FIXED | "Se envían a la nube y le llegan al dueño cuando vuelva el internet." |
| 25 | Offline order not at kitchen not said | FIXED | `held_sales_strip_kitchen` on tablet and waiter phone (`MamaPosScreen.kt:1042`, `MiniPosSellScreen.kt:472`). Shown for every restaurant, kitchen screen or not |
| 26 | Owner gets no offline sign | PARTLY | owner phone "Sin internet" strip (`HomeScreen.kt:683`) and a note under "Faltan N". Still no sign that a REGISTER is offline (the "Faltan N" line itself needs that register to have internet) |
| 27 | "Sin sincronizar" | FIXED | "Pendiente de enviar: N ventas..." |
| 28 | "Nunca se borran" false | FIXED | `backup_drive_note`: older than 30 days are deleted |
| 29 | "Una vez al día" wrong | FIXED | "cada 6 horas si algo cambió" |
| 30 | Three date formats, English date | PARTLY | restore list/confirm, "Último respaldo" and the stopped bar use `sync/BackupDateFormat` (date + time). The Settings page backup row uses its own date-only format (`SettingsHubScreen.kt:268-271`), so two formats remain |
| 31 | "Respaldar ahora" spins forever offline | FIXED | `backupNoInternet` + "Sin internet. Se intentará de nuevo cuando vuelva." (`BackupSettingsScreen.kt:433`). Real WorkManager not seen |
| 32 | "Datos en Riesgo" | FIXED | "Tus datos no tienen respaldo" |
| 33 | "Eliminar dispositivos" does nothing | FIXED | not drawn (`SecurityScreen.kt:166`) |
| 34 | "Aplicar un descuento requiere aprobación" untrue | FIXED | "Quitar cargos / Quitar un cargo al cobrar pide tu huella..." |
| 35 | Settings row promises fingerprint for discounts | PARTLY | now "Pide huella antes de borrar o quitar cargos" (`res/values-es:97`), but it is shown whenever Security is on, while the "Quitar cargos" switch is OFF by default (`data/SecurityConfig.kt:13`) |
| 36 | No screen lock: switches silent | FIXED | dialog via `DeviceLockGate.forSecuritySwitch` (`SecurityScreen.kt:59, 201-204`) |
| 37 | Business delete on PIN-only phone | FIXED | one gate, panel closes only on success, "not confirmed" toast (`HomeScreen.kt:527-547`). Not seen on a PIN-only phone |
| 38 | Branch Security OFF, no switch | FIXED | missing row seeded ON (`SeedStore.kt:239-242`) |
| 39 | Flag prompt "¿Abrir configuración?" | FIXED | "¿Abrir tu negocio?" |
| 40 | "1 de 10" counts the open business | PARTLY | now "N de 10 en total", but still printed after the header "Tus otros negocios" (`ui/screens/more/ContextSwitcher.kt:360-361`), so "Tus otros negocios · 2 de 10 en total" above a list of one |
| 41 | "Celulares del equipo" vs "Teléfono de empleado" | FIXED | "Teléfonos de empleados" (en/es/pt/fr) |
| 42 | Branch name forced "La Fonda-Centro" | FIXED | `sync/BranchNameRule`, `BranchSetupScreen.kt:73-76` |
| 43 | Only open business shows register state | NOT FIXED | by decision (choke point 1) |
| 44 | List closes with X | FIXED | back arrow (`ContextSwitcher.kt:221`) |

**Prompt 8 totals: 33 fixed, 8 partly, 3 not fixed, 0 can't tell.**

---

## 3. New problems (from the fixes, or seen next to them)

1. **Cart and receipt say "Cargo: Cargo por servicio"** - `CartSheetContent.kt:930`, `ReceiptActions.kt:91-95`. The new Spanish seed name "Cargo por servicio" (`SeedStore.kt:211`) is put inside the label "Cargo: %1$s". Every new Colombian restaurant shows this double word on the till and on paper. (pt "Taxa: Taxa de serviço" and fr were already like this.)
2. **Ventas netas is now before tax in Colombia, unlabelled in places** - "Hoy · $X" on the panel (`ReportsStore.kt:64-76`, `scan_row_reports_today`) and the daily notification "Hoy: N ventas, $X" show a number below what was collected (IVA/impoconsumo removed) with no word "netas". An owner comparing with his drawer will think sales are missing.
3. **Employee / dining / top-dish lists don't match the headline** - `PosDao.kt:1144` still sums the full paid amount (tax, tips, charges). Under REPORTS-11's "Ventas netas" these lists no longer add up to it, and in US/CA an employee's sales include tips.
4. **"Antes de impuestos, propinas y cargos" in Colombia** - `reports_net_sales_note`. Outside US/CA there are no tips, so the word "propinas" is confusing there.
5. **"Cajero" left on two screens** - `MamaPosScreen.kt:89` (counter tablet sign-in) and `ConnectEmployeePhoneScreen.kt:104` (every default employee is CASHIER). A waiter or cook is called "Cajero".
6. **"Agrega tu tercera conexión y tu tienda online queda incluida"** on the Add connections page (`AddConnectionsScreen.kt:214`) contradicts the new lock dialog (the store opens only when a device uses it).
7. **Settings row "Pide huella antes de borrar o quitar cargos"** (`res/values-es:97`) while "Quitar cargos" is off by default: still a promise the app doesn't keep.
8. **"Puedes conectarla otra vez"** (`conn_rm_body`, `res/values-es:5472`) is also used for an employee phone (masculine).
9. **pt owner word mismatch** - "Dono" on Team, "Proprietário" for who opened/closed the register (`res/values-pt-rBR:655-656`).
10. **Store name mix** - new heading "Fuera de tu tienda en línea" (`sell_online_hidden_heading`) while the rest of the page and Connections say "tienda online".
11. **Kitchen note plural** - strip "Pendiente de enviar: 3 ventas..." followed by "Este pedido aún no llegó a la cocina." (singular), and it shows in a restaurant with no kitchen screen.
12. **Old toast on scope edit** - "Los vínculos del ajuste 'X' fueron actualizados exitosamente!" (`disc_links_updated`): no "¡", robotic.
13. Small, not new: accountant range label "20 octubre 2026" with no "de" (`EmployeePayActions.kt:384-388`, pattern "d MMMM yyyy"); combo screens still say "artículos" in a restaurant and "Nuevo Combo / Tus Combos" in title case.

---

## 4. Demo changes (what the demo must show differently)

**S11 Reportes**
- The money card is now a table: Ventas brutas, Descuentos, Devoluciones (N), **Ventas netas** (note "Antes de impuestos, propinas y cargos"), then + Cargos por servicio, + Cargos por tipo de pedido, + Impuestos, + Propinas (US/CA only), Redondeo, **Total cobrado**. Each line opens its own page.
- Ventas netas is before tax: show a smaller number than the drawer, with Total cobrado matching "Cómo te pagaron".
- US/CA demo: "Propinas" its own line; no "Propinas (ya incluidas)".
- "Hoy" now counts a waiter sale that arrives while Reports is open.
- "N ventas" under each employee; "Faltan N ventas por llegar" + "Llegan cuando esa caja vuelva a tener internet."; chart label "1,2M".
- Staff PIN session on the owner phone: no "solo ves esta caja" line.

**S12 Contador**
- One name: button, title and page "Resumen para el contador"; send button "Enviar resumen al contador"; first row "Ventas netas" (same number as Reports), plus Cargos/Propinas/Total cobrado rows.
- Copy icon on every row. PDF wraps and has pages. No "Pagado a empleados" on ranges shorter than a whole month. Wompi: no card-fee row, a note under card sales.

**S13 Clientes**
- X on the client chip at checkout. Client page: "+57 300 123 4567" and button "Escribir por WhatsApp". ID label per country ("Cédula / NIT" in CO only). Label "Nombre". Panel row "N clientes".

**S14 Equipo**
- New hire: a "PIN nuevo" dialog right after Save. "Cambiar PIN" on a saved person. Blocking yourself asks. Back asks before dropping changes. No supplier-invoice switch, no green dot. Badge = job title or "Equipo" (but "Cajero" still on the tablet sign-in and "Conectar celular"). "Dueño".

**S15 Pago a empleados**
- "Llevar la cuenta de los pagos a empleados"; Cancel while turning on; "Meses anteriores" reachable when off; "Se apagó en <mes>" note on Team; consent row "Si pasa el 25 sin respuesta, se apaga solo".

**S16 Descuentos y cargos**
- Seeded "Cargo por servicio" at 10% in CO, there from creation (no restart). Toast "Guardado". Cart line "Descuento: <nombre>"; Sí/No card "10% · $2.000". Removing a fee asks "¿Quitar el cargo?". Cart shows "Cargo: Cargo por servicio" (avoid filming it or wait for the fix).

**S17 Impuestos**
- "8,5" accepted; >100% refused. Tap a tax to edit it ("Editar impuesto", note about open tables). Preset chips IVA 19 / Impoconsumo 8 (choosing one warns about the other). Cart "IVA incluido".

**S18 Combos**
- Title "Tu combo"; Siguiente/Guardar are big bottom buttons; prices in the dish list; empty combo refused with a message; pause switch and ACTIVO/PAUSADO; combo pill on dish tiles; cart line "Descuento de combo".

**S19 Conexiones**
- Hero "...para tu primera caja", nudge "Conecta tu primera caja"; remove dialog for a phone says "Este teléfono..."; US/CA no repeated title. "Teléfonos de empleados".

**S20 Vender en línea**
- Locked store: dialog "Tu tienda online aún no está abierta" with "Agregar una conexión" or "Conectar un dispositivo". New card "Fuera de tu tienda en línea" listing hidden dishes and why. Link still platata-app.web.app; customer page name still blue.

**S21 Sin internet**
- Tablet/waiter strip: "Pendiente de enviar: N ventas guardadas en esta caja" / "Se envían a la nube..." / (restaurant) "Este pedido aún no llegó a la cocina." Owner phone: thin "Sin internet" line on Home.

**S22 Respaldo**
- Texts: every 6 hours if something changed, older than 30 days deleted. Dates in the phone's language. "Respaldar ahora" offline says "Sin internet. Se intentará de nuevo cuando vuelva." Card "Tus datos no tienen respaldo".

**S23 Seguridad**
- Do not demo "huella para descontar": only REMOVING a fee is checked. Row "Quitar cargos". No "Eliminar dispositivos" switch. New Refund PIN card at the top (FIX-4). No screen lock: tapping a switch explains. Flag asks "¿Abrir tu negocio?".

**S24 Varios negocios**
- Header "Tus otros negocios · N de 10 en total"; back arrow (no X); branch name field holds the whole name (default "La Fonda-Centro", editable); a branch has Security on. Register state still only for the open business.

**R demos (cart/receipt with the service charge)** - any R demo that shows the seeded fee now shows 10% in Colombia and the line "Cargo: Cargo por servicio".
