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

function removeProjectEmblems(svg) {
  const openingTag = /<g\b[^>]*\btransform="translate\(41 [^"]*"[^>]*>/;
  let result = svg;
  let match = openingTag.exec(result);
  while (match) {
    let depth = 1;
    const tags = /<\/?g\b[^>]*>/g;
    tags.lastIndex = match.index + match[0].length;
    let tag;
    let end = -1;
    while ((tag = tags.exec(result))) {
      if (tag[0].startsWith('</')) {
        depth -= 1;
        if (depth === 0) {
          end = tags.lastIndex;
          break;
        }
      } else if (!tag[0].endsWith('/>')) {
        depth += 1;
      }
    }
    if (end < 0) throw new Error('Unclosed project emblem group in cached SVG');
    result = result.slice(0, match.index) + result.slice(end);
    match = openingTag.exec(result);
  }
  return result;
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
        const cached = expected.map((file) => [
          file,
          fs.readFileSync(path.join(outDir, file), 'utf8'),
        ]);
        const staleEmblems = cached.some(([, svg]) => /transform="translate\(41 /.test(svg));
        if (staleEmblems) {
          for (const [file, svg] of cached) {
            const currentSvg = removeProjectEmblems(svg);
            if (currentSvg !== svg) write(outDir, file, currentSvg);
          }
          console.warn(`Contribution fetch failed (${e.message}); removed stale project emblems and kept cached activity`);
          return;
        }
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
