function normalizeSource(source) {
  if (Array.isArray(source)) {
    return [...new Set(source.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim()))];
  }

  if (typeof source === "string" && source.trim()) {
    return [source.trim()];
  }

  return [];
}

export function createSkillState(skill, options = {}) {
  if (typeof skill !== "object" || skill === null || Array.isArray(skill)) {
    throw new Error("Skill state input must be an object.");
  }

  const claimed = Boolean(options.claimed);
  const discovered = Boolean(options.discovered);

  return {
    name: skill.name,
    roleWeight: skill.weight,
    priority: skill.priority,
    evidence: Array.isArray(skill.evidence) ? [...skill.evidence] : [],
    source: normalizeSource(options.source),
    claimed,
    discovered,
    status: claimed ? "pending-verification" : "pending-discovery",
    currentDifficulty: claimed ? "beginner" : "awareness",
    estimatedLevel: null,
    verifiedLevel: null,
    confidence: 0,
    questionsAsked: 0,
    successfulEvaluations: 0,
    evaluationScores: [],
    averageScore: null,
    lastEvaluation: null,
    discoveryStatus: claimed ? "not-needed" : "unknown",
  };
}
