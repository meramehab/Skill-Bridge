const TEMPORARY_AI_STATUSES = new Set(["429", "503"]);

export function getAIErrorStatus(error) {
  const directStatus = error?.status ?? error?.code;

  if (TEMPORARY_AI_STATUSES.has(String(directStatus))) {
    return String(directStatus);
  }

  if (typeof error?.message !== "string") {
    return null;
  }

  const statusMatch = error.message.match(/"(?:code|status)"\s*:\s*"?(429|503)"?/);

  if (statusMatch) {
    return statusMatch[1];
  }

  const wrappedStatusMatch = error.message.match(/temporarily unavailable \((429|503)\)/i);
  return wrappedStatusMatch?.[1] ?? null;
}

export function isTemporaryAIError(error) {
  return getAIErrorStatus(error) !== null;
}
