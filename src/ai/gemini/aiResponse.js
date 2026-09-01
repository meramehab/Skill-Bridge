// تحليل رد Gemini النصي وتحويله لـ JSON

const parseAIJsonResponse = (response, purpose) => {
  const responseText = response?.text?.trim();
  if (!responseText) {
    throw new Error(`Gemini رجّع رد فاضي لـ ${purpose}.`);
  }
  try {
    return JSON.parse(responseText);
  } catch {
    throw new Error(`Gemini رجّع JSON غير صالح لـ ${purpose}.`);
  }
};

module.exports = { parseAIJsonResponse };
