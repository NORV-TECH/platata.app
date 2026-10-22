# Report (keep this up to date)

Last update: 22 Oct 2026, 2:45 PM PT (21:45 UTC), by the services builder (took over from the architect at 11:00 AM PT).
App commit the demos were built and checked at: 73c65f08 (sim/usa-canada, MERGE-23). Newest commit seen: d30ffa1 (MERGE-24, the online-booking fix "Arreglo 14"); it does not touch the tiles, so the tile-price fix is NOT in yet. Website work only on `demo-studio`, folder `demo-studio/`; nothing deployed, nothing published, main untouched.

## Summary
Services: 31 demos built (V1–V8, VS1–VS24 except VS20), every one independently reviewed against the app code and fixed. Voices made for all of them (es, pt, Mexico es where Mexico differs). 20 videos are final; 45 videos show the app's cut tile prices and wait for the coder's fix (architect, 22 Oct: wait for the fix, publish nothing); the Brazil V5 video waits for the Portuguese WhatsApp fix. Coder list round 2 is ready (10 blocking, 42 small).

## How each services demo was made
Build (helper, verified in the app code at 73c65f08) → independent review by a fresh helper (`handoff/research/services/REVIEW-*.md`, 8 reviews, 48 MUSTs found, all fixed) → voice (GitHub job) → timing check with the real clip lengths (`tools/timing_frames.py`, frames looked at for every video) → record → decode check → commit.

## Built and recorded
- Restaurant: 35 demos, 108 videos; Retail: 34 demos, 108 videos (before handoff).
- Services data kit: `kit/services-data.js`, `kit/vkit.js` (four businesses × 10 countries; the app's own catalogue copied by `tools/make_services_catalog.py`; Colombian prices = the app's; other countries = prices the demo owner typed; generic products only).

Services (es = Colombia, shown for every Spanish country; pt = Brazil; MX = Mexico's own Spanish, also shown for PE CL EC AR PA where it says "no suggested prices" (V1, V2) or "the cut has choices" (VS18)). Every video was checked frame by frame for cut prices (`tools/cut_price_scan.py`, with the real clip lengths): "final" = recorded, no cut price on screen; "held" = voice ready, recorded again after the tile fix.

| Feature | Business | Final videos | Held for the tile fix |
|---|---|---|---|
| V1 Elegir el oficio | Peluquería | pt, MX | es (ends on the till) |
| V2 Editar precios y opciones | Peluquería | – | es, pt, MX |
| V3 Agendar una cita | Peluquería | – | es, pt |
| V4 La agenda del día | Peluquería | – | es, pt |
| V5 Mover, cancelar, no asistió | Peluquería | es | pt held for the Portuguese WhatsApp text (coder item 3) |
| V6 Cobrar la cita | Peluquería | – | es, pt |
| V7 Servicios y productos | Peluquería | – | es, pt |
| V8 Local, domicilio, recogida | Peluquería | – | es, pt |
| VS1 Crear el negocio | Peluquería | es, pt | – |
| VS2 Abrir la caja | Peluquería | – | es, pt |
| VS3 Efectivo | Peluquería | – | es, pt |
| VS4 QR / Pix | Peluquería | – | es, pt |
| VS5 Tarjeta | Veterinaria | – | es (Colombia, Wompi), MX (Stripe). No BR: no card in Brazil |
| VS6 Otras formas de pago | Veterinaria | – | es, pt, MX |
| VS7 Recibo | Peluquería | – | es, pt |
| VS8 Devolver una venta | Peluquería | es, pt | – |
| VS9 Sacar efectivo | Peluquería | – | es, pt |
| VS10 Cerrar la caja | Peluquería | es, pt | – |
| VS11 Reportes | Peluquería | es, pt | – |
| VS12 Enviar al contador | Veterinaria | es, pt | – |
| VS13 Clientes | Veterinaria | es, pt | – |
| VS14 Equipo y claves | Peluquería | es, pt | – |
| VS15 Pago a empleados (not US) | Peluquería | – | es, pt |
| VS16 Descuentos y cargos | Peluquería | es, pt | – |
| VS17 Impuestos | Peluquería | – | es, pt |
| VS18 Combos | Peluquería | – | es, pt, MX |
| VS19 Otro celular o tableta | Peluquería | es | pt |
| VS21 Sin internet | Peluquería | – | es, pt |
| VS22 Google Drive | Veterinaria | – | es, pt |
| VS23 Huella | Peluquería | – | es, pt |
| VS24 Varios negocios | Peluquería | – | es, pt |

Final now (20): V1 pt, V1-MX, V5 es, VS1 es/pt, VS8 es/pt, VS10 es/pt, VS11 es/pt, VS12 es/pt, VS13 es/pt, VS14 es/pt, VS16 es/pt, VS19 es.

Every page also plays for the other three businesses (`&biz=veterinaria|taller-motos|unas`) and all 10 countries. Taller de motos and Uñas are not the default business of any video yet; a few could be re-made with them later (e.g. V3 "Crear orden" for the workshop).

Demo tree (`index.html`, built by `tools/tree_restaurant.py`): services section for the four businesses (pages with `&biz=`), Spanish countries + Brazil; US/CA not offered for services (on hold). Not published: the architect publishes.

## On hold
- V9, VS20 (online booking / sell online): coder Lane D fix + Monti's deploy.
- All US/Canada work (services scripts carry es + pt only).
- V5 Brazil video: waits for coder item 3 (pt WhatsApp text).
- Colombia card scan: not in the app.
- Mexico card pieces (RS5/TS5 `-MX`, the "can't tap → Cobrar con enlace" video, store picture): next, after services. Note coder item 7: in Mexico "Configurar QR" hides "Cobrar con enlace" on the pay screen.

## Waiting for the tile-price fix (coder round 2, item 2: blocks a demo)
The architect (22 Oct): wait for the fix, publish nothing, record now only videos with no cut tile price on screen. These 45 videos were recorded, found to show cut prices, and taken out of the repo; their voices are kept, so they are recorded again as soon as the fix is in the newest sim/usa-canada commit (then: `tools/timing_frames.py`, record, `tools/cut_price_scan.py`, commit):
V1 es; V2 es, pt, MX; V3 es, pt; V4 es, pt; V6 es, pt; V7 es, pt; V8 es, pt; VS2 es, pt; VS3 es, pt; VS4 es, pt; VS5 es, MX; VS6 es, pt, MX; VS7 es, pt; VS9 es, pt; VS15 es, pt; VS17 es, pt; VS18 es, pt, MX; VS19 pt; VS21 es, pt; VS22 es, pt; VS23 es, pt; VS24 es, pt.
Also re-record when those land: V7 after item 8 ("2 servicios"); V3, V4, V6 after item 13 ("Atendió" on a future booking); V4, V5, VS7 after item 12 (raw "+573001234567").

## Problems found (for the coder) — READY
`handoff/research/services/CODER-PROMPTS-SERVICES-ROUND2.md`: 10 blocking (brands still in seeded products; tile prices cut; Portuguese WhatsApp grammar; "Unknown" on no-show rows; new-client promo wording and promo frozen at booking; delete does nothing with no screen lock; Mexico link payment hidden + no card line on Stripe receipts; "2 servicios" strip; "Desde" tile shows the first choice not the lowest; combo second service can't take its option sets), 42 small, 1 US/CA. Several of the 21 Oct items are only half fixed (3, 11, 40, 42, 48, 51); each is named in the file. Monti passes it to the coder.

## Questions for Monti
- None open. Answered 22 Oct: the services videos wait for the tile fix (architect); the Mexico card surcharge is left as is (Monti).

## For the architect (from Monti, 22 Oct)
- **Mexico card surcharge:** the "Cargo por tarjeta de crédito" discount idea is offered in Mexico (Stripe country), where a card surcharge may not be allowed. Monti: leave it as is for now, no research; keep it as a point for when Mexico is looked at. (Coder round 2, "For Monti" 1.)
- MERGE-24 (d30ffa1, online booking "Arreglo 14") is in sim/usa-canada; V9 and VS20 still wait for Monti's deploy and go.

## Notes
- The checker needs Playwright 1.56.0 here (the container's Chromium is build 1194): `pip install playwright==1.56.0`.
- `tools/timing_frames.py <ID> es:CO pt:BR` = frames inside every voice line with the real clip lengths, to check before recording.
- Kit polish for later (not needed by the built pages, which carry their own data): a few no-shows in the history, history from the 1st of last month, clients on fewer sales, no QR sales for US/CA.
