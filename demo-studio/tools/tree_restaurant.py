"""Write the restaurant entries of the tree's BUILT list from the files that exist.
Every restaurant feature: demo page for every country/language the tree offers (minus HOLD), videos from video/<ID>-<lang>.mp4
(es = Colombia's video, shown for every Spanish country; pt Brazil; en US/Canada) and video/<ID>-US-es.mp4 for US Spanish."""
import os, re
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
HOLD = {}   # demo pages not shown there yet (R1 en released after MERGE-12: whole-word photo match)
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
# ---- retail: tienda pages (T1..T11 own, TS1..TS24 shared) and farmacia (same pages with &type=pharmacy; only T12 has videos) ----
def vids_of(fid):
    v = {}
    for l in ("es", "pt", "en"):
        if os.path.exists(os.path.join(ROOT, "video", f"{fid}-{l}.mp4")): v[l] = f"video/{fid}-{l}.mp4"
    if os.path.exists(os.path.join(ROOT, "video", f"{fid}-US-es.mp4")): v["US-es"] = f"video/{fid}-US-es.mp4"
    return v
RET_ALL = ALL_CL
for biz, typ in (("tienda", ""), ("farmacia", "&type=pharmacy")):
    own = [f"T{n}" for n in range(1, 13 if biz == "farmacia" else 12)]
    for fid in own + [f"S{n}" for n in range(1, 25)]:
        page = fid if fid.startswith("T") else "T" + fid
        if not os.path.exists(os.path.join(ROOT, "demos", "tienda", page + ".html")): continue
        v = vids_of(page) if (biz == "tienda" or page == "T12") else {}
        if page == "T12" and os.path.exists(os.path.join(ROOT, "video", "T12-MX-es.mp4")):
            for c in ("MX", "PE", "CL", "EC", "AR", "PA"): v[f"{c}-es"] = "video/T12-MX-es.mp4"
        vv = ",".join(f'"{k}":"{p}"' for k, p in v.items())
        out.append(f' "{biz}:{fid}":{{ only:{RET_ALL!r}, page:(c,l)=>`demos/tienda/{page}.html?embed=1&country=${{c}}&lang=${{l}}{typ}`, video:{{{vv}}} }},'.replace("'", '"'))
# ---- services: the four demo businesses share the pages demos/servicios/V<n>.html (own) and VS<n>.html (shared), with &biz=<trade>.
#      Videos are made for CO es and BR pt with each page's own business (shown for all four); a "-MX" script's video is shown for the
#      countries it speaks for. US and Canada are on hold (Monti, 21 Oct): no services pages there yet. V9 and S20 wait for Monti's go.
SERV_BIZ = {"peluqueria": "peluqueria", "veterinaria": "veterinaria", "motos": "taller-motos", "unas": "unas"}
SERV_CL = [cl for cl in ALL_CL if not cl.startswith(("US", "CA"))]
SERV_HOLD = {"V9", "VS20"}
MX_SPEAKS_FOR = {"V1": ["MX", "PE", "CL", "EC", "AR", "PA"], "V2": ["MX", "PE", "CL", "EC", "AR", "PA"]}   # V1-MX, V2-MX: "no suggested prices" is true in every Spanish country but Colombia
for tree_id, slug in SERV_BIZ.items():
    for fid in [f"V{n}" for n in range(1, 10)] + [f"S{n}" for n in range(1, 25)]:
        page = fid if fid.startswith("V") else "V" + fid
        if page in SERV_HOLD or not os.path.exists(os.path.join(ROOT, "demos", "servicios", page + ".html")): continue
        v = {l: p for l, p in vids_of(page).items() if l in ("es", "pt")}
        if os.path.exists(os.path.join(ROOT, "video", f"{page}-MX-es.mp4")):
            for c in MX_SPEAKS_FOR.get(page, ["MX"]): v[f"{c}-es"] = f"video/{page}-MX-es.mp4"
        vv = ",".join(f'"{k}":"{p}"' for k, p in v.items())
        out.append(f' "{tree_id}:{fid}":{{ only:{SERV_CL!r}, page:(c,l)=>`demos/servicios/{page}.html?embed=1&country=${{c}}&lang=${{l}}&biz={slug}`, video:{{{vv}}} }},'.replace("'", '"'))
block = "/* RESTAURANT-BEGIN (written by tools/tree_restaurant.py) */\n" + "\n".join(out) + "\n /* RESTAURANT-END */"
p = os.path.join(ROOT, "index.html"); s = open(p, encoding="utf-8").read()
if "RESTAURANT-BEGIN" in s:
    s = re.sub(r"/\* RESTAURANT-BEGIN.*?RESTAURANT-END \*/", lambda m: block, s, flags=re.S)
else:
    s = re.sub(r'\n R4:\{ only:\["CO-es"\][^\n]*\n', "\n" + block + "\n", s)
open(p, "w", encoding="utf-8").write(s)
print(len(out), "restaurant, retail and services entries")
