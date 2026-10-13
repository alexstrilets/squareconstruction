# Square Construction

Static marketing site for Square Construction (Edmonton general contracting).
Design system in `design-system/` — see `DESIGN_SYSTEM.md` for tokens,
components, and usage.

## Status

Starter scaffold (2026-10-12). Before launch:

- [ ] Replace placeholder contact details (`(780) 555-0134`, `quotes@example.com`) with real ones
- [ ] Wire the quote form — pick one (see the comment above the form in `index.html`):
  1. **Formspree** — set `action="https://formspree.io/f/YOUR_FORM_ID"` (50 free/mo)
  2. **EmailJS** — same pattern as the HoneycombsAndMore site (service/template IDs)
  3. **PHP + Brevo** on Hostinger — only if you want zero third-party form services
- [ ] Replace hero + service placeholder panels with real job-site photos (`images/`)
- [ ] Fill in the licensed/insured FAQ answer with real details
- [ ] Register `squareconstructions.ca` (in the friend's name) and point hosting at it
- [ ] Set `<title>`/meta per final branding; add `robots.txt` / `sitemap.xml` when live

## Structure

```
index.html            Starter page (hero, about, services, process, quote, faq)
script.js             Navbar state, active nav link, FAQ accordion, form fallback
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
