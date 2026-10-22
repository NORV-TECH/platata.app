# REVIEW-4: restaurant demos RS11 RS12 RS13 RS14 RS15 RS16 RS17 RS19 RS20 RS21 RS22 RS23 RS24 (+ US-es RS11 RS19 RS20)

Reviewer: independent pass, 20 Oct 2026. App checked at /home/claude/app-head 6736ddfb.
Method: I worked out each video's beat timeline from its own audio clips (same `__timeline` the recorder uses). For every
es video I pulled a frame at the start and at the end of every voice line, plus one in each gap longer than 1.5 s. For pt,
en and US-es I pulled one frame per line (at 70% of the line), with extra frames where something looked wrong.
I checked the strings against values / values-es / values-pt-rBR and spot-checked the claims in the code. I edited no file.

All 42 videos open and decode with no error in ffprobe or ffmpeg: 1080x1920, video and audio, 26 to 49 s.

## Summary
| Feature | es (CO) | pt (BR) | en (US) / US-es |
|---|---|---|---|
| RS11 Reportes | 1 MUST | 1 MUST (same) | 1 MUST (same, en + US-es) |
| RS12 Contador | OK | OK | OK |
| RS13 Clientes | OK | OK | OK |
| RS14 Equipo | 1 MUST, 1 nice | 1 MUST, 1 nice | 1 MUST, 1 nice |
| RS15 Pago empleados | 1 nice | OK | OK |
| RS16 Descuentos | OK | OK | OK |
| RS17 Impuestos | OK | OK | 1 nice |
| RS19 Conexiones | OK | OK | 1 MUST (en + US-es) |
| RS20 Vender en línea | 1 nice | 1 nice | 1 nice (en + US-es) |
| RS21 Sin internet | 1 nice | 1 nice | OK |
| RS22 Respaldo | OK (2 app issues on screen) | OK | OK |
| RS23 Seguridad | OK | OK | OK |
| RS24 Sucursales | OK | OK | OK |

Claims verified in the code:
- Net sales is before tax, tips and charges; the "+" on the charge, tax and tip lines comes from ReportsScreen.kt:295-319. The numbers add up in all 3 countries (CO 746.297-2.963-4.209=739.125; +64.725+59.130=862.980 = how you got paid). The comparison words (vs ayer / vs período anterior) match comparisonSuffix.
- The accountant rows and their order match EmployeePayActions.kt:358-385.
- The pay ask comes on the 5th, then the 10th, 20th and 25th, and switches off after the 25th: employeePayAskSlot and employeePayAskDecision.
- The previous month is asked even when tracking started that month: askedMonthBeforeTrackingStarted.
- Backup: "every 6 hours, 30 days, newest kept" is in backup_drive_note. Dates come from BackupDateFormat MEDIUM/SHORT.
- Online store unlock: conn_store_dlg_body_add and conn_dlg_store say the same as the demo.
- The seeded service charge is asksAtCheckout=true and isActive=false (SeedStore.kt:216-223), at 10% in CO and 15% elsewhere.
- protectDeleteData really guards items, categories, modifiers and options (ItemsScreen, CategoryHubScreen, OptionsManagementScreen).
- The pay-screen Exact button shows "Exato · R$" only when card is off (CheckoutPayBlock.kt:333-336), as BR shows it.
- The businesses list "1 de 10 en total" counts groups (ContextSwitcher.kt:233), so it is right after a branch is created.
- The branch copy options and "Ahora en %s" are real strings.

---

## RS11 (Reportes): es, pt, en, US-es
1. **MUST, all 4 videos.** Line 3 ("Ventas brutas, menos descuentos y devoluciones: tus ventas netas…", es 7.4–13.2 s, pt 9.4–16.2, en 9.4–16.2, US-es 8.0–14.8) plays over the **Devoluciones (1) detail page**, not over the table it describes. The tap on "Devoluciones" is in beat 2, so the page opens 0.8 s into the line. Line 4 ("Cada línea se abre…") then plays while the screen goes back to the table.
   Fix in `demos/restaurante/RS11.html`:
   - line 634: change `beat:2` to `beat:3`. The refunds line now opens on "Cada línea se abre".
   - line 635 (the back arrow): change `beat:3` to `beat:4`. Line 5 then goes back and opens the service/tip line (line 636, already beat 4).
   - Beat 2 then explains the table with no tap, which is allowed.
   - Re-render es, pt, en and US-es.

## RS12 (Enviar al contador): OK
- es, pt and en are OK. The numbers add up and the strings match.

## RS13 (Clientes): OK
- es, pt and en are OK. The "+55 319 123 456 24" grouping in BR is exactly what formatWhatsappForReading prints for 11 digits. That is an app look, not a demo error.

## RS14 (Equipo y claves): es, pt, en
1. **MUST, all 3.** The voice says "El PIN aparece una sola vez" / "O PIN aparece uma única vez" / "The PIN shows just once", and the subtitle says "El PIN se muestra una vez". This is **false**: the employee form always has the PIN row with **Mostrar** (EmployeeCodeRow, TeamManagementScreen.kt:1422 and 1564-1627). It is even visible on screen in this same video, under the form, from 10 s to 20 s. A viewer sees "Mostrar" and then hears "solo una vez".
   Fix:
   - In `features/RS14.json`, step `6-pin`:
     - es "Aquí está su PIN. Anótalo y dáselo; luego lo ves en su ficha con Mostrar."
     - pt "Aqui está o PIN. Anote e entregue; depois você o vê na ficha, em Mostrar."
     - en "Here's their PIN. Write it down and hand it over; you can see it later with Show."
   - In `RS14.html` lines 347-349, beat 6:
     - es "Su PIN: anótalo y dáselo"
     - pt "O PIN: anote e entregue"
     - en "Their PIN: write it down and hand it over"
   - The app's own dialog text has the same error: see App issue A1.
2. Nice, all 3. The "PIN nuevo" dialog closes 0.8 s into the line that talks about it (es 23.6 s, pt 26.5 s), so the line plays over the plain list. Fix: delete the OK step at `RS14.html` line 364, so beat 6 only explains the dialog and the end card follows.

## RS15 (Pago a empleados): es (pt and en OK)
1. Nice, es 19.7–25.5 s. There is 5.8 s with no voice and no subtitle: the team list with the amounts, then the "5 de noviembre" time card. pt and en have the same gap at about 5 s. Fix: give the "5 de noviembre" card its own short line, or start the "6-ask" line on the time card. To do that, move the tap that shows the card into beat 6 in `RS15.html`.

## RS16 (Descuentos y cargos): OK
- es, pt and en are OK.

## RS17 (Impuestos): en
1. Nice, en 11.8–15.4 s. The subtitle "Already in your prices? Tap Save" sounds like "yes", but the US screen and voice say "No, add it on top". Fix in `RS17.html` line 340, en beat 5: "It's added on top. Tap Save". en is only US and CA, and both add tax on top.

## RS19 (Otro celular o tableta): en and US-es
1. **MUST, `RS19-en.mp4` and `RS19-US-es.mp4`.** There are 4.9 s of dead air at the start (4.6–9.5 s): a still Connections screen with no voice, no subtitle and no tap. Cause: `RS19.html` line 559, `if(FREE) E.after(5200,()=>scrollTo(st,'.scard'))`. The pending 5.2 s timer holds beat 0 open. The online-store card is already on screen, so the scroll does nothing. Fix: delete that `if(FREE) E.after(5200,…)`, or make it 300 ms. Then re-render en (US) and es (US).
- es and pt are OK. On the Add page, circle 2 says "Libre" while the main page shows "Caja principal" in it. The app does the same: see App issue A2.

## RS20 (Vender en línea): es, pt, en, US-es
1. Nice, all 4. The heads-up notification says "Platata · 1:01 p. m." (pt "13:01"), but the status bar says 12:41 the whole time. The order was placed at 12:41; the store page's "listo a las 13:01" is right because it adds the 20 min. Fix in `RS20.html` line 616: change `nowTime(13,1)` to `nowTime(12,41)`.
- The rest is OK: the lock dialog, the US/CA skip, "Paga al recoger" and the strings.

## RS21 (Sin internet): es and pt
1. Nice, es 15.9–20.2 s (pt and en about 4 s). Silence over the hop card and the first waiter-phone frame. The hop card has its own text, so this is acceptable. Shorten it if possible.
2. Nice, pt 26.2–30.0 s. On "A internet volta e elas vão sozinhas", the "Pendente de envio" strip stays until the very last frame of the line (it clears at about 30.0 s; en at about 29.6 s). Fix: clear the strip on the Abiertas tap, or about 0.5 s after it, in the beat-5 step of `RS21.html`.

## RS22 (Copia en Google Drive): OK
- es, pt and en are OK and faithful to the app. Two app texts show on screen and do not look good in a marketing video: see App issues A3 and A4.

## RS23 (Huella): OK
- es, pt and en are OK. The "Mostrar" PIN prompt still reads "¿Cambiar la configuración de seguridad?". This is already in the build notes as an app issue, so I do not repeat it.

## RS24 (Sucursales): OK
- es, pt and en are OK. The "1 de 10 en total" count is correct (it counts groups), and "1 sucursal de 5" is right.

---

## New app issues found while reviewing (not in verify/, _FLAGS-ALREADY-SENT.md or the build notes)
- **A1 (small, causes RS14's MUST).** `team_new_pin_notice` says the PIN "no se vuelve a mostrar completo" / "will not be shown in full again", but the employee form shows it again with Mostrar (TeamManagementScreen.kt:349 against EmployeeCodeRow at 1422 and 1624). Fix: es "PIN de %1$s: %2$s. Anótalo y dáselo. Lo ves de nuevo en su ficha con Mostrar." (and the same in en and pt).
- **A2 (small).** The Add connections page builds its circles from `ConnectionsOverview.build(false, pending, null, emptyMap(), 0)` (AddConnectionsScreen.kt:252). So included slot 2 reads "Libre" even when a register is in it, while the page before it says "Caja principal". Fix: pass the same device infos the Connections page uses.
- **A3 (small, visible in RS22).** `backup_drive_note` prints a literal "Drive/Platata/[Negocio]" ("[Business]", "[Negócio]"). Fix: `%1$s` with the business name.
- **A4 (small, visible in RS22).** `restore_confirm_body` says "con la instantánea del %s", and RestoreLabel.display passes "<negocio> — <fecha>". The result reads "la instantánea del La Fonda de Marta — 20/10/2026…". Fix: es "…con el respaldo «%s»…", pt "…pelo backup «%s»…", en "…with the backup “%s”…".
