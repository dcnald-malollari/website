#!/usr/bin/env node
/**
 * AccessHarbor prospect scan
 *
 * Usage:
 *   npm run scan -- https://prospect.com
 *   npm run scan -- https://prospect.com https://prospect.com/checkout --company "Prospect GmbH"
 *
 * Output: reports/<domain>-<date>.html  (open it, print to PDF, attach to your outreach email)
 *
 * Config: edit config.json once with your name/email/booking link — every report
 * is branded and signed automatically.
 */

import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------- args
const args = process.argv.slice(2);
const urls = [];
let company = '';
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--company') company = args[++i] ?? '';
  else if (args[i].startsWith('--')) console.warn(`Ignoring unknown flag ${args[i]}`);
  else urls.push(args[i].startsWith('http') ? args[i] : `https://${args[i]}`);
}
if (urls.length === 0) {
  console.error('Usage: npm run scan -- <url> [more urls...] [--company "Company Name"]');
  process.exit(1);
}

const config = JSON.parse(readFileSync(join(__dirname, 'config.json'), 'utf8'));
const domain = new URL(urls[0]).hostname.replace(/^www\./, '');
const prospect = company || domain;
const today = new Date().toISOString().slice(0, 10);

// EAA benchmark = EN 301 549, which incorporates WCAG 2.1 AA
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];
const IMPACT_ORDER = ['critical', 'serious', 'moderate', 'minor'];

// Map axe rule categories to the humans they lock out — this is what sells.
const WHO_IT_AFFECTS = [
  [/color-contrast/, 'People with low vision or color blindness (about 8% of men) may be unable to read this content.'],
  [/image-alt|input-image-alt|area-alt|object-alt|svg-img-alt/, 'Blind screen-reader users get no information from these images — including product photos.'],
  [/label|select-name|autocomplete/, 'Screen-reader users cannot tell what these form fields ask for, which typically breaks checkout and signup.'],
  [/link-name|button-name/, 'Screen-reader and voice-control users cannot tell what these buttons or links do.'],
  [/keyboard|focus|tabindex|scrollable-region/, 'People who cannot use a mouse (motor disabilities, many power users) cannot reach or operate this.'],
  [/html-has-lang|html-lang|valid-lang/, 'Screen readers may read the page in the wrong language, making it unintelligible.'],
  [/heading|landmark|region|bypass|page-has-heading/, 'Screen-reader users lose the page structure they rely on to navigate efficiently.'],
  [/aria-/, 'Assistive technology receives broken or misleading information about these controls.'],
  [/meta-viewport/, 'Low-vision users are blocked from zooming the page to a readable size.'],
  [/video-caption|audio-caption/, 'Deaf and hard-of-hearing users get no access to this media content.'],
  [/target-size/, 'People with motor impairments (and everyone on mobile) struggle to hit these controls.'],
];
const whoFor = (ruleId) => (WHO_IT_AFFECTS.find(([re]) => re.test(ruleId)) ?? [null, 'Users of assistive technology may be blocked or confused by this issue.'])[1];

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const trunc = (s, n) => (s.length > n ? s.slice(0, n) + '…' : s);

// ---------------------------------------------------------------- scan
async function launch() {
  try {
    return await chromium.launch({ headless: true });
  } catch {
    // Managed environments ship Chromium at a fixed path; fall back to it.
    return await chromium.launch({ headless: true, executablePath: process.env.SCAN_CHROME_PATH || '/opt/pw-browsers/chromium' });
  }
}

const browser = await launch();
const context = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  viewport: { width: 1366, height: 900 },
});

const pageResults = [];
for (const url of urls) {
  const page = await context.newPage();
  process.stdout.write(`Scanning ${url} ... `);
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2500); // let client-side rendering settle
    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    pageResults.push({ url, violations: results.violations, error: null });
    console.log(`${results.violations.length} violation types found`);
  } catch (err) {
    pageResults.push({ url, violations: [], error: err.message });
    console.log(`FAILED (${err.message.split('\n')[0]})`);
  }
  await page.close();
}
await browser.close();

// ------------------------------------------------------- aggregate
// Merge violations across pages by rule id.
const byRule = new Map();
for (const { url, violations } of pageResults) {
  for (const v of violations) {
    const entry = byRule.get(v.id) ?? { ...v, pages: new Set(), instances: 0, samples: [] };
    entry.pages.add(url);
    entry.instances += v.nodes.length;
    for (const n of v.nodes.slice(0, 3)) {
      if (entry.samples.length < 3) entry.samples.push({ target: n.target.join(' '), html: n.html });
    }
    byRule.set(v.id, entry);
  }
}
const rules = [...byRule.values()].sort(
  (a, b) => IMPACT_ORDER.indexOf(a.impact ?? 'minor') - IMPACT_ORDER.indexOf(b.impact ?? 'minor')
);
const counts = Object.fromEntries(IMPACT_ORDER.map((i) => [i, 0]));
let totalInstances = 0;
for (const r of rules) {
  counts[r.impact ?? 'minor'] += r.instances;
  totalInstances += r.instances;
}
const scannedOk = pageResults.filter((p) => !p.error);

// ---------------------------------------------------------------- report
const impactBadge = (impact) => `<span class="badge badge-${impact}">${impact}</span>`;

const findingsHtml = rules
  .map(
    (r) => `
  <section class="finding">
    <h3>${impactBadge(r.impact ?? 'minor')} ${esc(r.help)}</h3>
    <p class="meta">${r.instances} instance${r.instances === 1 ? '' : 's'} · rule <code>${esc(r.id)}</code> · <a href="${esc(r.helpUrl)}">remediation guidance</a></p>
    <p>${esc(r.description)}</p>
    <p class="who"><strong>Who this locks out:</strong> ${esc(whoFor(r.id))}</p>
    <details>
      <summary>Example occurrences</summary>
      ${r.samples.map((s) => `<pre><code>${esc(trunc(s.html, 300))}</code></pre><p class="meta">Selector: <code>${esc(trunc(s.target, 120))}</code></p>`).join('')}
    </details>
  </section>`
  )
  .join('\n');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Accessibility Compliance Snapshot — ${esc(prospect)}</title>
<style>
  :root { --navy:#0d2137; --blue:#1460aa; --ink:#1a2733; --muted:#5a6b7b; --line:#dde5ec; --bg:#f6f9fc; }
  * { box-sizing:border-box; margin:0; }
  body { font-family:-apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color:var(--ink); line-height:1.6; background:var(--bg); }
  .page { max-width:820px; margin:0 auto; padding:2.5rem 1.5rem; }
  .cover { background:var(--navy); color:#fff; padding:3rem 1.5rem; }
  .cover .page { padding:0 1.5rem; }
  .brand { font-weight:800; letter-spacing:.04em; font-size:1.05rem; text-transform:uppercase; }
  .brand span { color:#7fd1c0; }
  h1 { font-size:2rem; margin:1.2rem 0 .4rem; line-height:1.2; }
  .cover p { color:#c3d2df; max-width:44rem; }
  h2 { font-size:1.35rem; margin:2.4rem 0 .8rem; color:var(--navy); }
  h3 { font-size:1.05rem; margin:0 0 .3rem; }
  .cards { display:grid; grid-template-columns:repeat(auto-fit, minmax(150px,1fr)); gap:.8rem; margin:1.2rem 0; }
  .card { background:#fff; border:1px solid var(--line); border-radius:8px; padding:1rem; text-align:center; }
  .card .num { font-size:1.9rem; font-weight:800; }
  .card .lbl { font-size:.8rem; color:var(--muted); text-transform:uppercase; letter-spacing:.05em; }
  .card.critical .num { color:#b3261e; } .card.serious .num { color:#c4570c; }
  .card.moderate .num { color:#8a6d00; } .card.minor .num { color:var(--muted); }
  .badge { display:inline-block; font-size:.7rem; font-weight:700; text-transform:uppercase; letter-spacing:.05em; padding:.15rem .5rem; border-radius:99px; vertical-align:middle; margin-right:.4rem; }
  .badge-critical { background:#fbd5d3; color:#8f1d17; } .badge-serious { background:#fde3cf; color:#8a3c06; }
  .badge-moderate { background:#f6ecc4; color:#6b5400; } .badge-minor { background:#e3e9ee; color:#44525f; }
  .finding { background:#fff; border:1px solid var(--line); border-radius:8px; padding:1.2rem 1.4rem; margin:1rem 0; }
  .finding .meta { font-size:.85rem; color:var(--muted); margin-bottom:.5rem; }
  .finding .who { margin-top:.5rem; }
  details { margin-top:.7rem; } summary { cursor:pointer; color:var(--blue); font-size:.9rem; }
  pre { background:#f0f4f8; border-radius:6px; padding:.7rem; overflow-x:auto; font-size:.78rem; margin:.6rem 0 .2rem; }
  table { border-collapse:collapse; width:100%; background:#fff; font-size:.92rem; }
  th, td { border:1px solid var(--line); padding:.55rem .8rem; text-align:left; }
  th { background:var(--bg); }
  .note { background:#fff8e6; border:1px solid #eadf9e; border-radius:8px; padding:1rem 1.2rem; font-size:.92rem; }
  .cta { background:var(--navy); color:#fff; border-radius:10px; padding:1.6rem; margin:2.5rem 0 1rem; }
  .cta a.btn { display:inline-block; background:#7fd1c0; color:#0d2137; font-weight:700; padding:.7rem 1.3rem; border-radius:8px; text-decoration:none; margin-top:.8rem; }
  .cta a { color:#9fe3d4; }
  footer { font-size:.8rem; color:var(--muted); margin-top:2rem; border-top:1px solid var(--line); padding-top:1rem; }
  a { color:var(--blue); }
  @media print { .cover { -webkit-print-color-adjust:exact; print-color-adjust:exact; } details { display:block; } .finding { break-inside:avoid; } }
</style>
</head>
<body>
<div class="cover">
  <div class="page">
    <div class="brand">Access<span>Harbor</span></div>
    <h1>Accessibility Compliance Snapshot</h1>
    <p><strong>${esc(prospect)}</strong> · ${scannedOk.map((p) => esc(new URL(p.url).pathname === '/' ? new URL(p.url).hostname : new URL(p.url).hostname + new URL(p.url).pathname)).join(', ')} · ${today}</p>
    <p>Automated assessment against WCAG 2.1 AA — the standard referenced by EN 301 549, the compliance benchmark of the European Accessibility Act (EAA).</p>
  </div>
</div>
<div class="page">
  <h2>Executive summary</h2>
  <p>Our automated scan detected <strong>${totalInstances} accessibility violation${totalInstances === 1 ? '' : 's'}</strong> across ${rules.length} distinct issue type${rules.length === 1 ? '' : 's'} on ${scannedOk.length} page${scannedOk.length === 1 ? '' : 's'}. Each one is a barrier for real customers — and a compliance gap under the European Accessibility Act, which has been enforceable in all 27 EU member states since June 28, 2025.</p>
  <div class="cards">
    <div class="card critical"><div class="num">${counts.critical}</div><div class="lbl">Critical</div></div>
    <div class="card serious"><div class="num">${counts.serious}</div><div class="lbl">Serious</div></div>
    <div class="card moderate"><div class="num">${counts.moderate}</div><div class="lbl">Moderate</div></div>
    <div class="card minor"><div class="num">${counts.minor}</div><div class="lbl">Minor</div></div>
  </div>

  <h2>Why this matters now</h2>
  <ul>
    <li><strong>The EAA applies to you if you sell to EU consumers</strong> — including e-commerce companies based outside the EU.</li>
    <li><strong>Enforcement is live.</strong> In June 2026 a French court ordered Carrefour to make its site and app fully accessible within six months, under daily penalties.</li>
    <li><strong>Penalties vary by member state</strong> — examples below.</li>
  </ul>
  <table>
    <caption class="meta" style="text-align:left; padding:.4rem 0; color:var(--muted); font-size:.85rem;">Example maximum penalties under national EAA implementations</caption>
    <tr><th scope="col">Country</th><th scope="col">Maximum penalty</th></tr>
    <tr><td>Germany</td><td>Up to €100,000 per violation</td></tr>
    <tr><td>France</td><td>Up to €250,000, plus €25,000/yr for a missing accessibility statement</td></tr>
    <tr><td>Spain</td><td>Up to €1,000,000 for very serious violations</td></tr>
    <tr><td>Ireland</td><td>Fines up to €60,000 and/or imprisonment up to 18 months</td></tr>
  </table>

  <h2>Findings</h2>
  ${findingsHtml || '<p>No automated violations detected on the scanned pages. A manual audit is still required for full WCAG 2.1 AA coverage.</p>'}
  ${pageResults.filter((p) => p.error).map((p) => `<p class="note">Note: ${esc(p.url)} could not be scanned (${esc(p.error.split('\n')[0])}).</p>`).join('')}

  <h2>Scope and limitations</h2>
  <p class="note">This is an automated snapshot, not a certification. Automated tools reliably detect only a portion (typically 30–40%) of WCAG 2.1 AA success criteria — issues like keyboard traps, focus order, screen-reader task flows, and meaningful alt text require expert manual testing. A clean automated scan does <strong>not</strong> mean a site is EAA-compliant; a full audit against EN 301 549 is the recognised path. This document is provided for information purposes and is not legal advice.</p>

  <div class="cta">
    <h2 style="color:#fff; margin-top:0;">Next step: a full EN 301 549 audit</h2>
    <p>AccessHarbor delivers certified manual audits, a prioritised remediation plan your developers can execute, and the accessibility statement the EAA requires — typically within 3 weeks.</p>
    <a class="btn" href="${esc(config.bookingUrl)}">Book a 20-minute compliance review</a>
    <p style="margin-top:.8rem; font-size:.9rem;">Or reply directly: <a href="mailto:${esc(config.email)}">${esc(config.email)}</a> — ${esc(config.yourName)}, ${esc(config.brand)}</p>
  </div>

  <footer>
    <p>Prepared by ${esc(config.brand)} (${esc(config.website)}) on ${today}, using axe-core automated testing against WCAG 2.1 A/AA. © ${today.slice(0, 4)} ${esc(config.brand)}. Report prepared for ${esc(prospect)}; figures reflect only the pages and date listed above.</p>
  </footer>
</div>
</body>
</html>`;

const outDir = join(__dirname, 'reports');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, `${domain}-${today}.html`);
writeFileSync(outFile, html);

console.log('\n────────────────────────────────────────');
console.log(`  ${prospect}: ${totalInstances} violations (${counts.critical} critical, ${counts.serious} serious)`);
console.log(`  Report: ${outFile}`);
console.log('  → Open it, print to PDF, attach to your outreach email.');
console.log('────────────────────────────────────────');
