/**
 * @file studentService.js
 * @description Service for Student Dashboard data, student active/completed projects, and career readiness metrics.
 */
import { USE_MOCK } from "../config/featureFlags";
import { apiClient } from "../lib/apiClient";
import { simulateNetworkDelay } from "../utils/asyncUtils";

const MOCK_STUDENT_PROJECTS = [
  {
    id: "proj-101",
    title: "تطوير لوحة تحكم متجر إلكتروني",
    client: "شركة النور للتقنية",
    progress: 75,
    status: "active"
  },
  {
    id: "proj-102",
    title: "تصميم واجهة تطبيق توصيل طلبات",
    client: "مؤسسة الأفق الذكي",
    progress: 40,
    status: "active"
  }
];

const MOCK_STUDENT_STATS = {
  activeProjectsCount: 2,
  completedProjectsCount: 12,
  reputationScore: 4.8,
  totalLoggedHours: 120,
  verifiedSkillsCount: 5,
  careerReadinessScore: 85
};

export async function getStudentDashboardData() {
  if (USE_MOCK?.marketplace ?? true) {
    await simulateNetworkDelay(400);
    return {
      stats: MOCK_STUDENT_STATS,
      projects: MOCK_STUDENT_PROJECTS
    };
  }

  const { data } = await apiClient.get("/student/dashboard");
  return data;
}

export async function getStudentProjects() {
  if (USE_MOCK?.marketplace ?? true) {
    await simulateNetworkDelay(300);
    return MOCK_STUDENT_PROJECTS;
  }

  const { data } = await apiClient.get("/student/projects");
  return data;
}
