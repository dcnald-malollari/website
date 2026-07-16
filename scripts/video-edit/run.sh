#!/usr/bin/env bash
# Replace burned-in 630-465-1088 with 331-431-1134 on the logo card (t≈19.5-23.4s).
# Exact text width is measured with PIL so the canvas never clips; the rendered
# number is then squeezed to the original 136px span (condensed, like the source).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
VID="$ROOT/bumperball-site/assets/video/bumperball-action.mp4"
OUT="$ROOT/bumperball-site/assets/video/bumperball-action-fixed.mp4"
VER="$ROOT/scrape-dump/video-frames/verify"
rm -rf "$VER"; mkdir -p "$VER"

FONT="/usr/share/fonts/truetype/crosextra/Carlito-Regular.ttf"

W=$(python3 - <<PY
from PIL import ImageFont
f = ImageFont.truetype("$FONT", 31)
print(int(f.getlength('331-431-1134')) + 4)
PY
)
echo "measured canvas width: $W"

ffmpeg -hide_banner -loglevel error -y -i "$VID" -filter_complex "\
color=c=black@0.0:s=${W}x44:r=30:d=44,format=rgba,\
drawtext=fontfile=$FONT:text='331-431-1134':fontcolor=0x1B6AB5:fontsize=31:x=0:y=22-text_h/2,\
scale=136:44,fade=in:st=19.60:d=0.42:alpha=1[num];\
[0:v]drawbox=x=98:y=254:w=148:h=44:color=white@1:t=fill:enable='between(t,19.50,22.97)',\
delogo=x=98:y=254:w=148:h=44:enable='between(t,22.97,23.45)'[base];\
[base][num]overlay=x=104:y=253:enable='between(t,19.55,22.97)':shortest=0:eof_action=pass" \
  -c:v libx264 -crf 20 -preset medium -movflags +faststart -c:a copy "$OUT"

ls -la "$VID" "$OUT"

ffmpeg -hide_banner -loglevel error -y -ss 19 -to 24.2 -i "$OUT" -vf "fps=6" -q:v 4 "$VER/v_%02d.jpg"
ls "$VER" | wc -l
