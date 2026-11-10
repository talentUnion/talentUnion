require('dotenv').config();
const fs = require('fs');
const path = require('path');

const { loadConfig } = require('../src/config');
const { renderColophonAssets } = require('../src/svg/colophon');
const { escapeXml } = require('../src/svg/xml');
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

  const sliceKeys = [
    'head', 'now', 'contents',
    ...cfg.projects.map((_, i) => `work-${i + 1}`),
    'activity', 'foot',
  ];
  const expected = THEMES.flatMap((t) => [FILES[t], ...sliceKeys.map((k) => sliceFile(k, t))]);

  let weeks = [];
  try {
    weeks = await (fetchWeeks || fetchContributionWeeks)(cfg.githubLogin, token);
  } catch (e) {
    const outputsExist = expected.every((f) => fs.existsSync(path.join(outDir, f)));
    if (outputsExist) {
      const currentName = escapeXml(cfg.name.toUpperCase());
      const profileIsCurrent = expected.every((f) => (
        fs.readFileSync(path.join(outDir, f), 'utf8').includes(currentName)
      ));
      if (profileIsCurrent) {
        console.warn(`Contribution fetch failed (${e.message}); keeping existing plates and slices`);
        return;
      }
    }
    console.warn(`Contribution fetch failed (${e.message}); rendering without activity data`);
  }

  for (const theme of THEMES) {
    const { plate, slices } = renderColophonAssets(cfg, weeks, { theme });
    write(outDir, FILES[theme], plate);
    for (const slice of slices) {
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
