/**
 * @file useCreatePost.js
 * @description Hook managing optimistic post creation with automatic rollback on network failure.
 */
import { useState, useCallback } from "react";
import * as communityService from "../services/communityService";
import { useAuth } from "../context/AuthContext";

export function useCreatePost({ onOptimisticAdd, onRollback, onConfirmed }) {
  const { user } = useAuth();

  const [content, setContent] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = useCallback(async () => {
    if (!content.trim()) {
      setError("لا يمكن نشر منشور فارغ.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    // Temporary optimistic post
    const tempId = `temp_post_${Date.now()}`;
    const optimisticPost = {
      id: tempId,
      author: {
        id: user?.id || "guest",
        name: user?.name || "طالب مسجل",
        university: user?.university || "جامعة القاهرة",
        avatar: user?.avatar
      },
      content,
      codeSnippet: codeSnippet.trim() || null,
      mediaUrl: mediaFile ? URL.createObjectURL(mediaFile) : null,
      likesCount: 0,
      commentsCount: 0,
      isLikedByMe: false,
      createdAt: new Date().toISOString(),
      isOptimistic: true
    };

    // 1. Optimistic Update (Immediate UI response)
    if (onOptimisticAdd) {
      onOptimisticAdd(optimisticPost);
    }

    // Reset local inputs
    const submittedContent = content;
    const submittedCode = codeSnippet;
    setContent("");
    setCodeSnippet("");
    setMediaFile(null);

    try {
      // 2. Real Network Request
      const confirmedPost = await communityService.createPost({
        content: submittedContent,
        codeSnippet: submittedCode,
        mediaUrl: optimisticPost.mediaUrl
      });

      // 3. Confirm with server response
      if (onConfirmed) {
        onConfirmed(tempId, confirmedPost);
      }
    } catch (err) {
      // 4. Rollback in case of failure
      if (onRollback) {
        onRollback(tempId);
      }
      setError(err?.message || "فشل نشر المنشور، يرجى المحاولة مرة أخرى.");
      // Restore previous values
      setContent(submittedContent);
      setCodeSnippet(submittedCode);
    } finally {
      setIsSubmitting(false);
    }
  }, [content, codeSnippet, mediaFile, user, onOptimisticAdd, onConfirmed, onRollback]);

  return {
    content,
    setContent,
    codeSnippet,
    setCodeSnippet,
    mediaFile,
    setMediaFile,
    isSubmitting,
    error,
    handleSubmit
  };
}

export default useCreatePost;
