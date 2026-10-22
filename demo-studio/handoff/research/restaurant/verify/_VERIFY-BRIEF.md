# Brief: check the coder's fixes against the real code (READ ONLY)

You are checking whether problems we reported in an Android POS app (Platata, Kotlin/Compose) were really fixed.
READ ONLY: never edit, build, run, install or commit anything in the app repo. Never git checkout/reset in it.

- App code: /home/claude/suma-plus-android, already checked out at commit 0eac2554 (branch sim/usa-canada, 20 Oct 2026).
  Source: app/src/main/java/com/example/ (package tata.fijando.su.plata). Strings: app/src/main/res/values*/strings.xml
  (values = English, values-es, values-pt-rBR, values-fr).
- Old code (when the problems were found): commit d1b7698d. Use `git -C /home/claude/suma-plus-android diff d1b7698d 0eac2554 -- <path>`
  and `git log d1b7698d..0eac2554 -- <path>` to see what changed. CLAUDE.md at the repo root has a paragraph per fix round
  (FIX-1, FIX-3, FIX-4, MENU-1, MENU-2, KDS-1, KDS-2, KITCHEN-3, WAITER-1, WAITER-2, TABLES-1, PAY-1, REGISTER-2, BACKOFFICE-1/2, DB-1/2, PRINT-1..4 ...).
- The problem list: /home/claude/outputs/CODER-PROMPTS-restaurant-research-19oct.md (8 prompts, numbered items).
- The coder's own status claim: /home/claude/research/restaurant/verify/_CODER-STATUS-REPORT.md. Do NOT trust it; use it only to know where to look.
- The original research per demo (screens, words, file:line at the old commit): /home/claude/research/restaurant/R*.md and S*.md.

For EVERY item of your prompts, read the actual current code and decide:
- FIXED (file:line)
- PARTLY (what is done, what is missing)
- NOT FIXED
- CAN'T TELL (truly needs a device; say why in one line)
Be strict: a string changed but the screen still shows the old one = not fixed. A fix only in English = PARTLY.
Check es, pt-BR and en wording where words changed (Colombian Spanish with "tú" for the till; no voseo; no English left in es/pt).

Also look for NEW problems the fixes introduced in those screens: wrong or confusing words, missing message after an action,
a button that does nothing, dead taps, English left in es/pt, money shown wrong, a flow that now breaks. Only real ones, with file:line.

Finally, list what changed that the DEMO must show differently (new screen, new button, renamed text), per demo id (R1..R11, S1..S24),
so the demo builder knows. Short lines.

Write your result to the file named in your task, in plain simple English:
1. Table per prompt: # | item (short) | verdict | evidence
2. "New problems" list (each: where, what, why it matters)
3. "Demo changes" list per demo id
Final reply: only the counts per prompt (fixed / partly / not fixed / can't tell) and the new problems, one line each.
