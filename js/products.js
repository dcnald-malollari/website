/* ALLEGEDLY® — product catalog (Drop 001)
   Photos live in assets/img/. Prices in USD. */

const PRODUCTS = [
  {
    id: "allegedly-logo-tee",
    name: "ALLEGEDLY LOGO TEE",
    type: "tee",
    category: "tee",
    color: "black",
    price: 42,
    lines: ["ALLEGEDLY®"],
    badge: "NEW",
    soldOut: false,
    photo: "assets/img/allegedly-logo-tee.webp",
    photoRemote: "https://d8j0ntlcm91z4.cloudfront.net/user_3FdYPzBsaVWvMIu38NVKxnkIsQ6/hf_20260701_222334_fca067fe-2d15-4e60-9a4e-5e6e140916aa_min.webp",
    desc: "The starting point. Small chest hit, nothing to explain. Slightly oversized, heavyweight 240GSM cotton in washed black."
  },
  {
    id: "no-comment-tee",
    name: "NO COMMENT TEE",
    type: "tee",
    category: "tee",
    color: "bone",
    price: 44,
    lines: ["NO", "COMMENT"],
    badge: "NEW",
    soldOut: false,
    photo: "assets/img/no-comment-tee.webp",
    photoRemote: "https://d8j0ntlcm91z4.cloudfront.net/user_3FdYPzBsaVWvMIu38NVKxnkIsQ6/hf_20260701_222528_ab960b16-7a7e-410f-865f-833d73064b57_min.webp",
    desc: "The official statement. Works at dinner, works in court. Slightly oversized, heavyweight 240GSM cotton in bone."
  },
  {
    id: "deny-everything-tee",
    name: "DENY EVERYTHING TEE",
    type: "tee",
    category: "tee",
    color: "black",
    price: 44,
    lines: ["DENY", "EVERYTHING"],
    badge: null,
    soldOut: false,
    photo: "assets/img/deny-everything-tee.webp",
    photoRemote: "https://d8j0ntlcm91z4.cloudfront.net/user_3FdYPzBsaVWvMIu38NVKxnkIsQ6/hf_20260701_222651_ed82f92d-f213-494b-a66b-65509607dd38_min.webp",
    desc: "Standard legal advice, printed front center. Slightly oversized, heavyweight 240GSM cotton in washed black."
  },
  {
    id: "out-of-context-tee",
    name: "OUT OF CONTEXT TEE",
    type: "tee",
    category: "tee",
    color: "bone",
    price: 44,
    lines: ["TAKEN OUT", "OF CONTEXT"],
    badge: null,
    soldOut: false,
    photo: "assets/img/out-of-context-tee.webp",
    photoRemote: "https://d8j0ntlcm91z4.cloudfront.net/user_3FdYPzBsaVWvMIu38NVKxnkIsQ6/hf_20260701_222744_a8f53585-b8c8-4aa6-8de5-41d15445ee56_min.webp",
    desc: "Whatever they heard, it wasn't like that. Slightly oversized, heavyweight 240GSM cotton in bone."
  },
  {
    id: "sources-say-tee",
    name: "SOURCES SAY TEE",
    type: "tee",
    category: "tee",
    color: "black",
    price: 44,
    lines: ["SOURCES", "SAY"],
    badge: "LOW STOCK",
    soldOut: false,
    photo: "assets/img/sources-say-tee.webp",
    photoRemote: "https://d8j0ntlcm91z4.cloudfront.net/user_3FdYPzBsaVWvMIu38NVKxnkIsQ6/hf_20260701_222838_1a85390d-72ca-449b-a371-8379a6379e50_min.webp",
    desc: "Per sources familiar with the matter. Slightly oversized, heavyweight 240GSM cotton in washed black."
  },
  {
    id: "i-said-what-i-said-tee",
    name: "I SAID WHAT I SAID TEE",
    type: "tee",
    category: "tee",
    color: "bone",
    price: 44,
    lines: ["I SAID", "WHAT I SAID"],
    badge: null,
    soldOut: false,
    photo: "assets/img/i-said-what-i-said-tee.webp",
    photoRemote: "https://d8j0ntlcm91z4.cloudfront.net/user_3FdYPzBsaVWvMIu38NVKxnkIsQ6/hf_20260701_222921_f4750726-d527-43c6-8061-360212458b29_min.webp",
    desc: "No retraction. No follow-up. Slightly oversized, heavyweight 240GSM cotton in bone."
  },
  {
    id: "no-further-questions-hoodie",
    name: "NO FURTHER QUESTIONS HOODIE",
    type: "hoodie",
    category: "fleece",
    color: "black",
    price: 88,
    lines: ["NO FURTHER", "QUESTIONS"],
    badge: "NEW",
    soldOut: false,
    photo: "assets/img/no-further-questions-hoodie.webp",
    photoRemote: "https://d8j0ntlcm91z4.cloudfront.net/user_3FdYPzBsaVWvMIu38NVKxnkIsQ6/hf_20260701_223004_f885d40f-c1ed-4f84-b7e0-560fff6a6c66_min.webp",
    desc: "The conversation is over. 450GSM brushed fleece in washed black, oversized fit, kangaroo pocket."
  },
  {
    id: "off-the-record-hoodie",
    name: "OFF THE RECORD HOODIE",
    type: "hoodie",
    category: "fleece",
    color: "bone",
    price: 88,
    lines: ["OFF THE", "RECORD"],
    badge: null,
    soldOut: false,
    photo: "assets/img/off-the-record-hoodie.webp",
    photoRemote: "https://d8j0ntlcm91z4.cloudfront.net/user_3FdYPzBsaVWvMIu38NVKxnkIsQ6/hf_20260701_223046_d6edb8d8-92de-4544-85a2-701e986fedf6_min.webp",
    desc: "Everything you're about to say in it doesn't count. 450GSM brushed fleece in bone, oversized fit, kangaroo pocket."
  },
  {
    id: "burden-of-proof-crew",
    name: "BURDEN OF PROOF CREWNECK",
    type: "crew",
    category: "fleece",
    color: "grey",
    price: 72,
    lines: ["BURDEN", "OF PROOF"],
    badge: "LOW STOCK",
    soldOut: false,
    photo: "assets/img/burden-of-proof-crew.webp",
    photoRemote: "https://d8j0ntlcm91z4.cloudfront.net/user_3FdYPzBsaVWvMIu38NVKxnkIsQ6/hf_20260701_223125_1e7c1853-a0e5-42ca-8c7b-7a7666603d5a_min.webp",
    desc: "It's on them, not you. 400GSM loopback cotton crewneck in washed heather grey, slightly oversized."
  }
];

/* ---- Garment mockup rendering (SVG) ---- */

const GARMENT_COLORS = {
  black: { fill: "#1a1a1a", stroke: "#333333", text: "#ece7dc" },
  bone:  { fill: "#ece7dc", stroke: "#c9c2b2", text: "#141414" },
  grey:  { fill: "#a8a49a", stroke: "#8b877d", text: "#141414" }
};

function quoteTextSVG(product, cx, cy) {
  const c = GARMENT_COLORS[product.color];
  const maxLen = Math.max(...product.lines.map(l => l.length));
  const fontSize = Math.min(20, 118 / (0.62 * maxLen));
  const lineHeight = fontSize * 1.3;
  const startY = cy - ((product.lines.length - 1) * lineHeight) / 2;
  const tspans = product.lines
    .map((line, i) =>
      `<text x="${cx}" y="${(startY + i * lineHeight).toFixed(1)}" text-anchor="middle" font-family="'Space Mono', monospace" font-weight="700" font-size="${fontSize.toFixed(1)}" fill="${c.text}">${line}</text>`
    )
    .join("");
  const brandY = startY + product.lines.length * lineHeight + 4;
  return tspans +
    `<text x="${cx}" y="${brandY.toFixed(1)}" text-anchor="middle" font-family="'Space Mono', monospace" font-size="7" fill="${c.text}" opacity="0.55">ALLEGEDLY®</text>`;
}

function teeSVG(product) {
  const c = GARMENT_COLORS[product.color];
  return `
  <svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${product.name} mockup">
    <path d="M97 30 C103 44 124 52 150 52 C176 52 197 44 203 30 L238 46 C258 55 270 71 275 89 L287 133 C288.5 139 285 145 279 147 L245 158 C240 160 235 157 233.5 152 L226 128 L226 282 C226 291 219 298 210 298 L90 298 C81 298 74 291 74 282 L74 128 L66.5 152 C65 157 60 160 55 158 L21 147 C15 145 11.5 139 13 133 L25 89 C30 71 42 55 62 46 Z"
      fill="${c.fill}" stroke="${c.stroke}" stroke-width="1.5"/>
    <path d="M100 28 C107 41 126 49 150 49 C174 49 193 41 200 28"
      fill="none" stroke="${c.stroke}" stroke-width="2"/>
    <line x1="74" y1="290" x2="226" y2="290" stroke="${c.stroke}" stroke-width="1" opacity="0.6"/>
    ${quoteTextSVG(product, 150, 150)}
  </svg>`;
}

function hoodieSVG(product) {
  const c = GARMENT_COLORS[product.color];
  return `
  <svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${product.name} mockup">
    <path d="M105 40 C105 16 125 6 150 6 C175 6 195 16 195 40 C195 54 175 62 150 62 C125 62 105 54 105 40 Z"
      fill="${c.fill}" stroke="${c.stroke}" stroke-width="1.5"/>
    <path d="M97 38 C104 52 125 60 150 60 C175 60 196 52 203 38 L236 52 C256 61 267 76 271 94 L284 208 C284.5 214 280 219 274 219 L248 219 C243 219 239 215 238.5 210 L230 148 L230 286 C230 295 223 302 214 302 L86 302 C77 302 70 295 70 286 L70 148 L61.5 210 C61 215 57 219 52 219 L26 219 C20 219 15.5 214 16 208 L29 94 C33 76 44 61 64 52 Z"
      fill="${c.fill}" stroke="${c.stroke}" stroke-width="1.5"/>
    <path d="M112 240 L188 240 C192 240 195 243 195 247 L195 290 C195 294 192 297 188 297 L112 297 C108 297 105 294 105 290 L105 247 C105 243 108 240 112 240 Z"
      fill="${c.fill}" stroke="${c.stroke}" stroke-width="1.5"/>
    <line x1="139" y1="62" x2="136" y2="94" stroke="${c.stroke}" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="161" y1="62" x2="164" y2="94" stroke="${c.stroke}" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="70" y1="294" x2="230" y2="294" stroke="${c.stroke}" stroke-width="1" opacity="0.6"/>
    ${quoteTextSVG(product, 150, 160)}
  </svg>`;
}

function crewSVG(product) {
  const c = GARMENT_COLORS[product.color];
  return `
  <svg viewBox="0 0 300 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${product.name} mockup">
    <path d="M97 38 C104 52 125 60 150 60 C175 60 196 52 203 38 L236 52 C256 61 267 76 271 94 L284 208 C284.5 214 280 219 274 219 L248 219 C243 219 239 215 238.5 210 L230 148 L230 286 C230 295 223 302 214 302 L86 302 C77 302 70 295 70 286 L70 148 L61.5 210 C61 215 57 219 52 219 L26 219 C20 219 15.5 214 16 208 L29 94 C33 76 44 61 64 52 Z"
      fill="${c.fill}" stroke="${c.stroke}" stroke-width="1.5"/>
    <path d="M100 36 C107 49 126 57 150 57 C174 57 193 49 200 36"
      fill="none" stroke="${c.stroke}" stroke-width="3"/>
    <line x1="70" y1="294" x2="230" y2="294" stroke="${c.stroke}" stroke-width="1" opacity="0.6"/>
    ${quoteTextSVG(product, 150, 155)}
  </svg>`;
}

function garmentSVG(product) {
  if (product.type === "hoodie") return hoodieSVG(product);
  if (product.type === "crew") return crewSVG(product);
  return teeSVG(product);
}

/* Homepage campaign image: local file -> CDN fallback (see scripts/download-images.sh) */
const CAMPAIGN_IMG = {
  local: "assets/img/campaign.webp",
  remote: "https://d8j0ntlcm91z4.cloudfront.net/user_3FdYPzBsaVWvMIu38NVKxnkIsQ6/hf_20260701_223203_0c4f9427-3ef3-429c-9cf1-a82174aec8e7_min.webp"
};

function getProduct(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}

function formatPrice(n) {
  return `$${n} USD`;
}
