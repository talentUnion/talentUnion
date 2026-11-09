# Transmission Trail Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace heatmap + arbitrary history demo with a live signal-trail SVG; remove §04 demo; renumber contact.

**Architecture:** `buildTrailPath(weeks)` extracts chronological commit cell centers; `renderTransmissionTrail` draws dim grid, visited cells, dashed path, probe; `generate.js` writes `transmission-record.svg` with existing fetch fallback.

**Tech Stack:** Node CommonJS, hand-built SVG, Jest, existing `@octokit/graphql` contributions fetch.

**Spec:** `docs/superpowers/specs/2026-06-13-transmission-trail-design.md`

---

### Task 1: Trail path builder

**Files:** Create `src/data/trailPath.js`, `tests/trailPath.test.js`

- [ ] Test: chronological points only where `count > 0`, correct grid center math
- [ ] Implement `buildTrailPath(weeks, layout?)` exporting `{ points, grid }`
- [ ] Commit

### Task 2: Transmission trail renderer

**Files:** Create `src/svg/transmissionTrail.js`, `tests/transmissionTrail.test.js`; delete `src/svg/heatmap.js`, `tests/heatmap.test.js`

- [ ] Test: SVG has dashed path, probe `<line`, dim cells, legend text
- [ ] Implement `renderTransmissionTrail(weeks, opts?)`
- [ ] Commit

### Task 3: Remove arbitrary history

**Files:** Delete `src/data/sampleHistory.js`, `tests/sampleHistory.test.js`, assets `heatmap-example.svg`, `section-history-example.svg`

- [ ] Commit deletions

### Task 4: Wire generator + config + README

**Files:** Modify `scripts/generate.js`, `profile.config.json`, `README.md`, `tests/generate.test.js`, `tests/readme.test.js`

- [ ] Generate `transmission-record.svg` instead of `heatmap.svg`; drop example outputs
- [ ] README: remove §04 demo block; renumber contact; reference `transmission-record.svg`
- [ ] Run `npm test` + `npm run generate`
- [ ] Commit
