#!/usr/bin/env bash
# Extract frames + metadata from the promo video so we can locate the burned-in
# phone number. Runs on a GitHub Actions runner (full ffmpeg available).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
VID="$ROOT/bumperball-site/assets/video/bumperball-action.mp4"
OUT="$ROOT/scrape-dump/video-frames"
mkdir -p "$OUT"

ffprobe -v error -show_entries format=duration,size,bit_rate -show_entries stream=codec_name,width,height,r_frame_rate,codec_type "$VID" > "$OUT/_info.txt" 2>&1
cat "$OUT/_info.txt"

# 1 frame per second, scaled down for quick review
ffmpeg -hide_banner -loglevel error -y -i "$VID" -vf "fps=1,scale=640:-2" -q:v 5 "$OUT/f_%03d.jpg"
ls "$OUT" | head -80
