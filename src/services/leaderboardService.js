/**
 * @file leaderboardService.js
 * @status MOCK (Real-time live leaderboard planned for later phase)
 * @description Leaderboards across Students, Universities, and Squads with built-in client caching.
 */
import { USE_MOCK } from "../config/featureFlags";
import { apiClient } from "../lib/apiClient";
import { mockGetLeaderboard } from "../lib/mock/leaderboardMock";

// Simple client-side cache to avoid refetching when switching back and forth between tabs
const leaderboardCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 1 minute

/**
 * Fetch leaderboard ranking data with scope, period, and cache support
 * @param {"students"|"universities"|"squads"} [scope="students"]
 * @param {"weekly"|"monthly"|"all_time"} [period="weekly"]
 * @param {boolean} [forceRefresh=false]
 */
export async function getLeaderboard(scope = "students", period = "weekly", forceRefresh = false) {
  const cacheKey = `${scope}_${period}`;
  const cached = leaderboardCache.get(cacheKey);

  if (!forceRefresh && cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  let data;
  if (USE_MOCK.leaderboard) {
    data = await mockGetLeaderboard(scope, period);
  } else {
    const response = await apiClient.get("/leaderboard", {
      params: { scope, period }
    });
    data = response.data;
  }

  leaderboardCache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}

/**
 * Clear the leaderboard client cache
 */
export function clearLeaderboardCache() {
  leaderboardCache.clear();
}
