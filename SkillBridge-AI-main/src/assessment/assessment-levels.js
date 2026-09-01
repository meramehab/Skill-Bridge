export const ASSESSMENT_DIFFICULTIES = ["awareness", "beginner", "intermediate", "advanced"];
export const VERIFIED_LEVELS = ["none", "basic", "intermediate", "strong"];

export function getNextDifficulty(current) {
  const index = ASSESSMENT_DIFFICULTIES.indexOf(current);

  if (index === -1 || index === ASSESSMENT_DIFFICULTIES.length - 1) {
    return current;
  }

  return ASSESSMENT_DIFFICULTIES[index + 1];
}

export function getPreviousDifficulty(current) {
  const index = ASSESSMENT_DIFFICULTIES.indexOf(current);

  if (index <= 0) {
    return current;
  }

  return ASSESSMENT_DIFFICULTIES[index - 1];
}

export function scoreToDemonstratedLevel(score) {
  if (score <= 24) {
    return "none";
  }

  if (score <= 49) {
    return "basic";
  }

  if (score <= 74) {
    return "intermediate";
  }

  return "strong";
}
