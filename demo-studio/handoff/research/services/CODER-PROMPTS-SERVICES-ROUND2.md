# Marketer to coder: services problems found while BUILDING the demos (round 2, 22 Oct 2026)

Read in the code at 73c65f08 (MERGE-23, branch sim/usa-canada). Nothing was run on a phone. Items are added as the demos are built; this file is not final until the report says so.

```
Services, round 2. Read at 73c65f08 (MERGE-23); check against the newest sim/usa-canada first.

Blocks a demo or gets money wrong
0. MONEY DISPLAY, blocks every services video that shows the till. On a 412 dp phone (3 columns) every service tile cuts its price: "Desde …", "$ 25.0…", "A parti…", "R$ 19…". The price row is ShrinkToFitText(weight 1f, fill=false) + the minutes Text on the SAME row (ProductCard.kt:307-330); ShrinkToFitText stops at 12 sp and then ellipsizes (ShrinkToFitText.kt:29,43), so the minutes eat the room. Fix: put the minutes on their own line under the price (or drop them from the tile), so the price always fits whole. A 393 dp phone (2 columns) fits; 404 dp and wider does not.
1. BRANDS still in the seeded products (item 9 of the 21 Oct list is only partly done). The setup seeds EVERY product of the trade into Productos (GuideActions.kt:680-690), and many names are still brands: peluqueria "Tinte Alfaparf Evolution of the Color", "Línea Recamier Salon In"; veterinaria "Galgocal antiparasitario interno", "Canisan D antihelmíntico", "Collar antiparasitario Seresto"; unas "… Organic Nails …" (3), "Esmalte ojo de gato Nails Station 10 ml", "Kit de pintura acrílica … DEKO"; and across the other trades: barberia (Reuzel, Suavecito, Immortal, STMNT, Whiskers, Barba Roja, Red One, God Barber, Rolda, Roterbart, Jack Barber's), depilacion (Belotti, Bell Franz, Veet ×2), estetica (ISDIN, Bioderma, La Roche-Posay, CeraVe, SkinCeuticals, Vichy), podologia (ISDIN/Ureadin ×4), lavanderia (Fab, Ariel, As, Suavitel, Vanish, Clorox, Rey), taller-mecanico (Mobil, Castrol, Shell, Prestone, MAC ×3, Bosch, Simoniz), peluqueria-canina (Canamor, Mon Ami, Petra, Dinky, Menforsan, Dogourmet/Italcol, Trixie), cejas-pestanas (RefectoCil, Brow Henna, Sky Glue), maquillaje (Fenty Beauty), carpinteria (Blum/Häfele, Colbón, Pintuco/Sayerlack), sastreria (YKK), celulares (iPhone, MagSafe), bronceado ("N°1 Dark"). Fix: in assets/catalogo_investigado/*.json "products", replace every brand in name.es/pt/en/fr with a generic name ("Cera para peinar mate", "Crema depilatoria", "Detergente en polvo", "Aceite de motor 20W-50", "Batería 12 V", "Cremallera"…). Same for any brand left in "axis_values" other than the "marca" axis (already filtered). Blocks every demo that opens Productos.

3. Blocks the Brazil reschedule video: the Portuguese WhatsApp texts read "ficou para no sexta-feira", "atender no quinta-feira" (values-pt-rBR appt_wa_when / appt_wa_when_day "no %1$s…", used by AppointmentText.kt:41-57). Weekdays are feminine: use "na %1$s às %2$s" / "na %1$s" (and check the rescheduled template "ficou para %4$s" reads "ficou para a sexta-feira…" or rephrase "agora é na sexta-feira…").
4. Blocks the no-show demo: a cancelled or no-show booking shows the payment method "Unknown" in Agenda › Ventas (SavedTicketActions.kt:281 stores localPaymentMethod?.name ?: "Unknown" for an unpaid saved ticket; ServicesTransactionsScreen.kt:515 prints it). Show "No asistió" / "Cancelada" (the stored status) instead of a payment method for an unpaid booking.
5. MONEY wording: the "Promo nuevo cliente" form says "Descuenta 10% automáticamente en cada venta… Solo si agregas un cliente a la venta" (DiscountFormScreen.kt:162,266-278) while the code now limits it to a client's first visit (AutoRules.kt:44-45, DiscountDraft.kt:99-102). Say "Solo en la primera visita del cliente". Also: a booking keeps the promo it got when booked, so a new client who books twice before paying gets it on both.
6. Deleting a service or item on a phone with NO screen lock (security switched on) does nothing, silently: the biometric prompt can't open and onSuccess never runs (ServiceEditScreen.kt:425-436, ItemsScreen.kt:400-408). Fall back to the in-app confirm, or tell the owner to set a screen lock.
7. Mexico (cards): on the pay screen the "Configurar QR" link takes the place of "Cobrar con enlace" (CheckoutSheetBody.kt:487-509), so a Mexican shop without QR never sees the link payment when the client's card can't tap. Show both. Also Stripe sales in Mexico (and US/CA) store no card brand or last four, so the receipt has no card line (StripePaymentActions.kt:41).
8. The sale strip says "Venta actual · 2 servicios" for a haircut plus a shampoo (HomeScreen.kt:805-809, CurrentSaleStrip services = isServices counts every line as a service). Say "2 artículos" or count services and products apart.

Small
2. Portuguese product names left in Spanish in the seed: unas "Esmalte profesional 13,5 ml" (pt should be "Esmalte profissional 13,5 ml"), peluqueria "Shampoo para cabello teñido" (pt "Shampoo para cabelos tingidos") (assets/catalogo_investigado/unas.json, peluqueria.json "products" name.pt).

Edit only. Do not build, run, install or verify.
```

## For Monti
- None yet.
