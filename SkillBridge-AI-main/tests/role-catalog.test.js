import test from "node:test";
import assert from "node:assert/strict";
import { finalizeAdaptiveAssessment } from "../src/services/adaptive-assessment-service.js";
import { roleCatalog } from "../src/data/role-catalog.js";
import { getRoleById, getRoleByName } from "../src/roles/get-role.js";
import { calculateReadiness } from "../src/skills/calculate-readiness.js";
import { findCanonicalSkill, normalizeSkillName } from "../src/skills/normalize-skill-name.js";

function createBaseProfile(skills = []) {
  return {
    personalInfo: {
      name: "Student",
      email: null,
      phone: null,
      location: null,
    },
    skills,
    education: [],
    experience: [],
    projects: [],
    suggestedRoles: [],
    summary: "",
    profileSource: "manual",
  };
}

function createAliasKey(value) {
  return normalizeSkillName(value).toLowerCase().replace(/[^a-z0-9]+/g, "");
}

test("all five production roles load successfully with unique ids", () => {
  assert.equal(roleCatalog.length, 5);

  const uniqueIds = new Set(roleCatalog.map((role) => role.id));
  assert.equal(uniqueIds.size, roleCatalog.length);

  for (const role of roleCatalog) {
    assert.equal(getRoleById(role.id).id, role.id);
  }
});

test("canonical skill names are unique within each role", () => {
  for (const role of roleCatalog) {
    const uniqueNames = new Set(role.skills.map((skill) => skill.name));
    assert.equal(uniqueNames.size, role.skills.length, `Expected unique skill names in ${role.name}.`);
  }
});

test("skill aliases do not create obvious conflicts inside a role", () => {
  for (const role of roleCatalog) {
    const seenAliases = new Map();

    for (const skill of role.skills) {
      for (const alias of [skill.name, ...skill.aliases]) {
        const aliasKey = createAliasKey(alias);

        if (!aliasKey) {
          continue;
        }

        const previousOwner = seenAliases.get(aliasKey);
        assert.ok(
          !previousOwner || previousOwner === skill.name,
          `Alias conflict in ${role.name}: ${alias} maps to both ${previousOwner} and ${skill.name}.`,
        );
        seenAliases.set(aliasKey, skill.name);
      }
    }
  }

  const frontendRole = getRoleByName("Frontend Developer");
  assert.notEqual(findCanonicalSkill("Java", frontendRole), "JavaScript");
});

test("technical assessment weights total 100 for every role", () => {
  for (const role of roleCatalog) {
    const totalWeight = role.requiredSkills.reduce((sum, skill) => sum + skill.weight, 0);
    assert.equal(totalWeight, 100, `Expected technical weights totaling 100 in ${role.name}.`);
  }
});

test("soft skills stay informational and do not affect technical profile match", () => {
  const result = calculateReadiness(createBaseProfile(["Communication", "Teamwork"]), getRoleByName("Data Analyst"));

  assert.equal(result.readinessScore, 0);
  assert.equal(result.matchedSkills.length, 0);
  assert.deepEqual(result.optionalSkillsFound.sort(), ["Communication", "Teamwork"]);
});

test("optional skills do not unfairly reduce readiness", () => {
  const result = calculateReadiness(createBaseProfile(["TypeScript", "Figma"]), getRoleByName("Frontend Developer"));

  assert.equal(result.readinessScore, 0);
  assert.equal(result.missingSkills.length, getRoleByName("Frontend Developer").requiredSkills.length);
});

test("backend role supports alternative stacks without requiring every language", () => {
  const backendRole = getRoleByName("Backend Developer");
  const languageGroup = backendRole.skillGroups.find((group) => group.id === "backend-language-family");

  assert.deepEqual(languageGroup, {
    id: "backend-language-family",
    type: "one-of",
    label: "Backend language family",
    skills: ["Node.js", "Python", "Java", "C#", "Go"],
    usedBy: ["Server-side Programming"],
  });

  const profile = createBaseProfile(["Python", "REST API", "SQL", "Git", "Authentication"]);
  const result = calculateReadiness(profile, backendRole);

  assert.ok(result.readinessScore >= 70);
  assert.ok(result.matchedSkills.some((skill) => skill.name === "Server-side Programming"));
  assert.ok(!backendRole.requiredSkills.some((skill) => ["Node.js", "Python", "Java", "C#"].includes(skill.name)));
});

test("existing readiness calculations still work with the production catalog", () => {
  const dataAnalystResult = calculateReadiness(
    createBaseProfile(["Python", "SQL", "Power BI", "Excel", "Git"]),
    getRoleByName("Data Analyst"),
  );
  const frontendResult = calculateReadiness(
    createBaseProfile(["JS", "HTML", "CSS", "ReactJS", "Git", "Responsive UI"]),
    getRoleByName("Frontend Developer"),
  );

  assert.equal(dataAnalystResult.readinessScore, 100);
  assert.equal(frontendResult.readinessScore, 100);
});

test("soft skills do not affect verified readiness score", async () => {
  const result = await finalizeAdaptiveAssessment({
    sessionId: "role-catalog-soft-skills",
    role: {
      id: "data-analyst",
      name: "Data Analyst",
      description: "Role",
    },
    profileMatchScore: 60,
    skillStates: [
      {
        name: "Communication",
        roleWeight: 0,
        priority: "medium",
        claimed: true,
        discovered: false,
        status: "verified",
        verifiedLevel: "strong",
        confidence: 0.55,
        averageScore: 100,
        questionsAsked: 1,
        successfulEvaluations: 1,
      },
    ],
    currentQuestion: null,
  });

  assert.equal(result.verifiedReadinessScore, 0);
  assert.equal(result.profileMatchScore, 60);
});
