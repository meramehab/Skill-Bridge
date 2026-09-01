// عميل Gemini قابل لإعادة الاستخدام - نسخة CommonJS من الكود الأصلي بتاع زميلك (كان ES Modules)
// @google/genai مكتبة ESM بحتة، فبنعملها import ديناميكي جوه دالة async
// (طريقة قياسية ومدعومة رسميًا للتعامل مع مكتبات ESM من مشروع CommonJS)

let clientPromise = null;

const getGeminiClient = async () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('لازم تضيف GEMINI_API_KEY في ملف .env قبل ما تستخدم تحليل Gemini');
  }

  if (!clientPromise) {
    clientPromise = import('@google/genai').then(({ GoogleGenAI }) => {
      return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    });
  }

  return clientPromise;
};

module.exports = { getGeminiClient };
