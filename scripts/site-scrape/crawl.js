// One-time crawler for www.bumperballchicago.com — runs on a GitHub Actions runner.
// Saves every internal page's HTML + visible text, downloads every image,
// and takes full-page screenshots for design reference. Output: ../../scrape-dump/
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const OUT = path.resolve(__dirname, '../../scrape-dump');
const IMG = path.join(OUT, 'images');
const SHOT = path.join(OUT, 'screenshots');
for (const d of [OUT, IMG, SHOT]) fs.mkdirSync(d, { recursive: true });

const ROOT = 'https://www.bumperballchicago.com';
const seen = new Set();
const queue = ['/'];
const pageData = [];
const imageUrls = new Map(); // url -> {alt, from}

function norm(u) {
  try {
    const url = new URL(u, ROOT);
    if (url.hostname.replace(/^www\./, '') !== 'bumperballchicago.com') return null;
    url.hash = '';
    url.search = '';
    let p = url.pathname;
    if (!p.endsWith('/') && !/\.[a-z0-9]{2,5}$/i.test(p)) p += '/';
    if (/\.(jpg|jpeg|png|gif|webp|svg|ico|pdf|css|js|woff2?)$/i.test(p)) return null;
    return p;
  } catch { return null; }
}

function slugFor(p) {
  return p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/[^a-z0-9_.-]+/gi, '_').slice(0, 120);
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
  });
  const page = await ctx.newPage();

  while (queue.length && seen.size < 80) {
    const p = queue.shift();
    if (seen.has(p)) continue;
    seen.add(p);
    const url = ROOT + p;
    try {
      const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(2000);
      const status = resp ? resp.status() : 0;
      const html = await page.content();
      const text = await page.evaluate(() => document.body ? document.body.innerText : '');
      const title = await page.title();
      const meta = await page.evaluate(() => {
        const out = {};
        for (const m of document.querySelectorAll('meta[name], meta[property]')) {
          out[m.getAttribute('name') || m.getAttribute('property')] = m.getAttribute('content');
        }
        return out;
      });
      const links = await page.evaluate(() =>
        Array.from(document.querySelectorAll('a[href]')).map(a => ({ href: a.href, text: (a.innerText || '').trim().slice(0, 100) })));
      const images = await page.evaluate(() =>
        Array.from(document.querySelectorAll('img')).map(i => ({ src: i.src, alt: i.alt || '', w: i.naturalWidth, h: i.naturalHeight })));
      const bgImages = await page.evaluate(() => {
        const out = [];
        for (const el of document.querySelectorAll('*')) {
          const bg = getComputedStyle(el).backgroundImage;
          if (bg && bg.includes('url(')) {
            const m = bg.match(/url\(["']?([^"')]+)["']?\)/g) || [];
            for (const u of m) out.push(u.replace(/url\(["']?/, '').replace(/["']?\)$/, ''));
          }
        }
        return [...new Set(out)];
      });

      const slug = slugFor(p);
      fs.writeFileSync(path.join(OUT, slug + '.html'), html);
      fs.writeFileSync(path.join(OUT, slug + '.txt'),
        `URL: ${url}\nSTATUS: ${status}\nTITLE: ${title}\nMETA: ${JSON.stringify(meta)}\n\n${text}`);
      try { await page.screenshot({ path: path.join(SHOT, slug + '.png'), fullPage: true }); } catch {}

      for (const im of images) if (im.src && im.src.startsWith('http')) imageUrls.set(im.src, { alt: im.alt, from: p });
      for (const bg of bgImages) { try { const abs = new URL(bg, url).href; if (abs.startsWith('http')) imageUrls.set(abs, { alt: '(background)', from: p }); } catch {} }

      pageData.push({ path: p, status, title, meta, links, images, bgImages });
      console.log(`[${status}] ${p} — "${title}" (${links.length} links, ${images.length} imgs)`);
      for (const l of links) {
        const n = norm(l.href);
        if (n && !seen.has(n) && !queue.includes(n)) queue.push(n);
      }
    } catch (e) {
      console.log(`[ERR] ${p}: ${String(e.message).split('\n')[0]}`);
      pageData.push({ path: p, error: String(e.message).split('\n')[0] });
    }
  }

  // Download all discovered images (cap sizes to keep the commit sane).
  const manifest = [];
  let total = 0;
  for (const [u, info] of imageUrls) {
    if (total > 60 * 1024 * 1024) { console.log('image budget reached, skipping rest'); break; }
    try {
      const r = await ctx.request.get(u, { timeout: 30000 });
      if (!r.ok()) { console.log(`[img ${r.status()}] ${u}`); continue; }
      const buf = await r.body();
      if (buf.length < 200 || buf.length > 15 * 1024 * 1024) continue;
      const extM = new URL(u).pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i);
      const ext = extM ? extM[1].toLowerCase() : 'bin';
      const name = crypto.createHash('md5').update(u).digest('hex').slice(0, 10) + '_' +
        (new URL(u).pathname.split('/').pop() || 'img').replace(/[^a-z0-9_.-]+/gi, '_').slice(0, 60);
      const file = name.includes('.') ? name : name + '.' + ext;
      fs.writeFileSync(path.join(IMG, file), buf);
      total += buf.length;
      manifest.push({ url: u, file, bytes: buf.length, alt: info.alt, from: info.from });
      console.log(`[img ok] ${file} (${Math.round(buf.length / 1024)}KB) from ${info.from}`);
    } catch (e) {
      console.log(`[img err] ${u}: ${String(e.message).split('\n')[0]}`);
    }
  }

  fs.writeFileSync(path.join(OUT, '_pages.json'), JSON.stringify(pageData, null, 2));
  fs.writeFileSync(path.join(OUT, '_images.json'), JSON.stringify(manifest, null, 2));
  console.log(`\nDone. ${seen.size} pages, ${manifest.length} images (${Math.round(total / 1024 / 1024 * 10) / 10}MB).`);
  await browser.close();
})();
