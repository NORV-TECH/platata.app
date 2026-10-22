# Handoff: Platata services demos and videos (22 Oct 2026, 11:00 AM PT)

You are taking over the marketing demo work for a while, from another Claude session (the "architect") that is out of tokens on Monti's other account. The architect stays in charge of the plan. You do the work, write down what you did, and report back through Monti. Monti carries every message by copy-paste.

## Who is who
- **Monti**: the owner. Plain, short English. Pacific time. He is busy: never ask him to test, never ask him to call or email a company. Ask only what truly needs his decision, a few questions at a time.
- **The coder / planner**: other agents working on the Android app. You never contact them directly. When you find app problems, write them in a file (see "Problems for the coder") and tell Monti it is ready.
- **You**: build the demos and the narrated how-to videos for the SERVICES business type (salons, vets, workshops, nail salons), then the Mexico card pieces below.

## Hard rules
1. **The app is read only.** Never edit, commit or push anything in the app repo. Read it to verify every screen, word and number.
2. **Website repo: only branch `demo-studio`, only the folder `demo-studio/`.** Never touch `main`, never merge, never deploy, never publish the live site. Commit small and often; add `[skip ci]` to every commit message except the one that should start the voice job.
3. **Show only what the app really does at the newest app commit.** Never invent a screen, button, word or price the code doesn't have. If the code can't do something, leave it out and note it.
4. The ElevenLabs key lives only in the GitHub secret. Never put a key in a file.
5. No French anywhere. Light theme only. No Visa/Mastercard logos, no real brands, no fake AI humans. The voice only explains the feature (no greetings, jokes, small talk or filler sounds).

## Repos and paths
| What | Where | The old briefs call it |
|---|---|---|
| Android app (read only) | `github.com/NORV-TECH/suma-plus-android`, branch `sim/usa-canada`, newest commit (73c65f08 or newer) | `/home/claude/app-head` or `/home/claude/suma-plus-android` |
| Demos, kit, tools, videos | `github.com/NORV-TECH/platata.app`, branch `demo-studio`, folder `demo-studio/` | `/home/claude/platata.app/demo-studio` |
| All research and briefs | `demo-studio/handoff/research/` (restaurant, retail, services) | `/home/claude/research/` |

Inside the app repo, read `CLAUDE.md` first (a long map of rules; read the parts about services, bookings, payments, connections). Strings: `app/src/main/res/values` (en), `values-es`, `values-pt-rBR`. Code: `app/src/main/java/com/example/...`.

Tools you need: git, python3, `pip install playwright` + Chromium (`python3 -m playwright install chromium`), ffmpeg/ffprobe.

## What is already done (look at it before you build)
- Restaurant: 35 demos and 108 videos (`demo-studio/demos/restaurante/`, `features/R*.json`, `RS*.json`).
- Retail: 34 demos and 108 videos (`demo-studio/demos/tienda/`, `features/T*.json`, `TS*.json`).
- Buildings (Colombia): `demo-studio/demos/edificios/`.
- The demo tree page: `demo-studio/index.html`, built by `demo-studio/tools/tree_restaurant.py`.
- Services research: `handoff/research/services/` = 33 spec files (V1..V9, S1..S24) + 3 independent reviews (REVIEW-1/2/3) + the 52-item fix list sent to the coder (`CODER-PROMPTS-SERVICES-21oct.md`). The coder says all 52 are done (see `handoff/PLANNER-TO-MARKETER-22oct.md`).

## Your work, in this order
1. **Services data kit.** `kit/services-data.js` + `kit/vkit.js`, copied in shape from `kit/shop-data.js` + `kit/skit.js`. Details: `handoff/research/services/_BUILD-BRIEF.md`.
2. **Services demos and videos.** V1..V8 and VS1..VS24 (not VS20), one page each in `demo-studio/demos/servicios/`, voice scripts in `features/`, videos CO:es and BR:pt (+ MX:es where Mexico differs). Follow `handoff/research/services/_BUILD-BRIEF.md` and `handoff/research/retail/_BUILD-BRIEF.md`. For each feature: re-verify the spec at the newest app commit, build, run the checker, look at the screenshots, record. Use helpers (subagents) in parallel if you have them: about 4 features per helper, each with its own files only.
3. **Independent check.** When a batch is built, have a fresh helper that did not build it check every page against the app code and the voice lines against the screens (like `handoff/research/retail/REVIEW-R*.md`). Fix and re-record what it finds.
4. **Demo tree.** Add a servicios section to `tools/tree_restaurant.py`, regenerate `index.html`, commit. Don't publish anything; the architect publishes later.
5. **On hold, do only when Monti says go:** V9 (clients book online) and VS20 (sell online). They wait for the coder's Lane D fix and Monti's server + website deploy.
6. **Mexico cards (after services, or earlier if Monti asks):**
   - Mexico now takes cards through Stripe (Tap to Pay on the phone). No Platata percentage decided yet: never mention a fee. Mexico pays for extra connections like Colombia (it is NOT like the US/Canada).
   - Make `-MX` versions of the card demos and videos for restaurant, retail and services (RS5, TS5, VS5) where the screens differ, after reading the code for Mexico.
   - A how-to video for Mexico: "the customer's phone or card can't tap" → the app's red screen, then "Cobrar con enlace" (a QR the customer pays on his own phone on Stripe's page; the sale closes by itself). Read MERGE-21 / LINK-1..3 in the app code.
   - Brazil: in every Brazil video that shows QR/Pix, say that the Pix QR already carries the sale total (the customer scans, the amount is filled in, nothing to type). This is how the app works (CLAUDE.md QR-2).
   - Store picture "we accept cards": a phone running Platata next to a generic card (no brand logos). Mexico: tap version. Colombia: the app will scan the card with the camera (Google OCR) but that is NOT built yet, so hold the Colombia version until it is in the code.
7. **US and Canada: on hold.** No US/Canada work at all until Monti says.

## Voices (already set up, see `demo-studio/voices.json`)
Spanish: Lina, Colombian, spoken with tú. Portuguese (Brazil): Victor, você. English: Daniel (on hold). Calm settings (stability 0.5). The voice job runs on GitHub when `features/*.json` or `voice-ready.txt` changes on `demo-studio` (`.github/workflows/make-voice.yml`). `tools/voice_then_record.sh` pushes, waits for the "narration" commit, then records.

## Problems for the coder
While building you will find app bugs. Write them in `handoff/research/services/CODER-PROMPTS-SERVICES-ROUND2.md`, same style as `CODER-PROMPTS-SERVICES-21oct.md`: one line each, file:line, one-line fix, "blocks a demo / money / small", inside one code block that ends with "Edit only. Do not build, run, install or verify." Questions only Monti can answer go below the block. Tell Monti when it's ready; he passes it on.

## Reporting back
Keep `handoff/REPORT.md` up to date and commit it: what is built and recorded (feature × language), what is held and why, problems found, questions for Monti, the app commit you checked. When Monti asks for a status, give him that file. Keep chat replies to Monti short.

## When to stop and ask
- A screen or flow the code doesn't support and the demo needs.
- Anything that would need the app changed, a deploy, money, or the live site.
- Two sources disagree (spec vs code: the code wins; Monti vs planner: ask Monti).
