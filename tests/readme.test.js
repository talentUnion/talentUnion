const fs = require('fs');
const path = require('path');
const { loadConfig } = require('../src/config');
const { renderCodexSlices } = require('../src/svg/colophon');

const readme = fs.readFileSync(path.join(__dirname, '..', 'README.md'), 'utf8');
const cfg = loadConfig();
const slices = renderCodexSlices(cfg, [], { embedFonts: false });

test('README stacks every slice in both themes with the float trick', () => {
  for (const s of slices) {
    expect(readme).toContain(`srcset="assets/codex-${s.key}-dark.svg"`);
    expect(readme).toContain(`src="assets/codex-${s.key}-light.svg"`);
  }
  const floats = readme.match(/align="left" width="100%"/g) || [];
  expect(floats).toHaveLength(slices.length);
  expect(readme).toContain('media="(prefers-color-scheme: dark)"');
});

test('every linkable slice is wrapped in its link', () => {
  for (const s of slices.filter((x) => x.url)) {
    expect(readme).toContain(`<a href="${s.url}"><picture><source media="(prefers-color-scheme: dark)" srcset="assets/codex-${s.key}-dark.svg">`);
  }
  expect(readme).toContain(`href="${cfg.now.url}"`);
  expect(readme).not.toContain('jubranalawdi76');
});

test('README carries no leftovers from previous layouts', () => {
  ['hero.svg', 'transmission-record', 'btn-github', 'SIGNAL OUTBOUND', '<sub>'].forEach((s) => {
    expect(readme).not.toContain(s);
  });
});
