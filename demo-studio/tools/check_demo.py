"""Check a demo page: tap through every step in demo mode, play it in video mode, catch errors, save screenshots.

    python3 demo-studio/tools/check_demo.py restaurante/R4 CO:es BR:pt US:en
Writes demo-studio/_check/<page>-<country>-<lang>/demo-NN.png (one per step) and video-NN.png (a few frames).
Prints one line per run: OK or the problems (console errors, a step whose target is missing, steps != beats).
"""
import asyncio, os, sys
from playwright.async_api import async_playwright

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")

async def run(page_id, country, lang, pw):
    url = "file://" + os.path.abspath(os.path.join(ROOT, "demos", page_id + ".html"))
    out = os.path.join(ROOT, "_check", f"{page_id.replace('/','-')}-{country}-{lang}")
    os.makedirs(out, exist_ok=True)
    problems = []
    b = await pw.chromium.launch()
    pg = await b.new_page(viewport={"width": 430, "height": 900}, device_scale_factor=2)
    pg.on("console", lambda m: problems.append("console: " + m.text) if m.type == "error" else None)
    pg.on("pageerror", lambda e: problems.append("pageerror: " + str(e)))
    await pg.goto(f"{url}?country={country}&lang={lang}")
    await pg.wait_for_timeout(500)
    st = await pg.evaluate("window.__demoState && window.__demoState()")
    if not st:
        problems.append("engine did not start"); await b.close(); return problems
    nsteps = st["steps"]
    for k in range(nsteps + 2):
        st = await pg.evaluate("window.__demoState()")
        if st["ended"]:
            break
        # wait for timers to settle (typing, loading)
        for _ in range(60):
            st = await pg.evaluate("window.__demoState()")
            ring = await pg.evaluate("(()=>{const r=document.getElementById('ring');return r && !r.hidden})()")
            if st["pending"] == 0 and ring:
                break
            if st["ended"]:
                break
            await pg.wait_for_timeout(150)
        if st["ended"]:
            break
        await pg.screenshot(path=os.path.join(out, f"demo-{k:02d}.png"))
        box = await pg.evaluate("(()=>{const r=document.getElementById('ring');if(!r||r.hidden)return null;const b=r.getBoundingClientRect();return [b.left+b.width/2,b.top+b.height/2]})()")
        if not box:
            problems.append(f"step {st['si']+1}: no target on screen"); break
        await pg.mouse.click(box[0], box[1])
        await pg.wait_for_timeout(200)
    for _ in range(80):
        if (await pg.evaluate("window.__demoState()"))["ended"]:
            break
        await pg.wait_for_timeout(150)
    st = await pg.evaluate("window.__demoState()")
    if not st["ended"]:
        problems.append(f"demo never ended (stopped at step {st['si']+1} of {nsteps})")
    await pg.screenshot(path=os.path.join(out, "demo-end.png"))
    # video mode: 5 s per beat, frames at a few moments
    pv = await b.new_page(viewport={"width": 540, "height": 960}, device_scale_factor=1)
    pv.on("pageerror", lambda e: problems.append("video pageerror: " + str(e)))
    await pv.goto(f"{url}?mode=video&country={country}&lang={lang}")
    await pv.wait_for_timeout(400)
    t, shot = 0.0, 0
    while t < 400:
        await pv.evaluate(f"window.__frame({t})")
        if int(t * 10) % 40 == 0:
            await pv.screenshot(path=os.path.join(out, f"video-{shot:02d}.png")); shot += 1
        tl = await pv.evaluate("window.__timeline")
        if tl.get("total") and t >= tl["total"]:
            break
        t += 0.1
    tl = await pv.evaluate("window.__timeline")
    if not tl.get("done"):
        problems.append("video never ended")
    vs = await pv.evaluate("window.__demoState()")
    if vs["si"] < vs["steps"]:
        problems.append(f"video did only {vs['si']} of {vs['steps']} taps")
    await b.close()
    return problems

async def main():
    page_id = sys.argv[1]
    pairs = sys.argv[2:] or ["CO:es"]
    async with async_playwright() as pw:
        for pair in pairs:
            c, l = pair.split(":")
            p = await run(page_id, c, l, pw)
            print(page_id, c, l, "OK" if not p else "PROBLEMS: " + " | ".join(p[:8]))

asyncio.run(main())
