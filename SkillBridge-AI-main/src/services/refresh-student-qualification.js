import { buildQualificationPath } from "../qualification/build-qualification-path.js";

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function refreshStudentQualification(input) {
  if (
    !isPlainObject(input) ||
    !isPlainObject(input.role) ||
    !isPlainObject(input.previousQualification) ||
    !Array.isArray(input.updatedSkillMap)
  ) {
    throw new Error("Qualification refresh requires a role, previousQualification, and updatedSkillMap.");
  }

  const skillMap = structuredClone(input.updatedSkillMap);
  const qualificationPath = buildQualificationPath({
    role: input.role,
    skillMap,
  });

  return {
    ...structuredClone(input.previousQualification),
    role: {
      id: input.role.id,
      name: input.role.name,
      description: input.role.description,
    },
    skillMap,
    qualificationPath,
  };
}
