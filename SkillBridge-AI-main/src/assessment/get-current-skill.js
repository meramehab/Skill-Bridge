export function getCurrentSkill(session) {
  if (typeof session !== "object" || session === null || Array.isArray(session)) {
    throw new Error("Assessment session must be an object.");
  }

  for (let index = session.currentSkillIndex; index < session.skillStates.length; index += 1) {
    const skillState = session.skillStates[index];

    if (!["verified", "missing"].includes(skillState.status)) {
      return skillState;
    }
  }

  return null;
}
