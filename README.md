# ALLEGEDLY® — NOTHING HAS BEEN CONFIRMED

Storefront for ALLEGEDLY, a limited-run clothing label built for an Instagram-first audience (18–25). Drop-culture format: deadpan quote tees, hoodies, and crewnecks — heavyweight cotton, slightly oversized, no restocks.

Instagram: [@dcnald](https://instagram.com/dcnald)

## Stack

Pure static site — HTML, CSS, vanilla JS. No build step, no dependencies. Deploy the folder as-is to GitHub Pages, Netlify, Vercel, or any static host.

## Structure

```
index.html                  Landing — hero, Drop 001 grid, campaign image, plug strip, about
product.html                Product detail page (reads ?id=; photo gallery + mockup)
info.html                   Shipping, returns, size guide, FAQ, contact
referral.html               The Plug Program — 20% referral signup + code generator
css/style.css               All styling
js/products.js              Product catalog (14 pieces), photo URLs, SVG garment mockups
js/main.js                  Cart, drawer, filters, referral capture, email popup
js/product.js               PDP logic (gallery, sizes, add to cart, related)
js/referral.js              Plug Program code generation + persistence
scripts/download-images.sh  Localizes CDN-hosted photos into assets/img/
```

## Product photos

Product/campaign photos are AI-generated (Higgsfield Soul) and currently **hot-linked from the Higgsfield CDN**. Every image resolves in this order: local file in `assets/img/` → CDN URL → SVG mockup fallback, so nothing ever looks broken.

To make the site self-contained (recommended before heavy promotion), run from any machine with normal internet access:

```bash
bash scripts/download-images.sh
git add assets/img && git commit -m "Localize product photos" && git push
```

## Editing products

All products live in `js/products.js` — id, name, type (`tee`/`hoodie`/`crew`), category (`tee`/`fleece`), color (`black`/`bone`/`grey`), price, quote lines, badge, sold-out flag, photo paths, description.

## Launch status

- Checkout is intentionally "locked until drop" with email capture — wire up Shopify Buy Button or Stripe Payment Links when ready to take money.
- Newsletter forms + the 10%-off popup (code `ALLEGED10`) are front-end only — connect Mailchimp/Klaviyo, and create the discount code in the commerce platform when payments go live.
- **Plug Program (referrals):** visitors generate a code on `referral.html`; `?ref=` links tag visitors for 30 days (localStorage) and surface in the cart/checkout. Actual commission tracking + payouts need the commerce backend — on Shopify, migrate this to an affiliate app (e.g. UpPromote/Refersion) and keep the same 20% terms.
- Contact email in `info.html` is a placeholder (`allegedly.worldwide@gmail.com`) — create it or swap in your real one.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```
