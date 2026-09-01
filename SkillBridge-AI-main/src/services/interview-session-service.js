import { createInterviewSession } from "../interview/create-interview-session.js";
import { getVerifiedReadinessLevel } from "../skills/readiness-levels.js";
import { compareSkillPriority } from "../skills/skill-priority.js";

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function loadDefaultDependencies() {
  const [{ generateInterviewQuestion }, { evaluateInterviewAnswer }] = await Promise.all([
    import("../ai/generate-interview-question.js"),
    import("../ai/evaluate-interview-answer.js"),
  ]);

  return {
    generateInterviewQuestion,
    evaluateInterviewAnswer,
  };
}

function cloneSession(session) {
  return structuredClone(session);
}

function getLatestUnansweredQuestion(session) {
  return session.questions.find((question) => !session.answers.some((answer) => answer.questionId === question.questionId)) ?? null;
}

function compareMissingSkills(a, b) {
  const priorityDifference = compareSkillPriority(a, b);

  if (priorityDifference !== 0) {
    return priorityDifference;
  }

  return b.weight - a.weight;
}

export async function startInterview(options) {
  return createInterviewSession(options);
}

export async function getNextInterviewQuestion(session, dependencies) {
  if (!isPlainObject(session)) {
    throw new Error("Interview session must be an object.");
  }

  if (session.status === "no-claimed-skills" || session.currentSkillIndex >= session.selectedSkills.length) {
    return null;
  }

  const latestUnansweredQuestion = getLatestUnansweredQuestion(session);

  if (latestUnansweredQuestion) {
    return {
      session,
      question: latestUnansweredQuestion,
    };
  }

  const selectedSkill = session.selectedSkills[session.currentSkillIndex];
  const resolvedDependencies = dependencies ?? (await loadDefaultDependencies());
  const generatedQuestion = await resolvedDependencies.generateInterviewQuestion({
    targetRole: session.role,
    skill: selectedSkill.name,
    skillEvidence: selectedSkill.evidence,
    previousQuestionIds: session.questions.map((question) => question.questionId),
    previousQuestionTexts: session.questions.map((question) => question.question),
    questionNumber: session.questions.length + 1,
  });

  const nextSession = cloneSession(session);
  nextSession.questions.push(generatedQuestion);

  return {
    session: nextSession,
    question: generatedQuestion,
  };
}

export async function submitInterviewAnswer(session, input, dependencies) {
  if (!isPlainObject(session)) {
    throw new Error("Interview session must be an object.");
  }

  if (!isPlainObject(input)) {
    throw new Error("Interview answer input must be an object.");
  }

  if (typeof input.questionId !== "string" || input.questionId.trim() === "") {
    throw new Error("questionId is required.");
  }

  if (typeof input.answer !== "string" || input.answer.trim() === "") {
    throw new Error("Answer is required and cannot be blank.");
  }

  const latestUnansweredQuestion = getLatestUnansweredQuestion(session);

  if (!latestUnansweredQuestion || latestUnansweredQuestion.questionId !== input.questionId) {
    throw new Error("questionId must match the latest unanswered interview question.");
  }

  const selectedSkill = session.selectedSkills[session.currentSkillIndex];
  const resolvedDependencies = dependencies ?? (await loadDefaultDependencies());
  const evaluation = await resolvedDependencies.evaluateInterviewAnswer({
    roleName: session.role.name,
    skill: latestUnansweredQuestion.skill,
    question: latestUnansweredQuestion.question,
    expectedConcepts: latestUnansweredQuestion.expectedConcepts,
    studentAnswer: input.answer.trim(),
    answer: input.answer.trim(),
    relevantProfileEvidence: selectedSkill?.evidence ?? [],
  });

  const nextSession = cloneSession(session);
  nextSession.answers.push({
    questionId: latestUnansweredQuestion.questionId,
    answer: input.answer.trim(),
  });
  nextSession.evaluations.push({
    questionId: latestUnansweredQuestion.questionId,
    skill: latestUnansweredQuestion.skill,
    weight: selectedSkill?.weight ?? 0,
    priority: selectedSkill?.priority ?? "low",
    ...evaluation,
  });
  nextSession.currentSkillIndex += 1;

  return {
    session: nextSession,
    evaluation,
  };
}

export async function finalizeInterview(session) {
  if (!isPlainObject(session)) {
    throw new Error("Interview session must be an object.");
  }

  if (getLatestUnansweredQuestion(session)) {
    throw new Error("Cannot finalize an interview with unanswered questions.");
  }

  const requiredRoleSkills = session.role.requiredSkills ?? [];
  const selectedSkillMap = new Map(session.selectedSkills.map((skill) => [skill.name, skill]));
  const evaluationMap = new Map(session.evaluations.map((evaluation) => [evaluation.skill, evaluation]));
  const verifiedSkills = [];
  const unverifiedSkills = [];
  let verifiedReadinessScore = 0;
  let verifiedCoverageWeight = 0;

  for (const roleSkill of requiredRoleSkills) {
    const selectedSkill = selectedSkillMap.get(roleSkill.name);
    const evaluation = evaluationMap.get(roleSkill.name);

    if (selectedSkill && evaluation?.evaluationStatus === "ai" && typeof evaluation.score === "number") {
      verifiedCoverageWeight += roleSkill.weight;
      verifiedReadinessScore += (roleSkill.weight * evaluation.score) / 100;
      verifiedSkills.push({
        name: roleSkill.name,
        weight: roleSkill.weight,
        priority: roleSkill.priority,
        evaluationScore: evaluation.score,
        demonstratedLevel: evaluation.demonstratedLevel,
        strengths: evaluation.strengths,
        gaps: evaluation.gaps,
        status: "verified",
      });
      continue;
    }

    let status = "not-selected";

    if (selectedSkill && evaluation?.evaluationStatus === "unavailable") {
      status = "not-evaluated";
    } else if (selectedSkill) {
      status = "not-tested";
    }

    unverifiedSkills.push({
      name: roleSkill.name,
      weight: roleSkill.weight,
      priority: roleSkill.priority,
      status,
    });
  }

  const roundedScore = Math.round(verifiedReadinessScore);
  const verificationCoverage = Math.round(verifiedCoverageWeight);
  const interviewStatus =
    verifiedSkills.length === 0
      ? "not-evaluated"
      : unverifiedSkills.length > 0
        ? "partially-evaluated"
        : "completed";

  return {
    sessionId: session.sessionId,
    role: {
      id: session.role.id,
      name: session.role.name,
      description: session.role.description,
    },
    profileMatchScore: session.profileMatchScore,
    verifiedReadinessScore: roundedScore,
    verifiedReadinessLevel: getVerifiedReadinessLevel(roundedScore),
    verificationCoverage,
    verifiedSkills,
    unverifiedSkills: [...unverifiedSkills].sort(compareMissingSkills),
    interviewStatus,
  };
}
