function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getPlanStatus(steps) {
  if (steps.length === 0 || steps.every((step) => step.status === "completed")) {
    return "completed";
  }

  if (steps.some((step) => step.status !== "not-started")) {
    return "in-progress";
  }

  return "not-started";
}

export function updateLearningProgress(plan, input) {
  if (!isPlainObject(plan) || !Array.isArray(plan.steps)) {
    throw new Error("Learning plan must be a valid plan object.");
  }

  if (!isPlainObject(input) || typeof input.stepId !== "string" || typeof input.action !== "string") {
    throw new Error("Learning progress input must contain a stepId and action.");
  }

  const nextPlan = structuredClone(plan);
  const step = nextPlan.steps.find((item) => item.id === input.stepId);

  if (!step) {
    throw new Error(`Learning step not found: ${input.stepId}`);
  }

  if (input.action === "start_step") {
    if (step.status !== "not-started") {
      throw new Error("Only a not-started learning step can be started.");
    }

    step.status = "in-progress";
  } else if (input.action === "update_progress") {
    if (step.status !== "in-progress") {
      throw new Error("Progress can only be updated for an in-progress learning step.");
    }

    if (!Number.isInteger(input.progressPercent) || input.progressPercent < 0 || input.progressPercent > 100) {
      throw new Error("progressPercent must be an integer from 0 to 100.");
    }

    step.progressPercent = input.progressPercent;
  } else if (input.action === "complete_learning") {
    if (step.status !== "in-progress") {
      throw new Error("Only an in-progress learning step can complete learning.");
    }

    step.progressPercent = 100;
    step.status = "awaiting-assessment";
  } else if (input.action === "reset_step") {
    step.status = "not-started";
    step.progressPercent = 0;
  } else {
    throw new Error(`Unsupported learning progress action: ${input.action}`);
  }

  nextPlan.status = getPlanStatus(nextPlan.steps);
  return nextPlan;
}
