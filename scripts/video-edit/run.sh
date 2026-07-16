#!/usr/bin/env bash
# Fine-grained frames around the logo card (t=18-26s) to nail fade timing.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
VID="$ROOT/bumperball-site/assets/video/bumperball-action.mp4"
OUT="$ROOT/scrape-dump/video-frames/fine"
mkdir -p "$OUT"
ffmpeg -hide_banner -loglevel error -y -ss 18 -to 26 -i "$VID" -vf "fps=6" -q:v 4 "$OUT/t18_%02d.jpg"
ls "$OUT" | wc -l
