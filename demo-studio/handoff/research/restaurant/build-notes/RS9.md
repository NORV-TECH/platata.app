# RS9 "Meter y sacar efectivo" — build notes

## 1. Built
- Owner phone: Mi negocio (Security is on, so the flag is a fingerprint and the system prompt "¿Abrir tu negocio?" shows), the panel's green "Caja abierta" card, the Register screen, "Sacar efectivo", amount on the money keypad + reason chip "Proveedor", Guardar; back on the Register screen with the "Guardado" snackbar, the new red line "Sacar efectivo · Proveedor · 15:10  -$X  Anular" and a lower "Debe haber en la caja". The last lines say "Meter efectivo" works the same.
- Device: owner phone (cash in/out is owner-phone-only in v1, by decision). Differs by country only in money and the keypad's bottom-left key.
- Checked at app-head 6736ddfb (panel Reports row now says "Ventas netas hoy · $X" outside US/CA; applied).

## 2. Left out
- The system biometric sheet is drawn simply (it is Android's, not the app's).
- "Meter efectivo" is told, not tapped (same screen with the reasons Sencillo / Otro).

## 3. New UX/UI problems
- None new.
