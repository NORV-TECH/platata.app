# VS1 — Empieza tu negocio de servicios desde cero — owner phone

## 1. Built
- Owner phone, same paper look as TS1/RS1 with the services accent: welcome → country (from the phone) → type page with
  "Lo que trae Servicios" pitch (41 oficios, agenda, how you get paid: cash + card CO/MX, Pix BR; fee line only US/CA, never MX)
  → business name with keyboard → Google → setting up (currency, 41 trades, register) → ready ("Servicios · País", "Escoger mis
  servicios") → landing on the trade picker (same picker as V1). 8 beats, one VS1.json (no MX word difference). App 73c65f0.

## 2. Left out
- Android's Google account chooser (GoogleAuthScreen → straight to setting up). No barcode list step: services skip it
  (OnboardingNavGraph.kt:233-272). US/CA videos (on hold).

## 3. New UX/UI problems (73c65f08)
- None new on these screens.

## 4. The 52 items checked
- 16 "con precios" dropped outside Colombia (pitch + trade_picker_lede): fixed. 50 amber bar not over the setup picker: fixed.
