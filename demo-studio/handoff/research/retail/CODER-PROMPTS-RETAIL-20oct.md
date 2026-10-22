# Marketer to coder: retail (tienda and farmacia) problems found while researching the demos (20 Oct 2026, 9:30 PM PT)

Read in the code at 6736ddfb. Nothing was run on a phone. The barcode-list download (606 MB) is already in CODER-PROMPTS-RESTAURANT-ROUND3-20oct.md, item A.

```
Retail (tienda and farmacia). Code at 6736ddfb, branch sim/usa-canada.

Blocks a demo
1. Owner phone, "Fiar a Juan": the sale is saved but nothing moves. There is no "Fiaste $X / AHORA TE DEBE" screen; the cashier stays on the pay screen with an empty $0 sale. fiarCurrentCart (CartActions.kt:684) finalizes, but only the normal charge button navigates (HomeScreen.kt:1240-1290). Make "Fiar a Juan" end on the same screen as any finished sale, with the tab lines.
2. A partial refund of a fiado sale says "Se descuenta de la cuenta de Ana", but the debt does not change (S8). Lower the tab by the refunded amount, or change the line.
3. The business picker says "3.523 productos con código" next to a barcode icon. 3,523 is the NO-barcode catalogue (the drawn icons). Say "3.523 productos sin código, con dibujo", or show the real barcode count.
4. "Sin código" picks are filed under new ENGLISH categories ("Fruits & Vegetables", "Bread"), and those show as filter pills. Map them onto the shop's 24 ready-made categories in the shop's language.
5. Search "pan" in "Sin código" finds pana, panko, paneer, panela… but no bread, even though the hint suggests "pan". Rank whole-word and start-of-name matches first.
6. In Brazil and the US, every name from the barcode list is Spanish (cut at 40 characters) and the owner can't edit it. Let the owner edit the name. (Whether those countries get the list at all is Monti's call.)

Small
7. The fiado tender is looked up by its English name (CartActions.kt:686 getPaymentMethodByName("Fiado")). Look it up by systemKey "fiado" (choke point 15).
8. A dim "Fiar" gives no reason. Show the existing "add a client" hint when it is tapped.
9. Not plurals: "1 llevan…", "Salda 0/1 fiados completos", "1 fiados". Use <plurals>.
10. Spanish "Más plata" is slang; say "Más dinero" or "Otro monto".
11. Debts under 15 days are painted green, the colour that means "paid" (S13). Use a neutral colour.
12. "Perdonar deuda" asks for no fingerprint or PIN.
13. A fiado receipt does not show the new balance (S7).
14. Tab payments (abonos) never show in Reports, and the accountant sheet has no row for tab payments or forgiven tabs.
15. The Items header counts the 24 seeded categories ("5 artículos · 29 categorías"). Count only categories that have items.
16. In MX, PE, PA, US and CA the stock keypad's decimal key types "," while the screen shows ".".
17. Badge "queda poco" (lowercase) next to the pill "Quedan pocos"; the partial-refund note and the staff grant say "Stock" while shops say "Inventario".
18. Swiping away the "¿Cuándo queda poco?" step leaves no low level and no hint.
19. Invoice search says "nombre o teléfono" but only matches the supplier name. The camera ✕ is read out as "Back". Reading the invoice works only online, and nothing says so when offline.
20. After an item is removed from the cart, scanning it again shows "Otra más · X × 2" but adds nothing.
21. A barcoded product sold by weight is added as 1, with no weight keypad.
22. The weight keypad, the "Sin código" grid and the receipt show untranslated unit names ("Kilogram", "/ Kilogram"). The cart and pay screen never show the weight.
23. In the US and Canada the default weight unit in "Sin código" is Kilogram, not Pound. "Libra" is in the short unit list in Brazil and other kilo countries.
24. The "Por" unit list in the "Sin código" price form shows every unit, with red English headings and two "Libra" rows. It also asks a weight for counted units (Manojo).
25. "Sin código" suggestions show "labneh (لبنة)" in Arabic script, and eggs are filed under "Tofu & Soy".
26. Units: the duplicate check uses the stored English names, so "Docena" can be created twice. The Units page's own "+" saves a new unit as "measured".
27. Scan-create form: the price field is labelled "Monto", the category list has no "+ Nueva" and isn't sorted, and the item form has no barcode field.
28. On the tablet, scan error text is red on dark grey. A plug-in barcode reader works only on the Escanear tab, and an unknown barcode is a dead end with no hint.
29. A shop is seeded with the restaurant "Cargo por servicio" and is offered Impoconsumo 8%. Both are restaurant things.
30. The seeded "Licores" and "Tabaco" categories cannot be deleted.
31. The pharmacy gets grocery categories (Licores, Tabaco, Juguetes…). A "farmacia" ad preselects Tienda. The English Ready card says "Retail" while the picker says "Store", and the picker shows "Fiado" untranslated in English.
32. The ready-made discount ideas use Title Case, and "modelos de piso" doesn't fit a tienda. The discount item picker has no search.
33. In the online store, sold-out products can still be ordered, and weighed products are missing.
34. A new branch copies the parent's stock counts. A shop sees "Menú y precios" in the branch options.

Edit only. Do not build, run, install or verify.
```

## For Monti (product decisions, nothing changed yet)

1. **Stock on several devices.** Stock only drops on the device that made the sale. The owner phone never takes off stock for tablet or employee-phone sales, and its next sync overwrites the tablet's count. Should stock be one number for the whole shop? This blocks any "tablet + stock" demo.
2. **Employees and fiado.** Staff can never sell on fiado: no screen gives the canFiar grant, and the tablet and staff phone still show a live-looking "Fiar a Juan" that does nothing. Should employees be allowed to sell on tab?
3. **Invoices.** A supplier invoice doesn't add its goods to stock; stock goes up only by hand ("Compré +N"). Keep it that way for launch?
4. **The barcode list outside Colombia.** Its names are Spanish and its prices are Colombian pesos. Should Brazil and the US get it?
5. **Pharmacy.** Only the name differs from a shop: no expiry, lot or prescription fields, and grocery categories. Is that enough for launch?
6. **Employees creating products.** No permission exists today for an employee phone to create products or set prices by scanning.
