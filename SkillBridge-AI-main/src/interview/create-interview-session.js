import { randomUUID } from "node:crypto";
import { getRoleById, getRoleByName } from "../roles/get-role.js";
import { selectInterviewSkills } from "./select-interview-skills.js";

function resolveRole(targetRole) {
  try {
    return getRoleById(targetRole);
  } catch {
    return getRoleByName(targetRole);
  }
}

export function createInterviewSession(options) {
  if (typeof options !== "object" || options === null || Array.isArray(options)) {
    throw new Error("Interview session options must be an object.");
  }

  if (typeof options.targetRole !== "string" || options.targetRole.trim() === "") {
    throw new Error("Target role is required.");
  }

  if (typeof options.profile !== "object" || options.profile === null || Array.isArray(options.profile)) {
    throw new Error("Profile is required.");
  }

  const role = resolveRole(options.targetRole.trim());
  const selection = selectInterviewSkills(options.profile, role, {
    maxSkills: options.maxSkills,
  });
  const sanitizedSelectedSkills = selection.selectedSkills.map((skill) => ({
    name: skill.name,
    weight: skill.weight,
    priority: skill.priority,
    evidence: [...skill.evidence],
  }));

  return {
    sessionId: randomUUID(),
    status: sanitizedSelectedSkills.length > 0 ? "ready" : "no-claimed-skills",
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
    profileMatchScore: selection.profileMatchScore,
    selectedSkills: sanitizedSelectedSkills,
    currentSkillIndex: 0,
    questions: [],
    answers: [],
    evaluations: [],
    createdAt: new Date().toISOString(),
  };
}
