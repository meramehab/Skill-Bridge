const SKILL_LEVEL_ORDER = {
  none: 0,
  awareness: 1,
  basic: 2,
  beginner: 3,
  intermediate: 4,
  strong: 5,
  advanced: 6,
};

const LEVEL_ALIASES = {
  "not-demonstrated": "none",
};

export const COMPARABLE_SKILL_LEVELS = Object.keys(SKILL_LEVEL_ORDER);

export function normalizeSkillLevel(level) {
  if (typeof level !== "string" || level.trim() === "") {
    return null;
  }

  const normalizedLevel = level.trim().toLowerCase();
  const comparableLevel = LEVEL_ALIASES[normalizedLevel] ?? normalizedLevel;

  return Object.hasOwn(SKILL_LEVEL_ORDER, comparableLevel) ? comparableLevel : null;
}

export function isLevelAtLeast(currentLevel, targetLevel) {
  const normalizedCurrent = normalizeSkillLevel(currentLevel);
  const normalizedTarget = normalizeSkillLevel(targetLevel);

  if (!normalizedCurrent || !normalizedTarget) {
    return false;
  }

  return SKILL_LEVEL_ORDER[normalizedCurrent] >= SKILL_LEVEL_ORDER[normalizedTarget];
}

export function getSkillLevelGap(currentLevel, targetLevel) {
  const normalizedCurrent = normalizeSkillLevel(currentLevel);
  const normalizedTarget = normalizeSkillLevel(targetLevel);

  if (!normalizedCurrent || !normalizedTarget) {
    return null;
  }

  return Math.max(0, SKILL_LEVEL_ORDER[normalizedTarget] - SKILL_LEVEL_ORDER[normalizedCurrent]);
}
