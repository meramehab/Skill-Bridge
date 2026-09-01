export function parseAIJsonResponse(response, purpose) {
  const responseText = response?.text?.trim();

  if (!responseText) {
    throw new Error(`Gemini returned an empty response for ${purpose}.`);
  }

  try {
    return JSON.parse(responseText);
  } catch {
    throw new Error(`Gemini returned invalid JSON for ${purpose}.`);
  }
}
