# VS9 — Meter y sacar efectivo (services, owner phone)

## 1. Built
- Peluquería Carolina, "Tu teléfono", 13:10. Till → flag (fingerprint, Security on by default) → business panel (Caja abierta · Ventas, Vender en línea,
  Clientes, Facturas, Equipo, Reportes, Configuración: no Items / Inventory rows for services) → Register screen (Efectivo inicial = openingCash, Ventas en
  efectivo = the kit's morning cash + VS3's sale, Debe haber) → Sacar efectivo → amount + "Proveedor" → Guardar → red line "Sacar efectivo · Proveedor · 13:10
  -$X" with "Anular", Debe haber lower, snackbar "Guardado". 7 beats, 7 taps. "Meter efectivo" shown, not tapped.
- Countries differ only in money / keypad key. Owner phone only (REGISTER-2, decided). App checked at 73c65f08.

## 2. Left out
- Nothing in these screens reads the business type; no fiado line for services. A "Proveedor" cash-out is not a supplier invoice (S7-D14a, by design).

## 3. New UX/UI problems
- Review fixes: video wait before the Mi negocio tap; the Register screen's left arrow is enabled (earlier shifts exist).
- None new. (TS9's page drew "Anular" in red; the app's TextButton is primary #1C1C1E — drawn right here.)

## 4. The 52 items
- None of the 52 touches cash in/out. FIX-3 item 2 (owner's name, not "Owner"): fixed, shown.

## Round 3 (37db6d6c)
- Page changed: the till's service tiles ("Desde" line, whole amount, minutes line; ProductCard.kt:295-422) and the panel's search
  bar as its first item (PanelSearchBar.kt:34-60). The Register screen and Sacar efectivo have no change at 37db6d6c.
  STR: + items_price_from_only, bridge_mode_ask, wsearch_bar.
- Script: unchanged. check_demo CO/BR/MX OK (also PE, US). Timing VS9 es:CO, pt:BR: every line over its screen. No video exists
  (no cut_price_scan); the till frames show whole prices.
- New app bugs: none.
- Round-2 items seen: 2, 9, 17 (tile) fixed.
