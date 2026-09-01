/**
 * @file useStudentDashboard.js
 * @description Hook managing student dashboard state, career readiness gauge, verified skills, and active projects.
 */
import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useAsyncState } from "./useAsyncState";
import * as studentService from "../services/studentService";

export function useStudentDashboard() {
  const { user } = useAuth();

  const {
    data,
    isLoading,
    isError,
    isEmpty,
    error,
    refetch
  } = useAsyncState(studentService.getStudentDashboardData, []);

  const projects = useMemo(() => data?.projects || [], [data]);
  const statsData = data?.stats;

  const readinessScore = useMemo(() => {
    return user?.careerReadinessScore || statsData?.careerReadinessScore || 85;
  }, [user, statsData]);

  const verifiedSkills = useMemo(() => {
    return user?.verifiedSkillsCount || statsData?.verifiedSkillsCount || 5;
  }, [user, statsData]);

  const stats = useMemo(() => [
    { label: "نشطة", value: projects.length || statsData?.activeProjectsCount || 0, iconName: "FolderKanban", iconClass: "text-2xl text-primary" },
    { label: "مكتملة", value: statsData?.completedProjectsCount || 12, iconName: "CheckCircle", iconClass: "text-2xl text-success" },
    { label: "سمعة", value: statsData?.reputationScore || 4.8, iconName: "Star", iconClass: "text-2xl text-yellow-500" },
    { label: "ساعة", value: statsData?.totalLoggedHours || 120, iconName: "Clock", iconClass: "text-2xl text-blue-500" }
  ], [projects, statsData]);

  return {
    user,
    projects,
    stats,
    readinessScore,
    verifiedSkills,
    isLoading,
    isError,
    isEmpty,
    error,
    refetch
  };
}

export default useStudentDashboard;
