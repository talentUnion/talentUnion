const { fontDefs } = require('../fonts');
const { escapeXml } = require('./xml');
const { measureSerif500, measureMono } = require('./metrics');
const { aggregateWeeks, rangeCaption } = require('../data/weekly');
const { EMBLEMS, orbit, cornerMarks } = require('./diagrams');

// One plate, three inks: text ink, a sepia drawing ink for the figures, and
// rubric red reserved for typography. The dark paper is deliberately warmer
// than GitHub's #0d1117 so the page frame reads as a page edge, not a
// themed card.
const PALETTES = {
  light: {
    paper: '#FAF9F6', ink: '#1C1B18', muted: '#6E6A63', desc: '#55514A',
    hairline: '#DCD8CF', leader: '#B9B3A8', tick: '#C9C4BA', faint: '#9B958A',
    rubric: '#96402A', sepia: '#8A6A48', construction: '#CBBFA9',
  },
  dark: {
    paper: '#131210', ink: '#E8E3DA', muted: '#9C968B', desc: '#ACA69B',
    hairline: '#2E2B26', leader: '#555047', tick: '#45413A', faint: '#79736A',
    rubric: '#C67A57', sepia: '#A58466', construction: '#4A443A',
  },
};

const W = 880;
const CX = W / 2;
const TEXT_L = 100;   // left text margin (TOC numerals hang left of it)
const TEXT_R = 780;   // right text margin
const ENTRY_STEP = 74;

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

function serif(x, y, size, fill, content, attrs = '') {
  return `<text x="${x}" y="${y}" font-family="IBM Plex Serif" font-size="${size}" fill="${fill}"${attrs ? ` ${attrs}` : ''}>${content}</text>`;
}

function mono(x, y, size, fill, content, attrs = '') {
  return `<text x="${x}" y="${y}" font-family="JetBrains Mono" font-size="${size}" fill="${fill}"${attrs ? ` ${attrs}` : ''}>${content}</text>`;
}

function polylineLength(pts) {
  let len = 0;
  for (let i = 1; i < pts.length; i += 1) {
    len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  }
  return len;
}

function renderTitlePage(cfg, pal, imprintYear) {
  const t = cfg.titlePage;
  const imprint = `${escapeXml(cfg.githubLogin.toUpperCase())} &#183; ${imprintYear}`;
  return [
    serif(CX, 132, 40, pal.ink, escapeXml(cfg.name.toUpperCase()), 'text-anchor="middle" font-weight="500" letter-spacing="10"'),
    `<line x1="${CX - 28}" y1="162" x2="${CX + 28}" y2="162" stroke="${pal.rubric}" stroke-width="1"/>`,
    serif(CX, 202, 16.5, pal.ink, escapeXml(t.role), 'text-anchor="middle"'),
    serif(CX, 230, 15.5, pal.muted, escapeXml(t.fields), 'text-anchor="middle" font-style="italic"'),
    mono(CX, 272, 11, pal.muted, imprint, 'text-anchor="middle" letter-spacing="3"'),
  ].join('\n  ');
}

const NOW_LABEL_Y = 344;

function renderNow(cfg, pal) {
  const parts = [
    serif(CX, NOW_LABEL_Y, 12.5, pal.muted, 'CURRENTLY', 'text-anchor="middle" font-weight="500" letter-spacing="5"'),
    serif(140, NOW_LABEL_Y + 46, 19, pal.ink, escapeXml(cfg.now.name), 'font-weight="500"'),
    mono(140 + measureSerif500(cfg.now.name, 19) + 14, NOW_LABEL_Y + 45, 12.5, pal.muted, 'in progress'),
  ];
  cfg.now.lines.forEach((line, i) => {
    parts.push(serif(140, NOW_LABEL_Y + 72 + i * 24, 15, pal.desc, escapeXml(line)));
  });
  parts.push(orbit(548, NOW_LABEL_Y + 12, pal));
  return parts.join('\n  ');
}

const CONTENTS_LABEL_Y = 536;
const ENTRIES_START_Y = 580;

function renderContents(cfg, pal) {
  const parts = [
    serif(CX, CONTENTS_LABEL_Y, 12.5, pal.muted, 'CONTENTS', 'text-anchor="middle" font-weight="500" letter-spacing="5"'),
  ];
  cfg.projects.forEach((p, i) => {
    const y = ENTRIES_START_Y + i * ENTRY_STEP;
    const numeral = ROMAN[i] || String(i + 1);
    const detail = `${p.language} · ${p.year}`;
    const nameEnd = 140 + measureSerif500(p.name, 19);
    const leaderStart = Math.round(nameEnd + 12);
    const leaderEnd = Math.round(TEXT_R - measureMono(detail, 12.5) - 14);
    const emblem = EMBLEMS[p.emblem];
    if (emblem) parts.push(emblem(71, y + 6, pal));
    parts.push(serif(122, y, 14, pal.rubric, numeral, 'text-anchor="end" font-weight="500"'));
    parts.push(serif(140, y, 19, pal.ink, escapeXml(p.name), 'font-weight="500"'));
    if (leaderStart + 20 < leaderEnd) {
      parts.push(`<line x1="${leaderStart}" y1="${y - 4}" x2="${leaderEnd}" y2="${y - 4}" stroke="${pal.leader}" stroke-width="1.3" stroke-dasharray="0.1 6" stroke-linecap="round"/>`);
    }
    parts.push(mono(TEXT_R, y - 1, 12.5, pal.muted, escapeXml(detail), 'text-anchor="end"'));
    parts.push(serif(140, y + 26, 15, pal.desc, escapeXml(p.description)));
  });
  return parts.join('\n  ');
}

function renderActivity(series, pal, labelY) {
  const base = labelY + 74;
  const band = 46;
  const parts = [
    serif(CX, labelY, 12.5, pal.muted, 'ACTIVITY', 'text-anchor="middle" font-weight="500" letter-spacing="5"'),
  ];

  const n = series.totals.length;
  if (n < 2) {
    parts.push(serif(CX, labelY + 46, 13.5, pal.muted, 'No activity data yet.', 'text-anchor="middle" font-style="italic"'));
    return { svg: parts.join('\n  '), bottomY: labelY + 46 };
  }

  const dx = (TEXT_R - TEXT_L) / (n - 1);
  const yOf = (v) => (series.max > 0 ? base - (v / series.max) * band : base);
  const pts = series.totals.map((v, i) => [TEXT_L + i * dx, yOf(v)]);
  const ptsAttr = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const dash = Math.ceil(polylineLength(pts)) + 2;

  // Base attributes are the fully drawn state so cached camo copies and
  // renderers without SMIL show the finished line.
  parts.push(
    `<polyline fill="none" stroke="${pal.ink}" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round" `
    + `stroke-dasharray="${dash} ${dash}" stroke-dashoffset="0" points="${ptsAttr}">`
    + `<animate attributeName="stroke-dashoffset" values="${dash};0" keyTimes="0;1" dur="1.6s" begin="0s" fill="freeze" calcMode="spline" keySplines="0.3 0 0.2 1"/>`
    + '</polyline>',
  );

  const lastIdx = n - 1;
  const [endX, endY] = pts[lastIdx];
  if (series.maxIndex !== lastIdx && series.max > 0) {
    const mx = Math.min(Math.max(pts[series.maxIndex][0], TEXT_L + 12), TEXT_R - 24);
    parts.push(mono(mx, yOf(series.max) - 8, 9.5, pal.faint, String(series.max), 'text-anchor="middle"'));
  }
  const appear = '<animate attributeName="opacity" values="0;0;1" keyTimes="0;0.8;1" dur="1.9s" begin="0s" fill="freeze"/>';
  parts.push(`<circle cx="${endX.toFixed(1)}" cy="${endY.toFixed(1)}" r="2.4" fill="${pal.rubric}">${appear}</circle>`);
  parts.push(`<text x="${(endX + 12).toFixed(1)}" y="${(endY + 4).toFixed(1)}" font-family="JetBrains Mono" font-size="10" fill="${pal.rubric}">${series.totals[lastIdx]}${appear}</text>`);

  const ticks = series.monthBoundaries.map(({ index }) => {
    const x = (TEXT_L + (index - 0.5) * dx).toFixed(1);
    return `<line x1="${x}" y1="${base + 10}" x2="${x}" y2="${base + 15}"/>`;
  });
  parts.push(`<g stroke="${pal.tick}" stroke-width="1">${ticks.join('')}</g>`);
  const labels = series.monthBoundaries
    .filter((_, i) => i % 2 === 0)
    .map(({ index, label }) => `<text x="${(TEXT_L + (index - 0.5) * dx).toFixed(1)}" y="${base + 30}">${label}</text>`);
  parts.push(`<g font-family="JetBrains Mono" font-size="9.5" fill="${pal.faint}" text-anchor="middle">${labels.join('')}</g>`);

  parts.push(serif(TEXT_L, base + 62, 13.5, pal.muted, escapeXml(rangeCaption(series.firstDay, series.lastDay)), 'font-style="italic"'));
  parts.push(mono(TEXT_R, base + 62, 11, pal.muted, `${series.total.toLocaleString('en-US')} TOTAL`, 'text-anchor="end" letter-spacing="1"'));

  return { svg: parts.join('\n  '), bottomY: base + 62 };
}

function renderColophonFoot(cfg, pal, topY) {
  const noteY = topY + 50;
  const addressesY = noteY + 40;
  const addresses = cfg.colophon.addresses || [];
  const parts = [
    `<line x1="${CX - 20}" y1="${topY}" x2="${CX + 20}" y2="${topY}" stroke="${pal.hairline}" stroke-width="1"/>`,
    serif(CX, noteY, 13.5, pal.muted, escapeXml(cfg.colophon.note), 'text-anchor="middle" font-style="italic"'),
  ];
  if (addresses.length > 0) {
    parts.push(mono(CX, addressesY, 11.5, pal.desc, addresses.map(escapeXml).join(' &#160;&#183;&#160; '), 'text-anchor="middle" letter-spacing="0.5"'));
  }
  return {
    svg: parts.join('\n  '),
    bottomY: addresses.length > 0 ? addressesY : noteY,
  };
}

function buildPage(cfg, weeks, opts = {}) {
  const { theme = 'light', embedFonts = true, fontsDir } = opts;
  const pal = PALETTES[theme];
  if (!pal) throw new Error(`Unknown theme: ${theme}`);

  const series = aggregateWeeks(weeks || []);
  const imprintYear = series.lastDay ? series.lastDay.y : new Date().getFullYear();

  const entriesBottom = ENTRIES_START_Y + (cfg.projects.length - 1) * ENTRY_STEP + 26;
  const activityLabelY = entriesBottom + 70;
  const activity = renderActivity(series, pal, activityLabelY);
  const foot = renderColophonFoot(cfg, pal, activity.bottomY + 54);
  const height = foot.bottomY + 94;

  const defs = embedFonts ? `<defs>${fontDefs(fontsDir)}</defs>` : '';
  const inner = `${defs}
  <rect width="${W}" height="${height}" fill="${pal.paper}"/>
  <rect x="20.5" y="20.5" width="${W - 41}" height="${height - 41}" fill="none" stroke="${pal.hairline}" stroke-width="1"/>
  ${cornerMarks(W, height, pal)}
  ${renderTitlePage(cfg, pal, imprintYear)}
  ${renderNow(cfg, pal)}
  ${renderContents(cfg, pal)}
  ${activity.svg}
  ${foot.svg}
  ${mono(TEXT_R, height - 38, 9.5, pal.faint, 'f. 1 r', 'text-anchor="end"')}`;

  // Horizontal cut lines between sections, each placed in quiet whitespace so
  // the page can also be served as stacked slices (README regions can only
  // link as whole images). Bands must tile [0, height] exactly.
  const entriesTop = ENTRIES_START_Y - 32;
  const bands = [
    { key: 'head', y0: 0, y1: NOW_LABEL_Y - 24, link: 'site' },
    { key: 'now', y0: NOW_LABEL_Y - 24, y1: CONTENTS_LABEL_Y - 24, link: 'now' },
    { key: 'contents', y0: CONTENTS_LABEL_Y - 24, y1: entriesTop, link: null },
    ...cfg.projects.map((p, i) => ({
      key: `work-${i + 1}`,
      y0: entriesTop + i * ENTRY_STEP,
      y1: entriesTop + (i + 1) * ENTRY_STEP,
      link: 'project',
      project: p,
    })),
    { key: 'activity', y0: entriesTop + cfg.projects.length * ENTRY_STEP, y1: activity.bottomY + 24, link: 'github' },
    { key: 'foot', y0: activity.bottomY + 24, y1: height, link: null },
  ];

  return { inner, height, bands };
}

/**
 * Renders the whole profile page as a single plate.
 *
 * @param {object} cfg     validated profile config
 * @param {Array}  weeks   contribution calendar (weeks of {date, count} days)
 * @param {object} opts    { theme: 'light'|'dark', embedFonts, fontsDir }
 */
function renderColophon(cfg, weeks, opts = {}) {
  return renderColophonPage(buildPage(cfg, weeks, opts));
}

function renderColophonPage({ inner, height }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${height}" viewBox="0 0 ${W} ${height}" role="img">
  ${inner}
</svg>`;
}

/**
 * Renders the page as an ordered list of slices — the same page content
 * windowed through per-section viewBoxes, so the slices stack pixel-identical
 * to the plate while each can be wrapped in its own link in the README.
 *
 * Returns [{ key, svg, url, project? }]; url is null for unlinked slices.
 */
function renderCodexSlices(cfg, weeks, opts = {}) {
  return renderCodexSlicesPage(cfg, buildPage(cfg, weeks, opts));
}

function renderCodexSlicesPage(cfg, { inner, bands }) {
  const urlFor = (band) => {
    if (band.link === 'site') return (cfg.links && cfg.links[0] && cfg.links[0].url) || `https://github.com/${cfg.githubLogin}`;
    if (band.link === 'now') return cfg.now.url || null;
    if (band.link === 'project') return band.project.url;
    if (band.link === 'github') return `https://github.com/${cfg.githubLogin}`;
    return null;
  };
  return bands.map((band) => ({
    key: band.key,
    url: urlFor(band),
    project: band.project,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${band.y1 - band.y0}" viewBox="0 ${band.y0} ${W} ${band.y1 - band.y0}" role="img">
  ${inner}
</svg>`,
  }));
}

function renderColophonAssets(cfg, weeks, opts = {}) {
  const page = buildPage(cfg, weeks, opts);
  return {
    plate: renderColophonPage(page),
    slices: renderCodexSlicesPage(cfg, page),
  };
}

module.exports = { renderColophon, renderCodexSlices, renderColophonAssets, buildPage, PALETTES };
