import { calculateReadiness } from "../skills/calculate-readiness.js";
import { compareSkillPriority } from "../skills/skill-priority.js";

function getMaxSkills(options) {
  if (options?.maxSkills === undefined) {
    return 3;
  }

  if (!Number.isInteger(options.maxSkills) || options.maxSkills < 1 || options.maxSkills > 5) {
    throw new Error("maxSkills must be an integer between 1 and 5.");
  }

  return options.maxSkills;
}

function compareSelectedSkills(a, b) {
  const priorityDifference = compareSkillPriority(a, b);

  if (priorityDifference !== 0) {
    return priorityDifference;
  }

  return b.weight - a.weight;
}

export function selectInterviewSkills(profile, role, options = {}) {
  const readinessResult = calculateReadiness(profile, role);
  const maxSkills = getMaxSkills(options);
  const selectedSkills = [...readinessResult.matchedSkills]
    .sort(compareSelectedSkills)
    .slice(0, maxSkills)
    .map((skill) => ({
      name: skill.name,
      weight: skill.weight,
      priority: skill.priority,
      evidence: [...skill.evidence],
    }));

  return {
    profileMatchScore: readinessResult.readinessScore,
    selectedSkills,
  };
}
