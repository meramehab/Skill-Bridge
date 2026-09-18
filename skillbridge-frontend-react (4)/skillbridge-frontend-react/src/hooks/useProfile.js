/**
 * @file useProfile.js
 * @description Hook managing student profile retrieval, section-by-section loading states,
 * and view mode determination (Editable my-profile vs Read-only other student).
 */
import { useMemo, useCallback } from "react";
import { useAsyncState } from "./useAsyncState";
import * as profileService from "../services/profileService";
import { useAuth } from "../context/AuthContext";

export function useProfile(userId) {
  const { user: currentUser } = useAuth();

  // Determine if viewing own profile
  const isMyProfile = useMemo(() => {
    if (!userId) return true;
    if (!currentUser) return false;
    return currentUser.id === userId;
  }, [userId, currentUser]);

  const targetId = userId || currentUser?.id;

  const fetcher = useCallback(() => {
    return profileService.getProfile(targetId);
  }, [targetId]);

  const { status, data: profile, error, refetch, isLoading, isError, isEmpty } = useAsyncState(
    fetcher,
    [targetId]
  );

  // Granular section helpers (enables per-section skeletons if needed)
  const sections = useMemo(() => {
    if (!profile) return null;
    return {
      personalInfo: {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        university: profile.university,
        faculty: profile.faculty,
        avatar: profile.avatar,
        bio: profile.bio
      },
      readiness: {
        score: profile.careerReadinessScore,
        breakdown: profile.scoreBreakdown,
        freelancingLevel: profile.freelancingLevel,
        isFreelancingUnlocked: profile.isFreelancingUnlocked
      },
      verifiedSkills: profile.verifiedSkills || [],
      portfolio: profile.portfolio || [],
      reputation: profile.reputationMetrics || { badges: [] }
    };
  }, [profile]);

  return {
    status,
    profile,
    sections,
    isMyProfile,
    isLoading,
    isError,
    isEmpty,
    error,
    refetch
  };
}

export default useProfile;
