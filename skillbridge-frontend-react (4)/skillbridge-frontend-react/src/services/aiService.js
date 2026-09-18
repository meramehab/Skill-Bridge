/**
 * @file aiService.js
 * @description Centralized AI service for CV Analysis, Skill Verification, Quiz Generation, and Code Review.
 */
import { USE_MOCK } from "../config/featureFlags";
import { apiClient } from "../lib/apiClient";
import { simulateNetworkDelay } from "../utils/asyncUtils";

const MOCK_CV_ANALYSIS_RESULT = {
  score: 75,
  level: "متقدم",
  skills: [
    { name: "React.js", level: "Advanced", score: 85 },
    { name: "Vue.js", level: "Intermediate", score: 70 },
    { name: "JavaScript", level: "Advanced", score: 80 },
    { name: "Python", level: "Intermediate", score: 65 }
  ],
  missingSkills: ["Node.js", "TypeScript", "GraphQL"],
  recommendations: [
    "تعلم Node.js لتصبح Full-Stack Developer",
    "أضف مشاريع عملية إلى بروفايلك",
    "شارك في مشاريع مفتوحة المصدر"
  ]
};

export const aiService = {
  /**
   * Upload & analyze student CV
   * @param {File} file
   */
  async analyzeCV(file) {
    if (USE_MOCK?.aiAssistance ?? true) {
      await simulateNetworkDelay(1200);
      if (!file) {
        throw new Error("يرجى اختيار ملف السيرة الذاتية أولاً.");
      }
      return MOCK_CV_ANALYSIS_RESULT;
    }

    const formData = new FormData();
    formData.append("cv", file);
    const { data } = await apiClient.post("/ai/analyze-cv", formData);
    return data;
  },

  async chatAssessment(messages) {
    if (USE_MOCK?.aiAssistance ?? true) {
      await simulateNetworkDelay(600);
      return { response: "تقييم أولي ممتاز لمستواك التقني." };
    }
    const { data } = await apiClient.post("/ai/chat-assessment", { messages });
    return data;
  },

  async verifySkill(skillName, assessmentData = {}) {
    if (USE_MOCK?.aiAssistance ?? true) {
      await simulateNetworkDelay(1000);
      return {
        score: Math.floor(Math.random() * 25) + 75,
        level: "متقدم",
        passed: true,
        feedback: "أداء ممتاز! أتقنت المهارات الأساسية والتطبيق العملي بنجاح."
      };
    }
    const { data } = await apiClient.post("/ai/verify-skill", { skillName, ...assessmentData });
    return data;
  },

  async generateQuiz(skillName, level = "Intermediate") {
    if (USE_MOCK?.aiAssistance ?? true) {
      await simulateNetworkDelay(500);
      return {
        skill: skillName,
        level,
        questions: [
          { id: 1, question: "ما هو الـ Virtual DOM وكيف يعمل؟", options: ["A", "B", "C", "D"] }
        ]
      };
    }
    const { data } = await apiClient.post("/ai/generate-quiz", { skillName, level });
    return data;
  },

  async reviewCode(code, language = "javascript") {
    if (USE_MOCK?.aiAssistance ?? true) {
      await simulateNetworkDelay(900);
      return { score: 90, feedback: "كود منظم ويتبع أفضل الممارسات." };
    }
    const { data } = await apiClient.post("/ai/review-code", { code, language });
    return data;
  },

  async matchTeam(projectId) {
    if (USE_MOCK?.aiAssistance ?? true) {
      await simulateNetworkDelay(700);
      return { matchedSquads: [] };
    }
    const { data } = await apiClient.post("/ai/match-team", { projectId });
    return data;
  }
};

export default aiService;
