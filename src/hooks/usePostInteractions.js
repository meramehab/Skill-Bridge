/**
 * @file usePostInteractions.js
 * @description Hook handling optimistic likes, real-time comments, student follows, and moderation (report/block).
 */
import { useState, useCallback } from "react";
import * as communityService from "../services/communityService";

export function usePostInteractions(onUpdatePost = () => {}) {
  const [commentsState, setCommentsState] = useState({}); // { [postId]: { items: [], loading: boolean, error: null } }
  const [actionError, setActionError] = useState(null);

  // Optimistic Like / Unlike Toggle
  const handleToggleLike = useCallback(
    async (post) => {
      const { id: postId, isLikedByMe, likesCount } = post;
      const optimisticLiked = !isLikedByMe;
      const optimisticCount = optimisticLiked ? likesCount + 1 : Math.max(likesCount - 1, 0);

      // 1. Immediate UI update
      onUpdatePost(postId, (p) => ({
        ...p,
        isLikedByMe: optimisticLiked,
        likesCount: optimisticCount
      }));

      try {
        // 2. Server Sync
        await communityService.togglePostLike(postId);
      } catch (err) {
        // 3. Rollback on failure
        onUpdatePost(postId, (p) => ({
          ...p,
          isLikedByMe: isLikedByMe,
          likesCount: likesCount
        }));
        setActionError("تعذر تحديث الإعجاب، تحقق من اتصالك بالإنترنت.");
      }
    },
    [onUpdatePost]
  );

  // Load comments for a post
  const loadComments = useCallback(async (postId) => {
    setCommentsState((prev) => ({
      ...prev,
      [postId]: { items: prev[postId]?.items || [], loading: true, error: null }
    }));

    try {
      const data = await communityService.getComments(postId);
      setCommentsState((prev) => ({
        ...prev,
        [postId]: { items: data, loading: false, error: null }
      }));
    } catch (err) {
      setCommentsState((prev) => ({
        ...prev,
        [postId]: { items: [], loading: false, error: "فشل تحميل التعليقات." }
      }));
    }
  }, []);

  // Add Comment with optimistic count update
  const handleAddComment = useCallback(
    async (postId, content) => {
      if (!content || !content.trim()) return;

      try {
        const newComment = await communityService.addComment(postId, content.trim());
        setCommentsState((prev) => ({
          ...prev,
          [postId]: {
            items: [...(prev[postId]?.items || []), newComment],
            loading: false,
            error: null
          }
        }));

        onUpdatePost(postId, (p) => ({
          ...p,
          commentsCount: (p.commentsCount || 0) + 1
        }));
        return newComment;
      } catch (err) {
        setActionError("تعذر إضافة التعليق، يرجى المحاولة مرة أخرى.");
        throw err;
      }
    },
    [onUpdatePost]
  );

  // Follow / Unfollow
  const handleToggleFollow = useCallback(async (targetUserId, isCurrentlyFollowing) => {
    try {
      if (isCurrentlyFollowing) {
        await communityService.unfollowUser(targetUserId);
      } else {
        await communityService.followUser(targetUserId);
      }
      return { success: true, isFollowing: !isCurrentlyFollowing };
    } catch (err) {
      setActionError("فشل تحديث حالة المتابعة.");
      throw err;
    }
  }, []);

  // Moderation: Report Post
  const handleReportPost = useCallback(async (postId, reason) => {
    try {
      const res = await communityService.reportPost(postId, reason);
      return res;
    } catch (err) {
      setActionError("فشل إرسال البلاغ.");
      throw err;
    }
  }, []);

  // Moderation: Block User
  const handleBlockUser = useCallback(async (targetUserId) => {
    try {
      const res = await communityService.blockUser(targetUserId);
      return res;
    } catch (err) {
      setActionError("فشل حظر المستخدم.");
      throw err;
    }
  }, []);

  return {
    commentsState,
    actionError,
    handleToggleLike,
    loadComments,
    handleAddComment,
    handleToggleFollow,
    handleReportPost,
    handleBlockUser
  };
}

export default usePostInteractions;
