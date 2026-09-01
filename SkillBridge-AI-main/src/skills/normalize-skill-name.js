function cleanSkillText(skillName) {
  return String(skillName)
    .replace(/\bC\s*\+\+\b/gi, "C Plus Plus")
    .replace(/\bC\s*#\b/gi, "C Sharp")
    .replace(/\bNode\s*\.?\s*JS\b/gi, "Node JS")
    .replace(/\bReact\s*\.?\s*JS\b/gi, "React")
    .replace(/\bPower\s*BI\b/gi, "Power BI")
    .replace(/\bPostgres\b/gi, "PostgreSQL")
    .trim()
    .replace(/[._/\\()-]+/g, " ")
    .replace(/\s+/g, " ");
}

function createComparisonKey(value) {
  return cleanSkillText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

export function normalizeSkillName(skillName) {
  if (typeof skillName !== "string") {
    return "";
  }

  return cleanSkillText(skillName);
}

export function findCanonicalSkill(skillName, role) {
  const cleanedSkillName = normalizeSkillName(skillName);

  if (!cleanedSkillName || !role) {
    return cleanedSkillName;
  }

  const allRoleSkills = [...(role.requiredSkills ?? []), ...(role.optionalSkills ?? [])];
  const targetKey = createComparisonKey(cleanedSkillName);

  for (const roleSkill of allRoleSkills) {
    const aliases = [roleSkill.name, ...(roleSkill.aliases ?? [])];

    for (const alias of aliases) {
      if (createComparisonKey(alias) === targetKey) {
        return roleSkill.name;
      }
    }
  }

  return cleanedSkillName;
}

export function skillTextContainsAlias(text, alias) {
  const normalizedText = normalizeSkillName(text).toLowerCase();
  const normalizedAlias = normalizeSkillName(alias).toLowerCase();

  if (!normalizedText || !normalizedAlias) {
    return false;
  }

  const textTokens = normalizedText.split(" ");
  const compactText = normalizedText.replace(/\s+/g, "");
  const compactAlias = normalizedAlias.replace(/\s+/g, "");

  if (normalizedAlias.includes(" ")) {
    return normalizedText.includes(normalizedAlias) || compactText.includes(compactAlias);
  }

  if (compactAlias.length <= 3) {
    return textTokens.includes(compactAlias);
  }

  return textTokens.includes(normalizedAlias) || compactText.includes(compactAlias);
}
