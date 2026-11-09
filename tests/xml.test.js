const { escapeXml } = require('../src/svg/xml');

test('escapes the five XML-unsafe characters', () => {
  expect(escapeXml(`<a href="x">R&D's</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;R&amp;D&apos;s&lt;/a&gt;');
});

test('passes safe text through and coerces non-strings', () => {
  expect(escapeXml('Machine learning · autonomy')).toBe('Machine learning · autonomy');
  expect(escapeXml(2026)).toBe('2026');
});
