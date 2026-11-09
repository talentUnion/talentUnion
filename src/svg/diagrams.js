// The page's second ink: hairline figures in the manner of a notebook —
// measured, constructed, sparsely hatched. Everything here draws with
// pal.sepia (the drawing ink) and pal.construction (faint construction
// lines); text ink and rubric red stay reserved for typography.
//
// The only annotations allowed on a figure are statements that are true of
// the drawing itself (its eccentricity, its constructed angle) — never
// invented measurements.
//
// Emblems draw inside a 46x46 live area centered on (cx, cy); the artwork
// was authored on a 60x60 canvas centered on (30, 30).

function emblem(cx, cy, inner) {
  return `<g transform="translate(${cx - 30} ${cy - 30})" fill="none" stroke-linecap="round" stroke-linejoin="round">${inner}</g>`;
}

// Signal Scout — a source located by its field: quarter-fan of arcs with a
// measured bearing ray.
function signal(cx, cy, pal) {
  return emblem(cx, cy, `
    <g stroke="${pal.construction}" stroke-width="1">
      <line x1="15.81" y1="38.51" x2="16.94" y2="17.04"/>
      <line x1="21.49" y1="44.19" x2="42.96" y2="43.06"/>
    </g>
    <g stroke="${pal.sepia}" stroke-width="1.1">
      <path d="M 15.97 35.51 A 9 9 0 0 1 24.49 44.03"/>
      <path d="M 16.39 27.52 A 17 17 0 0 1 32.48 43.61"/>
      <path d="M 16.81 19.53 A 25 25 0 0 1 40.47 43.19"/>
      <line x1="18.68" y1="41.32" x2="35.65" y2="24.35"/>
      <line x1="35.65" y1="24.35" x2="34.25" y2="27.66"/>
      <line x1="35.65" y1="24.35" x2="32.34" y2="25.75"/>
      <line x1="23.42" y1="34.03" x2="25.97" y2="36.58"/>
    </g>
    <circle cx="15.5" cy="44.5" r="1.7" fill="${pal.sepia}" stroke="none"/>
  `);
}

// Data Quality Agent — an inspected table: 4x4 grid, one hatched cell, a
// caliper measuring the flagged row.
function grid(cx, cy, pal) {
  return emblem(cx, cy, `
    <g stroke="${pal.sepia}" stroke-width="1.1">
      <path d="M 13 16 H 41 V 44 H 13 Z"/>
      <line x1="20" y1="16" x2="20" y2="44"/>
      <line x1="13" y1="23" x2="41" y2="23"/>
      <line x1="27" y1="16" x2="27" y2="44"/>
      <line x1="13" y1="30" x2="41" y2="30"/>
      <line x1="34" y1="16" x2="34" y2="44"/>
      <line x1="13" y1="37" x2="41" y2="37"/>
      <line x1="27.5" y1="26.61" x2="30.61" y2="23.5"/>
      <line x1="27.72" y1="29.5" x2="33.5" y2="23.72"/>
      <line x1="30.83" y1="29.5" x2="33.5" y2="26.83"/>
      <line x1="46.5" y1="21" x2="46.5" y2="32"/>
      <line x1="45" y1="24.5" x2="48" y2="21.5"/>
      <line x1="45" y1="31.5" x2="48" y2="28.5"/>
    </g>
    <g stroke="${pal.construction}" stroke-width="1">
      <line x1="16.5" y1="12.2" x2="16.5" y2="14.2"/>
      <line x1="23.5" y1="12.2" x2="23.5" y2="14.2"/>
      <line x1="30.5" y1="12.2" x2="30.5" y2="14.2"/>
      <line x1="37.5" y1="12.2" x2="37.5" y2="14.2"/>
      <line x1="41.8" y1="23" x2="48.5" y2="23"/>
      <line x1="41.8" y1="30" x2="48.5" y2="30"/>
    </g>
  `);
}

// Ask My Paper — a folio with a bracketed passage and an annotation leader
// ending in an asterisk; hatched ground shadow.
function folio(cx, cy, pal) {
  return emblem(cx, cy, `
    <g stroke="${pal.sepia}" stroke-width="1.1">
      <path d="M 17 10.5 H 33 L 39 16.5 V 47.5 H 17 Z"/>
      <line x1="33" y1="10.5" x2="33" y2="16.5"/>
      <line x1="33" y1="16.5" x2="39" y2="16.5"/>
      <line x1="33" y1="14.1" x2="35.4" y2="16.5"/>
      <line x1="33" y1="11.9" x2="37.6" y2="16.5"/>
      <line x1="21" y1="17" x2="33.5" y2="17"/>
      <line x1="21" y1="21" x2="35" y2="21"/>
      <line x1="21" y1="25" x2="35" y2="25"/>
      <line x1="21" y1="29" x2="34.5" y2="29"/>
      <line x1="21" y1="33" x2="35" y2="33"/>
      <line x1="21" y1="37" x2="33" y2="37"/>
      <line x1="21" y1="41" x2="28" y2="41"/>
      <line x1="19" y1="23.2" x2="19" y2="30.8"/>
      <line x1="19" y1="23.2" x2="20.6" y2="23.2"/>
      <line x1="19" y1="30.8" x2="20.6" y2="30.8"/>
      <line x1="18.2" y1="27" x2="13.2" y2="38.2"/>
      <line x1="12.4" y1="39.3" x2="12.4" y2="44.3"/>
      <line x1="10.23" y1="40.55" x2="14.58" y2="43.05"/>
      <line x1="10.23" y1="43.05" x2="14.58" y2="40.55"/>
      <line x1="24" y1="50.1" x2="26.2" y2="48"/>
      <line x1="28" y1="50.1" x2="30.2" y2="48"/>
      <line x1="32" y1="50.1" x2="34.2" y2="48"/>
      <line x1="36" y1="50.1" x2="38.2" y2="48"/>
      <line x1="40" y1="50.1" x2="42.2" y2="48"/>
    </g>
  `);
}

// Tesseract — the 4-cube in cavalier projection: inner cube is the outer
// scaled 0.5 about the marked projection center, rays shown.
function tesseract(cx, cy, pal) {
  return emblem(cx, cy, `
    <g stroke="${pal.construction}" stroke-width="1">
      <line x1="22.125" y1="37.75" x2="30.25" y2="29.5"/>
      <line x1="33.125" y1="37.75" x2="30.25" y2="29.5"/>
      <line x1="33.125" y1="26.75" x2="30.25" y2="29.5"/>
      <line x1="22.125" y1="26.75" x2="30.25" y2="29.5"/>
    </g>
    <g stroke="${pal.sepia}" stroke-width="1.1">
      <path d="M 14 46 L 36 46 L 36 24 L 14 24 Z"/>
      <path d="M 24.5 35 L 46.5 35 L 46.5 13 L 24.5 13 Z"/>
      <line x1="14" y1="46" x2="24.5" y2="35"/>
      <line x1="36" y1="46" x2="46.5" y2="35"/>
      <line x1="36" y1="24" x2="46.5" y2="13"/>
      <line x1="14" y1="24" x2="24.5" y2="13"/>
      <path d="M 22.125 37.75 L 33.125 37.75 L 33.125 26.75 L 22.125 26.75 Z"/>
      <path d="M 27.375 32.25 L 38.375 32.25 L 38.375 21.25 L 27.375 21.25 Z"/>
      <line x1="22.125" y1="37.75" x2="27.375" y2="32.25"/>
      <line x1="33.125" y1="37.75" x2="38.375" y2="32.25"/>
      <line x1="33.125" y1="26.75" x2="38.375" y2="21.25"/>
      <line x1="22.125" y1="26.75" x2="27.375" y2="21.25"/>
      <line x1="14" y1="46" x2="22.125" y2="37.75"/>
      <line x1="36" y1="46" x2="33.125" y2="37.75"/>
      <line x1="36" y1="24" x2="33.125" y2="26.75"/>
      <line x1="14" y1="24" x2="22.125" y2="26.75"/>
      <line x1="24.5" y1="35" x2="27.375" y2="32.25"/>
      <line x1="46.5" y1="35" x2="38.375" y2="32.25"/>
      <line x1="46.5" y1="13" x2="38.375" y2="21.25"/>
      <line x1="24.5" y1="13" x2="27.375" y2="21.25"/>
    </g>
    <g stroke="${pal.sepia}" stroke-width="1">
      <line x1="28.75" y1="26.75" x2="25.36" y2="23.36"/>
      <line x1="32.75" y1="26.75" x2="27.31" y2="21.32"/>
      <line x1="34.9" y1="24.9" x2="31.25" y2="21.25"/>
    </g>
    <circle cx="30.25" cy="29.5" r="1.2" fill="${pal.sepia}" stroke="none"/>
  `);
}

// Ephemeris — an orbital construction, 220x100 at (x, y): planet on broken
// axes, near arc solid and far arc dashed, spacecraft diamond, the true
// anomaly under measurement. The drawn ellipse (80x28) has e = 0.94; the
// constructed radius sits 26 degrees off the major axis — both annotations
// measure the figure itself.
function orbit(x, y, pal) {
  return `<g transform="translate(${x} ${y}) scale(1.12)" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <g stroke="${pal.construction}" stroke-width="1">
      <line x1="20" y1="52" x2="91" y2="52" stroke-dasharray="2.5 3"/>
      <line x1="119" y1="52" x2="190" y2="52" stroke-dasharray="2.5 3"/>
      <line x1="105" y1="19" x2="105" y2="38" stroke-dasharray="2.5 3"/>
      <line x1="105" y1="66" x2="105" y2="81" stroke-dasharray="2.5 3"/>
      <line x1="116.2" y1="57.6" x2="148" y2="73.4"/>
    </g>
    <g stroke="${pal.sepia}" stroke-width="1">
      <line x1="25" y1="49.8" x2="25" y2="54.2"/>
      <line x1="185" y1="49.8" x2="185" y2="54.2"/>
      <line x1="94.3" y1="48" x2="94.9" y2="56"/>
      <line x1="97.2" y1="47" x2="98" y2="61"/>
      <line x1="100.2" y1="50" x2="101" y2="62.5"/>
      <line x1="103.2" y1="54" x2="103.8" y2="63"/>
      <path d="M 127 52 A 22 22 0 0 1 124.7 61.8"/>
    </g>
    <g stroke="${pal.sepia}" stroke-width="1.1">
      <path d="M 29.8 42.4 A 80 28 0 1 0 180.2 42.4"/>
      <path d="M 29.8 42.4 A 80 28 0 0 1 180.2 42.4" stroke-dasharray="4 3.5"/>
      <circle cx="105" cy="52" r="12"/>
      <path d="M 150.9 72.3 L 153.5 74.9 L 150.9 77.5 L 148.3 74.9 Z"/>
    </g>
    <circle cx="105" cy="52" r="1" fill="${pal.sepia}" stroke="none"/>
    <text x="135" y="66" font-family="JetBrains Mono" font-size="8.5" fill="${pal.sepia}" stroke="none">26&#176;</text>
    <text x="49" y="47.5" font-family="JetBrains Mono" font-size="8.5" fill="${pal.sepia}" stroke="none">e = 0.94</text>
  </g>`;
}

// Frame corner construction: one compass mark in the top-left corner — a
// quarter arc centered on the corner, ticks where it meets the frame, the
// diagonal, and the intersection point. The construction is done once, as it
// would be in a notebook; the other corners stay plain.
function cornerMarks(w, h, pal) {
  const m = 20.5;
  const R = 13;
  return `<g fill="none" stroke="${pal.sepia}" stroke-width="1" stroke-linecap="round">
    <path d="M ${m + R} ${m} A ${R} ${R} 0 0 0 ${m} ${m + R}"/>
    <line x1="${m + R}" y1="${m - 2.2}" x2="${m + R}" y2="${m + 2.2}"/>
    <line x1="${m - 2.2}" y1="${m + R}" x2="${m + 2.2}" y2="${m + R}"/>
    <line x1="${m}" y1="${m}" x2="${m + 17.5}" y2="${m + 17.5}" stroke="${pal.construction}"/>
    <circle cx="${m + 9.19}" cy="${m + 9.19}" r="1" fill="${pal.sepia}" stroke="none"/>
  </g>`;
}

const EMBLEMS = { signal, grid, folio, tesseract };

module.exports = { EMBLEMS, orbit, cornerMarks };
