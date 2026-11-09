const MONTHS_SHORT = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

// Dates arrive as ISO strings ("2026-07-14"); parsed by slicing to stay
// timezone-independent regardless of where the generator runs.
function parseIso(date) {
  return { y: Number(date.slice(0, 4)), m: Number(date.slice(5, 7)) - 1, d: Number(date.slice(8, 10)) };
}

/**
 * Collapses the contribution calendar (weeks of {date, count} days, as
 * returned by fetchContributionWeeks) into the weekly series the activity
 * trace is drawn from.
 */
function aggregateWeeks(weeks) {
  const totals = weeks.map((days) => days.reduce((a, d) => a + (d.count || 0), 0));
  const total = totals.reduce((a, b) => a + b, 0);
  const max = totals.length ? Math.max(...totals) : 0;

  const monthBoundaries = [];
  for (let i = 1; i < weeks.length; i += 1) {
    const prev = parseIso(weeks[i - 1][0].date);
    const cur = parseIso(weeks[i][0].date);
    if (cur.m !== prev.m) monthBoundaries.push({ index: i, label: MONTHS_SHORT[cur.m] });
  }

  const firstDay = weeks.length ? parseIso(weeks[0][0].date) : null;
  const lastWeek = weeks.length ? weeks[weeks.length - 1] : null;
  const lastDay = lastWeek && lastWeek.length ? parseIso(lastWeek[lastWeek.length - 1].date) : null;

  return {
    totals,
    total,
    max,
    maxIndex: totals.indexOf(max),
    firstDay,
    lastDay,
    monthBoundaries,
  };
}

function rangeCaption(firstDay, lastDay) {
  if (!firstDay || !lastDay) return '';
  return `Weekly contributions, ${MONTHS_LONG[firstDay.m]} ${firstDay.y} to ${MONTHS_LONG[lastDay.m]} ${lastDay.y}.`;
}

module.exports = { aggregateWeeks, rangeCaption, parseIso, MONTHS_SHORT, MONTHS_LONG };
