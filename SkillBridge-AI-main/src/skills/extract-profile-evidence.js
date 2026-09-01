import { normalizeSkillName } from "./normalize-skill-name.js";

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function addEvidence(skillEvidence, skillName, evidenceText) {
  const cleanedSkillName = normalizeSkillName(skillName);

  if (!cleanedSkillName || !evidenceText) {
    return;
  }

  if (!skillEvidence[cleanedSkillName]) {
    skillEvidence[cleanedSkillName] = new Set();
  }

  skillEvidence[cleanedSkillName].add(evidenceText);
}

export function extractProfileEvidence(profile) {
  if (!isPlainObject(profile)) {
    throw new Error("Profile must be an object.");
  }

  const skillEvidence = {};
  const projectText = [];
  const experienceText = [];
  const educationText = [];

  for (const skill of profile.skills ?? []) {
    addEvidence(skillEvidence, skill, "Listed in skills");
  }

  for (const project of profile.projects ?? []) {
    const projectName = typeof project.name === "string" && project.name.trim() ? project.name.trim() : "Untitled Project";
    projectText.push({
      name: projectName,
      text: [project.name, project.description].filter(Boolean).join(" "),
    });

    for (const technology of project.technologies ?? []) {
      addEvidence(skillEvidence, technology, `Used in project: ${projectName}`);
    }
  }

  for (const experience of profile.experience ?? []) {
    const companyName =
      typeof experience.company === "string" && experience.company.trim()
        ? experience.company.trim()
        : "experience entry";

    experienceText.push({
      company: companyName,
      text: [experience.role, experience.description].filter(Boolean).join(" "),
    });
  }

  for (const education of profile.education ?? []) {
    if (typeof education.field === "string" && education.field.trim()) {
      educationText.push(education.field.trim());
    }
  }

  return {
    skillEvidence: Object.fromEntries(
      Object.entries(skillEvidence).map(([skill, evidenceSet]) => [skill, [...evidenceSet]]),
    ),
    projectText,
    experienceText,
    educationText,
  };
}
