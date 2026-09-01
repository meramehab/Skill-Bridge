import { buildQualificationPath } from "../qualification/build-qualification-path.js";
import { buildVerifiedSkillMap } from "../qualification/build-verified-skill-map.js";
import { getRoleById, getRoleByName } from "../roles/get-role.js";

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function resolveProductionRole(targetRole, assessmentResult) {
  const roleReference = targetRole ?? assessmentResult.role;
  const roleId = typeof roleReference === "string" ? roleReference : roleReference?.id;
  const roleName = typeof roleReference === "string" ? roleReference : roleReference?.name;

  if (roleId) {
    try {
      return getRoleById(roleId);
    } catch {
      // Continue with name lookup when the supplied string is a role name.
    }
  }

  if (roleName) {
    return getRoleByName(roleName);
  }

  throw new Error("A target production role is required.");
}

export function buildStudentQualification(input) {
  if (!isPlainObject(input) || !isPlainObject(input.assessmentResult)) {
    throw new Error("Student qualification input must contain an assessmentResult object.");
  }

  const role = resolveProductionRole(input.targetRole, input.assessmentResult);
  const skillMap = buildVerifiedSkillMap({
    assessmentResult: input.assessmentResult,
    role,
  });
  const qualificationPath = buildQualificationPath({ role, skillMap });

  return {
    role: {
      id: role.id,
      name: role.name,
      description: role.description,
    },
    profileMatchScore: input.assessmentResult.profileMatchScore ?? null,
    verifiedReadinessScore: input.assessmentResult.verifiedReadinessScore ?? null,
    verificationCoverage: input.assessmentResult.verificationCoverage ?? null,
    skillMap,
    qualificationPath,
  };
}
