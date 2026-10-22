STATUS: 196/213 done
# Marketer list for the 35 restaurant demos: item by item status (STATUS-1, 20 Oct 2026)

Source list: `claude-loop/qa/CODER-PROMPTS-RESTAURANT-19oct.md` (8 prompts, 213 numbered items). Status taken from the round reports (fix1, kds1, kds2, print1 to print4, waiter1, waiter2; lane D: fix3, menu1, menu2, kitchen3, db1, db2, qafix2; lane E: fix4, back1, back2, wafix1; lane C: pay1, register2, tables1, qafix1) and, where a report was unclear, checked in the code of `origin/sim/usa-canada` (read only).

Where the work lives: every lane (C, D, E) was merged into `origin/sim/usa-canada` by the "Fusion 3" commits (tip 106393c4 when this was read). Room on that branch is 128 (Base 1 added a sort order for dishes and a ready time per dish).

IMPORTANT: nothing in this list has been run on a phone, a real printer, a real kitchen tablet or a real card reader. "DONE" means built and pinned by an automated test. "DONE not seen on a phone" means built, but the test is only a source read, or the item needs a real device, socket, printer, camera or Google/Play to be believed.

Status words: DONE, DONE not seen on a phone, PARTLY, NOT DONE, NOT ACCEPTED (a decision not to do it), ALREADY FINE (it was already true in the code).

## Totals

| Prompt | Items | DONE | DONE not seen on a phone | PARTLY | NOT DONE | NOT ACCEPTED | ALREADY FINE |
|---|---|---|---|---|---|---|---|
| 1 Money, drawer, serious | 12 | 11 | 1 | 0 | 0 | 0 | 0 |
| 2 Menu from a photo, editor, add-ons | 25 | 23 | 2 | 0 | 0 | 0 | 0 |
| 3 Tables, dining, waiter phones, counter tablet | 24 | 19 | 3 | 0 | 2 | 0 | 0 |
| 4 Kitchen screen, settings, printers, order ready | 29 | 17 | 8 | 2 | 1 | 1 | 0 |
| 5 First run, register, cash | 16 | 12 | 2 | 1 | 1 | 0 | 0 |
| 6 QR, card, other payments, receipts, refunds | 26 | 23 | 2 | 1 | 0 | 0 | 0 |
| 7 Reports, accountant, clients, team, pay | 37 | 32 | 3 | 2 | 0 | 0 | 0 |
| 8 Discounts, taxes, combos, store, offline, backup, security, businesses | 44 | 36 | 2 | 2 | 3 | 0 | 1 |
| TOTAL | 213 | 173 | 23 | 8 | 7 | 1 | 1 |

Overall: 196 of 213 are built (173 DONE + 23 DONE not seen on a phone), 8 PARTLY, 7 NOT DONE, 1 NOT ACCEPTED, 1 ALREADY FINE.

## What the marketer can demo now

- The whole sale flow in a restaurant: tables, "Nombre o mesa" in a grid with the table marked, "Agregar a la mesa", Guardar / Enviar a cocina, open tickets named "Mesa 4" or the typed name on the owner phone, the counter tablet and the waiter phone.
- The money fixes: cash drawer switch on the receipt printer page, tip or service charge asked on every till, tip printed on the paper receipt, taxes printed with their own name ("Impoconsumo 8% incluido"), comped dishes at 0 in Reports, one money keypad everywhere, warning when closing the register with open tables, custom payment methods (Nequi) asking before they charge.
- Menu from a photo: honest hint, real error messages in four languages, a Retry that retries, editable names and prices for every size, the shop's currency told to the AI, "N platos agregados". Menu editor: a price box per size, "Desde", camera for dish photos, 48 dp buttons, "plato" wording, Spanish for Latin America, empty states, and arrows to reorder categories and dishes.
- Kitchen screen: only today's orders (or this shift's), order note shown, no double lines on a second round, "Mesa 4 · Adición" cards, undo for a single LISTO, a connection bar and green dot, the station name in the top bar, no empty cards for another station, "Todo listo · Hamburguesa" marks only that dish, kitchen rules reaching the tablet while it is connected, the comanda with note, waiter name and wrapped dish names.
- Printers: Wi-Fi printers and the drawer test (PRINT-1), printers listed first and headphones hidden plus "Search for printers" (PRINT-2), one print lane per printer with retries and a true status line (PRINT-3), paper width 58 or 80 mm and a letter table for accents (PRINT-4).
- Waiter phones: "Conectar" shows "Invitado" with the business code and PIN, the Team page shows the business code, true join texts (business code + PIN, any Google account), the owner phone prints a new waiter ticket once.
- Register: opening needs the "Abrir y cerrar caja" permission, owner name instead of "Owner", the date in the language, cash rounding line, one name for the expected cash, business name on the close summary.
- Payments and refunds: QR cashier note visible and sensible, Wompi expiry readable, Stripe tip Cancel, Pix named in Brazil on the pay screen, refund PIN visible to the owner (masked) and changeable, Wompi refund with "Abrir Wompi" and "Copiar número", refund banner in the shop's currency.
- Back office: Reports "Hoy" runs to midnight, "Resumen para el contador" with Copy buttons and a wrapping PDF, tax edit with country presets, "Cargo" as one word, editable client list with X on the sale, new hire PIN shown once, employee pay fixes, honest backup, offline and security texts, the online store list of hidden dishes, a Change PIN for staff.

## What is still missing

- Cash in and cash out on a counter tablet or waiter phone (Prompt 5 #13).
- "Enviar a cocina" on the counter tablet and waiter phone when only the owner phone knows the kitchen screen (Prompt 3 #22). A round (NET-1) was started for it but left no commit and no report.
- A waiter phone sign that the kitchen finished an order (Prompt 4 #29, only the owner phone has it).
- LISTO on one station still takes the ticket off every station (Prompt 4 #11).
- Counter tablet and waiter phone cannot add a printer (Prompt 4 #21, a decision: printers live on the owner phone).
- "Enviado a cocina: Mesa 4" after sending to the kitchen (Prompt 3 #11): the message still says "Guardado".
- Pix naming is only on the payment method name, the pay-screen QR button and the setup links; the QR terms page and QR setup texts still say QR (Prompt 6 #2). A second Pix round (PIX-2) was started but its report is an API error and no commit exists.
- Combo named on the stored receipt (needs a stored column; Prompt 8 #14), register open or closed per business in the business list (Prompt 8 #43), store link domain and the blue shop name on the customer page (Prompt 8 #20, #23, decisions or `public/`).
- The PIN is still sent as plain text over WhatsApp (Prompt 7 #27); the auto-off notice for employee pay is on the Team page only (Prompt 7 #31); the kitchen ticket window's crossed-off lines are still lost when it closes (Prompt 4 #6).
- A register that stays closed after a new business is created is by decision (Prompt 5 #5).

---

## PROMPT 1 - Money, drawer and the most serious problems (12 items)

| # | Item | Status | Round | Note |
|---|---|---|---|---|
| 1 | Cash drawer switch on printer page | DONE | FIX-1 | Off by default; the owner must turn it on. Real drawer not tried. |
| 2 | Order-ready WhatsApp uses whatsappNumber | DONE | FIX-1 | No number: card stays and says the customer has no WhatsApp. |
| 3 | "Can't take cards" only in US/CA | DONE | FIX-1 | |
| 4 | Tip / service charge on every till | DONE | FIX-1 | Counter tablet and waiter phone now ask. |
| 5 | Included tax printed with its own name | DONE | FIX-1 | A past reprint takes names from the shop's current taxes. |
| 6 | Warn closing with open tables | DONE | FIX-1 | |
| 7 | One money keypad rule | DONE | FIX-3 | Open, Close, Cash in/out now match the pay screen. Customer Settle/Forgive keypads still read cents (not on the list). |
| 8 | Tip on the paper receipt | DONE | FIX-1 | The two live fallback renderers (used only if the stored order cannot be read) still print no tip. |
| 9 | Cooking point one rule | DONE | MENU-2 | Both doors now pick one, optional. "On which dishes?" row added to the ideas page. |
| 10 | Kitchen switches reach kitchen tablet | DONE not seen on a phone | KDS-2 | Wire format and screens tested; no real phone-to-tablet socket. |
| 11 | Conectar shows code and Invitado | DONE | TABLES-1 | Real WhatsApp send unseen. |
| 12 | Comped dishes at 0 in Reports | DONE | FIX-1 | |

## PROMPT 2 - Menu from a photo, menu editor, add-ons (25 items)

| # | Item | Status | Round | Note |
|---|---|---|---|---|
| 1 | False "verificamos 3 veces" hint | DONE | MENU-1 | |
| 2 | AI errors in four languages, no raw text | DONE | MENU-1 | Six reasons. |
| 3 | "Intentar de nuevo" really retries | DONE | MENU-1 | Real nav graph tested; real AI not called. |
| 4 | Review subtitle says "en tu menú" | DONE | MENU-1 | |
| 5 | Review: editable name, price, category | DONE | MENU-1 | |
| 6 | Review: every size shown and fixed | DONE | MENU-1 | |
| 7 | AI told country and currency | DONE | MENU-1 | Prompt text tested; no real AI request. |
| 8 | Camera and dialog small things | DONE not seen on a phone | MENU-1 | Real CameraX screen not seen. |
| 9 | "N agregados" after import from Tu menú | DONE | MENU-1 | |
| 10 | Stock-photo match too loose | DONE | MENU-1 | It was a real bug (Pollo asado got Pollo frito). |
| 11 | Restaurant dish sizes editable | DONE | MENU-2 | One price box per size. |
| 12 | Empty category page, delete confirm | DONE | MENU-2 | |
| 13 | Repeated category name, "Desde" | DONE | MENU-2 | |
| 14 | Dish photo: camera and remove | DONE not seen on a phone | MENU-2 | Camera permission flow not seen. |
| 15 | "Plato" wording, pt cardápio | DONE | MENU-2 | |
| 16 | 48 dp buttons | DONE | MENU-2 | |
| 17 | "N en uso" counts add-ons on a dish | DONE | MENU-2 | |
| 18 | Empty Tu menú offers photo first | DONE | MENU-2 | |
| 19 | Reorder categories and dishes | DONE | DB-1, DB-2 | MENU-2 left it (needs a database change); lane D added Room 128 and arrows. |
| 20 | Ideas page title, back button | DONE | MENU-2 | |
| 21 | Idea cards: no DESACTIVADO, own emoji | DONE | MENU-2 | |
| 22 | Same words in both add-on editors | DONE | MENU-2 | |
| 23 | Un-tick optional pick-one at the till | DONE | MENU-2 | |
| 24 | Spanish wording (Activa, la usan, LatAm) | DONE | MENU-2 | |
| 25 | Add-on picker shows choices and prices | DONE | MENU-2 | In the dish form's picker (the till sheet already showed them). |

## PROMPT 3 - Tables, dining options, waiter phones, counter tablet (24 items)

| # | Item | Status | Round | Note |
|---|---|---|---|---|
| 1 | Built-in dining names translated everywhere | DONE | FIX-4 | Transactions search still matches the English stored name. |
| 2 | Breakdown row no "Domicilio · To Go" | DONE | TABLES-1 | |
| 3 | Upcharge uses the shop money parser | DONE | FIX-4 | CO "3.000" now 3000; AR/BR "1,50" now 1.5. |
| 4 | "¿Cómo sale?" shows upcharge | DONE | TABLES-1 | |
| 5 | "¿Qué mesa?" marks busy tables | DONE | TABLES-1 | |
| 6 | Setting reachable from Configuración | DONE | TABLES-1 | New row names Mesas. Menu > Otros subtitle left unchanged. |
| 7 | Say Mesas and Para aquí exclude each other | DONE not seen on a phone | TABLES-1 | Source-pinned; the page needs a view model to draw. |
| 8 | Portuguese "Opções de atendimento" | DONE | TABLES-1 | |
| 9 | Waiter phone not asked name and table again | DONE not seen on a phone | TABLES-1 | Rule tested; full step flow not seen. |
| 10 | Typed name shows on Abiertas card | DONE | TABLES-1 | Fixed for a ticket with a customer; the no-customer case could not be reproduced. |
| 11 | "Enviado a cocina: Mesa 4" message | NOT DONE | none | The message still says "Guardado"; no round changed it. |
| 12 | "Cobrar", pedido not orden | DONE | TABLES-1 | |
| 13 | "Nombre o mesa" grid and preselected table | DONE | TABLES-1 | |
| 14 | Guardar/Enviar a cocina label goes stale | DONE | TABLES-1 | |
| 15 | Waiter phone can name a ticket, Mesas off | DONE | TABLES-1 | |
| 16 | "Entra con la cuenta que invitó tu jefe" | DONE | TABLES-1 | |
| 17 | "Tu PIN", one word for owner and codes | DONE | TABLES-1 | |
| 18 | Connection note not in US/CA | DONE | TABLES-1 | |
| 19 | "Cajero" badge for everyone | DONE | TABLES-1 | Team list shows title or "Equipo". The counter tablet's sign-in list still says "Cajero". |
| 20 | "Nombra esta tablet" waits for the check | DONE | TABLES-1 | |
| 21 | Tablet hint "Conexiones", false code line | DONE | TABLES-1 | |
| 22 | "Enviar a cocina" on tablet and waiter phone | NOT DONE | TABLES-1 (NET-1 never finished) | Needs a new synced setting and an owner-side writer. NET-1 started but left no commit or report. |
| 23 | Tablet profile page Back, "Caja cerrada" | DONE not seen on a phone | TABLES-1 | Source-pinned, screen not drawn. |
| 24 | Clear "Agregar a la mesa" button | DONE | TABLES-1 | |

## PROMPT 4 - Kitchen screen, kitchen settings, printers, order ready (29 items)

| # | Item | Status | Round | Note |
|---|---|---|---|---|
| 1 | Kitchen shows only today / this shift | DONE | KDS-2 | An unpaid table from before midnight with no register open drops off. |
| 2 | "Todo listo · Hamburguesa" marks only that dish | DONE not seen on a phone | KDS-2 (not done), DB-1, DB-2 | New per-dish ready time (Room 128) and two new network messages; no real tablet over Wi-Fi. |
| 3 | Order note on the kitchen card | DONE | KDS-2 | |
| 4 | Second round not shown twice | DONE | KDS-2 | The screen now beeps again on a re-saved ticket. |
| 5 | Add-on card "Mesa 4 · Adición" | DONE | KDS-2 | |
| 6 | Single LISTO undo; crossed-off lines kept | PARTLY | KDS-2 | Undo bar done. Crossed-off lines in the ticket window are still lost when it closes (confirmed in the code). |
| 7 | Leave dialog for a kitchen screen | DONE | KITCHEN-3 | |
| 8 | Failed pairing says same Wi-Fi | DONE | KITCHEN-3 | |
| 9 | "Conectada" only when really connected | DONE not seen on a phone | KDS-2 | No real socket. |
| 10 | No empty cards on the other station | DONE not seen on a phone | KITCHEN-3 | Not seen on a real tablet. |
| 11 | LISTO per station | NOT DONE | KITCHEN-3, DB-2 | Needs per-station state on the host; a station that finishes still finishes the ticket for all (accepted limit). |
| 12 | Order-type names translated | DONE | FIX-4 | |
| 13 | False "Mantén presionado" hint removed | DONE | KITCHEN-3 | |
| 14 | Edit page matches create page | DONE not seen on a phone | KITCHEN-3 | Proven by reading source only. |
| 15 | Role labels stacked, 48 dp buttons | DONE not seen on a phone | KITCHEN-3 | Proven by reading source only. |
| 16 | Tablet shows its station name | DONE | KITCHEN-3 | |
| 17 | Rule changes reach connected tablets | DONE not seen on a phone | KITCHEN-3 | No new message type; no real tablet. |
| 18 | Paying does not reprint the comanda | DONE | KDS-2 | |
| 19 | Paper receipt follows Receipts settings | DONE | KITCHEN-3 | Not run on a real printer. |
| 20 | Comanda note, waiter, wrapped names | DONE | KDS-2 | |
| 21 | Tablet and waiter phone can add a printer | NOT ACCEPTED | KITCHEN-3 | Planner decision: printers live on the owner phone. |
| 22 | Accents and no-break space on paper | DONE not seen on a phone | PRINT-4 | Letter table (default Windows-1252) and a test page; needs a real printer. |
| 23 | Printer list says Receipts / Kitchen; kitchen test print | DONE | PRINT-1, PRINT-3 | "Prints: receipts / kitchen orders" on the printer page, test page for the kitchen printer. |
| 24 | Bluetooth permission asked for a Wi-Fi printer | DONE | PRINT-1, PRINT-2 | Wi-Fi part works with Bluetooth off; the Bluetooth scan permission is asked only when you tap Search. |
| 25 | Orders from other devices reach tablet with customer | DONE not seen on a phone | KITCHEN-3 | No real socket. |
| 26 | "Pedido listo" switch reaches the tablet | DONE | KITCHEN-3 | |
| 27 | "No hay pedidos listos" | DONE | KDS-2 | |
| 28 | Ready panel readable, "WhatsApp" button | DONE | KITCHEN-3 | |
| 29 | Sign that the kitchen finished an order | PARTLY | KITCHEN-3 | Owner phone shows "Mesa 4 lista". Waiter phone not done (needs a new network message; NET-1 never finished). |

## PROMPT 5 - First run, register, cash (16 items)

| # | Item | Status | Round | Note |
|---|---|---|---|---|
| 1 | Country step text does not promise taxes | DONE | FIX-3 | |
| 2 | US/CA pitch no QR | DONE | FIX-3 | |
| 3 | Sign-in vs backup message agree | DONE not seen on a phone | FIX-3 | Text only ("ligado"); no device test. |
| 4 | Backup bar says "negocio" | DONE | FIX-3 | |
| 5 | "Preparando tu caja" tick; closed register | PARTLY | FIX-3 | Tick done. The register stays closed on purpose (opening it would invent a counted amount). |
| 6 | One top bar at a time | DONE | FIX-3 | Backup warning wins, so "Caja cerrada" shows after it is gone. |
| 7 | Panama "$1,234.50" | DONE | FIX-3 | |
| 8 | Owner name instead of "Owner" | DONE not seen on a phone | FIX-3 | Rule tested; the screens are wired but not drawn in a test. |
| 9 | Employee cannot open the register without permission | DONE | FIX-3 (not done), REGISTER-2 | Uses the "Abrir y cerrar caja" permission. |
| 10 | Cash rounding line on phone pay screen | DONE | FIX-3 | |
| 11 | Register date in the language | DONE | FIX-3 | |
| 12 | Gender: abierta/cerrada, pt caixa | DONE | REGISTER-2 | |
| 13 | Cash in/out on tablet and waiter phone | NOT DONE | REGISTER-2 | Those screens have no Register page; the permission check must move first. |
| 14 | One name for expected cash | DONE | REGISTER-2 | |
| 15 | Business name on close summary | DONE | REGISTER-2 | Real printed roll not seen. |
| 16 | Permission called "Cerrar caja" | DONE | REGISTER-2 | Renamed "Abrir y cerrar caja". |

## PROMPT 6 - QR, card, other payments, receipts, refunds (26 items)

| # | Item | Status | Round | Note |
|---|---|---|---|---|
| 1 | QR cashier note shown | DONE | PAY-1 | |
| 2 | "Pix" in Brazil | PARTLY | FIX-4 | Payment method name, pay-screen QR button, setup links. QR terms page, QR setup texts and the online store page still say QR. PIX-2 left no commit. |
| 3 | One wording for "Total a cobrar" | DONE | PAY-1 | |
| 4 | QR back arrow label | DONE | PAY-1 | |
| 5 | pt "Formas de pagamento" everywhere | DONE | PAY-1 | |
| 6 | Cashier note matches the warning | DONE | PAY-1 | |
| 7 | Stripe Spanish without voseo | DONE | FIX-4 | |
| 8 | Waiter-phone card bar no QR | DONE | PAY-1 | |
| 9 | Wompi installments switch | DONE | FIX-4 | Switch hidden (it did nothing). |
| 10 | Wompi expiry readable | DONE | PAY-1 | Number and CVC stay masked. |
| 11 | Wompi sending pill not hard-coded | DONE | PAY-1 | |
| 12 | Stripe tip screen Cancel | DONE | PAY-1 | |
| 13 | Card reader row reachable | DONE not seen on a phone | PAY-1 | Source-pinned only. |
| 14 | Custom method asks before charging | DONE | PAY-1 | Amounts unchanged. |
| 15 | Add-method example per country | DONE | PAY-1 | |
| 16 | One name "Otro método de pago" | DONE | PAY-1 | |
| 17 | Cortesía receipt prints 0 | DONE | FIX-1 | |
| 18 | US/CA "Enviar" offers text and WhatsApp | DONE not seen on a phone | PAY-1 | No real SMS sent. |
| 19 | WhatsApp does not end the sale | DONE | PAY-1 | |
| 20 | pt "Recibo", cashier-facing question | DONE | PAY-1 | |
| 21 | Refund PIN visible / settable | DONE | FIX-4 | Owner sees it masked, can change it. |
| 22 | Wompi refund: open Wompi, copy id | DONE | PAY-1 | |
| 23 | Refund prices vs prorated amount | DONE | PAY-1 | Explanation line. |
| 24 | English title case | DONE | PAY-1 | |
| 25 | Interac line without store credit | DONE | PAY-1 | |
| 26 | Refund banner in shop currency | DONE | PAY-1 | |

## PROMPT 7 - Reports, accountant, clients, team, employee pay (37 items)

| # | Item | Status | Round | Note |
|---|---|---|---|---|
| 1 | "Hoy" ends at midnight | DONE | FIX-3 | Week, month, year still end at "now". |
| 2 | Dining options translated in Reports | DONE | FIX-4 | |
| 3 | "N ventas", "Faltan N", "Sin nombre" | DONE | BACKOFFICE-1 | |
| 4 | Chart axis decimal mark | DONE | BACKOFFICE-2 | |
| 5 | US/CA tips apart in Reports | DONE | FIX-1 | A "Tips" row; Net sales still includes tips (owner decision pending). |
| 6 | Staff on owner phone "only this register" | DONE | BACKOFFICE-2 | |
| 7 | Plurals "1 meses" | DONE | BACKOFFICE-1 | |
| 8 | One name; "Ventas netas" | DONE | BACKOFFICE-2 | |
| 9 | "Pagado a empleados" hidden under a month | DONE | BACKOFFICE-1 | |
| 10 | Card-fee row / warning (Wompi) | DONE | BACKOFFICE-2 | |
| 11 | WhatsApp or PDF failure says so | DONE not seen on a phone | BACKOFFICE-1 | Real share sheet not tried. |
| 12 | PDF wraps, more pages | DONE not seen on a phone | BACKOFFICE-2 | Real sharing not tried. |
| 13 | Copy by button, not long press | DONE | BACKOFFICE-2 | |
| 14 | Neutral accountant intro | DONE | BACKOFFICE-2 | |
| 15 | Client can be taken off a sale | DONE | BACKOFFICE-2 | |
| 16 | Readable WhatsApp number, labels | DONE | BACKOFFICE-2 | WA-FIX-1 also fixed country codes. |
| 17 | Country ID name, no Colombian example | DONE | BACKOFFICE-1 | |
| 18 | Name label, "compras", accent sort | DONE | BACKOFFICE-1, BACKOFFICE-2 | |
| 19 | Client count on panel row | DONE | BACKOFFICE-2 | |
| 20 | New hire PIN shown on save | DONE | BACKOFFICE-1 | |
| 21 | Owner blocking himself asks | DONE | BACKOFFICE-1 | |
| 22 | Staff form Back warns | DONE | BACKOFFICE-1 | |
| 23 | Supplier-invoice permission hidden | DONE | BACKOFFICE-2 | |
| 24 | "Cajero" badge | DONE | TABLES-1 | Same as Prompt 3 #19. |
| 25 | WhatsApp hint and length check | DONE | BACKOFFICE-1, BACKOFFICE-2, WA-FIX-1 | |
| 26 | One delete confirm; counts agree | DONE | BACKOFFICE-2 | |
| 27 | PIN change; PIN sent as plain text | PARTLY | BACKOFFICE-2 | Change PIN done (owner view). The PIN still goes as plain text over WhatsApp; no regenerate. |
| 28 | Green dot on owner | DONE | BACKOFFICE-2 | Removed. |
| 29 | "Dueño" / "PIN" wording | DONE | BACKOFFICE-2 | |
| 30 | Pay ask with salaries in a staff session | DONE | BACKOFFICE-2 | Confirmed and fixed. |
| 31 | Auto-off notice shown | PARTLY | BACKOFFICE-2 | Shows on the Team page; not pushed to Home when it happens (size ceiling of PosViewModel). |
| 32 | "Meses anteriores" with tracking off | DONE | BACKOFFICE-2 | |
| 33 | Cancel while turning pay on | DONE | BACKOFFICE-2 | |
| 34 | "1 personas" | DONE | BACKOFFICE-1 | |
| 35 | Consent page says the 25th | DONE | BACKOFFICE-1 | |
| 36 | Month editor guard; "Llevar la cuenta" | DONE | BACKOFFICE-2 | |
| 37 | Ask before tracking start; cold-start miss | DONE not seen on a phone | BACKOFFICE-2 | Real cold start not run. |

## PROMPT 8 - Discounts, taxes, combos, connections, store, offline, backup, security, businesses (44 items)

| # | Item | Status | Round | Note |
|---|---|---|---|---|
| 1 | Colombia service charge 10% | DONE | FIX-4 | |
| 2 | Fee appears only after restart | DONE | BACKOFFICE-2 | Seeded at creation. |
| 3 | Wrong toast on saving a rule | DONE | BACKOFFICE-1 | "Guardado". |
| 4 | One word "Cargo" | DONE | BACKOFFICE-2 | |
| 5 | Fingerprint prompt "¿Quitar el cargo?" | DONE | BACKOFFICE-2 | |
| 6 | Named discount line; fee card amount | DONE | BACKOFFICE-2 | |
| 7 | Comma in tax %, 100% cap | DONE | BACKOFFICE-1 | |
| 8 | Edit a tax, "incluido", country presets | DONE | BACKOFFICE-2 | |
| 9 | "Tu combo" title | DONE | BACKOFFICE-1 | |
| 10 | Empty combo text "con descuento" | DONE | BACKOFFICE-1 | |
| 11 | Combo Siguiente/Guardar as bottom buttons | DONE | BACKOFFICE-2 | |
| 12 | Combo cannot save empty | DONE | BACKOFFICE-1 | |
| 13 | Combo picker prices, 48 dp rows | DONE | BACKOFFICE-2 | |
| 14 | Combo pause, badge, named in cart and receipt | PARTLY | BACKOFFICE-2 | Pause, badge on tiles and name in the cart done. Name on the stored receipt not done (needs a stored column). |
| 15 | "Este teléfono" in remove dialog | DONE | BACKOFFICE-1 | |
| 16 | "Primera caja" in the nudge | DONE | BACKOFFICE-1 | |
| 17 | Connections top bar paper style; title twice | PARTLY | BACKOFFICE-1 | US/CA no longer repeat the title. Paper-style top bar not reported. |
| 18 | Locked store message true | DONE | FIX-4 | |
| 19 | Store unlock copy matches the rule | DONE | FIX-4 | |
| 20 | Store link host platata-app.web.app | NOT DONE | BACKOFFICE-2 | Report only: Monti decides the domain. |
| 21 | Orders heard only while app is open | ALREADY FINE | BACKOFFICE-2 | The text already existed. |
| 22 | Dishes dropped from the online menu | DONE | BACKOFFICE-2 | List of hidden dishes and why. |
| 23 | Shop name blue #007AFF on customer page | NOT DONE | BACKOFFICE-2 | Report only: it lives in `public/store/store.css`, out of scope. |
| 24 | Held-sales strip says cloud | DONE | BACKOFFICE-1 | |
| 25 | Offline order not at the kitchen | DONE | BACKOFFICE-1 | Shown for restaurants by type, not by whether a kitchen exists. |
| 26 | Owner sees offline sign | DONE | BACKOFFICE-2 | |
| 27 | "Pendiente de enviar" | DONE | BACKOFFICE-1 | |
| 28 | "Nunca se borran" false | DONE | FIX-4 | |
| 29 | "Una vez al día" wrong | DONE | FIX-4 | |
| 30 | Backup dates in the phone language | DONE | BACKOFFICE-1 | |
| 31 | "Respaldar ahora" with no internet | DONE not seen on a phone | BACKOFFICE-1 | Real WorkManager queue not seen. |
| 32 | "Datos en riesgo" plain words | DONE | BACKOFFICE-2 | |
| 33 | "Eliminar dispositivos" does nothing | DONE | FIX-4 | Switch hidden. |
| 34 | Discount approval text not true | DONE | FIX-4 | |
| 35 | Settings row promises fingerprint | DONE | FIX-4 | |
| 36 | No screen lock: switches silent | DONE | FIX-4 | Dialog now explains. |
| 37 | Business delete fails silently on PIN phones | DONE not seen on a phone | FIX-4, BACKOFFICE-1 | Real system prompt on a PIN-only phone not seen. |
| 38 | Branch gets Security ON | DONE | BACKOFFICE-2 | |
| 39 | Flag prompt wording | DONE | BACKOFFICE-1 | "¿Abrir tu negocio?" |
| 40 | "1 de 10" counts the open business | DONE | BACKOFFICE-1 | Kept the count and added "en total". |
| 41 | "Celulares" vs "Teléfono de empleado" | DONE | BACKOFFICE-2 | Renamed to the plural "Teléfonos de empleados". |
| 42 | Branch name forced to "La Fonda-Centro" | DONE | BACKOFFICE-2 | |
| 43 | Register open/closed per business in the list | NOT DONE | BACKOFFICE-2 | Reading another business needs opening its database, which the workspace rule forbids. |
| 44 | List closes with back arrow | DONE | BACKOFFICE-2 | A building's paper list keeps its decided X. |

---

## Notes on how this was read

- Two rounds were started and left nothing usable: PIX-2 (its report file is only an API error, no commit on any branch) and NET-1 (only a session log, no commit, no report). Nothing is counted as done because of them.
- Numbering: some round reports (FIX-4, PAY-1, BACKOFFICE-1) used their own list numbers. Each row here was matched by what the item says, not by their numbers.
- Checked in the code of `origin/sim/usa-canada` (read only): that Prompt 3 #11 has no "Enviado a cocina" message, that the kitchen ticket window still keeps crossed-off lines in screen memory only, that the printer page shows "Prints: receipts / kitchen orders", and that all lane tips are ancestors of the branch.
- Not run in this round: no code change, no Gradle, no phone.