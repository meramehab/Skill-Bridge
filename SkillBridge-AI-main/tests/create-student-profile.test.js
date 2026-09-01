import test from "node:test";
import assert from "node:assert/strict";
import { createStudentProfile } from "../src/services/create-student-profile.js";

test("rejects invalid top-level options values", async () => {
  await assert.rejects(() => createStudentProfile(null), /object/);
  await assert.rejects(() => createStudentProfile([]), /object/);
  await assert.rejects(() => createStudentProfile("manual"), /object/);
  await assert.rejects(() => createStudentProfile(7), /object/);
});

test("rejects a missing source", async () => {
  await assert.rejects(() => createStudentProfile({ data: {} }), /source is required/i);
});

test("rejects an unsupported source", async () => {
  await assert.rejects(
    () => createStudentProfile({ source: "email", data: {} }),
    /unsupported profile source/i,
  );
});

test("rejects options with no data property", async () => {
  await assert.rejects(() => createStudentProfile({ source: "manual" }), /data is required/i);
});

test("routes manual data through normalizeManualProfile and then enrichProfile", async () => {
  const inputData = { personalInfo: { name: "Sara" } };
  const normalizedProfile = { personalInfo: { name: "Sara" }, profileSource: "manual" };
  const enrichedProfile = { ...normalizedProfile, summary: "Student profile", suggestedRoles: [] };
  const calls = [];

  const result = await createStudentProfile(
    { source: "manual", data: inputData },
    {
      normalizeManualProfile(data) {
        calls.push(["normalizeManualProfile", data]);
        return normalizedProfile;
      },
      async enrichProfile(profile) {
        calls.push(["enrichProfile", profile]);
        return enrichedProfile;
      },
      analyzeCVText() {
        throw new Error("analyzeCVText should not be called.");
      },
      analyzeCVFile() {
        throw new Error("analyzeCVFile should not be called.");
      },
    },
  );

  assert.deepEqual(calls, [
    ["normalizeManualProfile", inputData],
    ["enrichProfile", normalizedProfile],
  ]);
  assert.equal(result, enrichedProfile);
});

test("routes cv-text data directly to analyzeCVText", async () => {
  const cvText = "Sample CV text";
  const cvResult = { profileSource: "cv" };
  let analyzeCVTextCalls = 0;

  const result = await createStudentProfile(
    { source: "cv-text", data: cvText },
    {
      normalizeManualProfile() {
        throw new Error("normalizeManualProfile should not be called.");
      },
      enrichProfile() {
        throw new Error("enrichProfile should not be called.");
      },
      async analyzeCVText(data) {
        analyzeCVTextCalls += 1;
        assert.equal(data, cvText);
        return cvResult;
      },
      analyzeCVFile() {
        throw new Error("analyzeCVFile should not be called.");
      },
    },
  );

  assert.equal(analyzeCVTextCalls, 1);
  assert.equal(result, cvResult);
});

test("routes cv-pdf data directly to analyzeCVFile", async () => {
  const pdfPath = "samples/sample.pdf";
  const cvResult = { profileSource: "cv" };
  let analyzeCVFileCalls = 0;

  const result = await createStudentProfile(
    { source: "cv-pdf", data: pdfPath },
    {
      normalizeManualProfile() {
        throw new Error("normalizeManualProfile should not be called.");
      },
      enrichProfile() {
        throw new Error("enrichProfile should not be called.");
      },
      analyzeCVText() {
        throw new Error("analyzeCVText should not be called.");
      },
      async analyzeCVFile(data) {
        analyzeCVFileCalls += 1;
        assert.equal(data, pdfPath);
        return cvResult;
      },
    },
  );

  assert.equal(analyzeCVFileCalls, 1);
  assert.equal(result, cvResult);
});

test("preserves downstream errors", async () => {
  const downstreamError = new Error("Known downstream error");

  await assert.rejects(
    () =>
      createStudentProfile(
        { source: "cv-text", data: "CV text" },
        {
          normalizeManualProfile() {
            throw new Error("normalizeManualProfile should not be called.");
          },
          enrichProfile() {
            throw new Error("enrichProfile should not be called.");
          },
          analyzeCVText() {
            throw downstreamError;
          },
          analyzeCVFile() {
            throw new Error("analyzeCVFile should not be called.");
          },
        },
      ),
    downstreamError,
  );
});

test("does not mutate the original options object or nested data", async () => {
  const options = {
    source: "manual",
    data: {
      personalInfo: {
        name: "Ali",
      },
      skills: ["Git"],
    },
  };
  const originalClone = structuredClone(options);

  await createStudentProfile(options, {
    normalizeManualProfile(data) {
      return {
        personalInfo: { ...data.personalInfo },
        skills: [...data.skills],
        education: [],
        experience: [],
        projects: [],
        suggestedRoles: [],
        summary: "",
        profileSource: "manual",
      };
    },
    async enrichProfile(profile) {
      return {
        ...profile,
        suggestedRoles: ["Intern"],
        summary: "Profile summary",
      };
    },
    analyzeCVText() {
      throw new Error("analyzeCVText should not be called.");
    },
    analyzeCVFile() {
      throw new Error("analyzeCVFile should not be called.");
    },
  });

  assert.deepEqual(options, originalClone);
});
