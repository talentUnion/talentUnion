const { normalizeCalendar } = require('../src/data/contributions');

test('normalizeCalendar flattens weeks into {date,count} days', () => {
  const gql = {
    user: { contributionsCollection: { contributionCalendar: { weeks: [
      { contributionDays: [{ date: '2026-01-01', contributionCount: 0 }, { date: '2026-01-02', contributionCount: 3 }] },
      { contributionDays: [{ date: '2026-01-03', contributionCount: 5 }] },
    ] } } },
  };
  const weeks = normalizeCalendar(gql);
  expect(weeks).toHaveLength(2);
  expect(weeks[0][1]).toEqual({ date: '2026-01-02', count: 3 });
  expect(weeks[1][0]).toEqual({ date: '2026-01-03', count: 5 });
});
