function getReadinessLabel(score) {
  if (score <= 29) {
    return "Starting";
  }

  if (score <= 59) {
    return "Developing";
  }

  if (score <= 79) {
    return "Nearly Ready";
  }

  return "Ready";
}

export function getProfileReadinessLevel(score) {
  return getReadinessLabel(score);
}

export function getVerifiedReadinessLevel(score) {
  return getReadinessLabel(score);
}
