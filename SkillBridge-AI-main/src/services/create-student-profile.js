function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function loadDefaultDependencies() {
  const [
    { normalizeManualProfile },
    { enrichProfile },
    { analyzeCVText },
    { analyzeCVFile },
  ] = await Promise.all([
    import("../manual/normalize-manual-profile.js"),
    import("../ai/enrich-profile.js"),
    import("../ai/analyze-cv.js"),
    import("../ai/analyze-cv-file.js"),
  ]);

  return {
    normalizeManualProfile,
    enrichProfile,
    analyzeCVText,
    analyzeCVFile,
  };
}

export async function createStudentProfile(options, dependencies) {
  if (!isPlainObject(options)) {
    throw new Error("Profile options must be an object.");
  }

  if (typeof options.source !== "string" || options.source.trim() === "") {
    throw new Error("Profile source is required.");
  }

  if (!Object.prototype.hasOwnProperty.call(options, "data")) {
    throw new Error("Profile data is required.");
  }

  const source = options.source.trim();

  if (!["manual", "cv-text", "cv-pdf"].includes(source)) {
    throw new Error("Unsupported profile source. Use manual, cv-text, or cv-pdf.");
  }

  const resolvedDependencies = dependencies ?? (await loadDefaultDependencies());

  if (source === "manual") {
    const normalizedProfile = resolvedDependencies.normalizeManualProfile(options.data);
    return resolvedDependencies.enrichProfile(normalizedProfile);
  }

  if (source === "cv-text") {
    return resolvedDependencies.analyzeCVText(options.data);
  }

  if (source === "cv-pdf") {
    return resolvedDependencies.analyzeCVFile(options.data);
  }

}
