import { geminiClient } from "./gemini-client.js";
import { createInterviewAnswerEvaluationPrompt } from "../prompts/evaluate-interview-answer-prompt.js";
import { getAIErrorStatus } from "../utils/ai-errors.js";
import { parseAIJsonResponse } from "../utils/ai-response.js";

const INTERVIEW_ANSWER_MODEL = "gemini-3.5-flash";

const interviewAnswerSchema = {
  type: "object",
  additionalProperties: false,
  required: ["score", "demonstratedLevel", "strengths", "gaps", "feedback", "needsFollowUp", "followUpFocus"],
  properties: {
    score: { type: "number" },
    demonstratedLevel: {
      type: "string",
      enum: ["not-demonstrated", "basic", "intermediate", "strong"],
    },
    strengths: { type: "array", items: { type: "string" } },
    gaps: { type: "array", items: { type: "string" } },
    feedback: { type: "string" },
    needsFollowUp: { type: "boolean" },
    followUpFocus: { type: ["string", "null"] },
  },
};

function getDemonstratedLevel(score) {
  if (score <= 24) {
    return "not-demonstrated";
  }

  if (score <= 49) {
    return "basic";
  }

  if (score <= 74) {
    return "intermediate";
  }

  return "strong";
}

export async function evaluateInterviewAnswer(input) {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new Error("Interview answer input must be an object.");
  }

  if (typeof input.skill !== "string" || input.skill.trim() === "") {
    throw new Error("Interview skill is required.");
  }

  if (typeof input.question !== "string" || input.question.trim() === "") {
    throw new Error("Interview question is required.");
  }

  if (typeof input.answer !== "string" || input.answer.trim() === "") {
    throw new Error("Interview answer is required and cannot be empty.");
  }

  try {
    const prompt = createInterviewAnswerEvaluationPrompt(input);
    const response = await geminiClient.models.generateContent({
      model: INTERVIEW_ANSWER_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: interviewAnswerSchema,
      },
    });
    const parsedEvaluation = parseAIJsonResponse(response, "interview answer evaluation");
    const normalizedScore = Math.max(0, Math.min(100, Math.round(Number(parsedEvaluation.score))));

    if (
      !Array.isArray(parsedEvaluation.strengths) ||
      !Array.isArray(parsedEvaluation.gaps) ||
      typeof parsedEvaluation.feedback !== "string" ||
      typeof parsedEvaluation.needsFollowUp !== "boolean"
    ) {
      throw new Error("Gemini returned an invalid interview evaluation structure.");
    }

    return {
      evaluationStatus: "ai",
      score: normalizedScore,
      demonstratedLevel: getDemonstratedLevel(normalizedScore),
      strengths: parsedEvaluation.strengths,
      gaps: parsedEvaluation.gaps,
      feedback: parsedEvaluation.feedback,
      needsFollowUp: parsedEvaluation.needsFollowUp,
      followUpFocus:
        parsedEvaluation.followUpFocus === null || typeof parsedEvaluation.followUpFocus === "string"
          ? parsedEvaluation.followUpFocus
          : null,
    };
  } catch (error) {
    const temporaryCode = getAIErrorStatus(error);

    if (!temporaryCode) {
      throw error;
    }

    return {
      evaluationStatus: "unavailable",
      score: null,
      demonstratedLevel: "not-evaluated",
      strengths: [],
      gaps: [],
      feedback: "AI evaluation is temporarily unavailable.",
      needsFollowUp: false,
      followUpFocus: null,
    };
  }
}
