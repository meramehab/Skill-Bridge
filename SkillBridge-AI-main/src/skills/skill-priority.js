const PRIORITY_ORDER = {
  high: 0,
  medium: 1,
  low: 2,
};

export function compareSkillPriority(a, b) {
  return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
}
