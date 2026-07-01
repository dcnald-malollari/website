#!/usr/bin/env bash
# Downloads all ALLEGEDLY product/campaign photos from the Higgsfield CDN
# into assets/img/ so the site serves them locally instead of hot-linking.
# Run from the repo root: bash scripts/download-images.sh
# Then commit: git add assets/img && git commit -m "Localize product photos"
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p assets/img

# id|url pairs are generated from js/products.js photoRemote fields
node - <<'EOF'
const fs = require("fs");
const src = fs.readFileSync("js/products.js", "utf8");
// crude but reliable: pull id + photoRemote pairs in order
const ids = [...src.matchAll(/id:\s*"([^"]+)"/g)].map(m => m[1]);
const remotes = [...src.matchAll(/photoRemote:\s*"([^"]+)"/g)].map(m => m[1]);
const campaign = src.match(/CAMPAIGN_IMG\s*=\s*{[^}]*remote:\s*"([^"]+)"/);
const jobs = ids.map((id, i) => ({ id, url: remotes[i] })).filter(j => j.url);
if (campaign) jobs.push({ id: "campaign", url: campaign[1] });
fs.writeFileSync("/tmp/allegedly-images.txt", jobs.map(j => `${j.id} ${j.url}`).join("\n"));
console.log(`Found ${jobs.length} images to download.`);
EOF

while read -r id url; do
  echo "Downloading $id ..."
  curl -fsSL -o "assets/img/$id.webp" "$url"
done < /tmp/allegedly-images.txt

echo "Done. Images saved to assets/img/. Commit them to make the site self-contained."
