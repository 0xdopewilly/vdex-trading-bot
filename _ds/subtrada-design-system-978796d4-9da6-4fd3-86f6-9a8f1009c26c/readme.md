# SubTrada Design System

The brand, foundations, components and product recreations for **SubTrada** — a
construction-procurement platform that connects **main contractors** (who buy
trades) with **subcontractors** (the trades themselves), and runs the whole
tender lifecycle in between.

This project is consumed by an automated compiler: it bundles every component
into a runtime library (`_ds_bundle.js`), indexes the tokens, and renders every
`@dsCard`-tagged HTML file in the Design System tab. You author the source;
never hand-edit `_ds_bundle.js`, `_ds_manifest.json`, or `_adherence.oxlintrc.json`.

---

## 1. Company & product context

SubTrada is a UK construction-procurement SaaS. The core problem it attacks:
procurement today is run on spreadsheets, email chains and PDFs. Main
contractors struggle to find vetted subcontractors, issue tenders, and compare
returns line-by-line; subcontractors struggle to be discovered and to prove
compliance. SubTrada is the shared system of record for both sides.

**Two products / surfaces** (both recreated as UI kits here):

- **Main-contractor app** (a.k.a. the *client* side) — desktop web. Dashboard of
  projects, a **Subcontractor Directory** (search/filter vetted firms), per-project
  **procurement trackers**, outbound **tendering**, and the signature
  **tender-comparison spreadsheet** that lays bidders side-by-side, line item by
  line item, with totals.
- **Subcontractor app** — desktop + mobile web. Company profile, **compliance
  tiers** (Tier 4 → Tier 1, with verification), inbound tender inbox, and
  expressions of interest.

A third concept that recurs across both: the **compliance tier** signal
(`Tier 4 — Verified`, gold star) — a subcontractor's trust score.

### Sources provided
- **Brand logos** — five canonical SVG lockups (`uploads/subtrada-01…05`), plus a
  ChatGPT-generated brand image. Copied into `assets/logos/`.
- **Onboarding guides** — two self-contained offline HTML walkthroughs (client &
  subcontractor). These embed ~45 real product screenshots and the live webfonts.
  Decoded copies and extracted screenshots live in `research/` (screenshots in
  `research/screens/` and `research/sub_screens/`) — the **source of truth for the
  UI kits**, since no codebase or Figma was provided.
- **Marketing videos** — three H.264 MP4s (`assets/video/`): Main Contractor Intro,
  Platform Overview, Subcontractor Intro. ~6 MB each, web-playable.
- No GitHub repo or Figma link was supplied; UIs here are reconstructed from the
  onboarding screenshots and the live product faces.

---

## 2. Content fundamentals (voice & copy)

- **Plain, operational British English.** Construction-industry serious, not
  startup-cute. Spelling is UK: *tender*, *programme*, *organisation*, *£*.
- **Second person, action-led.** Copy addresses the user as *you* and leads with
  verbs: "Add New Trade", "Send Tender Invitation", "Export Data", "View Profile".
- **Domain vocabulary is exact and capitalised as proper nouns.** *Tender*,
  *Trade*, *Procurement Tracker*, *Subcontractor Directory*, *Inbound Tenders*,
  *PQQ*, *Tier 4 — Verified*, *Open to Tenders*. The onboarding guides deliberately
  name every label so users can `Cmd/Ctrl+F` to it — names are stable and literal.
- **Numbers are concrete and monospaced.** Money always `£` + thousands separators
  + `.00` (`£133,760.00`). Counts as ratios (`3 / 5` returned/invited), dates as
  `21 May 2026`.
- **Tone:** confident but grounded. Short sentences. No exclamation marks in UI.
  Status is stated flatly (*Declined*, *Not started*, *Pending*), never softened.
- **Microlabels** (table headers, eyebrows, metadata) are **UPPERCASE mono with
  wide tracking** — this is the signature texture (e.g. `PROCUREMENT · OUTBOUND`).
- **No emoji, ever.** Iconography carries all glyph meaning (see §5).

Examples lifted from the product:
> *"Your dashboard is your home screen."*
> *"Showing 4 subcontractors"* · *"Open to Tenders"* · *"+46 more"*
> CTA: *"Send Tender Invitation"* · Empty state: *"nothing to show"*

---

## 3. Visual foundations

SubTrada lives in **two surface worlds**, bridged by a single teal accent.

- **INK** — dark navy-teal chrome. Sidebars, the app frame, totals bars, video
  surrounds. Scale `--st-ink-900 … 500` (`#0a1417 → #2a3940`). Text on ink is
  `--st-on-ink` (`#e8efef`) down to faint `#6b797d`. Hairlines are white at
  7–14% opacity.
- **PAPER** — warm off-white content. Dashboards, forms, docs. `--st-paper`
  (`#f6f3ec`) page, `#fff` cards, warm borders `--st-paper-line(-2)`. Text ink is
  `#16221f` → body `#2c3633` → muted `#5b6562`.
- **TEAL / MINT** — the one accent. Brand teal `#2FD4C1`; mint ramp
  `#5eead4 → #2dd4bf`. On paper, set teal **text** in `--st-mint-deep` (`#1e6f63`)
  for legibility; use brighter mint for fills, dots, focus rings and active chrome.
  Discipline: **exactly one teal block** in the logo, one accent per view.

**Type.** *Geist* (variable) for all UI; *Geist Mono* (variable) for labels,
eyebrows, codes, metadata, money and table numerics — both self-hosted from the
live product bundle (`assets/fonts/`). Display/headings are Geist 600 with tight
tracking (`-0.02 to -0.03em`). Body 15.5px / 1.5. Micro-labels 10.5px uppercase
mono at `0.14em`. Min on-screen body 13px; never smaller than the mono micro size.

**Spacing & layout.** Soft 8px grid with a 4px half-step (`--space-*`). Page side
gutter 40–56px. Sidebar fixed at 248px. Reading measure ~920px. Cards gutter ~14px,
pad ~22px.

**Radii.** Restrained: controls 6–8px, panels 10px, **cards/dialogs/screenshots
12px**, media 16px, pills full. Nothing is heavily rounded.

**Cards.** White on paper, **1px warm hairline border**, 12px radius, **soft low
shadow** (`--shadow-sm`) — a document feel, not material elevation. Optional header
= title (Geist 600) + right-aligned action link. No colored left-border accents.

**Shadows.** Soft and low, tuned for paper: `sm` resting cards, `md` screenshot
frames, `pop` menus/drawers, `lg` dialogs/lightboxes. Avoid heavy drop shadows.

**Status system.** A fixed semantic palette maps onto the tender lifecycle —
success (Won/Awarded/Active/Submitted/Verified), info (Sent), violet (Viewed),
warn (Pending/expiring), danger (Declined/overdue), neutral (Not started/
Completed), gold (Tier verification). Rendered as soft-tinted **pills** with an
optional leading dot; `solid` for the strongest "Active" state. Use `statusTone()`
to map any status string to its tone.

**Backgrounds.** Flat colour only — paper or ink. No gradient backgrounds, no
photographic hero washes, no repeating textures. The *only* gradient permitted is a
short mint progress-bar fill. Imagery = real product **screenshots** in 12px-radius
framed cards (mac-style chrome dots in the guides), and the marketing **videos**.

**Motion.** Restrained and quick. `--ease-out` (decelerate) for most; a gentle
`--ease-spring` only for playful affordances. Durations 120/220/280ms. Drawers
slide in from the right; menus fade+rise. No bounce on content, no infinite loops.

**Interaction states.**
- *Hover:* low-opacity tint (`rgba(0,0,0,0.05)` on paper, `rgba(255,255,255,0.04)`
  on ink), or a row background shift to `--surface-sunken`. Links → mint-deep.
- *Press:* a 1px downward nudge (`translateY(1px)`) on buttons — no colour change.
- *Focus:* 3px mint focus ring (`--focus-ring`) + mint border on inputs.
- *Disabled:* 45–50% opacity, `not-allowed` cursor.

**Transparency / blur.** Used sparingly — soft tints for status fills and hovers,
a 35%-ink scrim behind drawers. No heavy glassmorphism.

---

## 4. Components

Reusable React primitives (`components/<group>/`). Import via
`const { X } = window.SubTradaDesignSystem_978796` after loading `_ds_bundle.js`.
Each has a `.jsx`, a `.d.ts` props contract, a `.prompt.md`, and a `@dsCard` thumbnail.

| Group | Components |
|---|---|
| `icon/` | **Icon** (Lucide-style line set, `currentColor`), `ICON_NAMES` |
| `buttons/` | **Button** (primary/secondary/accent/ghost/danger), **IconButton** |
| `forms/` | **Input**, **Select**, **Checkbox** |
| `display/` | **Badge** (+ `statusTone`), **Tag**, **Avatar**, **StatCard**, **TierBadge** |
| `layout/` | **Card**, **Tabs** |

Starting points (consuming-project picker): Button, Input (Controls); Badge,
StatCard (Display); Icon (Foundations); Card (Layout).

---

## 5. Iconography

- **System:** Lucide-style line icons — 24×24, 2px stroke, round caps/joins,
  `currentColor`. The product uses exactly this language; our **`Icon`** component
  ships the glyphs the kits rely on (see `ICON_NAMES`) and is **Lucide-compatible**,
  so consumers can drop in the full Lucide set 1:1 without restyling.
- **Sizing:** 16px in dense UI / buttons, 18px nav, 14px inline with mono labels.
  Icons inherit text colour; tint only via `tone`/`color`.
- **No emoji. No unicode-as-icon.** Status meaning comes from the dot + pill colour,
  not from emoji. The only "decorative" vector is the brick **logo mark**.
- **Brand assets** (`assets/`): logo lockups `subtrada-canonical / dark-invert /
  mono-ink / mono-teal / teal-forward` (SVG), plus standalone brick marks
  `subtrada-icon` (on paper) and `subtrada-icon-light` (on ink). The mark reads as a
  wall in **brick bond**: a wide+small block on top, small+wide below, with **one**
  block teal. Self-hosted webfonts in `assets/fonts/`. Marketing MP4s in
  `assets/video/`.

---

## 6. Index / manifest

**Root**
- `styles.css` — global entry point (imports only). Consumers link this one file.
- `readme.md` — this guide.
- `SKILL.md` — Agent-Skill wrapper for downloadable use.

**`tokens/`** — `colors.css`, `typography.css`, `spacing.css`, `fonts.css`
(all `@import`ed by `styles.css`). 122 tokens; base values + semantic aliases.

**`guidelines/`** — foundation specimen cards (Design System tab):
Colors (brand, ink, mint, paper, status), Type (families, headings, body),
Spacing (scale, radii, shadows), Brand (logo lockups, the brick mark).

**`components/`** — see §4.

**`ui_kits/`** — full-screen product recreations:
- `contractor/` — main-contractor (client) app: dashboard, subcontractor directory
  + profile drawer, project page + procurement tracker, tender-comparison
  spreadsheet. `index.html` is the interactive click-through.
- `_subtrada-ui.jsx` — a self-contained, window-attached build of the primitives
  (generated from `components/**`) so kits render in any preview, since the
  compiled `_ds_bundle.js` only resolves inside the Design System tab.

**`assets/`** — `logos/`, `fonts/`, `video/`.

**`research/`** — decoded onboarding guides + extracted product screenshots
(reference only; not shipped).

---

## 7. Substitutions & notes

- **Fonts are the real product faces** (Geist / Geist Mono variable woff2), extracted
  from the onboarding bundle — no substitution needed.
- **Icons** are an in-house Lucide-style set chosen to match the product's line-icon
  language; if the product later standardises on a specific icon library, swap names
  1:1 against Lucide.
- No codebase/Figma was provided, so UI kits are reconstructed from real product
  **screenshots** in `research/` — pixel-faithful in look, simplified in behaviour.
