import { geminiClient } from "./gemini-client.js";
import { createSkillDiscoveryEvaluationPrompt } from "../prompts/evaluate-skill-discovery-answer-prompt.js";
import { getAIErrorStatus } from "../utils/ai-errors.js";
import { parseAIJsonResponse } from "../utils/ai-response.js";

const DISCOVERY_EVALUATION_MODEL = "gemini-3.5-flash";

const discoveryEvaluationSchema = {
  type: "object",
  additionalProperties: false,
  required: ["exposure", "shouldVerify", "evidenceSummary"],
  properties: {
    exposure: { type: "string", enum: ["none", "heard-of", "studied", "practiced"] },
    shouldVerify: { type: "boolean" },
    evidenceSummary: { type: "string" },
  },
};

export async function evaluateSkillDiscoveryAnswer(input) {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new Error("Discovery evaluation input must be an object.");
  }

  if (typeof input.studentAnswer !== "string" || input.studentAnswer.trim() === "") {
    throw new Error("Discovery answer is required and cannot be empty.");
  }

  try {
    const response = await geminiClient.models.generateContent({
      model: DISCOVERY_EVALUATION_MODEL,
      contents: createSkillDiscoveryEvaluationPrompt(input),
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: discoveryEvaluationSchema,
      },
    });
    const parsedResponse = parseAIJsonResponse(response, "skill discovery evaluation");

    if (
      !["none", "heard-of", "studied", "practiced"].includes(parsedResponse.exposure) ||
      typeof parsedResponse.evidenceSummary !== "string"
    ) {
      throw new Error("Gemini returned an invalid skill discovery evaluation structure.");
    }

    return {
      evaluationStatus: "ai",
      exposure: parsedResponse.exposure,
      shouldVerify: parsedResponse.exposure === "studied" || parsedResponse.exposure === "practiced",
      evidenceSummary: parsedResponse.evidenceSummary,
    };
  } catch (error) {
    const temporaryCode = getAIErrorStatus(error);

    if (!temporaryCode) {
      throw error;
    }

    return {
      evaluationStatus: "unavailable",
      exposure: "unknown",
      shouldVerify: false,
      evidenceSummary: "",
    };
  }
}
