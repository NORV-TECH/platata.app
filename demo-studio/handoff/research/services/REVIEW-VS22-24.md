# REVIEW-VS22-24: services demos VS22 (Drive backup), VS23 (fingerprint before deleting), VS24 (businesses and branches)

Reviewer: independent pass, 22 Oct 2026. App checked READ ONLY at /home/user/suma-plus-android, sim/usa-canada 73c65f08.
The only file I edited is this one.

Method:
- Every string in each page's `STR` block (93 + 117 + 104 keys) compared by script with values / values-es / values-pt-rBR, plurals too.
  All match the app.
- The composables the page comments cite opened and read: BackupSettingsScreen, WarningBarRows/WarningBars/BackupState,
  BackupActions/DailyBackupWorker/DriveBackupHelper, ServiceEditScreen/PricePicker/BridgeScreen (WhatComesSection), SecurityScreen,
  SettingsHubScreen/SettingsHubRules, PlatataApp bottom bar + FlagGate, HomeScreen (warning bars, footer, panel, edit bar),
  ContextSwitcher (MyBusinessesScreen), BranchSetupScreen/BranchNameRule, WorkspaceSwitchActions/BranchSnapshotStore,
  ConnectNudge*, ReportLevels/ReportOverlay (support strip).
- `tools/check_demo.py servicios/<ID> CO:es BR:pt MX:es` for all three: **all 9 runs OK**. I looked at every demo screenshot (CO, BR, MX).
- Video mode: frames at 0.3 / 1.5 / 3.0 / 4.6 s into every beat (5 s beats) for CO:es and BR:pt, plus MX:es, and `&biz=` with the
  other three businesses (VS22 taller-motos/unas/peluqueria, VS23 taller-motos/veterinaria/unas, VS24 unas/taller-motos, BR veterinaria).
  No console or page error anywhere; every `?biz=` run shows the right trade, icons and "Crear orden" for the workshop.
- Beats == json steps (6, 7, 8). Scripts 433/481, 389/442, 489/492 chars (es/pt). Every subtitle is 60 chars or fewer. tú / você,
  no greetings, last lines "Así … con Platata." / "Assim … com o Platata.". No Pix, no cards, no fees, no US content, no French,
  light theme only.
- **Mexico (no -MX scripts): confirmed.** The app has one `values-es` (no es-rMX), and none of these flows has a Mexico branch
  (grep of "MX" in the code: Stripe/address/tax presets only). On MX the pages differ only in money ($140.00, "Cobrar $0.00") and,
  in VS23, the typed price box instead of Colombia's pills. No voice line says a price or names the pills, so no MX video is needed.

## Summary

| Feature | es (CO) | pt (BR) | MX es |
|---|---|---|---|
| VS22 Respaldo en Google Drive | 2 MUST + S1, 2 nice | 2 MUST + S1, 2 nice | no video needed (same words); page OK |
| VS23 Huella antes de borrar | 3 MUST + S1, 3 nice | 3 MUST + S1, 3 nice | no video needed; page OK |
| VS24 Varios negocios y sucursales | 1 MUST + S1, 3 nice | 1 MUST + S1, 3 nice | no video needed; page OK |

S1 = the same app-side MUST on all three (the till tiles cut the prices). The builder already found it.

Verified true (claims the voice and screens make):
- Backup bar: one bar at a time, backup wins over the card-device strip (sync/WarningBars.kt:13-19). Shown on the owner device whenever
  Drive is not connected (sync/BackupState.kt:50-56). Its look matches (WarningBarRows.kt:31-58: #FEF3C7, #856404, padding 16/12,
  icon 18). Tapping it opens Backup (HomeScreen.kt:582-586).
- Services risk text `backup_risk_desc_services` (BackupSettingsScreen.kt:356-361), Drive note with the real folder name (:471),
  "Sin respaldo todavía…" right after connecting (the 6-hour job starts 90 s later, BackupActions.kt:262-275), "Respaldando…"
  with the spinner inside the button (:432-442), "Último respaldo: Hace menos de 1 hora" (:770-779), and the restore row
  "<negocio> — <fecha>" + "Restaurar" (:533-553, RestoreWelcomeStep.kt:52-79). The voice's "cada 6 horas, si algo cambió" and "30 días"
  are true (DailyBackupWorker.kt:10-13, DriveBackupHelper.kt:293-319).
- Service delete asks for the phone lock when Security and "Eliminar datos" are on (ServiceEditScreen.kt:149, 425-436). The prompt
  allows the device PIN, so "o el bloqueo del teléfono" is right (BiometricHelper.kt:20-23). Security is seeded ON (SeedStore.kt:139).
  The flag asks "¿Abrir tu negocio?" and then gives a 10-minute session (PlatataApp.kt:499-501, 565-583). Hub subtitle "Pide huella
  antes de borrar" when "Quitar cargos" is off (SettingsHubScreen.kt:262). Security page order, switch defaults and lock 5 min
  (SecurityScreen.kt, SecurityConfig.kt:12-18, OwnerSettings.kt:35).
- No tax checkbox in the service editor: no shop is seeded with a tax (ShopSwitches.kt:23, TaxDiningActions.kt:27 is the only insert).
- Branch: name opens as "<name>-", Create is off until something is added (BranchNameRule.kt), "Siempre" catalogue, three switches,
  the note naming the appointments, landing on the new branch's Home with the panel closed (OnboardingNavGraph.kt:318-322). Trades
  and "Dónde atiendes" are copied, transactions purged (WorkspaceSwitchActions.kt:434-499), so "Caja cerrada · Abrir" is right. No
  switch warning, because only tablets and kitchen screens trigger it (ContextSwitcher.kt:115-123). The toast is `workspace_now_in`
  (HomeScreen.kt:1898).

---

## S1 (all three, es + pt): the till tiles cut the prices. MUST, app-side
- Where: VS22 beat 0; VS23 beats 0-3; VS24 beats 4-6. CO shows "Desde…", "$ 25.0…", "$ 120.…"; BR shows "R$ 19…", "A parti…".
- Evidence: ProductLibraryView.kt:182 `GridCells.Adaptive(minSize = 120.dp)` gives 3 columns on the 412 dp demo phone. In
  ProductCard.kt:309-330 the minutes take their width first and ShrinkToFitText (ShrinkToFitText.kt:29, 43) stops at 12 sp, then ends
  in "…". The page copies the app faithfully, so this is not the builder's error. It is still a broken look in an ad.
- Fix: in the app, ProductCard.kt:309-330 (minutes on their own line under the price, as the builder proposed). Record these three
  videos only after that fix. A phone of 404 dp or less gets 2 columns and fits most Colombian prices, but BR "A partir de R$ …"
  still gets cut, so the app fix is the real fix.

## VS22 (Respaldo en Google Drive)
1. **MUST, es + pt, beat 0.** The only tap of beat 0 lands 0.8 s into line 1 (VS22.html:461). The Home with the yellow bar is gone
   before the voice says "la barra amarilla te avisa" / "a barra amarela avisa"; for the rest of the line (about 4 s) the Backup
   page is on screen. Frames: b0 at 1.5 s already shows "Respaldo".
   Fix VS22.html:461: `{beat:0, wait:3.2, hint:…}`. That is a video-only delay, so the tap lands on "Toca Conectar" at the end of the
   line.
2. **MUST, es + pt, beats 3-4.** Once Drive is connected, the app draws the invoice-photo card between the Drive card and
   "Restaurar desde respaldo" (BackupSettingsScreen.kt:482-484, `driveEmail != null && !isRestoreMode && invoicePhotoBackup != null`).
   The vet has no invoice photos (the panel says "Escanea tu primera factura"), so the state is Safe(0, 0)
   (work/SupplierPhotoBackup.kt:96-107). The card reads "Fotos de facturas · Todas las 0 respaldadas · ✓ A salvo · 0 B en este teléfono"
   (pt "Fotos de notas · Todas as 0 salvas · Seguro · 0 B neste telefone"). The page leaves it out (builder's note §2), so the screen is
   cleaner than the app.
   Fix, either: (a) the app hides the block with no photos (BackupSettingsScreen.kt:482 add `&& invoicePhotoBackup.localCount > 0`,
   builder's problem 2), then re-check; or (b) VS22.html:434, after the Drive card when `on`, draw a SumaCard (elevation 2, gap 8):
   `invoice_backup_section` (labelMedium bold, onSurfaceVariant), a row with `invoice_backup_all_safe`(0) (titleMedium bold) and a pill
   ✓ `invoice_backup_tag_safe` (SumaStatusSuccessBg/Text, r4), then `invoice_backup_size_on_disk`("0 B") (bodySmall). Prefer (a).
3. nice, es + pt, beat 4. "Restaurar" is tapped 0.8 s in, so "¿Restaurar este respaldo?" covers the card while the voice still says
   "Se guardan los últimos 30 días", and "toca Restaurar" comes after the tap. Fix VS22.html:466 `{beat:4, wait:2.6, …}`.
4. nice, es + pt (also VS23 hub "Mi cuenta"). OWNER_EMAIL_OF makes "laura@gmail.com" / "carolina@gmail.com". Addresses like these
   almost surely belong to real people. Fix (shared helper, VS22.html:231 and its copies): an obviously invented address, e.g.
   `laura.patitas.demo@gmail.com` (first name + business + "demo").

## VS23 (Huella antes de borrar)
1. **MUST, es + pt, line 1 (beat 0).** "Nadie borra nada sin tu huella." / "Ninguém apaga nada sem a sua digital." is false at
   73c65f08. With Security on, deleting a tax (TaxesManagementScreen.kt:449-455, `viewModel.deleteTaxRate` straight from the dialog)
   or a discount/combo (DiscountsManagementScreen.kt:416) asks for nothing, and so does cancelling an appointment
   (AppointmentActions.kt:83). The owner can also switch "Eliminar datos" off. Fix `features/VS23.json` step `1-editar`:
   es "Borrar un servicio pide tu huella. Toca Editar y elígelo." pt "Excluir um serviço pede a sua digital. Toque em Editar e
   escolha o serviço." Re-voice.
2. **MUST, es + pt, beat 0 (edit mode, about 2 s).** The page keeps "Teclado / Agendar / Cobrar $ 0" under the grid while
   "Editando · Mis servicios › · Listo" is on. The app hides the whole footer in edit mode: HomeScreen.kt:698-699
   `// C-23 — Charge/Book are hidden while the owner is editing items on the grid.`
   `if (uiState.businessTypeLoaded && !isRetail && !itemEditMode) {`. Fix VS23.html:310:
   `if(!o.editing) h += \`<div class="sfoot">…\`;`. The grid then runs down to the bar. Do the same in the shared copies in
   VS22.html:286 and VS24.html:317 for consistency; edit mode never shows there.
3. **MUST, es + pt, beat 2.** Line 3 ("Platata pide tu huella o el bloqueo del teléfono antes de borrarlo") describes the prompt, but
   the sensor is tapped 0.8 s into the line (VS23.html:514), so the prompt is gone 1.3 s in. The rest of the line plays over the
   till ("Servicios · 10"). The prompt was mostly on screen during line 2. Fix VS23.html:514 `{beat:2, wait:2.8, …}`, so the prompt
   stays through the line and the tile-less till comes at its end.
4. nice, es + pt, beat 0. Both taps (Editar at 0.8 s, the service at about 2.8 s) come before the voice says them, after the opening
   sentence. Fix VS23.html:509-510: `wait:1.6` on both beat-0 steps (after the new shorter line 1, "toca Editar" comes at about 2.4 s).
5. nice, es + pt, beats 0-1. The service editor is route `item_edit`, which is LEVEL_2_PLUS (ReportLevels.kt:42), so the app draws the
   Soporte | Mis reportes strip at the bottom (hidden only while a dialog or the system prompt has focus, ReportOverlay.kt:114). The page
   draws it on Backup, Settings and Security, but not here. Fix VS23.html:477 `return h + (st.dlg || st.bio ? "" : strip());`. scrollFor
   already re-measures `.epage`.
6. nice: the e-mail in Settings "Mi cuenta" (see VS22 #4).

## VS24 (Varios negocios y sucursales)
1. **MUST, es + pt, beat 5 (the new branch's panel).** A brand-new branch has no connected device. The branch path never copies
   team_pos_configs (BranchSnapshotStore.kt:482 only when `syncTeamPosConfigs`), and employees stay off. It also has no snooze, because
   `connect_nudge_snooze_until` is per business app_metadata (ConnectNudgeActions.kt:19-21, 34-41; device count :62-64). So `ConnectNudgeRule.shouldShow`
   is true (ConnectNudgeRule.kt:15-16), and the panel's first item is the ConnectNudgeCard (HomeScreen.kt:1524-1529, ConnectNudge.kt:62-95).
   The page's branch panel starts with "Caja cerrada". On Home the strip correctly stays hidden behind "Caja cerrada"
   (sync/TopStrips.kt:12-15). Peluquería Carolina's own panel is right without it (2 staff phones).
   Fix VS24.html:493: pass `{nudge:true}` and, in panel(), before the register row draw a card (margin 24 h / 8 v, r12,
   primaryContainer = PlatataSurfaceVariant #F2F2F7): `nudge_connect_title` "Conecta tu primera caja" / "Conecte seu primeiro caixa"
   (titleSmall bold), `nudge_connect_body_paid` "Está incluida en tu cuenta. Vende desde dos lugares a la vez." / "Está incluído na sua
   conta. Venda de dois lugares ao mesmo tempo." (bodyMedium), then a row with the dark "Conectar" button (weight 1) and the text button
   "Ahora no" / "Agora não".
2. nice, es + pt, beat 5. The subtitle "¿Otro negocio? Pásate en dos toques" / "Troque em dois toques" plays over three taps (Mi negocio,
   the name, the business). Line 6 never says "Mi negocio", which is tapped first. Fix: subtitle es "¿Otro negocio? Mi negocio, el nombre
   y elígelo" / pt "Outro negócio? Meu negócio, o nome e escolha". Voice `6-otro` es "Para ir a tu otro negocio, toca Mi negocio, el nombre,
   y elígelo." / pt "Para ir ao seu outro negócio, toque em Meu negócio, no nome e escolha."
3. nice, es + pt, beat 0. The name is tapped 0.8 s in, before "Toca el nombre". Fix VS24.html:513 `{beat:0, wait:1.8, …}`.
4. nice (app-side), es + pt, beats 1 and 5. The list says "Copia este menú · nómbrala en un paso" / "Copia este cardápio…" and
   "…su propio menú y equipo" to a hair salon (ContextSwitcher.kt:101, 357, 389). The page is faithful, and the builder listed the fix.
   Better recorded after the app gives services their own words.

---

## App bugs the builder did not list (73c65f08)
1. **Delete does nothing on a phone without a screen lock (small to medium).** Security is seeded ON (SeedStore.kt:139, 250).
   ServiceEditScreen.kt:425-436 and ItemsScreen.kt:400-408 call `showBiometricPrompt` directly, without
   `DeviceLockGate.forOwnAction`, and with no `onFail`. On a phone with no lock the prompt errors (no credential) and the service/item
   is silently not deleted. The editor stays open and nothing is said. Fix: route both through `DeviceLockGate.forOwnAction(flagCanAuthenticate(activity))`
   like HomeScreen.kt:545-555 (ASK → prompt; GO → delete).
2. **"Pide huella antes de borrar" promises more than the gate covers (small).** settings_hub_security_on_delete
   (SettingsHubScreen.kt:262) and security_status_on_desc say deletes are protected. Deleting a tax (TaxesManagementScreen.kt:449-455)
   or a discount/combo (DiscountsManagementScreen.kt:416) never asks, even with "Eliminar datos" on. Fix: gate them on
   `protectDeleteData` like CategoryHubScreen/OptionsManagementScreen, or narrow the wording.
3. **A new branch nags "Conecta tu primera caja" right away (small, product call).** It shows even when the owner's main business
   already runs 2 staff phones. Count and snooze are per business (ConnectNudgeActions.kt:34-41, 62-64). Fix: count the parent's
   devices for a fresh branch (`branch_of`), or start it snoozed.
