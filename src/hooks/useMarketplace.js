/**
 * @file useMarketplace.js
 * @description Hook managing marketplace browsing, debounced search filters,
 * pagination/infinite scrolling, and the freelancing unlock gate check.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import * as projectsService from "../services/projectsService";
import { useAuth } from "../context/AuthContext";
import { isEmptyResponse } from "../utils/asyncUtils";

export function useMarketplace(initialFilters = {}) {
  const { isFreelancingUnlocked, user } = useAuth();

  const [filters, setFilters] = useState({
    search: "",
    skill: "",
    type: "all", // "all" | "project" | "micro_gig"
    minBudget: "",
    maxBudget: "",
    sortBy: "newest", // "newest" | "highest_budget"
    ...initialFilters
  });

  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus] = useState("loading"); // "idle" | "loading" | "success" | "error" | "empty"
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // Debounced search text ref
  const searchDebounceTimer = useRef(null);
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  // Handle debouncing text inputs only
  const updateSearch = useCallback((searchTerm) => {
    setFilters((prev) => ({ ...prev, search: searchTerm }));
    clearTimeout(searchDebounceTimer.current);
    searchDebounceTimer.current = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 350);
  }, []);

  // Update other non-text filters immediately
  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      skill: "",
      type: "all",
      minBudget: "",
      maxBudget: "",
      sortBy: "newest"
    });
    setDebouncedSearch("");
    setPage(1);
  }, []);

  // Primary Fetcher
  const fetchProjects = useCallback(
    async (currentPage = 1, isAppend = false) => {
      if (isAppend) {
        setIsLoadingMore(true);
      } else {
        setStatus("loading");
        setError(null);
      }

      try {
        const queryParams = {
          search: debouncedSearch,
          skill: filters.skill,
          type: filters.type !== "all" ? filters.type : undefined,
          minBudget: filters.minBudget || undefined,
          maxBudget: filters.maxBudget || undefined,
          sortBy: filters.sortBy,
          page: currentPage,
          limit: 6
        };

        const response = await projectsService.getProjects(queryParams);
        const items = response?.items || [];
        const totalCount = response?.total || 0;
        const moreAvailable = Boolean(response?.hasMore);

        if (isAppend) {
          setProjects((prev) => [...prev, ...items]);
        } else {
          setProjects(items);
        }

        setTotal(totalCount);
        setHasMore(moreAvailable);

        const currentItems = isAppend ? [...projects, ...items] : items;
        if (isEmptyResponse(currentItems)) {
          setStatus("empty");
        } else {
          setStatus("success");
        }
      } catch (err) {
        setError(err.message || "حدث خطأ أثناء تحميل قائمة المشاريع.");
        setStatus("error");
      } finally {
        setIsLoadingMore(false);
      }
    },
    [debouncedSearch, filters.skill, filters.type, filters.minBudget, filters.maxBudget, filters.sortBy, projects]
  );

  // Initial and filter change trigger
  useEffect(() => {
    fetchProjects(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filters.skill, filters.type, filters.minBudget, filters.maxBudget, filters.sortBy]);

  // Load more / Infinite scroll
  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProjects(nextPage, true);
    }
  }, [isLoadingMore, hasMore, page, fetchProjects]);

  return {
    status,
    projects,
    total,
    page,
    hasMore,
    isLoading: status === "loading",
    isLoadingMore,
    isSuccess: status === "success",
    isError: status === "error",
    isEmpty: status === "empty",
    error,
    filters,
    isUnlocked: isFreelancingUnlocked,
    careerReadinessScore: user?.careerReadinessScore || 0,
    updateSearch,
    setFilter,
    resetFilters,
    loadMore,
    refetch: () => fetchProjects(1, false)
  };
}

export default useMarketplace;
