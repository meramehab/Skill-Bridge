/**
 * @file featureFlags.js
 * @description Centralized toggles for switching between Mock and Real API services per domain.
 * Set any domain to `false` when its backend endpoint is ready and deployed.
 */

export const USE_MOCK = {
  // Real from Day 1
  auth: false,
  marketplace: false,
  profile: false,
  learningPath: false,

  // Mocked initially (until respective backend milestone is ready)
  home: true,
  verification: true, // OCR & Student ID Document Processing
  community: true,    // Social Feed, Likes, Comments
  squad: true,        // Squad Management & Matchmaking
  leaderboard: true,  // Gamification & XP Ranks
  aiAssistance: true  // AI Proposal generation & Risk Assessment
};

export default USE_MOCK;
