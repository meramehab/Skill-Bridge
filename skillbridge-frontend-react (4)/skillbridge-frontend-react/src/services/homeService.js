/**
 * @file homeService.js
 * @status MOCK (Marketing stats and landing highlights initially)
 * @description Landing page statistical figures, featured student gigs, and top earners.
 */
import { USE_MOCK } from "../config/featureFlags";
import { apiClient } from "../lib/apiClient";
import { mockGetHomeStats } from "../lib/mock/homeMock";

/**
 * Get landing page public statistics and featured content
 */
export async function getHomeStats() {
  if (USE_MOCK.home) {
    return mockGetHomeStats();
  }

  const { data } = await apiClient.get("/public/stats");
  return data;
}
