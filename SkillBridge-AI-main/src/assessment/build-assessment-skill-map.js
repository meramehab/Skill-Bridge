import { calculateReadiness } from "../skills/calculate-readiness.js";
import { compareSkillPriority } from "../skills/skill-priority.js";
import { createSkillState } from "./create-skill-state.js";

function deriveEvidenceSources(evidence) {
  const sources = new Set();

  for (const entry of evidence) {
    if (entry === "Listed in skills") {
      sources.add("skills");
    } else if (entry.startsWith("Used in project:")) {
      sources.add("projects");
    } else if (entry.startsWith("Mentioned in experience at")) {
      sources.add("experience");
    } else if (entry.startsWith("Related education field:")) {
      sources.add("education");
    }
  }

  return [...sources];
}

function compareSkillStates(a, b) {
  const priorityDifference = compareSkillPriority(a, b);

  if (priorityDifference !== 0) {
    return priorityDifference;
  }

  return b.roleWeight - a.roleWeight;
}

export function buildAssessmentSkillMap(profile, role) {
  const readinessResult = calculateReadiness(profile, role);
  const matchedSkillsByName = new Map(readinessResult.matchedSkills.map((skill) => [skill.name, skill]));

  return role.requiredSkills
    .map((requiredSkill) => {
      const matchedSkill = matchedSkillsByName.get(requiredSkill.name);

      if (matchedSkill) {
        return createSkillState(
          {
            name: requiredSkill.name,
            weight: requiredSkill.weight,
            priority: requiredSkill.priority,
            evidence: matchedSkill.evidence,
          },
          {
            claimed: true,
            discovered: false,
            source: deriveEvidenceSources(matchedSkill.evidence),
          },
        );
      }

      return createSkillState(
        {
          name: requiredSkill.name,
          weight: requiredSkill.weight,
          priority: requiredSkill.priority,
          evidence: [],
        },
        {
          claimed: false,
          discovered: false,
          source: [],
        },
      );
    })
    .sort(compareSkillStates);
}
