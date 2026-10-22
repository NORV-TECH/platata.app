# Restaurant feature map (real app, read only)

Date: 19 Oct 2026. Source: Monti's PC, `Platata/app/src/main` (read only, nothing written).
Languages: es | pt-BR | en only. French dropped.
Feature names: features/DEMO-FEATURE-LIST-18oct.md (R1–R11, S1–S24).
Kotlin paths below are under `java/com/example/` unless noted.
Screenshots are under `app/src/test/screenshots/`, newest first.
"Preview" = `...ScreenKt.<Name>Preview.WITH_BACKGROUND.png` (all dated 2026-10-16).

Main walk-through source: `_sim/INVENTARIO-RESTAURANTE.md` (7 Sept, 742 actions).
Careful: it is older than Stripe. It says card is Colombia only. The code now also has US/CA Stripe.

---

## 0. Big findings (read this first)

1. Card by country is one switch: `sync/CardCountryGate.kt`.
   US, CA → Stripe. CO → Wompi. Every other country → no card button.
2. Brazil Pix carries the sale amount: `ui/pos/PixCheckoutPayload.kt`.
   It reads the reusable Pix key from the bank QR photo and draws a new QR with the total. Nothing is saved.
3. Tips exist ONLY inside Stripe (US/CA), as a screen before tapping the card.
   For LatAm there is no tip screen and no service-charge (10%) setting.
   The old `TippingScreen` source is gone. Its strings (`settings_tipping_*`) and preview PNG are still there.
4. Taxes have no country presets. No impoconsumo (CO 8%), no IVA preset. The owner types the name and %.
5. Wompi (CO) card is a typed form. There is no card photo or camera scan anywhere in the code.
6. Spanish Stripe strings use "vos" (Acercá, Insertá, Deslizá). The rest of the app uses "tú". Needs fixing before a US/CA Spanish video.
7. Kitchen printing is real: "Enviar a cocina" prints a comanda to the order printer (`ui/pos/SavedTicketActions.kt` line ~469, `PrintManager.printOrderTicket`).

---

## 1. Payments by country (code paths)

Shared checkout for every country: `ui/pos/CheckoutSheetBody` + `CheckoutPayBlock`.
Pay buttons, in order:
- Cash: "Exacto · %s" | "Exacto · %s" | "Exact · %s", or type an amount.
- QR: `qr_pay_btn` (or `qr_setup_btn` "Configurar" if no QR saved; only the owner can set it up).
- Card: `card_pay_btn` / `card_offline_btn` / `card_setup_btn`. Shown only when CardCountryGate is not NONE.
- "Más formas (%d)" | "Mais formas (%d)" | "More ways (%d)" → the other-methods sheet.
Other labels: "Desglose" | "Detalhes" | "Breakdown"; "Recibido"; "Cambio" | "Troco" | "Change".

### 1a. QR (all countries)
Setup (owner): photo or upload of the bank's QR → `setQrFromImage` (BankQrSetup).
- Saved: "Pagos con QR listos" (`pay_qr_setup_saved`). Failed: `pay_qr_setup_failed`.
Responsibility warning (shown before first use):
- Files: `QrTermsGate.kt`, `QrResponsibilityScreen.kt`.
- es: "Platata no es responsable por los pagos QR. Antes de entregar cada compra, revisa en tu b[anco]…"
- Design ref in project: features/qr-warning-design.html.
At checkout (QR overlay):
- "Total a cobrar" | `qr_total_to_charge`.
- "Que el cliente escanee con su app del banco" (`qr_scan_hint`).
- "Pagó · Sin foto" | `qr_no_receipt_needed`.
- "Pagó · Foto del pago" | "Pago · Foto do comprovante" | "Paid · Photo of transfer".
- Owner can force the photo (`forceReceiptPhoto`).
- Default note: "No olvides tomar una foto del recibo."
Screenshots: QrPaymentOverlayTest.qrOverlay_light_baseline (10-16).

### 1b. Brazil Pix with the amount
- `ui/pos/PixCheckoutPayload.kt`, Brazil only.
- At setup, Pix QRs are checked:
  - `qr_setup_pix_not_valid`: the picture is not a valid Pix.
  - `qr_setup_pix_one_time`: it is a one-time Pix (has a fixed amount). Not allowed.
- At checkout the QR shown already holds the sale total. The customer doesn't type the amount.
- Other countries: the static bank QR is shown; the customer types the amount.

### 1c. Colombia: Wompi card
- Gate: CardCountryGate "CO" → WOMPI.
- Overlay form: "Datos de la tarjeta". Fields: Número / Vence / CVC / Nombre en la tarjeta.
- Two consent lines: Wompi terms and personal data.
- Button "Cobrar %s" → "Enviando al banco… No cierres la app."
- Result: "Pago aprobado", or "Pago rechazado" with "Intentar otra tarjeta" / "Cobrar de otra forma".
- Time-out: "Verificar estado".
- Cuotas (installments): `WompiConfig.askInstallments` (setting, off by default) and `defaultInstallments`.
  The overlay uses `defaultInstallments`. I don't see a cuotas picker per sale on the form.
- Card photo/scan: I DON'T SEE THIS. Searched for camera, scan, OCR, card photo in Wompi and card code.
- Refund: "Devolver en Wompi"; "Siguiente: devolver %s en Wompi" (refund is finished in Wompi).

### 1d. US and Canada: Stripe Tap to Pay
- Gate: "US", "CA" → STRIPE. File: `StripePaymentSheet.kt`.
- Device check: Tap to Pay needs Android 13+ with NFC (`card_device_bar_*`).
- Tip screen (only if "Pedir propina" is on, `ask_for_tip_switch`, Payment methods → Card, US/CA only):
  - "¿Agregar propina?" | "Adicionar gorjeta?" | "Add a tip?"
  - Presets "%d%% · amount", "Sin propina", "Otro monto".
- Then "Preparando el cobro…" → "Acercá la tarjeta" | "Tap the card" → "Procesando… No retires la tarjeta".
- Fail: "Cobro no completado". Unknown: "No sabemos si el cobro se hizo" + "Verificar estado".
- Stripe holds/review states: `pay_card_hold_*`.
- es uses voseo here (see finding 6).
- Refund: "Vuelve a la tarjeta del cliente"; if no reference: "Devuelve esto en la caja que cobró la tarjeta, o en Stripe." + "Abrir Stripe".
- Canada: "Interac no se puede devolver aquí. Entrega efectivo o crédito…" | "Interac can't be refunded here. Give cash or store credit."
Screenshots: CheckoutScreenshotTests.checkout_cardOn_360_light / _pt (10-16).

### 1e. Other / custom methods (all countries)
- "Más formas (%d)" opens "Otro método de pago", subtitle "Total %s · se cobra al tocar".
- List = active payment methods minus cash/QR/card (e.g. Transferencia, Datáfono, custom).
- "Cortesía" (comp) shows only if the user may comp (`canComp`).
- One tap charges. Refund line: "Devuelve %s por %s".
Screenshots: CheckoutScreenshotTests.checkout_everythingOn_640_pt (10-16).

### 1f. Cash (all countries)
- Screen: CashTender. "%s en Efectivo"; "Monto recibido"; "Cambio: %s".
- Quick button "Exacto · %s" in the pay block.
- Refund: "Entrega %s en efectivo" | "Give %s back in cash".
Screenshots: CashTenderScreenPreview (10-16).

### 1g. After paying (all countries)
- ReceiptOptions: "¡Venta completada!" | "Venda concluída!" | "Sale complete!"
- "Recibiste %s", "CAMBIO", WhatsApp, print again, "Ver recibo", "Nueva venta" | "Nova venda" | "New sale".
Screenshots: ReceiptOptionsScreenPreview (10-16).

### 1h. What changes by country (summary table)
| Country | Card | QR | Tips | Notes |
|---|---|---|---|---|
| CO | Wompi typed form | bank QR photo | none | no impoconsumo preset |
| BR | none | Pix with amount | none | Pix one-time QR rejected |
| MX, AR, PE, CL, EC, PA | none | bank QR photo | none | |
| US | Stripe Tap to Pay | bank QR photo | Stripe tip screen (opt-in) | Android 13+ NFC |
| CA | Stripe Tap to Pay | bank QR photo | Stripe tip screen (opt-in) | Interac can't be refunded in-app |
Currency comes from the country picked at start ("País y moneda").
Taxes: custom in every country (see S17).
Service charge: no preset anywhere. Closest: fee template "Propina para grupo grande" or a custom fee.
Receipts: same options in every country.

---

## 2. Restaurant look

Colors (`PaperColor.kt`):
- RestauranteMain #EB5A2E (orange-red accent)
- RestauranteBtn #C44B28 (buttons)
- RestauranteSoft #F9EAE3 (soft fill)
- RestauranteInk #BE4927 (text on soft)
- Type icon: "hamburguesa" (BusinessRules.kt).
Light theme only for demos (dark PNGs exist; ignore them).

Register / home:
- Lands on the Library tab: categories on top, product tiles below.
- Tabs on the register: "Teclado" | "Teclado" | "Keypad"; "Catálogo" | "Catálogo" | "Library"; Favorites.
- Footer button: "Cobrar %s" | "Cobrar %s" | "Charge %s".
- Bottom area: "Mi negocio" | "Meu negócio" | "My business" (settings hub).
Tables / open tickets:
- Open-ticket bar above the footer (Stage64a).
- Combo offer bar above the footer: "Oferta de Combo −%d%%".
Kitchen display: "Pedidos activos" | "Pedidos ativos" | "Active Orders"; empty "¡Esperando pedidos!".

Newest screenshots of the look:
- 10-18: ux-after-30sep/2-other-doors/05-d1-connect-a-tablet-or-kitchen-screen-light.png
- 10-16: PaperThemeSampleTest.paper_restaurante_light
- 10-16: PaperPieceCaptureTest.rows_restaurante_light, buttons_restaurante_light, chrome_restaurante_light, chat_restaurante_light
- 10-16: Stage64aPhotosTest.open_ticket_bar_es_360
- 10-16: Stage64bNewPiecesPhotosTest.combo_offer_bar_es_360, combo_offer_bar_above_footer_es_360
- 10-16: Stage64bPhotosTest.kitchen_empty_light_phone_es_360
- 10-16: Stage63AfterPhotosTest.current_sale_strip_es_360, pay_block_items_link_es_360
- 10-16: MenuLayoutPartsKt.MenuScreenBodyPreview360x640 / 390x844
- 10-16: KitchenDisplayScreenPreview, YourMenuScreenPreview.W360dp_H640dp

---

## 3. Restaurant features (R1–R11)

### R1 AI builds the menu
Screens: menu add chooser → menu camera → processing → review.
Words (es | pt | en):
- "Agregar al menú" | "Adicionar ao cardápio" | "Add to the menu"
- "Tomarle una foto a la carta" | "Tirar uma foto do cardápio" | "Take a photo of the menu"
- "Subir PDF o fotos"; "Escribirlo yo"
- Camera: "Fotografiar el menú" | "Fotografar o cardápio" | "Take Menu Photos"; "OK (%d)"
- Processing: "Leyendo tu menú…" → "Consultando la IA…" → "Organizando tu menú…"
- Review: "Revisa tu menú" | "Confira seu cardápio" | "Review your menu"; "%d artículos encontrados en la foto"
- Button: "Agregar %d artículos" | "Adicionar %d itens" | "Add %d items"
- Empty menu: "Tu carta está vacía" / "Tómale una foto a tu carta y te la armamos."
Taps: Library empty → photo the menu → OK → wait → review → Add N items.
By country: prices read in the local currency. Needs internet (AI).
Screenshots: MenuDoorsPhotosE13Test.library_two_buttons_light, sheet_three_rows_light, library_camera_off_light; MenuHeaderPhotosE40Test.*

### R2 Edit the menu
Screen: YourMenuScreen. Header "%d artículos · %d categorías".
Taps: Mi negocio → menu → tap a dish → change price → save. "+" to add.
Restaurant form shows an "Add-ons" row under Category (BusinessRules E-25).
Stock/bodega block is hidden for restaurants (BusinessRules C9).
By country: currency only.
Screenshots: YourMenuScreenPreview.W360dp_H640dp, ItemsScreenPreview, CategoryHubScreenPreview, CategoryItemsScreenPreview (10-16).

### R3 Add-ons and options
Screens: ModifiersManagementScreen (ModifierEditor), OptionsManagementScreen, ModifierTrigger screens.
Words: "Requerido"; "elige 1"; "hasta %d"; "Agregar a la venta" | "Adicionar à venda" | "Add to sale".
Taps at the till: tap a dish → ask price (if open price) → option sets → add-on sheet → "Agregar a la venta".
Restaurant wording on these screens (BusinessRules C19).
Screenshots: ModifierEditorScreenPreview, FollowUpPickerScreenPreview, OptionsPickerScreenPreview, ModifiersPickerScreenPreview, NewModifierTriggerScreenPreview (10-16).

### R4 Take an order at a table
Words:
- "¿Qué mesa?" (table grid, 1..99 from the Mesas dining option table count)
- "Guardar" | "Salvar" | "Save" → saves an open ticket (PENDING)
- Park dialog: "Nombre o mesa" | "Nome ou mesa" | "Name or table"; chips "Mesa %d"; toast "Guardado: %s"
- Void a line already sent to kitchen: PIN + reason (VoidPinDialog).
Taps: add dishes → Cobrar → "¿Cómo sale este pedido?" → Mesas → pick table → Guardar.
Reopen from the open-ticket bar, add more, then charge.
Screenshots: Stage64aPhotosTest.open_ticket_bar_es_360, void_pin_step_es_360, void_reason_step_es_360 (10-16).

### R5 Dine in, takeout, delivery
Screen: DiningOptionsScreen "Opciones de servicio" | "Opções de serviço" | "Dining options".
Gate at checkout: "¿Cómo sale este pedido?" | "Como este pedido vai sair?" | "How is this order going out?"
Options: "Para aquí" | "Para comer aqui" | "For Here"; "Para llevar" | "Para viagem" | "To Go";
"Domicilio" | "Entrega" | "Delivery"; "Mesas".
Settings: "%d mesas"; "Recargo: %s" (upcharge per option); "Predeterminada".
By country: the upcharge is in local currency. Same everywhere otherwise.
Screenshots: Stage64bPhotosTest.dining_options_settings_es_360; DiningOptionsScreenPreview (10-16).

### R6 Waiters take orders on their phone (MiniPos)
Screens: MiniPos / TeamPos (pairing, login, disconnected), PhoneRegister* setup screens.
Words: `minipos_not_set_up_title`; "Caja cerrada"; PIN strings "Ingresa tu PIN".
Pairing: "Conectar un dispositivo" | "Conectar um dispositivo" | "Connect a device";
"Escribe el código que aparece en tu dispositivo principal"; "¿Qué estás conectando?"
Taps: main phone shows a code → waiter phone types code → picks employee → PIN → takes order → "Enviar a cocina".
Paid connection (see S19).
Screenshots: TeamPosPairingScreenPreview, TeamPosLoginScreenPreview, PhoneRegisterListScreenPreview, PhoneRegisterPickEmployeeScreenPreview (10-16).

### R7 Kitchen display
Screen: `ui/screens/kds/KitchenDisplayScreen`.
Words: "Pedidos activos" | "Pedidos ativos" | "Active Orders"; "Historial"; "¡Esperando pedidos!";
"Todo listo · %s"; undo "Enviado %s × %s".
Taps: order from register appears → tap "Todo listo" → order leaves the list (undo possible).
Runs on the local network (LanSync); a kitchen display never talks to Firestore.
Screenshots: Stage64bPhotosTest.kitchen_empty_light_phone_es_360; KitchenDisplayScreenPreview; KdsListScreenPreview, KdsDetailScreenPreview, KdsSyncInfoScreenPreview (10-16).
Note: I only see the EMPTY kitchen photo; no photo with orders on it.

### R8 Kitchen screen settings
Screen: ConfigureKdsRulesScreen.
Words: "Nombre de la Pantalla" (hint "ej. Cocina principal, Bar"); "Prepara la comida"; "Revisa y despacha pedidos";
"Categorías a Mostrar"; "Tipos de pedido"; "Temporizadores de Alerta".
Taps: KDS → rules → name "Bar" → pick "Bebidas" category → save.
Screenshots: ConfigureKdsRulesScreenPreview (10-16).

### R9 Counter tablet (MamaPos)
Screen: MamaPosScreen; CounterRegister* setup screens.
Words: "POS BLOQUEADO"; "Toca para iniciar sesión"; "Elige tu perfil"; "Ingresa tu PIN".
Taps: tablet paired → tap → profile → PIN → sell.
Screenshots: MamaPosScreenPreview; CounterRegisterListScreenPreview, CounterRegisterNameScreenPreview, CounterRegisterSyncInfoScreenPreview (10-16).

### R10 Print to the kitchen and the customer
Screens: PrinterAddScreen, PrinterListScreen, PrinterDetailScreen, PrinterNameScreen.
Words: "Agregar impresora"; kinds "Recibos" and "Pedidos de cocina" | "Pedidos da cozinha" | "Kitchen orders";
"Impresora Wi-Fi"; Bluetooth printers too.
Code: kitchen kind = `PrinterKind.ORDER`; printing happens on send-to-kitchen
(`ui/pos/SavedTicketActions.kt` ~469 → `PrintManager.printOrderTicket`).
Restaurants get receipt AND kitchen printers (`PrinterKinds.RECEIPT_AND_KITCHEN`).
Customer receipt: from ReceiptOptions "Imprimir".
Screenshots: PrinterListScreenPreview, PrinterDetailScreenPreview, PrinterNameScreenPreview (10-16).
Note: no screenshot of a printed comanda.

### R11 Order ready message
Code: `utils/ReadyOrderMessage.kt`.
Text: "¡Tu pedido #%s está listo! 🎉" | "Seu pedido #%s está pronto! 🎉" | "Your order #%s is ready! 🎉"
Also a KDS "order ready" pop-up (INVENTARIO ACT-418).
Taps: kitchen marks ready → register shows ready → WhatsApp the customer.
Screenshots: I don't see one for the ready message.

---

## 4. Shared features (S1–S24) for a restaurant

### S1 Start a business
Words: "Tu negocio, en tu bolsillo"; "Empezar mi negocio"; "Ya uso Platata".
Country: "País y moneda" | "País e moeda" | "Country & currency"; "Detectado"; "Continuar".
Type: restaurante → RESTAURANT (`BusinessTypeOptions.kt`, default type there is RESTAURANT).
Also "Conectar un POS / impresora", "Conectar una pantalla de cocina (KDS)".
Screenshots: BusinessSetupScreenPreview, BranchSetupScreenPreview (10-16).

### S2 Open the register
"Abrir caja"; "Efectivo inicial" | "Troco inicial" | "Starting cash".
Screenshots: ScreenshotTests.open_register_opening_light.

### S3 Take cash — see 1f.
### S4 Take QR — see 1a/1b.
### S5 Take a card — see 1c/1d. Only CO, US, CA.
### S6 Other ways to pay — see 1e.

### S7 Receipt by WhatsApp or printer — see 1g.
Screenshots: ReceiptOptionsScreenPreview, ReceiptSettingsScreenPreview (10-16).

### S8 Refund a sale
Words: "Monto a devolver" | "Valor a devolver" | "Refund Amount"; "Devolver %s" | "Devolver %s" | "Refund %s";
"Pagado %s · Queda por devolver %s"; "Devuelto" | "Devolvido" | "Refunded".
Where money goes: cash / same method / customer tab / card (see 1c, 1d).
Status in list: Pagada / Devolución parcial / Devuelta / Anulada / Pendiente.
Screenshots: Stage63AfterPhotosTest.sales_card_partial_refund_es_160; RefundPinDialogPreview; TransactionsScreenPreview (10-16).

### S9 Cash in and out
"Sacar efectivo" / "Meter efectivo"; reasons Proveedor / Retiro del dueño / Sencillo / Otro.

### S10 Close the register
Screenshots: ScreenshotTests.close_register_long_breakdown_light, register_closed_summary_light.

### S11 Reports
"Reportes"; "Ventas por período"; "Ventas netas"; "Enviar al contador".
Screenshots: ReportsScreenPreview (10-16).

### S12 Send to the accountant
"Compartir con tu contador"; "Compartir PDF".
Screenshots: ScreenshotTests.accountant_with_data_light.

### S13 Customers
"Clientes (%d)". Screenshots: ScreenshotTests.customers_full_light.

### S14 Team and PINs
"Agregar empleado". A "Cocina" (KITCHEN) role is created by default.
Screenshots: ScreenshotTests.team_full_light; TeamManagementScreenPreview (10-16).

### S15 Employee pay
"Pago mensual". Screenshots: ScreenshotTests.employee_pay_*.

### S16 Discounts and charges
DiscountConfig: DEDUCTION (discount) or ADDITION (charge); can ask at checkout (Sí/No); whole ticket or item.
Charge templates: Recargo por Tarjeta de Crédito; Cargo por empaque ecológico; Recargo nocturno;
Recargo por entrega local; Propina para grupo grande.
Restaurant use: delivery fee, large-group gratuity, also dining-option upcharge (R5).
Screenshots: DiscountsPhotosE21Test.*

### S17 Taxes
Screen: TaxesManagementScreen. Custom only: name, %, "¿Este impuesto ya está en tus precios?" (included / added).
No country presets. Impoconsumo: I DON'T SEE THIS (searched impoconsumo, INC, consumo in strings and code).
Screenshots: TaxesManagementScreenPreview (10-16).

### S18 Combos
"Tus Combos"; offer bar "Oferta de Combo −%d%%". Combo matching runs at the till (restaurant + services).
Screenshots: Stage64bNewPiecesPhotosTest.combo_offer_bar_es_360; ComboListScreenPreview, NewComboScreenPreview, DealListScreenPreview (10-16).

### S19 Second phone or counter tablet (connections)
"Conexiones"; sections "Cajas", "Teléfonos de empleados"; "Todo está incluido".
Pairing words in R6. Paid per connection; "La tercera y las siguientes" | "The third one and after".
Screenshots: 10-18 ux-after-30sep/2-other-doors/05-d1-connect-a-tablet-or-kitchen-screen-light; RegistersAndPrintersScreenPreview (10-16).

### S20 Sell online
"Vender en línea" | "Vender online" | "Sell online"; "Recibe pedidos desde un enlace".
Gate: "Desbloquea tu tienda online" / "Agrega tu tercera conexión y tu tienda online queda incluida."
US: "La tienda online está incluida en tu país."
Also "Primero conecta los pagos con tarjeta".
MISMATCH: the demo list says "comes with the second connection"; the app says THIRD connection.

### S21 Works with no internet
No screen for this. It's how the app works (local database). Card shows "Sin conexión" offline button.
Kitchen display and waiter phones use the local network.
I DON'T SEE a dedicated offline screen or banner to film (searched offline, sin conexión).

### S22 Backup to Google Drive
"Respaldo"; "Restaurar mi negocio"; frequencies "Tiempo real (Recomendado)", every 1 / 3 / 6 hours.

### S23 Fingerprint before discounts or deleting
"Pedir huella antes de borrar o dar descuentos" (settings hub).
Security screen: "Contraseñas y Seguridad" | "Senhas e Segurança" | "Passcodes & Security";
"Requerir PIN para Operar"; "Requerir PIN al Iniciar".
Screenshots: SecurityScreenPreview, OnboardingSecurityScreenPreview (10-16); SettingsHubPhotosB04Test.*

### S24 More than one business and branches
"Negocios"; "¿Dónde estás trabajando hoy?"; "Crear o recuperar un negocio";
"Agregar una sucursal de un negocio existente"; "+ Agregar negocio".
Screenshots: MyBusinessesScreenPreview (ContextSwitcher), BranchSetupScreenPreview (10-16).

---

## 5. "I don't see this in the app" (do not drop; talk with Monti)

1. Card photo / camera scan for Wompi. Searched camera, scan, OCR in card code. Only typed form.
2. Cuotas picker per sale. Only a setting default (`askInstallments` off, `defaultInstallments`).
3. Impoconsumo or any tax preset per country. Taxes are typed by hand.
4. Tips / service charge (10%) for LatAm. Only Stripe tip (US/CA) and the "Propina para grupo grande" fee template.
   TippingScreen source is deleted; strings and preview PNG are leftovers.
5. A screen for "works offline" (S21). It is a property, not a screen.
6. Screenshot of the kitchen display WITH orders (only the empty one exists).
7. Screenshot of the order-ready WhatsApp message and of a printed comanda.
8. S20 says "second connection"; the app unlocks the store at the THIRD connection.
9. Stripe Spanish uses voseo, not "tú" (not missing, but wrong for the demo).
