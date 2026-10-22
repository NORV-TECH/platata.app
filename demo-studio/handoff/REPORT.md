# Report (keep this up to date)

Last update: 22 Oct 2026, 2:00 PM PT (21:00 UTC), by the services builder (took over from the architect at 11:00 AM PT).
App commit last checked: 73c65f08 (sim/usa-canada, MERGE-23). Website work only on `demo-studio`, folder `demo-studio/`; nothing deployed, nothing published, main untouched.

## Summary
Services: 31 demos built (V1–V8, VS1–VS24 except VS20), every one independently reviewed against the app code and fixed, and 65 narrated videos recorded (CO es, BR pt, Mexico es where Mexico differs). Coder list round 2 is ready (10 blocking, 42 small). Two questions for Monti below.

## How each services demo was made
Build (helper, verified in the app code at 73c65f08) → independent review by a fresh helper (`handoff/research/services/REVIEW-*.md`, 8 reviews, 48 MUSTs found, all fixed) → voice (GitHub job) → timing check with the real clip lengths (`tools/timing_frames.py`, frames looked at for every video) → record → decode check → commit.

## Built and recorded
- Restaurant: 35 demos, 108 videos; Retail: 34 demos, 108 videos (before handoff).
- Services data kit: `kit/services-data.js`, `kit/vkit.js` (four businesses × 10 countries; the app's own catalogue copied by `tools/make_services_catalog.py`; Colombian prices = the app's; other countries = prices the demo owner typed; generic products only).

Services (es = Colombia, shown for every Spanish country; pt = Brazil; MX = Mexico's own Spanish where it differs):

| Feature | Business | Videos |
|---|---|---|
| V1 Elegir el oficio | Peluquería | es, pt, MX (MX also shown for PE CL EC AR PA: no suggested prices outside Colombia) |
| V2 Editar precios y opciones | Peluquería | es, pt, MX (same as V1) |
| V3 Agendar una cita | Peluquería | es, pt |
| V4 La agenda del día | Peluquería | es, pt |
| V5 Mover, cancelar, no asistió | Peluquería | es — pt HELD (the app's Portuguese WhatsApp text is wrong, coder item 3) |
| V6 Cobrar la cita | Peluquería | es, pt |
| V7 Servicios y productos en una cuenta | Peluquería | es, pt |
| V8 Local, domicilio, recogida | Peluquería | es, pt |
| VS1 Crear el negocio | Peluquería | es, pt |
| VS2 Abrir la caja | Peluquería | es, pt |
| VS3 Efectivo | Peluquería | es, pt |
| VS4 QR / Pix | Peluquería | es, pt (pt says the Pix QR carries the total) |
| VS5 Tarjeta | Veterinaria | es (Colombia, Wompi typed card), MX (Stripe Tap to Pay, no fee mentioned). No BR (no card in Brazil) |
| VS6 Otras formas de pago | Veterinaria | es, pt, MX |
| VS7 Recibo WhatsApp o impreso | Peluquería | es, pt |
| VS8 Devolver una venta | Peluquería | es, pt |
| VS9 Sacar efectivo | Peluquería | es, pt |
| VS10 Cerrar la caja | Peluquería | es, pt |
| VS11 Reportes | Peluquería | es, pt |
| VS12 Enviar al contador | Veterinaria | es, pt (Mexico page shows no card fee) |
| VS13 Clientes | Veterinaria | es, pt |
| VS14 Equipo y claves | Peluquería | es, pt |
| VS15 Pago a empleados (not US) | Peluquería | es, pt |
| VS16 Descuentos y cargos | Peluquería | es, pt (cash discount + night charge; "Promo nuevo cliente" not demoed: its form text is wrong, coder item 5) |
| VS17 Impuestos | Peluquería | es, pt |
| VS18 Combos | Peluquería | es, pt, MX (MX also shown for PE CL EC AR PA: the cut has choices outside Colombia) |
| VS19 Otro celular o tableta | Peluquería | es, pt (Mexico pays for extra connections like Colombia; no price drawn: Google Play gives none yet) |
| VS21 Sin internet | Peluquería | es, pt |
| VS22 Google Drive | Veterinaria | es, pt |
| VS23 Huella | Peluquería | es, pt |
| VS24 Varios negocios y sucursales | Peluquería | es, pt |

Every page also plays for the other three businesses (`&biz=veterinaria|taller-motos|unas`) and all 10 countries. Taller de motos and Uñas are not the default business of any video yet; a few could be re-made with them later (e.g. V3 "Crear orden" for the workshop).

Demo tree (`index.html`, built by `tools/tree_restaurant.py`): services section for the four businesses (pages with `&biz=`), Spanish countries + Brazil; US/CA not offered for services (on hold). Not published: the architect publishes.

## On hold
- V9, VS20 (online booking / sell online): coder Lane D fix + Monti's deploy.
- All US/Canada work (services scripts carry es + pt only).
- V5 Brazil video: waits for coder item 3 (pt WhatsApp text).
- Colombia card scan: not in the app.
- Mexico card pieces (RS5/TS5 `-MX`, the "can't tap → Cobrar con enlace" video, store picture): next, after services. Note coder item 7: in Mexico "Configurar QR" hides "Cobrar con enlace" on the pay screen.

## To re-record after the coder's fixes (voices are kept, recording costs nothing)
- Item 2 (tile prices cut on a 412 dp phone: "Desde …", "$ 25.0…"): every video that shows the till, at least V1, V2, V3, V6, V7, V8, VS2, VS3, VS4, VS5, VS6, VS7, VS9, VS16, VS17, VS18, VS19, VS21, VS23, VS24.
- Item 8 ("2 servicios" for a haircut + a shampoo): V7. Item 13 ("Atendió" on a future booking): V3, V4, V6. Item 12 (raw "+573001234567"): V4, V5, VS7.

## Problems found (for the coder) — READY
`handoff/research/services/CODER-PROMPTS-SERVICES-ROUND2.md`: 10 blocking (brands still in seeded products; tile prices cut; Portuguese WhatsApp grammar; "Unknown" on no-show rows; new-client promo wording and promo frozen at booking; delete does nothing with no screen lock; Mexico link payment hidden + no card line on Stripe receipts; "2 servicios" strip; "Desde" tile shows the first choice not the lowest; combo second service can't take its option sets), 42 small, 1 US/CA. Several of the 21 Oct items are only half fixed (3, 11, 40, 42, 48, 51); each is named in the file. Monti passes it to the coder.

## Questions for Monti
1. Card surcharge in Mexico: the "Cargo por tarjeta de crédito" idea is offered in Mexico, where it is likely not allowed. Hide it in Mexico, or check first?
2. Publish the services videos now (as the app is today, with the cut tile prices) and replace them after the coder's fixes, or wait for the re-recording?

## Notes
- The checker needs Playwright 1.56.0 here (the container's Chromium is build 1194): `pip install playwright==1.56.0`.
- `tools/timing_frames.py <ID> es:CO pt:BR` = frames inside every voice line with the real clip lengths, to check before recording.
- Kit polish for later (not needed by the built pages, which carry their own data): a few no-shows in the history, history from the 1st of last month, clients on fewer sales, no QR sales for US/CA.
