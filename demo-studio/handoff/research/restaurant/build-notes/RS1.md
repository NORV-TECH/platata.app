# RS1 "Crear el negocio" — build notes

## 1. Built
- First run as a restaurant on the owner phone: Welcome, 1 de 4 country (detected from the phone), 2 de 4 type (Restaurante + its pitch card), 3 de 4 name (keyboard up, "Así sale en tus recibos"), 4 de 4 Google, "Configurando tu negocio…", "¡Tu negocio está listo!", then Home on Catálogo with the empty-menu doors.
- Device: owner phone only. Paper look for the setup screens, Material for Home.
- Differs by country: country name and currency line, the Edificios tile (Colombia only, else 3 tiles with the last full width), the pitch pay line (`lineaDePago`: CO "Efectivo, QR y tarjeta", BR "Dinheiro e Pix", US/CA "Cash and card · Free. You only pay a fee on card payments.", others "Efectivo y QR · Gratis, para siempre."), the shop name.
- Checked at app-head 6736ddfb (moved from abb8fddb during the build; strings re-read: new `auth_subheadline`, Pix pitch lines).

## 2. Left out
- Android's own Google account chooser / consent sheet (system UI, not the app): the tap on "Continuar con Google" goes straight to "Configurando".
- The "Ya uso Platata" sheet and the full country list (not part of this path).
- The flag is a drawn flag in a circle; the app draws the emoji (headless browsers have no emoji font).
- The three "Configurando" ticks are paced by the demo; in the app they follow `creationProgress` (no timer).

## 3. New UX/UI problems
- small — The Google step says the same sentence twice: `auth_subheadline` is now "Tu negocio queda ligado a tu cuenta de Google." and the first row under it is `auth_benefit_account` "Tu negocio queda ligado a tu cuenta de Google" (same in pt/en). `ui/screens/auth/GoogleAuthScreen.kt:381` and `:389`. Fix: give the subheadline its own line (e.g. "Así entras desde cualquier celular.") or drop row 1. (Introduced by the round-2 fix of the "nunca se pierda" line.)
