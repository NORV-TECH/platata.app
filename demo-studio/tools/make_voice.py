"""Make the narration for every feature script, one mp3 per step per language.

Runs on GitHub Actions with the ELEVENLABS_API_KEY secret. Never prints the key.
Reads demo-studio/voices.json and demo-studio/features/*.json.
Writes demo-studio/audio/<feature>/<lang>/<step>.mp3 and demo-studio/audio/manifest.json.
Only lines whose text or voice changed are made again (the manifest keeps a hash), so re-runs cost nothing.
"""
import glob
import hashlib
import json
import os
import time
import urllib.error
import urllib.request

API = "https://api.elevenlabs.io"
KEY = os.environ.get("ELEVENLABS_API_KEY", "")
ROOT = "demo-studio"
AUDIO = os.path.join(ROOT, "audio")
MANIFEST = os.path.join(AUDIO, "manifest.json")


def tts(voice_id, text, model, settings):
    body = json.dumps({"text": text, "model_id": model, "voice_settings": settings}).encode()
    req = urllib.request.Request(
        f"{API}/v1/text-to-speech/{voice_id}?output_format=mp3_44100_128", data=body, method="POST")
    req.add_header("xi-api-key", KEY)
    req.add_header("Content-Type", "application/json")
    req.add_header("Accept", "audio/mpeg")
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            msg = e.read()[:300].decode(errors="replace")
            if e.code in (429, 500, 502, 503) and attempt < 2:
                time.sleep(6)
                continue
            raise RuntimeError(f"{e.code}: {msg}")


def main():
    voices = json.load(open(os.path.join(ROOT, "voices.json"), encoding="utf-8"))
    model = voices["model"]
    manifest = json.load(open(MANIFEST, encoding="utf-8")) if os.path.exists(MANIFEST) else {}
    report = {"made": 0, "skipped": 0, "chars": 0, "errors": []}
    if not KEY:
        report["errors"].append("ELEVENLABS_API_KEY secret is missing or empty")
    # only scripts that were reviewed: listed in voice-ready.txt (one id per line), or already voiced before
    ready_file = os.path.join(ROOT, "voice-ready.txt")
    ready = None
    if os.path.exists(ready_file):
        ready = {l.strip() for l in open(ready_file, encoding="utf-8") if l.strip() and not l.startswith("#")}
        ready |= {k.split("/")[0] for k in manifest}
    for path in sorted(glob.glob(os.path.join(ROOT, "features", "*.json"))):
        feat = json.load(open(path, encoding="utf-8"))
        if ready is not None and feat["id"] not in ready:
            report["skipped_not_ready"] = report.get("skipped_not_ready", 0) + 1
            continue
        # drop clips of steps that no longer exist (the video recorder plays every mp3 in the folder)
        for lang_dir in glob.glob(os.path.join(AUDIO, feat["id"], "*")):
            keep = {st["id"] for st in feat["steps"] if os.path.basename(lang_dir) in st["voice"]}
            for mp3 in glob.glob(os.path.join(lang_dir, "*.mp3")):
                sid = os.path.basename(mp3)[:-4]
                if sid not in keep:
                    os.remove(mp3)
                    manifest.pop(f"{feat['id']}/{os.path.basename(lang_dir)}/{sid}", None)
        for step in feat["steps"]:
            for lang, text in step["voice"].items():
                v = dict(voices[lang])
                # a feature may set its own voice settings per language (e.g. a calmer delivery)
                v["settings"] = feat.get("voice_settings", {}).get(lang, v["settings"])
                key = f"{feat['id']}/{lang}/{step['id']}"
                h = hashlib.sha1(json.dumps([text, v["voice_id"], v["settings"], model]).encode()).hexdigest()
                out = os.path.join(AUDIO, feat["id"], lang, step["id"] + ".mp3")
                if manifest.get(key, {}).get("hash") == h and os.path.exists(out):
                    report["skipped"] += 1
                    continue
                if not KEY:
                    continue
                try:
                    audio = tts(v["voice_id"], text, model, v["settings"])
                    os.makedirs(os.path.dirname(out), exist_ok=True)
                    with open(out, "wb") as f:
                        f.write(audio)
                    manifest[key] = {"hash": h, "file": out, "chars": len(text)}
                    report["made"] += 1
                    report["chars"] += len(text)
                except Exception as e:  # noqa: BLE001
                    report["errors"].append(f"{key}: {e}")
    os.makedirs(AUDIO, exist_ok=True)
    json.dump(manifest, open(MANIFEST, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    report["finished_utc"] = time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime())
    json.dump(report, open(os.path.join(AUDIO, "last-run.json"), "w", encoding="utf-8"), indent=1)
    print(json.dumps({k: report[k] for k in ("made", "skipped", "chars")}), len(report["errors"]), "errors")


if __name__ == "__main__":
    main()
