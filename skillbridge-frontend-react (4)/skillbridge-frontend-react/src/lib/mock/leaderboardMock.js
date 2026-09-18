/**
 * @file leaderboardMock.js
 * @description Mock data and caching for Leaderboards across Students, Universities, and Squads.
 */
import { simulateNetworkDelay } from "../../utils/asyncUtils";

export const MOCK_LEADERBOARD_DATABASE = {
  students: {
    weekly: [
      { rank: 1, id: "std_top_01", name: "ياسمين خالد", university: "جامعة عين شمس", badge: "Diamond", xp: 950, completedTasks: 6, rankTrend: "up" },
      { rank: 2, id: "std_10293", name: "أحمد محمود علي (أنت)", university: "جامعة القاهرة", badge: "Gold", xp: 820, completedTasks: 4, rankTrend: "up" },
      { rank: 3, id: "std_top_02", name: "عمر حسن", university: "جامعة الإسكندرية", badge: "Gold", xp: 740, completedTasks: 5, rankTrend: "down" },
      { rank: 4, id: "std_40591", name: "مريم إيهاب", university: "جامعة عين شمس", badge: "Silver", xp: 620, completedTasks: 3, rankTrend: "same" }
    ],
    monthly: [
      { rank: 1, id: "std_top_01", name: "ياسمين خالد", university: "جامعة عين شمس", badge: "Diamond", xp: 3450, completedTasks: 18, rankTrend: "same" },
      { rank: 2, id: "std_top_02", name: "عمر حسن", university: "جامعة الإسكندرية", badge: "Gold", xp: 2980, completedTasks: 14, rankTrend: "up" },
      { rank: 3, id: "std_10293", name: "أحمد محمود علي (أنت)", university: "جامعة القاهرة", badge: "Gold", xp: 2600, completedTasks: 12, rankTrend: "up" }
    ],
    all_time: [
      { rank: 1, id: "std_top_01", name: "ياسمين خالد", university: "جامعة عين شمس", badge: "Diamond", xp: 12400, completedTasks: 45, rankTrend: "same" },
      { rank: 2, id: "std_top_02", name: "عمر حسن", university: "جامعة الإسكندرية", badge: "Diamond", xp: 10800, completedTasks: 38, rankTrend: "same" },
      { rank: 7, id: "std_10293", name: "أحمد محمود علي (أنت)", university: "جامعة القاهرة", badge: "Gold", xp: 5200, completedTasks: 19, rankTrend: "up" }
    ]
  },
  universities: {
    weekly: [
      { rank: 1, id: "uni_cu", name: "جامعة القاهرة", xp: 18400, completedTasks: 140, rankTrend: "up" },
      { rank: 2, id: "uni_asu", name: "جامعة عين شمس", xp: 16900, completedTasks: 125, rankTrend: "down" },
      { rank: 3, id: "uni_alex", name: "جامعة الإسكندرية", xp: 14200, completedTasks: 98, rankTrend: "same" }
    ],
    monthly: [
      { rank: 1, id: "uni_cu", name: "جامعة القاهرة", xp: 74000, completedTasks: 580, rankTrend: "same" },
      { rank: 2, id: "uni_asu", name: "جامعة عين شمس", xp: 68500, completedTasks: 510, rankTrend: "up" },
      { rank: 3, id: "uni_alex", name: "جامعة الإسكندرية", xp: 59000, completedTasks: 420, rankTrend: "same" }
    ],
    all_time: [
      { rank: 1, id: "uni_cu", name: "جامعة القاهرة", xp: 320000, completedTasks: 2400, rankTrend: "same" },
      { rank: 2, id: "uni_asu", name: "جامعة عين شمس", xp: 295000, completedTasks: 2150, rankTrend: "same" },
      { rank: 3, id: "uni_alex", name: "جامعة الإسكندرية", xp: 240000, completedTasks: 1800, rankTrend: "same" }
    ]
  },
  squads: {
    weekly: [
      { rank: 1, id: "sq_alpha_01", name: "فريق النخبة البرمجية (Alpha Squad)", xp: 3400, completedTasks: 8, rankTrend: "up" },
      { rank: 2, id: "sq_beta_02", name: "رواد الموبايل (Mobile Pioneers)", xp: 2100, completedTasks: 5, rankTrend: "down" }
    ],
    monthly: [
      { rank: 1, id: "sq_alpha_01", name: "فريق النخبة البرمجية (Alpha Squad)", xp: 12800, completedTasks: 26, rankTrend: "same" },
      { rank: 2, id: "sq_beta_02", name: "رواد الموبايل (Mobile Pioneers)", xp: 7500, completedTasks: 15, rankTrend: "up" }
    ],
    all_time: [
      { rank: 1, id: "sq_alpha_01", name: "فريق النخبة البرمجية (Alpha Squad)", xp: 48000, completedTasks: 84, rankTrend: "same" },
      { rank: 2, id: "sq_beta_02", name: "رواد الموبايل (Mobile Pioneers)", xp: 29000, completedTasks: 52, rankTrend: "same" }
    ]
  }
};

export async function mockGetLeaderboard(scope = "students", period = "weekly") {
  await simulateNetworkDelay(350);
  const scopeData = MOCK_LEADERBOARD_DATABASE[scope] || MOCK_LEADERBOARD_DATABASE.students;
  const periodData = scopeData[period] || scopeData.weekly;
  return {
    scope,
    period,
    items: periodData,
    total: periodData.length
  };
}
