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
