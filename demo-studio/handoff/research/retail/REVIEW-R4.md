# REVIEW-R4: retail demos T4 T5 T8 TS6 TS16 TS17 (+ US-es TS6)

Reviewer: independent pass, 21 Oct 2026. App checked at /home/claude/app-head (2fd8f9a3). I edited no demo or app file.
Method: I rebuilt each video's voice timeline from its own audio clips (the page's `window.__timeline`, same as the recorder),
pulled one frame at 70% of every voice line plus one in every silent gap over 2.4 s, and strips of extra frames where something
looked wrong (T5 gap, TS6 lines 5-6, TS17 en line 4). Frames: /tmp/claude-0/-home-claude/b81398e0-b7d9-57cf-b753-63da5401d97f/scratchpad/newretail/.

All 19 videos decode in ffprobe (1080x1920), 26.0 to 39.7 s, and each length equals the rebuilt timeline end.

## Summary
| Feature | es (CO) | pt (BR) | en (US) / US-es |
|---|---|---|---|
| T4 Sin código | 1 nice | 1 nice | 1 MUST, 1 nice |
| T5 Por peso | 1 nice | 1 nice | 2 nice |
| T8 Fiado | 2 MUST | 2 MUST | 2 MUST |
| TS6 Otras formas de pago | 1 MUST | 1 MUST | 1 MUST (en + US-es) |
| TS16 Descuentos | 1 MUST, 1 nice | 1 MUST | 1 MUST |
| TS17 Impuestos | 1 nice | 1 nice | OK |

Claims verified in the code:
- New payment method is saved switched on: PaymentConfigActions.kt:166-174 `isActive = true` ("Queda encendido de una vez" is true).
- Example name per country (Nequi CO, Zelle US, else Transferencia/Transferência): page follows sync/PaymentMethodExample.
- Custom-method confirm text and buttons match `pay_custom_confirm_title/_yes/_back` in en, es, pt-BR.
- Fiado only from the owner's phone: `canFiar` has no switch in Team (TeamManagementScreen.kt:1179 only reads it) and the staff chip is dim (CartSheetContent.kt:379), so "solo desde tu teléfono" is true.
- Labels: `fiado_chip_fiar_customer` (Fiar a / Fiar para / Put … on tab), `checkout_other_method`, `scan_focused_add` (Agregar al carrito / Adicionar ao carrinho / Add to Cart), `opt_add_to_sale`, `home_tab_library` (Catálogo / Library), `disc_title`, `disc_use_template`, `tax_title`, `common_new_short` all match the app.
- Weight dialog subtitle "$ 2.800 por lb" and "0,5 lb" chips for Libra: `home_weight_unit_info` + unit abbreviation (Libra's abbreviation is lb), WeightEntryDialog.kt:50,87.
- Colombia tax presets: a shop gets only IVA 19% (TaxPresets.forCountry drops Impoconsumo for non-restaurants); Brazil none on purpose; the edit page note "Las ventas pasadas conservan lo que cobraron" is the app's.
- Money: CO "$ 7.300" (prefix "$ " NBSP, no decimals), BR "R$ 11,99", US "$5.48" match functions/test-vectors/money-format.json. All weight sums are right (1.5 x 2.800 = 4.200; 0.5 x 42,90 = 21,45; 2 x 1.39 = 2.78; etc.).

## T4 (Productos sin código)
- **MUST (en)** Voice line 2 "Your products show up with a drawing" plays over a grid where "Cheddar cheese" and "Tomatoes" show the grey 🍽️ placeholder (no drawing). T4.html:332 maps them to "". Real app falls back to the category emoji, never a plate. Fix: T4.html:332 set `"Tomatoes":"tomato","Cheddar cheese":"cheddar"` and add the `cheddar` SVG (app asset no_barcode_icons/cheddar.svg) to `ICONS` at T4.html:333.
- nice (all) Line 1 "Toca Sin código": the tap lands 0.8 s into the line, before the words are said (home screen shows only 0.8 s). Fix: give the first step a `wait` (see engine fix under T8) of ~1.8 s, T4.html:682.
- nice (pt) The price field shows "6.90" (internal dot) in Brazil. This is the app (BarlessShelfScreen.kt:521 has no money transformation), not the page; report to the app list.

## T5 (Vender por peso)
- nice (all) 3.4-3.7 s of silence between line 4 and line 5 (tablet → "En tu teléfono, igual" card → phone home). The screen changes, so not dead air, but long. Fix: shorten the card's hold in T5.html (the beat-4 tap's `E.after` that switches to the phone).
- nice (en) Same 🍽️ placeholder for "Cheddar cheese" / "Tomatoes" on the phone grid. Fix: T5.html:333 same map as T4 (`"Tomatoes":"tomato","Cheddar cheese":"cheddar"` + cheddar SVG).

## T8 (Fiado)
- **MUST (es, pt, en)** The "Sale complete" screen's main button reads "??receipt_opt_new_sale_no_receipt" while the voice says "Toca Nueva venta". The key is missing from T8's string table. Fix: T8.html:38 add `"receipt_opt_new_sale_no_receipt": {"en": "New sale · No receipt", "es": "Nueva venta · Sin recibo", "pt": "Nova venda · Sem recibo"}` to `STR`.
- **MUST (es, pt, en)** Line 4 "El botón ahora dice Fiar y su nombre. Tócalo." (3.4-4.6 s): the Fiar tap fires 0.8 s in, so for 2.6-3.8 s the voice describes a button that is already gone (screen shows "Fiaste $ 7.300"). Fix: kit/engine.js:157 `beatTapsPlanned = list.map((x,k)=>({i:x.i, at: t + 0.8 + (x.s.wait||0) + k*gap}));` and T8.html:742 add `wait:2.2,` to the Fiar step.
- note (pt) WhatsApp reads "+55 119 123 456 78": the app's formatWhatsappForReading (already known, REVIEW-R1).

## TS6 (Otras formas de pago) — es, pt, en, US-es
- **MUST (all four)** Line 6 "Platata te pide confirmar que viste el pago. Revisa tu app y toca Sí, cobrar" (4.7-6.2 s) plays almost entirely over "¡Venta completada!": the Sí, cobrar tap fires 0.8 s into the line (confirmed in TS6-en strip: dialog 23-26.6 s, sale complete 26.6-32 s). Fix: with the engine change above, TS6.html:553 add `wait:3.0,` to the "yes" step (or move step TS6.html:552 to `beat:5`).

## TS16 (Descuentos y cargos)
- **MUST (es, pt, en)** Voice line 5 "Elige el artículo: los tomates golpeados / bruised tomatoes" but the item ticked is plain "Tomate / Tomatoes", so the 30% "damaged goods" discount lands on EVERY tomato sold (line 7: "comes off when you sell that item"). Misleading. Fix: TS16.html:447 target a seeded item named "Tomate golpeado" / "Tomate machucado" / "Bruised tomatoes" (add it to the page's ITEMS), or change features/TS16.json:55-57 + TS16.html:579-581 to "Elige el artículo: el tomate".
- nice (es) 3.0 s silence after "Toca Guardar" with only the "Guardado" toast. Fix: none needed, or trim the beat-5 settle.

## TS17 (Impuestos)
- nice (es) The IVA preset shows "En Colombia los restaurantes cobran impoconsumo 8% en vez de IVA" in a SHOP. That is the app (`tax_preset_one_or_other`), but it reads oddly for a tienda; report to the app list.
- nice (pt) Tax named "Imposto 5%" is generic; a Brazilian viewer may expect a real name. Optional: TS17.html pt name.
