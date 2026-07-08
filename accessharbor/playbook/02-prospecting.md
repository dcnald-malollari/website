# 02 — Prospecting: building the list

Goal: 20 qualified prospects per day, each with a scan report ready to attach. Two hours a day, tops.

## Your ICP (ideal customer profile)

**US/UK/international e-commerce brands that demonstrably sell into the EU**, 10–500 employees.

Qualify by looking for **EU-sale signals** (any two of these = in scope for the EAA):

- EUR (or DKK/SEK/PLN) prices, or a country/currency switcher
- A shipping page listing EU countries
- `.de` / `.fr` / `.eu` subdomain or localised store (`/en-de/`, `eu.brand.com`)
- EU returns address, EU VAT number in the footer, or "EORI" in shipping FAQ
- Instagram/TikTok ads targeted at EU markets (check their ad library pages)

**Disqualify:** true microenterprises (<10 staff AND <€2M revenue — exempt from the EAA's service rules), and giant enterprises (they have agencies; come back for them in year two).

**Best verticals to start:** fashion/apparel, beauty, supplements, home goods, consumer electronics accessories. High checkout complexity = many violations = vivid reports.

## Where to find them (free-tier stack)

1. **Store directories:** [StoreLeads](https://storeleads.app) (filter: Shopify, ships to Germany/France, 10+ employees — free tier gives you plenty), BuiltWith lists, myip.ms Shopify lists.
2. **Instagram/TikTok ads you see:** every DTC brand advertising to you with EUR prices is a prospect. Screenshot, add to list.
3. **Marketplace sellers going DTC:** brands on Amazon.de with their own Shopify site.
4. **"As seen in" lists:** roundup articles like "50 best sustainable fashion brands" — every entry with EU shipping qualifies.
5. **Later, paid:** Apollo.io or Sales Navigator to pull decision-maker emails at scale (~€50/mo, get it once replies prove the offer).

## Finding the right person

Target, in order of preference:

1. **Head of E-commerce / E-commerce Director**
2. **COO or Head of Operations** (owns compliance risk)
3. **Founder/CEO** (under 50 employees, always the founder)
4. General Counsel / Legal (only at 200+ employees)

Find emails with Hunter.io (25 free/month) or the pattern guess (`first@brand.com`, `first.last@brand.com`) verified through a free checker like Verifalia.

## The daily routine (the whole job)

```
09:00–09:45  Find 20 new prospects, add rows to pipeline-tracker.csv
09:45–10:30  Run scans:  node scan.js https://prospect.com --company "Name"
             (batch them; each takes ~1 min)
10:30–11:00  Send 10–20 emails with reports attached + 10 LinkedIn touches
11:00        Done. Answer replies as they come.
```

Keep `pipeline-tracker.csv` updated religiously — column meanings are in the header row. When a prospect books a call, move to `04-sales.md`.
