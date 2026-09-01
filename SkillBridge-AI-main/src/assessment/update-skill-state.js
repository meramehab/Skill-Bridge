import { scoreToDemonstratedLevel } from "./assessment-levels.js";

function appendUniqueSource(source, value) {
  const nextSource = Array.isArray(source) ? [...source] : [];

  if (value && !nextSource.includes(value)) {
    nextSource.push(value);
  }

  return nextSource;
}

function calculateAverageScore(scores) {
  if (scores.length === 0) {
    return null;
  }

  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}

function getConfidence(successfulEvaluations) {
  if (successfulEvaluations >= 3) {
    return 0.9;
  }

  if (successfulEvaluations === 2) {
    return 0.75;
  }

  if (successfulEvaluations === 1) {
    return 0.55;
  }

  return 0;
}

export function updateSkillState(skillState, event) {
  if (typeof skillState !== "object" || skillState === null || Array.isArray(skillState)) {
    throw new Error("Skill state must be an object.");
  }

  if (typeof event !== "object" || event === null || Array.isArray(event) || typeof event.type !== "string") {
    throw new Error("Skill state event must be an object with a type.");
  }

  const nextState = {
    ...skillState,
    evidence: [...skillState.evidence],
    source: Array.isArray(skillState.source) ? [...skillState.source] : [],
    evaluationScores: [...skillState.evaluationScores],
  };

  if (event.type === "discovery_evaluated") {
    nextState.lastEvaluation = event.evaluation;

    if (event.evaluation.exposure === "none" || event.evaluation.exposure === "heard-of") {
      nextState.discoveryStatus = "no-usable-exposure";
      nextState.status = "missing";
      return nextState;
    }

    nextState.discovered = true;
    nextState.discoveryStatus = "discovered";
    nextState.status = "pending-verification";
    nextState.currentDifficulty = "beginner";
    nextState.source = appendUniqueSource(nextState.source, "Discovered during assessment");
    return nextState;
  }

  if (event.type === "technical_evaluated") {
    nextState.questionsAsked += 1;
    nextState.lastEvaluation = event.evaluation;

    if (event.evaluation.evaluationStatus === "ai") {
      nextState.successfulEvaluations += 1;
      nextState.evaluationScores.push(event.evaluation.score);
      nextState.averageScore = calculateAverageScore(nextState.evaluationScores);
      nextState.estimatedLevel = scoreToDemonstratedLevel(event.evaluation.score);
    }

    return nextState;
  }

  if (event.type === "difficulty_changed") {
    nextState.currentDifficulty = event.difficulty;
    return nextState;
  }

  if (event.type === "skill_verified") {
    if (nextState.successfulEvaluations === 0 || nextState.averageScore === null) {
      return nextState;
    }

    nextState.status = "verified";
    nextState.verifiedLevel = scoreToDemonstratedLevel(nextState.averageScore);
    nextState.confidence = getConfidence(nextState.successfulEvaluations);
    return nextState;
  }

  if (event.type === "skill_marked_missing") {
    nextState.status = "missing";
    nextState.verifiedLevel = "none";
    nextState.confidence = 1;
    return nextState;
  }

  if (event.type === "evaluation_unavailable") {
    nextState.lastEvaluation = event.evaluation;
    return nextState;
  }

  throw new Error(`Unsupported skill state event type: ${event.type}`);
}
