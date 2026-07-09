# AccessHarbor — live status

> **Purpose of this file:** the single source of truth for where the business stands.
> If you're a new Claude session (or future Donald): read this + `README.md` + `playbook/`, then check `pipeline-tracker.csv` for per-company detail. Update this file as things change.

_Last updated: 2026-07-09 morning (Europe time)._

## Where things stand

- **Business:** selling EAA (European Accessibility Act) compliance audits to e-commerce brands selling into the EU. Operator: Donald Malollari (donaldmalollarii@gmail.com — non-technical; keep instructions simple and copy-pasteable).
- **Tooling:** scan tool works on Donald's MacBook Air (`accessharbor/scan`, run from Terminal). Reports live in `scan/reports/` on his machine.
- **18 prospect pitches** sent or queued across FR/DE/AT/SE/ES/IT/UK/US (see tracker). Sent from Gmail; drafts are created by Claude directly in Donald's Gmail via the Gmail integration.
- **5 white-label delivery partners pitched** (2026-07-09): Captain Coder (hello@captcoder.com), AccessAudit (compliance@accessaudit.co), Accessible Pixels (hello@accessiblepixels.com — guessed address), plus contact forms at digitalaccessibilityaudit.com and whitelabeliq.com. **No partner signed yet — this is the open bottleneck.**
- **Infrastructure LIVE as of 2026-07-09:** domain accessharbor.org (Namecheap) · landing page live on Netlify at accessharbor.org (redeploy = drag `site` folder with index.html to Netlify Deploys) · donald@accessharbor.org on Google Workspace with SPF/DKIM/DMARC all active · Calendly: https://calendly.com/donald-accessharbor/30min · mail-tester scored 6.8 pre-DKIM-activation, retest due (expect 9+). Warm-up phase until ~Jul 23 (2–3 sends/day ramping); cold outreach stays on gmail (~10/day) until cutover. Claude's Gmail integration sees BOTH accounts.

## Cadence (as of Thu 2026-07-09)

- **Thu 7/9:** 10 pitches fired at ~9am (1 bounce: info@purelei.com — corrected draft to aloha@purelei.com created, Donald to re-send). Partner pitches sent.
- **Fri 7/10:** send queued drafts: Blue Banana, Ideal of Sweden, Velasca.
- **Sat 7/11:** follow-ups (playbook 03, "Email 2", reply in-thread) for Wed 7/8 batch: Rhone, Four Sigmatic, Rouje, Organic Basics, Represent.
- **Mon/Tue 7/13-14:** follow-ups for Thu 7/9 batch.
- Early signals: Polène auto-forwarded internally by a human ("Pia") within minutes; Rouje + Tikamoon ticketed (ticket 01109648).

## Playbook decisions already made

- Target market: US/intl + EU-based e-commerce brands (EU-based = automatically in scope; best angle).
- Model: agency with white-label delivery partner; pricing per `playbook/04-sales.md` (audit €4,500–9,000; partner cost target €1,200–2,000, walk away above €2,500; monitoring €500–1,500/mo).
- Outreach style: scan-report-attached cold email, one CTA, opt-out line for DE/AT recipients (strict cold-email law there — keep German sends low-volume and personalized).
- High-conversion targeting: France post-Carrefour-ruling; brands with accessibility statements that still fail scans; brands using overlay widgets; high-ticket verticals.

## What a new session should know how to do

1. **New prospects:** verify EU scope (EU-based, or € switcher/EU shipping page), then Donald scans: `node scan.js https://site.com --company "Name"` (from `accessharbor/scan` on his machine).
2. **Drafts:** find contact via web search (founder-direct > published inbox > info@ with forward-request line), then create Gmail drafts for Donald with recipient filled in; he attaches the PDF report and sends. Template style: see sent examples in his Gmail or playbook 03.
3. **Replies:** Donald pastes them in (or check Gmail); script the response; goal = 20-min call; then playbook 04 (call script, pricing, proposal).
4. **Bench (scanned, not yet pitched):** Vuori 10 violations (no contact found yet), Sessùn 9, CLUSE 8, Junglück 7, Cabaïa 6, Bonsoirs 5, Le Slip Français 5, True Classic 5, Mejuri 5. Skipped as too clean: Buck Mason, Ridge, Snocks, KoRo, MR MARVIS, Asphalte, Balibaris, Horace, Moon Juice, Sézane, Finisterre. Kapten & Son blocks scanners.
