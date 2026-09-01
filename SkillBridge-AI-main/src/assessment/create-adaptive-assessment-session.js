import { randomUUID } from "node:crypto";
import { calculateReadiness } from "../skills/calculate-readiness.js";
import { getRoleById, getRoleByName } from "../roles/get-role.js";
import { buildAssessmentSkillMap } from "./build-assessment-skill-map.js";

function resolveRole(targetRole) {
  try {
    return getRoleById(targetRole);
  } catch {
    return getRoleByName(targetRole);
  }
}

function createProfileContext(profile) {
  return {
    summary: typeof profile.summary === "string" ? profile.summary : "",
    projectNames: (profile.projects ?? []).map((project) => project.name).filter(Boolean),
    education: (profile.education ?? []).map((item) => ({
      institution: item.institution,
      degree: item.degree,
      field: item.field,
    })),
    knownSkills: Array.isArray(profile.skills) ? [...profile.skills] : [],
  };
}

export function createAdaptiveAssessmentSession(options) {
  if (typeof options !== "object" || options === null || Array.isArray(options)) {
    throw new Error("Adaptive assessment options must be an object.");
  }

  if (typeof options.targetRole !== "string" || options.targetRole.trim() === "") {
    throw new Error("Target role is required.");
  }

  if (typeof options.profile !== "object" || options.profile === null || Array.isArray(options.profile)) {
    throw new Error("Profile is required.");
  }

  const role = resolveRole(options.targetRole.trim());
  const config = {
    minQuestionsPerSkill: 1,
    maxQuestionsPerSkill: 3,
    ...(options.config ?? {}),
  };
  const readinessResult = calculateReadiness(options.profile, role);

  return {
    sessionId: randomUUID(),
    status: "active",
    phase: "assessment",
    role: {
      id: role.id,
      name: role.name,
      description: role.description,
      requiredSkills: role.requiredSkills.map((skill) => ({
        name: skill.name,
        weight: skill.weight,
        priority: skill.priority,
      })),
    },
    profileMatchScore: readinessResult.readinessScore,
    skillStates: buildAssessmentSkillMap(options.profile, role),
    currentSkillIndex: 0,
    currentQuestion: null,
    questions: [],
    evaluations: [],
    messages: [],
    completedSkillNames: [],
    config,
    profileContext: createProfileContext(options.profile),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
