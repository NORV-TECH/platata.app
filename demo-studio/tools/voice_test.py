"""Voice test for the Platata demos.

Runs on GitHub Actions with the ELEVENLABS_API_KEY secret. Never prints the key.

Mode is chosen by what is in demo-studio/voice-test/:
  - no picks.json  -> LIST: account credits + candidate voices per language -> candidates.json
  - picks.json     -> GENERATE: one mp3 per picked voice with the test lines -> out/*.mp3
Always writes report.json (credits before/after, errors).
"""
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

API = "https://api.elevenlabs.io"
KEY = os.environ.get("ELEVENLABS_API_KEY", "")
HERE = os.path.join("demo-studio", "voice-test")
OUT = os.path.join(HERE, "out")
MODEL = "eleven_multilingual_v2"
RUN = 3  # bump to re-run the job

# Several searches per language; results are merged and de-duplicated.
SEARCHES = {
    "es": [
        {"language": "es", "accent": "colombian"},
        {"language": "es", "search": "colombian"},
        {"language": "es", "search": "colombia"},
        {"language": "es", "accent": "latin american"},
    ],
    "pt": [
        {"language": "pt", "accent": "brazilian"},
        {"language": "pt", "search": "brazilian"},
        {"language": "pt", "search": "brasileiro"},
    ],
    "en": [
        {"language": "en", "accent": "american", "use_cases": "narrative_story"},
        {"language": "en", "accent": "american", "use_cases": "informative_educational"},
        {"language": "en", "accent": "american", "use_cases": "conversational"},
    ],
    "fr": [
        {"language": "fr", "accent": "canadian"},
        {"language": "fr", "search": "quebec"},
        {"language": "fr", "search": "québécois"},
        {"language": "fr", "search": "canadian"},
    ],
}

report = {"errors": []}


def call(method, path, params=None, body=None, raw=False):
    url = API + path
    if params:
        url += "?" + urllib.parse.urlencode(params)
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("xi-api-key", KEY)
    if body is not None:
        req.add_header("Content-Type", "application/json")
    if raw:
        req.add_header("Accept", "audio/mpeg")
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                content = r.read()
                return content if raw else json.loads(content or b"{}")
        except urllib.error.HTTPError as e:
            msg = e.read()[:400].decode(errors="replace")
            if e.code == 429 and attempt < 2:
                time.sleep(5)
                continue
            raise RuntimeError(f"{method} {path} -> {e.code}: {msg}")


def credits():
    try:
        s = call("GET", "/v1/user/subscription")
        return {
            "tier": s.get("tier"),
            "used": s.get("character_count"),
            "limit": s.get("character_limit"),
            "left": (s.get("character_limit") or 0) - (s.get("character_count") or 0),
            "voice_slots_used": s.get("voice_slots_used"),
            "voice_limit": s.get("voice_limit"),
            "next_reset_unix": s.get("next_character_count_reset_unix"),
        }
    except Exception as e:  # noqa: BLE001
        report["errors"].append(str(e))
        return None


KEEP = ["public_owner_id", "voice_id", "name", "gender", "age", "accent", "language",
        "locale", "descriptive", "use_case", "category", "cloned_by_count",
        "usage_character_count_1y", "preview_url", "free_users_allowed", "description"]


def list_mode():
    found = {}
    for lang, queries in SEARCHES.items():
        seen = {}
        for q in queries:
            params = {"page_size": 40, **q}
            try:
                res = call("GET", "/v1/shared-voices", params=params)
            except Exception as e:  # noqa: BLE001
                report["errors"].append(str(e))
                continue
            for v in res.get("voices", []):
                vid = v.get("voice_id")
                if vid and vid not in seen:
                    item = {k: v.get(k) for k in KEEP}
                    if isinstance(item.get("description"), str):
                        item["description"] = item["description"][:200]
                    item["query"] = q
                    seen[vid] = item
        ranked = sorted(seen.values(),
                        key=lambda v: (v.get("usage_character_count_1y") or 0, v.get("cloned_by_count") or 0),
                        reverse=True)
        found[lang] = ranked[:40]
    with open(os.path.join(HERE, "candidates.json"), "w", encoding="utf-8") as f:
        json.dump(found, f, ensure_ascii=False, indent=1)
    report["candidates"] = {k: len(v) for k, v in found.items()}


def my_voice_ids():
    try:
        res = call("GET", "/v1/voices")
        return {v.get("voice_id") for v in res.get("voices", [])}
    except Exception as e:  # noqa: BLE001
        report["errors"].append(str(e))
        return set()


def generate_mode(picks):
    with open(os.path.join(HERE, "lines.json"), encoding="utf-8") as f:
        cfg = json.load(f)
    lines = cfg["lines"]
    script = cfg.get("script", {})
    model = cfg.get("model", MODEL)
    settings = cfg.get("voice_settings", {"stability": 0.5, "similarity_boost": 0.75,
                                          "style": 0.15, "use_speaker_boost": True})
    for old in os.listdir(OUT) if os.path.isdir(OUT) else []:
        os.remove(os.path.join(OUT, old))
    os.makedirs(OUT, exist_ok=True)
    mine = my_voice_ids()
    made = []
    for p in picks:
        lang, vid, label = p["lang"], p["voice_id"], p["label"]
        try:
            if vid not in mine and p.get("public_owner_id"):
                call("POST", f"/v1/voices/add/{p['public_owner_id']}/{vid}",
                     body={"new_name": f"Platata {label}"})
                mine.add(vid)
            text = script.get(lang) or "\n\n".join(lines[lang])
            body = {"text": text, "model_id": model, "voice_settings": settings}
            if p.get("language_code"):
                body["language_code"] = p["language_code"]
            audio = call("POST", f"/v1/text-to-speech/{vid}",
                         params={"output_format": "mp3_44100_128"}, body=body, raw=True)
            name = f"{lang}-{label}.mp3"
            with open(os.path.join(OUT, name), "wb") as f:
                f.write(audio)
            made.append({"file": name, "voice": p.get("name"), "chars": len(text), "model": model})
        except Exception as e:  # noqa: BLE001
            report["errors"].append(f"{label}: {e}")
    report["made"] = made


def dump_my_voices():
    try:
        res = call("GET", "/v1/voices")
        mine = [{"voice_id": v.get("voice_id"), "name": v.get("name"), "category": v.get("category"),
                 "labels": v.get("labels"), "created_unix": v.get("created_at_unix")}
                for v in res.get("voices", [])]
        with open(os.path.join(HERE, "my_voices.json"), "w", encoding="utf-8") as f:
            json.dump(mine, f, ensure_ascii=False, indent=1)
    except Exception as e:  # noqa: BLE001
        report["errors"].append(f"my voices: {e}")


def main():
    if not KEY:
        report["errors"].append("ELEVENLABS_API_KEY secret is missing or empty")
    else:
        report["credits_before"] = credits()
        dump_my_voices()
        picks_path = os.path.join(HERE, "picks.json")
        if os.path.exists(picks_path):
            with open(picks_path, encoding="utf-8") as f:
                generate_mode(json.load(f))
            report["credits_after"] = credits()
        else:
            list_mode()
    report["finished_utc"] = time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime())
    with open(os.path.join(HERE, "report.json"), "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=1)
    print(json.dumps({"errors": len(report["errors"])}))


if __name__ == "__main__":
    sys.exit(main())
