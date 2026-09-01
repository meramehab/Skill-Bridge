import {
  getSkillLevelGap,
  isLevelAtLeast,
  normalizeSkillLevel,
} from "../qualification/skill-levels.js";

function getPlanStatus(steps) {
  if (steps.length === 0 || steps.every((step) => step.status === "completed")) {
    return "completed";
  }

  return steps.some((step) => step.status !== "not-started") ? "in-progress" : "not-started";
}

function getConfidence(successfulEvaluationCount) {
  if (successfulEvaluationCount >= 3) {
    return 0.9;
  }

  if (successfulEvaluationCount === 2) {
    return 0.75;
  }

  if (successfulEvaluationCount === 1) {
    return 0.55;
  }

  return 0;
}

function addMiniAssessmentEvidence(skill, result) {
  return {
    ...(skill.assessmentEvidence ?? {}),
    miniAssessment: {
      status: result.status,
      averageScore: result.averageScore,
      demonstratedLevel: result.demonstratedLevel,
      successfulEvaluationCount: result.successfulEvaluationCount,
      assessmentCoverage: result.assessmentCoverage,
    },
  };
}

export function applyMiniAssessmentResult(plan, skillMap, result) {
  if (!plan || !Array.isArray(plan.steps) || !Array.isArray(skillMap) || !result) {
    throw new Error("A learning plan, skillMap, and mini assessment result are required.");
  }

  const nextPlan = structuredClone(plan);
  const nextSkillMap = structuredClone(skillMap);
  const step = nextPlan.steps.find((item) => item.skill === result.skill);
  const skill = nextSkillMap.find((item) => item.name === result.skill);

  if (!step || !skill) {
    throw new Error(`Learning skill not found: ${result.skill}`);
  }

  if (result.status === "unavailable") {
    step.status = "assessment-unavailable";
    nextPlan.status = getPlanStatus(nextPlan.steps);
    return { plan: nextPlan, skillMap: nextSkillMap };
  }

  const currentLevel = normalizeSkillLevel(result.demonstratedLevel) ?? "none";
  const targetLevel = normalizeSkillLevel(skill.targetLevel) ?? "beginner";
  const successfulEvaluationCount = result.successfulEvaluationCount ?? 0;

  if (result.passed && isLevelAtLeast(currentLevel, targetLevel)) {
    step.status = "completed";
    skill.state = "verified";
    skill.currentLevel = currentLevel;
    skill.averageScore = result.averageScore;
    skill.confidence = getConfidence(successfulEvaluationCount);
    skill.gapSeverity = "none";
    skill.recommendedAction = "skip";
    skill.reason = `Mini assessment demonstrated ${currentLevel} level at or above the ${targetLevel} target.`;
    skill.assessmentEvidence = addMiniAssessmentEvidence(skill, result);
  } else {
    step.status = "needs-review";

    if (successfulEvaluationCount > 0) {
      skill.currentLevel = currentLevel;
      skill.averageScore = result.averageScore;
      skill.confidence = getConfidence(successfulEvaluationCount);
      skill.assessmentEvidence = addMiniAssessmentEvidence(skill, result);

      if (currentLevel === "none") {
        skill.state = "missing";
        skill.gapSeverity = "high";
        skill.recommendedAction = "learn";
        skill.reason = "Mini assessment did not demonstrate a usable level for this skill.";
      } else {
        skill.state = "needs-improvement";
        skill.gapSeverity = getSkillLevelGap(currentLevel, targetLevel) === 1 ? "medium" : "high";
        skill.recommendedAction = "improve";
        skill.reason = `Mini assessment demonstrated ${currentLevel} level below the ${targetLevel} target.`;
      }
    }
  }

  nextPlan.status = getPlanStatus(nextPlan.steps);
  return { plan: nextPlan, skillMap: nextSkillMap };
}
