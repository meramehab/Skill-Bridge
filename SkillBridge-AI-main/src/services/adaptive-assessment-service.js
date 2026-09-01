import { createAdaptiveAssessmentSession } from "../assessment/create-adaptive-assessment-session.js";
import { decideNextAssessmentAction } from "../assessment/decide-next-action.js";
import { getNextDifficulty, getPreviousDifficulty } from "../assessment/assessment-levels.js";
import { getCurrentSkill } from "../assessment/get-current-skill.js";
import { updateSkillState } from "../assessment/update-skill-state.js";
import { getVerifiedReadinessLevel } from "../skills/readiness-levels.js";

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function loadDefaultDependencies() {
  const [
    { generateSkillDiscoveryQuestion },
    { evaluateSkillDiscoveryAnswer },
    { generateInterviewQuestion },
    { evaluateInterviewAnswer },
  ] = await Promise.all([
    import("../ai/generate-skill-discovery-question.js"),
    import("../ai/evaluate-skill-discovery-answer.js"),
    import("../ai/generate-interview-question.js"),
    import("../ai/evaluate-interview-answer.js"),
  ]);

  return {
    generateSkillDiscoveryQuestion,
    evaluateSkillDiscoveryAnswer,
    generateInterviewQuestion,
    evaluateInterviewAnswer,
  };
}

function cloneSession(session) {
  return structuredClone(session);
}

function updateTimestamp(session) {
  session.updatedAt = new Date().toISOString();
  return session;
}

function findCurrentSkillIndex(session) {
  for (let index = session.currentSkillIndex; index < session.skillStates.length; index += 1) {
    if (!["verified", "missing"].includes(session.skillStates[index].status)) {
      return index;
    }
  }

  return -1;
}

function createQuestionId(prefix, skillName, count) {
  return `${prefix}-${skillName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${count}`;
}

function addAssistantMessage(session, question) {
  session.messages.push({
    role: "assistant",
    type: question.type,
    skill: question.skill,
    questionId: question.questionId,
    text: question.question,
  });
}

function addStudentMessage(session, question, answer) {
  session.messages.push({
    role: "student",
    type: question.type,
    skill: question.skill,
    questionId: question.questionId,
    text: answer,
  });
}

function markSkillCompleted(session, skillName, currentIndex) {
  if (!session.completedSkillNames.includes(skillName)) {
    session.completedSkillNames.push(skillName);
  }

  session.currentSkillIndex = currentIndex + 1;
}

function createSkillMapEntry(skillState) {
  return {
    name: skillState.name,
    roleWeight: skillState.roleWeight,
    priority: skillState.priority,
    claimed: skillState.claimed,
    discovered: skillState.discovered,
    status: skillState.status,
    verifiedLevel: skillState.verifiedLevel,
    confidence: skillState.confidence,
    averageScore: skillState.averageScore,
    questionsAsked: skillState.questionsAsked,
    successfulEvaluations: skillState.successfulEvaluations,
    evaluationScores: [...(skillState.evaluationScores ?? [])],
    discoveryStatus: skillState.discoveryStatus,
    lastEvaluation: skillState.lastEvaluation ? { ...skillState.lastEvaluation } : null,
    evidence: [...(skillState.evidence ?? [])],
  };
}

export async function startAdaptiveAssessment(options) {
  return createAdaptiveAssessmentSession(options);
}

export async function getNextAssessmentMessage(session, dependencies) {
  if (!isPlainObject(session)) {
    throw new Error("Assessment session must be an object.");
  }

  if (session.currentQuestion) {
    return {
      session,
      message: session.currentQuestion,
    };
  }

  const currentSkill = getCurrentSkill(session);

  if (!currentSkill) {
    const nextSession = cloneSession(session);
    nextSession.status = "ready-to-finalize";

    return {
      session: updateTimestamp(nextSession),
      message: null,
    };
  }

  const currentSkillIndex = findCurrentSkillIndex(session);
  const resolvedDependencies = dependencies ?? (await loadDefaultDependencies());
  const nextSession = updateTimestamp(cloneSession(session));
  nextSession.currentSkillIndex = currentSkillIndex;

  if (currentSkill.status === "pending-discovery") {
    const discoveryQuestion = await resolvedDependencies.generateSkillDiscoveryQuestion({
      targetRole: nextSession.role,
      skill: currentSkill.name,
      profileSummary: nextSession.profileContext.summary,
      projectNames: nextSession.profileContext.projectNames,
      education: nextSession.profileContext.education,
      knownRelatedSkills: nextSession.profileContext.knownSkills,
    });
    const currentQuestion = {
      type: "discovery",
      questionId: createQuestionId("discovery", currentSkill.name, currentSkill.questionsAsked + 1),
      skill: currentSkill.name,
      question: discoveryQuestion.question,
      questionSource: discoveryQuestion.questionSource,
    };

    nextSession.currentQuestion = currentQuestion;
    addAssistantMessage(nextSession, currentQuestion);

    return {
      session: nextSession,
      message: currentQuestion,
    };
  }

  const technicalQuestion = await resolvedDependencies.generateInterviewQuestion({
    targetRole: nextSession.role,
    skill: currentSkill.name,
    skillEvidence: currentSkill.evidence,
    previousQuestionIds: nextSession.questions
      .filter((question) => question.skill === currentSkill.name)
      .map((question) => question.questionId),
    previousQuestionTexts: nextSession.questions
      .filter((question) => question.skill === currentSkill.name)
      .map((question) => question.question),
    questionNumber: currentSkill.questionsAsked + 1,
    currentDifficulty: currentSkill.currentDifficulty,
  });
  const currentQuestion = {
    type: "technical",
    questionId: technicalQuestion.questionId,
    skill: technicalQuestion.skill,
    difficulty: technicalQuestion.difficulty,
    question: technicalQuestion.question,
    expectedConcepts: technicalQuestion.expectedConcepts,
    followUpHint: technicalQuestion.followUpHint,
    questionSource: technicalQuestion.questionSource,
  };

  nextSession.currentQuestion = currentQuestion;
  nextSession.questions.push(currentQuestion);
  nextSession.skillStates[currentSkillIndex] = {
    ...nextSession.skillStates[currentSkillIndex],
    status: "in-assessment",
  };
  addAssistantMessage(nextSession, currentQuestion);

  return {
    session: nextSession,
    message: currentQuestion,
  };
}

export async function submitAssessmentAnswer(session, input, dependencies) {
  if (!isPlainObject(session)) {
    throw new Error("Assessment session must be an object.");
  }

  if (!session.currentQuestion) {
    throw new Error("There is no active assessment question.");
  }

  if (!isPlainObject(input) || typeof input.answer !== "string" || input.answer.trim() === "") {
    throw new Error("Assessment answer is required and cannot be blank.");
  }

  const resolvedDependencies = dependencies ?? (await loadDefaultDependencies());
  const nextSession = updateTimestamp(cloneSession(session));
  const currentQuestion = nextSession.currentQuestion;
  const currentSkillIndex = nextSession.currentSkillIndex;
  let skillState = nextSession.skillStates[currentSkillIndex];

  addStudentMessage(nextSession, currentQuestion, input.answer.trim());

  if (currentQuestion.type === "discovery") {
    const evaluation = await resolvedDependencies.evaluateSkillDiscoveryAnswer({
      targetRole: nextSession.role.name,
      skill: currentQuestion.skill,
      discoveryQuestion: currentQuestion.question,
      studentAnswer: input.answer.trim(),
    });

    if (evaluation.evaluationStatus === "unavailable") {
      nextSession.skillStates[currentSkillIndex] = updateSkillState(skillState, {
        type: "evaluation_unavailable",
        evaluation,
      });
      nextSession.currentQuestion = null;
      markSkillCompleted(nextSession, skillState.name, currentSkillIndex);

      return {
        session: nextSession,
        evaluation,
        nextAction: { action: "move_to_next_skill" },
      };
    }

    skillState = updateSkillState(skillState, {
      type: "discovery_evaluated",
      evaluation,
    });
    nextSession.skillStates[currentSkillIndex] = skillState;
    nextSession.currentQuestion = null;

    if (evaluation.shouldVerify) {
      return {
        session: nextSession,
        evaluation,
        nextAction: { action: "verify_skill" },
      };
    }

    markSkillCompleted(nextSession, skillState.name, currentSkillIndex);

    return {
      session: nextSession,
      evaluation,
      nextAction: { action: "mark_missing" },
    };
  }

  const evaluation = await resolvedDependencies.evaluateInterviewAnswer({
    roleName: nextSession.role.name,
    skill: currentQuestion.skill,
    question: currentQuestion.question,
    expectedConcepts: currentQuestion.expectedConcepts,
    answer: input.answer.trim(),
    relevantProfileEvidence: skillState.evidence,
  });

  skillState = updateSkillState(skillState, {
    type: "technical_evaluated",
    evaluation,
  });
  nextSession.skillStates[currentSkillIndex] = skillState;
  nextSession.currentQuestion = null;
  nextSession.evaluations = [
    ...(nextSession.evaluations ?? []),
    {
      questionId: currentQuestion.questionId,
      skill: currentQuestion.skill,
      difficulty: currentQuestion.difficulty ?? skillState.currentDifficulty,
      ...evaluation,
    },
  ];

  if (evaluation.evaluationStatus === "unavailable") {
    markSkillCompleted(nextSession, skillState.name, currentSkillIndex);

    return {
      session: nextSession,
      evaluation,
      nextAction: { action: "move_to_next_skill" },
    };
  }

  const nextAction = decideNextAssessmentAction(skillState, evaluation, nextSession.config);

  if (nextAction.action === "increase_difficulty") {
    nextSession.skillStates[currentSkillIndex] = updateSkillState(skillState, {
      type: "difficulty_changed",
      difficulty: getNextDifficulty(skillState.currentDifficulty),
    });
  } else if (nextAction.action === "decrease_difficulty") {
    nextSession.skillStates[currentSkillIndex] = updateSkillState(skillState, {
      type: "difficulty_changed",
      difficulty: getPreviousDifficulty(skillState.currentDifficulty),
    });
  } else if (nextAction.action === "verify_skill") {
    nextSession.skillStates[currentSkillIndex] = updateSkillState(skillState, {
      type: "skill_verified",
    });
    markSkillCompleted(nextSession, skillState.name, currentSkillIndex);
  } else if (nextAction.action === "move_to_next_skill") {
    markSkillCompleted(nextSession, skillState.name, currentSkillIndex);
  }

  return {
    session: nextSession,
    evaluation,
    nextAction,
  };
}

export async function finalizeAdaptiveAssessment(session) {
  if (!isPlainObject(session)) {
    throw new Error("Assessment session must be an object.");
  }

  if (session.currentQuestion) {
    throw new Error("Cannot finalize while a question is still unanswered.");
  }

  const skillMap = session.skillStates.map(createSkillMapEntry);
  const verifiedSkills = skillMap.filter((skill) => skill.status === "verified");
  const discoveredSkills = skillMap.filter((skill) => skill.discovered);
  const missingSkills = skillMap.filter((skill) => skill.status === "missing");
  const unverifiedSkills = skillMap.filter((skill) => skill.status !== "verified");

  const verificationCoverage = Math.round(
    session.skillStates.reduce((sum, skill) => {
      if (skill.successfulEvaluations > 0) {
        return sum + skill.roleWeight;
      }

      return sum;
    }, 0),
  );

  const verifiedReadinessScore = Math.round(
    session.skillStates.reduce((sum, skill) => {
      if (skill.successfulEvaluations > 0 && typeof skill.averageScore === "number") {
        return sum + (skill.roleWeight * skill.averageScore) / 100;
      }

      return sum;
    }, 0),
  );

  const assessmentStatus =
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
    verifiedReadinessScore,
    verifiedReadinessLevel: getVerifiedReadinessLevel(verifiedReadinessScore),
    verificationCoverage,
    skillMap,
    verifiedSkills,
    discoveredSkills,
    missingSkills,
    unverifiedSkills,
    assessmentStatus,
  };
}
