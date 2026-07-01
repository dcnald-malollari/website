/* CRYPTO® — product catalog (Drop 001)
   Mock data only — swap in real designs/photos when ready. */

const PRODUCTS = [
  {
    id: "trust-me-bro-tee",
    name: "TRUST ME BRO TEE",
    type: "tee",
    color: "black",
    price: 38,
    lines: ["TRUST ME", "BRO"],
    badge: "NEW",
    soldOut: false,
    desc: "The quote that has lost more money than any market crash. Heavyweight 240GSM cotton, boxy fit, printed front center."
  },
  {
    id: "not-financial-advice-tee",
    name: "NOT FINANCIAL ADVICE TEE",
    type: "tee",
    color: "bone",
    price: 38,
    lines: ["NOT", "FINANCIAL", "ADVICE"],
    badge: "NEW",
    soldOut: false,
    desc: "Say it before every terrible opinion. Legally it does nothing. Heavyweight 240GSM cotton in bone, boxy fit."
  },
  {
    id: "i-was-early-tee",
    name: "I WAS EARLY TEE",
    type: "tee",
    color: "black",
    price: 40,
    lines: ["I WAS", "EARLY"],
    badge: "LOW STOCK",
    soldOut: false,
    desc: "You weren't. But the shirt says otherwise. Heavyweight 240GSM cotton, boxy fit, printed front center."
  },
  {
    id: "funds-are-safe-tee",
    name: "FUNDS ARE SAFE TEE",
    type: "tee",
    color: "bone",
    price: 38,
    lines: ["FUNDS ARE", "SAFE"],
    badge: null,
    soldOut: false,
    desc: "Famous last words, now in cotton. Heavyweight 240GSM in bone, boxy fit, printed front center."
  },
  {
    id: "sold-the-bottom-tee",
    name: "SOLD THE BOTTOM TEE",
    type: "tee",
    color: "black",
    price: 38,
    lines: ["SOLD THE", "BOTTOM"],
    badge: null,
    soldOut: true,
    desc: "For the humble. Wear your worst trade. Heavyweight 240GSM cotton, boxy fit. Sold out — the quote has retired."
  },
  {
    id: "delete-the-app-tee",
    name: "DELETE THE APP TEE",
    type: "tee",
    color: "black",
    price: 40,
    lines: ["DELETE", "THE APP"],
    badge: null,
    soldOut: false,
    desc: "Self care for people who check charts in the shower. Heavyweight 240GSM cotton, boxy fit."
  },
  {
    id: "up-only-hoodie",
    name: "UP ONLY HOODIE",
    type: "hoodie",
    color: "black",
    price: 72,
    lines: ["UP ONLY"],
    badge: "NEW",
    soldOut: false,
    desc: "Manifest it. 450GSM brushed fleece, oversized fit, kangaroo pocket, printed front center."
  },
  {
    id: "generational-wealth-hoodie",
    name: "GENERATIONAL WEALTH HOODIE",
    type: "hoodie",
    color: "bone",
    price: 72,
    lines: ["GENERATIONAL", "WEALTH", "(LOADING...)"],
    badge: null,
    soldOut: false,
    desc: "Any day now. 450GSM brushed fleece in bone, oversized fit, kangaroo pocket, printed front center."
  }
];

/* ---- Garment mockup rendering (SVG) ---- */

const GARMENT_COLORS = {
  black: { fill: "#1a1a1a", stroke: "#333333", text: "#ece7dc" },
  bone:  { fill: "#ece7dc", stroke: "#c9c2b2", text: "#141414" }
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
    `<text x="${cx}" y="${brandY.toFixed(1)}" text-anchor="middle" font-family="'Space Mono', monospace" font-size="7" fill="${c.text}" opacity="0.55">CRYPTO®</text>`;
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

function garmentSVG(product) {
  return product.type === "hoodie" ? hoodieSVG(product) : teeSVG(product);
}

function getProduct(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}

function formatPrice(n) {
  return `$${n} USD`;
}
