import { scoreToDemonstratedLevel } from "../assessment/assessment-levels.js";
import { getRoleById, getRoleByName } from "../roles/get-role.js";
import {
  getSkillLevelGap,
  isLevelAtLeast,
  normalizeSkillLevel,
} from "./skill-levels.js";

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function resolveRole(role, assessmentResult) {
  if (isPlainObject(role) && Array.isArray(role.requiredSkills)) {
    return role;
  }

  const roleReference = role ?? assessmentResult.role;
  const roleId = typeof roleReference === "string" ? roleReference : roleReference?.id;
  const roleName = typeof roleReference === "string" ? roleReference : roleReference?.name;

  if (roleId) {
    try {
      return getRoleById(roleId);
    } catch {
      // A role name may have been supplied in the same string.
    }
  }

  if (roleName) {
    return getRoleByName(roleName);
  }

  throw new Error("A valid production role is required to build the verified skill map.");
}

function getAssessmentSkillEntries(assessmentResult) {
  if (Array.isArray(assessmentResult.skillStates)) {
    return assessmentResult.skillStates;
  }

  if (Array.isArray(assessmentResult.session?.skillStates)) {
    return assessmentResult.session.skillStates;
  }

  if (Array.isArray(assessmentResult.skillMap)) {
    return assessmentResult.skillMap;
  }

  return [];
}

function getSuccessfulEvaluationCount(skillResult) {
  if (Number.isInteger(skillResult?.successfulEvaluations) && skillResult.successfulEvaluations >= 0) {
    return skillResult.successfulEvaluations;
  }

  if (Array.isArray(skillResult?.evaluationScores)) {
    return skillResult.evaluationScores.filter(Number.isFinite).length;
  }

  return Number.isFinite(skillResult?.averageScore) ? 1 : 0;
}

function getCurrentLevel(skillResult, successfulEvaluations) {
  if (successfulEvaluations === 0) {
    return "none";
  }

  if (Number.isFinite(skillResult?.averageScore)) {
    return scoreToDemonstratedLevel(skillResult.averageScore);
  }

  return (
    normalizeSkillLevel(
      skillResult?.verifiedLevel ?? skillResult?.estimatedLevel ?? skillResult?.demonstratedLevel,
    ) ?? "none"
  );
}

function hasExplicitMissingDiscovery(skillResult) {
  const discoveryExposure = skillResult?.lastEvaluation?.exposure;
  const hasReliableDiscoveryEvaluation = skillResult?.lastEvaluation?.evaluationStatus !== "unavailable";

  return (
    skillResult?.discoveryStatus === "no-usable-exposure" ||
    (hasReliableDiscoveryEvaluation && discoveryExposure === "none") ||
    (hasReliableDiscoveryEvaluation && discoveryExposure === "heard-of") ||
    (skillResult?.status === "missing" && getSuccessfulEvaluationCount(skillResult) === 0)
  );
}

function deriveConfidence(skillResult, state, successfulEvaluations, explicitMissing) {
  if (explicitMissing) {
    return 1;
  }

  if (state === "unknown") {
    return 0;
  }

  if (
    typeof skillResult?.confidence === "number" &&
    skillResult.confidence >= 0 &&
    skillResult.confidence <= 1 &&
    skillResult.confidence > 0
  ) {
    return skillResult.confidence;
  }

  if (successfulEvaluations >= 3) {
    return 0.9;
  }

  if (successfulEvaluations === 2) {
    return 0.75;
  }

  if (successfulEvaluations === 1) {
    return 0.55;
  }

  return 0;
}

function classifySkill(skillResult, currentLevel, targetLevel, successfulEvaluations) {
  const explicitMissing = hasExplicitMissingDiscovery(skillResult);

  if (successfulEvaluations > 0) {
    if (currentLevel === "none") {
      return { state: "missing", explicitMissing: false };
    }

    if (isLevelAtLeast(currentLevel, targetLevel)) {
      return { state: "verified", explicitMissing: false };
    }

    return { state: "needs-improvement", explicitMissing: false };
  }

  if (explicitMissing) {
    return { state: "missing", explicitMissing: true };
  }

  return { state: "unknown", explicitMissing: false };
}

function getGapSeverity(state, currentLevel, targetLevel) {
  if (state === "verified") {
    return "none";
  }

  if (state === "missing") {
    return "high";
  }

  if (state === "unknown") {
    return "unknown";
  }

  return getSkillLevelGap(currentLevel, targetLevel) === 1 ? "medium" : "high";
}

function getRecommendedAction(state) {
  return {
    verified: "skip",
    "needs-improvement": "improve",
    missing: "learn",
    unknown: "reassess",
  }[state];
}

function getReason(state, currentLevel, targetLevel, explicitMissing) {
  if (state === "verified") {
    return `Demonstrated ${currentLevel} level meets the ${targetLevel} target.`;
  }

  if (state === "needs-improvement") {
    return `Demonstrated ${currentLevel} level is below the ${targetLevel} target.`;
  }

  if (explicitMissing) {
    return "Discovery found no meaningful exposure to this skill.";
  }

  if (state === "missing") {
    return "Technical evaluation demonstrated no usable level for this skill.";
  }

  return "There is not enough successful assessment evidence to classify this skill.";
}

function createAssessmentEvidence(skillResult, successfulEvaluations) {
  return {
    profileEvidence: Array.isArray(skillResult?.evidence) ? [...skillResult.evidence] : [],
    discoveryStatus: skillResult?.discoveryStatus ?? "unknown",
    successfulEvaluations,
    evaluationScores: Array.isArray(skillResult?.evaluationScores)
      ? [...skillResult.evaluationScores]
      : [],
    lastEvaluationStatus: skillResult?.lastEvaluation?.evaluationStatus ?? null,
  };
}

export function buildVerifiedSkillMap(input) {
  if (!isPlainObject(input) || !isPlainObject(input.assessmentResult)) {
    throw new Error("Qualification input must contain an assessmentResult object.");
  }

  const role = resolveRole(input.role, input.assessmentResult);
  const assessmentSkills = getAssessmentSkillEntries(input.assessmentResult);
  const assessmentSkillsByName = new Map(
    assessmentSkills
      .filter((skill) => typeof skill?.name === "string")
      .map((skill) => [skill.name, skill]),
  );

  return role.requiredSkills
    .filter((skill) => skill.assessable !== false)
    .map((roleSkill) => {
      const skillResult = assessmentSkillsByName.get(roleSkill.name) ?? {};
      const successfulEvaluations = getSuccessfulEvaluationCount(skillResult);
      const currentLevel = getCurrentLevel(skillResult, successfulEvaluations);
      const targetLevel = normalizeSkillLevel(roleSkill.targetLevel) ?? "beginner";
      const classification = classifySkill(
        skillResult,
        currentLevel,
        targetLevel,
        successfulEvaluations,
      );

      return {
        name: roleSkill.name,
        roleWeight: roleSkill.weight,
        priority: roleSkill.priority,
        targetLevel,
        state: classification.state,
        currentLevel,
        confidence: deriveConfidence(
          skillResult,
          classification.state,
          successfulEvaluations,
          classification.explicitMissing,
        ),
        averageScore: Number.isFinite(skillResult.averageScore) ? skillResult.averageScore : null,
        claimed: Boolean(skillResult.claimed),
        discovered: Boolean(skillResult.discovered),
        assessmentEvidence: createAssessmentEvidence(skillResult, successfulEvaluations),
        gapSeverity: getGapSeverity(classification.state, currentLevel, targetLevel),
        recommendedAction: getRecommendedAction(classification.state),
        reason: getReason(
          classification.state,
          currentLevel,
          targetLevel,
          classification.explicitMissing,
        ),
      };
    });
}
