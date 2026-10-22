# REVIEW-V6-8-VS16: services demos V6, V7, V8, VS16 (CO es, BR pt, MX es)

Reviewer: independent pass, 22 Oct 2026. App read at `/home/user/suma-plus-android` 73c65f08 (sim/usa-canada, clean tree). I edited no file
except this one.

How I checked:
- Ran `check_demo.py servicios/<ID> CO:es BR:pt MX:es` for all four pages: 12 of 12 runs print OK. I looked at the screenshots.
- Compared every key in each page's `STR`/`PLU` with values / values-es / values-pt-rBR: 480 strings and 22 plurals, 0 mismatches.
- No voices exist yet. I played each page in video mode with line lengths estimated at 14.5 chars/s + 0.25 s, for CO es, BR pt and MX es.
  For every line I logged the tap times and what was on screen. The finding does not depend on that estimate: a beat's taps always fire
  0.8 s into its line (engine.js:157).
- Played each page with `?biz=veterinaria|taller-motos|unas` for CO es (12 runs). All play to the end with no error, and the screens make
  sense ("Cancelar orden" and "¿Cuándo está listo?" for the workshop, no "Atendió" line for the one-person nail salon).
- Beats == json steps: V6 7 = 7, V7 8 = 8, V8 9 = 9, VS16 9 = 9 (the same for MX). Script lengths in chars (es / pt): V6 327 / 367,
  V7 309 / 327, V8 372 / 407, VS16 342 / 389. All lines use tú / você, with no greetings or filler. Every last line follows the
  "Así … con Platata." / "Assim … com o Platata." pattern. Every subtitle is 60 characters or fewer.
- Hard rules: all four pass. No US or Canada content, no French, light theme, no card logos, no brands, no card scan, no fee talk in
  Mexico. No Pix screen appears in Brazil, so no Pix line is needed.

## Summary
| Feature | es (CO) | pt (BR) | MX es (same json) |
|---|---|---|---|
| V6 Cobrar la cita | 1 MUST, 1 nice | 1 MUST, 1 nice | words are the same, no -MX needed; the same MUST applies if recorded |
| V7 Servicio + producto | 1 MUST, 2 nice | 1 MUST, 2 nice | words are the same, no -MX needed; the same MUST applies if recorded |
| V8 Dónde atiendes | OK, 3 nice | OK, 3 nice | words are the same, no -MX needed |
| VS16 Descuentos y cargos | 1 MUST, 1 nice | 1 MUST, 2 nice | words are the same, no -MX needed; the same MUST applies if recorded |

MX check: there is no values-es-rMX, so every button word is the same string as in Colombia. Mexico differs only on screen, and no
voice line mentions the differences:
- the pay row shows a bare "Exacto" next to the outlined "+ Tarjeta · Configurar" button (PayWaysVisibility.kt rule 4,
  CheckoutPayBlock.kt:349-352);
- the VS16 Cargos tab also shows the "Cargo por tarjeta de crédito" idea (CardCountryGate.kt:34).

I agree that none of the four needs a -MX json.

Claims I verified in the code:
- **Cobrar with the register closed.** On the appointment page, Cobrar with a known-closed register returns REGISTER_CLOSED
  (SavedTicketActions.kt:700-703). It then opens Abrir caja, and the ticket stays put (ReportsNavGraph.kt:140-141). The register opens
  at $ 0 with no question (OpenRegisterScreen.kt C-01). onOpened pops back to the appointment (RegisterNavGraph.kt:236-247), so a
  second Cobrar is needed. Everything V6's voice says is true.
- **"Atendió: Carla".** It shows on the appointment page (AppointmentDetailScreen.kt:267-276). It also prints below TOTAL on the
  receipt that "Ver recibo" shows, which is the stored-sale receipt (CheckoutActions.kt:667-669, ReceiptBuilder.kt:84-85,
  ReceiptFormatter.kt:459).
- **Options sheet button price.** The button reads "Agregar a la venta · $ 25.000" because it falls back to the host's basePrice
  (OptionSelectionSheet.kt:355-380, ProductSheetHost.kt:162). Lavado is included and ON at 0. "Cepillado / secado" is asked at the
  till and OFF.
- **Where-mode chooser.** With 2 modes the chooser blocks the pay buttons until one is picked (WhereGate.kt:66-136,
  CheckoutSheetBody.kt:314-316). The travel fee rides the fee path under the mode's name (AutoRules.kt:74-92,
  PosViewModel.kt:3544-3570). The receipt prints it as "A domicilio: $ 10.000" and does not repeat the where line
  (ReceiptFormatter.kt:411-423, :90-101).
- **Fee box.** It shows no currency symbol and uses the currency's own marks (MoneyVisualTransformation.kt). Typing "1", "5" in
  Brazil really gives "1,00" and then "15,00".
- **"Promo nuevo cliente" is limited to new clients in code.** The idea saves the purpose marker (DiscountDraft.kt:99-102), and
  AutoRules applies the rule only when the client has a definite "no earlier paid sale" (AutoRules.kt:44-45, NewClientPromo.kt:29,
  CustomerFiadoActions.kt:245-264). So the brief's condition is met. **The screen, however, says the opposite** (VS16 MUST below).
- **Cargo nocturno.** It opens with "Preguntar al cobrar" ON (DiscountIdeas.kt:35, DiscountDraft.kt:97-98). After Guardar the screen
  stays on Cargos.

---

## V6 Cobrar la cita: 1 MUST, 1 nice (es, pt; MX too if recorded)

Builder choice, clock at 14:41: **right.** The kit's first booking is at 2:00 p. m. With the clock at 14:41 everything agrees:
- the end hint reads "2:00 p. m. → 2:40 p. m.", so the cut has just ended;
- "No asistió" is shown, which is correct once the booking's hour has passed (AppointmentDetailScreen.kt:149-151).

Moving the booking instead would have been worse.

1. **MUST, all languages. The voice describes the screen before the one on show, in lines 2 to 5.** Every tap fires 0.8 s into its
   line, and the "Toca …" sits at the end of each line. Timings below are es CO; pt BR is the same, with taps at 5.55, 9.30, 15.10 and
   19.20 s.

   | Line (es) | Line time | Tap | On screen for the rest of the line |
   |---|---|---|---|
   | 2 "Ves el servicio y quién lo hace. Toca Cobrar." | 4.4-7.8 s | Cobrar at 5.25 s | **Abrir caja** |
   | 3 "La caja está cerrada, y para recibir dinero hay que abrirla. Toca Abrir caja." | 8.1-13.7 s | Abrir caja at 8.95 s | **the appointment page**, for 4.7 s |
   | 4 "Vuelves a la cita. Toca Cobrar otra vez." | 14.1-17.1 s | Cobrar at 14.85 s | **the pay screen** |
   | 5 "La cita ya es la venta, con Ana. Toca Exacto." | 17.4-20.8 s | Exacto at 18.25 s | **¡Venta completada!** |

   Fix: in `demos/servicios/V6.html`, give these steps video-only waits, the same way VS2.html:309 and VS4.html:440 do:
   - line 737: `{beat:1, wait:1.5, hint:T1("ax_cobrar"), …`
   - line 738: `{beat:2, wait:3.0, hint:T1("register_open_confirm"), …`
   - line 739: `{beat:3, wait:0.8, hint:T1("ax_cobrar"), …`
   - line 740: `{beat:4, wait:1.5, hint:T1("cash_exact_short"), …`

   I tried this in a scratch copy. The four taps then land 2.3, 3.8, 1.6 and 2.3 s into their lines (es; pt is almost the same), which
   is on the "Toca …" words. No voice change is needed. After voicing, check that each wait stays at least 0.3 s shorter than the real
   clip.
2. nice, all. The receipt says "Fecha: 22/10/2026 14:43" while the status bar stays at 14:41 (V6.html:718 `time:"14:43"`). Use
   `"14:41"`.

Seen and true to the app (the builder already listed these):
- the appointment page says "Atendió: Carla Gómez" before the work is done;
- the Agenda row shows the raw "+573001234567" (ServicesTransactionsScreen.kt:271-273);
- the tiles show "Desde…" with the price cut off (ProductCard.kt), on the first screen for under 1 s.

Other trades: with `?biz=unas` there is no "Atendió" anywhere, because the business has no staff, but subtitle 6 still says "En el
recibo dice quién atendió". This only matters if an uñas video is ever made.

## V7 Servicios y productos en un solo ticket: 1 MUST, 2 nice

1. **MUST, all languages.** Line 2, "El botón ya dice el precio. Toca Agregar a la venta." (es 4.0-7.9 s): "Agregar" fires at 4.85 s.
   The sheet with "Agregar a la venta · $ 25.000" is gone before "ya dice el precio" ends, so the voice talks about a button that is no
   longer there. pt is the same, with the tap at 4.65 s. Fix: on `V7.html` line 631, change the step to
   `{beat:1, wait:1.2, hint:T(ADD, ADD, ADD), …`. This is the value VS2.html:309 uses on the same button. In the scratch copy the tap
   lands 2.0 s into the line (es and pt).
2. nice, all languages. From line 4 on, the till strip reads **"Venta actual · 2 servicios"** ("Venda atual · 2 serviços") for a
   haircut plus a shampoo. That is exactly the point the video makes, and the strip contradicts it.
   - It is true to the app: HomeScreen.kt:805-809 passes `services = isServices`, and CurrentSaleStrip.kt:46-48 uses the services
     plural for every line. The builder already listed this as "small".
   - My advice: ask the coder for this one-line fix **before recording V7**. Otherwise accept it.
3. nice, all languages. The Artículos breakdown (line 6) shows the included Lavado as "+ Lavado" (CheckoutBreakdownScreen.kt:618-619),
   which reads like a paid add-on. This is also true to the app and already listed. No demo change.

## V8 En el local, a domicilio, recogida: OK, 3 nice

Builder choice, pickup shown but not switched on: **honest and fine.** The third card, "Recogen y entregan", is real. Switching it on
would only add taps.

1. nice, all languages. The feature is titled "…, recogida", but the voice never names pickup. Name it once in line 2; the where page
   with all three cards is on screen 0.8 s into that line.
   - `features/V8.json` `2-donde`:
     - es: "Toca Dónde atiendes: en el local, a domicilio o recogen y entregan."
     - pt: "Toque em Onde você atende: no local, a domicílio ou retirada e entrega."
   - Subtitles at V8.html beat 2:
     - es: "Toca Dónde atiendes: local, domicilio o recogida"
     - pt: "Toque em Onde você atende: local, domicílio ou retirada"
   - New script lengths: es about 417 chars, pt about 450.
2. nice, all languages. In line 6, "Platata pregunta dónde se hace.", the tap on A domicilio fires 0.8 s into the line. So "Platata
   pregunta" plays over a chooser that is already answered. Fix: on `V8.html` line 696, change the step to
   `{beat:5, wait:1.2, hint:T1("where_mode_domicilio"), …`. The unanswered state, "Escoge uno para seguir." with the pay buttons dimmed,
   then shows while the question is described.
3. nice, all languages. The receipt time is 12:43 against a 12:41 status bar (V8.html:671 `time:"12:43"`). Use `"12:41"`.

Everything else on V8 is correct, including the "Más tarde" time card, the where page (strings, the locked "En el local", the caption),
the BR "15,00" and MX "50.00" fee box, and the totals: CO $ 35.000, BR R$ 55,00, MX $190.00.

## VS16 Descuentos y cargos: 1 MUST, 1 to 2 nice

Builder choice, set up but not used at the till: **true, and convincing enough** for a setup video. The night charge's one claim,
"Platata lo pregunta al cobrar", is backed by the form on screen ("Preguntar al cobrar" ON, "Le pregunta al cliente al cobrar; agrega
15% si acepta."). Showing the till would be a separate video.

1. **MUST, all languages. Line 3 says something the screen contradicts.**
   - The line is "Promo nuevo cliente: diez por ciento **en la primera visita**. Toca Usar." (es 5.9-10.9 s). From 6.7 s on, the form
     is on screen and says: "Solo si hay un cliente" (values-es:761) and "Descuenta 10% automáticamente **en cada venta** con los ítems
     que elijas. Solo si agregas un cliente a la venta." (values-es:811 + :819).
   - In pt the subtitle "…10% na primeira visita" sits directly over "Desconta 10% automaticamente em cada venda…" (values-pt-rBR:810).
   - After Guardar, the saved card says "Automático en 15 artículos". Nothing on screen says "first visit".
   - The code does limit the promo to first-time clients (see above), so the claim is true of the app, but a viewer reads the opposite.
     The builder flagged the missing form clause as "money" (VS16 notes §3).

   Fix, choose one:
   - **(A, preferred)** Hold VS16 until the coder adds the first-visit clause. That means a DiscountExplain clause when
     `purpose == NewClientPromo.PURPOSE` (DiscountFormScreen.kt:252-280, DiscountExplain.kt:35-54), and ideally the same words on the
     saved card's subtitle. Then draw the new clause in `VS16.html` `form()` and keep the voice.
   - **(B, to record now)** Use "Descuento por pago en efectivo" instead. Its form tells the truth on screen: "… Solo si pagan en
     efectivo." (DiscountIdeas.kt:31, DiscountExplain.kt:47-49; its "Solo si hay un cliente" switch is OFF). The page changes are:
     the `use-promo` tag moves to the cash idea card, `IDEA.promo` becomes `IDEA.cash` in `form()`/`picker()`/`host()`, and the saved
     card reads "− 3%".
     - Voice `3-promo`:
       - es: "Descuento por pago en efectivo: tres por ciento si pagan en efectivo. Toca Usar."
       - pt: "Desconto por pagamento em dinheiro: três por cento se pagarem em dinheiro. Toque em Usar."
     - Subtitles:
       - es: "Pago en efectivo: 3% si pagan en efectivo. Toca Usar"
       - pt: "Dinheiro: 3% se pagarem em dinheiro. Toque em Usar"
     - Note: the pt card title is the Title-Case "Desconto por Pagamento em Dinheiro" (already listed).

   Do not "fix" this by saying only "si agregas un cliente": that undersells the rule and suggests every client gets 10%.
2. nice, all languages. There are two silent gaps of about 2.7 s after the two "Toca Guardar." lines (es 16.6-19.4 s and 27.7-30.5 s).
   The 2200 ms "Guardado" toast holds the beat (VS16.html:751). Fix: either set `E.after(2200` to `E.after(1000`, or give the lines
   words that fill the gap:
   - `5-guardar`: es "Toca Guardar: queda en tu lista.", pt "Toque em Salvar: fica na sua lista."
   - `8-guardar`: es "Toca Guardar: queda en Cargos.", pt "Toque em Salvar: fica em Acréscimos."

   Both are true: tabAfterSave keeps the screen on that tab (DiscountsManagementScreen.kt:191, :429).
3. nice, pt only. `6-cargos` says "Agora **as taxas**: toque em Acréscimos.", but the tab reads "Acréscimos" (values-pt-rBR
   `disc_hub_tab_charges`). Change it to "Agora os acréscimos: toque em Acréscimos." and set subtitle beat 6 to "Agora os acréscimos:
   toque em Acréscimos".

---

## App bugs I noticed that the builders did not list (73c65f08)

- **small / money.** A booking freezes the new-client promo at the moment it is booked, not when it is paid.
  - A reopened ticket skips the AutoRules rebuild (PosViewModel.kt:1915) and brings back the discount saved with it as
    `pointsDiscountAmount = frozenDiscount` (SavedTicketActions.kt:859, :914).
  - So a first-time client who books two visits before paying the first gets 10% on both. Bookings are how services shops sell, so this
    is the normal path.
  - Fix: when a ticket carrying a NewClientPromo discount is charged, re-run `NewClientPromo.qualifies` for the client and drop the
    discount if the client now has a paid sale.
- **small, copy shown in the VS16 video.** Several idea and form texts read like machine translation:
  - values-es:822 "…y saludar caras frescas." and :834 "…ventanas de servicio nocturno." (pt: "recepcionar novos rostos", "janelas
    de serviço noturno").
  - values-es:813 `disc_what_happens_ask` "Le pregunta al cliente al cobrar; agrega 15% si acepta." describes a surcharge the customer
    can refuse. At the till it is your Sí/No. Suggested: "Platata te pregunta al cobrar; agrega 15% si dices que sí."
- **check (legal, not code).** The "Cargo por tarjeta de crédito" idea is offered in Mexico (CardCountryGate.kt:34 MX → STRIPE, used by
  DiscountsManagementScreen.kt:89). As far as I know, Mexico's consumer agency (PROFECO) does not allow a surcharge for paying by card.
  Confirm before Mexico ships with that idea. It does not affect these videos, which have no MX VS16 recording.
