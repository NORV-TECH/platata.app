# Marketer to coder: services problems found while BUILDING the demos (round 2, 22 Oct 2026)

Read in the code at 73c65f08 (MERGE-23, branch sim/usa-canada). Nothing was run on a phone. Items are added as the demos are built; this file is not final until the report says so.

```
Services, round 2. Read at 73c65f08 (MERGE-23); check against the newest sim/usa-canada first.

Blocks a demo or gets money wrong
1. BRANDS still in the seeded products (item 9 of the 21 Oct list is only partly done). The setup seeds EVERY product of the trade into Productos (GuideActions.kt:680-690), and many names are still brands: peluqueria "Tinte Alfaparf Evolution of the Color", "Línea Recamier Salon In"; veterinaria "Galgocal antiparasitario interno", "Canisan D antihelmíntico", "Collar antiparasitario Seresto"; unas "… Organic Nails …" (3), "Esmalte ojo de gato Nails Station 10 ml", "Kit de pintura acrílica … DEKO"; and across the other trades: barberia (Reuzel, Suavecito, Immortal, STMNT, Whiskers, Barba Roja, Red One, God Barber, Rolda, Roterbart, Jack Barber's), depilacion (Belotti, Bell Franz, Veet ×2), estetica (ISDIN, Bioderma, La Roche-Posay, CeraVe, SkinCeuticals, Vichy), podologia (ISDIN/Ureadin ×4), lavanderia (Fab, Ariel, As, Suavitel, Vanish, Clorox, Rey), taller-mecanico (Mobil, Castrol, Shell, Prestone, MAC ×3, Bosch, Simoniz), peluqueria-canina (Canamor, Mon Ami, Petra, Dinky, Menforsan, Dogourmet/Italcol, Trixie), cejas-pestanas (RefectoCil, Brow Henna, Sky Glue), maquillaje (Fenty Beauty), carpinteria (Blum/Häfele, Colbón, Pintuco/Sayerlack), sastreria (YKK), celulares (iPhone, MagSafe), bronceado ("N°1 Dark"). Fix: in assets/catalogo_investigado/*.json "products", replace every brand in name.es/pt/en/fr with a generic name ("Cera para peinar mate", "Crema depilatoria", "Detergente en polvo", "Aceite de motor 20W-50", "Batería 12 V", "Cremallera"…). Same for any brand left in "axis_values" other than the "marca" axis (already filtered). Blocks every demo that opens Productos.

Small
2. Portuguese product names left in Spanish in the seed: unas "Esmalte profesional 13,5 ml" (pt should be "Esmalte profissional 13,5 ml"), peluqueria "Shampoo para cabello teñido" (pt "Shampoo para cabelos tingidos") (assets/catalogo_investigado/unas.json, peluqueria.json "products" name.pt).

Edit only. Do not build, run, install or verify.
```

## For Monti
- None yet.
