"""Write the restaurant entries of the tree's BUILT list from the files that exist.
Every restaurant feature: demo page for every country/language the tree offers (minus HOLD), videos from video/<ID>-<lang>.mp4
(es = Colombia's video, shown for every Spanish country; pt Brazil; en US/Canada) and video/<ID>-US-es.mp4 for US Spanish."""
import os, re
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
HOLD = {"R1": ["US-en", "CA-en", "US-es"]}   # demo pages not shown there yet (see the night report)
ALL_CL = ["CO-es","MX-es","PE-es","CL-es","EC-es","AR-es","PA-es","BR-pt","US-en","US-es","CA-en"]
lines = []
for n in list(range(1, 12)):
    fid, page, key = f"R{n}", f"R{n}", f"R{n}"
    lines.append((key, page, fid))
for n in range(1, 25):
    lines.append((f"restaurante:S{n}", f"RS{n}", f"RS{n}"))
out = []
for key, page, fid in lines:
    if not os.path.exists(os.path.join(ROOT, "demos", "restaurante", page + ".html")):
        continue
    vids = {}
    for l in ("es", "pt", "en"):
        if os.path.exists(os.path.join(ROOT, "video", f"{fid}-{l}.mp4")):
            vids[l] = f"video/{fid}-{l}.mp4"
    if os.path.exists(os.path.join(ROOT, "video", f"{fid}-US-es.mp4")):
        vids["US-es"] = f"video/{fid}-US-es.mp4"
    if "es" not in vids:
        vids.pop("US-es", None) if False else None
    only = [cl for cl in ALL_CL if cl not in HOLD.get(fid, [])]
    v = ",".join(f'"{k}":"{p}"' for k, p in vids.items())
    out.append(f' "{key}":{{ only:{only!r}, page:(c,l)=>`demos/restaurante/{page}.html?embed=1&country=${{c}}&lang=${{l}}`, video:{{{v}}} }},'.replace("'", '"'))
block = "/* RESTAURANT-BEGIN (written by tools/tree_restaurant.py) */\n" + "\n".join(out) + "\n /* RESTAURANT-END */"
p = os.path.join(ROOT, "index.html"); s = open(p, encoding="utf-8").read()
if "RESTAURANT-BEGIN" in s:
    s = re.sub(r"/\* RESTAURANT-BEGIN.*?RESTAURANT-END \*/", lambda m: block, s, flags=re.S)
else:
    s = re.sub(r'\n R4:\{ only:\["CO-es"\][^\n]*\n', "\n" + block + "\n", s)
open(p, "w", encoding="utf-8").write(s)
print(len(out), "restaurant entries")
