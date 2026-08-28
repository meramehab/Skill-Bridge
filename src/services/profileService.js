/**
 * @file profileService.js
 * @status REAL (Core profile data is Real from Day 1; Detailed reputation breakdown can be mocked initially)
 * @description Student profile retrieval, career score breakdown, portfolio management, and profile updates.
 */
import { USE_MOCK } from "../config/featureFlags";
import { apiClient } from "../lib/apiClient";
import { mockGetProfile, mockUpdateProfile, mockUploadAvatar } from "../lib/mock/profileMock";

/**
 * Fetch full profile details for a given student (or current user if null)
 * @param {string} [userId]
 */
export async function getProfile(userId) {
  if (USE_MOCK.profile) {
    return mockGetProfile(userId);
  }

  const endpoint = userId ? `/users/${userId}/profile` : "/users/me/profile";
  const { data } = await apiClient.get(endpoint);
  return data;
}

/**
 * Update student profile info
 * @param {string} [userId]
 * @param {Object} updateData
 */
export async function updateProfile(userId, updateData) {
  if (USE_MOCK.profile) {
    return mockUpdateProfile(userId, updateData);
  }

  const endpoint = userId ? `/users/${userId}/profile` : "/users/me/profile";
  const { data } = await apiClient.patch(endpoint, updateData);
  return data;
}

/**
 * Upload student profile avatar
 * @param {string} [userId]
 * @param {File} file
 */
export async function uploadAvatar(userId, file) {
  if (USE_MOCK.profile) {
    return mockUploadAvatar(userId, file);
  }

  const formData = new FormData();
  formData.append("avatar", file);

  const endpoint = userId ? `/users/${userId}/avatar` : "/users/me/avatar";
  const { data } = await apiClient.post(endpoint, formData);
  return data;
}
