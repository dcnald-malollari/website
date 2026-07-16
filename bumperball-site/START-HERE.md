# Your New Bumper Ball Chicago Website — Start Here

Hi Don! 👋 This folder is your complete new website. Everything is included —
pages, images, video, fonts. There is nothing to install and no monthly software
it depends on.

**Try it right now:** double-click `index.html` and it opens in your browser,
fully working, straight from this folder.

---

## 1. What's in the box

| File | What it is |
|---|---|
| `index.html` | Home page |
| `packages.html` | Packages & pricing (same 4 packages and prices as your current site) |
| `book.html` | Booking page — call/text buttons, online booking links, and an inquiry form |
| `about.html` | About us |
| `faq.html` | All your FAQs |
| `waiver.html` | Your official waiver, word-for-word, with the online signing link and a printable version |
| `privacy.html` | Your privacy policy |
| `assets/` | Images, video, fonts, styling — leave this folder alongside the pages |

Everything from your current site was kept: all 4 package prices ($350 / $450 /
$525 / $725), the waiver, the FAQs, the privacy policy, your phone number, email,
service areas, and your real photos. The big action photo at the top is an
AI-generated image built from your own photos so your logo shows on the balls —
swap it anytime by replacing `assets/img/hero-2000.jpg` and `hero-1200.jpg`.

## 2. Put it online (about 10 minutes, free)

The easiest option is **Netlify** (free plan is plenty):

1. Go to https://app.netlify.com/drop
2. Create a free account when it asks (email + password).
3. Drag this whole folder onto the page.
4. Done — you'll get a link like `something.netlify.app`. That's your live site.

Any other host works too (GoDaddy hosting, Hostinger, GitHub Pages, etc.) —
just upload **the contents of this folder** so that `index.html` is at the top level.

## 3. Point www.bumperballchicago.com at the new site

⚠️ **Read this part before switching the domain.**

Your current site AND your online booking checkout both run on Event Rental
Systems (ERS) at your domain today. The new website replaces the *site*, but your
booking/checkout and online waiver still run on ERS — the new site links to them.

- **If you keep ERS** (recommended if you want online card payments): good news —
  the new site's "Book Online" and waiver-signing buttons already point at your
  permanent ERS address (`bumper.ourers.com`), which I verified works. It keeps
  working before AND after the domain moves, so nothing breaks. Then, at the
  place where you bought the domain (GoDaddy, Namecheap, etc.), open **DNS
  settings** and point the domain at your new host — Netlify shows the exact
  records to add under *Domain settings → Add custom domain* and gives you free
  HTTPS automatically.
- **If you drop ERS**: bookings still work great through the Call / Text buttons
  and the booking request form (see next section) — you'd just remove the
  "Book Online" buttons or point them somewhere new. Any web person (or your
  friend who set this up) can do it in 15 minutes; the buttons are plainly
  labeled in the HTML.

Until you switch the domain, the new site works perfectly on its free link, and
your old site keeps running — zero risk, switch whenever you're ready.

## 4. The booking request form — one 2-minute step

The "Tell Us About Your Event" form on `book.html` emails requests to
**info@bumperballchicago.com** through a free service called FormSubmit.

**The very first time someone submits the form**, FormSubmit sends a one-time
confirmation email to info@bumperballchicago.com — open it and click the
confirmation link (check spam if you don't see it). After that one click, all
form submissions arrive in your inbox automatically, forever, free.

Tip: submit the form yourself once, right after the site goes live, so you can
click the confirmation and test the flow at the same time.

## 5. Editing things later

Open any `.html` file in a text editor (Notepad / TextEdit works):

- **Change a price:** search for the old price (e.g. `$450`) — it appears on
  `index.html` and `packages.html`. Change it in both places.
- **Change the phone number:** search for `331-431-1134` and `(331) 431-1134`
  across all files and replace.
- **Swap a photo:** replace the matching file in `assets/img/` keeping the same
  file name.

## 6. Security notes (the short version)

- This is a **static** website: no database, no logins, no plugins, no WordPress —
  there is essentially nothing to hack on the site itself.
- It loads **zero third-party scripts** and ships with a strict Content-Security-Policy.
- HTTPS (the padlock) is automatic and free on Netlify/GitHub Pages.
- The things worth protecting with strong passwords + two-factor: your domain
  registrar account, your ERS account, your email, and your Facebook/Instagram.

## 7. Small things you may want to tweak

- The Booking page lists **(630) 465-1088** as an alternate number (it was
  in your old About page). Remove it if that line is retired.
- Yelp shows your 5.0★ rating with 2 reviews; the home page quotes the one public
  review (spelling of "Bumper" tidied up). More reviews will make that section stronger.
- No business hours are published anywhere (same as your old site) — add them to
  the footer if you'd like.

Have fun out there! 🎉
