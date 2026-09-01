import { geminiClient } from "./gemini-client.js";
import { createCVAnalysisPrompt } from "../prompts/cv-analysis-prompt.js";
import { cvAnalysisSchema } from "../schemas/cv-analysis-schema.js";
import { parseAIJsonResponse } from "../utils/ai-response.js";

const CV_ANALYSIS_MODEL = "gemini-3.5-flash";

export async function analyzeCVText(cvText) {
  if (typeof cvText !== "string" || cvText.trim() === "") {
    throw new Error("CV text is required and must be a non-empty string.");
  }

  const prompt = createCVAnalysisPrompt(cvText.trim());

  const response = await geminiClient.models.generateContent({
    model: CV_ANALYSIS_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: cvAnalysisSchema,
    },
  });

  return {
    ...parseAIJsonResponse(response, "the CV analysis"),
    profileSource: "cv",
  };
}
