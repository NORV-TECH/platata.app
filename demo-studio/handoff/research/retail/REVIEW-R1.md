# REVIEW-R1: retail demos T1 T2 T3 T6 T7 T9 T10 T11 T12 (+ T12-MX-es)

Reviewer: independent pass, 21 Oct 2026. App checked at /home/claude/app-head 6736ddfb (unchanged since the build).
Method: worked out each video's timeline from its own audio clips (the page's `__timeline`, same as the recorder). For every
es video I pulled a frame at the start, middle and end of every voice line, plus one in each gap over 1.2 s. For pt, en and
T12-MX-es I pulled one frame per line (70-85 % into it), with extra frames where something looked wrong. Strings checked
against values / values-es / values-pt-rBR; claims spot-checked in code and in the catalog .db files. I edited no file.

All 28 videos open and decode with no error (ffprobe + full ffmpeg decode): 1080x1920, video + audio, 21 to 40 s.
Every page also plays to the end with no console error in video mode with `?type=pharmacy` for CO:es, US:en, BR:pt, MX:es,
and beats == json steps for all nine (8, 5, 7, 8, 8, 7, 6, 7, 8).

## Summary
| Feature | es (CO) | pt (BR) | en (US) |
|---|---|---|---|
| T1 Escanear | OK (1 nice) | OK | OK |
| T2 3.500 sin código | OK (1 nice) | 1 MUST | 1 nice |
| T3 Crear producto | OK | OK (1 nice) | OK |
| T6 Inventario | OK | OK | OK |
| T7 Facturas | 1 MUST | 2 MUST | 1 MUST |
| T9 Abonos | OK (1 nice) | OK (1 nice) | OK (1 nice) |
| T10 Recordatorio | OK | OK | OK |
| T11 Unidades | OK | OK (known #23) | OK |
| T12 Farmacia (+ MX-es) | 1 MUST, 1 nice | 1 MUST, 1 nice | 1 MUST, 1 nice |

Claims verified in the code:
- Owner phone: a known code with a price goes straight in, the same code again = "Otra más · × 2" (ScannerScreen.kt); an unknown
  code opens "¿Qué es este artículo?" (T3). Counter tablet: known products only, unknown = red "No está en tu catálogo", nothing
  created (TabletScanActions.kt).
- The 3,523 number is the NO-barcode list: `catalog_es.db` / `catalog_pt-br.db` / `catalog_en.db` each hold 3,523 rows. The page
  never calls them barcoded products.
- Search starts at the 2nd letter, his own items first, "Vender «…»" hidden when an exact match exists (BarlessShelfScreen.kt:131-153,
  231-232); that is why the en video has no "Sell «tomato»" row. Correct.
- Units: es outside US/CA = Por unidad, Kilogramo, Gramo, Libra, Litro, Mililitro, Docena; US = Per Item, Pound, Ounce, Kilogram, Gram,
  Liter, Fluid Ounce (sync/UnitPicker). All strings match.
- Invoices: no stock write anywhere in SupplierStore; the voice's "no suma al inventario" is true.
- Fiado: oldest tabs crossed off first; the reminder text is `fiado_remind_message` + `whatsapp_signature` word for word in all
  three languages; Remind only opens WhatsApp, the owner sends.
- Pharmacy: "Droguería" only in CO (`biz_setup_type_pharmacy_co`), "Farmacia/Farmácia/Pharmacy" elsewhere; a retail-like draft always
  goes through the barcode-list download (WorkspaceActions.kt:272), so "baja la lista de códigos" is true in every country.
- The "Este negocio no tiene respaldo" bar right after setup is real: it shows while Drive is not connected (HomeScreen.kt:400-405),
  and the Google step only offers Drive "cuando quieras".

---

## T1 (Escanear el código de barras): OK
- es, pt, en OK. Money, product names and barcodes follow the country; US pay screen shows "+ Card · Set up", BR shows "Configurar Pix"
  and the "," key, both correct for the code.
1. nice, all 3. Line 7 ("Un código que no está en tu catálogo no entra a la venta", es 26.5-29.6) plays over the tablet, but on its own it
   reads as a general rule, and T3 shows the owner phone doing the opposite (it creates the product). Fix `features/T1.json` step
   `7-unknown`: es "En la tablet, un código que no está en tu catálogo no entra a la venta." pt "No tablet, um código que não está no
   seu catálogo não entra na venda." en "On the tablet, a barcode that isn't in your catalog doesn't go into the sale." Re-voice + re-render.

## T2 (3.500 productos ya incluidos): es OK, pt 1 MUST, en 1 nice
1. **MUST, pt.** 9-16 s: searching "toma" shows **"tomate riñón"** and **"tomate chonto"** (Spanish / Colombian words, ñ included) in a
   Brazilian video. They really are in `catalog_pt-br.db`, but on screen it reads as Spanish leaking into the Portuguese app.
   Fix `demos/tienda/T2.html`:
   - line 652: `pt: ["toma", "queij"]` -> `pt: ["pao", "queij"]` (his own "pão francês" comes first with his price, line 3 still true).
   - line 332: regenerate `CAT.pt.pao` from `catalog_pt-br.db` with the same search the page used for the other words (results include
     pão francês (his), pão fatiado, pão de arroz, pão de mandioca, pão de coco, pão de milho — all Portuguese) and drop `CAT.pt.toma`.
   - re-render T2-pt.
   App data, for the coder (not a demo fix): `catalog_pt-br.db` holds Spanish names (tomate riñón, tomate chonto, "tomates secado al
   sols", cebolla cabezona, chips de banano, dulce de batata, batata pastusa…). A Brazilian owner sees them in the real app.
2. nice, es (and pt/en). Line 1 says "…Toca Sin código" at its END (~6.5 s) but the tap lands 0.8 s into the line, so the page has
   changed before the viewer is told to tap. Fix `features/T2.json` step `1-open`: put the instruction first, e.g. es "Toca Sin código:
   Platata trae más de tres mil quinientos productos sin código de barras, como pan, frutas, verduras y queso." (same order in pt/en).
3. nice, en. "each with its own drawing" (line 2) plays while the first row, his own "Tomatoes" (and "Cheddar cheese" on the grid), has
   the plate placeholder, not a drawing; the list also shows "chonto tomato", "milano tomato" (Colombian varieties) and the grid has
   "banana $1.39 / Kilogram" in a US shop. Real behaviour, but odd for a US ad. Fix: en search word "bana" instead of "tomato"
   (T2.html line 652; regenerate `CAT.en`), and in kit/shop-data.js (owner's call, not this page's file) price the US banana per Pound.

## T3 (Crear un producto en segundos): OK
- es, pt, en OK. Form strings, category list (A-Z, real seeds), "Otra más · × 2" on the re-scan all match.
1. nice, pt. The open category list shows "Bebidas alcoólicas" (row 3). Real seed, harmless, but if alcohol must be kept out of
   marketing, open the list scrolled one row less or pick the category by typing. Optional.

## T6 (Inventario): OK
- es, pt, en OK. Pills, "queda poco", "Sin contar", Compré/Conté sheet, "+12", "¿Cuándo queda poco?" all match the app strings; the panel
  row and the Items screen agree (2 low, 3 uncounted). Stock only on the owner phone.

## T7 (Proveedores y facturas): es 1 MUST, pt 2 MUST, en 1 MUST
1. **MUST, all 3.** Line 4 ("Con internet, Platata lee el proveedor, la fecha y el total. Toca Listo.", es 9.1-14.3, pt 9.7-14.9,
   en 10.0-15.6) plays over the **invoice list**, not the filled invoice it describes: the "Listo" tap is in beat 3, so it fires 0.8 s into
   the line. The read fields are on screen for less than a second of it.
   Fix `demos/tienda/T7.html` line 670: `{beat:3, … target:'[data-t="done"]' …}` -> `beat:4`. Line 4 then explains the filled screen
   (no tap, allowed) and line 5 taps Listo, then Por proveedor.
   Fix `features/T7.json` (and the subtitles in T7.html lines 658-660):
   - `4-read`: es "Con internet, Platata lee el proveedor, la fecha y el total." pt "Com internet, o Platata lê o fornecedor, a data e o
     total." en "With internet, Platata reads the supplier, the date and the total."
   - `5-month`: es "Toca Listo: la factura queda en su mes. Luego toca Por proveedor." pt "Toque em Concluído: a nota fica no mês dela.
     Depois toque em Por fornecedor." en "Tap Done: the invoice is filed by month. Then tap By supplier."
   - subtitles beat 4/5: es "Toca Listo: queda en su mes. Luego Por proveedor" pt "Toque em Concluído: fica no mês" en "Tap Done: filed by
     month". Re-voice lines 4-5, re-render es/pt/en.
2. **MUST, pt.** The voice says "Toque em **Pronto**" but the button on screen is **"Concluído"** (`common_done` pt-rBR). Fixed by the
   new `5-month` pt line above (if item 1 is not done, change `4-read` pt to "… Toque em Concluído.").

## T9 (Abonos al fiado): OK, 1 nice
- es, pt, en OK. The oldest two tabs struck through in green, the third amber "faltan", "Recibir $X", "Recibiste / Te sigue debiendo" all
  match; COP uses the "000" key, BRL/USD the decimal key.
1. nice, all 3. After the amount is typed the page "scrolls" (T9.html line 808, `.mat .sd.up .in{margin-top:…*-56}`) and a lone "." (the
   thousands dot of the hidden "$ 15.000") pokes out under the top bar (es 9-13 s, pt/en same). Fix: scroll by -64 instead of -56, or hide
   the TE DEBE block when `.up`. Re-render.
- Known, not a demo fault: BR WhatsApp reads "+55 119 123 456 78" (formatWhatsappForReading, already in T8 notes).

## T10 (Recordatorio de fiado por WhatsApp): OK
- es, pt, en OK. Message text and signature are the app's, in the shop's language; the US shop greets "Hi Ana Garcia".

## T11 (Unidades de medida): OK
- es, pt, en OK. Short lists per country, "Más unidades…" groups, "+ Nueva unidad" card (not a pop-up), "Se vende por peso o medida" off,
  the stock chip follows the unit.
- Known, documented (#23): the BR list shows "Libra (lb)". Leave until the fix lands.

## T12 (Palabras de farmacia) + T12-MX-es: 1 MUST, 1 nice (all four videos)
1. **MUST, all 4.** Line 6 ("Lista: tu negocio dice Droguería. Toca Escanear mi primer producto.", es 23.4-28.9, pt 24.3-29.3,
   en 24.0-29.8, MX 23.8-29.3) plays over the **empty register**, not the Ready card that says "Droguería · Colombia · COP": the
   "Escanear mi primer producto" tap is in beat 5, so it fires 0.8 s into the line. The one screen that proves the point is gone.
   Fix `demos/tienda/T12.html` line 651: `steps.push({beat:5, … target:'[data-t="ready-go"]' …})` -> `beat:6`. Line 6 then stays on the
   Ready card, and line 7 ("Todo lo demás funciona igual…") taps into the register, which also gives line 7 a movement. No voice change.
   Re-render T12-es, -pt, -en and T12-MX-es.
2. nice, all 4. 6 s with no voice after line 5 (es 17.2-23.4, pt 18.0-24.3, en 17.5-24.0): download bar + "Configurando tu negocio…".
   Either shorten the fake download + setup in T12.html (lines 649-650: `320*(i+1)` -> `180*(i+1)`, and the 3300/4300/5300/6200/6900
   timers to about 1900/2500/3100/3600/4100), or add a short line, e.g. es
   "Se baja una sola vez." pt "Baixa uma vez só." en "It downloads just once." (true: `dict_dl_consent_body`).
- Also noted (true, not a fix): the register right after setup carries the amber "Este negocio no tiene respaldo · Conectar" bar.

---

## App problems seen while reviewing (for the coder, not demo fixes)
- small — `catalog_pt-br.db` (no-barcode list) carries Spanish names: "tomate riñón", "tomate chonto", "tomates secado al sols",
  "cebolla cabezona", "chips de banano", "dulce de batata", "batata pastusa". Fix: translate those rows (or drop Colombia-only varieties
  from pt-br).
- small — `catalog_en.db` carries Colombian varieties as US items ("chonto tomato", "milano tomato", "pastusa potato", "sabanera
  potato"). Fix: drop or rename for en.
- small — a shop's own no-barcode item named in the plural ("Tomatoes") gets no drawing because the icon backfill matches the
  catalog name exactly (BarlessShelfScreen.kt:115 `backfillBarlessIconSlugs`). Fix: also try the singular.
