# Report (keep this up to date)

Last update: 22 Oct 2026, 1:00 PM PT (19:50 UTC), by the services builder (took over from the architect at 11:00 AM PT).
App commit last checked: 73c65f08 (sim/usa-canada, MERGE-23). Website work only on `demo-studio`, folder `demo-studio/`; nothing deployed, main untouched.

## How each services demo is made
Build (helper, verified in the app code) → independent review by a fresh helper (`handoff/research/services/REVIEW-*.md`) → fixes → voice (GitHub job) → timing check with the real clip lengths (`tools/timing_frames.py`) → record → commit.

## Built and recorded
- Restaurant: 35 demos, 108 videos (before handoff). Retail: 34 demos, 108 videos (before handoff).
- Services data kit: done (`kit/services-data.js`, `kit/vkit.js`, `tools/make_services_catalog.py`).

Services (videos: es = Colombia, shown for every Spanish country; pt = Brazil; MX = Mexico's own Spanish where it differs):

| Feature | Business | Reviewed + fixed | Voice | Videos |
|---|---|---|---|---|
| V1 Elegir el oficio | Peluquería | yes | queued | – (es, pt, MX) |
| V2 Editar precios y opciones | Peluquería | yes | queued | – (es, pt, MX) |
| V3 Agendar una cita | Peluquería | yes | queued | – |
| V4 La agenda del día | Peluquería | yes | queued | – |
| V5 Mover, cancelar, no asistió | Peluquería | yes | queued | – (pt HELD: app's pt WhatsApp text is wrong) |
| V6 Cobrar la cita | Peluquería | yes | done | es, pt |
| V7 Servicios y productos | Peluquería | yes | done | es, pt |
| V8 Local, domicilio, recogida | Peluquería | yes | done | es, pt |
| VS1 Crear el negocio | Peluquería | yes | queued | – |
| VS2 Abrir la caja | Peluquería | yes | done | recording |
| VS3 Efectivo | Peluquería | yes | done | recording |
| VS4 QR / Pix | Peluquería | yes | done | es, pt |
| VS5 Tarjeta | Veterinaria | yes | done | es (CO Wompi), MX (Stripe). No BR: no card in Brazil |
| VS6 Otras formas de pago | Veterinaria | yes | done | es, pt, MX |
| VS7 Recibo | Peluquería | yes | done | es, pt |
| VS8 Devolver una venta | Peluquería | yes | queued | – |
| VS9 Sacar efectivo | Peluquería | yes | done | recording |
| VS10 Cerrar la caja | Peluquería | yes | done | recording |
| VS11 Reportes | Peluquería | yes | queued | – |
| VS12 Contador | Veterinaria | yes | queued | – |
| VS13 Clientes | Veterinaria | yes | queued | – |
| VS14 Equipo y claves | – | building | – | – |
| VS15 Pago a empleados | – | building | – | – |
| VS16 Descuentos y cargos | Peluquería | yes | done | es, pt |
| VS17 Impuestos | Peluquería | yes | queued | – |
| VS18 Combos | – | building | – | – |
| VS19 Otro celular o tableta | – | building | – | – |
| VS21 Sin internet | Peluquería | yes | queued | – |
| VS22 Google Drive | Veterinaria | yes | done | es, pt |
| VS23 Huella | Peluquería | yes | done | es, pt |
| VS24 Varios negocios | Peluquería (+ a second business) | yes | done | es, pt |

Taller de motos and Uñas are not the default of any video yet (every page plays them with `&biz=`); the architect may want a few videos re-made with them (e.g. V3 "Crear orden" for the workshop).
Every page also works for the other three businesses (`&biz=veterinaria|taller-motos|unas`) and all 10 countries.

## On hold
- V9, VS20 (online booking / sell online): coder Lane D fix + Monti's deploy.
- All US/Canada work (services scripts carry es + pt only; the demo tree offers no services pages for US/CA).
- V5 Brazil video: waits for the coder to fix the pt WhatsApp text ("no sexta-feira").
- Colombia card scan: not in the app.
- Mexico card pieces (RS5/TS5 `-MX`, the "can't tap → Cobrar con enlace" video, store picture): after services.

## To re-record after the coder fixes the tiles
The till's service tiles cut their prices on a 412 dp phone ("Desde …", "$ 25.0…"): coder round 2, item 0. Videos that show the till will be re-recorded once it is fixed (the voices stay; recording is free): V1, V3, V6, V7, V8, VS2, VS3, VS4, VS5, VS6, VS9, VS16, VS21, VS23, VS24 and others that pass through the till.

## Problems found (for the coder)
- `handoff/research/services/CODER-PROMPTS-SERVICES-ROUND2.md` — being filled; the blocking items are in (cut tile prices, brands in seeded products, pt WhatsApp text, "Unknown" payment on no-shows, new-client promo wording, delete with no screen lock, Mexico's "Cobrar con enlace" hidden by "Configurar QR", "2 servicios" for a service + product). The small items from the build notes and reviews are added at the end of the batch.

## Questions for Monti
- None yet.

## Notes
- The checker needs Playwright 1.56.0 here (the container's Chromium is build 1194): `pip install playwright==1.56.0`.
- Demo tree (`index.html`): services section in `tools/tree_restaurant.py` (four businesses, pages with `&biz=`); S5 shows for Mexico for services. Regenerated at the end.
