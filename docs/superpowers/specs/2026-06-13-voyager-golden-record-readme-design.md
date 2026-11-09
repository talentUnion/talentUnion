# DeepExtrema Profile README — Voyager Golden Record Redesign

- **Date:** 2026-06-13
- **Status:** Approved design (pending written-spec review)
- **Type:** GitHub *profile* README (the special `DeepExtrema/DeepExtrema` repo)
- **Repo:** `deepextrema`

---

## 1. Purpose & Context

The current profile README is a tall stack of full-width auto-generated SVG banners
plus injected markdown. It feels unbalanced and "plain/ugly," and much of its content
is broken or stale because it is regenerated every 6 hours from fragile live sources
(NASA APOD, HuggingFace trending, OpenAI phrases, etc.). The repository also carries a
large amount of unrelated trash (workflow log dumps, dead scripts, unused assets/tests).

We are rebuilding the README **from scratch** with a clean, intentional, Voyager
Golden Record-inspired aesthetic, and rebuilding the generation pipeline so it is
**properly automated, reliable, and free of cruft**.

This is a **personal + professional** profile. It showcases the person, not a single
product. The Parallax/Ephemeris NASA project is deliberately **not** a centerpiece.

## 2. Goals / Non-Goals

**Goals**
- A beautiful, balanced, Golden Record-inspired profile README.
- Every designed element is a **self-contained framed box** (own dark background +
  gold border) so it renders **identically in GitHub light and dark themes** and never
  blends awkwardly into GitHub's chrome.
- An **automated build**: a clean GitHub Action regenerates the box SVGs from small
  curated source files (on push and on a schedule). The look/structure is always
  code-generated and consistent; the words/projects are curated content the owner edits.
- The **contribution heatmap** is the one genuinely live element, refreshed on schedule.
- **Remove all pre-existing trash** so the repo contains only what the new README needs.

**Non-Goals**
- No live NASA/HuggingFace/OpenAI/AI-phrase feeds (the main source of breakage). Removed.
- No telemetry/signal-feed/commit-clock/timeline cockpit. Removed.
- No marker-based markdown injection of text content (README is hand-written static
  markdown that references generated SVGs; only SVG files are regenerated).
- Parallax/Ephemeris is **not** featured — at most one quiet line + a link.
- No stats/badges row (cut as gimmicky "extra stuff").

## 3. Aesthetic Direction

Approved direction: **"Cinematic Deep-Space"** — warm radial gradient toward black,
a luminous golden disc, a faint starfield, constellation lines, and a small Voyager
craft trailing a signal arc. Calm and balanced (not busy), with generous breathing room.

**Voice:** poetic / cinematic. Evocative "transmission from the frontier" tone.
The spine/through-line is the tagline **"Turning scattered signals into constellations."**

**Palette** (canonical, from `src/voyagerConstants.js`; box borders use a dark gold):

| Token | Hex | Use |
|---|---|---|
| BG | `#000000` | box interior base |
| BG_PANEL | `#0a0805` | nested tile background |
| GOLD | `#d4a85a` | primary lines, labels |
| GOLD_BRIGHT | `#f5e6b8` | headings, name, key text |
| GOLD_DEEP | `#7d5d2a` | secondary lines |
| BRASS | `#a37a3a` | mono micro-copy |
| INK | `#dcc998` / INK_MID `#a89465` / INK_DIM `#6b5a3a` | body / dim text |
| Box border | `#3a2c12` (dark gold) | the framed-box outline |

**Type:** `IBM Plex Serif` (display/body) + `JetBrains Mono` (labels/micro-copy),
italic serif for poetic lines. (See §5 for font-fidelity requirement.)

## 4. README Structure (the boxes, in order)

All boxes are centered (`<div align="center">`), stacked with blank-line spacing.
Each is a generated SVG referenced via `<img>`; clickable boxes are wrapped in a
markdown link: `[![alt](assets/x.svg)](url)`.

1. **Hero box** — cinematic banner. `Deep` + italic gold `Extrema`, tagline
   "Turning scattered signals into constellations," golden disc, constellation lines,
   Voyager craft + signal arc. (Not linked, or linked to GitHub profile.)
2. **About box** — poetic lede + short body:
   - Lede: *"I build for the hard problems — the ones that only move when the engineering is real."*
   - Body: *"Founder, independent researcher, engineer. I chase faint signals across machine learning, autonomy, and the edge of what's reliable."*
   - One quiet line: `✦ Currently building Ephemeris — edge-AI for spacecraft ✦`,
     linking to the Parallax site.
3. **Selected work box** — section label "Selected work" + a 2×2 grid of **four
   individually-bordered, individually-linked tiles** (each tile is its own SVG wrapped
   in a link to its repo):
   - **Signal Scout** — *Finds the faint signal buried in the noise.*
   - **Data Quality Agent** — *A sentinel for health data — drift, gaps, and anomalies caught before a model sees them.*
   - **Ask My Paper** — *Ask a question, get answers grounded in the papers themselves.*
   - **Donna** — *An agent that keeps the work organized and moving.*
   - (One-liners confirmed final. Tile repo URLs in §6.)
4. **Transmission record box** — the **live contribution heatmap**, styled gold-on-dark
   to match (52 weeks). Regenerated on schedule.
5. **Contact** — three framed button SVGs, each linked, in order:
   **GitHub** · **Website** (`taimoorawan.dev`) · **Parallax**.
6. **Footer box** — Golden Record disc mark + tagline
   *"Turning scattered signals into constellations."* + mono stamp
   `DEEPEXTREMA · SIGNAL OUTBOUND · ✦`.

## 5. Rendering, Fidelity & GitHub Constraints

- A profile README is **Markdown + a sanitized HTML subset**. Stripped: `<style>`,
  `<script>`, CSS classes/ids, inline `style=""`. Therefore **all design lives inside
  committed SVG image files**; the README is markdown that embeds them.
- **Theme independence:** each SVG paints its own dark background + gold border, so it
  looks identical under GitHub light/dark. This is the core requirement.
- **No top-right region tags / annotations** of any kind (those were mockup overlays).
- **SVG is static** when embedded as `<img>` (animation/scripts are stripped) — the hero
  is a still image. Acceptable.
- **Font fidelity (required):** SVG text must render identically for every viewer
  regardless of locally-installed fonts. The generator MUST guarantee this by embedding
  the required font subsets as base64 `@font-face` inside each SVG (preferred) **or** by
  converting text to vector paths at build time. Do not rely on the viewer having
  IBM Plex Serif / JetBrains Mono.
- **Glow without filters:** approximate the disc glow with layered radial gradients, not
  `feGaussianBlur`, to avoid inconsistent filter rendering through GitHub's image proxy.
- **Links:** clickable boxes use `[![alt](svg)](url)`; per-project tiles are separate
  SVGs so each links to its own repo. Every `<img>` gets meaningful `alt` text.

## 6. Build Architecture

**Stack:** Node-only, hand-built SVG string templates (no React/satori, no Python).
Reuse the palette module; reuse only the GitHub GraphQL utility needed for the heatmap.

**Source of truth (curated content):** a single `profile.config.json` at repo root:
```jsonc
{
  "name": "DeepExtrema",
  "tagline": "Turning scattered signals into constellations",
  "about": {
    "lede": "I build for the hard problems — the ones that only move when the engineering is real.",
    "body": "Founder, independent researcher, engineer. I chase faint signals across machine learning, autonomy, and the edge of what's reliable."
  },
  "currently": { "text": "Currently building Ephemeris — edge-AI for spacecraft", "url": "https://parallex-website.jubranalawdi76.workers.dev/" },
  "projects": [
    { "name": "Signal Scout", "blurb": "Finds the faint signal buried in the noise.", "url": "https://github.com/DeepExtrema/signal-scout" },
    { "name": "Data Quality Agent", "blurb": "A sentinel for health data — drift, gaps, and anomalies caught before a model sees them.", "url": "https://github.com/DeepExtrema/DataQualityValidationAgentMedicalData" },
    { "name": "Ask My Paper", "blurb": "Ask a question, get answers grounded in the papers themselves.", "url": "https://github.com/DeepExtrema/AskMyPaper" },
    { "name": "Donna", "blurb": "An agent that keeps the work organized and moving.", "url": "https://github.com/DeepExtrema/Donna" }
  ],
  "links": {
    "github": "https://github.com/DeepExtrema",
    "website": "https://taimoorawan.dev",
    "parallax": "https://parallex-website.jubranalawdi76.workers.dev/"
  }
}
```

**Generator modules** (under `scripts/` + `src/`), each with one clear job:
- `palette` — color/font constants (from `voyagerConstants.js`).
- `fonts` — load + base64-embed (or path-convert) the font subsets for SVG text.
- `svg/hero.js` — hero box SVG from config.
- `svg/about.js` — about box (+ currently line) SVG.
- `svg/projectTile.js` — one project tile SVG (called per project).
- `svg/heatmap.js` — gold-on-dark contribution heatmap SVG from calendar data.
- `svg/contactButton.js` — one labeled button SVG (called per link: github/website/parallax).
- `svg/footer.js` — footer box SVG.
- `data/contributions.js` — fetch GitHub contribution calendar via GraphQL.
- `generate.js` — orchestrator: load config, render all boxes, write to `assets/`.

**Output:** all generated SVGs in `assets/` (single asset dir):
`hero.svg`, `about.svg`, `work-signal-scout.svg`, `work-data-quality.svg`,
`work-ask-my-paper.svg`, `work-donna.svg`, `heatmap.svg`, `btn-github.svg`,
`btn-website.svg`, `btn-parallax.svg`, `footer.svg`.

**README.md:** hand-written static markdown referencing those assets. Not auto-edited.

## 7. GitHub Action

New workflow `.github/workflows/build-readme.yml` (replaces `update-cockpit.yml`):
- **Triggers:** `push` to `main` on paths `[profile.config.json, scripts/**, src/**, assets/fonts/**, .github/workflows/build-readme.yml]`; `schedule` daily (heatmap refresh); `workflow_dispatch`.
- **Steps:** checkout → setup Node 20 (npm cache) → `npm ci` → `node scripts/generate.js` → commit changed files in `assets/` if any.
- **Secrets:** only `GITHUB_TOKEN` (for the contributions GraphQL query). No NASA/HF/OpenAI keys.
- **Permissions:** `contents: write`.
- **Bot commit identity:** `voyager-bot`.

**Error handling / resilience:**
- Project/about/hero/footer boxes are deterministic from config → cannot break at build.
- If the contributions fetch fails, the generator logs a warning and **leaves the
  existing `heatmap.svg` untouched** (never writes broken/empty/"stale" output).
- If the generator throws, the workflow fails visibly and commits nothing.

## 8. Repository Cleanup (explicit)

**Remove** (confirmed trash / now-unused):
- `workflow log file 1/` (entire directory of CI log dumps)
- `Parallax Sighting.html`, `docs/index.html`, `dist/` (snake SVGs)
- `assets/` legacy files: `constellation_header.svg`, `dna_helix.svg`,
  `evolution_chart.svg`, `gravity_data.json`, `gravity_well.html`,
  `orbital_mechanics.png`, `parallax_stars.svg` (replaced by generated assets)
- `readme-assets/` (entire old asset set: header/divider/clock/heatmap/timeline/etc.)
- Old Python pipeline: `scripts/*.py`, `src/*.py`, `src/__pycache__/`, `requirements.txt`
- Old Node pipeline pieces no longer used: `scripts/generateAll.js`,
  `src/components/*.jsx`, `src/utils/satoriRenderer.js`, satori/react deps,
  `data/focus_tags.yaml`, `data/subtitles.json`, stale `data/cache/*`, `data/logs/*`
- Old tests that target removed code: `tests/assets.test.js`, `components.test.js`,
  `generateAll.test.js`, `parallax.test.js`, `satoriRenderer.test.js`, `workflow.test.js`
- `.github/workflows/update-cockpit.yml`

**Keep / adapt:**
- `src/voyagerConstants.js` (palette) — keep.
- `src/utils/github.js` GraphQL contribution-calendar logic — keep the useful part,
  trim the rest, move under the new generator structure.
- `package.json` — prune deps to what's needed (`@octokit/graphql`/`rest`, `dotenv`);
  remove `react`, `satori`.
- Keep `jest.config.js` for the new lightweight tests.

## 9. Testing

Lightweight Jest tests for the generator:
- Config loads and validates (required fields present).
- Each box renderer returns well-formed SVG (parseable XML; contains expected
  name/tagline/project text; has dark background rect + border).
- Heatmap fallback: when contribution fetch fails, the existing `heatmap.svg` is
  preserved (not overwritten).
- README references every generated asset path that exists in `assets/`.

## 10. Open Items — RESOLVED

- **Project one-liners:** confirmed final (as drafted).
- **Project repo URLs:** provided —
  Signal Scout `https://github.com/DeepExtrema/signal-scout`,
  Data Quality Agent `https://github.com/DeepExtrema/DataQualityValidationAgentMedicalData`,
  Ask My Paper `https://github.com/DeepExtrema/AskMyPaper`,
  Donna `https://github.com/DeepExtrema/Donna`.
- **Parallax URL:** `https://parallex-website.jubranalawdi76.workers.dev/` for now
  (owner will change the domain later — keep it configurable in `profile.config.json`).
- **Personal website:** `https://taimoorawan.dev` — added as a Contact button (GitHub · Website · Parallax).
- **Hero link target:** unlinked (confirmed).

## Appendix A — Final copy

- **Name:** DeepExtrema
- **Tagline:** Turning scattered signals into constellations
- **About lede:** I build for the hard problems — the ones that only move when the engineering is real.
- **About body:** Founder, independent researcher, engineer. I chase faint signals across machine learning, autonomy, and the edge of what's reliable.
- **Currently:** Currently building Ephemeris — edge-AI for spacecraft → (Parallax site)
- **Footer stamp:** DEEPEXTREMA · SIGNAL OUTBOUND · ✦
- **Links:** GitHub `https://github.com/DeepExtrema` · Website `https://taimoorawan.dev` · Parallax `https://parallex-website.jubranalawdi76.workers.dev/`
