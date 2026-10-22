# REVIEW-R2-CHECK: re-recorded shop videos (21 Oct 2026, ~02:13)

I checked the videos made between 01:59 and 02:12 in `demo-studio/video/`. I edited no file except this one.
Method: I pulled frames with ffmpeg at the times the review names, and moved them where needed to the new line starts. I found the line starts with `silencedetect` on each video's audio track. I also checked the page sources and `features/*.json`, and confirmed the changed audio clips are newer than the json (TS11 pt 5-impuestos 01:58; TS14 4-permisos and 6-pin 01:11 in all 3 languages).

## Decode and start check
All 31 files decode with no errors (ffmpeg -f null): TS9..TS15, TS19, TS20 and TS23 in es/pt/en, plus TS20-US-es. Every video has voice from 0.6–0.7 s, so none starts with a silent still. The longest silent gaps further in are TS19 (~5 s at 9.5–14.7) and TS20 (~4.8 s at 35–40). Neither is a still: freezedetect finds at most 2.4 s of still picture inside them (tablet setup animation; transition card, then order).

## MUST items
| id | lang | item | result |
|---|---|---|---|
| TS9 | es/pt/en | strip badge colour (file only) | FIXED (TS9.html:284 #188448) |
| TS10 | es/pt/en | strip badge colour (file only) | FIXED (TS10.html:284 #188448) |
| TS11 | es | line 3 over the table, not Devoluciones; line 5 over Impuestos + "Vendido en fiado" | FIXED (7.0/9.2 s table; 11.0 s refunds page on "Cada línea…"; 13.0/15.3 s table with Impuestos + fiado) |
| TS11 | pt | same + new pt line 5 "O fiado não conta como recebido" | FIXED (line 3 over table; 13.0 s refunds; 15.5/16.8 s table with Vendido no fiado + Total recebido) |
| TS11 | en | same | FIXED (line 5 starts ~15.3 s, refunds page until ~16.0 s, then table with Taxes / Sold on a tab to the end of the line) |
| TS11 | es/pt/en | strip colour | FIXED (green) |
| TS12 | es/pt/en | strip colour | FIXED (green) |
| TS13 | es/pt/en | strip colour | FIXED (green) |
| TS14 | es/pt/en | "PIN shows once" voice + subtitle | FIXED (json 6-pin = "…luego lo ves en su ficha con Mostrar" in all 3, clips re-made; subtitle "Su PIN: anótalo y dáselo" / "O PIN: anote e entregue" / "Their PIN: write it down and hand it over") |
| TS14 | es/pt/en | stock permission → open and close register | FIXED ("Abrir y cerrar caja" / "Abrir e fechar caixa" / "Open and close register" chip ticked; voice and subtitle match) |
| TS14 | es/pt/en | strip colour | FIXED |
| TS15 | es/pt/en | strip colour | FIXED |
| TS19 | es/pt/en | tablet Catálogo grid overlap | FIXED (3 clean rows, every price whole, es 29.0 s, pt 26.5 s, en 27.0 s) |

## Nice items (checked as a bonus)
| id | item | result |
|---|---|---|
| TS9 | 4.3 s quiet on "Guardado" | FIXED (longest gap now 0.8 s) |
| TS10 | 4.6 s quiet on "Caja cerrada" | FIXED (longest gap now 1.7 s) |
| TS11–15 | strip subtitle cut with "…" | FIXED (wraps to "Reporta un problema / aquí") |
| TS14 | PIN dialog closes during the PIN line | FIXED (dialog stays through line 6) |
| TS20 | 4 s on "0 de 0 en línea" | FIXED (es 21 s shows "Fuera de tu tienda online") |
| TS23 | purchase rows lack "#131"/"#96" | FIXED (on screen at 8.5 s) |
| TS23 | name "Huella para borrar o quitar cargos" | FIXED ("Huella y deudas") |

## New, small (not in REVIEW-R2)
- TS23 es: the "No se puede eliminar" dialog closes about 3.4 s into the line "Si te debe, no se puede eliminar" (line 12.1–18.8 s). The last ~4.8 s of the line play over the plain edit form. Nice to have: in `demos/tienda/TS23.html`, delay the "Listo" step so the dialog stays until the line ends.
- App words still on screen (known app issues, not demo errors): TS14 dialog text "no se vuelve a mostrar completo" (#26); TS19 pt catalogue has lowercase "banana".

No MUST item is still wrong.
