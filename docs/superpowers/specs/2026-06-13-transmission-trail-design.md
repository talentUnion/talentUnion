# Transmission Trail — Design Spec

- **Date:** 2026-06-13
- **Status:** Approved (visual mockup confirmed)
- **Parent:** `docs/superpowers/specs/2026-06-13-voyager-golden-record-readme-design.md`
- **Mockup:** `docs/mockups/transmission-trail-preview.html`

---

## 1. Purpose

Replace the plain contribution heatmap and the synthetic “arbitrary history” demo with a single **signal trail** visualization: a dim GitHub contribution grid with a dashed gold constellation path through real commit days and a Voyager-style probe at the latest signal.

## 2. Goals / Non-Goals

**Goals**
- One §03 box: `assets/transmission-record.svg`, generated from live GitHub contribution data.
- Hybrid trail: dashed constellation line + probe head (matches hero craft geometry).
- Dim grid underneath; visited cells slightly brighter; no intensity scale legend.
- Remove §04 arbitrary history entirely (header, synthetic SVG, `sampleHistory` module).
- Renumber Contact from §05 → §04.
- Same fetch/fallback behavior as current heatmap (preserve last good file on API failure).

**Non-Goals**
- No interactive or playable game in README (static SVG only).
- No animated GIF (future option only).
- No shortest-path snake solver (use chronological visit order of days with `count > 0`).

## 3. Visual Design

| Layer | Treatment |
|-------|-----------|
| Frame | Existing `box()` — black bg, gold border, embedded fonts |
| Grid | All 52×7 cells: `#0a0805`, faint |
| Visited cells | `#5a4220`–`#a37a3a` by intensity; head cell brightest |
| Trail | `#d4a85a` dashed polyline through cell centers, chronological |
| Probe | Hero craft glyph at last visited cell + soft glow |
| Label | `§ TRANSMISSION RECORD` |
| Footer | `{N} WEEKS · LIVE · GITHUB · SIGNAL TRAIL` |

Empty state (no commits): dim grid only, footer `NO SIGNAL · OFFLINE`.

## 4. Architecture

```
contributions.js (fetch) → normalizeCalendar(weeks)
trailPath.js           → buildTrailPath(weeks) → [{x,y,count}, …]
transmissionTrail.js   → renderTransmissionTrail(weeks, opts) → SVG string
generate.js            → write assets/transmission-record.svg
README.md              → embed transmission-record.svg under §03 header
```

**Remove:** `heatmap.js`, `sampleHistory.js`, `heatmap.svg`, `heatmap-example.svg`, `section-history-example.svg`, related tests.

## 5. README Structure (after)

1. Hero + About  
2. §02 Selected work (2×2 tiles)  
3. §03 Transmission record → `transmission-record.svg`  
4. §04 Contact (buttons)  
5. Footer  

## 6. Testing

- `trailPath.test.js`: path order, coordinates, empty weeks.
- `transmissionTrail.test.js`: SVG contains probe, dashed path, dim grid, no `NaN`.
- Update `generate.test.js`, `readme.test.js`; remove heatmap/sampleHistory tests.

## 7. Config

Update `profile.config.json` `sections`: remove `historyExample`; set `historyLive.subtitle` to signal-trail copy; renumber `contact.num` to `"04"`.
