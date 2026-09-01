import { geminiClient } from "./gemini-client.js";
import { createLearningPrioritiesPrompt } from "../prompts/learning-priorities-prompt.js";
import { parseAIJsonResponse } from "../utils/ai-response.js";

const LEARNING_PRIORITIES_MODEL = "gemini-3.5-flash";

const learningPrioritiesSchema = {
  type: "object",
  additionalProperties: false,
  required: ["overview", "nextSteps"],
  properties: {
    overview: { type: "string" },
    nextSteps: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "skill", "reason", "action", "priority"],
        properties: {
          title: { type: "string" },
          skill: { type: "string" },
          reason: { type: "string" },
          action: { type: "string" },
          priority: { type: "string", enum: ["high", "medium", "low"] },
        },
      },
    },
  },
};

export async function generateLearningPriorities(profile, readinessResult) {
  if (typeof profile !== "object" || profile === null || Array.isArray(profile)) {
    throw new Error("Profile must be an object.");
  }

  if (typeof readinessResult !== "object" || readinessResult === null || Array.isArray(readinessResult)) {
    throw new Error("Readiness result must be an object.");
  }

  const prompt = createLearningPrioritiesPrompt({
    targetRole: readinessResult.role,
    matchedSkills: readinessResult.matchedSkills,
    missingSkills: readinessResult.missingSkills,
    readinessScore: readinessResult.readinessScore,
    projects: profile.projects ?? [],
    education: profile.education ?? [],
  });

  const response = await geminiClient.models.generateContent({
    model: LEARNING_PRIORITIES_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: learningPrioritiesSchema,
    },
  });

  const parsedResponse = parseAIJsonResponse(response, "learning priorities");

  if (typeof parsedResponse.overview !== "string" || !Array.isArray(parsedResponse.nextSteps)) {
    throw new Error("Gemini returned an invalid learning-priorities structure.");
  }

  return {
    overview: parsedResponse.overview,
    nextSteps: parsedResponse.nextSteps.slice(0, 5),
  };
}
