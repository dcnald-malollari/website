# 07 — MailCheck: the email-spoofing arm

Second product, same machine. Instead of "your website fails accessibility," the finding is **"anyone on earth can send email that looks like it came from you, and it will land in your customers' inboxes."** That's DMARC — and most mid-size brands have it switched off.

**Why this arm is special:** Claude runs the whole check from the cloud — no laptop, no Terminal, nothing for Donald to do. Claude checks a domain's public DNS records in seconds and hands back a grade + the exact finding. It fills the quiet days and every prospect gets *two* reasons to talk to you.

## What we're actually checking

Every domain publishes public records that say who's allowed to send email as them:
- **SPF** — the list of servers allowed to send.
- **DKIM** — a cryptographic signature.
- **DMARC** — the *policy*: what inboxes should do with mail that fails the above. This is the one that matters.

DMARC has three policy levels:
- `p=none` → "just watch, deliver it anyway" — **spoofing still works.**
- `p=quarantine` → "send fakes to spam" — decent.
- `p=reject` → "block fakes outright" — the finish line.

No DMARC record at all = wide open. A brand with no DMARC or `p=none` can be impersonated by a scammer emailing their customers ("your order has a problem, pay this link") and the brand's own domain name appears in the From line. That's the pitch.

## The tool

`accessharbor/mailcheck/mailcheck.py` — Claude runs it in the cloud session:

```
python3 mailcheck.py brand1.com brand2.com brand3.com
```

It prints a grade per domain and a "worst first" pitch list:
- **F** = no DMARC → hottest lead
- **D** = p=none → hot lead
- **C** = enforced but broken (SPF missing / partial) → warm, credible
- **B** = quarantine → upsell only ("finish the job — go to reject")
- **A** = fully enforced → skip, don't pitch

**Only pitch F and D.** Grading B/C/A as problems burns credibility.

## Check the RIGHT domain (don't pitch a false finding)

Grade the domain the brand actually **sends email from** — the part after the `@` in their support/hello address — not a marketing redirect. Example: `faherty.com` graded F, but their real domain `fahertybrand.com` (where `hello@fahertybrand.com` lives) is enforced. Pitching the F would have been wrong. Rule: if the brand's contact address is `name@X.com`, check `X.com`. When in doubt, the domain with real Google/Outlook MX records is the live one; a domain with no MX is usually a parked redirect — skip it.

## Who to check

Same prospect universe as the accessibility arm — you already have their domains. Run the whole pipeline list through it, plus any brand you're about to cold-email anyway. Real results from our own list: **Meller = F**, **Cotopaxi = D**, **Four Sigmatic = D**. Those three now have a second, sharper reason to pick up.

## Email sequence (plain text, no attachment needed — the proof is quotable)

### Email 1 — the open door

> **Subject:** anyone can send email as {{brand.com}} right now
>
> Hi {{FirstName}},
>
> Quick heads-up, not a sales pitch: {{brand.com}} has no enforced DMARC policy, which means someone can send email that shows *your* domain in the From line — order-problem scams, fake refund links — and it lands in your customers' inboxes looking genuine. I checked your public records this morning; happy to send you the two-line proof.
>
> This is a ~1-day fix and it protects your brand and your customers. Worth a 15-minute call? {{booking link}}
>
> {{You}}

### Email 2 — 3 days later, in-thread

> {{FirstName}} — the specific gap: your domain publishes `{{p=none / no record}}`, so failed-authentication mail is delivered rather than blocked. Every day it's open is a day your customers can be phished in your name. I can walk your developer through the exact DNS change on a short call — or send it in writing if that's easier.

### Email 3 — 5 days later, breakup

> Closing the loop, {{FirstName}}. Whoever manages your domain's DNS can fix this in an afternoon — I'd just make sure it's on someone's list, because the brands that get spoofed usually find out from angry customers first. My report's yours whenever you want it.

## Pricing (smaller ticket, faster yes)

This is a lighter engagement than a full accessibility audit — sell it as a fast, fixed-fee project delivered through a partner:
- **Setup + hardening:** €750–1,500 one-time (audit SPF/DKIM/DMARC, roll the policy safely to `p=reject` without breaking legitimate mail, document it).
- **Monitoring add-on:** €150–400/month (watch the DMARC reports, catch spoofing attempts, keep the policy healthy).
- Delivery: same white-label partner model, or a specialist email-deliverability freelancer — margin target ≥50%.

**The real value of this arm:** it's the cheap, fast "yes" that starts a relationship. A brand that pays €900 to fix its email and has a good experience is the brand that says yes to the €5,500 accessibility audit next quarter. Lead with whichever finding is worse for that specific prospect.

## One honest line (keep trust)

You are not a law firm and not a security incident responder. You find the gap, you explain it in plain English, and you (via a partner) implement the standard fix. Never imply a brand has already been breached — the finding is *exposure*, not a live attack. Keep the same evidence-first, no-hype voice that's working on the accessibility side.
