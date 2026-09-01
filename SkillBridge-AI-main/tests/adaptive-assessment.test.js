import test from "node:test";
import assert from "node:assert/strict";
import { buildAssessmentSkillMap } from "../src/assessment/build-assessment-skill-map.js";
import { createAdaptiveAssessmentSession } from "../src/assessment/create-adaptive-assessment-session.js";
import { getCurrentSkill } from "../src/assessment/get-current-skill.js";
import { updateSkillState } from "../src/assessment/update-skill-state.js";
import {
  finalizeAdaptiveAssessment,
  getNextAssessmentMessage,
  startAdaptiveAssessment,
  submitAssessmentAnswer,
} from "../src/services/adaptive-assessment-service.js";
import { getRoleByName } from "../src/roles/get-role.js";

function createProfile(skills = [], projects = []) {
  return {
    personalInfo: {
      name: "Student",
      email: null,
      phone: null,
      location: null,
    },
    skills,
    education: [],
    experience: [],
    projects,
    suggestedRoles: [],
    summary: "",
    profileSource: "manual",
  };
}

function createTechnicalEvaluation(score) {
  const level = score <= 24 ? "not-demonstrated" : score <= 49 ? "basic" : score <= 74 ? "intermediate" : "strong";

  return {
    evaluationStatus: "ai",
    score,
    demonstratedLevel: level,
    strengths: [],
    gaps: [],
    feedback: "Feedback",
    needsFollowUp: false,
    followUpFocus: null,
  };
}

test("skill map contains every required role skill", () => {
  const skillMap = buildAssessmentSkillMap(createProfile(["SQL", "Python"]), getRoleByName("Data Analyst"));
  assert.equal(skillMap.length, getRoleByName("Data Analyst").requiredSkills.length);
});

test("matched skills start pending-verification", () => {
  const sqlState = buildAssessmentSkillMap(createProfile(["SQL"]), getRoleByName("Data Analyst")).find((skill) => skill.name === "SQL");
  assert.equal(sqlState.status, "pending-verification");
});

test("unmatched skills start pending-discovery", () => {
  const excelState = buildAssessmentSkillMap(createProfile(["SQL"]), getRoleByName("Data Analyst")).find((skill) => skill.name === "Excel");
  assert.equal(excelState.status, "pending-discovery");
});

test("discovery can promote an unclaimed skill to discovered", () => {
  const state = updateSkillState(
    {
      name: "Power BI",
      roleWeight: 20,
      priority: "medium",
      evidence: [],
      source: [],
      claimed: false,
      discovered: false,
      status: "pending-discovery",
      currentDifficulty: "awareness",
      estimatedLevel: null,
      verifiedLevel: null,
      confidence: 0,
      questionsAsked: 0,
      successfulEvaluations: 0,
      evaluationScores: [],
      averageScore: null,
      lastEvaluation: null,
      discoveryStatus: "unknown",
    },
    {
      type: "discovery_evaluated",
      evaluation: { exposure: "studied", shouldVerify: true, evidenceSummary: "Class exposure" },
    },
  );
  assert.equal(state.discovered, true);
  assert.equal(state.status, "pending-verification");
});

test("no-exposure discovery marks a skill missing", () => {
  const state = updateSkillState(
    {
      name: "Excel",
      roleWeight: 15,
      priority: "medium",
      evidence: [],
      source: [],
      claimed: false,
      discovered: false,
      status: "pending-discovery",
      currentDifficulty: "awareness",
      estimatedLevel: null,
      verifiedLevel: null,
      confidence: 0,
      questionsAsked: 0,
      successfulEvaluations: 0,
      evaluationScores: [],
      averageScore: null,
      lastEvaluation: null,
      discoveryStatus: "unknown",
    },
    {
      type: "discovery_evaluated",
      evaluation: { exposure: "none", shouldVerify: false, evidenceSummary: "" },
    },
  );
  assert.equal(state.status, "missing");
});

test("unavailable discovery does not mark skill missing", async () => {
  const session = await startAdaptiveAssessment({
    profile: createProfile(["SQL"]),
    targetRole: "Data Analyst",
  });
  const movedSession = { ...session, currentSkillIndex: 2 };
  const withQuestion = await getNextAssessmentMessage(movedSession, {
    async generateSkillDiscoveryQuestion(input) {
      return { skill: input.skill, question: "Discovery question?", questionSource: "fallback" };
    },
  });
  const submitResult = await submitAssessmentAnswer(
    withQuestion.session,
    { answer: "I am not sure." },
    {
      async evaluateSkillDiscoveryAnswer() {
        return {
          evaluationStatus: "unavailable",
          exposure: "unknown",
          shouldVerify: false,
          evidenceSummary: "",
        };
      },
    },
  );
  assert.notEqual(submitResult.session.skillStates[2].status, "missing");
});

test("strong technical score increases difficulty", async () => {
  const session = await startAdaptiveAssessment({
    profile: createProfile(["SQL"]),
    targetRole: "Data Analyst",
    config: { maxQuestionsPerSkill: 3 },
  });
  const withQuestion = await getNextAssessmentMessage(session, {
    async generateInterviewQuestion() {
      return {
        questionId: "sql-q1",
        skill: "SQL",
        difficulty: "beginner",
        question: "SQL question?",
        expectedConcepts: ["GROUP BY"],
        followUpHint: "Hint",
        questionSource: "fallback",
      };
    },
  });
  const submitResult = await submitAssessmentAnswer(
    withQuestion.session,
    { answer: "Good answer" },
    {
      async evaluateInterviewAnswer() {
        return createTechnicalEvaluation(80);
      },
    },
  );
  assert.equal(submitResult.session.skillStates[0].currentDifficulty, "intermediate");
});

test("weak technical score can decrease difficulty", async () => {
  const session = await startAdaptiveAssessment({
    profile: createProfile(["SQL"]),
    targetRole: "Data Analyst",
    config: { maxQuestionsPerSkill: 3 },
  });
  session.skillStates[0].currentDifficulty = "intermediate";
  const withQuestion = await getNextAssessmentMessage(session, {
    async generateInterviewQuestion() {
      return {
        questionId: "sql-q1",
        skill: "SQL",
        difficulty: "intermediate",
        question: "SQL question?",
        expectedConcepts: ["GROUP BY"],
        followUpHint: "Hint",
        questionSource: "fallback",
      };
    },
  });
  const submitResult = await submitAssessmentAnswer(
    withQuestion.session,
    { answer: "Weak answer" },
    {
      async evaluateInterviewAnswer() {
        return createTechnicalEvaluation(30);
      },
    },
  );
  assert.equal(submitResult.session.skillStates[0].currentDifficulty, "beginner");
});

test("max question limit stops further questioning", async () => {
  const session = await startAdaptiveAssessment({
    profile: createProfile(["SQL"]),
    targetRole: "Data Analyst",
    config: { maxQuestionsPerSkill: 1 },
  });
  const withQuestion = await getNextAssessmentMessage(session, {
    async generateInterviewQuestion() {
      return {
        questionId: "sql-q1",
        skill: "SQL",
        difficulty: "beginner",
        question: "SQL question?",
        expectedConcepts: ["GROUP BY"],
        followUpHint: "Hint",
        questionSource: "fallback",
      };
    },
  });
  const submitResult = await submitAssessmentAnswer(
    withQuestion.session,
    { answer: "Okay answer" },
    {
      async evaluateInterviewAnswer() {
        return createTechnicalEvaluation(60);
      },
    },
  );
  assert.equal(submitResult.nextAction.action, "verify_skill");
});

test("successful evaluations update average score", () => {
  let state = {
    name: "SQL",
    roleWeight: 30,
    priority: "high",
    evidence: [],
    source: [],
    claimed: true,
    discovered: false,
    status: "in-assessment",
    currentDifficulty: "beginner",
    estimatedLevel: null,
    verifiedLevel: null,
    confidence: 0,
    questionsAsked: 0,
    successfulEvaluations: 0,
    evaluationScores: [],
    averageScore: null,
    lastEvaluation: null,
    discoveryStatus: "not-needed",
  };
  state = updateSkillState(state, { type: "technical_evaluated", evaluation: createTechnicalEvaluation(60) });
  state = updateSkillState(state, { type: "technical_evaluated", evaluation: createTechnicalEvaluation(80) });
  assert.equal(state.averageScore, 70);
});

test("unavailable evaluations do not verify a skill", () => {
  const state = updateSkillState(
    {
      name: "SQL",
      roleWeight: 30,
      priority: "high",
      evidence: [],
      source: [],
      claimed: true,
      discovered: false,
      status: "in-assessment",
      currentDifficulty: "beginner",
      estimatedLevel: null,
      verifiedLevel: null,
      confidence: 0,
      questionsAsked: 0,
      successfulEvaluations: 0,
      evaluationScores: [],
      averageScore: null,
      lastEvaluation: null,
      discoveryStatus: "not-needed",
    },
    {
      type: "technical_evaluated",
      evaluation: { evaluationStatus: "unavailable" },
    },
  );
  assert.notEqual(updateSkillState(state, { type: "skill_verified" }).status, "verified");
});

test("verified level comes from successful average score", () => {
  const state = updateSkillState(
    {
      name: "SQL",
      roleWeight: 30,
      priority: "high",
      evidence: [],
      source: [],
      claimed: true,
      discovered: false,
      status: "in-assessment",
      currentDifficulty: "beginner",
      estimatedLevel: "strong",
      verifiedLevel: null,
      confidence: 0,
      questionsAsked: 2,
      successfulEvaluations: 2,
      evaluationScores: [80, 90],
      averageScore: 85,
      lastEvaluation: null,
      discoveryStatus: "not-needed",
    },
    { type: "skill_verified" },
  );
  assert.equal(state.verifiedLevel, "strong");
});

test("confidence increases with successful evaluation count", () => {
  const state = updateSkillState(
    {
      name: "SQL",
      roleWeight: 30,
      priority: "high",
      evidence: [],
      source: [],
      claimed: true,
      discovered: false,
      status: "in-assessment",
      currentDifficulty: "beginner",
      estimatedLevel: "basic",
      verifiedLevel: null,
      confidence: 0,
      questionsAsked: 1,
      successfulEvaluations: 1,
      evaluationScores: [60],
      averageScore: 60,
      lastEvaluation: null,
      discoveryStatus: "not-needed",
    },
    { type: "skill_verified" },
  );
  assert.equal(state.confidence, 0.55);
});

test("getCurrentSkill skips completed skills", () => {
  const currentSkill = getCurrentSkill({
    currentSkillIndex: 0,
    skillStates: [
      { name: "SQL", status: "verified" },
      { name: "Python", status: "missing" },
      { name: "Power BI", status: "pending-discovery" },
    ],
  });
  assert.equal(currentSkill.name, "Power BI");
});

test("session does not allow a new question while one is unanswered", async () => {
  const session = await startAdaptiveAssessment({
    profile: createProfile(["SQL"]),
    targetRole: "Data Analyst",
  });
  const result = await getNextAssessmentMessage(
    {
      ...session,
      currentQuestion: {
        type: "technical",
        questionId: "q1",
        skill: "SQL",
        question: "Existing question?",
        questionSource: "fallback",
      },
    },
  );
  assert.equal(result.message.questionId, "q1");
});

test("final verified score uses full role weights and does not rescale selected skills", async () => {
  const result = await finalizeAdaptiveAssessment({
    sessionId: "adaptive-1",
    role: { id: "data-analyst", name: "Data Analyst", description: "Role" },
    profileMatchScore: 90,
    skillStates: [
      { name: "SQL", roleWeight: 30, priority: "high", claimed: true, discovered: false, status: "verified", verifiedLevel: "strong", confidence: 0.55, averageScore: 80, questionsAsked: 1, successfulEvaluations: 1 },
      { name: "Python", roleWeight: 25, priority: "high", claimed: true, discovered: false, status: "verified", verifiedLevel: "intermediate", confidence: 0.55, averageScore: 60, questionsAsked: 1, successfulEvaluations: 1 },
      { name: "Power BI", roleWeight: 20, priority: "medium", claimed: false, discovered: false, status: "pending-discovery", verifiedLevel: null, confidence: 0, averageScore: null, questionsAsked: 0, successfulEvaluations: 0 },
    ],
    currentQuestion: null,
  });
  assert.equal(result.verifiedReadinessScore, 39);
});

test("discovered verified skills contribute to final score", async () => {
  const result = await finalizeAdaptiveAssessment({
    sessionId: "adaptive-2",
    role: { id: "data-analyst", name: "Data Analyst", description: "Role" },
    profileMatchScore: 90,
    skillStates: [
      { name: "Power BI", roleWeight: 20, priority: "medium", claimed: false, discovered: true, status: "verified", verifiedLevel: "strong", confidence: 0.55, averageScore: 80, questionsAsked: 1, successfulEvaluations: 1 },
    ],
    currentQuestion: null,
  });
  assert.equal(result.verifiedReadinessScore, 16);
});

test("missing skills contribute zero", async () => {
  const result = await finalizeAdaptiveAssessment({
    sessionId: "adaptive-3",
    role: { id: "data-analyst", name: "Data Analyst", description: "Role" },
    profileMatchScore: 90,
    skillStates: [
      { name: "Excel", roleWeight: 15, priority: "medium", claimed: false, discovered: false, status: "missing", verifiedLevel: "none", confidence: 1, averageScore: null, questionsAsked: 1, successfulEvaluations: 0 },
    ],
    currentQuestion: null,
  });
  assert.equal(result.verifiedReadinessScore, 0);
});

test("untested skills contribute zero", async () => {
  const result = await finalizeAdaptiveAssessment({
    sessionId: "adaptive-4",
    role: { id: "data-analyst", name: "Data Analyst", description: "Role" },
    profileMatchScore: 90,
    skillStates: [
      { name: "SQL", roleWeight: 30, priority: "high", claimed: true, discovered: false, status: "pending-verification", verifiedLevel: null, confidence: 0, averageScore: null, questionsAsked: 0, successfulEvaluations: 0 },
    ],
    currentQuestion: null,
  });
  assert.equal(result.verifiedReadinessScore, 0);
});

test("verification coverage uses only successfully evaluated role weights", async () => {
  const result = await finalizeAdaptiveAssessment({
    sessionId: "adaptive-5",
    role: { id: "data-analyst", name: "Data Analyst", description: "Role" },
    profileMatchScore: 90,
    skillStates: [
      { name: "SQL", roleWeight: 30, priority: "high", claimed: true, discovered: false, status: "verified", verifiedLevel: "strong", confidence: 0.55, averageScore: 80, questionsAsked: 1, successfulEvaluations: 1 },
      { name: "Python", roleWeight: 25, priority: "high", claimed: true, discovered: false, status: "in-assessment", verifiedLevel: null, confidence: 0, averageScore: null, questionsAsked: 1, successfulEvaluations: 0 },
    ],
    currentQuestion: null,
  });
  assert.equal(result.verificationCoverage, 30);
});

test("original session and profile are not mutated", async () => {
  const profile = createProfile(["SQL", "Python"]);
  const session = await startAdaptiveAssessment({
    profile,
    targetRole: "Data Analyst",
  });
  assert.deepEqual(profile, structuredClone(profile));
  assert.deepEqual(session, structuredClone(session));
});

test("profile match and verified readiness remain separate", async () => {
  const result = await finalizeAdaptiveAssessment({
    sessionId: "adaptive-6",
    role: { id: "data-analyst", name: "Data Analyst", description: "Role" },
    profileMatchScore: 90,
    skillStates: [
      { name: "SQL", roleWeight: 30, priority: "high", claimed: true, discovered: false, status: "verified", verifiedLevel: "intermediate", confidence: 0.55, averageScore: 50, questionsAsked: 1, successfulEvaluations: 1 },
    ],
    currentQuestion: null,
  });
  assert.equal(result.profileMatchScore, 90);
  assert.equal(result.verifiedReadinessScore, 15);
});
