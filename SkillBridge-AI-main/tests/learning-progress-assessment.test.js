import test from "node:test";
import assert from "node:assert/strict";
import { learningResourceCatalog } from "../src/data/learning-resource-catalog.js";
import { roleCatalog } from "../src/data/role-catalog.js";
import { applyMiniAssessmentResult } from "../src/learning/apply-mini-assessment-result.js";
import { buildLearningPlan } from "../src/learning/build-learning-plan.js";
import { createMiniAssessment } from "../src/learning/create-mini-assessment.js";
import { updateLearningProgress } from "../src/learning/update-learning-progress.js";
import { buildQualificationPath } from "../src/qualification/build-qualification-path.js";
import { getRoleByName } from "../src/roles/get-role.js";
import {
  finalizeMiniAssessment,
  getNextMiniAssessmentQuestion,
  startMiniAssessment,
  submitMiniAssessmentAnswer,
} from "../src/services/mini-assessment-service.js";
import { refreshStudentQualification } from "../src/services/refresh-student-qualification.js";
import {
  applyStudentMiniAssessment,
  createStudentLearningJourney,
  refreshStudentLearningJourney,
  updateStudentLearningJourneyProgress,
} from "../src/services/student-learning-journey.js";

const frontendRole = getRoleByName("Frontend Developer");

function createSkill(overrides = {}) {
  return {
    name: "JavaScript",
    roleWeight: 25,
    priority: "high",
    targetLevel: "beginner",
    state: "missing",
    currentLevel: "none",
    confidence: 1,
    averageScore: null,
    claimed: false,
    discovered: false,
    assessmentEvidence: {},
    gapSeverity: "high",
    recommendedAction: "learn",
    reason: "No demonstrated level.",
    ...overrides,
  };
}

function createQualification() {
  const skillMap = [
    createSkill(),
    createSkill({
      name: "React",
      roleWeight: 20,
      priority: "medium",
      targetLevel: "intermediate",
      state: "needs-improvement",
      currentLevel: "basic",
      confidence: 0.55,
      averageScore: 40,
      recommendedAction: "improve",
      gapSeverity: "high",
      reason: "Below target.",
    }),
    createSkill({
      name: "Git",
      roleWeight: 10,
      priority: "medium",
      state: "unknown",
      currentLevel: "none",
      confidence: 0,
      recommendedAction: "reassess",
      gapSeverity: "unknown",
      reason: "Not enough evidence.",
    }),
    createSkill({
      name: "HTML",
      roleWeight: 20,
      state: "verified",
      currentLevel: "intermediate",
      confidence: 0.75,
      averageScore: 70,
      recommendedAction: "skip",
      gapSeverity: "none",
      reason: "Meets target.",
    }),
  ];
  const qualificationPath = buildQualificationPath({ role: frontendRole, skillMap });

  return {
    role: frontendRole,
    skillMap,
    qualificationPath,
  };
}

function createPlan() {
  const qualification = createQualification();
  return buildLearningPlan({
    qualificationPath: qualification.qualificationPath,
    role: qualification.role,
  });
}

function makeAwaitingPlan(skill = "JavaScript") {
  const plan = createPlan();
  const step = plan.steps.find((item) => item.skill === skill);
  step.status = "awaiting-assessment";
  step.progressPercent = 100;
  plan.status = "in-progress";
  return plan;
}

function createQuestion(input) {
  return {
    questionId: `${input.skill}-${input.questionNumber}`,
    skill: input.skill,
    difficulty: input.currentDifficulty,
    question: `Question ${input.questionNumber}`,
    expectedConcepts: [],
    followUpHint: "Hint",
    questionSource: "injected",
  };
}

function createEvaluation(score) {
  if (score === null) {
    return {
      evaluationStatus: "unavailable",
      score: null,
      demonstratedLevel: "not-evaluated",
      strengths: [],
      gaps: [],
      feedback: "Unavailable",
      needsFollowUp: false,
      followUpFocus: null,
    };
  }

  return {
    evaluationStatus: "ai",
    score,
    demonstratedLevel: score < 25 ? "not-demonstrated" : score < 50 ? "basic" : score < 75 ? "intermediate" : "strong",
    strengths: [],
    gaps: [],
    feedback: "Evaluated",
    needsFollowUp: false,
    followUpFocus: null,
  };
}

async function runMiniAssessment(scores, skill = "JavaScript", targetLevel = "beginner") {
  const learningStep = {
    ...makeAwaitingPlan(skill).steps.find((step) => step.skill === skill),
    targetLevel,
  };
  let assessment = startMiniAssessment({ learningStep, role: frontendRole, skill });
  let evaluationIndex = 0;

  while (assessment.questions.length < assessment.questionLimit) {
    const questionResult = await getNextMiniAssessmentQuestion(assessment, {
      generateInterviewQuestion: async (input) => createQuestion(input),
    });
    assessment = questionResult.assessment;
    const answerResult = await submitMiniAssessmentAnswer(
      assessment,
      { questionId: questionResult.question.questionId, answer: "A practical answer." },
      {
        evaluateInterviewAnswer: async () => createEvaluation(scores[evaluationIndex++]),
      },
    );
    assessment = answerResult.assessment;
  }

  return finalizeMiniAssessment(assessment);
}

test("learning plan is created from the qualification path", () => {
  const plan = createPlan();
  assert.equal(plan.status, "not-started");
  assert.equal(plan.steps.length, 3);
  assert.deepEqual(plan.steps.map((step) => step.order), [1, 2, 3]);
});

test("verified and skip skills do not create learning steps", () => {
  const qualification = createQualification();
  const pathWithSkip = {
    ...qualification.qualificationPath,
    items: [
      ...qualification.qualificationPath.items,
      { skill: "HTML", action: "skip", targetLevel: "beginner" },
    ],
  };
  const plan = buildLearningPlan({ qualificationPath: pathWithSkip, role: frontendRole });
  assert.equal(plan.steps.some((step) => step.skill === "HTML"), false);
});

test("missing skill creates a learn step", () => {
  const step = createPlan().steps.find((item) => item.skill === "JavaScript");
  assert.equal(step.action, "learn");
  assert.equal(step.type, "learning");
  assert.ok(step.resourceIds.length > 0);
});

test("needs-improvement skill creates an improve step", () => {
  const step = createPlan().steps.find((item) => item.skill === "React");
  assert.equal(step.action, "improve");
  assert.ok(step.resourceIds.includes("react-intermediate-project"));
});

test("unknown skill creates a reassess step", () => {
  const step = createPlan().steps.find((item) => item.skill === "Git");
  assert.equal(step.action, "reassess");
  assert.equal(step.type, "reassessment");
  assert.deepEqual(step.resourceIds, []);
});

test("progress moves from not-started to in-progress", () => {
  const plan = createPlan();
  const updated = updateLearningProgress(plan, {
    stepId: plan.steps[0].id,
    action: "start_step",
  });
  assert.equal(updated.steps[0].status, "in-progress");
});

test("progress updates do not verify a skill", () => {
  const journey = createStudentLearningJourney({ qualification: createQualification() });
  const started = updateStudentLearningJourneyProgress(journey, {
    stepId: journey.learningPlan.steps[0].id,
    action: "start_step",
  });
  const progressed = updateStudentLearningJourneyProgress(started, {
    stepId: journey.learningPlan.steps[0].id,
    action: "update_progress",
    progressPercent: 80,
  });
  assert.deepEqual(progressed.skillMap, journey.skillMap);
  assert.equal(progressed.learningPlan.steps[0].progressPercent, 80);
});

test("complete learning moves a step to awaiting-assessment", () => {
  const plan = createPlan();
  const started = updateLearningProgress(plan, { stepId: plan.steps[0].id, action: "start_step" });
  const completed = updateLearningProgress(started, {
    stepId: plan.steps[0].id,
    action: "complete_learning",
  });
  assert.equal(completed.steps[0].status, "awaiting-assessment");
  assert.equal(completed.steps[0].progressPercent, 100);
});

test("mini assessment cannot be created before learning completion", () => {
  assert.throws(() =>
    createMiniAssessment({
      learningStep: createPlan().steps[0],
      role: frontendRole,
      skill: "JavaScript",
    }),
  );
});

test("mini assessment pass rule is deterministic", async () => {
  const result = await runMiniAssessment([80, 70]);
  assert.equal(result.averageScore, 75);
  assert.equal(result.demonstratedLevel, "strong");
  assert.equal(result.passed, true);
  assert.equal(result.status, "passed");
  assert.equal(result.assessmentCoverage, 100);
});

test("unavailable evaluation cannot pass", async () => {
  const unavailable = await runMiniAssessment([null, null]);
  const partial = await runMiniAssessment([80, null], "React", "advanced");
  assert.equal(unavailable.status, "unavailable");
  assert.equal(unavailable.passed, false);
  assert.equal(partial.passed, false);
  assert.equal(partial.assessmentCoverage, 50);
});

test("one successful evaluation can pass with reduced coverage", async () => {
  const result = await runMiniAssessment([80, null]);
  assert.equal(result.passed, true);
  assert.equal(result.successfulEvaluationCount, 1);
  assert.equal(result.assessmentCoverage, 50);
  assert.equal(result.confidence, 0.55);
});

test("temporary question failure uses one local fallback without retrying", async () => {
  const learningStep = makeAwaitingPlan().steps.find((step) => step.skill === "JavaScript");
  const assessment = startMiniAssessment({ learningStep, role: frontendRole, skill: "JavaScript" });
  let calls = 0;
  const result = await getNextMiniAssessmentQuestion(assessment, {
    async generateInterviewQuestion() {
      calls += 1;
      throw { status: 503 };
    },
  });
  assert.equal(calls, 1);
  assert.equal(result.question.questionSource, "fallback");
});

test("failed assessment creates needs-review", async () => {
  const plan = makeAwaitingPlan();
  const skillMap = createQualification().skillMap;
  const result = await runMiniAssessment([40, 40]);
  const applied = applyMiniAssessmentResult(plan, skillMap, result);
  assert.equal(applied.plan.steps.find((step) => step.skill === "JavaScript").status, "needs-review");
});

test("passed assessment can improve skill state", async () => {
  const plan = makeAwaitingPlan();
  const skillMap = createQualification().skillMap;
  const result = await runMiniAssessment([80, 70]);
  const applied = applyMiniAssessmentResult(plan, skillMap, result);
  const skill = applied.skillMap.find((item) => item.name === "JavaScript");
  assert.equal(skill.state, "verified");
  assert.equal(skill.recommendedAction, "skip");
  assert.equal(skill.confidence, 0.75);
});

test("passed assessment meeting target removes the skill after qualification refresh", async () => {
  const journey = createStudentLearningJourney({ qualification: createQualification() });
  journey.learningPlan = makeAwaitingPlan();
  const applied = applyStudentMiniAssessment(journey, await runMiniAssessment([80, 70]));
  const refreshed = refreshStudentLearningJourney(applied);
  assert.equal(refreshed.qualificationPath.items.some((item) => item.skill === "JavaScript"), false);
  assert.equal(refreshed.learningPlan.steps.some((step) => step.skill === "JavaScript"), false);
});

test("failed assessment keeps the qualification item active", async () => {
  const qualification = createQualification();
  const applied = applyMiniAssessmentResult(
    makeAwaitingPlan(),
    qualification.skillMap,
    await runMiniAssessment([40, 40]),
  );
  const refreshed = refreshStudentQualification({
    role: frontendRole,
    previousQualification: qualification,
    updatedSkillMap: applied.skillMap,
  });
  assert.equal(refreshed.qualificationPath.items.some((item) => item.skill === "JavaScript"), true);

  const journey = createStudentLearningJourney({ qualification });
  journey.learningPlan = makeAwaitingPlan();
  const refreshedJourney = refreshStudentLearningJourney(
    applyStudentMiniAssessment(journey, await runMiniAssessment([40, 40])),
  );
  assert.equal(
    refreshedJourney.learningPlan.steps.find((step) => step.skill === "JavaScript").status,
    "needs-review",
  );
  assert.equal(refreshedJourney.learningPlan.status, "in-progress");
});

test("unavailable assessment preserves competence uncertainty", async () => {
  const plan = makeAwaitingPlan("Git");
  const skillMap = createQualification().skillMap;
  const originalSkill = structuredClone(skillMap.find((item) => item.name === "Git"));
  const applied = applyMiniAssessmentResult(plan, skillMap, await runMiniAssessment([null, null], "Git"));
  assert.equal(applied.plan.steps.find((step) => step.skill === "Git").status, "assessment-unavailable");
  assert.deepEqual(applied.skillMap.find((item) => item.name === "Git"), originalSkill);
});

test("learning plan updates are immutable", () => {
  const plan = createPlan();
  const original = structuredClone(plan);
  updateLearningProgress(plan, { stepId: plan.steps[0].id, action: "start_step" });
  assert.deepEqual(plan, original);
});

test("applying mini assessment keeps the original skill map immutable", async () => {
  const skillMap = createQualification().skillMap;
  const original = structuredClone(skillMap);
  applyMiniAssessmentResult(makeAwaitingPlan(), skillMap, await runMiniAssessment([80, 70]));
  assert.deepEqual(skillMap, original);
});

test("qualification refresh is deterministic", async () => {
  const qualification = createQualification();
  const applied = applyMiniAssessmentResult(
    makeAwaitingPlan(),
    qualification.skillMap,
    await runMiniAssessment([40, 40]),
  );
  const input = {
    role: frontendRole,
    previousQualification: qualification,
    updatedSkillMap: applied.skillMap,
  };
  assert.deepEqual(refreshStudentQualification(input), refreshStudentQualification(input));
});

test("npm test path uses only injected mini assessment dependencies", async () => {
  let questionCalls = 0;
  let evaluationCalls = 0;
  const learningStep = makeAwaitingPlan().steps.find((step) => step.skill === "JavaScript");
  let assessment = startMiniAssessment({ learningStep, role: frontendRole, skill: "JavaScript" });
  const questionResult = await getNextMiniAssessmentQuestion(assessment, {
    generateInterviewQuestion: async (input) => {
      questionCalls += 1;
      return createQuestion(input);
    },
  });
  assessment = questionResult.assessment;
  await submitMiniAssessmentAnswer(
    assessment,
    { questionId: questionResult.question.questionId, answer: "Answer" },
    {
      evaluateInterviewAnswer: async () => {
        evaluationCalls += 1;
        return createEvaluation(80);
      },
    },
  );
  assert.equal(questionCalls, 1);
  assert.equal(evaluationCalls, 1);
});

test("learning resources cover every assessable production core skill", () => {
  const coveredSkills = new Set(learningResourceCatalog.map((resource) => resource.skill));

  for (const role of roleCatalog) {
    for (const skill of role.skills.filter((item) => item.assessable && item.importance === "core")) {
      assert.ok(coveredSkills.has(skill.name), `Expected a learning resource for ${skill.name}.`);
    }
  }
});

test("invalid progress transitions throw clear errors", () => {
  const plan = createPlan();
  assert.throws(() =>
    updateLearningProgress(plan, {
      stepId: plan.steps[0].id,
      action: "update_progress",
      progressPercent: 50,
    }),
  );
});
