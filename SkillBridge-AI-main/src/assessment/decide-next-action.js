export function decideNextAssessmentAction(skillState, evaluation, options = {}) {
  const config = {
    minQuestionsPerSkill: 1,
    maxQuestionsPerSkill: 3,
    strongThreshold: 75,
    weakThreshold: 25,
    ...options,
  };

  if (evaluation?.evaluationStatus === "unavailable") {
    return { action: "move_to_next_skill" };
  }

  if (skillState.questionsAsked >= config.maxQuestionsPerSkill) {
    if (skillState.successfulEvaluations > 0) {
      return { action: "verify_skill" };
    }

    return { action: "move_to_next_skill" };
  }

  const score = evaluation.score;

  if (score >= config.strongThreshold) {
    return { action: "increase_difficulty" };
  }

  if (score >= 50) {
    if (skillState.questionsAsked < config.minQuestionsPerSkill) {
      return { action: "ask_follow_up" };
    }

    return { action: "verify_skill" };
  }

  if (score >= config.weakThreshold) {
    if (!["awareness", "beginner"].includes(skillState.currentDifficulty)) {
      return { action: "decrease_difficulty" };
    }

    return { action: "ask_follow_up" };
  }

  if (skillState.questionsAsked === 1 && skillState.questionsAsked < config.maxQuestionsPerSkill) {
    return { action: "ask_follow_up" };
  }

  return { action: "verify_skill" };
}
