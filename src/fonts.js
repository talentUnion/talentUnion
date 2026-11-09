const fs = require('fs');
const path = require('path');

const FONTS = [
  { family: 'IBM Plex Serif', weight: 400, style: 'normal', file: 'ibm-plex-serif-400.woff2' },
  { family: 'IBM Plex Serif', weight: 400, style: 'italic', file: 'ibm-plex-serif-400-italic.woff2' },
  { family: 'IBM Plex Serif', weight: 500, style: 'normal', file: 'ibm-plex-serif-500.woff2' },
  { family: 'JetBrains Mono', weight: 400, style: 'normal', file: 'jetbrains-mono-400.woff2' },
];

function fontFaceCSS(fontsDir = path.join(__dirname, '..', 'assets', 'fonts')) {
  return FONTS.map((f) => {
    const fp = path.join(fontsDir, f.file);
    let b64;
    try {
      b64 = fs.readFileSync(fp).toString('base64');
    } catch (e) {
      throw new Error(`Failed to read font file for ${f.family} (${f.style} ${f.weight}): ${fp} — ${e.message}`);
    }
    return `@font-face{font-family:'${f.family}';font-style:${f.style};font-weight:${f.weight};`
      + `src:url(data:font/woff2;base64,${b64}) format('woff2');}`;
  }).join('');
}

function fontDefs(fontsDir) {
  return `<style type="text/css">${fontFaceCSS(fontsDir)}</style>`;
}

module.exports = { FONTS, fontFaceCSS, fontDefs };
