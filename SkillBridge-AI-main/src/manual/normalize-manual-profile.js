function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function trimString(value, fieldName) {
  if (typeof value !== "string") {
    throw new Error(`${fieldName} must be a string.`);
  }

  return value.trim();
}

function trimOptionalString(value, fieldName) {
  if (value === undefined || value === null) {
    return null;
  }

  const cleanedValue = trimString(value, fieldName);

  return cleanedValue === "" ? null : cleanedValue;
}

function ensureArray(value, fieldName) {
  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array.`);
  }

  return value;
}

function normalizePersonalInfo(personalInfo) {
  if (personalInfo === undefined) {
    return {
      name: null,
      email: null,
      phone: null,
      location: null,
    };
  }

  if (!isPlainObject(personalInfo)) {
    throw new Error("personalInfo must be an object.");
  }

  return {
    name: trimOptionalString(personalInfo.name, "personalInfo.name"),
    email: trimOptionalString(personalInfo.email, "personalInfo.email"),
    phone: trimOptionalString(personalInfo.phone, "personalInfo.phone"),
    location: trimOptionalString(personalInfo.location, "personalInfo.location"),
  };
}

function normalizeSkills(skills) {
  const inputSkills = ensureArray(skills, "skills");
  const seenSkills = new Set();
  const cleanedSkills = [];

  for (const skill of inputSkills) {
    const cleanedSkill = trimString(skill, "skills item");

    if (!cleanedSkill) {
      continue;
    }

    const skillKey = cleanedSkill.toLowerCase();

    if (seenSkills.has(skillKey)) {
      continue;
    }

    seenSkills.add(skillKey);
    cleanedSkills.push(cleanedSkill);
  }

  return cleanedSkills;
}

function normalizeEducation(education) {
  return ensureArray(education, "education").map((entry, index) => {
    if (!isPlainObject(entry)) {
      throw new Error(`education[${index}] must be an object.`);
    }

    return {
      institution: trimString(entry.institution, `education[${index}].institution`),
      degree: trimOptionalString(entry.degree, `education[${index}].degree`),
      field: trimOptionalString(entry.field, `education[${index}].field`),
      startDate: trimOptionalString(entry.startDate, `education[${index}].startDate`),
      endDate: trimOptionalString(entry.endDate, `education[${index}].endDate`),
    };
  });
}

function normalizeExperience(experience) {
  return ensureArray(experience, "experience").map((entry, index) => {
    if (!isPlainObject(entry)) {
      throw new Error(`experience[${index}] must be an object.`);
    }

    return {
      company: trimString(entry.company, `experience[${index}].company`),
      role: trimString(entry.role, `experience[${index}].role`),
      startDate: trimOptionalString(entry.startDate, `experience[${index}].startDate`),
      endDate: trimOptionalString(entry.endDate, `experience[${index}].endDate`),
      description: trimOptionalString(entry.description, `experience[${index}].description`),
    };
  });
}

function normalizeTechnologies(technologies, index) {
  return ensureArray(technologies, `projects[${index}].technologies`)
    .map((technology) => trimString(technology, `projects[${index}].technologies item`))
    .filter(Boolean);
}

function normalizeProjects(projects) {
  return ensureArray(projects, "projects").map((entry, index) => {
    if (!isPlainObject(entry)) {
      throw new Error(`projects[${index}] must be an object.`);
    }

    return {
      name: trimString(entry.name, `projects[${index}].name`),
      description: trimOptionalString(entry.description, `projects[${index}].description`),
      technologies: normalizeTechnologies(entry.technologies, index),
    };
  });
}

export function normalizeManualProfile(input) {
  if (!isPlainObject(input)) {
    throw new Error("Manual profile input must be an object.");
  }

  return {
    personalInfo: normalizePersonalInfo(input.personalInfo),
    skills: normalizeSkills(input.skills),
    education: normalizeEducation(input.education),
    experience: normalizeExperience(input.experience),
    projects: normalizeProjects(input.projects),
    suggestedRoles: [],
    summary: "",
    profileSource: "manual",
  };
}
