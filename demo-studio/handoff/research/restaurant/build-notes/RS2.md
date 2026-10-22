# RS2 "Abrir la caja" — build notes

## 1. Built
- Owner phone, Home on Catálogo with the amber "Caja cerrada · Abrir" bar; Abrir opens "Abrir caja", the starting cash is typed with the money keypad (whole units, "000" key in COP/CLP, the decimal mark elsewhere), "Abrir caja" goes back to Home with the bar gone, and a dish tap starts a sale ("Venta actual · 1 artículo ›", "Cobrar $X").
- Device: owner phone. Differs by country only in money (starting cash 50.000 CO/CL/AR-type amounts, 1.000 MX, 200 PE/BR, 100 USD/CAD) and the keypad's bottom-left key.
- Checked at app-head 6736ddfb (no change on these screens since abb8fddb).

## 2. Left out / assumptions
- The shop already connected its Drive backup: with no backup the backup warning bar wins the one top slot and the "Caja cerrada" bar is not drawn (`sync/TopStrips.decide`).
- After opening, a shop with zero connected devices would get the "connect your second register" nudge strip under the tabs (`ConnectNudgeRule`); the demo assumes it was snoozed ("Más tarde").

## 3. New UX/UI problems
- None new.
