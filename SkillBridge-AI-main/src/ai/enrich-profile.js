import { geminiClient } from "./gemini-client.js";
import { createProfileEnrichmentPrompt } from "../prompts/profile-enrichment-prompt.js";
import { parseAIJsonResponse } from "../utils/ai-response.js";

const PROFILE_ENRICHMENT_MODEL = "gemini-3.5-flash";

const profileEnrichmentSchema = {
  type: "object",
  additionalProperties: false,
  required: ["suggestedRoles", "summary"],
  properties: {
    suggestedRoles: {
      type: "array",
      items: { type: "string" },
    },
    summary: {
      type: "string",
    },
  },
};

export async function enrichProfile(profile) {
  if (typeof profile !== "object" || profile === null || Array.isArray(profile)) {
    throw new Error("Profile must be an object.");
  }

  const prompt = createProfileEnrichmentPrompt(profile);
  const response = await geminiClient.models.generateContent({
    model: PROFILE_ENRICHMENT_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: profileEnrichmentSchema,
    },
  });

  const enrichment = parseAIJsonResponse(response, "profile enrichment");

  return {
    ...profile,
    suggestedRoles: enrichment.suggestedRoles,
    summary: enrichment.summary,
  };
}
