#!/usr/bin/env python3
"""AccessHarbor MailCheck — email security (SPF/DMARC/DKIM) evidence scanner.

Claude runs this from the cloud session (no laptop needed):
    pip install dnspython
    python3 mailcheck.py domain1.com domain2.com ...

Grades:
    F  = no DMARC record (anyone can send email as this domain and it lands)
    D  = DMARC p=none (monitoring only — spoofed mail is still delivered)
    C  = p=quarantine but pct<100, or SPF weak/missing alongside enforcement
    B  = p=quarantine
    A  = p=reject with valid SPF
Sell to F and D. B/C are upsell-only. A = skip.
"""
import sys
import dns.resolver

SELECTORS = ["google", "default", "k1", "k2", "k3", "s1", "s2", "smtpapi",
             "selector1", "selector2", "mandrill", "shopify", "krs", "mte1"]


def resolver():
    r = dns.resolver.Resolver()
    r.use_edns(0, 0, 4096)  # large TXT records (DKIM keys) truncate at 512 bytes
    r.lifetime = 8
    return r


def txt(r, name):
    try:
        return [b"".join(x.strings).decode("utf-8", "replace") for x in r.resolve(name, "TXT")]
    except Exception:
        return []


def check(domain):
    r = resolver()
    out = {"domain": domain}
    try:
        out["mx"] = sorted(str(x.exchange).rstrip(".") for x in r.resolve(domain, "MX"))
    except Exception:
        out["mx"] = []
    spf = [t for t in txt(r, domain) if t.lower().startswith("v=spf1")]
    out["spf"] = spf[0] if len(spf) == 1 else ("MULTIPLE-SPF-INVALID" if spf else None)
    dmarc = [t for t in txt(r, "_dmarc." + domain) if t.lower().startswith("v=dmarc1")]
    out["dmarc"] = dmarc[0] if dmarc else None
    out["dkim_selectors"] = [s for s in SELECTORS if txt(r, f"{s}._domainkey.{domain}")]
    return out


def grade(c):
    d = (c["dmarc"] or "").lower().replace(" ", "")
    spf_ok = c["spf"] and c["spf"] != "MULTIPLE-SPF-INVALID" and "+all" not in c["spf"]
    if not c["dmarc"]:
        return "F", "no DMARC record — spoofed email as this domain is delivered normally"
    if "p=none" in d:
        return "D", "DMARC is monitor-only (p=none) — spoofing is logged but still delivered"
    if "p=quarantine" in d:
        if "pct=" in d and "pct=100" not in d:
            return "C", "quarantine enforced only on a fraction of mail (pct<100)"
        return ("C" if not spf_ok else "B"), ("SPF broken alongside enforcement" if not spf_ok else "quarantine policy — decent, reject is the finish line")
    if "p=reject" in d:
        return ("C" if not spf_ok else "A"), ("SPF broken under p=reject — real mail may bounce" if not spf_ok else "fully enforced")
    return "D", "unrecognised DMARC policy"


def main():
    domains = sys.argv[1:]
    if not domains:
        sys.exit("usage: python3 mailcheck.py domain [domain...]")
    rows = []
    for dom in domains:
        c = check(dom)
        g, why = grade(c)
        rows.append((g, dom, c, why))
        print(f"[{g}] {dom}")
        print(f"     MX: {', '.join(c['mx']) or 'none found'}")
        print(f"     SPF: {c['spf'] or 'MISSING'}")
        print(f"     DMARC: {c['dmarc'] or 'MISSING'}")
        print(f"     DKIM selectors found: {', '.join(c['dkim_selectors']) or 'none of the common ones'}")
        print(f"     -> {why}\n")
    order = {"F": 0, "D": 1, "C": 2, "B": 3, "A": 4}
    print("=" * 60)
    print("PITCH LIST (worst first):")
    for g, dom, c, why in sorted(rows, key=lambda x: order[x[0]]):
        print(f"  {g}  {dom:32s} {why}")


if __name__ == "__main__":
    main()
