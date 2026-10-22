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
