#!/usr/bin/env bash
# Replace burned-in 630-465-1088 with 331-431-1134 on the logo card (t≈19.5-23.4s).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
VID="$ROOT/bumperball-site/assets/video/bumperball-action.mp4"
OUT="$ROOT/bumperball-site/assets/video/bumperball-action-fixed.mp4"
VER="$ROOT/scrape-dump/video-frames/verify"
mkdir -p "$VER"

FONT="/usr/share/fonts/truetype/crosextra/Carlito-Regular.ttf"
ls -la /usr/share/fonts/truetype/crosextra/ || true

ffmpeg -hide_banner -loglevel error -y -i "$VID" -vf "\
drawbox=x=98:y=254:w=148:h=44:color=white@1:t=fill:enable='between(t,19.50,22.97)',\
drawtext=fontfile=$FONT:text='331-431-1134':fontcolor=0x1B6AB5:fontsize=34:x=104:y=275-text_h/2:alpha='clip((t-19.62)/0.40,0,1)':enable='between(t,19.55,22.97)',\
delogo=x=98:y=254:w=148:h=44:enable='between(t,22.97,23.45)'" \
  -c:v libx264 -crf 20 -preset medium -movflags +faststart -c:a copy "$OUT"

ls -la "$VID" "$OUT"

# verification frames of the edited section
ffmpeg -hide_banner -loglevel error -y -ss 19 -to 24.2 -i "$OUT" -vf "fps=6" -q:v 4 "$VER/v_%02d.jpg"
ls "$VER" | wc -l
