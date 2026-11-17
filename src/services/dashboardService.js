import { cachedFetch } from '../utils/asyncPatterns';
/**
 * TODO: Implement a service that coordinates multiple API calls
 *
 * Requirements:
 * 1. Fetch all dashboard data in parallel
 * 2. Handle partial failures gracefully
 * 3. Provide fallback data when services fail
 * 4. Use caching to optimize performance
 */

export async function fetchDashboardData(city) {
  const endpoints = {
    weather: `http://localhost:3001/weather?city=${city}`,
    forecast: `http://localhost:3001/forecast?city=${city}`,
    news: `http://localhost:3001/news?city=${city}`,
    alerts: `http://localhost:3001/alerts?city=${city}`
  };

  const names = Object.keys(endpoints);

  const promises = names.map(name =>
    cachedFetch(endpoints[name])
  );

  const results = await Promise.allSettled(promises);

  const dashboardData = {};

  results.forEach((result, index) => {
    const name = names[index];

    if (result.status === 'fulfilled') {
      dashboardData[name] = result.value;
    } else {
      dashboardData[name] = {
        error: true,
        message: result.reason.message
      };
    }
  });

  return dashboardData;
}