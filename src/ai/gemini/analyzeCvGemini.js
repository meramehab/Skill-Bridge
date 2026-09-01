// تحليل الـ CV بـ Gemini

const { getGeminiClient } = require('./geminiClient');
const { createCVAnalysisPrompt, cvAnalysisSchema } = require('./cvAnalysisPrompt');
const { parseAIJsonResponse } = require('./aiResponse');
const { extractTextFromPDF } = require('../cvParser');

// اسم موديل Gemini المستخدم في تحليل الـ CV
const CV_ANALYSIS_MODEL = process.env.GEMINI_CV_MODEL || 'gemini-3.5-flash';

const analyzeCVTextWithGemini = async (cvText) => {
  if (typeof cvText !== 'string' || cvText.trim() === '') {
    throw new Error('نص الـ CV مطلوب ومينفعش يكون فاضي');
  }

  const client = await getGeminiClient();
  const prompt = createCVAnalysisPrompt(cvText.trim());

  const response = await client.models.generateContent({
    model: CV_ANALYSIS_MODEL,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseJsonSchema: cvAnalysisSchema,
    },
  });

  return {
    ...parseAIJsonResponse(response, 'تحليل الـ CV'),
    profileSource: 'cv',
  };
};

const analyzeCVFileWithGemini = async (filePath) => {
  const cvText = await extractTextFromPDF(filePath);
  return analyzeCVTextWithGemini(cvText);
};

module.exports = { analyzeCVTextWithGemini, analyzeCVFileWithGemini };
