# 01 — Setup (days 1–3)

Goal: a domain, a warmed-up mailbox, a live landing page, and a credible LinkedIn profile. Budget: ~€25 one-time + ~€6/month.

## 1. Domain (15 min, ~€10/yr)

1. Go to Namecheap (or Cloudflare Registrar) and check **accessharbor.com**.
2. If taken, in order: `accessharbor.io`, `getaccessharbor.com`, `accessharbor.eu`, `accessharbor.agency`. If you'd rather rename entirely, everything in this folder is plain-text find-and-replace on "AccessHarbor".
3. Buy only the domain. Skip every upsell.

## 2. Email (30 min, ~€6/mo)

1. Sign up for **Google Workspace Starter** (or Zoho Mail if you want free) on the new domain.
2. Create `donald@` — a human name, not `info@` or `sales@`. B2B buyers reply to people.
3. Add the DNS records the provider gives you. All three matter for deliverability:
   - **SPF** (TXT record) — authorises Google to send for your domain
   - **DKIM** (TXT record) — enable in Workspace Admin → Apps → Gmail → Authenticate email
   - **DMARC** (TXT record): `v=DMARC1; p=none; rua=mailto:donald@yourdomain.com`
4. Verify at [mail-tester.com](https://www.mail-tester.com) — you want 9+/10 before any outreach.

## 3. Warm-up (runs in background, 14 days)

A brand-new mailbox that suddenly sends 20 cold emails/day lands in spam. For the first two weeks:

- Days 1–3: send 2–3 normal emails a day to friends/your own accounts; get replies.
- Days 4–14: ramp to 5, 10, then 15 outbound/day. Keep it under 30/day for month one, always.
- Do LinkedIn outreach (needs no warm-up) during these two weeks — see `03-outreach.md`.

## 4. Landing page live (20 min, free)

Easiest path with this repo: **GitHub Pages**.

1. Repo → Settings → Pages → deploy from branch, folder `/` (or move `accessharbor/` to its own repo later).
2. Point the domain at it (Pages → Custom domain; add the CNAME record at your registrar).
3. Before going live, update in `index.html`: the contact email (2 places), and in `scan/config.json`: email, website, booking link.
4. Create a free [Calendly](https://calendly.com) account, make a "20-minute compliance review" event, and put that URL in `scan/config.json`.

Alternative: drag the `accessharbor/` folder into Netlify Drop — live in 60 seconds.

## 5. LinkedIn profile (45 min, free)

Your profile is your landing page for LinkedIn outreach. Change:

- **Headline:** "Helping e-commerce brands become European Accessibility Act compliant | WCAG 2.1 AA audits & remediation"
- **About:** 3 sentences. The EAA is enforceable, it applies to non-EU brands selling into the EU, we audit and fix it. End with "DM me your URL for a free scan."
- **Experience:** add "Founder — AccessHarbor" with a one-line description.
- Follow: IAAP, W3C Web Accessibility Initiative, and 10–20 accessibility consultants (their posts teach you the domain fast; their commenters include your future delivery partners).

## 6. Optional but smart

- **Stripe** account for invoicing (or Wise Business for EU clients).
- Register the business per your country's rules once revenue starts — a sole proprietorship is fine to begin in most places; ask a local accountant.
