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
