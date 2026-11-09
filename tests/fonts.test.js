const { fontDefs, fontFaceCSS } = require('../src/fonts');

test('fontFaceCSS embeds all four faces as base64 woff2', () => {
  const css = fontFaceCSS();
  expect(css).toMatch(/@font-face/);
  expect(css).toContain("font-family:'IBM Plex Serif'");
  expect(css).toContain("font-family:'JetBrains Mono'");
  expect(css).toContain('font-style:italic');
  expect(css).toContain('font-weight:500');
  expect(css).toContain('data:font/woff2;base64,');
  expect(css).toMatch(/base64,[A-Za-z0-9+/]{100,}/);
  expect(css.match(/@font-face/g).length).toBe(4);
});

test('fontDefs wraps css in an svg style element', () => {
  const defs = fontDefs();
  expect(defs.startsWith('<style')).toBe(true);
  expect(defs).toContain('@font-face');
});
