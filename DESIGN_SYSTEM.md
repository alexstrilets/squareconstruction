# Square Construction — Design System

A token-based design system for the Square Construction marketing site, derived
from the HoneycombsAndMore apple-design refresh (Oct 2026). Same architecture,
same component rhythm — construction identity.

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
| `--paper` | `#fdfcf8` | Page background |
| `--card` | `#ffffff` | Card surfaces |
| `--tint` | `#f4f2ec` | Alternating section background (`.section-bg`) |
| `--line` | `#e4dfd4` | Borders, dividers |
| `--ink` | `#23211b` | Primary text (15.7:1 on paper) |
| `--muted` | `#6e685b` | Secondary text (5.4:1 on paper) |
| `--safety` | `#e8590c` | Accent fill — buttons, highlights. Never as text on light |
| `--safety-soft` | `#fdeadb` | Tinted accent backgrounds (icon circles, FAQ hover) |
| `--safety-ink` | `#2e1500` | Text on `--safety` fills (4.8:1) |
| `--ember-deep` | `#a83e05` | Text accent — eyebrows, prices, links (6.1:1 on paper) |
| `--steel` | `#445060` | Secondary actions, outlines (8.2:1 on white) |
| `--steel-deep` | `#333d48` | Darker steel for hover states |
| `--ok` / `--ok-bg` | `#2f7d32` / `#e9f4ea` | "Available" status badges |
| `--busy` / `--busy-bg` | `#8a7f70` / `#f1ece2` | "Booking out" status badges |
| `--night` | `#211d16` | Footer background |

Type: **Playfair Display** = display voice (hero + section titles only),
**Poppins** = everything else. Radii: `--radius-card: 16px`,
`--radius-pill: 999px`. Shadows: `--shadow-card`, `--shadow-lift`.
Motion: `--transition: 0.25s ease`, with `prefers-reduced-motion` honored.

### Signature element: the hazard stripe

The bees site has the hexagon; this system has diagonal safety striping.
Use sparingly — it's an accent, not a background:

- `.eyebrow::before` and `.hero-eyebrow .tick` — the 12px striped tick
- `--stripe-tile` — faint striped texture (hero photo accent, placeholders)
- `--grid-tile` — faint blueprint grid (hero background texture)
- Footer top rule — safety → steel → safety gradient

## Components

- **Section titles** — `.section-title` with one `.eyebrow` and one `h2`. Centered, max 640px.
- **Buttons** — `.btn-primary` (safety fill, one per view) and `.btn-secondary` (steel outline, never competes).
- **Navbar** — translucent blur bar, shrinks on scroll (`.navbar-scrolled`), amber underline on active/hover links.
- **Hero** — 92vh, blueprint-grid texture, eyebrow pill, `clamp()` display headline, primary + secondary CTAs, photo panel with hazard-stripe accent.
- **Service cards** — `.service-box`: media area, `.status-badge` (`.available` / `.busy`), title, copy, `.rate` line, CTA. Hover lifts the card and zooms the media.
- **Process steps** — `.process-step`: eyebrow step number, icon circle that fills on hover, title, copy.
- **Quote panels** — `.quote .info` (contact rows with icon circles) and `.quote .quote-form` (accent top border). Form fields: 50px inputs, 10px radius, safety focus ring, pill submit.
- **FAQ** — real `<button>` accordion driven by `aria-expanded`; open item gets a shadow and accent border.
- **Footer** — `--night` background, safety gradient top rule, link columns, bottom bar.

## Mapping from the bees site

| Bees | Square Construction | Notes |
|---|---|---|
| `--honey` `#f1a817` | `--safety` `#e8590c` | Accent fill, swapped hue family |
| `--honey-ink` | `--safety-ink` | Text on accent fills |
| `--amber-deep` | `--ember-deep` | Text accent |
| `--bark` / `--bark-deep` | `--steel` / `--steel-deep` | Secondary actions: brown → slate |
| Hexagon tile/motif | Hazard stripe + blueprint grid | Signature element swap |
| `.product-box` / `.stock-badge` | `.service-box` / `.status-badge` | Same card pattern, service semantics |
| `.booking` section | `.quote` section | Same panel pattern, renamed |
| `.btn-shop` / `.btn-book` | `.btn-primary` / `.btn-secondary` | Generic names for reuse |
| Playfair Display + Poppins | Playfair Display + Poppins | Kept — it's the "same feel" |

Section rhythm (88px desktop / 64px ≤991px), card shadows, pill buttons,
eyebrow pattern, FAQ behavior, and responsive breakpoints (991/768/576px)
are carried over unchanged.

## Extending

1. Add tokens to `tokens.css` — never hard-code a color in a component.
2. New components go in `components.css` with a comment divider, following the
   existing naming (kebab-case, `.section .component` scoping).
3. Keep the signature element scarce: if the stripe appears more than a few
   times per viewport, it's too much.
4. Check contrast for any new text/background pair (aim ≥ 4.5:1) and note it
   in the token comment block.
