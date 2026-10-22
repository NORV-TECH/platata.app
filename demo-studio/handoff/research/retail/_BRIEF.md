# Brief for every RETAIL research helper (read this first)

You research ONE group of Platata features against the REAL app code, for marketing demos + narrated videos (later). Same job as the restaurant research (examples of the finished result: /home/claude/research/restaurant/R4.md, S3.md, S11.md — read one to see the depth wanted).

App source (READ ONLY — never edit, create or delete anything there): /home/claude/app-head (branch sim/usa-canada; Claude moves it to newer commits during the night — always read there). Read /home/claude/app-head/CLAUDE.md first (map of invariants; long — read the parts relevant to your features; search for "retail", "RETAIL", "shop", "tienda", "fiado", "stock", "E-1x", "scan").
Code: app/src/main/java/com/example/... (package tata.fijando.su.plata). Business rules per type: data/business/BusinessRules.kt + RetailRules / PharmacyRules (never assume: ask the rules). Strings: app/src/main/res/values (en), values-es, values-pt-rBR.
Screenshots (some stale): app/src/test/screenshots/ — open PNGs with the Read tool; say how current one is vs the code.

Business: RETAIL ("Tienda" / "Mercadinho" / "Shop": barrio shops, minimarkets) and PHARMACY ("Farmacia"/droguería — it inherits RETAIL; note every place it differs). Countries: CO MX PE CL EC AR PA (Spanish), BR (Portuguese), US (English, also Spanish), CA (English). French is dropped.
Known per-country facts to VERIFY, not assume: money format (utils/CurrencyUtils.kt), card only CO (Wompi) and US/CA (Stripe), Pix QR with amount only BR, fiado (tab/credit) is RETAIL+PHARMACY only, the built-in product dictionary (which countries/languages; "3,500 products" claim — count it), units (Libra vs Pound by country), US/CA pay nothing for connections, sales tax words in US/CA.
Devices (app's own words): owner's phone; counter tablet (MamaPos, landscape, light; a shop tablet scans KNOWN products only); employee phone (Mini POS).

The demo example business (use it in your demo paths): a barrio tienda — groceries, bread, fruit, fiado customers, two suppliers. No alcohol, cigarettes or real brands on screen. Pharmacy = same shop with pharmacy products.

Already decided by Monti (don't flag): points/loyalty not in the app (no demo); combo name on the stored receipt after launch; PIN in the WhatsApp invite by design; cash in/out on the owner phone only; per-register offline sign after launch; prettier accountant PDF after launch; printers live on the owner phone. Never drop a feature because you think it's missing: write "I don't see this in the code" and what you searched.

OUTPUT: for EACH feature in your group write /home/claude/research/retail/<ID>.md (only write inside /home/claude/research/retail/), with:
1. What it does (1-2 plain lines) and WHO uses it on WHICH device(s). Retail vs Pharmacy differences.
2. Setup needed before the demo (what the owner must have switched on / created; factory defaults from seeds).
3. Country differences (per country or "same everywhere"), incl. money format examples.
4. The screens in order, each with: file:line, layout top-to-bottom, exact strings es / pt / en, colors (hex from tokens), key sizes, theme (Material light vs paper). Enough detail to redraw it in HTML faithfully.
5. A demo path of at most ~10 taps that shows the feature end to end (what is tapped, what appears). If the feature spans devices, show the hand-off.
6. UX/UI problems found (confusing words, missing feedback, dead ends, broken layout, wrong behaviour), each with file:line and one-line suggested fix. Only real ones, verified in code. Say "possible" when unsure.
7. Open questions for Monti (only if the code truly can't answer).
Plain short English. Exact strings quoted. No guessing: write "not found in code" when the code doesn't say. Put the commit you read at the top (`git -C /home/claude/app-head log -1 --format=%h`).
Finally reply with ONLY: the list of files you wrote + the UX problems (one line each, marked "BLOCKS A DEMO" or "small"). Under 400 words.
