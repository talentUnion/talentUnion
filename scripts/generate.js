require('dotenv').config();
const fs = require('fs');
const path = require('path');

const { loadConfig } = require('../src/config');
const { renderColophon, renderCodexSlices } = require('../src/svg/colophon');
const { fetchContributionWeeks } = require('../src/data/contributions');

const THEMES = ['light', 'dark'];
const FILES = { light: 'colophon-light.svg', dark: 'colophon-dark.svg' };

function sliceFile(key, theme) {
  return `codex-${key}-${theme}.svg`;
}

function write(outDir, file, svg) {
  fs.writeFileSync(path.join(outDir, file), svg, 'utf8');
}

async function generate({ cfg, outDir, token, fetchWeeks }) {
  fs.mkdirSync(outDir, { recursive: true });

  const sliceKeys = renderCodexSlices(cfg, [], { embedFonts: false }).map((s) => s.key);
  const expected = THEMES.flatMap((t) => [FILES[t], ...sliceKeys.map((k) => sliceFile(k, t))]);

  let weeks = [];
  try {
    weeks = await (fetchWeeks || fetchContributionWeeks)(cfg.githubLogin, token);
  } catch (e) {
    if (expected.every((f) => fs.existsSync(path.join(outDir, f)))) {
      console.warn(`Contribution fetch failed (${e.message}); keeping existing plates and slices`);
      return;
    }
    console.warn(`Contribution fetch failed (${e.message}); rendering without activity data`);
  }

  for (const theme of THEMES) {
    write(outDir, FILES[theme], renderColophon(cfg, weeks, { theme }));
    for (const slice of renderCodexSlices(cfg, weeks, { theme })) {
      write(outDir, sliceFile(slice.key, theme), slice.svg);
    }
  }
}

async function main() {
  const cfg = loadConfig();
  const outDir = path.join(__dirname, '..', 'assets');
  await generate({ cfg, outDir, token: process.env.GITHUB_TOKEN });
  console.log('Generated README plates and slices in assets/');
}

module.exports = { generate, main, FILES, sliceFile, THEMES };

if (require.main === module) {
  main().catch((err) => { console.error(err); process.exit(1); });
}
