# Square Construction — Design System

A token-based design system for the Square Construction marketing site, derived
from **Stripe's design language** (Nov 2026). The token architecture and
component rhythm of the earlier systems are unchanged — the skin is new:
deep navy ink, blurple actions, cool-grey tints, layered soft shadows, and
Stripe's gradient mesh kept on a short leash so the site still reads as a
trustworthy local contractor, not a fintech.

## Files

```
design-system/
  tokens.css       Color, type, radius, shadow, and motif tokens (:root variables)
  base.css         Base styles, typography, section rhythm, navbar, hero, buttons
  components.css   About, services, process, quote form, FAQ, footer, responsive
```

`base.css` and `components.css` each `@import` `tokens.css`, so linking either
one in the page is enough. `index.html` links both.

## Tokens

| Token | Value | Use |
|---|---|---|
| `--paper` | `#ffffff` | Page background |
| `--card` | `#ffffff` | Card surfaces |
| `--tint` | `#f6f9fc` | Alternating section background (`.section-bg`) |
| `--line` | `#e3e8ee` | Borders, dividers |
| `--ink` | `#0a2540` | Headings, primary text (15.5:1 on white) |
| `--muted` | `#425466` | Body / secondary text (7.8:1 on white) |
| `--faint` | `#697386` | Hints, captions (4.8:1 on white) |
| `--placeholder` | `#a7b5c6` | Input placeholder text |
| `--primary` | `#635bff` | Primary actions, links, accents (4.7:1 on white) |
| `--primary-deep` | `#4a42d6` | Primary hover/active |
| `--primary-soft` | `#efeeff` | Tinted accent backgrounds (icon chips, FAQ arrow) |
| `--primary-line` | `rgba(99,91,255,.45)` | Accent borders (open FAQ item, icon rings) |
| `--on-primary` | `#ffffff` | Text on `--primary` fills (4.7:1) |
| `--ring` | `rgba(99,91,255,.28)` | Focus glow ring on form fields |
| `--ok` / `--ok-bg` | `#12714a` / `#e7f6ee` | "Available" status badges (5.4:1) |
| `--busy` / `--busy-bg` | `#8a5a00` / `#fdf1de` | "Booking out" status badges (5.3:1) |
| `--error` | `#df1b41` | Field errors, failed form status (4.8:1 on white) |
| `--night` | `#0a2540` | Footer background |
| `--footer-text` / `--footer-muted` | `#cbd6e8` / `#8ea3c0` | Footer text on navy (10.6:1 / 6.0:1) |

Type: **Inter** throughout. There is no separate display face — headings take
the display voice from weight (600–700) and tight tracking (`-0.02em`), body
text runs 400/500. Radii: `--radius-card: 16px`, `--radius-btn: 8px`,
`--radius-input: 8px`, `--radius-pill: 999px`. Shadows are layered and
navy-tinted (`--shadow-card`, `--shadow-lift`, plus button and nav variants).
Motion: `--transition: 0.25s ease`, with `prefers-reduced-motion` honored.

Dark appearance: **not shipped.** The previous system carried a
`prefers-color-scheme: dark` override; Stripe's marketing surfaces are light,
so this one is too. The tokens stay semantic, so a dark scheme can be re-added
as a single override block in `tokens.css` if it's ever wanted.

### Signature element: the gradient mesh

Stripe's signature is the colourful gradient mesh (purple → cyan → coral).
Here it is deliberately scarce — a construction site has to read trustworthy
first:

- `--gradient-mesh` — layered radial washes in `--grad-purple` `#635bff`,
  `--grad-cyan` `#00d4ff`, `--grad-coral` `#ff8a5c`, at 13–20% opacity
- Hero background — the mesh washing the top edge over a white → tint fade
- Hero photo glow — the same mesh, blurred, behind the hero image

The old hazard stripe survives in exactly **one** place: `--hazard`, the
diagonal blurple striping used as the footer top rule. The blueprint grid and
the eyebrow tick are gone; eyebrows are plain small-caps text in `--primary`,
and the hero pill carries a small blurple dot instead.

## Components

- **Section titles** — `.section-title` with one `.eyebrow` (small caps,
  `--primary`) and one `h2`. Centered, max 640px.
- **Buttons** — `.btn-primary` (blurple fill, white text, 8px radius, one per
  view) and `.btn-secondary` (white card-style button with a subtle border and
  shadow — it supports, never competes).
- **Navbar** — translucent white blur bar, shrinks on scroll
  (`.navbar-scrolled`), blurple underline on active/hover links.
- **Hero** — 92vh, gradient-mesh wash, eyebrow pill with blurple dot,
  `clamp()` headline in Inter 700, primary + secondary CTAs, photo panel with
  a soft mesh glow behind it.
- **Service cards** — `.service-box`: media area, `.status-badge`
  (`.available` green tint / `.busy` amber tint), title, copy, `.rate` line,
  CTA. Hover lifts the card and zooms the media.
- **Process steps** — `.process-step`: small-caps step number in `--primary`,
  icon chip (soft tint, fills blurple on hover), title, copy.
- **Quote panels** — `.quote .info` (contact rows with soft-tint icon chips)
  and `.quote .quote-form`. Form fields: 50px inputs, 8px radius, 1px
  `--line` border, Stripe-like focus state (blurple border + `--ring` glow),
  8px-radius blurple submit.
- **FAQ** — real `<button>` accordion driven by `aria-expanded`; open item
  gets a shadow and a `--primary-line` border.
- **Footer** — `--night` navy background, hazard-stripe top rule (the one
  surviving construction motif), link columns, bottom bar.

## Mapping from the previous (Apple-derived) system

| Before | Now | Notes |
|---|---|---|
| `--paper` `#fdfcf8` (warm) | `#ffffff` | Warm paper → clean white |
| `--tint` `#f4f2ec` | `--tint` `#f6f9fc` | Warm grey → Stripe cool grey |
| `--ink` `#23211b` | `--ink` `#0a2540` | Warm black → Stripe navy |
| `--safety` `#e8590c` + `--safety-ink` | `--primary` `#635bff` + `--on-primary` | Safety orange → blurple |
| `--ember-deep` `#a83e05` (text accent) | `--primary` / `--primary-deep` | One accent family instead of two |
| `--steel` / `--steel-deep` | — (roles absorbed) | Secondary button is now a white card button |
| `--safety-soft` | `--primary-soft` `#efeeff` | Icon-chip tint |
| Playfair Display + Poppins | Inter only | Display voice via weight + tracking |
| Pill buttons | 8px-radius buttons | Badges stay pills |
| Hazard stripe (several places) | Gradient mesh + hazard in footer only | Signature swap |
| `prefers-color-scheme: dark` override | Dropped | Stripe marketing surfaces are light |

Section rhythm (88px desktop / 64px ≤991px), card pattern, eyebrow pattern,
FAQ behavior, form validation hooks, and responsive breakpoints (991/576px)
are carried over unchanged. All copy, section ids, form field ids, and the
classes `script.js` / `quote-form.js` rely on are untouched.

## Extending

1. Add tokens to `tokens.css` — never hard-code a color in a component.
2. New components go in `components.css` with a comment divider, following the
   existing naming (kebab-case, `.section .component` scoping).
3. Keep the signatures scarce: the gradient mesh belongs in the hero, the
   hazard stripe belongs in the footer rule. Nowhere else.
4. Check contrast for any new text/background pair (aim ≥ 4.5:1) and note it
   in the token comment block.
