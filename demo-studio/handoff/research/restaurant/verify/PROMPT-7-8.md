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
