# Report (keep this up to date)

Last update: 22 Oct 2026, by the services builder (this session took over from the architect at 11:00 AM PT).
App commit last checked: 73c65f08 (sim/usa-canada, MERGE-23). Website work only on `demo-studio`, folder `demo-studio/`; nothing deployed, main untouched.

## Built and recorded
- Restaurant: 35 demos, 108 videos (done before handoff).
- Retail: 34 demos, 108 videos (done before handoff).
- Services data kit: DONE. `kit/services-data.js` + `kit/vkit.js` (four businesses × 10 countries: Peluquería Carolina, Veterinaria Patitas, Taller de Motos Jorge, Uñas Valentina; services, choices, add-ons, minutes copied from the app's catalogue by `tools/make_services_catalog.py`; Colombian prices = the app's; other countries = prices the demo owner typed; generic products only; 6 weeks of sales; today's and the next days' bookings).
- Services demos: being built now (V1–V8, VS1–VS24 except VS20), 8 helpers in parallel, then an independent check, then voice + videos (CO es, BR pt, MX es where Mexico differs).

| Feature | Page | Script | Check | Videos |
|---|---|---|---|---|
| V1–V8 | building | building | – | – |
| VS1–VS24 (not VS20) | building | building | – | – |

## On hold
- V9, VS20 (online booking / sell online): coder Lane D fix + Monti's deploy.
- All US/Canada work (services pages are not offered for US/CA in the demo tree; scripts carry es + pt only).
- Colombia card scan picture/video: scan not in the app yet.
- Mexico card pieces (RS5/TS5 `-MX`, the "can't tap → Cobrar con enlace" video, store picture): after services. VS5-MX is part of the services batch.

## Problems found (for the coder)
- `handoff/research/services/CODER-PROMPTS-SERVICES-ROUND2.md` (started; not final): seeded products still carry real brands in many trades (item 9 of 21 Oct only partly done); two Portuguese product names left in Spanish.

## Questions for Monti
- None yet.

## Notes
- The checker needs Playwright 1.56.0 here (the container's Chromium is build 1194); `pip install playwright==1.56.0`.
- Demo tree (`index.html`): services section added to `tools/tree_restaurant.py` (four businesses, pages with `&biz=`); S5 shows for Mexico for services (Stripe). Regenerated when the pages land.
