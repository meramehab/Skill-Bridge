import { learningResourceCatalog } from "../data/learning-resource-catalog.js";
import { isLevelAtLeast, normalizeSkillLevel } from "../qualification/skill-levels.js";

const RESOURCE_LEVEL_ORDER = {
  awareness: 0,
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function sortResources(resources) {
  return [...resources].sort((a, b) => {
    const levelDifference = RESOURCE_LEVEL_ORDER[a.level] - RESOURCE_LEVEL_ORDER[b.level];
    return levelDifference || a.id.localeCompare(b.id);
  });
}

function selectResources(item) {
  if (item.action === "reassess") {
    return [];
  }

  const skillResources = learningResourceCatalog.filter((resource) => resource.skill === item.skill);
  const targetLevel = normalizeSkillLevel(item.targetLevel);
  const currentLevel = normalizeSkillLevel(item.currentLevel);
  let matchingResources = skillResources.filter(
    (resource) => targetLevel && isLevelAtLeast(targetLevel, resource.level),
  );

  if (item.action === "improve" && currentLevel) {
    matchingResources = matchingResources.filter(
      (resource) =>
        isLevelAtLeast(resource.level, currentLevel) &&
        normalizeSkillLevel(resource.level) !== currentLevel,
    );
  }

  if (matchingResources.length === 0) {
    matchingResources = skillResources.filter((resource) => resource.level === item.targetLevel);
  }

  if (matchingResources.length === 0) {
    matchingResources = skillResources.slice(0, 1);
  }

  return sortResources(matchingResources).map((resource) => resource.id);
}

export function buildLearningPlan(input) {
  if (
    !isPlainObject(input) ||
    !isPlainObject(input.qualificationPath) ||
    !Array.isArray(input.qualificationPath.items) ||
    !isPlainObject(input.role)
  ) {
    throw new Error("Learning plan input must contain a qualificationPath and role.");
  }

  const activeItems = input.qualificationPath.items.filter((item) => item.action !== "skip");
  const steps = activeItems.map((item, index) => ({
    id: `learning-${input.role.id}-${slugify(item.skill)}-${index + 1}`,
    skill: item.skill,
    type: item.action === "reassess" ? "reassessment" : "learning",
    action: item.action,
    targetLevel: item.targetLevel,
    resourceIds: selectResources(item),
    status: "not-started",
    progressPercent: 0,
    assessmentRequired: true,
    order: index + 1,
  }));

  return {
    role: {
      id: input.role.id,
      name: input.role.name,
      description: input.role.description,
    },
    status: steps.length === 0 ? "completed" : "not-started",
    steps,
  };
}
