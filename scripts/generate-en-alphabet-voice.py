#!/usr/bin/env python3
"""Generate the English alphabet chart's voice clips with edge-tts.

One MP3 per letter, per voice (female + male), written to
`client/public/en/sound/<voice>/<sound>.mp3` — the same layout and the same
playback path as the Thai chart, so every device hears the same pronunciation.

The letters and their mnemonic words are read from
`client/app/data/en/alphabet.ts`, so the clips can never drift from the chart.
The card's `read` is the display form ("a ant"); the clip speaks the letter's
NAME plus the word ("A. Ant."), because TTS reads a bare "a" as the article.

Usage:
    python3 scripts/generate-en-alphabet-voice.py [--force]
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

# The two English neural voices shipped with the chart.
VOICES = {
    "female": "en-US-AriaNeural",
    "male": "en-US-GuyNeural",
}

DATA_FILE = gen.ROOT / "client" / "app" / "data" / "en" / "alphabet.ts"
OUTPUT_ROOT = gen.ROOT / "client" / "public" / "en" / "sound"

# One chart item: the glyph, the reading shown on the card, and the mp3 name.
CHART_ITEM = re.compile(r"\{ char: '(.+?)', read: '(.+?)', sound: '(.+?)' \}")


def chart_items() -> list[tuple[str, str, str]]:
    """The chart items in data order: glyph, spoken text and file name."""
    source = DATA_FILE.read_text(encoding="utf-8")
    section = source.split("const UPPERCASE")[1].split("const LOWERCASE")[0]
    items: list[tuple[str, str, str]] = []
    for char, read, sound in CHART_ITEM.findall(section):
        word = read.split(" ", 1)[1] if " " in read else read
        items.append((char, f"{char}. {word}.", sound))
    return items


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
    print(f"letters: {len(items)}")
    failures: list[str] = []
    for label, voice in VOICES.items():
        out_dir = OUTPUT_ROOT / label
        out_dir.mkdir(parents=True, exist_ok=True)
        written = 0
        for _, text, sound in items:
            path = out_dir / sound
            if path.exists() and not args.force:
                continue
            if await say(voice, text, path):
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
