# Round 2 check (code at 6736ddfb, "Fusion 9", 20 Oct 7:57 PM PT)

Read only. Paths are under `app/src/main/java/com/example/` unless they start with `res/` (= `app/src/main/res/`).

**Counts (52 items):** FIXED 45 · PARTLY 6 · NOT FIXED 1 · CAN'T TELL 0. Items that are only partly decided-skip: P4 #18 (PDF look), P4 #21 (receipt), P4 #23 (PIN in invite, cash in/out, per-register offline).

## Prompt 1: Money and the order trip

| # | Status | Evidence |
|---|---|---|
| 1 | FIXED | `sync/DrawerMethodDefault.kt:7` (ON only for Cash); `ui/PosViewModel.kt:4845` uses it; kick gated `ui/pos/CheckoutActions.kt:614-615`. Test `mkt2/DrawerOnlyOnCashMkt21Test`. |
| 2 | FIXED | `ui/pos/CartActions.kt:71` uses `MoneyKeypadEntry.press`; `KeypadView.kt:52` zero key from `MoneyKeypadEntry`; `ui/screens/guide/PriceKeypadPage.kt:86-88` same rule; reader `utils/CurrencyUtils.kt:58` reads whole units. |
| 3 | FIXED | Test `mkt2/WaiterTableReachesTabletMkt21Test` (blank token admitted by `orderServerTokenScope`, tablet charges, one paid sale, tablet drawer). Worked already; now pinned. |
| 4 | PARTLY | Waiter phone: label `ui/screens/onboarding/MiniPosSellScreen.kt:521`, toast `:226-233` + `SavedTicketNotice.kt:42` (`ParkTicketRules.toastRes(sentToKitchen)`). Pay step new sale `ui/screens/home/CheckoutSheetBody.kt:322-332`; tablet cart step `CartSheetContent.kt:1198`. OPEN (FOLLOW-1): counter tablet still drops the save message silently, `ui/screens/mamapos/MamaPosScreen.kt:1023-1027`. |
| 5 | FIXED | `data/NetSplits.kt` (employees, dining, categories, top dishes on `SalesBreakdown.moneyOf` net); `data/repo/ReportsStore.kt:171-204`. Test `mkt2/EmployeeDiningDishNetRuleMkt21Test`. |
| 6 | FIXED | `sync/NetSalesWords.kt`; panel `HomeScreen.kt:1784`, note `ReportsScreen.kt:272`, notification `work/AlertNotifier.kt:133`. es "Ventas netas hoy · %s" (res/values-es:3362), "Antes de impuestos y cargos" (:1413), notif "(sin impuestos)" (:5854); pt/en equivalents present. |
| 7 | FIXED | `register_open_not_allowed`: es "Pídele al dueño el permiso Abrir y cerrar caja" (values-es:4007), pt :4006, en :4099; shown `ui/screens/cash/OpenRegisterScreen.kt:137`. |

## Prompt 2: Tables, kitchen, devices

| # | Status | Evidence |
|---|---|---|
| 1 | FIXED | `MamaPosScreen.kt:1311`, `MiniPosSellScreen.kt:495`: `onAddItems` only when `isRestaurantType`. |
| 2 | FIXED | `ui/components/OpenTicketTitle.kt:51-56` (LABEL subtitle = "Mesa 4 · Carlos"; customer keeps typed name + table). |
| 3 | FIXED | `ui/components/KdsTicketTitle.kt:14`; dialog `KdsTicketDetailDialog.kt:79`, card `KdsTicketCard.kt:97`. |
| 4 | FIXED | `KdsTicketTitle.kt:18-19` falls back to the localized dining option. |
| 5 | FIXED | `OpenTicketBanner.kt:121-131` (label, table, customer, then note). |
| 6 | FIXED | Ready card `MamashipNotificationPanel.kt:119-124`; WhatsApp `utils/ReadyOrderMessage.kt:18-24` (name or plain, no number); comanda `PrintManager.kt:405-409` (no `#orderId`); open-order page `transactions/TransactionsScreen.kt` `inspect_header` uses `TicketTitle`. |
| 7 | FIXED | `kds_bumped_undo`: es "Listo: %1$s × %2$s" (values-es:827), pt "Pronto:" (:826), en "Ready:" (:850). |
| 8 | PARTLY | Kitchen bar now "teléfono principal" (values-es:818-821). But the same pairing screen still says "celular principal": `connect_device_where` (values-es:1508), `connect_device_code_changes` (:1518) next to `connect_kitchen_wifi` "teléfono principal" (:1511). pt same mix (:1507/:1517 "celular" vs :1510 "telefone"). |
| 9 | FIXED | `printer_waiter_orders_hint` "Cada pedido que envíe un mesero se imprime aquí." (values-es:2318; pt :2317; en :2416). |
| 10 | FIXED | Name chips `onboarding/KdsAddFlowScreen.kt` StepName(kitchen) with back-room names; printer list `PrinterListScreen.kt:140,154` (`printer_routing_note_slips`, waiter switch restaurant only). |
| 11 | FIXED | `ui/components/KdsCrossedOffMemory.kt` (in memory; restart loss accepted); used `KdsTicketDetailDialog.kt:82,156,217`. |
| 12 | FIXED | Kinds on each row `PrinterListScreen.kt:187,209-211`; no prompt on open `PrinterAddScreen.kt` (only `loadPairedDevices` when granted; the Allow tap asks). |
| 13 | FIXED | `MamaPosScreen.kt:87-90` ("Equipo"); `connections/ConnectEmployeePhoneScreen.kt:78,99`. |
| 14 | PARTLY | Fixed: "Pedido de Juan listo" (values-es:1048, `OrderReadyEffect.kt:53`), pt title case, "Caixa bloqueado", no "opção de serviço", kitchen time `KdsTicketCard.kt:74`, Otros row says "y mesas" (values-es:107). Left: pt `home_send_to_kitchen` "Enviar para Cozinha" (values-pt-rBR:354) and en "Send to Kitchen" (values:369), shown `CartSheetContent.kt:1178` beside `checkout_send_kitchen` "Enviar para a cozinha" / "Send to kitchen". |
| 15 | FIXED | `MiniPosSellScreen.kt:519-521` `onMamaSave` beside Cobrar; drawn `CartSheetContent.kt:872-876`. (WaiterPayStepFitsWaiter1Test still open, FOLLOW-1.) |

## Prompt 3: Menu

| # | Status | Evidence |
|---|---|---|
| 1 | FIXED | `ui/screens/items/ItemsScreen.kt:1133-1144` hides the plain Precio box when a restaurant dish has more than one size. Test `DishSizePriceOnceMkt23Test`. |
| 2 | FIXED | `data/MenuImportReview.kt` (`nameEmptied`, `priceMissing`, counts); `MenuOnboardingScreen.kt` Save disabled on empty name, "¿Guardar sin precio?" dialog. |
| 3 | FIXED | `MenuOnboardingScreen.kt` onRetry: `retrySource == null` -> `doors.openCamera()` (state stays Error, page stays). Test `MenuImportRetryBlankPhotoMkt23Test`. |
| 4 | FIXED | `menu_onboarding_cancel_keep_waiting` "Seguir esperando" (values-es:3487; pt :3486; en :3614) used while not Parsed. |
| 5 | PARTLY | Fixed: Eliminar plato, ¿Descartar este plato?, Aún no hay platos, menu_onboarding_no_text "platos", "Crear plato" (`typeLabel.lowercase()`), combo_any/specific/checklist/count -> platos, pt "Cardápio completo". Left in restaurant-only screens: `combo_empty_line` "Vende varios productos juntos…" (values-es:3667, pt "itens" :3666) in `combos/ComboListScreen.kt:68`; `combo_slot_overline_main` "1 · Producto principal" (values-es:3684, pt "Item principal" :3683) in `NewComboScreen.kt:342`; `menu_onboarding_page_cap_body` "…esos productos a mano" (values-es:3481, pt "itens" :3480). |
| 6 | FIXED | values-pt-rBR:612-613 "Você vende outros tamanhos?" / "Cada um com seu preço." |
| 7 | FIXED | `ui/screens/items/AddOnChoicesLine.kt:9-14` (first 3 + "+N más", `addon_choices_more` in 3 languages). |

## Prompt 4: Words and small screens

| # | Status | Evidence |
|---|---|---|
| 1 | FIXED | `sync/CardDeviceStillWorks.kt`; four strings in es/pt/en (values-es:1277-1280). |
| 2 | FIXED | `onboarding/BusinessTypeOptions.kt:147,345`; `payment_method_pix`, `biz_pitch_pay_*_pix` in 3 languages. |
| 3 | FIXED | `auth_subheadline` es "Tu negocio queda ligado a tu cuenta de Google.", pt/en equivalent. |
| 4 | FIXED | pt `backup_off_banner_title` "Este negócio ainda não tem backup". |
| 5 | FIXED | pt `register_status_short` "Falta"; es `minipos_panel_close_register_desc` "…cerrar la caja" (values-es:3780); pt `shift_actor_owner` "Dono". Nit: pt still "Conte o caixa e feche o turno" (values-pt-rBR:3779). |
| 6 | PARTLY | `sync/RefundProrateNote.kt` reasonOf + `TransactionsScreen.kt:1790-1806`. NEW PROBLEM: the TIP reason says "La devolución incluye su parte de la propina" (values-es:406, pt :406, en :423), but the tip is never prorated: it comes back whole only when its own line is ticked (RefundMath `itemRefund`, "THE TIP DOES NOT PRORATE"). The text is false. |
| 7 | FIXED | `pay_custom_confirm_title` "Confirma que recibiste el pago de %1$s en %2$s." (es/pt/en). |
| 8 | FIXED | en `tx_confirm_refund_title` "Confirm refund", `tx_refund_amount` "Refund amount". |
| 9 | FIXED | Render test `mkt2/WompiRefundHelpersRenderMkt21Test` (360 dp, es/fr/pt, font 1.3, no cut/overlap). |
| 10 | FIXED | `transactions/RefundPinDialog.kt` `refund_pin_where` ("Está en Configuración › Seguridad", pt/en). |
| 11 | FIXED | `checkout_fee_label` deleted; `ui/pos/ReceiptActions.kt:92-93` fee name only. |
| 12 | FIXED | `conn_dlg_store` "Tu tienda online se abre cuando una tablet o un teléfono de empleado usa tu tercera conexión." (es/pt/en). |
| 13 | FIXED | `settings/SettingsHubScreen.kt:262` picks `settings_hub_security_on_delete` when fee removal is off. |
| 14 | FIXED | `conn_rm_body` "El dispositivo se desconecta… volver a conectarlo" (es/pt/en). |
| 15 | FIXED | "tienda online" in `sell_online_hidden_heading`, `online_sales_channel_desc`, `notif_online_order_line`. |
| 16 | PARTLY | Plural fixed: `HeldSalesStrip.kt:63` + `held_sales_strip_kitchen_many` (3 languages). OPEN (FOLLOW-1): `kitchenNote` is still `isRestaurantType` only, no kitchen-screen check (`MamaPosScreen.kt:1043`, `MiniPosSellScreen.kt:480`). |
| 17 | FIXED | `disc_links_updated` / `mod_links_updated` / `opt_links_updated` "Guardado: '%s'". |
| 18 | FIXED (PDF: decided, skip) | `sync/AccountantDate.kt` (localized LONG pattern, "20 de octubre de 2026"); used `ui/pos/EmployeePayActions.kt:387-388`. |
| 19 | FIXED | `SettingsHubScreen.kt:272` uses `BackupDateFormat.dateTime`. |
| 20 | FIXED | `more/ContextSwitcher.kt:223-236` count under the page title (`biz_count_title`). |
| 21 | FIXED (receipt: decided, skip) | `home/CartDiscountLabel.kt:16,33,39-41` combo name in the cart. |
| 22 | FIXED | `connections/ConnectionsScreen.kt:101` `SumaTopBar(paper = true)`. |
| 23 | NOT FIXED (3 of 4 decided, skip) | PIN in invite, cash in/out, per-register offline sign: decided. The employee-pay "switched itself off" notice is still only on Team (`team/TeamManagementScreen.kt:300,462`); nothing on Home. |

## New problems the fixes made

1. **Refund note "tip" reason is false** (P4 #6): values-es:406 / pt:406 / en:423, chosen at `TransactionsScreen.kt:1803`. The tip is refunded whole only when ticked. Fix: "La propina va en su propia línea: márcala para devolverla."
2. **"Pedido lista" / "Pedido pronta"** (P2 #14): an unnamed ready order goes through `template(unnamed)` at `ui/screens/home/OrderReadyEffect.kt:27` = "%1$s lista" (values-es:1047) with "Pedido" (values-es:828), and "%1$s pronta" (pt:1046). Fix: a separate `kitchen_order_ready_snack_plain` "Pedido listo" / "Pedido pronto" / "Order ready".
3. **A salon's deal now says "plato"** (P3 #5): `combo_error_no_items` became "Agrega al menos un plato al combo." (values-es:3709, pt "prato" :3708, en "dish" :3864), and `comboSaveRefusalText` (`combos/ComboSaving.kt:78`) is also used by `NewDealScreen.kt:231`, which services and shops reach (`SettingsNavGraph.kt:182`, `CatalogNavGraph.kt:254`). Fix: a `combo_error_no_items_dish` for NewComboScreen only, and keep the neutral word for deals.

Smaller, older: the waiter's save toast and the amber bar still fall back to the device's own `#id` when the ticket has no name and no table (`SavedTicketNotice.kt:39`, `OpenTicketBanner.kt:131`).

## FOLLOW-1 items (current state, one line each)

- WaiterPayStepFitsWaiter1Test: still open. 6188d3df only makes the failure name the button and its sizes; nothing in the layout changed.
- Counter tablet save message: still silent (`MamaPosScreen.kt:1023-1027` only dismisses the flag).
- Offline strip kitchen line where there is no kitchen screen: still shown (gated on `isRestaurantType` only, `MamaPosScreen.kt:1043`, `MiniPosSellScreen.kt:480`).
- pt `refund_paid_left`: already Portuguese at HEAD and at 0eac2554: "Pago %1$s · Falta devolver %2$s" (values-pt-rBR:402). "Pago" is correct Portuguese for "paid", so nothing may need doing (optionally "Restante a devolver").
