# VS8 — Devolver una venta (services, owner phone)

## 1. Built
- Owner phone ("Tu teléfono"), Peluquería Carolina (`?biz=` works for the other three). Bottom tab **"Agenda"** (services name,
  NavLabels.kt:24) opens on the Agenda half (today's kit bookings, day headers) → top tab "Ventas" → the list scrolls to
  yesterday → the sale (kit: yesterday's last cash walk-in with a client; CO = Venta #457 Sofía Vargas, Retoque de raíz
  (Sin producto…), $ 40.000, by the owner) → Devolver → Seleccionar todos → Devolver $ 40.000 → Sí, devolver → PIN → back on the
  sale with "Devuelto $ 40.000", badge Devuelta, receipt "Devuelto / Neto tras devolución" → back: the row reads Devuelta and
  "-$ 40.000" → flag (biometric) → panel → Caja abierta → the drawer card shows **"Devoluciones de ventas anteriores -$ 40.000"**
  and "Debe haber en la caja" $ 287.000 (100.000 + 227.000 cash today − 40.000; CashShift.kt:118-129 DRAWER_OLD_REFUNDS_SUB).
  10 taps, 9 beats.
- Model (same for VS8/VS11/VS12/VS13, written in the page header): one register = the owner's phone; a kit sale done by a staff
  member came from a booking ("¿Quién lo hace?") so it carries performerName and its 15-min slot (its row and title read the
  appointment, its receipt "Atendió: X"); the owner's own sales are walk-ins ("Venta #N"). Sale numbers = the sales in time order.
  If the yesterday sale picked is a booked one (BR), the sale title is the appointment ("qua 21/10 · 17:15") and the receipt
  says "Atendido por: André Lima" — that is the app. With clients on fewer sales (see 5), BR now refunds that booked sale
  (R$ 32,00, "qua 21/10 · 17:15", no client); CO is unchanged (Venta #457 Sofía Vargas $ 40.000, drawer $ 287.000).
- Stock question: verified — the "¿Vuelven al inventario?" sheet shows only when a refunded line counts stock
  (TransactionsScreen.kt:1450-1466 restockCandidates); a service never does, so it does not appear here.
- Countries: identical flow everywhere (cash refund, LOCAL_ONLY route). No VS8-MX.json (Mexico's words are CO's).
- Checked at 73c65f08.

## 2. Left out
- Partial refund by "Monto" (the field shows a raw "25000", see 3). Search by name: not typed, the list scrolls instead.
- Card refunds (CO Wompi dashboard / Stripe): the demo refunds a cash sale.

## 3. New UX/UI problems (73c65f08)
- small: every in-shop services receipt prints a line "En el local" under the subtotal (ReceiptFormatter.kt:90-102 whereModeLine
  returns the LOCAL label; resolvedWhereModeName stores "En el local" on every sale when it is the only mode, CartActions.kt:726-737).
  Fix: skip LOCAL (print only a home visit / pickup).
- small: one Ventas list, two time formats: a booked sale reads "mié 21 de oct · 5:00 p. m.", a walk-in "21 oct 2026, 17:08"
  (ServicesTransactionsScreen.kt:494-500). Fix: dayLabelText + fmtTimeCO for both.
- small: a PAID sale that came from a booking is titled by its appointment, not "Venta #N" (TransactionsScreen.kt:106-114,
  :1045) — the client page / receipt say "Venta #359", the screen they open does not. Fix: appointment title only for an unpaid
  or cancelled booking; a paid one keeps "Venta #N" with the appointment as subtitle.
- small (not in the 52, REVIEW-2 A31): the refund "Monto" field shows "25000" without grouping (TransactionsScreen.kt:1991-2003,
  no MoneyVisualTransformation).

## 4. The 52 items checked here
- 23 (tab name, day headers): fixed — bottom tab "Agenda", agenda grouped by day.
- 26 (search by phone): fixed — phoneSearchText reads whatsappNumber (ServicesTransactionsScreen.kt:578-585).
- 35 (row shows payment time): fixed — booked sales show the appointment.
- 36 (no-show apart; cancelled greyed): fixed (appointmentOutcome NO_SHOW tag; cancelled amount grey).
- 13 / 14 (option in the stored name; no "()"): fixed (SaleLineName.kt).
- 45 (footer): fixed — "¡Gracias por tu visita!" / "Obrigado pela preferência!"; included items print "(incluido)".
- 51: back ARROW with label fixed; **phone numbers still raw** on the Agenda rows: "+573001234567"
  (ServicesTransactionsScreen.kt:271-273 builds "+$whatsappNumber"). Fix: formatWhatsappForReading.

## 5. After the review (REVIEW-REPORTS.md)
- VS8 had no MUST. Nice items done:
  - Beat 0: the "Ventas" tap waits 3.0 s and the list jumps to yesterday 1.5 s later, so "toca Ventas" is said on the tap.
  - Beat 3: "Seleccionar todos" waits 1.0 s.
  - Beat 7: the voice says "toca Caja abierta" / "toque em Caixa aberto" (the card's own words), not "abre la caja";
    subtitles too.
  - The list's repeated client names: the common data now keeps a client on about 1 sale in 9, never twice in a day.
- Note: VS8 line 1 says "la plata" (Colombian). If an MX VS8 video is ever made, say "el dinero" in a VS8-MX.json.
- Re-checked: check_demo CO:es BR:pt MX:es OK.

## Round 3 (37db6d6c)
- Page changed: the panel's search bar is the first item of the list (PanelSearchBar.kt:34-60, HomeScreen.kt:1516; not tapped);
  Agenda rows: hour only (item 24) and the phone read by formatWhatsappForReading (item 12); Ventas rows: a walk-in now reads the
  same "mié 21 de oct · 12:01 p. m." shape as a booked sale (item 33, ServicesTransactionsScreen.kt:496-502); the sale screen of a
  PAID booked sale keeps "Venta #N" with the appointment as subtitle (item 34, TransactionsScreen.kt:106-115, :1057-1059) — BR's
  refunded sale is now "Venda #428 / qua 21/10 · 17:15"; the receipt has no "En el local" line (item 15). Shared Reports code:
  "Servicios y productos con más ingresos" and the plural "1 vendido" (items 37, 38).
- Script: unchanged. check_demo CO/BR/MX OK. Timing VS8 es:CO, pt:BR: every line over its screen. cut_price_scan VS8: OK (es, pt).
- Assumption kept: the Equipo row says "0 en celular" and no "Conecta tu primera caja" card is drawn: the owner snoozed it
  (ConnectNudgeActions, 7 days). Not a change since 73c65f08.
- New app bugs: the Agenda "En el local" line (see VS7).
- Round-2 items seen: 12, 15, 24, 33, 34 fixed; 35 fixed in code (the Monto box is not shown in this video).
