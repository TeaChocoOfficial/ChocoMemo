#!/usr/bin/env python3
"""Generate the Thai character chart's voice clips with edge-tts.

One MP3 per chart character, per voice (female + male), written to
`client/public/th/sound/<voice>/<char>.mp3`. The chart plays these files
when the server cannot reach Google Cloud TTS, so every device hears the same
Thai pronunciation.

The characters and their names are read from
`client/app/data/th/thai.ts`, so the clips can never drift from the chart.

Usage:
    python3 scripts/generate-thai-voice.py [--force]
"""

from __future__ import annotations

import argparse
import asyncio
import re
import sys
from pathlib import Path

import edge_tts

# The two Thai neural voices shipped with the chart.
VOICES = {
    "female": "th-TH-PremwadeeNeural",
    "male": "th-TH-NiwatNeural",
}

# edge-tts returns no audio for a few obsolete/rare names on their own
# (ฃ ฦ ๅ). A trailing period gives the synthesizer a sentence to speak, so
# the character is still voiced instead of failing the whole run.
FALLBACK_SUFFIX = "."

ROOT = Path(__file__).resolve().parent.parent
DATA_FILE = ROOT / "client" / "app" / "data" / "th" / "thai.ts"
OUTPUT_ROOT = ROOT / "client" / "public" / "th" / "sound"

# One chart item: the glyph as it is shown, the name that is spoken, and the
# mp3 file name the chart plays.
CHART_ITEM = re.compile(r"\{ char: '(.+?)', read: '(.+?)', sound: '(.+?)' \}")


def chart_items() -> list[tuple[str, str, str]]:
    """The chart items in data order: the glyph, the name and the file name."""
    source = DATA_FILE.read_text(encoding="utf-8")
    items: list[tuple[str, str, str]] = []
    seen: set[str] = set()
    for char, name, sound in CHART_ITEM.findall(source):
        if sound in seen:
            continue
        seen.add(sound)
        items.append((char, name, sound))
    return items


async def render(voice: str, name: str, path: Path, force: bool) -> bool:
    """Synthesize one chart name to `path`. Returns True when it was written."""
    if path.exists() and not force:
        return False
    try:
        await edge_tts.Communicate(name, voice).save(str(path))
        return True
    except edge_tts.exceptions.NoAudioReceived:
        pass
    # Retry with a sentence terminator so the name is still spoken.
    await edge_tts.Communicate(f"{name}{FALLBACK_SUFFIX}", voice).save(str(path))
    return True


async def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--force",
        action="store_true",
        help="re-render clips that already exist",
    )
    args = parser.parse_args()

    items = chart_items()
    for label, voice in VOICES.items():
        out_dir = OUTPUT_ROOT / label
        out_dir.mkdir(parents=True, exist_ok=True)
        written = 0
        for _, name, sound in items:
            path = out_dir / sound
            if await render(voice, name, path, args.force):
                written += 1
        print(f"{label}: {written} clips written of {len(items)} -> {out_dir}")
    return 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
