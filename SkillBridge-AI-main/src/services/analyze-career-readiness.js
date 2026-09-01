import { generateLearningPriorities } from "../ai/generate-learning-priorities.js";
import { getRoleById, getRoleByName } from "../roles/get-role.js";
import { calculateReadiness } from "../skills/calculate-readiness.js";
import { compareSkillPriority } from "../skills/skill-priority.js";
import { isTemporaryAIError } from "../utils/ai-errors.js";

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function createFallbackNextSteps(missingSkills) {
  return [...missingSkills]
    .sort(compareSkillPriority)
    .slice(0, 5)
    .map((skill) => ({
      title: `Strengthen ${skill.name}`,
      skill: skill.name,
      reason: `${skill.name} is still missing for this target role.`,
      action: `Learn the fundamentals of ${skill.name} and apply it in a small project.`,
      priority: skill.priority,
    }));
}

function resolveRole(targetRole) {
  try {
    return getRoleById(targetRole);
  } catch {
    return getRoleByName(targetRole);
  }
}

export async function analyzeCareerReadiness(options) {
  if (!isPlainObject(options)) {
    throw new Error("Career readiness options must be an object.");
  }

  if (!isPlainObject(options.profile)) {
    throw new Error("Profile is required.");
  }

  if (typeof options.targetRole !== "string" || options.targetRole.trim() === "") {
    throw new Error("Target role is required.");
  }

  const role = resolveRole(options.targetRole.trim());
  const readinessResult = calculateReadiness(options.profile, role);

  try {
    const learningPriorities = await generateLearningPriorities(options.profile, readinessResult);

    return {
      ...readinessResult,
      overview: learningPriorities.overview,
      nextSteps: learningPriorities.nextSteps,
      enrichmentStatus: "ai",
    };
  } catch (error) {
    if (!isTemporaryAIError(error)) {
      throw error;
    }

    return {
      ...readinessResult,
      overview: "",
      nextSteps: createFallbackNextSteps(readinessResult.missingSkills),
      enrichmentStatus: "fallback",
    };
  }
}
