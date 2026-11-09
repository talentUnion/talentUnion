const { aggregateWeeks, rangeCaption } = require('../src/data/weekly');

const week = (startIso, counts) => counts.map((count, i) => {
  const d = new Date(new Date(`${startIso}T00:00:00Z`).getTime() + i * 86400000);
  return { date: d.toISOString().slice(0, 10), count };
});

test('sums daily counts into weekly totals', () => {
  const weeks = [
    week('2026-06-29', [1, 0, 2, 0, 0, 3, 1]),
    week('2026-07-06', [0, 0, 0, 0, 0, 0, 0]),
    week('2026-07-13', [5, 5]),
  ];
  const s = aggregateWeeks(weeks);
  expect(s.totals).toEqual([7, 0, 10]);
  expect(s.total).toBe(17);
  expect(s.max).toBe(10);
  expect(s.maxIndex).toBe(2);
});

test('detects month boundaries from week start dates', () => {
  const weeks = [
    week('2026-06-22', [1]),
    week('2026-06-29', [1]),
    week('2026-07-06', [1]),
    week('2026-07-13', [1]),
    week('2026-08-03', [1]),
  ];
  const s = aggregateWeeks(weeks);
  expect(s.monthBoundaries).toEqual([
    { index: 2, label: 'JUL' },
    { index: 4, label: 'AUG' },
  ]);
});

test('caption spans first and last day across years', () => {
  const s = aggregateWeeks([week('2025-07-14', [1, 1]), week('2026-07-06', [2])]);
  expect(rangeCaption(s.firstDay, s.lastDay)).toBe('Weekly contributions, July 2025 to July 2026.');
});

test('handles empty input', () => {
  const s = aggregateWeeks([]);
  expect(s.totals).toEqual([]);
  expect(s.total).toBe(0);
  expect(s.max).toBe(0);
  expect(s.firstDay).toBeNull();
  expect(rangeCaption(s.firstDay, s.lastDay)).toBe('');
});
