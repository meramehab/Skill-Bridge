/**
 * @file useOpenSquads.js
 * @description Hook managing open squads listing with skill filters.
 */
import { useState, useCallback } from "react";
import { useAsyncState } from "./useAsyncState";
import * as squadService from "../services/squadService";

export function useOpenSquads(initialSkillFilter = "") {
  const [skillFilter, setSkillFilter] = useState(initialSkillFilter);

  const fetcher = useCallback(() => {
    return squadService.getOpenSquads({ skill: skillFilter });
  }, [skillFilter]);

  const { status, data, error, refetch, isLoading, isError, isEmpty } = useAsyncState(
    fetcher,
    [skillFilter]
  );

  return {
    status,
    squads: data?.items || [],
    total: data?.total || 0,
    skillFilter,
    setSkillFilter,
    isLoading,
    isError,
    isEmpty,
    error,
    refetch
  };
}

export default useOpenSquads;
