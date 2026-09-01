import { applyMiniAssessmentResult } from "../learning/apply-mini-assessment-result.js";
import { buildLearningPlan } from "../learning/build-learning-plan.js";
import { updateLearningProgress } from "../learning/update-learning-progress.js";
import { refreshStudentQualification } from "./refresh-student-qualification.js";

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function createTimestamp() {
  return new Date().toISOString();
}

function getLearningPlanStatus(steps) {
  if (steps.length === 0 || steps.every((step) => step.status === "completed")) {
    return "completed";
  }

  return steps.some((step) => step.status !== "not-started") ? "in-progress" : "not-started";
}

function mergeLearningProgress(nextPlan, previousPlan) {
  const previousSteps = new Map(
    (previousPlan?.steps ?? []).map((step) => [step.skill, step]),
  );

  const steps = nextPlan.steps.map((step) => {
      const previousStep = previousSteps.get(step.skill);

    if (!previousStep) {
      return step;
    }

    return {
      ...step,
      status: previousStep.status,
      progressPercent: previousStep.progressPercent,
    };
  });

  return {
    ...nextPlan,
    status: getLearningPlanStatus(steps),
    steps,
  };
}

export function createStudentLearningJourney(input) {
  if (!isPlainObject(input)) {
    throw new Error("Student learning journey input must be an object.");
  }

  const qualification = input.qualification ?? input;
  const role = input.role ?? qualification.role;
  const skillMap = input.skillMap ?? qualification.skillMap;
  const qualificationPath = input.qualificationPath ?? qualification.qualificationPath;

  if (!isPlainObject(role) || !Array.isArray(skillMap) || !isPlainObject(qualificationPath)) {
    throw new Error("Student learning journey requires a role, skillMap, and qualificationPath.");
  }

  const learningPlan = buildLearningPlan({ qualificationPath, role });

  return {
    role: structuredClone(role),
    skillMap: structuredClone(skillMap),
    qualificationPath: structuredClone(qualificationPath),
    learningPlan,
    assessmentHistory: [],
    updatedAt: createTimestamp(),
  };
}

export function updateStudentLearningJourneyProgress(journey, input) {
  if (!isPlainObject(journey)) {
    throw new Error("Student learning journey must be an object.");
  }

  return {
    ...structuredClone(journey),
    learningPlan: updateLearningProgress(journey.learningPlan, input),
    updatedAt: createTimestamp(),
  };
}

export function applyStudentMiniAssessment(journey, result) {
  if (!isPlainObject(journey) || !isPlainObject(result)) {
    throw new Error("Student learning journey and mini assessment result must be objects.");
  }

  const appliedResult = applyMiniAssessmentResult(journey.learningPlan, journey.skillMap, result);

  return {
    ...structuredClone(journey),
    skillMap: appliedResult.skillMap,
    learningPlan: appliedResult.plan,
    assessmentHistory: [...structuredClone(journey.assessmentHistory ?? []), structuredClone(result)],
    updatedAt: createTimestamp(),
  };
}

export function refreshStudentLearningJourney(journey) {
  if (!isPlainObject(journey)) {
    throw new Error("Student learning journey must be an object.");
  }

  const qualification = refreshStudentQualification({
    role: journey.role,
    previousQualification: {
      role: journey.role,
      skillMap: journey.skillMap,
      qualificationPath: journey.qualificationPath,
    },
    updatedSkillMap: journey.skillMap,
  });
  const rebuiltPlan = buildLearningPlan({
    qualificationPath: qualification.qualificationPath,
    role: journey.role,
  });

  return {
    ...structuredClone(journey),
    skillMap: qualification.skillMap,
    qualificationPath: qualification.qualificationPath,
    learningPlan: mergeLearningProgress(rebuiltPlan, journey.learningPlan),
    updatedAt: createTimestamp(),
  };
}
