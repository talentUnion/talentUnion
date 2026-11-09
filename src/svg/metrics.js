// Advance widths (em) for IBM Plex Serif Medium (500), extracted from
// assets/fonts/ibm-plex-serif-500.woff2 with fontTools. Used to place the
// leader dots exactly where a project name ends. Kerning is ignored; at the
// sizes involved the error is under a pixel.
const PLEX_SERIF_500 = {
  ' ': 0.232, '!': 0.292, '"': 0.444, '#': 0.671, '$': 0.593, '%': 0.919,
  '&': 0.726, "'": 0.249, '(': 0.336, ')': 0.336, '*': 0.506, '+': 0.6,
  ',': 0.272, '-': 0.396, '.': 0.272, '/': 0.392,
  0: 0.6, 1: 0.6, 2: 0.6, 3: 0.6, 4: 0.6, 5: 0.6, 6: 0.6, 7: 0.6, 8: 0.6, 9: 0.6,
  ':': 0.292, ';': 0.293, '<': 0.6, '=': 0.6, '>': 0.6, '?': 0.501, '@': 0.914,
  A: 0.692, B: 0.685, C: 0.656, D: 0.728, E: 0.649, F: 0.632, G: 0.744,
  H: 0.799, I: 0.363, J: 0.481, K: 0.735, L: 0.606, M: 0.882, N: 0.784,
  O: 0.736, P: 0.65, Q: 0.736, R: 0.699, S: 0.605, T: 0.677, U: 0.75,
  V: 0.677, W: 0.993, X: 0.694, Y: 0.655, Z: 0.644,
  '[': 0.309, '\\': 0.392, ']': 0.309, '^': 0.6, _: 0.563, '`': 0.6,
  a: 0.553, b: 0.609, c: 0.524, d: 0.619, e: 0.547, f: 0.36, g: 0.56,
  h: 0.635, i: 0.323, j: 0.311, k: 0.597, l: 0.31, m: 0.958, n: 0.648,
  o: 0.572, p: 0.622, q: 0.61, r: 0.464, s: 0.497, t: 0.361, u: 0.631,
  v: 0.549, w: 0.817, x: 0.574, y: 0.55, z: 0.511,
  '{': 0.349, '|': 0.332, '}': 0.349, '~': 0.6,
  '·': 0.334, '—': 0.785, '–': 0.589, '’': 0.272,
};

const FALLBACK_EM = 0.6;

function measureSerif500(text, fontSize) {
  let em = 0;
  for (const ch of String(text)) em += PLEX_SERIF_500[ch] ?? FALLBACK_EM;
  return em * fontSize;
}

// JetBrains Mono is monospaced at exactly 0.6 em per character.
function measureMono(text, fontSize, letterSpacing = 0) {
  const n = [...String(text)].length;
  return n * 0.6 * fontSize + Math.max(0, n - 1) * letterSpacing;
}

module.exports = { measureSerif500, measureMono, PLEX_SERIF_500 };
