# CRYPTO® — WEAR THE LARP

Storefront for CRYPTO, a limited-run clothing label built for an Instagram-first audience (18–25). Drop-culture format: quote tees and hoodies, limited runs, no restocks.

**Note:** "CRYPTO" is a placeholder brand name. All products, prices, and imagery are mockups — swap in real designs and product photos when ready.

## Stack

Pure static site — HTML, CSS, vanilla JS. No build step, no dependencies. Deploy the folder as-is to GitHub Pages, Netlify, Vercel, or any static host.

## Structure

```
index.html      Landing page — hero, Drop 001 grid, about, Instagram CTA
product.html    Product detail page (reads ?id= from js/products.js)
css/style.css   All styling
js/products.js  Product catalog + SVG garment mockup rendering
js/main.js      Cart (localStorage), drawer, filters, toasts
js/product.js   Product page logic (sizes, add to cart, related items)
```

## Editing products

All products live in `js/products.js`. Each entry has an id, name, type (`tee`/`hoodie`), color (`black`/`bone`), price, quote lines, optional badge, and sold-out flag. Product mockups are generated as SVG from the quote text — replace `garmentSVG()` usage with real product photos when designs exist.

## Notes

- Checkout is intentionally "locked until drop" with an email capture — no payment processing is wired up yet.
- Instagram/TikTok/X links point at the platform homepages — update to real profiles.
- Newsletter forms are front-end only; connect to a mail provider (e.g. Mailchimp, Klaviyo) later.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```
