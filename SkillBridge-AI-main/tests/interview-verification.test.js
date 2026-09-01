import test from "node:test";
import assert from "node:assert/strict";
import { getRoleByName } from "../src/roles/get-role.js";
import { getFallbackQuestion } from "../src/interview/get-fallback-question.js";
import { createInterviewSession } from "../src/interview/create-interview-session.js";
import { selectInterviewSkills } from "../src/interview/select-interview-skills.js";
import {
  finalizeInterview,
  getNextInterviewQuestion,
  startInterview,
  submitInterviewAnswer,
} from "../src/services/interview-session-service.js";

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

test("selects high-priority matched skills first", () => {
  const role = getRoleByName("Data Analyst");
  const profile = createProfile(["SQL", "Python", "Power BI", "Excel", "Git"]);

  const result = selectInterviewSkills(profile, role, { maxSkills: 3 });

  assert.deepEqual(result.selectedSkills.map((skill) => skill.name), ["SQL", "Python", "Power BI"]);
});

test("does not select missing skills", () => {
  const role = getRoleByName("Data Analyst");
  const profile = createProfile(["Python"]);

  const result = selectInterviewSkills(profile, role, { maxSkills: 3 });

  assert.deepEqual(result.selectedSkills.map((skill) => skill.name), ["Python"]);
});

test("maxSkills is respected", () => {
  const role = getRoleByName("Data Analyst");
  const profile = createProfile(["SQL", "Python", "Power BI"]);

  const result = selectInterviewSkills(profile, role, { maxSkills: 2 });

  assert.equal(result.selectedSkills.length, 2);
});

test("fallback question does not repeat excluded question ids", () => {
  const question = getFallbackQuestion("SQL", ["sql-1"]);

  assert.equal(question.id, "sql-2");
});

test("interview session creation does not mutate profile", () => {
  const profile = createProfile(["SQL", "Python"]);
  const originalClone = structuredClone(profile);

  createInterviewSession({
    profile,
    targetRole: "Data Analyst",
    maxSkills: 2,
  });

  assert.deepEqual(profile, originalClone);
});

test("session with no claimed matched skills has no-claimed-skills status", () => {
  const session = createInterviewSession({
    profile: createProfile(["Public Speaking"]),
    targetRole: "Data Analyst",
    maxSkills: 2,
  });

  assert.equal(session.status, "no-claimed-skills");
});

test("submitting an answer rejects an unknown question id", async () => {
  const session = await startInterview({
    profile: createProfile(["SQL"]),
    targetRole: "Data Analyst",
    maxSkills: 1,
  });
  const { session: questionSession } = await getNextInterviewQuestion(session, {
    async generateInterviewQuestion() {
      return {
        questionId: "sql-custom",
        skill: "SQL",
        difficulty: "beginner",
        question: "Test question?",
        expectedConcepts: ["GROUP BY"],
        followUpHint: "Think about grouping.",
        questionSource: "fallback",
      };
    },
  });

  await assert.rejects(
    () =>
      submitInterviewAnswer(
        questionSession,
        { questionId: "wrong-id", answer: "My answer" },
        {
          async evaluateInterviewAnswer() {
            throw new Error("Should not be called.");
          },
        },
      ),
    /latest unanswered interview question/i,
  );
});

test("blank answer is rejected", async () => {
  const session = await startInterview({
    profile: createProfile(["SQL"]),
    targetRole: "Data Analyst",
    maxSkills: 1,
  });
  const { session: questionSession, question } = await getNextInterviewQuestion(session, {
    async generateInterviewQuestion() {
      return {
        questionId: "sql-custom",
        skill: "SQL",
        difficulty: "beginner",
        question: "Test question?",
        expectedConcepts: ["GROUP BY"],
        followUpHint: "Think about grouping.",
        questionSource: "fallback",
      };
    },
  });

  await assert.rejects(
    () =>
      submitInterviewAnswer(
        questionSession,
        { questionId: question.questionId, answer: "   " },
        {
          async evaluateInterviewAnswer() {
            throw new Error("Should not be called.");
          },
        },
      ),
    /cannot be blank/i,
  );
});

test("deterministic final score formula is correct", async () => {
  const session = {
    sessionId: "session-1",
    status: "ready",
    role: {
      id: "data-analyst",
      name: "Data Analyst",
      description: "Role",
      requiredSkills: [
        { name: "SQL", weight: 30, priority: "high" },
        { name: "Python", weight: 25, priority: "high" },
        { name: "Power BI", weight: 20, priority: "medium" },
        { name: "Excel", weight: 15, priority: "medium" },
        { name: "Git", weight: 10, priority: "low" },
      ],
    },
    profileMatchScore: 100,
    selectedSkills: [
      { name: "SQL", weight: 30, priority: "high", evidence: [] },
      { name: "Python", weight: 25, priority: "high", evidence: [] },
    ],
    currentSkillIndex: 2,
    questions: [],
    answers: [],
    evaluations: [
      {
        questionId: "q1",
        skill: "SQL",
        weight: 30,
        priority: "high",
        evaluationStatus: "ai",
        score: 80,
        demonstratedLevel: "strong",
        strengths: [],
        gaps: [],
        feedback: "",
        needsFollowUp: false,
        followUpFocus: null,
      },
      {
        questionId: "q2",
        skill: "Python",
        weight: 25,
        priority: "high",
        evaluationStatus: "ai",
        score: 60,
        demonstratedLevel: "intermediate",
        strengths: [],
        gaps: [],
        feedback: "",
        needsFollowUp: false,
        followUpFocus: null,
      },
    ],
    createdAt: new Date().toISOString(),
  };

  const result = await finalizeInterview(session);

  assert.equal(result.verifiedReadinessScore, 39);
});

test("unavailable evaluations contribute zero", async () => {
  const session = {
    sessionId: "session-2",
    status: "ready",
    role: {
      id: "data-analyst",
      name: "Data Analyst",
      description: "Role",
      requiredSkills: [{ name: "SQL", weight: 30, priority: "high" }],
    },
    profileMatchScore: 30,
    selectedSkills: [{ name: "SQL", weight: 30, priority: "high", evidence: [] }],
    currentSkillIndex: 1,
    questions: [],
    answers: [],
    evaluations: [
      {
        questionId: "q1",
        skill: "SQL",
        weight: 30,
        priority: "high",
        evaluationStatus: "unavailable",
        score: null,
        demonstratedLevel: "not-evaluated",
        strengths: [],
        gaps: [],
        feedback: "",
        needsFollowUp: false,
        followUpFocus: null,
      },
    ],
    createdAt: new Date().toISOString(),
  };

  const result = await finalizeInterview(session);

  assert.equal(result.verifiedReadinessScore, 0);
});

test("untested skills contribute zero", async () => {
  const session = {
    sessionId: "session-3",
    status: "ready",
    role: {
      id: "data-analyst",
      name: "Data Analyst",
      description: "Role",
      requiredSkills: [{ name: "SQL", weight: 30, priority: "high" }],
    },
    profileMatchScore: 30,
    selectedSkills: [{ name: "SQL", weight: 30, priority: "high", evidence: [] }],
    currentSkillIndex: 0,
    questions: [],
    answers: [],
    evaluations: [],
    createdAt: new Date().toISOString(),
  };

  const result = await finalizeInterview(session);

  assert.equal(result.verifiedReadinessScore, 0);
});

test("verification coverage is calculated from successfully evaluated role weights", async () => {
  const session = {
    sessionId: "session-4",
    status: "ready",
    role: {
      id: "data-analyst",
      name: "Data Analyst",
      description: "Role",
      requiredSkills: [
        { name: "SQL", weight: 30, priority: "high" },
        { name: "Python", weight: 25, priority: "high" },
        { name: "Power BI", weight: 20, priority: "medium" },
        { name: "Excel", weight: 15, priority: "medium" },
        { name: "Git", weight: 10, priority: "low" },
      ],
    },
    profileMatchScore: 100,
    selectedSkills: [
      { name: "SQL", weight: 30, priority: "high", evidence: [] },
      { name: "Python", weight: 25, priority: "high", evidence: [] },
    ],
    currentSkillIndex: 2,
    questions: [],
    answers: [],
    evaluations: [
      {
        questionId: "q1",
        skill: "SQL",
        weight: 30,
        priority: "high",
        evaluationStatus: "ai",
        score: 80,
        demonstratedLevel: "strong",
        strengths: [],
        gaps: [],
        feedback: "",
        needsFollowUp: false,
        followUpFocus: null,
      },
      {
        questionId: "q2",
        skill: "Python",
        weight: 25,
        priority: "high",
        evaluationStatus: "unavailable",
        score: null,
        demonstratedLevel: "not-evaluated",
        strengths: [],
        gaps: [],
        feedback: "",
        needsFollowUp: false,
        followUpFocus: null,
      },
    ],
    createdAt: new Date().toISOString(),
  };

  const result = await finalizeInterview(session);

  assert.equal(result.verificationCoverage, 30);
});

test("verified readiness level boundaries are correct", async () => {
  const session = {
    sessionId: "session-5",
    status: "ready",
    role: {
      id: "test-role",
      name: "Test Role",
      description: "Role",
      requiredSkills: [
        { name: "Skill A", weight: 30, priority: "high" },
        { name: "Skill B", weight: 30, priority: "high" },
        { name: "Skill C", weight: 20, priority: "medium" },
        { name: "Skill D", weight: 20, priority: "low" },
      ],
    },
    profileMatchScore: 100,
    selectedSkills: [
      { name: "Skill A", weight: 30, priority: "high", evidence: [] },
      { name: "Skill B", weight: 30, priority: "high", evidence: [] },
      { name: "Skill C", weight: 20, priority: "medium", evidence: [] },
    ],
    currentSkillIndex: 3,
    questions: [],
    answers: [],
    evaluations: [],
    createdAt: new Date().toISOString(),
  };

  session.evaluations = [{ questionId: "q1", skill: "Skill A", weight: 30, priority: "high", evaluationStatus: "ai", score: 100, demonstratedLevel: "strong", strengths: [], gaps: [], feedback: "", needsFollowUp: false, followUpFocus: null }];
  assert.equal((await finalizeInterview(session)).verifiedReadinessLevel, "Developing");

  session.evaluations = [
    { questionId: "q1", skill: "Skill A", weight: 30, priority: "high", evaluationStatus: "ai", score: 100, demonstratedLevel: "strong", strengths: [], gaps: [], feedback: "", needsFollowUp: false, followUpFocus: null },
    { questionId: "q2", skill: "Skill B", weight: 30, priority: "high", evaluationStatus: "ai", score: 100, demonstratedLevel: "strong", strengths: [], gaps: [], feedback: "", needsFollowUp: false, followUpFocus: null },
  ];
  assert.equal((await finalizeInterview(session)).verifiedReadinessLevel, "Nearly Ready");

  session.evaluations = [
    { questionId: "q1", skill: "Skill A", weight: 30, priority: "high", evaluationStatus: "ai", score: 100, demonstratedLevel: "strong", strengths: [], gaps: [], feedback: "", needsFollowUp: false, followUpFocus: null },
    { questionId: "q2", skill: "Skill B", weight: 30, priority: "high", evaluationStatus: "ai", score: 100, demonstratedLevel: "strong", strengths: [], gaps: [], feedback: "", needsFollowUp: false, followUpFocus: null },
    { questionId: "q3", skill: "Skill C", weight: 20, priority: "medium", evaluationStatus: "ai", score: 100, demonstratedLevel: "strong", strengths: [], gaps: [], feedback: "", needsFollowUp: false, followUpFocus: null },
  ];
  assert.equal((await finalizeInterview(session)).verifiedReadinessLevel, "Ready");
});

test("original session is not mutated", async () => {
  const session = await startInterview({
    profile: createProfile(["SQL"]),
    targetRole: "Data Analyst",
    maxSkills: 1,
  });
  const sessionWithQuestion = await getNextInterviewQuestion(session, {
    async generateInterviewQuestion() {
      return {
        questionId: "sql-custom",
        skill: "SQL",
        difficulty: "beginner",
        question: "Test question?",
        expectedConcepts: ["GROUP BY"],
        followUpHint: "Think about grouping.",
        questionSource: "fallback",
      };
    },
  });
  const originalClone = structuredClone(sessionWithQuestion.session);

  await submitInterviewAnswer(
    sessionWithQuestion.session,
    { questionId: "sql-custom", answer: "Use GROUP BY with SUM." },
    {
      async evaluateInterviewAnswer() {
        return {
          evaluationStatus: "ai",
          score: 80,
          demonstratedLevel: "strong",
          strengths: ["Knows grouping."],
          gaps: [],
          feedback: "Good answer.",
          needsFollowUp: false,
          followUpFocus: null,
        };
      },
    },
  );

  assert.deepEqual(sessionWithQuestion.session, originalClone);
});

test("profile match score and verified readiness score remain separate values", async () => {
  const session = {
    sessionId: "session-6",
    status: "ready",
    role: {
      id: "data-analyst",
      name: "Data Analyst",
      description: "Role",
      requiredSkills: [{ name: "SQL", weight: 30, priority: "high" }],
    },
    profileMatchScore: 100,
    selectedSkills: [{ name: "SQL", weight: 30, priority: "high", evidence: [] }],
    currentSkillIndex: 1,
    questions: [],
    answers: [],
    evaluations: [
      {
        questionId: "q1",
        skill: "SQL",
        weight: 30,
        priority: "high",
        evaluationStatus: "ai",
        score: 50,
        demonstratedLevel: "intermediate",
        strengths: [],
        gaps: [],
        feedback: "",
        needsFollowUp: false,
        followUpFocus: null,
      },
    ],
    createdAt: new Date().toISOString(),
  };

  const result = await finalizeInterview(session);

  assert.equal(result.profileMatchScore, 100);
  assert.equal(result.verifiedReadinessScore, 15);
});
