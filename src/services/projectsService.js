/**
 * @file projectsService.js
 * @status MIXED (Projects & Proposals are Real from Day 1; AI matching & AI Proposal are Mocked initially)
 * @description Marketplace projects query, project details, AI proposal generation, and bid submissions.
 */
import { USE_MOCK } from "../config/featureFlags";
import { apiClient } from "../lib/apiClient";
import {
  mockGetProjects,
  mockGetProjectById,
  mockGenerateAiProposal,
  mockSubmitProposal
} from "../lib/mock/projectsMock";

/**
 * Fetch marketplace projects with search, filter, and pagination options
 * @param {Object} filters
 * @param {string} [filters.search]
 * @param {string} [filters.skill]
 * @param {string} [filters.type]
 * @param {number} [filters.minBudget]
 * @param {number} [filters.maxBudget]
 * @param {string} [filters.sortBy]
 * @param {number} [filters.page=1]
 * @param {number} [filters.limit=10]
 */
export async function getProjects(filters = {}) {
  if (USE_MOCK.marketplace) {
    return mockGetProjects(filters);
  }

  const { data } = await apiClient.get("/projects", { params: filters });
  return data;
}

/**
 * Fetch single project details with compatibility breakdown
 * @param {string} projectId
 */
export async function getProjectById(projectId) {
  if (USE_MOCK.marketplace) {
    return mockGetProjectById(projectId);
  }

  const { data } = await apiClient.get(`/projects/${projectId}`);
  return data;
}

/**
 * AI Assistant: Generate optimized cover letter and bid for student
 * @param {string} projectId
 */
export async function generateAiProposal(projectId) {
  if (USE_MOCK.aiAssistance) {
    return mockGenerateAiProposal(projectId);
  }

  const { data } = await apiClient.post(`/projects/${projectId}/ai-proposal-assist`, {});
  return data;
}

/**
 * Submit proposal / bid for a project
 * @param {Object} proposalData
 * @param {string} proposalData.projectId
 * @param {string} proposalData.coverLetter
 * @param {number} proposalData.bidAmount
 * @param {number} proposalData.estimatedDays
 */
export async function submitProposal(proposalData) {
  if (USE_MOCK.marketplace) {
    return mockSubmitProposal(proposalData);
  }

  const { data } = await apiClient.post(`/projects/${proposalData.projectId}/proposals`, proposalData);
  return data;
}
