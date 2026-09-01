import test from "node:test";
import assert from "node:assert/strict";
import { buildQualificationPath } from "../src/qualification/build-qualification-path.js";
import { buildVerifiedSkillMap } from "../src/qualification/build-verified-skill-map.js";
import {
  getSkillLevelGap,
  isLevelAtLeast,
  normalizeSkillLevel,
} from "../src/qualification/skill-levels.js";
import { buildStudentQualification } from "../src/services/build-student-qualification.js";
import { getRoleByName } from "../src/roles/get-role.js";

const frontendRole = getRoleByName("Frontend Developer");

function createSkillState(name, overrides = {}) {
  return {
    name,
    roleWeight: 20,
    priority: "medium",
    claimed: true,
    discovered: false,
    status: "in-assessment",
    verifiedLevel: null,
    estimatedLevel: null,
    confidence: 0,
    averageScore: null,
    questionsAsked: 0,
    successfulEvaluations: 0,
    evaluationScores: [],
    discoveryStatus: "not-needed",
    lastEvaluation: null,
    evidence: [],
    ...overrides,
  };
}

function createAssessmentResult(skillStates = []) {
  return {
    role: {
      id: frontendRole.id,
      name: frontendRole.name,
      description: frontendRole.description,
    },
    profileMatchScore: 70,
    verifiedReadinessScore: 40,
    verificationCoverage: 55,
    skillStates,
  };
}

function buildMapFor(skillState) {
  return buildVerifiedSkillMap({
    assessmentResult: createAssessmentResult([skillState]),
    role: frontendRole,
  });
}

function findSkill(skillMap, name) {
  return skillMap.find((skill) => skill.name === name);
}

function createQualificationSkill(overrides = {}) {
  return {
    name: "Skill",
    roleWeight: 10,
    priority: "medium",
    targetLevel: "beginner",
    state: "unknown",
    currentLevel: "none",
    confidence: 0,
    averageScore: null,
    claimed: false,
    discovered: false,
    assessmentEvidence: {},
    gapSeverity: "unknown",
    recommendedAction: "reassess",
    reason: "Not enough evidence.",
    ...overrides,
  };
}

function createFullyVerifiedStates() {
  return frontendRole.requiredSkills.map((skill) =>
    createSkillState(skill.name, {
      roleWeight: skill.weight,
      priority: skill.priority,
      status: "verified",
      averageScore: 60,
      successfulEvaluations: 1,
      evaluationScores: [60],
      confidence: 0.55,
    }),
  );
}

test("demonstrated level meeting the target becomes verified", () => {
  const react = findSkill(
    buildMapFor(createSkillState("React", { averageScore: 60, successfulEvaluations: 1 })),
    "React",
  );
  assert.equal(react.currentLevel, "intermediate");
  assert.equal(react.state, "verified");
});

test("demonstrated level below the target becomes needs-improvement", () => {
  const react = findSkill(
    buildMapFor(createSkillState("React", { averageScore: 40, successfulEvaluations: 1 })),
    "React",
  );
  assert.equal(react.currentLevel, "basic");
  assert.equal(react.state, "needs-improvement");
});

test("successful evaluation with none level becomes missing", () => {
  const react = findSkill(
    buildMapFor(createSkillState("React", { averageScore: 10, successfulEvaluations: 1 })),
    "React",
  );
  assert.equal(react.currentLevel, "none");
  assert.equal(react.state, "missing");
});

test("explicit no-exposure discovery becomes missing", () => {
  const react = findSkill(
    buildMapFor(
      createSkillState("React", {
        claimed: false,
        status: "missing",
        discoveryStatus: "no-usable-exposure",
        lastEvaluation: { evaluationStatus: "ai", exposure: "none" },
      }),
    ),
    "React",
  );
  assert.equal(react.state, "missing");
  assert.equal(react.confidence, 1);
});

test("unavailable discovery becomes unknown", () => {
  const react = findSkill(
    buildMapFor(
      createSkillState("React", {
        claimed: false,
        status: "pending-discovery",
        discoveryStatus: "unknown",
        lastEvaluation: { evaluationStatus: "unavailable", exposure: "unknown" },
      }),
    ),
    "React",
  );
  assert.equal(react.state, "unknown");
  assert.equal(react.confidence, 0);
});

test("unavailable technical evaluation without success becomes unknown", () => {
  const react = findSkill(
    buildMapFor(
      createSkillState("React", {
        lastEvaluation: { evaluationStatus: "unavailable" },
      }),
    ),
    "React",
  );
  assert.equal(react.state, "unknown");
});

test("successful evidence survives a later unavailable evaluation", () => {
  const react = findSkill(
    buildMapFor(
      createSkillState("React", {
        averageScore: 60,
        successfulEvaluations: 1,
        evaluationScores: [60],
        lastEvaluation: { evaluationStatus: "unavailable" },
      }),
    ),
    "React",
  );
  assert.equal(react.state, "verified");
  assert.equal(react.averageScore, 60);
  assert.equal(react.confidence, 0.55);
});

test("unknown skill recommends reassessment", () => {
  const react = findSkill(buildMapFor(createSkillState("React")), "React");
  assert.equal(react.recommendedAction, "reassess");
});

test("missing skill recommends learning", () => {
  const react = findSkill(
    buildMapFor(createSkillState("React", { status: "missing", discoveryStatus: "no-usable-exposure" })),
    "React",
  );
  assert.equal(react.recommendedAction, "learn");
});

test("needs-improvement skill recommends improvement", () => {
  const react = findSkill(
    buildMapFor(createSkillState("React", { averageScore: 40, successfulEvaluations: 1 })),
    "React",
  );
  assert.equal(react.recommendedAction, "improve");
});

test("verified skill recommends skip", () => {
  const react = findSkill(
    buildMapFor(createSkillState("React", { averageScore: 60, successfulEvaluations: 1 })),
    "React",
  );
  assert.equal(react.recommendedAction, "skip");
});

test("verified skills are excluded from active qualification items", () => {
  const skillMap = [
    createQualificationSkill({ state: "verified", recommendedAction: "skip" }),
    createQualificationSkill({ name: "Unknown", state: "unknown", recommendedAction: "reassess" }),
  ];
  const result = buildQualificationPath({ role: frontendRole, skillMap });
  assert.deepEqual(result.items.map((item) => item.skill), ["Unknown"]);
});

test("qualification ordering is deterministic", () => {
  const skillMap = [
    createQualificationSkill({ name: "B", roleWeight: 10, priority: "medium" }),
    createQualificationSkill({ name: "C", roleWeight: 20, priority: "medium" }),
    createQualificationSkill({ name: "A", roleWeight: 20, priority: "medium" }),
  ];
  const result = buildQualificationPath({ role: frontendRole, skillMap });
  assert.deepEqual(result.items.map((item) => item.skill), ["A", "C", "B"]);
  assert.deepEqual(result.items.map((item) => item.order), [1, 2, 3]);
});

test("missing high-priority skills rank before lower-priority improvement items", () => {
  const skillMap = [
    createQualificationSkill({
      name: "Improve Low",
      state: "needs-improvement",
      recommendedAction: "improve",
      priority: "low",
    }),
    createQualificationSkill({
      name: "Learn High",
      state: "missing",
      recommendedAction: "learn",
      priority: "high",
    }),
  ];
  const result = buildQualificationPath({ role: frontendRole, skillMap });
  assert.deepEqual(result.items.map((item) => item.skill), ["Learn High", "Improve Low"]);
});

test("final skill map contains every assessable required role skill", () => {
  const skillMap = buildVerifiedSkillMap({ assessmentResult: createAssessmentResult() });
  assert.equal(skillMap.length, frontendRole.requiredSkills.length);
  assert.deepEqual(skillMap.map((skill) => skill.name), frontendRole.requiredSkills.map((skill) => skill.name));
});

test("soft and non-assessable skills do not enter the technical qualification path", () => {
  const skillMap = buildVerifiedSkillMap({ assessmentResult: createAssessmentResult(), role: frontendRole });
  const nonAssessableNames = frontendRole.skills
    .filter((skill) => !skill.assessable)
    .map((skill) => skill.name);
  assert.equal(skillMap.some((skill) => nonAssessableNames.includes(skill.name)), false);
});

test("building the final skill map does not mutate the assessment result", () => {
  const assessmentResult = createAssessmentResult([
    createSkillState("React", { averageScore: 60, successfulEvaluations: 1 }),
  ]);
  const original = structuredClone(assessmentResult);
  buildVerifiedSkillMap({ assessmentResult, role: frontendRole });
  assert.deepEqual(assessmentResult, original);
});

test("building qualification output does not mutate the production role", () => {
  const original = structuredClone(frontendRole);
  buildStudentQualification({
    assessmentResult: createAssessmentResult(createFullyVerifiedStates()),
    targetRole: frontendRole.id,
  });
  assert.deepEqual(frontendRole, original);
});

test("readinessState is qualified when no gaps exist", () => {
  const assessmentResult = createAssessmentResult();
  assessmentResult.skillMap = createFullyVerifiedStates();
  delete assessmentResult.skillStates;
  const result = buildStudentQualification({
    assessmentResult,
    targetRole: frontendRole.id,
  });
  assert.equal(result.qualificationPath.readinessState, "qualified");
  assert.equal(result.profileMatchScore, 70);
  assert.equal(result.verifiedReadinessScore, 40);
  assert.equal(result.verificationCoverage, 55);
});

test("readinessState needs qualification when required skills are missing", () => {
  const states = createFullyVerifiedStates();
  states[0] = createSkillState(states[0].name, {
    status: "missing",
    discoveryStatus: "no-usable-exposure",
  });
  const result = buildStudentQualification({
    assessmentResult: createAssessmentResult(states),
    targetRole: frontendRole.name,
  });
  assert.equal(result.qualificationPath.readinessState, "needs-qualification");
});

test("partial evaluation does not remain in-assessment in final output", () => {
  const react = findSkill(
    buildMapFor(
      createSkillState("React", {
        status: "in-assessment",
        averageScore: 40,
        successfulEvaluations: 1,
        evaluationScores: [40],
        lastEvaluation: { evaluationStatus: "unavailable" },
      }),
    ),
    "React",
  );
  assert.equal(react.state, "needs-improvement");
  assert.notEqual(react.state, "in-assessment");
});

test("skill level normalization compares existing and production vocabularies", () => {
  assert.equal(normalizeSkillLevel("not-demonstrated"), "none");
  assert.equal(isLevelAtLeast("intermediate", "beginner"), true);
  assert.equal(isLevelAtLeast("basic", "beginner"), false);
});

test("needs-improvement severity reflects the normalized level gap", () => {
  assert.equal(getSkillLevelGap("basic", "beginner"), 1);
  assert.equal(getSkillLevelGap("basic", "intermediate"), 2);

  const javascript = findSkill(
    buildMapFor(createSkillState("JavaScript", { averageScore: 40, successfulEvaluations: 1 })),
    "JavaScript",
  );
  const react = findSkill(
    buildMapFor(createSkillState("React", { averageScore: 40, successfulEvaluations: 1 })),
    "React",
  );
  assert.equal(javascript.gapSeverity, "medium");
  assert.equal(react.gapSeverity, "high");
});

test("readinessState is nearly-qualified when only improvement or reassessment remains", () => {
  const skillMap = [
    createQualificationSkill({
      name: "Improve",
      state: "needs-improvement",
      recommendedAction: "improve",
    }),
    createQualificationSkill({ name: "Unknown", state: "unknown", recommendedAction: "reassess" }),
  ];
  const result = buildQualificationPath({ role: frontendRole, skillMap });
  assert.equal(result.readinessState, "nearly-qualified");
});
