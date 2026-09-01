import test from "node:test";
import assert from "node:assert/strict";
import { roleCatalog } from "../src/data/role-catalog.js";
import { getRoleByName } from "../src/roles/get-role.js";
import { calculateReadiness } from "../src/skills/calculate-readiness.js";

function createBaseProfile() {
  return {
    personalInfo: {
      name: "Student",
      email: null,
      phone: null,
      location: null,
    },
    skills: [],
    education: [],
    experience: [],
    projects: [],
    suggestedRoles: [],
    summary: "",
    profileSource: "manual",
  };
}

test("all required role skills matched gives score 100", () => {
  const profile = createBaseProfile();
  profile.skills = ["Python", "SQL", "Power BI", "Excel", "Git"];
  const role = getRoleByName("Data Analyst");

  const result = calculateReadiness(profile, role);

  assert.equal(result.readinessScore, 100);
  assert.equal(result.readinessLevel, "Ready");
  assert.equal(result.missingSkills.length, 0);
});

test("no required skills gives score 0", () => {
  const result = calculateReadiness(createBaseProfile(), getRoleByName("Data Analyst"));

  assert.equal(result.readinessScore, 0);
  assert.equal(result.readinessLevel, "Starting");
});

test("partial skill set calculates the exact expected weighted score", () => {
  const profile = createBaseProfile();
  profile.skills = ["Python", "SQL", "Excel"];

  const result = calculateReadiness(profile, getRoleByName("Data Analyst"));

  assert.equal(result.readinessScore, 70);
  assert.equal(result.readinessLevel, "Nearly Ready");
});

test("aliases match canonical skills", () => {
  const profile = createBaseProfile();
  profile.skills = ["JS", "HTML", "CSS", "ReactJS", "Git", "Responsive UI"];

  const result = calculateReadiness(profile, getRoleByName("Frontend Developer"));

  assert.equal(result.readinessScore, 100);
});

test("duplicate profile skills do not increase the score", () => {
  const profile = createBaseProfile();
  profile.skills = ["Python", "Python", "SQL", "SQL", "Power BI", "Excel", "Git"];

  const result = calculateReadiness(profile, getRoleByName("Data Analyst"));

  assert.equal(result.readinessScore, 100);
});

test("project technologies count as evidence", () => {
  const profile = createBaseProfile();
  profile.projects = [
    {
      name: "Sales Dashboard",
      description: "Tracks KPIs.",
      technologies: ["Python", "SQL"],
    },
  ];

  const result = calculateReadiness(profile, getRoleByName("Data Analyst"));
  const pythonMatch = result.matchedSkills.find((skill) => skill.name === "Python");

  assert.equal(result.readinessScore, 55);
  assert.ok(pythonMatch.evidence.includes("Used in project: Sales Dashboard"));
});

test("missing skills are returned with priority and weight", () => {
  const profile = createBaseProfile();
  profile.skills = ["Python"];

  const result = calculateReadiness(profile, getRoleByName("Data Analyst"));
  const missingSql = result.missingSkills.find((skill) => skill.name === "SQL");

  assert.deepEqual(missingSql, {
    name: "SQL",
    weight: 30,
    priority: "high",
    status: "missing",
  });
});

test("readiness level boundaries are correct", () => {
  const customRole = {
    id: "test-role",
    name: "Test Role",
    description: "Boundary checks",
    requiredSkills: [
      { name: "Skill A", aliases: [], weight: 30, priority: "high" },
      { name: "Skill B", aliases: [], weight: 30, priority: "high" },
      { name: "Skill C", aliases: [], weight: 20, priority: "medium" },
      { name: "Skill D", aliases: [], weight: 20, priority: "low" },
    ],
    optionalSkills: [],
  };

  const startingProfile = createBaseProfile();
  const developingProfile = createBaseProfile();
  const nearlyReadyProfile = createBaseProfile();
  const readyProfile = createBaseProfile();

  developingProfile.skills = ["Skill A"];
  nearlyReadyProfile.skills = ["Skill A", "Skill B"];
  readyProfile.skills = ["Skill A", "Skill B", "Skill C"];

  assert.equal(calculateReadiness(startingProfile, customRole).readinessLevel, "Starting");
  assert.equal(calculateReadiness(developingProfile, customRole).readinessLevel, "Developing");
  assert.equal(calculateReadiness(nearlyReadyProfile, customRole).readinessLevel, "Nearly Ready");
  assert.equal(calculateReadiness(readyProfile, customRole).readinessLevel, "Ready");
});

test("optional skills do not increase required readiness score", () => {
  const profile = createBaseProfile();
  profile.skills = ["Statistics"];

  const result = calculateReadiness(profile, getRoleByName("Data Analyst"));

  assert.equal(result.readinessScore, 0);
  assert.deepEqual(result.optionalSkillsFound, ["Statistics"]);
});

test("original profile is not mutated", () => {
  const profile = createBaseProfile();
  profile.skills = ["Python", "SQL"];
  profile.projects = [
    {
      name: "Project",
      description: "Used Python and SQL.",
      technologies: ["Python", "SQL"],
    },
  ];
  const originalClone = structuredClone(profile);

  calculateReadiness(profile, getRoleByName("Data Analyst"));

  assert.deepEqual(profile, originalClone);
});

test("every role in roleCatalog has required weights totaling exactly 100", () => {
  for (const role of roleCatalog) {
    const totalWeight = role.requiredSkills.reduce((sum, skill) => sum + skill.weight, 0);
    assert.equal(totalWeight, 100, `Expected ${role.name} to total 100.`);
  }
});
