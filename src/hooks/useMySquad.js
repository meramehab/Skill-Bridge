/**
 * @file useMySquad.js
 * @description Hook fetching current user's active squad, member list, and squad leader capabilities.
 */
import { useMemo, useCallback } from "react";
import { useAsyncState } from "./useAsyncState";
import * as squadService from "../services/squadService";
import { useAuth } from "../context/AuthContext";

export function useMySquad() {
  const { user } = useAuth();

  const fetcher = useCallback(() => {
    if (!user) return Promise.resolve(null);
    return squadService.getMySquad(user.id);
  }, [user]);

  const { status, data: squad, error, refetch, isLoading, isError } = useAsyncState(
    fetcher,
    [user?.id]
  );

  const hasSquad = Boolean(squad);
  const isSquadLeader = useMemo(() => {
    if (!squad || !user) return false;
    return squad.leaderId === user.id;
  }, [squad, user]);

  return {
    status,
    squad,
    hasSquad,
    isSquadLeader,
    isLoading,
    isError,
    error,
    refetch
  };
}

export default useMySquad;
