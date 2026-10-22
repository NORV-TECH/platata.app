# REVIEW-REPORTS: services demos VS8 (refund), VS11 (reports), VS12 (accountant), VS13 (customers)

Reviewer: independent pass, 22 Oct 2026. App read at `/home/user/suma-plus-android` sim/usa-canada **73c65f0**, clean tree.
I edited no file except this one. Running the checker rewrote the screenshots in `demo-studio/_check/`. My scratch files are in
`/tmp/claude-0/-home-user-platata-app/96476401-bbfa-5681-be22-524ea1c374e3/scratchpad/review-reports/`.

How I checked:
- **Strings.** I pulled `STR`/`PLU` out of each page and compared every key in en/es/pt with `values`, `values-es` and
  `values-pt-rBR`. Result: **0 differences** (VS8 120 keys, VS11 89, VS12 106, VS13 102). The words are the app's own. What
  remained was where they sit, the numbers, the layout and the timing.
- **Checker.** `check_demo.py servicios/VSn CO:es BR:pt MX:es`: **all 12 runs OK.** I also ran all 4 pages × the 4 businesses
  (`?biz=`) × CO/BR in video mode: no errors, and every tap was done.
- **Numbers.** In each page I evaluated `SALES` and summed it independently, without the page's helpers. The kit's sales carry
  no tax, discount, tip or charge, so net = total. I compared those sums with what the page's ports of
  `SalesBreakdown.moneyOf/fromRows`, `NetSplits`, the `PosDao` payment query and `ReportRange.previous()` print. I also read
  those app functions line by line against the ports, and they match. The app's figures for the page's data are:
  - **VS11 CO, Hoy:** net/gross/total $359.000. 5 sales vs 5 → "—". Net vs yesterday up to 12:41 ($315.000) → ▲14%.
    Cash $227.000, QR $132.000. Employees: Carolina $190.000 (2), Andrés $87.000 (1), Carla $82.000 (2), credited to
    performer, else cashier.
  - **VS11 CO, Esta semana (19 Oct → now):** $4.167.000 vs $3.287.000 → ▲27%. 33 vs 35 sales → ▼6%. Average $126.273 vs
    $93.914 → ▲34%. 1 no-show (by appointment day). All right.
  - **VS12 CO, Septiembre:** net $39.614.600, 212 sales, average $186.861. Cash $21.712.300. Card+electronic
    $17.902.300 = card 8.635.500 + QR 5.381.500 + transfer 3.885.300 (the complement, `ShareAccountantScreen.kt:133`).
    No August sales, so no "vs" line. All right.
  - **VS12 BR:** R$ 71.070,00 / 227 sales / cash R$ 33.530,00 / card+electronic R$ 37.540,00. No card note (BR has no
    gateway). All right.
  - **VS8 CO drawer:** 100.000 + 227.000 − 40.000 = $287.000 (`CashShift.kt:77-78`, `DRAWER_OLD_REFUNDS_SUB` :118-129).
    All right.
- **Extra history and the no-show.** The common block is byte-identical in the four pages (only `PAGE_BIZ` differs).
  `earlySales()` fills only 1–9 Sep, before the kit's first day (10 Sep), with the kit's own generator. So Sale #N and every
  total agree between pages. The no-show exists only in VS11 (`NO_SHOW_DAYS`, Tue 20 Oct). It is counted by appointment day,
  as `PosDao.kt:1038` does.
- **Timeline.** I ran every video with `dur` taken from the script lengths (14 chars/s + 0.6 s). I logged the time of each
  tap and took frames at the start, middle and end of each beat, CO es and BR pt. Beats == json steps everywhere: 9/9, 8/8,
  7/7, 7/7 (MX too). Scripts are es 334–394 chars and pt 327–432, all ≤ 550. Subtitles are all ≤ 60. tú / você are right,
  there are no greetings, and the last lines are right.
- **"Mexico uses Colombia's words".** Confirmed for the screens: same `values-es` keys. MX differs only in money, in the
  Net-sales note in VS11 ("Antes de impuestos, propinas y cargos", `NetSalesWords.kt:20`, a Stripe country) and in "Tarjeta"
  rows. No `-MX` script is needed for VS8, VS11 or VS13. VS12 MX does differ (the card-fee note, MUST below). After that fix
  it still needs no MX voice. One voice word is Colombian: VS8 line 1 says "la plata". That only matters if an MX VS8 video is
  ever made (then say "el dinero").

## Summary

| Feature | es CO | pt BR | MX es (page only; no `-MX` video) |
|---|---|---|---|
| VS8 Devolver una venta | OK (4 nice) | OK (4 nice) | OK |
| VS11 Reportes | **1 MUST**, 3 nice | **1 MUST**, 4 nice | **1 MUST** |
| VS12 Enviar al contador | **1 MUST**, 4 nice | **1 MUST**, 4 nice | **2 MUST** (fee note: hard rule) |
| VS13 Clientes | **2 MUST**, 1 nice | **2 MUST**, 2 nice | **1 MUST** |

---

## VS12 Mexico card-fee note: what it says, and the verdict

- **What it says.** `accountant_card_fees_none_note` (`values-es/strings.xml:4477`): **"Aún no conocemos las comisiones de
  tarjeta. Las ventas con tarjeta se muestran antes de comisiones."** It is drawn in amber under "Ventas con tarjeta y
  electrónicas" (`EmployeePayActions.kt:351-352, 381`). The same sentence also goes **into the WhatsApp text**
  (`cardFeesLine`, :421; page `VS12.html:602, 624`), so the MX page shows it twice: on the sheet (beats 2–4) and in the chat
  bubble (beat 5).
- **Does it name Platata?** No. It names no payer. In Mexico the app's fee figure is Stripe's processing fee only:
  `CardFeeMath.feeOf` = processing + platform (`CardFees.kt:34-38`), and the MX platform part is 0 (STRIPE-MX-1,
  `CLAUDE.md:1042`).
- **But it is still a fee statement in Mexico.** On a Platata screen, "we don't know the card commissions yet" tells a
  Mexican owner that commissions are coming, without saying whose. Platata's MX fee is undecided, so it reads as a possible
  Platata commission. That breaks the hard rule "no fee in Mexico", so I count it as a **MUST**.
- **"As the app does on first draw" is only half the story.** The note shows only while no fee of the month is known, which
  in practice means the first-ever visit. `fillMissingStripeFees` is called only from this screen (`EmployeePayActions.kt:274-281`).
  The screen then asks the server and redraws with the row **"Comisiones de tarjeta (las cobra el procesador) $X"**
  (`accountant_card_fees`, :346-349), plus "N ventas…" when some fees are still unknown. Every later visit draws that row
  straight away.
- **So there is no honest Mexican screen state with September card sales that avoids a fee mention.** The only fee-free
  state is a month with no Stripe charge. That state is also the true one for the story:
  - Mexico got Stripe cards on 21 Oct 2026 (STRIPE-MX-1).
  - VS4/VS6/VS7 already show MX Stripe as not connected ("+ Tarjeta · Configurar").
  - The kit gives MX "card" sales only because `COUNTRIES.MX.pay.card = "stripe"`.

## VS8 Devolver una venta: OK

Verified against the app:
- **Agenda / Ventas screen.** The bottom tab "Agenda" (`NavLabels.kt:24`) opens on the Agenda half (`ownTab = 1`,
  `ServicesTransactionsScreen.kt:98`). Back arrow, tabs "Ventas | Agenda 9", a search box on both halves (:186, :291).
  Agenda rows are grouped by day, with "Viene/Hoy/2:00 p. m." and the raw "+57…" number (:270-273, :369-450). Sale rows show
  the badge, the method, client / first service · appointment or timestamp, and the red "-$X" (:476-560).
- **Sale screen.** Walk-in "Venta #457", subtitle `formattedTimestamp`, actions WhatsApp/Compartir, Empleado / Cliente.
  The receipt follows `generatePastPlainTextReceipt` line for line (`ReceiptFormatter.kt:343-470`): where line,
  Devuelto / Neto, Atendió, method last. The outlined red Devolver is there, and there is no void link on an earlier day.
- **Refund screen.** `refund_paid_left`, Artículos | Monto, "Seleccionar todos los artículos", the "Entrega $ 40.000 en
  efectivo" line, the red "Devolver $ 40.000" (`TransactionsScreen.kt:1713-1830`). Then the SumaDialog, then the PIN (Security
  is on, :1601-1627). There is no restock sheet for a service. Afterwards the green banner, the badge "Devuelta" and the list
  row "-$ 40.000".
- **Register.** Flag → biometric → panel → register (`RegisterStatusScreen.kt:140-505`): "Devoluciones de ventas anteriores
  -$ 40.000", "Todo el efectivo desde que abrió" (single register), "Total cobrado".

Findings:
1. nice, es + pt, **beat 0**. The tap on "Ventas" lands at 0.8 s and the list jumps to yesterday 0.7 s later. The line ends
   "…En Agenda, toca Ventas" (≈4 s in). So "toca Ventas" is said over a list that was opened and scrolled 3 s earlier.
   Fix: `VS8.html:787` add `wait:3.0` and change `E.after(700,…)` → `E.after(1500,…)`, so the scroll lands at the start of
   "Busca la venta de ayer".
2. nice, es + pt, **beat 3**. "Seleccionar todos" is ticked at 0.8 s; the word comes at ≈1.6 s. Fix: `VS8.html:790` add
   `wait:1.0`.
3. nice, es + pt, **beat 7**. "abre la caja" / "abra o caixa" sounds like opening the register (a shift), but the register is
   already open and the card the owner taps reads "Caja abierta" / "Caixa aberto". Fix in `VS8.json` step `8-caja`:
   - es: "En Mi negocio, toca Caja abierta: la devolución ya está descontada del efectivo."
   - pt: "Em Meu negócio, toque em Caixa aberto: a devolução já foi descontada do dinheiro."
   - subtitles at `VS8.html:779-780`: "En Mi negocio toca Caja abierta: ya está descontada" / "Em Meu negócio toque em Caixa
     aberto: já foi descontada" (≤ 60).
4. nice, BR / CO. Kit data reads fake in the list. BR yesterday shows "Sofia Costa" 3 times (12:30, 14:45, 15:15), and the
   taller variant shows "Ana Gómez" 3 times. The cause is the kit putting a client on 55 % of sales (see VS13 MUST 2; one fix
   covers both).

## VS11 Reportes: es 1 MUST, pt 1 MUST, MX 1 MUST

Verified against the app:
- The table order and lines (`ReportsScreen.kt:234-397`).
- The comparison text "▲ 14%  vs ayer", and "—  vs ayer" at 0 % (:666-700).
- `periodLabel` "Hoy · 22 oct" and "19–22 oct" (:615-636).
- The chart: buckets are Net sales and empty hours are trimmed (`ReportChartData.kt`). The axis `abbreviateAxis` gives
  "145k" (`ReportsSalesChart.kt:287`).
- `ReportBreakdownList` sorts and caps at 8 + "Otros" (top items 10).
- The services titles (item 42). "Citas sin asistir" / "Faltas" appears only for services and only when > 0 (:378-384).
- The panel row "Ventas netas hoy · $ 359.000" (`NetSalesWords.panelTodayRes`).

Findings:
1. **MUST, all languages (also VS12): the selected date chip shows a check mark the app does not draw.**
   - `RangeSelector` uses `FilterChip(selected, onClick, label)` with no `leadingIcon` (`ReportsScreen.kt:589-594`).
     Compose M3 draws no check by itself.
   - The app's own screenshot `app/src/test/screenshots/reports_empty_period_d34_light.png` shows a plain filled "Today"
     chip.
   - The page draws "✓ Hoy" / "✓ Esta semana" / "✓ Mes pasado" in every Reports frame.
   - Fix, in the common block of VS11 and VS12 (and VS8/VS13 for consistency):
     - line 428: delete `${p===st.range?I.check:""}`;
     - line 515: drop `padding-left:calc(var(--u)*8)` from `.rp-chips span.on`;
     - in VS12, re-check `chipX` (`VS12.html:693`; 145 assumed the wider chip).
2. nice, es + pt, **beat 0**. The tap on "Reportes" lands at 0.8 s; "toca Reportes" comes at ≈2.6 s. Fix: `VS11.html:608`
   `wait:1.8`.
3. nice, es + pt, **beat 1**. The bar is tapped at 0.8 s, before "Toca una barra" (≈1.6 s). Fix: `VS11.html:609` `wait:0.9`.
4. nice, all, **beats 3, 4, 6**. The scrolls are done as taps: the video shows a touch ripple on "Número de ventas", on the
   "Servicios con más ingresos" title and on "Ventas netas". None of these can be tapped in the app (`HeadlineMetricRow` has
   no click, :712-748), and then the page scrolls. This looks like tapping Net sales does something. Fix (engine-free): give
   these three steps a target that is not drawn as a tap, or add a `swipe:true` look, or accept.
5. nice, pt BR. Two small issues:
   - The video opens on "Vendas líquidas R$ 610,00 **▼ 48%** vs ontem" in red, right under "Quanto você vendeu hoje?". That
     is honest (kit seed), but a weak first impression. If the kit is touched (VS13 MUST 2), check BR today vs yesterday
     again.
   - A strict reading of QR-2: "Pix R$ 320,00" is on screen at beats 3–4 and no line says the Pix QR carries the total.
     Optional fix for `4-pagos` pt: "Como você recebeu (o Pix já leva o valor da venda) e que serviços rendem mais." It is
     ≈ +35 chars and the script stays ≤ 470.

## VS12 Enviar al contador: es 1 MUST, pt 1 MUST, MX 2 MUST

Verified against the app:
- **Bottom button.** Owner-only, pinned "Resumen para el contador" (`ReportsScreen.kt:136-152`). LAST_MONTH reads
  "Septiembre", with no "vs" against an empty August.
- **Sheet.** SumaTopBar, intro, range "1 de septiembre de 2026 – 30 de septiembre de 2026" (`AccountantDate.long`, LONG).
  Each row is label / amber note under it / value / Copy IconButton (`ShareAccountantScreen.kt:348-383`).
- **Row order** (`EmployeePayActions.kt:362-386`): Ventas netas, Impuestos, Total cobrado, Efectivo, no fiado row
  (`showFiadoRow`), Tarjeta y electrónicas, Proveedores, Facturas, Empleados (September lies fully inside the range).
- **Footer and buttons.** Footer, "Enviar resumen al contador", outlined "Compartir PDF".
- **Message.** Built exactly as `buildAccountantMessage` (:232-272), with "(9 facturas)", the disclaimer and the signature.
  Strip: LEVEL_2.

Findings:
1. **MUST, MX (hard rule "no fee in Mexico"): the card-fee note** "Aún no conocemos las comisiones de tarjeta…" on the sheet
   and in the WhatsApp text (see the section above).
   - Fix in `VS12.html`, right before `const RGM` (:597):
     ```js
     /* STRIPE-MX-1: Mexico takes Stripe cards from 21 Oct 2026; September had no card charge (and VS4/6/7 show MX not
        connected), so this month has no gateway row: no fee note, no fee row (EmployeePayActions.kt:346-352) */
     if(CC === "MX") SALES.forEach(o => { if(o.ts < new Date(2026,9,1) && o.pay === "card") o.pay = "transfer"; });
     ```
   - Then `CARD_CHARGES` is false and the note goes from the rows and from `MSG`. Reports "Mes pasado" reads the same
     `SALES`, so the two screens agree.
   - Do not just hide the note while the sales stay "card". That would not be the app.
2. **MUST, all: the check mark on "Mes pasado"** (VS11 MUST 1, same fix).
3. nice, es + pt, **beat 3**.
   - Copy is tapped at 0.8 s and "Copiado" is gone at 2.6 s. "Cada número se copia con un toque" is said at ≈4–7 s, with no
     toast on screen.
   - Fix: `VS12.html:700` `wait:3.4`. The beat is about 7 s, so the toast then shows during the words.
4. nice, es + pt, **beat 0**.
   - The chip row is already scrolled at the first frame (`chipX:145`, :693). "Hoy", the selected chip, is off-screen, while
     the app opens Reports with the row at its start.
   - The tap also lands at 0.8 s, before "toca Mes pasado" (≈3.4 s).
   - Fix: start at `chipX:0`; in step 0 add `wait:2.8` and do the slide first (e.g. an `E.after` in the beat, or a no-ripple
     pre-step) so the swipe is seen.
5. nice, all, beat 5 (WhatsApp).
   - `shareText` sends `ACTION_SEND` to `com.whatsapp` with no number (`ShareAccountantScreen.kt:430-447`). So WhatsApp first
     shows its own "Enviar a…" contact list, and only then the "Contador" chat. The page goes straight to the chat.
   - Also, "send" is tapped at 0.85 s, before "Envíaselo a tu contador" (≈2.6 s).
   - Fix: a plain WhatsApp contact-list frame with "Contador" tapped (inside beat 5), then the chat. `VS12.html:702`:
     `wait:1.8`.
6. nice, all. The Reports bottom bar in the app is `Surface(background, tonalElevation=2dp)`, a light grey band (see the app
   screenshot above). The page draws it white with a shadow (`.rp-bot`, line 559).

## VS13 Clientes: es 2 MUST, pt 2 MUST, MX 1 MUST

Verified against the app:
- **Clients list.** `ListScreenHeader` with "Clientes (5)", "+ Nuevo" and the search on its own line. The search matches
  custom-field values (`CustomerCrmScreen.kt:98-108, 317-325`, item 18). There is no money header for services. A–Z groups;
  the avatar is `primaryContainer` = #F2F2F7.
- **Client page** (`CustomerPage.kt:156-200`): WhatsApp `formatWhatsappForReading` + "Escribir por WhatsApp", the custom
  field, Visitas = `CustomerPurchases.visible` size, Última visita MEDIUM date. "Compras" rows show "Venta #N" / MEDIUM+SHORT
  / "Vendido por: <employeeName>" / amount (:225-257).
- **The opened sale.** Titled by its appointment, with "Atendió: Daniela Mejía".

Findings:
1. **MUST, es + pt, beat 4 (voice vs screen).**
   - The purchase is opened at 0.8 s. "Y todo lo que te ha comprado" / "E tudo o que ele já comprou" (≈0–2 s) is said over
     the sale screen, where the list is gone.
   - Fix: `VS13.html:691` add `wait:1.4`, so the tap lands on "Toca una compra" / "Toque numa compra" (≈2.1 s).
2. **MUST, all (nonsense on screen in the beat that points at it).**
   - The client page reads **"Visitas 49"** for Ana Gómez, with **three vet visits on 20 Oct** (#356 9:18, #359 13:01,
     #360 14:06) and three on 17 Oct. BR: "Visitas 42" and three on 19 Oct. Taller: "Visitas 37".
   - Beat 3 says "…y cuántas veces ha venido" right over that number.
   - The cause is `kit/services-data.js:310`: `client: R() < 0.55 ? …`, i.e. 5 clients carry 52–62 % of all sales. The
     builder flagged it but left it in the video.
   - Fix that keeps every total in all pages the same (the random stream is untouched): still draw `R()` as now, but store
     the client on about one sale in five. For example, `const cl = R() < 0.55 ? clients[Math.floor(R()*clients.length)].name
     : null;` and `client: (cl && sales.length % 5 === 0) ? cl : null`. That gives about 10 visits in 7 weeks per regular.
   - Then re-check VS8's chosen sale (pickTarget falls back cleanly) and VS13's `OPEN`.
3. nice, es + pt, **beat 0**. "Clientes" is tapped at 0.8 s; "toca Clientes" is the end of a 6.8 s line (≈5.1 s). Fix:
   `VS13.html:688` `wait:4.3`.
4. nice, pt BR. The opened purchase is paid by **Pix** (receipt line "Pix"), and no line says the QR carries the total
   (strict QR-2). Fix: `VS13.html:598` also exclude `o.pay === "qr"` when `C.pay.qr === "pix"`, so BR opens a cash or
   transfer sale.

## Hard rules (all four)

- **Fee in Mexico:** VS12 MX breaks it (MUST above). VS8/VS11/VS13 MX mention no fee. The MX Net-sales note "propinas y
  cargos" is the shop's own charges, not a fee.
- **Other hard rules:** no US/CA script, no French, light theme only. No card logo ("Tarjeta" is text only), no card scan,
  no AI people. WhatsApp appears only as the app's own share target, as in VS7.
- **US VS12:** shows "Total paid to employees $0.00", the accountant row, not the US Employee-pay screen. There is no
  video, so it is acceptable.

## App bugs I noticed that the builder did not list (73c65f08)

1. small. **"Servicios con más ingresos" also lists products.**
   - Where: `ReportsScreen.kt:458-466` picks `reports_top_items_services` for a services shop, but `NetSplits.topItems`
     (`NetSplits.kt:72-80`) ranks every line.
   - Effect: VS11 shows "Shampoo reparador", "Acondicionador reparador" and "Crema para peinar…" under a services title.
   - Fix: a neutral services title ("Lo que más ingresos deja"), or filter out product lines for that card.
2. small. **The Colombian card-fee note says "Aún no" about something that never comes.**
   - Wompi rows never get a fee (BACKOFFICE-2 B11, `EmployeePayActions.kt:349-352`), yet the note
     `accountant_card_fees_none_note` promises "Aún no conocemos…".
   - Fix: for Wompi, say "Wompi no nos dice las comisiones: las ventas con tarjeta se muestran antes de comisiones." (or
     similar).
3. small. **"Vendido por" on the client page shows the raw placeholder.**
   - `CustomerPage.kt:240-242` prints `order.employeeName` as stored, so a sale rung with nobody signed in shows the Spanish
     placeholder in any language.
   - The sale screen already translates it through `saleEmployeeName` (`EmployeeNameLabel.kt:18`).
   - Fix: use `saleEmployeeName(it)` there too.
4. small (UX). **Mexico's card-fee row has no fee-free wording.**
   - In Mexico the accountant row reads "Comisiones de tarjeta (las cobra el procesador)" (`accountant_card_fees`), which
     is correct (Stripe's fee).
   - But with no Platata fee decided, the first-visit note "Aún no conocemos las comisiones de tarjeta" names no payer. It
     should say "del procesador", as the row does, so no Mexican owner reads it as a Platata commission.
