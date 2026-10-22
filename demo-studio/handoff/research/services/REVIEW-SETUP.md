# REVIEW-SETUP: services demos V1 (trade + written services), V2 (edit price / options / Duración), VS1 (new business), VS17 (taxes)

Reviewer: independent pass, 22 Oct 2026. App read at `/home/user/suma-plus-android` sim/usa-canada **73c65f0**, clean tree.
I edited no file except this one. Running the checker rewrote the screenshots in `demo-studio/_check/`. My probe frames are in
`/tmp/claude-0/-home-user-platata-app/96476401-bbfa-5681-be22-524ea1c374e3/scratchpad/review-setup/`.

How I checked:
- **Strings:** I pulled `STR`/`PLU` out of each page and compared every key and language with `values`, `values-es` and
  `values-pt-rBR`. There are **0 differences** (V1 97 keys, V2 93, VS1 116, VS17 125). So the remaining questions were where
  each word sits, the data, and the timing.
- **Checker:** `check_demo.py servicios/{V1,V2,VS1,VS17} CO:es BR:pt MX:es` passed all **12 runs OK**.
- **Video timeline:** I ran each video in `mode=video` with `dur=` taken from the script lengths (chars/14 + 0.6 s). I logged
  the time of every tap and grabbed frames at 0.3 s, 55 % and the end of every beat, for CO es, BR pt and MX es (V1-MX and
  V2-MX use their own scripts). Beats match json steps everywhere: V1 8/8 (MX 8/8), V2 9/9 (MX 9/9), VS1 8/8, VS17 9/9.
- **Scripts:** es 284–377 chars, pt 304–381, MX 289/370, all ≤ 550. tú / você are right, there are no greetings, and every
  last line is right. All subtitles are ≤ 60 chars.
- **`?biz=`:** veterinaria, taller-motos and unas on V1/V2/VS17 (CO, plus V1 MX taller) and unas on VS1 all ran with no
  errors and every tap done. The screens make sense: taller gets "Crear orden" and a search to find its trade.
- **Hard rules:** there is no US/CA script and no French. Only the light theme is used. No card, no scan, no logo, no fee
  (VS1 MX reads "Efectivo, QR y tarjeta · Gratis, para siempre."). There are no fake AI people. No brand appears on screen:
  the seeded branded hair products exist only as the count "Productos · 13", and "Botox capilar" is never shown.

## Summary

| Feature | es CO | pt BR | MX es |
|---|---|---|---|
| V1 Escoge tu oficio | **1 MUST**, 4 nice | **1 MUST**, 2 nice | **1 MUST**, 2 nice (V1-MX) |
| V2 Edita precios y opciones | OK (1 nice) | OK (2 nice) | OK (1 nice) (V2-MX) |
| VS1 Empieza desde cero | OK (2 nice) | OK (2 nice) | no -MX needed; the es lines are true for MX, page OK |
| VS17 Impuestos | **2 MUST**, 3 nice | **2 MUST**, 3 nice | no -MX needed (words verified the same, preset IVA 16 %); the same **2 MUST** apply to the MX run |

---

## V1 Escoge tu oficio: los servicios ya vienen escritos

**Verified against the code:**
- **Trade picker** (`TradePickerScreen.kt:127-277`). Progress 1/3 + "Oficio" + flag. Lede "con precios" appears only in CO
  (:180-186); MX/BR get `trade_picker_lede_no_prices`. Families come in `TRADE_ORDER` with counts. There is no tab row and no
  bottom bar during setup (`HomeScreen.kt:618`, `PlatataApp.kt:416-466`). The closed-register bar is hidden (:458).
- **Pick page** (`PickServicesScreen.kt`). Nothing is pre-ticked. "Marcar los 12 populares": peluqueria has 12 starters.
  Groups follow first appearance (Corte, Peinados, Color…). The subtitle carries a price only in CO, "desde" = lowest priced
  choice (:425-433).
- **Next page** (`OnlineNavGraph.kt:92-103` + `GuideLogic.setupPriceStartsAsList`). CO gets the card, everyone else the list.
- **Price card** (`BridgeScreen.kt`):
  - Corte de dama in CO has no priced pick-one, so it is one price 45.000 with pills 36/45/54.000 (`pricePills`).
  - The header reads "40 min · Peluquería".
  - The ComesRow reads "Incluidos: 1 · Se cobran aparte: 2" (Lavado; Cepillado +$ 25.000; Recargo… asked at the till).
  - The "Lo que trae" sheet (`LoQueTraeSheet.kt`) matches: there are no minutes on the rows, because
    `ResearchedOptionStates.kt` sets none.
- **List** (`ServicesPriceListScreen.kt`). Progress is full. Plain rows have a box and a chevron. Choice rows show
  "N opciones" + range pill.
  - Outside CO the first plain box opens focused (allEmpty).
  - In BR/MX, 10 of the 11 ticked services become choice services, because the first ESCOGER UNO stays as unpriced choices
    (`CatalogoInvestigadoATienda.kt:116-160`). So only Corte de caballero has a box, and the page types into exactly that one.
- **Choices page opened from the list** (confirmLeave=false; "Según la opción | En la caja"; a 118 dp box per choice with
  minutes): matches.
- **Done page** (`ServicesDoneScreen.kt`): names in catalogue order, trade-tint pills, "Ir a la caja".
- **Till** (`GuideActions.finishBridge`):
  - Every picker is stored FROM. There is no "Sugerido" badge (item 8 is fixed: :620/:631/:685).
  - Tiles are sorted by name (`PosDao.kt:334`). The first-tile ring and the "Toca un servicio para cobrarlo · Entendido"
    pointer are there. "Productos · 13" = the 13 researched products seeded.
  - The cut "Desde …" tiles are true to the app. They are already in the builder's notes, so I do not count them again.
- **Prices:** CO shows only the catalogue's price_co, plus the business's own typed price where the catalogue has none
  (Corte de caballero 25.000, Corte de niño 20.000). BR/MX show no suggested price anywhere (`soloDondeSonPesos`,
  `PriceSuggestions`); only what the owner types appears.

1. **MUST, es CO, beats 2–3 (voice vs screen).**
   - **What happens:** step `comes` (`V1.html:430`, beat 2) opens the "Lo que trae" sheet 0.8 s into "Cada servicio ya viene
     escrito, con el precio más común en Colombia" (5.5 s), so the price line plays over the sheet. Then step `sheet-done`
     (`V1.html:431`, beat 3) closes the sheet 0.9 s into "En Lo que trae ves lo incluido y lo que se cobra aparte", so that
     line plays over the closed price card.
   - **Evidence:** frames b2m (sheet up under the price line) and b3m (sheet gone under the Lo que trae line).
   - **Fix:** on `V1.html:430`, change `beat:2` to `beat:3`. On `V1.html:431`, add `wait:1.6`. Beat 2 then explains the
     price card with no tap, and the sheet is up for the whole Lo que trae line.
2. **MUST, pt BR + MX es, beat 6 (voice says what the screen does not show).**
   - **What happens:** "O que ficar vazio, o caixa pergunta na hora." / V1-MX "Lo que dejes vacío se pregunta en la caja."
     play over the done page. That page shows "¡Tus 11 servicios están listos! / Ya puedes cobrar. Los cambias cuando
     quieras con Editar, en la caja." (`bridge_done_line`). The claim is true in the app (an unpriced choice is UNSET, so the
     till asks), but nothing on that screen says it.
   - **Fix, voice:** `V1.json` pt `7-caja` becomes "Você já pode cobrar. Altere quando quiser com Editar.". `V1-MX.json`
     `7-caja` becomes "Ya puedes cobrar. Los cambias cuando quieras con Editar.".
   - **Fix, subtitles:** in `V1.html:461`/`:462`/`:463`, item 6 becomes "Ya puedes cobrar: cámbialos con Editar" / "Já pode
     cobrar: altere com Editar" / "You can charge now: change them with Edit".
   - **Optional, to keep the honest point:** say it in beat 2, where the list's "Si lo cobras en la caja, déjalo vacío." is
     on screen. For example MX `3-precios` "Tus servicios ya vienen escritos. Pon tu precio; si lo cobras en la caja, déjalo
     vacío.".
3. nice, all, beat 1. "Usar estos 11 servicios" is tapped 3.2 s into the 4.5 s line, so the price page is already up during
   "…y quita lo que no haces". Fix: add `wait:0.8` to the `use` step (`V1.html:416`).
4. nice, es CO, beat 2. "Cada servicio ya trae su precio en Colombia" claims too much.
   - **Why:** Corte de caballero and Corte de niño come with no price (`price_co` null, and Edad has no prices). Tinte "Medio",
     Retoque "Con producto", Balayage/Mechas "Extralargo", Tratamiento "Nutrición" and Peinado "Ondas sueltas" are also
     unpriced, which is why the next line says "los que faltan".
   - **Fix:** voice "Los servicios ya vienen escritos, casi todos con el precio más común en Colombia."; subtitle
     (`V1.html:457` item 2) "Casi todos ya traen su precio en Colombia".
5. nice, es CO, beat 6. "Ve a la caja: ya puedes cobrar." plays over a till whose top bar says "Caja cerrada · Abrir"
   (RegisterClosedBar, correct for a new business). Fix: voice "Ve a la caja: toca un servicio para cobrarlo."
   (`till_tap_pointer`, on screen). Subtitle `V1.html:457` item 6 becomes "Ir a la caja: toca un servicio para cobrarlo".
6. nice, all. On the done page the potato is 180 dp; the app draws 210 (`ServicesDoneScreen.kt:79`). Fix: change `V1.html:379`
   `POT("celebrating", 180)` to `210`.

## V2 Ajusta tus precios y opciones: es OK, pt OK, MX OK

**Verified against the code:**
- **Till and Mis servicios:** "Editar" opens the amber "Editando · Mis servicios › · Listo" bar (`HomeScreen.kt:2018-2100`)
  and its "+ Agregar" tile. Mis servicios is paper (`ServicesMenuScreen.kt`). The trade card reads "11 servicios · 4
  productos · Cambiar". In the rows, choices = lowest priced choice "Desde" (`ServicesMenuRule.kt:40-64`). The support strip
  is there, because items_workspace is LEVEL_2.
- **Editar servicio** (`ServiceEditScreen.kt`):
  - It has Name, "¿Cómo cobras?", then the three FilterChips.
  - **CO:** `pricePills` around the current 25.000 gives 20/25/30.000 + "Otro".
  - **Elsewhere:** one box seeded with the stored price ("140.00" MX, item 40). Then "Duración (minutos)" 200 dp and
    WhatComesSection. `serviceOptionStates` gives touched=true, so the rows read "incluido" / "se pregunta en la caja", not
    "sin configurar". The tax box is absent (no tax), then "Listo" and the red "Eliminar servicio".
- **Option editor** (`BridgeOptionEditor.kt`): field order, chips, CO-only `upchargePills(5000)` = 3/5/8.000, both notes,
  "Quitar esta opción", "Listo".
- **Data:** the service is Corte de caballero, one price in every country with an add-on asked at the till.
- **MX script:** V2-MX differs only in beat 3 ("Escribe el precio nuevo"), and that is correct: there are no pills outside CO.

1. nice, all, beat 4. "Desde" is tapped 0.8 s into "Si puede costar más, elige Desde" (3.0 s), before "elige Desde" is
   said. Fix: add `wait:1.2` to the `mode-1` step (`V2.html:387`).
2. nice, pt, beat 6. "E dê um preço ao que se cobra à parte." The app's word is "Cobrado à parte" (`bridge_sheet_charged`).
   Fix: "E dê um preço ao que é cobrado à parte.".

## VS1 Empieza tu negocio de servicios desde cero: es OK, pt OK

**Verified against the code:**
- **Type page** (`BusinessTypePickerScreen.kt`): grid `chunked(2)`. Edificios appears only in CO (`paginasVisibles`), so MX/BR
  get 3 tiles with Servicios full width. The picked tile wears the purple fill, border and check.
- **Pitch** (`lineasDePitch(CITAS)`): "41 oficios con sus servicios **y precios**" in CO only. `lineaDePago` uses
  `bandaDeCaja`: card where `CardCountryGate` != NONE (CO, MX), Pix in BR, "Gratis, para siempre." outside US/CA, no fee.
- **Steps:** 4 segments. There is no barcode step for services. "Configurando…" shows currency name, "41 oficios listos" and
  register. The Ready card reads "Servicios · Colombia · COP" with step 2 "2 min" and the CTA "Escoger mis servicios"
  (`BusinessReadyScreen.kt`).
- **Landing:** the trade picker inside Home with the "Este negocio no tiene respaldo · Conectar" bar
  (`BackupStatePolicy.warningFor`: owner + no Drive account = NOT_CONFIGURED). The 9:05 clock matches RS1, which is fine.

1. nice, all, beat 2. The "Lo que trae Servicios" card is on screen only about 1 s: the tile is tapped at 0.8 s and
   "Continuar con Servicios" at 1.8 s. That card is the only country-specific part (prices CO only, Pix BR). Fix: add
   `wait:1.5` to the `type-go` step (`VS1.html:372`).
2. nice, all, beat 4. The Google page is up about 1 s, and "Configurando tu negocio…" plays under "Entra con tu cuenta de
   Google". Fix: add `wait:1.0` to the `google` step (`VS1.html:375`).

## VS17 Impuestos (servicios): es 2 MUST, pt 2 MUST (MX same)

**Verified against the code:**
- **Panel** (services): the rows are register card, "Vender en línea", "Día a día", Clientes (no fiado line), Facturas, Equipo,
  Reportes, then Configuración. There is no Items or Inventory row. The name is in SumaBlue (`HomeScreen.kt:1490-1840`).
- **Hub** (`SettingsHubRules`): "Dónde atiendes" appears for services. There is no MX-only row.
- **Taxes** (`TaxesManagementScreen.kt`): empty line, "+ Nuevo".
  - **Presets:** `TaxPresets.forCountry(isRestaurant=false)` gives CO "IVA 19%" (no Impoconsumo chip and no rival note),
    MX "IVA 16%", and BR none (typed "ISS 5").
  - **Radios:** default "Sí, ya está incluido" (`TaxPriceDefault`, included except US/CA).
  - **Saved:** snackbar `tax_saved_on`; the card reads "IVA ACTIVO · 19% · incluido en los precios" with switch, pencil and
    trash.
- **Service:** a long press opens Editar servicio (`HomeScreen.kt:975-978`). The checkbox `items_field_taxable` is shown
  because a tax is on (`ShopSwitches.showTaxCheckbox`) and is ticked (`Product.isTaxable = true`).
- **Mexico:** every word and line is the same, so the builder's "no -MX" is right.

1. **MUST, es CO / pt BR / MX, beat 4 (voice vs screen).**
   - **What happens:** "Guardar" is tapped 0.8 s into "¿Ya está en tus precios? Toca Guardar." (3.3 s), so the question and
     its radios are gone and the line plays over the saved list (frame b4m).
   - **Fix:** on `VS17.html:391` (the save step), add `wait:2.0` **and** delete `E.after(2600, () => { st.snack = false; })`.
     The `list-back` step at :392 already clears `snack`, and the pending timer would otherwise hold the next beat until the
     snackbar is gone.
2. **MUST, es CO / pt BR / MX, beat 5 (voice says what the screen does not show).**
   - **What happens:** "Listo: Platata lo calcula en cada venta." plays over three quick hops: list, then Configuración at
     0.8 s, Mi negocio at 1.8 s, Caja at 2.8 s (frame b5m = the panel). The snackbar already left at the end of beat 4.
   - **Fix:** with fix 1, add `wait:2.2` to the `list-back` step (`VS17.html:392`). The line then plays over the "IVA ACTIVO ·
     19% · incluido en los precios" card and the snackbar "Impuesto activo. Se aplica a los artículos marcados con impuesto."
     (about 4 s on screen, like the app's Short snackbar).
   - **Optional:** match the snackbar word with es "Listo: el impuesto queda activo." / pt "Pronto: o imposto fica ativo.".
3. nice, all, beat 2. "+ Nuevo" is tapped 0.8 s into "Aún no hay impuestos. Toca Nuevo.", so the empty line ("Sin impuestos
   aún…") leaves as it is named. Fix: add `wait:1.0` to the `new` step (`VS17.html:389`).
4. nice, all, beat 7. The voice says "Quítale la marca" / "Tire a marca", but the box stays ticked. Fix: add a beat-7 step on
   `[data-t="taxrow"]` with `wait:2.0` that unticks it (an empty box; the row is a toggle, `ServiceEditScreen.kt:372-380`).
5. nice, BR (typed name and %). No keyboard is drawn while "ISS" and "5" are typed (V1/V2 draw one). Fix: show the page's
   keyboard while `st.focus` is set in `form()`.

---

## App bugs I noticed that the builder did not list (73c65f08)

1. **small: `PickServicesScreen.kt:244`.** `onClick = { ticked = ticked + starterKeys }` joins two Lists, so duplicates are
   kept.
   - **Effect:** tapping "Marcar los 12 populares" twice (or after ticking one popular service) makes the button read "Usar
     estos 24 servicios" (:330 counts `ticked.size`). Unticking a doubled card then leaves it ticked, because :308
     `ticked - walkKey` removes only one copy.
   - **Fix:** `ticked = (ticked + starterKeys).distinct()`.
2. **small (money): `ServicesPriceListScreen.kt:286`.** A choice row whose choices have no price draws no pill at all (only
   `if (range != null)`).
   - **Effect:** outside Colombia, 10 of the 11 hair-salon rows look finished. "Terminar" then leaves every choice "Sin
     precio" at the till, while the done page says "Ya puedes cobrar".
   - **Fix:** when `range == null`, draw a muted pill with `items_price_unset` ("Sin precio").
