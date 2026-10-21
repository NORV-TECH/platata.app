"""For each feature json (restaurant ones by default): page beats == voice steps, every step has es/pt/en (variants: es), chars per language.
    python3 demo-studio/tools/validate_scripts.py R4 RS3 ...   (no args = every R*/RS* json)"""
import asyncio, glob, json, os, sys
from playwright.async_api import async_playwright
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
VAR = {"MX":"es","PE":"es","CL":"es","EC":"es","AR":"es","PA":"es","US":"es","CA":"en","CO":"es","BR":"pt"}
async def main():
    ids = sys.argv[1:] or sorted(os.path.basename(p)[:-5] for p in glob.glob(os.path.join(ROOT,"features","R*.json")))
    async with async_playwright() as pw:
        b = await pw.chromium.launch()
        for fid in ids:
            d = json.load(open(os.path.join(ROOT,"features",fid+".json"), encoding="utf-8"))
            base = fid.split("-")[0]; cc = fid.split("-")[1] if "-" in fid else None
            langs = sorted({l for s in d["steps"] for l in s["voice"]})
            pages = glob.glob(os.path.join(ROOT,"demos","*",base+".html"))
            probs=[]
            if d.get("id")!=fid: probs.append("id mismatch")
            for lang in langs:
                country = cc or {"es":"CO","pt":"BR","en":"US"}[lang]
                pg = await b.new_page()
                await pg.goto("file://"+os.path.abspath(pages[0])+f"?mode=video&country={country}&lang={lang}")
                await pg.wait_for_timeout(200)
                st = await pg.evaluate("window.__demoState && window.__demoState()")
                await pg.close()
                n = st["beats"] if st else -1
                miss = [s["id"] for s in d["steps"] if lang not in s["voice"]]
                if n != len(d["steps"]): probs.append(f"{lang}/{country}: page beats {n} != voice steps {len(d['steps'])}")
                if miss: probs.append(f"{lang}: missing in {miss}")
            ch = {l: sum(len(s["voice"].get(l,"")) for s in d["steps"]) for l in langs}
            ids_ok = [s["id"] for s in d["steps"]] == sorted(s["id"] for s in d["steps"])
            if not ids_ok: probs.append("step ids don't sort in order")
            print(f"{fid:9} steps={len(d['steps'])} chars={ch} " + ("OK" if not probs else "PROBLEMS: "+"; ".join(probs)))
        await b.close()
asyncio.run(main())
