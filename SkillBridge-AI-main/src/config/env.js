const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  throw new Error("Missing GEMINI_API_KEY. Please add it to your .env file before running the app.");
}

export const config = {
  geminiApiKey,
};
