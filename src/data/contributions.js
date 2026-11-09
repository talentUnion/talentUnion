const QUERY = `query($login:String!){
  user(login:$login){ contributionsCollection{ contributionCalendar{
    weeks{ contributionDays{ date contributionCount } } } } } }`;

function normalizeCalendar(data) {
  const weeks = data.user.contributionsCollection.contributionCalendar.weeks;
  return weeks.map((w) => w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount })));
}

async function fetchContributionWeeks(login, token) {
  if (!token) throw new Error('GITHUB_TOKEN required for contributions');
  // @octokit/graphql v9 is ESM-only; a static require would break the CommonJS/Jest
  // toolchain, so it is loaded via dynamic import at call time (not a style choice).
  const { graphql } = await import('@octokit/graphql');
  const data = await graphql(QUERY, { login, headers: { authorization: `token ${token}` } });
  return normalizeCalendar(data);
}

module.exports = { fetchContributionWeeks, normalizeCalendar, QUERY };
