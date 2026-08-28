/**
 * @file squadService.js
 * @status MOCK (Squad permanent teams feature scheduled for later roadmap phase)
 * @description Squad creation, member matchmaking, async name availability check, and join request actions.
 */
import { USE_MOCK } from "../config/featureFlags";
import { apiClient } from "../lib/apiClient";
import {
  mockGetMySquad,
  mockGetOpenSquads,
  mockCheckSquadNameAvailability,
  mockCreateSquad,
  mockApplyToSquad,
  mockGetSquadJoinRequests,
  mockHandleJoinRequest,
  mockGetAiSquadRecommendations
} from "../lib/mock/squadMock";

/**
 * Fetch current user's active squad
 * @param {string} userId
 */
export async function getMySquad(userId) {
  if (USE_MOCK.squad) {
    return mockGetMySquad(userId);
  }

  const { data } = await apiClient.get("/squads/my-squad");
  return data;
}

/**
 * Fetch open squads available for joining
 * @param {Object} [filters]
 */
export async function getOpenSquads(filters = {}) {
  if (USE_MOCK.squad) {
    return mockGetOpenSquads(filters);
  }

  const { data } = await apiClient.get("/squads/open", { params: filters });
  return data;
}

/**
 * Async validation: Check if a squad name is already taken
 * @param {string} name
 */
export async function checkSquadNameAvailability(name) {
  if (USE_MOCK.squad) {
    return mockCheckSquadNameAvailability(name);
  }

  const { data } = await apiClient.get("/squads/check-name", { params: { name } });
  return data;
}

/**
 * Create a new squad
 * @param {Object} squadData
 */
export async function createSquad(squadData) {
  if (USE_MOCK.squad) {
    return mockCreateSquad(squadData);
  }

  const { data } = await apiClient.post("/squads", squadData);
  return data;
}

/**
 * Apply to join an open squad
 * @param {string} squadId
 * @param {string} message
 */
export async function applyToSquad(squadId, message) {
  if (USE_MOCK.squad) {
    return mockApplyToSquad(squadId, message);
  }

  const { data } = await apiClient.post(`/squads/${squadId}/apply`, { message });
  return data;
}

/**
 * Get pending join requests (for Squad Leader)
 * @param {string} squadId
 */
export async function getSquadJoinRequests(squadId) {
  if (USE_MOCK.squad) {
    return mockGetSquadJoinRequests(squadId);
  }

  const { data } = await apiClient.get(`/squads/${squadId}/requests`);
  return data;
}

/**
 * Accept or reject a join request
 * @param {string} requestId
 * @param {"accept"|"reject"} action
 */
export async function handleJoinRequest(requestId, action) {
  if (USE_MOCK.squad) {
    return mockHandleJoinRequest(requestId, action);
  }

  const { data } = await apiClient.post(`/squads/requests/${requestId}/${action}`, {});
  return data;
}

/**
 * AI Assistant: Get recommended student candidates for squad
 * @param {string} squadId
 */
export async function getAiSquadRecommendations(squadId) {
  if (USE_MOCK.squad) {
    return mockGetAiSquadRecommendations(squadId);
  }

  const { data } = await apiClient.get(`/squads/${squadId}/ai-recommendations`);
  return data;
}
