# Coder prompts, round 2: what is left after the restaurant fixes (20 Oct 2026)

Checked against the code at commit 0eac2554 (branch sim/usa-canada, 20 Oct, 2:33 PM). Every item was read in the code; file:line is from that commit.

Result of the check: of the 213 items, 181 are fixed, 26 are partly fixed, 5 are not fixed and 1 needs a device. Most of the leftovers are small words. The full item-by-item tables (about 90 KB) are with Claude; the project has no room left for them.

There are 4 prompts, and each stands alone. Prompt 1 matters most.

---

## PROMPT 1: Money and the order trip (do these first)

```
Money and the order trip. Code at 0eac2554, branch sim/usa-canada.

1. THE DRAWER OPENS ON EVERY SALE. The new main switch says "Abrir el cajón después de una venta en efectivo", but each payment method's own drawer switch defaults to ON (PosViewModel.kt:4846, hwPrefs "drawer_<method>" default true). So card, QR, Nequi, Cortesía and fiado sales also open the drawer (ReceiptPrinterTestSection.kt:89). Default every method except Cash to OFF. Test: a card sale with the main switch on sends no drawer kick; a cash sale does.
2. TWO KEYPAD STYLES STILL IN ONE SHIFT (US, CA, PE, PA, EC). Open / Close / Cash in-out and the pay screen now read 1-2-5 as 125. But the till's Keypad tab (KeypadView.kt:52, CartActions.kt:69) and the services price keypad (PriceKeypadPage) still read it as 1.25 with a "00" key. Use the one MoneyKeypadEntry rule there too. Test: 1-2-5 on the Keypad tab equals 1-2-5 on the pay screen, in COP and USD.
3. CAN THE COUNTER TABLET CHARGE A WAITER'S TABLE? Each staff device downloads only orders stamped with its own register code or a blank one (OrderSyncController.kt:600, orderServerTokenScope). It is not clear whether a waiter phone's Mesa 4 ever reaches the counter tablet, so the tablet can charge it, in a shop with 1 tablet + waiter phones. Leave a test that proves it: waiter phone saves Mesa 4 -> the tablet's open tickets list shows Mesa 4 -> the tablet charges it -> the owner sees one paid sale (not two, not zero), and the cash lands in the right drawer. If it does not work, fix it.
4. "ENVIAR A COCINA" ON THE WAITER PHONE AND TABLET. A new sale on the waiter phone skips the cart step where "Enviar a cocina" now appears, so it still says "Guardar"; on the tablet the cart step says "Enviar a cocina" and the pay step right after says "Guardar" (P3 #22). And after the waiter taps "Enviar a cocina", the message still says "Guardado: Mesa 4" (SavedTicketNotice.kt:42). Use one label on every step, and say "Enviado a cocina: Mesa 4" when it went to the kitchen.
5. "VENTAS POR EMPLEADO", dining-option sales and top dishes still count the full amount paid, tips and tax included (PosDao.kt:1144). They no longer add up to "Ventas netas" (which now leaves tips, tax and charges out). Use the same rule as Ventas netas. In US/CA an employee's total must not include tips.
6. "VENTAS NETAS" IN COLOMBIA. The panel "Hoy · $X" and the daily notification now show sales before IVA, with no word "netas", so they look smaller than what the drawer took. Say "Ventas netas (sin impuestos)" there, or show what was charged. The note "Antes de impuestos, propinas y cargos" also shows in Colombia, where there are no tips: say "Antes de impuestos y cargos" outside US/CA.
7. WAITER PHONE CAN'T OPEN THE REGISTER BY DEFAULT. Opening now needs "Abrir y cerrar caja", which is off by default (Employee.kt:37). Correct, but the waiter only sees a refusal. Say "Pídele al dueño el permiso Abrir y cerrar caja".

Edit only. Do not build, run, install or verify.
```

---

## PROMPT 2: Tables, kitchen screen, devices (leftovers)

```
Tables, kitchen and devices. Code at 0eac2554, branch sim/usa-canada.

1. "Agregar a la mesa" shows on services and shop tablets and staff phones too (OpenTicketBanner.kt:82-98, MamaPosScreen.kt:1309). Restaurants only.
2. Typing a name hides the table on the Abiertas card: the line under the name shows the waiter's name instead of "Mesa 4" (OpenTicketTitle.kt:51-52). Show both: "Juan · Mesa 4".
3. The kitchen card says "Mesa 4", but the window it opens is titled "#57" or "#Juan" (KdsTicketDetailDialog.kt:77-79). Use the card's title.
4. A to-go order with no name and no table gets an empty title on the kitchen card (KdsTicketCard.kt:93-97). Use the order type ("Para llevar").
5. The amber open-ticket bar shows the order note before the table, e.g. "sin cebolla" instead of "Mesa 4" (OpenTicketBanner.kt:127-131). Table or name first.
6. The tablet's ready card says "Pedido #57" (the tablet's own number) and no customer; the customer's WhatsApp also says "Tu pedido #57" (MamashipNotificationPanel.kt:112, OrderFlowActions.kt:116). Use "Mesa 4" / the name, never a device-local number. The phone's own order number also still shows on the printed comanda and the open-order page.
7. After "Todo listo" the undo bar says "Enviado Hamburguesa × 3" in es and pt (kds_bumped_undo). Say "Listo: Hamburguesa × 3".
8. The kitchen connection bar calls the owner phone "la caja", while the pairing texts call it "el teléfono principal". Pick one.
9. The printer hint says to turn the switch off "if the waiter's phone already prints", but a waiter phone can't add a printer. Remove that part.
10. The kitchen add flow suggests kitchen names (Cocina, Parrilla…) to shops too, and a shop's order printer page says "pedidos de cocina". Restaurants only.
11. Crossed-off lines in the kitchen ticket window are still lost when it closes (P4 #6).
12. The printer lists still don't say which printer is for receipts and which for the kitchen (P4 #23). The Bluetooth permission prompt still pops up when the Add printer page opens, before Search is tapped (P4 #24).
13. "Cajero" is still on the counter tablet's sign-in faces (MamaPosScreen.kt:89) and on "Conectar celular de empleado" (ConnectEmployeePhoneScreen.kt:104).
14. Words: a named customer reads "Juan lista" (use "Pedido de Juan listo"); "Enviar a Cocina" (capital C) sits next to "Enviar a cocina"; pt "Acréscimo de Atendimento" is title case; pt still says "PDV BLOQUEADO" in capitals; four pt strings still say "opção de serviço"; the kitchen history time is still "h:mm a"; the old Menú › Otros row still doesn't mention Mesas.
15. The waiter still taps "Cobrar" to save a table, and the blue "Exacto" (charges at once) sits above "Guardar" (earlier flag 5). Put "Guardar" / "Enviar a cocina" beside "Cobrar" on the waiter phone, like the owner phone.

Edit only. Do not build, run, install or verify.
```

---

## PROMPT 3: Menu (leftovers)

```
Menu. Code at 0eac2554, branch sim/usa-canada.

1. On a dish with sizes, the first size's price box shows twice: the plain "Precio" box and row 0 of "Precio de cada tamaño" (ItemsScreen.kt:1131 and 1193). Show it once.
2. Menu review: an emptied name silently keeps the AI's name, and an emptied price saves the dish at $0 with no warning (MenuImportReview.kt:33, MenuOnboardingScreen.kt:407). Block Save on an empty name; ask "¿Guardar sin precio?" for an empty price.
3. "Intentar de nuevo" after a blank camera photo starts over, and on the page opened from the register it drops the owner back on the register (MenuImportService.kt:89, MenuImportActions.kt:76). Keep him on the import page and reopen the camera.
4. The cancel dialog says "Seguir editando" while the AI is still working (MenuOnboardingScreen.kt:97-108). Say "Seguir esperando".
5. Dish wording left in Spanish: "Eliminar artículo", "¿Descartar este artículo?", "Aún no hay productos", "agrega tus productos a mano", "Crear Plato" (capital P). Combo screens still say "artículos" in a restaurant. pt still has "Menu completo".
6. The Portuguese sizes question has no accents: "Voce vende outros tamanhos?" and "Cada um com seu preco." It shows on every restaurant dish form.
7. The add-on picker lists choices and prices only for add-ons with 3 choices or fewer, so most ready-made ideas still show the name only. Show the first 3 and "+N más".

Edit only. Do not build, run, install or verify.
```

---

## PROMPT 4: Words and small screens (payments, register, back office)

```
Words and small screens. Code at 0eac2554, branch sim/usa-canada.

Payments and register
1. The US/CA card-device dialog still says "efectivo, QR y fiado" (card_device_dialog_still_works, CardDeviceIntroGate.kt:122). There is no QR in US/CA and no fiado for a restaurant. Say only what that shop has.
2. Brazil: the first-run payment chip and pitch still say "Pagamento QR" / "Dinheiro e QR" (BusinessTypeOptions.kt:147, 345). Say Pix.
3. The sign-in line "Para que tu negocio nunca se pierda" still clashes with the bar "Este negocio no tiene respaldo".
4. pt backup bar "Este negócio não está sendo salvo" reads as "not being saved", which is false and alarming.
5. pt says "Faltante" on the Register screen but "Falta" on Close. One "turno" is left: minipos_panel_close_register_desc says "...cerrar el turno". pt calls the owner "Dono" on Team and "Proprietário" for who opened or closed the register.
6. The refund note blames "descuentos y cargos" on every sale whose total differs from the item prices, including tax, a tip or cash rounding. Name the real reason.
7. The custom-method confirm says "en tu app de Datáfono" for a method that is not an app. Say "Confirma que recibiste el pago".
8. The refund flow still has English title case: "Confirm Refund", "Refund Amount".
9. Possible squeeze in the Wompi refund dialog: "Abrir Wompi" and "Copiar número de transacción" sit in one Row with no weight. Render it at 360 dp.
10. The refund PIN pad does not say where the PIN is. Add "Está en Configuración › Seguridad".

Back office
11. A new Colombian restaurant's cart and receipt read "Cargo: Cargo por servicio" (CartSheetContent.kt:930, ReceiptActions.kt:91-95, checkout_fee_label "Cargo: %1$s"). Show only the fee's name.
12. Add connections still says "Agrega tu tercera conexión y tu tienda online queda incluida" (AddConnectionsScreen.kt:214, conn_dlg_store), which is not true until a device uses the connection.
13. The Settings row says "Pide huella antes de borrar o quitar cargos" while "Quitar cargos" is off by default (SecurityConfig.kt:13). Say only what is switched on.
14. The remove dialog says "Puedes conectarla otra vez" (feminine) for an employee phone too (conn_rm_body).
15. "Fuera de tu tienda en línea" doesn't match "tienda online" used everywhere else.
16. The offline strip says "3 ventas…" then "Este pedido aún no llegó a la cocina" (singular), and it shows in restaurants with no kitchen screen.
17. The toast after changing a rule's items is still "…fueron actualizados exitosamente!" with no "¡". Say "Guardado".
18. The accountant date reads "20 octubre 2026" (no "de"). The accountant PDF is still plain text.
19. The Settings backup row uses its own date format; the other backup screens use the new one.
20. "Tus otros negocios · 2 de 10 en total" sits above a list of one. Move the count to the page title.
21. The combo name is not in the cart ("Descuento de combo") or on the receipt.
22. The Connections top bar is still the plain bar, not the paper style of the page.
23. Still not done: the PIN is sent in plain text in the WhatsApp invite; the employee-pay "switched itself off" notice shows only on the Team page; cash in/out on the tablet and waiter phone; the owner sees no sign that a REGISTER is offline.

Edit only. Do not build, run, install or verify.
```

---

## Decided by Monti (20 Oct, 4:25 PM): do not flag these again

- Combo name on the printed receipt: after launch (needs a database change). The combo name shows in the cart now.
- The PIN goes in the WhatsApp invite on purpose.
- Cash in and cash out stay on the owner phone only.
- A per-register "offline" sign: after launch.
- A prettier accountant PDF: after launch. The date wording ("20 de octubre de 2026") is fixed now.
