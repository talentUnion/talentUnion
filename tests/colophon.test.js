const { renderColophon, PALETTES } = require('../src/svg/colophon');
const { loadConfig } = require('../src/config');

function fixtureWeeks() {
  // 8 weeks spanning a month boundary, deterministic counts
  const weeks = [];
  const start = new Date(Date.UTC(2026, 4, 18)); // Mon 2026-05-18
  for (let w = 0; w < 8; w += 1) {
    const days = [];
    for (let d = 0; d < 7; d += 1) {
      const date = new Date(start.getTime() + (w * 7 + d) * 86400000).toISOString().slice(0, 10);
      days.push({ date, count: w + (d % 2) });
    }
    weeks.push(days);
  }
  return weeks;
}

const cfg = loadConfig();

test('renders both themes with the correct palette', () => {
  const light = renderColophon(cfg, fixtureWeeks(), { theme: 'light', embedFonts: false });
  const dark = renderColophon(cfg, fixtureWeeks(), { theme: 'dark', embedFonts: false });
  expect(light).toContain(PALETTES.light.paper);
  expect(light).toContain(PALETTES.light.rubric);
  expect(dark).toContain(PALETTES.dark.paper);
  expect(dark).toContain(PALETTES.dark.rubric);
  expect(light).not.toContain(PALETTES.dark.paper);
  expect(() => renderColophon(cfg, [], { theme: 'sepia' })).toThrow(/Unknown theme/);
});

test('title page sets the name in caps with a plain-figure imprint', () => {
  const svg = renderColophon(cfg, fixtureWeeks(), { embedFonts: false });
  expect(svg).toContain(cfg.name.toUpperCase());
  expect(svg).toContain(`${cfg.githubLogin.toUpperCase()} &#183; 2026`);
  expect(svg).not.toContain('MMXXVI');
});

test('the now section presents the current work with its figure', () => {
  const svg = renderColophon(cfg, fixtureWeeks(), { embedFonts: false });
  expect(svg).toContain('CURRENTLY');
  expect(svg).toContain(`>${cfg.now.name}<`);
  expect(svg).toContain('in progress');
  cfg.now.lines.forEach((l) => expect(svg).toContain(l.replace(/'/g, '&apos;').replace(/—/g, '—')));
});

test('every project carries its marginal emblem and the page its marks', () => {
  const svg = renderColophon(cfg, fixtureWeeks(), { embedFonts: false });
  // four emblems + orbit figure draw in the sepia ink
  const sepia = (svg.match(/stroke="#8A6A48"/g) || []).length;
  expect(sepia).toBeGreaterThanOrEqual(5);
  expect(svg).toContain('f. 1 r');
});

test('contents lists every project with numeral, leader, detail, and description', () => {
  const svg = renderColophon(cfg, fixtureWeeks(), { embedFonts: false });
  cfg.projects.forEach((p) => {
    expect(svg).toContain(`>${p.name}<`);
    expect(svg).toContain(`${p.language} &#183;`.replace('&#183;', '·'));
    expect(svg).toContain(p.description);
  });
  ['>I<', '>II<', '>III<', '>IV<'].forEach((n) => expect(svg).toContain(n));
  const leaders = svg.match(/stroke-dasharray="0.1 6"/g) || [];
  expect(leaders).toHaveLength(cfg.projects.length);
});

test('activity trace has fully drawn base state and animates in', () => {
  const svg = renderColophon(cfg, fixtureWeeks(), { embedFonts: false });
  expect(svg).toContain('stroke-dashoffset="0"');
  expect(svg).toMatch(/<animate attributeName="stroke-dashoffset" values="\d+;0"/);
  const points = svg.match(/points="([^"]+)"/)[1].trim().split(' ');
  expect(points).toHaveLength(8);
});

test('activity annotations show total, max, and current week', () => {
  const weeks = fixtureWeeks();
  const svg = renderColophon(cfg, weeks, { embedFonts: false });
  // per fixture: week w sums to 7w+3; total = sum = 7*28+24 = 220; max/current = week 7 = 52
  expect(svg).toContain('220 TOTAL');
  expect(svg).toContain('Weekly contributions, May 2026 to July 2026.');
  // current week is the max, so the gray max label is suppressed
  expect(svg).not.toMatch(/text-anchor="middle">52</);
});

test('thousands separator appears in large totals', () => {
  const weeks = fixtureWeeks().map((days) => days.map((d) => ({ ...d, count: d.count + 20 })));
  const svg = renderColophon(cfg, weeks, { embedFonts: false });
  expect(svg).toMatch(/1,\d{3} TOTAL/);
});

test('empty data renders a quiet fallback instead of a trace', () => {
  const svg = renderColophon(cfg, [], { embedFonts: false });
  expect(svg).toContain('No activity data yet.');
  expect(svg).not.toContain('<polyline');
  expect(svg).toContain('<svg');
});

test('colophon note renders without an optional address row', () => {
  const withoutAddresses = { ...cfg, colophon: { note: 'Exploring AI and building software.' } };
  const svg = renderColophon(withoutAddresses, [], { embedFonts: false });
  expect(svg).toContain('Exploring AI and building software.');
  expect(svg).not.toContain('github.com/');
});

test('escapes XML-unsafe config text', () => {
  const unsafe = JSON.parse(JSON.stringify(cfg));
  unsafe.projects[0].name = 'R&D <tool>';
  unsafe.projects[0].description = 'Uses "quotes" & <tags>.';
  const svg = renderColophon(unsafe, [], { embedFonts: false });
  expect(svg).toContain('R&amp;D &lt;tool&gt;');
  expect(svg).toContain('Uses &quot;quotes&quot; &amp; &lt;tags&gt;.');
  expect(svg).not.toContain('<tool>');
});

test('embeds fonts by default', () => {
  const svg = renderColophon(cfg, [], {});
  expect(svg).toContain('@font-face');
  expect(svg).toContain('IBM Plex Serif');
});

test('slices tile the page exactly and window it through viewBox', () => {
  const { buildPage, renderCodexSlices } = require('../src/svg/colophon');
  const { height, bands } = buildPage(cfg, fixtureWeeks(), { embedFonts: false });
  let prev = 0;
  for (const b of bands) {
    expect(b.y0).toBe(prev);
    expect(b.y1).toBeGreaterThan(b.y0);
    prev = b.y1;
  }
  expect(prev).toBe(height);

  const slices = renderCodexSlices(cfg, fixtureWeeks(), { embedFonts: false });
  expect(slices).toHaveLength(cfg.projects.length + 5);
  for (const s of slices) {
    expect(s.svg).toMatch(/viewBox="0 \d+ 880 \d+"/);
  }
});

test('slice links map sections to their destinations', () => {
  const { renderCodexSlices } = require('../src/svg/colophon');
  const byKey = Object.fromEntries(renderCodexSlices(cfg, [], { embedFonts: false }).map((s) => [s.key, s.url]));
  expect(byKey.head).toBe((cfg.links && cfg.links[0].url) || `https://github.com/${cfg.githubLogin}`);
  expect(byKey.now).toBe(cfg.now.url);
  cfg.projects.forEach((p, i) => expect(byKey[`work-${i + 1}`]).toBe(p.url));
  expect(byKey.activity).toBe(`https://github.com/${cfg.githubLogin}`);
  expect(byKey.contents).toBeNull();
  expect(byKey.foot).toBeNull();
});
