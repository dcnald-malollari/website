#!/usr/bin/env bash
# Second read-only fetch pass: waiver app scripts (may embed waiver text),
# full-size photos, speculative gallery images. GETs only.
set -u
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="$ROOT/scrape-dump/extras"
IMGF="$ROOT/scrape-dump/images-full"
mkdir -p "$OUT" "$IMGF"

get() { # url -> outfile
  local url="$1" out="$2"
  code=$(curl -sL -A "$UA" -H "Referer: https://www.bumperballchicago.com/view/register/" \
    --max-time 30 -w "%{http_code}" -o "$out" "$url")
  size=$(stat -c%s "$out" 2>/dev/null || echo 0)
  if [ "$code" = "200" ] && [ "$size" -gt 100 ]; then
    echo "OK  $code $size $url"
  else
    echo "SKIP $code $size $url"; rm -f "$out"
  fi
}

BASE="https://www.bumperballchicago.com/cp/resources/static/waiver_station"
for f in ersadmin_waiver_station_3.js mock_data.js waiver_station.css \
         wlib/WaiverContent.js wlib/AppState.js wlib/StartPage.js wlib/DonePage.js \
         wlib/OrderInfo.js wlib/CustomerInfo.js wlib/MinorInfo.js wlib/Router.js \
         wlib/MetaDescription.js wlib/utils/api.js wlib/utils/helpers.js; do
  get "$BASE/$f" "$OUT/$(echo "$f" | tr '/' '_')"
done

G="https://files.sysers.com/cp/upload/bumper/gallery/full"
for i in 1 2 3 4 5 6 7 8 9 10 11 12; do
  get "$G/hm-slider-$i.jpg" "$IMGF/hm-slider-$i.jpg"
done
for i in 1 2 3 4 5 6 7 8 9 10; do
  get "$G/feature-$i.jpg" "$IMGF/feature-$i.jpg"
done

I="https://files.sysers.com/cp/upload/bumper/items"
for n in IMG_3670 IMG_3671 IMG_3544 IMG_3530; do
  get "$I/full/$n.JPG" "$IMGF/${n}_full.JPG"
  get "$I/lg/$n.JPG" "$IMGF/${n}_lg.JPG"
done

get "https://files.sysers.com/cp/upload/bumper/editor/full/bbc-fb-icon.jpg" "$IMGF/bbc-fb-icon.jpg"
get "https://files.sysers.com/cp/upload/bumper/editor/full/nav-bakgd-5.jpg" "$IMGF/nav-bakgd-5.jpg"

echo "--- waiver text sniff ---"
grep -l -i -E "release|liability|assumption of risk|indemnif" "$OUT"/* 2>/dev/null || echo "no waiver legal text found in JS"
