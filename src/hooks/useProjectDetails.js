/**
 * @file useProjectDetails.js
 * @description Hook fetching single project details, client history, and AI compatibility risk assessment.
 */
import { useMemo, useCallback } from "react";
import { useAsyncState } from "./useAsyncState";
import * as projectsService from "../services/projectsService";

export function useProjectDetails(projectId) {
  const fetcher = useCallback(() => {
    if (!projectId) return Promise.resolve(null);
    return projectsService.getProjectById(projectId);
  }, [projectId]);

  const { status, data: project, error, refetch, isLoading, isError, isEmpty } = useAsyncState(
    fetcher,
    [projectId]
  );

  // Check if student compatibility is low (Gap detection)
  const isLowCompatibility = useMemo(() => {
    if (!project?.aiRiskAnalysis) return false;
    return project.aiRiskAnalysis.compatibilityScore < 70;
  }, [project]);

  return {
    status,
    project,
    isLowCompatibility,
    isLoading,
    isError,
    isEmpty,
    error,
    refetch
  };
}

export default useProjectDetails;
