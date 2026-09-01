import test from "node:test";
import assert from "node:assert/strict";
import { getAIErrorStatus, isTemporaryAIError } from "../src/utils/ai-errors.js";
import { parseAIJsonResponse } from "../src/utils/ai-response.js";
import {
  getProfileReadinessLevel,
  getVerifiedReadinessLevel,
} from "../src/skills/readiness-levels.js";
import { compareSkillPriority } from "../src/skills/skill-priority.js";

test("detects temporary AI errors from status and code fields", () => {
  assert.equal(getAIErrorStatus({ status: 429 }), "429");
  assert.equal(getAIErrorStatus({ code: "503" }), "503");
});

test("detects temporary AI errors from structured error messages", () => {
  assert.equal(getAIErrorStatus(new Error('{"code":503,"message":"Unavailable"}')), "503");
});

test("does not classify programming errors as temporary AI errors", () => {
  assert.equal(getAIErrorStatus(new TypeError("Cannot read properties of undefined")), null);
  assert.equal(isTemporaryAIError(new TypeError("Cannot read properties of undefined")), false);
});

test("parses a non-empty Gemini JSON response", () => {
  assert.deepEqual(parseAIJsonResponse({ text: ' {"ok":true} ' }, "test response"), { ok: true });
});

test("rejects an empty Gemini response", () => {
  assert.throws(() => parseAIJsonResponse({ text: "   " }, "test response"));
});

test("rejects invalid JSON from Gemini", () => {
  assert.throws(() => parseAIJsonResponse({ text: "not-json" }, "test response"));
});

test("keeps profile and verified readiness concepts explicit", () => {
  assert.equal(getProfileReadinessLevel(59), "Developing");
  assert.equal(getVerifiedReadinessLevel(60), "Nearly Ready");
});

test("sorts skill priorities from high to low", () => {
  const skills = [{ priority: "low" }, { priority: "high" }, { priority: "medium" }];
  assert.deepEqual(skills.sort(compareSkillPriority).map((skill) => skill.priority), [
    "high",
    "medium",
    "low",
  ]);
});
