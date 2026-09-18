/**
 * @file useCommunityFeed.js
 * @description Hook managing community feed data fetching, pagination, and shared post mutations.
 */
import { useState, useEffect, useCallback } from "react";
import * as communityService from "../services/communityService";
import { isEmptyResponse } from "../utils/asyncUtils";

export function useCommunityFeed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState("loading"); // "idle" | "loading" | "success" | "error" | "empty"
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const fetchFeed = useCallback(async (targetPage = 1, isAppend = false) => {
    if (isAppend) {
      setIsLoadingMore(true);
    } else {
      setStatus("loading");
      setError(null);
    }

    try {
      const response = await communityService.getCommunityFeed(targetPage, 6);
      const items = response?.items || [];
      const moreAvailable = Boolean(response?.hasMore);

      if (isAppend) {
        setPosts((prev) => [...prev, ...items]);
      } else {
        setPosts(items);
      }

      setHasMore(moreAvailable);

      const allItems = isAppend ? [...posts, ...items] : items;
      setStatus(isEmptyResponse(allItems) ? "empty" : "success");
    } catch (err) {
      setError(err?.message || "تعذر تحميل منشورات المجتمع.");
      setStatus("error");
    } finally {
      setIsLoadingMore(false);
    }
  }, [posts]);

  useEffect(() => {
    fetchFeed(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchFeed(nextPage, true);
    }
  }, [isLoadingMore, hasMore, page, fetchFeed]);

  // Utility to locally update a single post (for likes, comments, deletes)
  const updateLocalPost = useCallback((postId, updaterFn) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? updaterFn(p) : p))
    );
  }, []);

  // Utility to inject a new post at the top (optimistic or confirmed)
  const prependPost = useCallback((newPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setStatus("success");
  }, []);

  // Utility to remove a post (rollback or delete)
  const removeLocalPost = useCallback((postId) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }, []);

  return {
    status,
    posts,
    hasMore,
    isLoading: status === "loading",
    isLoadingMore,
    isSuccess: status === "success",
    isError: status === "error",
    isEmpty: status === "empty",
    error,
    loadMore,
    refetch: () => fetchFeed(1, false),
    updateLocalPost,
    prependPost,
    removeLocalPost
  };
}

export default useCommunityFeed;
