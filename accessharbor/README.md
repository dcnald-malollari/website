# AccessHarbor — start here

You sell **European Accessibility Act (EAA) compliance audits** to e-commerce brands that sell into the EU. The law has been enforceable since June 28, 2025, enforcement is intensifying through 2026 (a French court just ordered Carrefour to fix its site in 6 months under daily penalties), and almost nobody is selling this yet. You are the sales layer; a white-label accessibility firm does the technical delivery.

**Your entire job, every day:** find prospects → run the scan → send them their own violations → book calls → close audits → hand delivery to your partner.

## What's in this folder

| Path | What it is |
|---|---|
| `index.html` | Your agency landing page (already passes its own accessibility scan) |
| `scan/` | **Your sales weapon.** One command turns any prospect URL into a branded violation report |
| `scan/reports/sample-report.html` | Example report — open it in a browser to see what prospects get |
| `playbook/01-setup.md` | Day 1–3: domain, email, DNS, LinkedIn — exact steps |
| `playbook/02-prospecting.md` | How to build your prospect list (20/day routine) |
| `playbook/03-outreach.md` | Cold email sequences + LinkedIn scripts, ready to paste |
| `playbook/04-sales.md` | Pricing, discovery call script, objection handling, proposal outline |
| `playbook/05-partners.md` | How to recruit the white-label delivery partner (do this week 1) |
| `playbook/06-legal-positioning.md` | What you may and may not claim; disclaimers to reuse |
| `pipeline-tracker.csv` | Your CRM until you outgrow it (open in Google Sheets) |

## Using the scan tool

```bash
cd accessharbor/scan
npm install                      # once
npx playwright install chromium  # once, on your own machine
node scan.js https://prospect.com --company "Prospect GmbH"
```

Open the generated file in `scan/reports/`, print it to PDF, attach it to your outreach email. Edit `scan/config.json` once with your real email and booking link — every report signs itself.

Scan multiple pages for a stronger report (home + product + checkout):

```bash
node scan.js https://prospect.com https://prospect.com/products/example --company "Prospect GmbH"
```

## Week 1 checklist

- [ ] Buy the domain (check accessharbor.com on Namecheap; fallbacks: accessharbor.io, getaccessharbor.com — or rename, everything is find-and-replace)
- [ ] Set up email + DNS and start mailbox warm-up (`playbook/01-setup.md`)
- [ ] Put `index.html` live (GitHub Pages, Netlify, or Cloudflare Pages — free)
- [ ] Update `scan/config.json` and the contact email in `index.html`
- [ ] Email 5 accessibility firms to line up your white-label partner (`playbook/05-partners.md`)
- [ ] Build your first list of 50 prospects (`playbook/02-prospecting.md`)
- [ ] Send your first 10 scan-led emails (`playbook/03-outreach.md`)

## The math

Cold outreach with a personalised violation report typically books calls at 3–5× the rate of generic cold email. At 20 emails/day: ~400/month → 15–30 calls → 3–6 audits at €4,500+ → **€13,500–27,000/month revenue**, of which your partner takes 50–60% of delivery. Recurring monitoring retainers stack on top and become the real business.
