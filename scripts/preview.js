// Dev-only: rasterizes the generated plates to docs/preview/*.png so the
// design can be checked without pushing. resvg cannot read the woff2 data
// URIs embedded in the SVGs (browsers can), so this script converts the repo
// fonts to TTF via python fontTools when available and registers them; with
// no python3/fontTools it falls back to system fonts, which is still useful
// for layout checks.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { Resvg } = require('@resvg/resvg-js');

const ROOT = path.join(__dirname, '..');
const ASSETS = path.join(ROOT, 'assets');
const OUT = path.join(ROOT, 'docs', 'preview');

function ttfDir() {
  const dir = path.join(os.tmpdir(), 'colophon-preview-fonts');
  fs.mkdirSync(dir, { recursive: true });
  const woffs = fs.readdirSync(path.join(ASSETS, 'fonts')).filter((f) => f.endsWith('.woff2'));
  const missing = woffs.filter((f) => !fs.existsSync(path.join(dir, f.replace('.woff2', '.ttf'))));
  if (missing.length === 0) return dir;
  try {
    const script = 'import sys\nfrom fontTools.ttLib import TTFont\n'
      + 'src, dst = sys.argv[1], sys.argv[2]\n'
      + 'f = TTFont(src); f.flavor = None; f.save(dst)\n';
    for (const f of missing) {
      execFileSync('python3', ['-c', script, path.join(ASSETS, 'fonts', f), path.join(dir, f.replace('.woff2', '.ttf'))]);
    }
    return dir;
  } catch (e) {
    console.warn(`Font conversion unavailable (${e.message}); previews will use system fonts.`);
    return null;
  }
}

function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const fontsDir = ttfDir();
  const font = fontsDir
    ? { fontDirs: [fontsDir], loadSystemFonts: false, defaultFontFamily: 'IBM Plex Serif' }
    : { loadSystemFonts: true };

  for (const f of fs.readdirSync(ASSETS).filter((x) => x.endsWith('.svg'))) {
    const svg = fs.readFileSync(path.join(ASSETS, f), 'utf8');
    const png = new Resvg(svg, { font, fitTo: { mode: 'width', value: 880 } }).render().asPng();
    const out = path.join(OUT, f.replace('.svg', '.png'));
    fs.writeFileSync(out, png);
    console.log('wrote', path.relative(ROOT, out));
  }
}

main();
