/**
 * @file communityService.js
 * @status MOCK (Social network layer planned for later roadmap phase)
 * @description Community posts feed, create post, likes, comments, user follows, reports and blocks.
 */
import { USE_MOCK } from "../config/featureFlags";
import { apiClient } from "../lib/apiClient";
import {
  mockGetCommunityFeed,
  mockCreatePost,
  mockTogglePostLike,
  mockAddComment,
  mockGetComments,
  mockFollowUser,
  mockUnfollowUser,
  mockReportPost,
  mockBlockUser
} from "../lib/mock/communityMock";

/**
 * Get paginated community feed posts
 * @param {number} [page=1]
 * @param {number} [limit=10]
 */
export async function getCommunityFeed(page = 1, limit = 10) {
  if (USE_MOCK.community) {
    return mockGetCommunityFeed(page, limit);
  }

  const { data } = await apiClient.get("/community/posts", {
    params: { page, limit }
  });
  return data;
}

/**
 * Publish a new community post
 * @param {Object} postData
 * @param {string} postData.content
 * @param {string} [postData.codeSnippet]
 * @param {string} [postData.mediaUrl]
 */
export async function createPost(postData) {
  if (USE_MOCK.community) {
    return mockCreatePost(postData);
  }

  const { data } = await apiClient.post("/community/posts", postData);
  return data;
}

/**
 * Toggle like/unlike on a post
 * @param {string} postId
 */
export async function togglePostLike(postId) {
  if (USE_MOCK.community) {
    return mockTogglePostLike(postId);
  }

  const { data } = await apiClient.post(`/community/posts/${postId}/like`, {});
  return data;
}

/**
 * Add a comment to a post
 * @param {string} postId
 * @param {string} content
 */
export async function addComment(postId, content) {
  if (USE_MOCK.community) {
    return mockAddComment(postId, content);
  }

  const { data } = await apiClient.post(`/community/posts/${postId}/comments`, { content });
  return data;
}

/**
 * Get comments for a post
 * @param {string} postId
 */
export async function getComments(postId) {
  if (USE_MOCK.community) {
    return mockGetComments(postId);
  }

  const { data } = await apiClient.get(`/community/posts/${postId}/comments`);
  return data;
}

/**
 * Follow another student
 * @param {string} targetUserId
 */
export async function followUser(targetUserId) {
  if (USE_MOCK.community) {
    return mockFollowUser(targetUserId);
  }

  const { data } = await apiClient.post(`/community/users/${targetUserId}/follow`, {});
  return data;
}

/**
 * Unfollow student
 * @param {string} targetUserId
 */
export async function unfollowUser(targetUserId) {
  if (USE_MOCK.community) {
    return mockUnfollowUser(targetUserId);
  }

  const { data } = await apiClient.delete(`/community/users/${targetUserId}/follow`);
  return data;
}

/**
 * Report a post
 * @param {string} postId
 * @param {string} reason
 */
export async function reportPost(postId, reason) {
  if (USE_MOCK.community) {
    return mockReportPost(postId, reason);
  }

  const { data } = await apiClient.post(`/community/posts/${postId}/report`, { reason });
  return data;
}

/**
 * Block a user
 * @param {string} targetUserId
 */
export async function blockUser(targetUserId) {
  if (USE_MOCK.community) {
    return mockBlockUser(targetUserId);
  }

  const { data } = await apiClient.post(`/community/users/${targetUserId}/block`, {});
  return data;
}
