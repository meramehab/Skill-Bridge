import { geminiClient } from "./gemini-client.js";
import { getFallbackQuestion } from "../interview/get-fallback-question.js";
import { createInterviewQuestionPrompt } from "../prompts/interview-question-prompt.js";
import { getAIErrorStatus } from "../utils/ai-errors.js";
import { parseAIJsonResponse } from "../utils/ai-response.js";

const INTERVIEW_QUESTION_MODEL = "gemini-3.5-flash";

const interviewQuestionSchema = {
  type: "object",
  additionalProperties: false,
  required: ["questionId", "skill", "difficulty", "question", "expectedConcepts", "followUpHint"],
  properties: {
    questionId: { type: "string" },
    skill: { type: "string" },
    difficulty: { type: "string", enum: ["beginner", "intermediate", "advanced"] },
    question: { type: "string" },
    expectedConcepts: {
      type: "array",
      items: { type: "string" },
    },
    followUpHint: { type: "string" },
  },
};

function normalizeQuestion(question) {
  if (
    typeof question?.questionId !== "string" ||
    typeof question?.skill !== "string" ||
    typeof question?.question !== "string" ||
    !Array.isArray(question?.expectedConcepts) ||
    typeof question?.followUpHint !== "string"
  ) {
    throw new Error("Gemini returned an invalid interview question structure.");
  }

  if (!["beginner", "intermediate", "advanced"].includes(question.difficulty)) {
    throw new Error("Gemini returned an invalid interview question difficulty.");
  }

  return question;
}

export async function generateInterviewQuestion(input) {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new Error("Interview question input must be an object.");
  }

  if (typeof input.skill !== "string" || input.skill.trim() === "") {
    throw new Error("Interview skill is required.");
  }

  const fallbackQuestion = getFallbackQuestion(input.skill, input.previousQuestionIds ?? []);

  try {
    const prompt = createInterviewQuestionPrompt(input);
    const response = await geminiClient.models.generateContent({
      model: INTERVIEW_QUESTION_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: interviewQuestionSchema,
      },
    });
    const parsedQuestion = normalizeQuestion(
      parseAIJsonResponse(response, "interview question generation"),
    );

    return {
      ...parsedQuestion,
      questionSource: "ai",
    };
  } catch (error) {
    const temporaryCode = getAIErrorStatus(error);

    if (!temporaryCode) {
      throw error;
    }

    if (!fallbackQuestion) {
      throw new Error(`Interview question generation is temporarily unavailable (${temporaryCode}).`);
    }

    return {
      questionId: fallbackQuestion.id,
      skill: fallbackQuestion.skill,
      difficulty: fallbackQuestion.difficulty,
      question: fallbackQuestion.question,
      expectedConcepts: [...fallbackQuestion.expectedConcepts],
      followUpHint: fallbackQuestion.followUpHint,
      questionSource: "fallback",
    };
  }
}
