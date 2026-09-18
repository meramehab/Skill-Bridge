/**
 * @file learningPathService.js
 * @status MIXED (Learning path is Real from Day 1; Detailed lesson progress tracking may be Mocked initially)
 * @description Personalized AI learning paths, step progress updates, and fast-track skill assessments.
 */
import { USE_MOCK } from "../config/featureFlags";
import { apiClient } from "../lib/apiClient";
import {
  mockGetLearningPath,
  mockUpdateStepStatus,
  mockFastTrackVerification
} from "../lib/mock/learningPathMock";

/**
 * Fetch personalized learning path for student
 */
export async function getLearningPath() {
  if (USE_MOCK.learningPath) {
    return mockGetLearningPath();
  }

  const { data } = await apiClient.get("/learning-path/me");
  return data;
}

/**
 * Update completion status of a specific learning step
 * @param {string} stepId
 * @param {"not_started"|"in_progress"|"completed"} status
 */
export async function updateStepStatus(stepId, status) {
  if (USE_MOCK.learningPath) {
    return mockUpdateStepStatus(stepId, status);
  }

  const { data } = await apiClient.patch(`/learning-path/steps/${stepId}/status`, { status });
  return data;
}

/**
 * Fast-track skill verification (Skip step and take instant quiz/assessment)
 * @param {string} stepId
 */
export async function fastTrackVerification(stepId) {
  if (USE_MOCK.learningPath) {
    return mockFastTrackVerification(stepId);
  }

  const { data } = await apiClient.post(`/learning-path/steps/${stepId}/fast-track`, {});
  return data;
}
