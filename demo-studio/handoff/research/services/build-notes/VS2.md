# VS2 — Abrir la caja (services, owner phone)

## 1. Built
- Peluquería Carolina, "Tu teléfono", 8:05. Services till with the amber "Caja cerrada · Abrir" bar under the "Servicios · 11 | Productos · 4" tabs →
  Abrir caja (Efectivo inicial = kit openingCash, typed with the one keypad rule: "000" in COP/CLP, decimal key elsewhere) → back on the till, bar gone →
  tap "Corte de caballero / hombre" → option sheet (Lavado on, unpriced add-on "se pregunta en la caja") → "Agregar a la venta · $X" → "Venta actual · 1 servicio", Cobrar $X.
- 6 beats, 5 taps. Same day as VS3/VS9/VS10 (common block: opened 8:05 with openingCash). Countries differ only in money / keypad key. ?biz= works for the
  other three trades (their own icon, tile colour, "Crear orden" for the workshop; a service with choices opens "Elige uno" first).
- App checked at sim/usa-canada 73c65f08. Builder + sources: scratchpad `vsreg_cash/` (vcommon.js/.css shared by VS2/VS3/VS9/VS10).

## 2. Left out
- The spec's "tap a service while closed → Abrir caja" path no longer exists for services: since SVC-1 item 22 a closed register lets services (and
  Agendar) in and only the money doors ask for "Abrir caja" (CartActions.kt:182-183, HomeScreen.kt:706-718). The page opens from the bar instead.
- Staff phone / tablet "Caja cerrada" pages (hand-off) not drawn. The demo salon has its backup on (else TopStrips shows the backup bar instead).

## 3. New UX/UI problems
- small: after Cobrar sends a services owner to "Abrir caja", opening lands back on the till, not on the pay screen; Cobrar must be tapped again
  (RegisterNavGraph.kt:240-245 runs only a pending ADD; HomeScreen.kt:709-711). Fix: remember the charge and open the pay screen after onOpened.
- small (likely, check on a phone): service tile prices are cut on a 412 dp phone. ProductCard.kt:307-330: the "30 min" text is measured first, the
  price (ShrinkToFitText, 12 sp floor) gets ~50 dp, so "Desde $ 18.000" shows "Desde $ …", pt "A partir de R$ 70,00" → "A parti…", even "$ 25.000" → "$ 25.0…".
  Fix: put the minutes on their own line (or under the price). Drawn as the code lays it out.

## 4. The 52 items
- 22 (booking with the register closed, money needs it open): FIXED (CartActions.kt:182-183; HomeScreen.kt:706-718, 761-764).
- 50 (amber bar above the unfinished setup picker): FIXED (HomeScreen.kt:455-458 ServicesSetupSurface.hidesRegisterClosedBar).
- 1 (option sheet CTA leaves out the service price): FIXED (OptionSelectionSheet.kt:319-331 falls back to basePrice) — shown "Agregar a la venta · $ 25.000".
- 42 (part): "Venta actual · 1 servicio" FIXED (CurrentSaleStrip.kt services plural).
