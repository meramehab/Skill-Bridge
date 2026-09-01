import { compareSkillPriority } from "../skills/skill-priority.js";

const ACTION_ORDER = {
  learn: 0,
  improve: 1,
  reassess: 2,
};

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function compareQualificationItems(a, b) {
  const actionDifference = ACTION_ORDER[a.action] - ACTION_ORDER[b.action];

  if (actionDifference !== 0) {
    return actionDifference;
  }

  const priorityDifference = compareSkillPriority(a, b);

  if (priorityDifference !== 0) {
    return priorityDifference;
  }

  if (a.roleWeight !== b.roleWeight) {
    return b.roleWeight - a.roleWeight;
  }

  return a.skill.localeCompare(b.skill);
}

function getReadinessState(items) {
  if (items.length === 0) {
    return "qualified";
  }

  if (items.every((item) => item.state === "needs-improvement" || item.state === "unknown")) {
    return "nearly-qualified";
  }

  return "needs-qualification";
}

export function buildQualificationPath(input) {
  if (!isPlainObject(input) || !isPlainObject(input.role) || !Array.isArray(input.skillMap)) {
    throw new Error("Qualification path input must contain a role and skillMap.");
  }

  const items = input.skillMap
    .filter((skill) => skill.recommendedAction !== "skip")
    .map((skill) => ({
      skill: skill.name,
      state: skill.state,
      action: skill.recommendedAction,
      priority: skill.priority,
      roleWeight: skill.roleWeight,
      currentLevel: skill.currentLevel,
      targetLevel: skill.targetLevel,
      gapSeverity: skill.gapSeverity,
      order: 0,
      reason: skill.reason,
    }))
    .sort(compareQualificationItems)
    .map((item, index) => ({
      ...item,
      order: index + 1,
    }));

  return {
    role: {
      id: input.role.id,
      name: input.role.name,
      description: input.role.description,
    },
    summary: {
      totalRequiredSkills: input.skillMap.length,
      verifiedCount: input.skillMap.filter((skill) => skill.state === "verified").length,
      improvementCount: input.skillMap.filter((skill) => skill.state === "needs-improvement").length,
      missingCount: input.skillMap.filter((skill) => skill.state === "missing").length,
      unknownCount: input.skillMap.filter((skill) => skill.state === "unknown").length,
      activeQualificationItems: items.length,
    },
    items,
    readinessState: getReadinessState(items),
  };
}
