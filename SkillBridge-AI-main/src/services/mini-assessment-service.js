import { scoreToDemonstratedLevel } from "../assessment/assessment-levels.js";
import { createMiniAssessment } from "../learning/create-mini-assessment.js";
import { isLevelAtLeast } from "../qualification/skill-levels.js";
import { isTemporaryAIError } from "../utils/ai-errors.js";

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function loadDefaultDependencies() {
  const [{ generateInterviewQuestion }, { evaluateInterviewAnswer }] = await Promise.all([
    import("../ai/generate-interview-question.js"),
    import("../ai/evaluate-interview-answer.js"),
  ]);

  return { generateInterviewQuestion, evaluateInterviewAnswer };
}

function cloneAssessment(assessment) {
  return structuredClone(assessment);
}

function getUnansweredQuestion(assessment) {
  return assessment.questions.find(
    (question) => !assessment.answers.some((answer) => answer.questionId === question.questionId),
  ) ?? null;
}

function getQuestionDifficulty(targetLevel) {
  return targetLevel === "awareness" ? "beginner" : targetLevel;
}

function createFallbackQuestion(assessment) {
  const questionNumber = assessment.questions.length + 1;
  const skillId = assessment.skill.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return {
    questionId: `mini-${skillId}-${questionNumber}`,
    skill: assessment.skill,
    difficulty: getQuestionDifficulty(assessment.targetLevel),
    question: `Describe how you would apply ${assessment.skill} in a small practical task and explain your key decisions.`,
    expectedConcepts: [],
    followUpHint: "Ask for one concrete example and the reasoning behind it.",
    questionSource: "fallback",
  };
}

function getConfidence(successfulEvaluationCount) {
  if (successfulEvaluationCount >= 3) {
    return 0.9;
  }

  if (successfulEvaluationCount === 2) {
    return 0.75;
  }

  if (successfulEvaluationCount === 1) {
    return 0.55;
  }

  return 0;
}

export function startMiniAssessment(input) {
  return createMiniAssessment(input);
}

export async function getNextMiniAssessmentQuestion(assessment, dependencies) {
  if (!isPlainObject(assessment) || !Array.isArray(assessment.questions)) {
    throw new Error("Mini assessment must be a valid assessment object.");
  }

  const unansweredQuestion = getUnansweredQuestion(assessment);

  if (unansweredQuestion) {
    return { assessment, question: unansweredQuestion };
  }

  if (assessment.questions.length >= assessment.questionLimit) {
    return null;
  }

  const resolvedDependencies = dependencies ?? (await loadDefaultDependencies());
  let question;

  try {
    question = await resolvedDependencies.generateInterviewQuestion({
      targetRole: assessment.role,
      skill: assessment.skill,
      previousQuestionIds: assessment.questions.map((item) => item.questionId),
      previousQuestionTexts: assessment.questions.map((item) => item.question),
      questionNumber: assessment.questions.length + 1,
      currentDifficulty: getQuestionDifficulty(assessment.targetLevel),
    });
  } catch (error) {
    if (!isTemporaryAIError(error)) {
      throw error;
    }

    question = createFallbackQuestion(assessment);
  }

  const nextAssessment = cloneAssessment(assessment);
  nextAssessment.questions.push({ ...question });
  nextAssessment.status = "in-progress";

  return {
    assessment: nextAssessment,
    question: { ...question },
  };
}

export async function submitMiniAssessmentAnswer(assessment, input, dependencies) {
  if (!isPlainObject(assessment) || !isPlainObject(input)) {
    throw new Error("Mini assessment and answer input must be objects.");
  }

  if (typeof input.questionId !== "string" || typeof input.answer !== "string" || input.answer.trim() === "") {
    throw new Error("A questionId and non-empty answer are required.");
  }

  const unansweredQuestion = getUnansweredQuestion(assessment);

  if (!unansweredQuestion || unansweredQuestion.questionId !== input.questionId) {
    throw new Error("questionId must match the current unanswered mini assessment question.");
  }

  const resolvedDependencies = dependencies ?? (await loadDefaultDependencies());
  const evaluation = await resolvedDependencies.evaluateInterviewAnswer({
    roleName: assessment.role.name,
    skill: assessment.skill,
    question: unansweredQuestion.question,
    expectedConcepts: unansweredQuestion.expectedConcepts,
    answer: input.answer.trim(),
    relevantProfileEvidence: [],
  });
  const nextAssessment = cloneAssessment(assessment);

  nextAssessment.answers.push({
    questionId: input.questionId,
    answer: input.answer.trim(),
  });
  nextAssessment.evaluations.push({
    questionId: input.questionId,
    ...evaluation,
  });
  nextAssessment.status =
    nextAssessment.answers.length >= nextAssessment.questionLimit
      ? "ready-to-finalize"
      : "in-progress";

  return {
    assessment: nextAssessment,
    evaluation,
  };
}

export function finalizeMiniAssessment(assessment) {
  if (!isPlainObject(assessment) || !Array.isArray(assessment.evaluations)) {
    throw new Error("Mini assessment must be a valid assessment object.");
  }

  if (getUnansweredQuestion(assessment)) {
    throw new Error("Cannot finalize a mini assessment with an unanswered question.");
  }

  if (assessment.questions.length < assessment.questionLimit) {
    throw new Error("Cannot finalize before all mini assessment questions are completed.");
  }

  const successfulEvaluations = assessment.evaluations.filter(
    (evaluation) => evaluation.evaluationStatus === "ai" && Number.isFinite(evaluation.score),
  );
  const successfulEvaluationCount = successfulEvaluations.length;
  const averageScore =
    successfulEvaluationCount > 0
      ? Math.round(
          successfulEvaluations.reduce((sum, evaluation) => sum + evaluation.score, 0) /
            successfulEvaluationCount,
        )
      : null;
  const demonstratedLevel =
    averageScore === null ? "none" : scoreToDemonstratedLevel(averageScore);
  const passed =
    successfulEvaluationCount > 0 &&
    averageScore >= 60 &&
    isLevelAtLeast(demonstratedLevel, assessment.targetLevel);
  const hasUnavailableEvaluation = assessment.evaluations.some(
    (evaluation) => evaluation.evaluationStatus === "unavailable",
  );

  return {
    skill: assessment.skill,
    status: passed ? "passed" : successfulEvaluationCount === 0 && hasUnavailableEvaluation ? "unavailable" : "failed",
    averageScore,
    demonstratedLevel,
    passed,
    successfulEvaluationCount,
    assessmentCoverage: Math.round(
      (successfulEvaluationCount / assessment.questionLimit) * 100,
    ),
    confidence: getConfidence(successfulEvaluationCount),
  };
}
