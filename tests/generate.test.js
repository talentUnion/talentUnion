const fs = require('fs');
const os = require('os');
const path = require('path');
const { generate, FILES, sliceFile, THEMES } = require('../scripts/generate');
const { renderCodexSlices } = require('../src/svg/colophon');
const { loadConfig } = require('../src/config');

const okWeeks = [
  [{ date: '2026-06-29', count: 3 }, { date: '2026-06-30', count: 1 }],
  [{ date: '2026-07-06', count: 2 }],
];

function expectedFiles(cfg) {
  const keys = renderCodexSlices(cfg, [], { embedFonts: false }).map((s) => s.key);
  return THEMES.flatMap((t) => [FILES[t], ...keys.map((k) => sliceFile(k, t))]);
}

test('generate writes plates and all slices when the fetch succeeds', async () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'assets-'));
  const cfg = loadConfig();
  await generate({ cfg, outDir: out, token: 't', fetchWeeks: async () => okWeeks });
  for (const f of expectedFiles(cfg)) {
    expect(fs.existsSync(path.join(out, f))).toBe(true);
  }
  const plate = fs.readFileSync(path.join(out, FILES.light), 'utf8');
  expect(plate).toContain(cfg.name.toUpperCase());
  expect(plate).toContain('6 TOTAL');
  const activitySlice = fs.readFileSync(path.join(out, sliceFile('activity', 'light')), 'utf8');
  expect(activitySlice).toContain('6 TOTAL');
  expect(activitySlice).toMatch(/viewBox="0 \d+ 880 \d+"/);
});

test('generate keeps existing outputs when the fetch fails', async () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'assets-'));
  const cfg = loadConfig();
  for (const f of expectedFiles(cfg)) fs.writeFileSync(path.join(out, f), `<svg>OLD-${f}</svg>`);
  await generate({ cfg, outDir: out, token: 't', fetchWeeks: async () => { throw new Error('down'); } });
  for (const f of expectedFiles(cfg)) {
    expect(fs.readFileSync(path.join(out, f), 'utf8')).toBe(`<svg>OLD-${f}</svg>`);
  }
});

test('generate renders the offline fallback when outputs are missing', async () => {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'assets-'));
  const cfg = loadConfig();
  // plates exist but slices do not — must regenerate rather than return early
  fs.writeFileSync(path.join(out, FILES.light), '<svg>OLD</svg>');
  fs.writeFileSync(path.join(out, FILES.dark), '<svg>OLD</svg>');
  await generate({ cfg, outDir: out, token: 't', fetchWeeks: async () => { throw new Error('down'); } });
  const svg = fs.readFileSync(path.join(out, FILES.light), 'utf8');
  expect(svg).toContain('No activity data yet.');
  expect(fs.existsSync(path.join(out, sliceFile('head', 'dark')))).toBe(true);
});
