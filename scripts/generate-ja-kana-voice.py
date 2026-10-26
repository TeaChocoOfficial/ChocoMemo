#!/usr/bin/env python3
"""Generate the Japanese kana chart's voice clips with edge-tts.

One MP3 per distinct kana sound, per voice (female + male), written to
`client/public/ja/sound/<voice>/<sound>.mp3` — the same layout and the same
playback path as the English and Thai charts.

The kana and their file names are read from `client/app/data/ja/kana.ts`, so the
clips can never drift from the chart. Hiragana and katakana share a sound, so a
file name appears once and the first occurrence (the hiragana glyph) is the one
that gets spoken; the written form does not change the pronunciation.

Usage:
    python3 scripts/generate-ja-kana-voice.py [--force]
"""

from __future__ import annotations

import argparse
import asyncio
import importlib.util
import re
import sys
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent / "generate-thai-voice.py"
spec = importlib.util.spec_from_file_location("gen", SCRIPT)
gen = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gen)

# The two Japanese neural voices shipped with the chart.
VOICES = {
    "female": "ja-JP-NanamiNeural",
    "male": "ja-JP-KeitaNeural",
}

DATA_FILE = gen.ROOT / "client" / "app" / "data" / "ja" / "kana.ts"
OUTPUT_ROOT = gen.ROOT / "client" / "public" / "ja" / "sound"

# One chart item: the glyph, its romaji and the mp3 file name.
CHART_ITEM = re.compile(r"\{ char: '(.+?)', read: '(.+?)', sound: '(.+?)' \}")


def chart_items() -> list[tuple[str, str]]:
    """The distinct sounds in data order: the glyph to speak and its file name."""
    items: dict[str, str] = {}
    for char, _read, sound in CHART_ITEM.findall(DATA_FILE.read_text(encoding="utf-8")):
        if char and sound:
            items.setdefault(sound, char)
    return list(items.items())


async def say(voice: str, text: str, path: Path) -> bool:
    """Synthesize one clip, retrying a few times before giving up."""
    for attempt in range(4):
        try:
            await gen.edge_tts.Communicate(text, voice).save(str(path))
            return True
        except Exception as error:  # noqa: BLE001 - edge-tts raises several
            if attempt == 3:
                print(f"    ! {path.name} {text!r}: {type(error).__name__}")
        await asyncio.sleep(1.0)
    return False


async def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--force", action="store_true", help="re-render existing clips")
    args = parser.parse_args()

    items = chart_items()
    print(f"kana sounds: {len(items)}")
    failures: list[str] = []
    for label, voice in VOICES.items():
        out_dir = OUTPUT_ROOT / label
        out_dir.mkdir(parents=True, exist_ok=True)
        written = 0
        for sound, char in items:
            path = out_dir / sound
            if path.exists() and not args.force:
                continue
            if await say(voice, char, path):
                written += 1
            else:
                failures.append(f"{label}/{sound}")
            await asyncio.sleep(0.15)
        print(f"{label}: {written} clips -> {out_dir}")
    if failures:
        print("FAILED:", ", ".join(failures))
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
