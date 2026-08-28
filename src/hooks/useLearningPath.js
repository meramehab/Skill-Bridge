/**
 * @file useLearningPath.js
 * @description Hook managing personalized learning tracks, step completion updates,
 * overall progress recalculation, and fast-track skill assessment bypass.
 */
import { useState, useCallback } from "react";
import { useAsyncState } from "./useAsyncState";
import * as learningPathService from "../services/learningPathService";

export function useLearningPath() {
  const [isUpdatingStep, setIsUpdatingStep] = useState(false);
  const [stepActionError, setStepActionError] = useState(null);

  const {
    status,
    data: learningPath,
    error,
    refetch,
    setData,
    isLoading,
    isError,
    isEmpty
  } = useAsyncState(learningPathService.getLearningPath, []);

  // Mark step completed or in_progress + recalculate progress
  const markStepStatus = useCallback(
    async (stepId, newStatus = "completed") => {
      setIsUpdatingStep(true);
      setStepActionError(null);

      // Optimistically update local step status
      setData((prev) => {
        if (!prev) return prev;
        const updatedSteps = prev.steps.map((s) =>
          s.id === stepId ? { ...s, status: newStatus } : s
        );
        const completed = updatedSteps.filter((s) => s.status === "completed").length;
        const overallProgress = Math.round((completed / updatedSteps.length) * 100);
        return { ...prev, steps: updatedSteps, overallProgress };
      });

      try {
        const res = await learningPathService.updateStepStatus(stepId, newStatus);
        return res;
      } catch (err) {
        setStepActionError("فشل تحديث حالة المرحلة التعليمية.");
        // Rollback via refetch
        refetch();
        throw err;
      } finally {
        setIsUpdatingStep(false);
      }
    },
    [setData, refetch]
  );

  // Fast-track: Bypass step directly to skill quiz/assessment
  const triggerFastTrack = useCallback(async (stepId) => {
    try {
      const res = await learningPathService.fastTrackVerification(stepId);
      return res;
    } catch (err) {
      setStepActionError("تعذر بدء التقييم السريع.");
      throw err;
    }
  }, []);

  return {
    status,
    learningPath,
    steps: learningPath?.steps || [],
    overallProgress: learningPath?.overallProgress || 0,
    isUpdatingStep,
    stepActionError,
    isLoading,
    isError,
    isEmpty,
    error,
    markStepStatus,
    triggerFastTrack,
    refetch
  };
}

export default useLearningPath;
