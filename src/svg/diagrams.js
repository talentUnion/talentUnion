// The page's second ink: hairline figures in the manner of a notebook —
// measured, constructed, sparsely hatched. Everything here draws with
// pal.sepia (the drawing ink) and pal.construction (faint construction
// lines); text ink and rubric red stay reserved for typography.
//
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

module.exports = { aiSystems, cornerMarks };
