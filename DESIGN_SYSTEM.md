# PiggyVault (piggy_saves) Design System Specification

## Overview

PiggyVault reads like an institutional private-wealth and treasury management brand that happens to make everyday personal saving ("ipon") and expense tracking effortless — the marketing and interface surfaces are quiet, white-canvas, editorially-spaced, and almost monochromatic. The single brand voltage is **Vault Rose** (`{colors.primary}` — `#e11d48`), used scarcely: every primary CTA pill, the brand wordmark emphasis, and inline brand links. Beyond that one rose, the system is white canvas + ink + soft gray elevation bands + a deep near-black editorial canvas (`{colors.surface-dark}` — `#0a0b0d`) for full-bleed product-mockup heroes.

Type pairs **PiggyDisplay** for hero headlines with **PiggySans** for body, captions, form controls, and navigation. Display sits at **weight 400** — not the 700+ heavy bolding typical of noisy budgeting apps. The choice signals editorial calm, fiscal discipline, and institutional trust rather than fintech urgency or gamified clutter.

The page rhythm rotates three modes: bright white editorial sections, soft-gray elevation bands, and **full-bleed dark editorial heroes** carrying layered product-UI mockup cards displaying live balance cards, 7-day cash flow charts, and dual-mode transaction feeds. The dark hero with floating dashboard mockups is the single most distinctive component.

**Key Characteristics:**
- Single accent color: `{colors.primary}` (#e11d48 Vault Rose) carries every primary CTA, wordmark accent, and inline brand link. Used scarcely.
- Modest display weights — PiggyDisplay at weight 400, never 700+.
- Editorial pill geometry: every CTA is `{rounded.pill}` (100px), every category & currency glyph is `{rounded.full}`, every card is `{rounded.xl}` (24px). Sharp corners absent.
- Full-bleed dark heroes with floating product-UI cards: `{component.hero-band-dark}` plus inline `{component.product-ui-card-dark}` mockups is the brand's strongest signature pattern.
- Financial cash flow semantics: `{colors.semantic-up}` (#05b169) for savings/deposits and `{colors.semantic-down}` (#cf202f) for expenses/spending — text color only, never background fills.
- 96px section rhythm — generous editorial pacing.

---

## Colors

### Brand & Accent
- **Vault Rose** (`{colors.primary}` — `#e11d48`): The single brand color. Every primary CTA pill, the PiggyVault wordmark accent, and inline brand links.
- **Vault Rose Active** (`{colors.primary-active}` — `#be123c`): Press-state darken on the primary pill.
- **Vault Rose Disabled** (`{colors.primary-disabled}` — `#f4a7b9`): Faded-rose tint for disabled CTAs.
- **Ipon Gold** (`{colors.accent-yellow}` — `#f4b000`): A small sub-brand accent used very sparingly on physical coin stash / piggy bank glyph fills inside feature cards. Illustrative-only, not an action color.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): The default page floor.
- **Surface Soft** (`{colors.surface-soft}` — `#f7f7f7`): Subtle alternating band surface.
- **Surface Strong** (`{colors.surface-strong}` — `#eef0f3`): The light-gray fill behind secondary buttons, search pills, category-icon plates, and quick-add preset chips.
- **Surface Dark** (`{colors.surface-dark}` — `#0a0b0d`): Deep near-black canvas for full-bleed dark heroes and pre-footer CTA bands. Same hex as `{colors.ink}` — page-floor and text-color share the value.
- **Surface Dark Elevated** (`{colors.surface-dark-elevated}` — `#16181c`): One step lighter, used for floating product-UI mockup cards inside dark heroes.

### Hairlines
- **Hairline** (`{colors.hairline}` — `#dee1e6`): Default 1px divider on white surfaces.
- **Hairline Soft** (`{colors.hairline-soft}` — `#eef0f3`): Lighter divider — same hex as `{colors.surface-strong}`.

### Text
- **Ink** (`{colors.ink}` — `#0a0b0d`): Display headings, primary nav, body emphasis.
- **Body** (`{colors.body}` — `#5b616e`): Default running-text — slightly cool gray.
- **Body Strong** (`{colors.body-strong}` — `#0a0b0d`): Same as ink, used for stronger emphasis.
- **Muted** (`{colors.muted}` — `#7c828a`): Sub-titles, timestamps, merchant secondary notes, breadcrumbs, footer secondary.
- **Muted Soft** (`{colors.muted-soft}` — `#a8acb3`): Disabled text and placeholders.
- **On Primary** (`{colors.on-primary}` — `#ffffff`): White text on Vault Rose CTAs.
- **On Dark** (`{colors.on-dark}` — `#ffffff`): White text on dark heroes.
- **On Dark Soft** (`{colors.on-dark-soft}` — `#a8acb3`): Muted off-white for secondary text on dark.

### Cash Flow Semantics
- **Semantic Up** (`{colors.semantic-up}` — `#05b169`): "Savings deposit / Net liquidity surplus" green, text color only.
- **Semantic Down** (`{colors.semantic-down}` — `#cf202f`): "Expense / Expenditure / Outflow" red, text color only.

---

## Typography

### Font Family
The system runs **PiggyDisplay** (display headlines), **PiggySans** (body, navigation, captions, buttons, inputs), and **PiggyMono** for all tabular numerical data (currency amounts, timestamps, savings rates, counts). Fallback stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.

The display/body split is functional: PiggyDisplay carries hero headlines only; PiggySans carries running text and controls; PiggyMono carries every financial figure.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-mega}` | 80px | 400 | 1.0 | -2px | Homepage hero h1 ("Save with institutional precision.") |
| `{typography.display-xl}` | 64px | 400 | 1.0 | -1.6px | Subsidiary dashboard heroes |
| `{typography.display-lg}` | 52px | 400 | 1.0 | -1.3px | Section heads ("Liquidity & Cash Flow Dynamics") |
| `{typography.display-md}` | 44px | 400 | 1.09 | -1px | CTA-band headlines ("Take total control of your personal treasury.") |
| `{typography.display-sm}` | 36px | 400 | 1.11 | -0.5px | Sub-section heads — PiggySans |
| `{typography.title-lg}` | 32px | 400 | 1.13 | -0.4px | Card group titles ("Savings Milestones & Ipon Targets") |
| `{typography.title-md}` | 18px | 600 | 1.33 | 0 | Component titles, transaction title ("Team Lunch", "Emergency Fund") |
| `{typography.title-sm}` | 16px | 600 | 1.25 | 0 | List labels, form input labels |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Default body |
| `{typography.body-strong}` | 16px | 700 | 1.5 | 0 | Emphasized body |
| `{typography.body-sm}` | 14px | 400 | 1.5 | 0 | Footer body, transaction notes |
| `{typography.caption}` | 13px | 400 | 1.5 | 0 | Form hint captions, merchant subtitles |
| `{typography.caption-strong}` | 12px | 600 | 1.5 | 0 | Badge pill labels ("IPON OS", "PHP · ₱", "24H EXPENSE") |
| `{typography.number-display}` | 18px | 500 | 1.4 | 0 | Transaction amounts, balances, percentages — PiggyMono |
| `{typography.button}` | 16px | 600 | 1.15 | 0 | Standard CTA pill ("Log Deposit", "Log Expense", "Sign In") |
| `{typography.nav-link}` | 14px | 500 | 1.4 | 0 | Top-nav menu items |

### Principles
- **Display weight stays at 400.** The single most distinctive typographic choice — signals "calm institutional wealth platform" rather than "frantic fintech app."
- **Negative letter-spacing on display only.** Display uses -1px to -2px tracking; body stays at 0.
- **PiggyMono on every number.** All account balances, multi-currency values, timestamps (`YYYY-MM-DD HH:mm:ss`), percentage rates, and quick chips render in PiggyMono.

### Note on Font Substitutes
- **PiggyDisplay → Inter** at weight 400, letter-spacing -1.5%.
- **PiggySans → Inter** at weight 400/600.
- **PiggyMono → JetBrains Mono** or **Geist Mono** at weight 500.

---

## Layout

### Spacing System
- **Base unit:** 4px.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.base}` 16px · `{spacing.md}` 20px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 96px.
- **Section padding:** `{spacing.section}` (96px) for every major editorial band.
- **Card internal padding:** `{spacing.xl}` (32px) for feature cards, transaction form cards, and product-UI mockups.

### Grid & Container
- **Max content width:** ~1200px centered. Hero elements full-bleed.
- **Editorial body:** Single 12-column grid.
- **Feature card grids:** 2-up at desktop for dual transaction workflow (Mode A: Expense vs Mode B: Savings), 3-up for multi-horizon metric cards.
- **Footer:** 4 to 6-column link list at desktop.

### Whitespace Philosophy
Generous editorial pacing — closer to private banking or the Financial Times than to crowded budgeting apps. 96px between bands; cards inside bands sit 24px apart. High information density lives cleanly inside organized product tables and tabs, not strewn across raw surfaces.

---

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | 80% of surfaces |
| Hairline border | 1px `{colors.hairline}` | Feature card outlines on white |
| Soft drop | `0 4px 12px rgba(0, 0, 0, 0.04)` | Single shadow tier — hovered cards & dropdowns |
| Photographic | Full-bleed product-UI mockups | Hero depth |

### Decorative Depth
- **Layered product-UI cards inside dark heroes** is the most distinctive decorative pattern — a `{component.product-ui-card-dark}` floats above a darker base canvas (#0a0b0d), often with a second smaller card (such as a 7-day cash flow bar chart or instant deposit receipt) overlapping at an angle.
- **Geometric brand illustrations** carry illustrative depth where shadows would otherwise be omitted.

---

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Reserved (essentially unused) |
| `{rounded.xs}` | 4px | Inline tags, subtle table badges |
| `{rounded.sm}` | 8px | Compact transaction table rows |
| `{rounded.md}` | 12px | Form inputs (Amount, Title, Merchant, Notes) |
| `{rounded.lg}` | 16px | Metric cards, goal progress bars |
| `{rounded.xl}` | 24px | Feature cards, dual transaction entry cards, product-UI mockups |
| `{rounded.pill}` | 100px | All CTA buttons, search pills, quick deposit chips (`+500`), badges |
| `{rounded.full}` | 9999px | Category glyph circles, Piggy icon plates, Clerk user avatars |

Pill for interactive buttons, card-radius (24px) for containers, full circle for icon plates. Sharp corners absent.

---

## Components

### Top Navigation

**`top-nav-light`** — Default top nav on white pages. Background `{colors.canvas}`, text `{colors.ink}`, height 64px, 1px `{colors.hairline}` bottom border. Layout:
- **Left:** PiggyVault brand mark (32px circular plate with minimal Piggy silhouette + "Piggy" in `{colors.ink}`, "Vault" in `{colors.primary}`).
- **Center:** Quick Ipon Stash balance pill in `{colors.surface-strong}` with PiggyMono amount + savings rate.
- **Right:** Currency switcher pill (PHP, USD, EUR, etc.), Export/Import actions, and Clerk authentication controls (`SignInButton`, `SignUpButton`, `UserButton`).

**`top-nav-on-dark`** — Top nav over a dark hero band. Background `{colors.surface-dark}`, text `{colors.on-dark}`. Same layout.

---

### Buttons

**`button-primary`** — The signature Vault Rose pill. Background `{colors.primary}`, text `{colors.on-primary}`, type `{typography.button}` (16px / 600), padding 12px × 20px, height 44px, rounded `{rounded.pill}` (100px). Used for "Log Deposit", "Log Expense", "Create Goal", "Sign Up".

**`button-primary-active`** — Press state. Background `{colors.primary-active}`, deeper rose.

**`button-primary-disabled`** — Faded rose tint. Background `{colors.primary-disabled}`. Cursor not-allowed.

**`button-secondary-light`** — Soft-gray secondary on white surfaces. Background `{colors.surface-strong}`, text `{colors.ink}`, same pill geometry. Used for "Export CSV", "Reset Demo".

**`button-secondary-dark`** — Used on dark heroes. Background `{colors.surface-dark-elevated}`, text `{colors.on-dark}`, same pill geometry.

**`button-outline-on-dark`** — Transparent pill with white outline. Background transparent, text `{colors.on-dark}`, 1px white border. Used for "Explore Demo" on dark hero.

**`button-tertiary-text`** — Inline text link. Background transparent, text `{colors.primary}`, type `{typography.button}`.

**`button-pill-cta`** — Larger pill CTA used on the homepage hero ("Start Your Ipon Stash"). Same Vault Rose palette but with 56px height and 16px × 32px padding for an authoritative stance.

---

### Hero Bands

**`hero-band-dark`** — The signature full-bleed dark hero. Background `{colors.surface-dark}`, text `{colors.on-dark}`, full-bleed layered product-UI mockup cards. Display headline left in `{typography.display-mega}` (80px / 400), subhead in `{typography.body-md}`, two CTAs ("Start Logging Free" in Vault Rose, "View Live Dashboard" outline).

**`hero-band-light`** — White-canvas variant used on Analytics and History archives. Background `{colors.canvas}`, text `{colors.ink}`. Same skeleton, light palette.

---

### Cards

**`product-ui-card-dark`** — The floating personal-treasury product-UI mockup. Background `{colors.surface-dark-elevated}`, text `{colors.on-dark}`, rounded `{rounded.xl}` (24px), padding 32px. Shown as 2 stacked cards at slight rotation, displaying real-time balance metrics and 7-day cash flow charts.

**`product-ui-card-light`** — Light-canvas variant used for summary analytics and savings goals. Background `{colors.canvas}`, text `{colors.ink}`, same geometry, 1px hairline border.

**`feature-card`** — Used in 2-up grids for the dual transaction entry form (Mode A: Expense vs Mode B: Savings) and 3-up grids for multi-horizon metrics. Background `{colors.canvas}`, text `{colors.ink}`, type `{typography.title-md}`, rounded `{rounded.xl}`, padding 32px, 1px `{colors.hairline}` border.

---

### Personal Finance & Transaction Surfaces

**`transaction-row`** — Horizontal row in transaction history. Background transparent, 1px hairline divider. Layout:
- 32px circular category icon plate on left.
- Item/Purchase title + Destination/Merchant subtext.
- Exact auto-timestamp in `{typography.caption}` using PiggyMono (`YYYY-MM-DD HH:mm:ss`).
- Monetary amount in `{typography.number-display}` (PiggyMono).
- Flow classification with `{component.price-up-cell}` (green text `+₱500.00` for savings deposit) or `{component.price-down-cell}` (red text `-₱250.00` for expense).

**`price-up-cell`** + **`price-down-cell`** — Inline flow cells. Color only — green (`#05b169`) or red (`#cf202f`) text in `{typography.number-display}`, **no background fill**.

**`category-icon-circular`** — Circular plate behind category glyphs (Food, Utilities, Travel, Ipon Deposit, Shopping). Background `{colors.surface-strong}`, rounded `{rounded.full}`, 32px diameter.

**`metric-stat-card`** — Minimalist stat container. 1px hairline border, white canvas, displaying horizon label ("PAST 24 HOURS", "7-DAY ROLLING", "TOTAL IPON STASH"), amount in `{typography.display-sm}` (PiggyMono), and net change percentage in `{component.price-up-cell}` or `{component.price-down-cell}`.

**`goal-progress-card`** — Milestone card (Emergency Fund, Travel Stash). Background `{colors.canvas}`, rounded `{rounded.xl}`, padding 24px, 1px hairline border. Features an understated 6px height track with Vault Rose progress bar and PiggyMono percentage.

---

### Forms

**`text-input`** — Standard text and amount input. Background `{colors.canvas}`, text `{colors.ink}`, rounded `{rounded.md}` (12px), padding 14px × 16px, height 48px, 1px `{colors.hairline}` border. On focus, border thickens to 2px Vault Rose (`#e11d48`). Numbers typed render in PiggyMono.

**`search-input-pill`** — Pill-shaped search bar for transaction filtering. Background `{colors.surface-strong}`, rounded `{rounded.pill}`, padding 12px × 20px, height 44px.

**`preset-deposit-chip`** — Quick-add deposit pills (`+50`, `+100`, `+500`, `+1,000`, `+2,000`). Background `{colors.surface-strong}`, text `{colors.ink}`, font PiggyMono, rounded `{rounded.pill}`, padding 6px × 14px. On click/active: background `{colors.primary}`, text `{colors.on-primary}`.

---

### Tags & Badges

**`badge-pill`** — Small uppercase pill used as horizon/category labels ("AUTOMATED", "PHP · ₱", "IPON OS", "CASH FLOW SURPLUS"). Background `{colors.surface-strong}`, text `{colors.ink}`, type `{typography.caption-strong}`, rounded `{rounded.pill}`.

---

### CTA / Footer

**`cta-band-dark`** — Pre-footer "Master your personal cash flow" band. Background `{colors.surface-dark}`, text `{colors.on-dark}`, vertical padding 96px. Centered headline + two CTAs ("Start Logging Free", "Read Documentation").

**`footer-light`** — Closing white-canvas footer. Background `{colors.canvas}`, text `{colors.body}`, border-t 1px `{colors.hairline}`. 4 to 6-column link list (Features, Formats, Currencies, Privacy, Community).

**`footer-link`** — Individual footer link. Background transparent, text `{colors.body}`.

**`legal-band`** — Bottom strip beneath footer columns. All text `{colors.muted}` at `{typography.caption}` ("PiggyVault · All data saved locally in your browser with full client-side privacy").

---

## Do's and Don'ts

### Do
- Reserve `{colors.primary}` (Vault Rose) for primary CTAs, wordmark, brand-glyph highlights, and inline accent links.
- Set every CTA as `{rounded.pill}` (100px); every category/currency glyph plate as `{rounded.full}`.
- Keep PiggyDisplay headlines at weight 400.
- Use the dark/light band rotation as page rhythm (white dashboard body, dark hero showcase, white history feed).
- Render every numerical value, currency amount, timestamp, and percentage in PiggyMono via `{typography.number-display}`.
- Pair every dark hero with a layered product-UI mockup card stack showing real PiggyVault UI components.

### Don't
- Don't introduce a rainbow of accent colors or multi-color gradients. Vault Rose is the only action color; cash flow green/red are semantic-only.
- Don't bold display copy — display sits at weight 400; bolding shifts the brand voice into noisy consumer fintech.
- Don't add drop shadow tiers — system has one single soft drop shadow tier.
- Don't use sharp `{rounded.none}` (0px) on CTAs or containers.
- Don't mix PiggyDisplay and PiggySans inside the same headline.
- Don't use semantic green/red as a button background.
- Don't use gamified badge icons or loud confetti that clashes with the quiet editorial layout.

---

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | Hero h1 80→40px; feature card grid 1-up; transaction row stacks (title on top, amount + timestamp beneath); nav collapses to hamburger; layered product-UI cards collapse to single card. |
| Tablet | 640–1024px | Hero h1 64px; dual transaction form 1-up stacked; metric cards 2-up; transaction rows stay horizontal but compress columns. |
| Desktop | 1024–1280px | Full hero h1 80px; dual transaction form 7-col / 5-col split; metric cards 4-up; full transaction row layout. |
| Wide | > 1280px | Content caps at 1200px; hero elements full-bleed. |

### Touch Targets
- Primary CTA pill at 44px height — at WCAG AAA.
- Larger hero pill (`{component.button-pill-cta}`) at 56px — well above AAA.
- Category icon circles at 32px — padded 8px row creates effective 48px tap zone.
- Search pill at 44px height — at AAA.

### Collapsing Strategy
- Top nav switches to compact layout below 768px. Sign Up and User Button stay visible.
- Hero h1 steps down: 80 → 64 → 52 → 44 → 36px on smallest screens.
- Layered product-UI mockup cards collapse from 2 stacked into a single card on mobile.
- Transaction rows on mobile stack vertically: title and merchant on top, amount and timestamp beneath.

---

## Iteration Guide

1. Focus on a single component at a time. Reference design tokens directly.
2. New CTAs default to `{rounded.pill}` (100px); new icon plates default to `{rounded.full}`. Cards use `{rounded.xl}`.
3. Variants live as separate entries inside the components inventory.
4. Use `{token.refs}` everywhere — never inline arbitrary hex colors.
5. Hover state never documented. Only Default and Active/Pressed.
6. PiggyDisplay 400 for display, PiggySans 400/600 for body. PiggyMono on every number.
7. Vault Rose stays scarce — one or two rose moments per section.

---

## Known Gaps

- PiggyDisplay, PiggySans, PiggyMono are implemented via Inter (weight 400, letter-spacing -1.5%) and JetBrains Mono / Geist Mono (weight 500).
- Multi-currency conversion rates are static display mappings; dynamic FX rates documented as future expansion.
- Offline `localStorage` caching handles complete persistence without requiring server-side databases.
- Ipon Gold appears only inside coin/piggy bank illustrative glyphs; documented as illustrative-only.
