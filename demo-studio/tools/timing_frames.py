"""Check a video's timing BEFORE recording: play the page with the REAL voice clip lengths and save frames inside every line.

    python3 demo-studio/tools/timing_frames.py VS5 es:CO pt:BR
    python3 demo-studio/tools/timing_frames.py VS5-MX es:MX

For each voice line it saves frames at 15 %, 55 % and 95 % of the line to demo-studio/_check/timing-<feature>-<lang>/,
named <line>-<pct>.png, and prints the line's text with its start/end and the taps that land inside it.
Look at them: the screen must show what the line says while it is said.
"""
import asyncio
import glob
import json
import os
import subprocess
import sys

from playwright.async_api import async_playwright

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")


def duration(path):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path]))


async def run(feature, lang, country, pw):
    adir = os.path.join(ROOT, "audio", feature, lang)
    clips = sorted(f for f in os.listdir(adir) if f.endswith(".mp3"))
    durs = [duration(os.path.join(adir, c)) for c in clips]
    feat = json.load(open(os.path.join(ROOT, "features", feature + ".json"), encoding="utf-8"))
    texts = {s["id"]: s["voice"].get(lang, "") for s in feat["steps"]}
    base = feature.split("-")[0]
    page = glob.glob(os.path.join(ROOT, "demos", "*", base + ".html"))[0]
    url = "file://" + os.path.abspath(page) + f"?mode=video&lang={lang}&country={country}&dur=" + ",".join(f"{d:.3f}" for d in durs)
    out = os.path.join(ROOT, "_check", f"timing-{feature}-{lang}")
    os.makedirs(out, exist_ok=True)
    for f in glob.glob(os.path.join(out, "*.png")):
        os.remove(f)
    b = await pw.chromium.launch()
    pg = await b.new_page(viewport={"width": 540, "height": 960}, device_scale_factor=1)
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    await pg.goto(url)
    await pg.wait_for_timeout(300)
    # first pass: the timeline and when each tap happens
    taps, t, last_si = [], 0.0, 0
    while t < 400:
        await pg.evaluate(f"window.__frame({t})")
        st = await pg.evaluate("window.__demoState()")
        if st["si"] != last_si:
            taps.append((round(t, 1), st["si"]))
            last_si = st["si"]
        tl = await pg.evaluate("window.__timeline")
        if tl.get("total") and t >= tl["total"]:
            break
        t += 0.1
    starts = tl["starts"]
    # second pass: frames inside each line (a fresh page, the clock only goes forward)
    pg2 = await b.new_page(viewport={"width": 540, "height": 960}, device_scale_factor=1)
    await pg2.goto(url)
    await pg2.wait_for_timeout(300)
    marks = []
    for k, s in enumerate(starts):
        d = durs[k] if k < len(durs) else 4
        for pct in (15, 55, 95):
            marks.append((s + d * pct / 100, k, pct))
    marks.sort()
    for tt, k, pct in marks:
        await pg2.evaluate(f"window.__frame({tt})")
        await pg2.screenshot(path=os.path.join(out, f"{k + 1:02d}-{pct:02d}.png"))
    await b.close()
    print(f"== {feature} {lang}:{country}  total {tl['total']:.1f}s  {'ERRORS ' + ' | '.join(errs) if errs else ''}")
    for k, s in enumerate(starts):
        d = durs[k] if k < len(durs) else 0
        sid = clips[k][:-4] if k < len(clips) else "?"
        inside = [f"tap{si}@{tt - s:+.1f}s" for tt, si in taps if s - 0.05 <= tt < s + d + 0.4]
        print(f"  {k + 1}. {s:5.1f}-{s + d:5.1f}  {' '.join(inside) or '-':28s} {texts.get(sid, '')}")


async def main():
    feature = sys.argv[1]
    async with async_playwright() as pw:
        for pair in sys.argv[2:]:
            lang, country = pair.split(":")
            await run(feature, lang, country, pw)


asyncio.run(main())
