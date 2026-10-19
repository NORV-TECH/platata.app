"""Record the narrated how-to video for a feature page, frame by frame, then add the voice.

    python3 demo-studio/tools/record_video.py S10 es:CO pt:BR en:US fr:CA

The page is driven by a clock (?mode=video): for every frame we call window.__frame(t) and take a
screenshot, so the taps land exactly where the narration says. Output: demo-studio/video/<feature>-<lang>.mp4 (1080x1920).
"""
import asyncio
import os
import shutil
import subprocess
import sys
import tempfile

from playwright.async_api import async_playwright

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
FPS = 30


def duration(path):
    out = subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                   "-of", "csv=p=0", path])
    return float(out)


async def record(feature, lang, country):
    adir = os.path.join(ROOT, "audio", feature, lang)
    clips = sorted(f for f in os.listdir(adir) if f.endswith(".mp3"))
    durs = [duration(os.path.join(adir, c)) for c in clips]
    import glob
    found = glob.glob(os.path.join(ROOT, "demos", "*", f"{feature}.html")) + glob.glob(os.path.join(ROOT, "pilot", f"{feature}.html"))
    page_url = "file://" + os.path.abspath(found[0])
    url = f"{page_url}?mode=video&lang={lang}&country={country}&dur=" + ",".join(f"{d:.3f}" for d in durs)
    tmp = tempfile.mkdtemp()
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width": 540, "height": 960}, device_scale_factor=2)
        await pg.goto(url)
        await pg.evaluate("document.fonts.ready")
        await pg.wait_for_timeout(300)
        tl = await pg.evaluate("window.__timeline")
        i = 0
        while True:
            t = i / FPS
            await pg.evaluate(f"window.__frame({t})")
            await pg.screenshot(path=os.path.join(tmp, f"{i:05d}.jpg"), type="jpeg", quality=92)
            i += 1
            tl = await pg.evaluate("window.__timeline")
            if tl.get("total") and t >= tl["total"]:
                break
            if t > 240:
                raise RuntimeError("video never ended")
        await b.close()
    os.makedirs(os.path.join(ROOT, "video"), exist_ok=True)
    out = os.path.join(ROOT, "video", f"{feature}-{lang}.mp4")
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-framerate", str(FPS), "-i", os.path.join(tmp, "%05d.jpg")]
    for c in clips:
        cmd += ["-i", os.path.join(adir, c)]
    parts, labels = [], []
    for k, s in enumerate(tl["starts"]):
        ms = int(s * 1000)
        parts.append(f"[{k + 1}:a]adelay={ms}|{ms}[a{k}]")
        labels.append(f"[a{k}]")
    filt = ";".join(parts) + ";" + "".join(labels) + f"amix=inputs={len(labels)}:normalize=0[a]"
    cmd += ["-filter_complex", filt, "-map", "0:v", "-map", "[a]", "-c:v", "libx264", "-pix_fmt", "yuv420p",
            "-crf", "20", "-preset", "medium", "-c:a", "aac", "-b:a", "160k", "-t", f"{tl['total']:.2f}",
            "-movflags", "+faststart", out]
    subprocess.check_call(cmd)
    shutil.rmtree(tmp)
    print(out, f"{tl['total']:.1f}s")


async def main():
    feature = sys.argv[1]
    for pair in sys.argv[2:]:
        lang, country = pair.split(":")
        await record(feature, lang, country)


if __name__ == "__main__":
    asyncio.run(main())
