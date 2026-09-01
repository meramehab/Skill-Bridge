import { randomUUID } from "node:crypto";

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function createMiniAssessment(input) {
  if (
    !isPlainObject(input) ||
    !isPlainObject(input.learningStep) ||
    !isPlainObject(input.role) ||
    (typeof input.skill !== "string" && !isPlainObject(input.skill))
  ) {
    throw new Error("Mini assessment input must contain a learningStep, role, and skill.");
  }

  if (input.learningStep.status !== "awaiting-assessment") {
    throw new Error("Mini assessment can only start after learning is completed.");
  }

  const skillName = typeof input.skill === "string" ? input.skill : input.skill.name;

  if (typeof skillName !== "string" || skillName.trim() === "") {
    throw new Error("Mini assessment skill is required.");
  }

  const questionLimit = input.questionLimit ?? 2;

  if (!Number.isInteger(questionLimit) || questionLimit < 1 || questionLimit > 3) {
    throw new Error("questionLimit must be an integer between 1 and 3.");
  }

  return {
    assessmentId: randomUUID(),
    skill: skillName.trim(),
    targetLevel: input.learningStep.targetLevel,
    status: "ready",
    questions: [],
    answers: [],
    evaluations: [],
    createdAt: new Date().toISOString(),
    role: {
      id: input.role.id,
      name: input.role.name,
      description: input.role.description,
    },
    learningStepId: input.learningStep.id,
    questionLimit,
  };
}
