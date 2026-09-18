/**
 * @file skillsService.js
 * @description Service for skills retrieval, skill verification assessments, and career readiness scores.
 */
import { USE_MOCK } from "../config/featureFlags";
import { apiClient } from "../lib/apiClient";
import { simulateNetworkDelay } from "../utils/asyncUtils";

const MOCK_AVAILABLE_SKILLS = [
  { id: 1, name: "React.js", category: "Frontend" },
  { id: 2, name: "Vue.js", category: "Frontend" },
  { id: 3, name: "Python", category: "Backend" },
  { id: 4, name: "Node.js", category: "Backend" },
  { id: 5, name: "JavaScript", category: "Language" },
  { id: 6, name: "UI/UX Design", category: "Design" }
];

export async function getAvailableSkills() {
  if (USE_MOCK?.verification ?? true) {
    await simulateNetworkDelay(200);
    return MOCK_AVAILABLE_SKILLS;
  }

  const { data } = await apiClient.get("/skills");
  return data;
}

export async function verifySkillAssessment({ skillId, type, answers = {} }) {
  if (USE_MOCK?.verification ?? true) {
    await simulateNetworkDelay(1200);
    const score = Math.floor(Math.random() * 25) + 75;
    return {
      success: true,
      skillId,
      type,
      score,
      level: score >= 85 ? "خبير" : "متقدم",
      passed: score >= 60,
      feedback: "أداء ممتاز! أتقنت المهارات الأساسية والمتقدمة وفقاً لمعايير التقييم."
    };
  }

  const { data } = await apiClient.post(`/skills/${skillId}/verify`, { type, answers });
  return data;
}

export async function getCareerReadinessScore() {
  if (USE_MOCK?.verification ?? true) {
    await simulateNetworkDelay(300);
    return { score: 82, verifiedSkillsCount: 4 };
  }

  const { data } = await apiClient.get("/skills/readiness-score");
  return data;
}
