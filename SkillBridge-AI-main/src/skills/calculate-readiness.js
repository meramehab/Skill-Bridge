import { extractProfileEvidence } from "./extract-profile-evidence.js";
import { findCanonicalSkill, skillTextContainsAlias } from "./normalize-skill-name.js";
import { getProfileReadinessLevel } from "./readiness-levels.js";

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function collectSkillEvidence(requiredSkill, evidence) {
  const matchedEvidence = new Set();
  const skillLookupRole = { requiredSkills: [requiredSkill], optionalSkills: [] };

  for (const [profileSkill, evidenceEntries] of Object.entries(evidence.skillEvidence)) {
    if (findCanonicalSkill(profileSkill, skillLookupRole) === requiredSkill.name) {
      for (const entry of evidenceEntries) {
        matchedEvidence.add(entry);
      }
    }
  }

  for (const project of evidence.projectText) {
    if ([requiredSkill.name, ...(requiredSkill.aliases ?? [])].some((alias) => skillTextContainsAlias(project.text, alias))) {
      matchedEvidence.add(`Used in project: ${project.name}`);
    }
  }

  for (const experience of evidence.experienceText) {
    if ([requiredSkill.name, ...(requiredSkill.aliases ?? [])].some((alias) => skillTextContainsAlias(experience.text, alias))) {
      matchedEvidence.add(`Mentioned in experience at ${experience.company}`);
    }
  }

  for (const educationField of evidence.educationText) {
    if ([requiredSkill.name, ...(requiredSkill.aliases ?? [])].some((alias) => skillTextContainsAlias(educationField, alias))) {
      matchedEvidence.add(`Related education field: ${educationField}`);
    }
  }

  return [...matchedEvidence];
}

export function calculateReadiness(profile, role) {
  if (!isPlainObject(profile)) {
    throw new Error("Profile must be an object.");
  }

  if (!isPlainObject(role) || !Array.isArray(role.requiredSkills)) {
    throw new Error("Role must be a valid role object.");
  }

  const evidence = extractProfileEvidence(profile);
  const matchedSkills = [];
  const missingSkills = [];
  const optionalSkillsFound = [];
  let readinessScore = 0;

  for (const requiredSkill of role.requiredSkills) {
    const skillEvidence = collectSkillEvidence(requiredSkill, evidence);

    if (skillEvidence.length > 0) {
      readinessScore += requiredSkill.weight;
      matchedSkills.push({
        name: requiredSkill.name,
        weight: requiredSkill.weight,
        priority: requiredSkill.priority,
        status: "matched",
        evidence: skillEvidence,
      });
    } else {
      missingSkills.push({
        name: requiredSkill.name,
        weight: requiredSkill.weight,
        priority: requiredSkill.priority,
        status: "missing",
      });
    }
  }

  for (const optionalSkill of role.optionalSkills ?? []) {
    const skillEvidence = collectSkillEvidence(
      {
        ...optionalSkill,
        weight: 0,
        priority: "low",
      },
      evidence,
    );

    if (skillEvidence.length > 0) {
      optionalSkillsFound.push(optionalSkill.name);
    }
  }

  const safeScore = Math.max(0, Math.min(100, Math.round(readinessScore)));

  return {
    role: {
      id: role.id,
      name: role.name,
      description: role.description,
    },
    matchedSkills,
    missingSkills,
    optionalSkillsFound,
    readinessScore: safeScore,
    readinessLevel: getProfileReadinessLevel(safeScore),
  };
}
