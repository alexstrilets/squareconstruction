# Square Construction

Static marketing site for Square Construction (Edmonton general contracting).
Design system in `design-system/` — see `DESIGN_SYSTEM.md` for tokens,
components, and usage.

## Status

Starter scaffold (2026-10-12). Before launch:

- [ ] Replace placeholder contact details (`(780) 555-0134`, `quotes@example.com`) with real ones
- [ ] Wire the quote form to EmailJS (requests go to Alex's inbox for now):
  1. EmailJS dashboard → create a template (e.g. "square-construction-quote")
  2. Set its To email to Alex's address; use variables `{{name}}` `{{phone}}`
     `{{customer_email}}` `{{project_type}}` `{{details}}` in the body
  3. Paste the template ID into `EMAILJS_TEMPLATE_ID` in `quote-form.js`
  (Public key + service ID are already filled in — same account as the honey site.
  Free plan: 200 emails/month; the honey site uses a handful.)
- [ ] Replace the stock Pexels photos in `images/` with real job-site photos over time
- [ ] Fill in the licensed/insured FAQ answer with real details
- [ ] Register `squareconstructions.ca` (in the friend's name) and point hosting at it
- [ ] Set `<title>`/meta per final branding; add `robots.txt` / `sitemap.xml` when live

## Structure

```
index.html            Starter page (hero, about, services, process, quote, faq)
script.js             Navbar state, active nav link, FAQ accordion, footer year
quote-form.js         Quote form → EmailJS (same pattern as the bees site)
images/               Stock photos from Pexels (Pexels License: free for
                      commercial use, no attribution required) — replace with
                      real job-site photos over time
design-system/
  tokens.css          Design tokens (colors, type, radii, shadows, motifs)
  base.css            Base styles, typography, nav, hero, buttons
  components.css      Cards, badges, steps, quote form, FAQ, footer
DESIGN_SYSTEM.md      Token reference and component guide
```

No build step — vanilla HTML/CSS/JS + Bootstrap 5.3 and Font Awesome 6.0 via CDN.

## Local dev

```bash
cd ~/src/squareconstruction
python3 -m http.server 8080
# open http://localhost:8080
```

## Conventions

- HTML: 2-space indent, lowercase tags/attributes, semantic `<section id="...">`.
- CSS: 2-space indent, tokens from `:root` in `design-system/tokens.css`, kebab-case classes.
- JS: ES6+, 2-space indent, single quotes, semicolons; wrap in IIFE.
- Never hard-code colors — add a token. Keep the hazard-stripe motif scarce.
