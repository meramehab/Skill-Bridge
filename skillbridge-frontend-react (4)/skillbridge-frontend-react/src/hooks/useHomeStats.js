/**
 * @file useHomeStats.js
 * @description Hook managing Landing Page statistics, featured projects, and smart CTA navigation.
 */
import { useMemo } from "react";
import { useAsyncState } from "./useAsyncState";
import * as homeService from "../services/homeService";
import { useAuth } from "../context/AuthContext";

// Fallback safe numbers if stats request fails (so landing page never crashes)
const SAFE_FALLBACK_STATS = {
  totalStudents: 10000,
  completedProjects: 2500,
  partnerUniversities: 25,
  totalEarningsEGP: 1800000,
  topSkillsInDemand: ["React.js", "UI/UX", "Node.js"],
  featuredProjects: [],
  topStudents: []
};

export function useHomeStats() {
  const { isAuthenticated, isFreelancingUnlocked } = useAuth();

  const { status, data, error, refetch, isLoading, isError } = useAsyncState(
    homeService.getHomeStats,
    []
  );

  // Return real data if success, or fallback data if error
  const stats = useMemo(() => {
    if (data) return data;
    if (isError) return SAFE_FALLBACK_STATS;
    return null;
  }, [data, isError]);

  // Determine smart CTA route based on student authentication & readiness
  const primaryCtaAction = useMemo(() => {
    if (!isAuthenticated) {
      return { label: "ابدأ الآن وسجّل مجاناً", targetRoute: "/register" };
    }
    if (isFreelancingUnlocked) {
      return { label: "استكشف سوق العمل والمشاريع", targetRoute: "/marketplace" };
    }
    return { label: "أكمل مسارك التعليمي لفتح سوق العمل", targetRoute: "/learning-path" };
  }, [isAuthenticated, isFreelancingUnlocked]);

  return {
    status,
    stats,
    error,
    isLoading,
    isError,
    refetch,
    primaryCtaAction
  };
}

export default useHomeStats;
