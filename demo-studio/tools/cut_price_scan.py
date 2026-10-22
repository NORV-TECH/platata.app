"""Cut-price scan: play every recorded services video's timeline (demo-studio/video/V*.mp4, VS*.mp4) with the real
voice clip lengths and report the times where a CUT price is on screen: a price text drawn with a literal "…", or a
price element whose CSS clips it (scrollWidth > clientWidth). Run after recording; a CUT line means the video shows
the app's cut tile prices (coder round 2, item 2) and must not be kept.

    python3 demo-studio/tools/cut_price_scan.py            # every services video
    python3 demo-studio/tools/cut_price_scan.py V3 VS21    # only these features
"""
import asyncio, glob, os, re, subprocess, sys
from playwright.async_api import async_playwright
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
def dur(p): return float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",p]))
JS = r"""(()=>{const out=[];const app=document.getElementById('app');
const isPrice=s=>/^(Desde|Desd|Des|De |A partir|A parti|A part|A p|\$|R\$|S\/|US\$|MX\$|\d)/.test(s)&&!/^(Procesando|Enviando|Cargando|Buscando)/.test(s);
const w=document.createTreeWalker(app,NodeFilter.SHOW_TEXT);let n;
while((n=w.nextNode())){const t=n.textContent.trim();if(t.length>1&&t.length<=18&&t.endsWith('\u2026')&&isPrice(t.slice(0,-1).trim())){
const r=n.parentElement.getBoundingClientRect();if(r.width>0&&r.height>0)out.push('lit:'+t);}}
for(const el of app.querySelectorAll('*')){if(el.children.length)continue;const t=(el.textContent||'').trim();if(!t||t.length>24||!isPrice(t))continue;
const cs=getComputedStyle(el);const r=el.getBoundingClientRect();if(r.width<=0||r.height<=0)continue;
if((cs.textOverflow==='ellipsis'||cs.overflow==='hidden'||cs.overflowX==='hidden')&&el.scrollWidth>el.clientWidth+1)out.push('css:'+t);
else{let p=el.parentElement,d=0;while(p&&d<3){const ps=getComputedStyle(p);if((ps.textOverflow==='ellipsis'||ps.overflow==='hidden')&&p.scrollWidth>p.clientWidth+1&&p.children.length<=2){out.push('cssp:'+t);break;}p=p.parentElement;d++;}}}
return out;})()"""
async def scan(vid, pw):
    m = re.match(r"(.+)-(es|pt)\.mp4$", os.path.basename(vid)); feat, lang = m.group(1), m.group(2)
    country = feat.split("-")[1] if "-" in feat else ("BR" if lang=="pt" else "CO")
    adir = os.path.join(ROOT,"audio",feat,lang); clips = sorted(f for f in os.listdir(adir) if f.endswith(".mp3"))
    durs = [dur(os.path.join(adir,c)) for c in clips]
    page = os.path.abspath(glob.glob(os.path.join(ROOT,"demos","servicios",feat.split("-")[0]+".html"))[0])
    url = "file://"+page+f"?mode=video&lang={lang}&country={country}&dur="+",".join(f"{d:.3f}" for d in durs)
    b = await pw.chromium.launch(); pg = await b.new_page(viewport={"width":540,"height":960})
    await pg.goto(url); await pg.wait_for_timeout(300)
    t, hits = 0.0, []
    while t < 300:
        await pg.evaluate(f"window.__frame({t})")
        cut = await pg.evaluate(JS)
        if cut: hits.append((round(t,1), cut[:3]))
        tl = await pg.evaluate("window.__timeline")
        if tl.get("total") and t >= tl["total"]: break
        t += 0.25
    await b.close()
    return feat, lang, hits
async def main():
    vids = sorted(glob.glob(os.path.join(ROOT,"video","V*.mp4")))
    vids = [v for v in vids if re.match(r"VS?\d+(-MX)?-(es|pt)\.mp4$", os.path.basename(v))]
    if sys.argv[1:]: vids = [v for v in vids if os.path.basename(v).split("-")[0] in sys.argv[1:]]
    async with async_playwright() as pw:
        for v in vids:
            feat, lang, hits = await scan(v, pw)
            if hits: print(f"CUT  {feat}-{lang}: {len(hits)} frames, first {hits[0][0]}s {hits[0][1]}, last {hits[-1][0]}s")
            else: print(f"OK   {feat}-{lang}")
            sys.stdout.flush()
asyncio.run(main())
