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

function isoBox(cx, top, width, depth) {
  const half = width / 2;
  const quarter = width / 4;
  const mid = top + quarter;
  const bottom = top + half;
  return `<path d="M ${cx} ${top} L ${cx + half} ${mid} L ${cx} ${bottom} L ${cx - half} ${mid} Z"/>
    <path d="M ${cx - half} ${mid} V ${mid + depth} L ${cx} ${bottom + depth} V ${bottom} Z"/>
    <path d="M ${cx + half} ${mid} V ${mid + depth} L ${cx} ${bottom + depth} V ${bottom} Z"/>`;
}

// Workflow engine — a trigger cube routes through an agent to tool cubes.
function workflow(cx, cy, pal) {
  return emblem(cx, cy, `
    <g stroke="${pal.construction}" stroke-width="1">
      <path d="M 18 30 L 21 29 M 38 21 L 42 17 M 38 31 L 42 44"/>
    </g>
    <g stroke="${pal.sepia}" stroke-width="1.1">
      ${isoBox(14, 25, 10, 6)}
      ${isoBox(30, 16, 18, 10)}
      ${isoBox(46, 11, 9, 5)}
      ${isoBox(46, 42.5, 9, 5)}
      <path d="M 27 21 L 30 18 L 33 21 L 30 24 Z"/>
      <line x1="30" y1="24" x2="30" y2="28"/>
      <circle cx="30" cy="29" r="1.3" fill="${pal.sepia}"/>
    </g>
  `);
}

// SaaS platform — a tiled application dashboard on a raised platform.
function platform(cx, cy, pal) {
  return emblem(cx, cy, `
    <g stroke="${pal.sepia}" stroke-width="1.1">
      ${isoBox(30, 12, 38, 10)}
      <path d="M 30 12 L 46 20 L 30 28 L 14 20 Z"/>
      <path d="M 30 12 L 38 16 L 30 20 L 22 16 Z"/>
      <path d="M 38 16 L 46 20 L 38 24 L 30 20 Z"/>
      <path d="M 22 16 L 30 20 L 22 24 L 14 20 Z"/>
      <path d="M 30 20 L 38 24 L 30 28 L 22 24 Z"/>
      <path d="M 27 15 L 30 16.5 L 33 15"/>
      <path d="M 35 19 L 38 20.5 L 41 19"/>
      <path d="M 19 19 L 22 20.5 L 25 19"/>
      <path d="M 27 23 L 30 24.5 L 33 23"/>
      <line x1="20" y1="31" x2="27" y2="34.5"/>
      <line x1="33" y1="34.5" x2="40" y2="31"/>
    </g>
  `);
}

// Paper Assistant — a document stack routes a selected passage to an answer.
function paperAssistant(cx, cy, pal) {
  return emblem(cx, cy, `
    <g stroke="${pal.sepia}" stroke-width="1.1">
      ${isoBox(24, 12, 28, 17)}
      <path d="M 24 12 L 38 19 L 24 26 L 10 19 Z"/>
      <path d="M 24 12 V 26"/>
      <path d="M 13 19 L 22 23.5 M 16 17.5 L 22 20.5"/>
      <path d="M 35 20.5 L 29 23.5 M 35 17.5 L 29 20.5"/>
      <path d="M 16 31 L 23 34.5 M 16 35 L 23 38.5"/>
      <path d="M 35 29 L 42 32.5 V 40 L 35 36.5 Z"/>
      <path d="M 37 32 L 40 33.5 M 37 35 L 40 36.5"/>
      <path d="M 38 43 L 42 45 L 46 43"/>
      <path d="M 40 27 H 45 L 49 29 V 35"/>
      <path d="M 49 35 L 46 32 M 49 35 L 45 36"/>
    </g>
  `);
}

// AI automation — a processing cube inside a square, repeating route.
function automation(cx, cy, pal) {
  return emblem(cx, cy, `
    <g stroke="${pal.construction}" stroke-width="1">
      <path d="M 15 12 H 42 L 50 20 V 28 M 45 48 H 18 L 10 40 V 32"/>
    </g>
    <g stroke="${pal.sepia}" stroke-width="1.1">
      <path d="M 50 28 L 46 24 M 50 28 L 45 29"/>
      <path d="M 10 32 L 14 36 M 10 32 L 15 31"/>
      ${isoBox(30, 18, 22, 12)}
      <path d="M 27 27 L 30 25 L 33 27 L 30 29 Z"/>
      <line x1="30" y1="29" x2="30" y2="33"/>
      <rect x="28" y="34" width="4" height="2"/>
    </g>
  `);
}

// AI systems — a model core joining incoming signals to branching outputs.
function aiSystems(x, y, pal) {
  return `<g transform="translate(${x} ${y}) scale(1.12)" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <g stroke="${pal.construction}" stroke-width="1">
      <line x1="28" y1="52" x2="192" y2="52" stroke-dasharray="2 4"/>
      <line x1="105" y1="24" x2="105" y2="80" stroke-dasharray="2 4"/>
      <path d="M 75 40 L 83 46 M 75 64 L 83 58"/>
      <path d="M 127 46 L 137 40 M 127 58 L 137 64"/>
    </g>
    <g stroke="${pal.sepia}" stroke-width="1.1">
      <path d="M 38 34 H 56 L 74 46 H 87"/>
      <path d="M 38 70 H 56 L 74 58 H 87"/>
      <rect x="87" y="34" width="36" height="36" rx="8"/>
      <path d="M 123 52 H 145 L 166 36 H 171"/>
      <path d="M 123 52 H 145 L 166 68 H 171"/>
    </g>
    <g stroke="${pal.sepia}" stroke-width="1">
      <line x1="78" y1="44.6" x2="82" y2="46"/>
      <line x1="78" y1="59.4" x2="82" y2="58"/>
      <line x1="164" y1="36.8" x2="167" y2="36"/>
      <line x1="164" y1="67.2" x2="167" y2="68"/>
      <line x1="98" y1="45" x2="105" y2="52"/>
      <line x1="112" y1="45" x2="105" y2="52"/>
      <line x1="98" y1="59" x2="105" y2="52"/>
      <line x1="112" y1="59" x2="105" y2="52"/>
      <circle cx="38" cy="34" r="5"/>
      <circle cx="38" cy="70" r="5"/>
      <circle cx="176" cy="34" r="5"/>
      <circle cx="176" cy="70" r="5"/>
      <circle cx="98" cy="45" r="2"/>
      <circle cx="112" cy="45" r="2"/>
      <circle cx="98" cy="59" r="2"/>
      <circle cx="112" cy="59" r="2"/>
    </g>
    <circle cx="105" cy="52" r="3" fill="${pal.sepia}" stroke="none"/>
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

const EMBLEMS = { workflow, platform, paperAssistant, automation };

module.exports = { EMBLEMS, aiSystems, cornerMarks };
