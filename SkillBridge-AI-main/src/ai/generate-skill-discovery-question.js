import { geminiClient } from "./gemini-client.js";
import { createSkillDiscoveryPrompt } from "../prompts/skill-discovery-prompt.js";
import { getAIErrorStatus } from "../utils/ai-errors.js";
import { parseAIJsonResponse } from "../utils/ai-response.js";

const DISCOVERY_MODEL = "gemini-3.5-flash";

const discoveryQuestionSchema = {
  type: "object",
  additionalProperties: false,
  required: ["skill", "question"],
  properties: {
    skill: { type: "string" },
    question: { type: "string" },
  },
};

export async function generateSkillDiscoveryQuestion(input) {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new Error("Discovery question input must be an object.");
  }

  if (typeof input.skill !== "string" || input.skill.trim() === "") {
    throw new Error("Discovery skill is required.");
  }

  try {
    const response = await geminiClient.models.generateContent({
      model: DISCOVERY_MODEL,
      contents: createSkillDiscoveryPrompt(input),
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: discoveryQuestionSchema,
      },
    });
    const parsedResponse = parseAIJsonResponse(response, "skill discovery");

    if (typeof parsedResponse.skill !== "string" || typeof parsedResponse.question !== "string") {
      throw new Error("Gemini returned an invalid skill discovery question structure.");
    }

    return {
      skill: parsedResponse.skill,
      question: parsedResponse.question,
      questionSource: "ai",
    };
  } catch (error) {
    const temporaryCode = getAIErrorStatus(error);

    if (!temporaryCode) {
      throw error;
    }

    return {
      skill: input.skill,
      question: `Have you ever studied or used ${input.skill} in a course, project, training, or personal practice? Briefly describe what you did.`,
      questionSource: "fallback",
    };
  }
}
