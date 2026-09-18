/**
 * @file useLeaderboard.js
 * @description Hook managing leaderboard rankings, tab switching (students/universities/squads),
 * time period filtering, caching, and current user row highlighting.
 */
import { useState, useCallback, useMemo } from "react";
import { useAsyncState } from "./useAsyncState";
import * as leaderboardService from "../services/leaderboardService";
import { useAuth } from "../context/AuthContext";

export function useLeaderboard(initialScope = "students", initialPeriod = "weekly") {
  const { user } = useAuth();

  const [scope, setScope] = useState(initialScope); // "students" | "universities" | "squads"
  const [period, setPeriod] = useState(initialPeriod); // "weekly" | "monthly" | "all_time"

  const fetcher = useCallback(() => {
    return leaderboardService.getLeaderboard(scope, period);
  }, [scope, period]);

  const { status, data, error, refetch, isLoading, isError, isEmpty } = useAsyncState(
    fetcher,
    [scope, period]
  );

  const items = useMemo(() => data?.items || [], [data]);

  // Helper to test if a row in the leaderboard belongs to the current user
  const isCurrentUserRow = useCallback(
    (entryId) => {
      if (!user) return false;
      return entryId === user.id || entryId === user.squadId;
    },
    [user]
  );

  const changeScope = useCallback((newScope) => {
    setScope(newScope);
  }, []);

  const changePeriod = useCallback((newPeriod) => {
    setPeriod(newPeriod);
  }, []);

  return {
    scope,
    period,
    items,
    total: data?.total || 0,
    status,
    isLoading,
    isError,
    isEmpty,
    error,
    changeScope,
    changePeriod,
    isCurrentUserRow,
    refetch
  };
}

export default useLeaderboard;
