# AccessHarbor — live status

> **Purpose of this file:** the single source of truth for where the business stands.
> If you're a new Claude session (or future Donald): read this + `README.md` + `playbook/`, then check `pipeline-tracker.csv` for per-company detail. Update this file as things change.

_Last updated: 2026-07-20 (evening ET)._

## Where things stand

- **Business:** AccessHarbor sells web-compliance audits to mid-size e-commerce brands. Operator: Donald Malollari (donaldmalollarii@gmail.com — non-technical; keep instructions simple and copy-pasteable). **Now three arms on one machine (same brand, email, Calendly, partner):**
  1. **EAA / EU accessibility** (original) — WCAG 2.1 AA audits for brands selling into the EU. Playbooks 01–06.
  2. **AccessHarbor USA / ADA** (added 2026-07-20) — *same scan tool, same reports*, US demand-letter angle. ~4,000 ADA website lawsuits filed in 2025, ~70% e-commerce, 46% repeat defendants. US brands answer their phones in-timezone. Playbook `08-usa-ada-arm.md`.
  3. **MailCheck / email security** (added 2026-07-20) — DMARC/SPF/DKIM gaps ("anyone can send email as your brand"). **Claude runs `mailcheck/mailcheck.py` entirely from the cloud — no laptop needed.** Grades F/D = pitch, B/C/A = skip. Best channel is phone + warm threads, not cold email. Playbook `07-mailcheck-email-security.md`.
- **Tooling:** accessibility scan runs on Donald's MacBook Air (`accessharbor/scan`, Terminal; reports in `scan/reports/`). MailCheck runs in the cloud session (`accessharbor/mailcheck`, `pip install dnspython`).
- **Live MailCheck pitch list (worst first):** F = Meller, HOFF · D = Cotopaxi, Four Sigmatic, True Classic, Chubbies, Buck Mason, Mack Weldon, Polène, Velasca, Rouje, Organic Basics, Tediber, Balzac Paris, PURELEI, Ideal of Sweden, Blue Banana, Lucy & Yak. (Skip B/C/A: Rhone A, Rothy's/BÉIS/Tikamoon/waterdrop/Represent/Jimmy Fairly B, Vuori/Devialet/Faherty C.) Meller + HOFF are F on BOTH arms — combined call scripts ready.
- **18 prospect pitches** sent or queued across FR/DE/AT/SE/ES/IT/UK/US (see tracker). Sent from Gmail; drafts are created by Claude directly in Donald's Gmail via the Gmail integration.
- **5 white-label delivery partners pitched** (2026-07-09): Captain Coder (hello@captcoder.com), AccessAudit (compliance@accessaudit.co), Accessible Pixels (hello@accessiblepixels.com — guessed address), plus contact forms at digitalaccessibilityaudit.com and whitelabeliq.com. **No partner signed yet — this is the open bottleneck.**
- **Infrastructure (updated 2026-07-16):** domain accessharbor.org (Namecheap) · landing page live on Netlify at accessharbor.org (redeploy = drag `site` folder with index.html to Netlify Deploys) · **EMAIL ARCHITECTURE CHANGED:** Google Workspace cancelled (cost); donald@accessharbor.org is now a FREE Namecheap forward → donaldmalollarii@gmail.com (tested working; SPF updated to spf.efwd.registrar-servers.com). All sending happens from gmail; the .org address remains the public-facing contact everywhere (website, reports, signatures) — do NOT change those. No cutover plan anymore; cold-send ceiling stays ~10–15/day on gmail, so LinkedIn + phone are the volume channels. Calendly: https://calendly.com/donald-accessharbor/30min (link unchanged). **Pending login migrations before Workspace trial lapses (~Jul 23): Calendly account login, Google Business Profile ownership, Netlify login — move each to donaldmalollarii@gmail.com.**

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

## Recent activity (2026-07-20)

- **9 clean sends today**, 0 bounces, drafts empty: Rhone (service@), Velasca + Rouje 3rd touches, Devialet missed-call reply, BÉIS (hello@) + Lucas reply + Beach House Group parent (businessinquiries@beachhousegrp.com), Rothy's, Vuori. All verified in Sent.
- **BÉIS:** Lucas gave a full call recap by email and pointed us to the parent-co address — warmest US thread. **Devialet** called back (+33 9 73 72 85 90). **Four Sigmatic:** Aranza opened a text channel 7/20 (they don't do callbacks — assist by text); reply sent pointing her to the report subject line.
- **Two new arms built + committed** (tool, playbooks 07–08, this file).
- **Overnight watches armed** (send_later ~9:25pm + ~2:25am ET) sweeping both accounts for replies/bookings/bounces; morning Routine 8am ET.
- **Tomorrow's call window (8–11am ET, Google Voice):** Meller +34 938 085 530 (F on both arms), HOFF +34 966 655 980 (F on both), Tikamoon +44 20 3514 7098, Polène +33 1 70 70 08 83, Devialet callback +33 9 73 72 85 90. US afternoon: Cotopaxi 1-844-268-6729 (38 viol/29 critical + ADA angle + MailCheck D).

## What a new session should know how to do

1. **New prospects:** verify EU scope (EU-based, or € switcher/EU shipping page), then Donald scans: `node scan.js https://site.com --company "Name"` (from `accessharbor/scan` on his machine).
2. **Drafts:** find contact via web search (founder-direct > published inbox > info@ with forward-request line), then create Gmail drafts for Donald with recipient filled in; he attaches the PDF report and sends. Template style: see sent examples in his Gmail or playbook 03.
3. **Replies:** Donald pastes them in (or check Gmail); script the response; goal = 20-min call; then playbook 04 (call script, pricing, proposal).
4. **Bench (scanned, not yet pitched):** Vuori 10 violations (no contact found yet), Sessùn 9, CLUSE 8, Junglück 7, Cabaïa 6, Bonsoirs 5, Le Slip Français 5, True Classic 5, Mejuri 5. Skipped as too clean: Buck Mason, Ridge, Snocks, KoRo, MR MARVIS, Asphalte, Balibaris, Horace, Moon Juice, Sézane, Finisterre. Kapten & Son blocks scanners.
