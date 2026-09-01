import test from "node:test";
import assert from "node:assert/strict";
import { normalizeManualProfile } from "../src/manual/normalize-manual-profile.js";

test("normalizes a valid minimal manual profile", () => {
  const result = normalizeManualProfile({
    personalInfo: {
      name: "Mona Ali",
    },
  });

  assert.deepEqual(result, {
    personalInfo: {
      name: "Mona Ali",
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
  });
});

test("trims whitespace from personal info and nested profile fields", () => {
  const result = normalizeManualProfile({
    personalInfo: {
      name: "  Lina Kareem  ",
      email: "  lina@example.com  ",
      phone: "  0100  ",
      location: "  Cairo  ",
    },
    skills: ["  React  "],
    education: [
      {
        institution: "  Future Tech University  ",
        degree: "  Bachelor of Science  ",
        field: "  Computer Science  ",
        startDate: "  2022  ",
        endDate: "  2026  ",
      },
    ],
    experience: [
      {
        company: "  SkillBridge  ",
        role: "  Intern  ",
        startDate: "  2025  ",
        endDate: "  2025  ",
        description: "  Helped with testing.  ",
      },
    ],
    projects: [
      {
        name: "  Portfolio Website  ",
        description: "  Built a simple portfolio site.  ",
        technologies: ["  HTML  ", "  CSS  "],
      },
    ],
  });

  assert.equal(result.personalInfo.name, "Lina Kareem");
  assert.equal(result.personalInfo.email, "lina@example.com");
  assert.equal(result.personalInfo.phone, "0100");
  assert.equal(result.personalInfo.location, "Cairo");
  assert.deepEqual(result.skills, ["React"]);
  assert.equal(result.education[0].institution, "Future Tech University");
  assert.equal(result.education[0].degree, "Bachelor of Science");
  assert.equal(result.education[0].field, "Computer Science");
  assert.equal(result.education[0].startDate, "2022");
  assert.equal(result.education[0].endDate, "2026");
  assert.equal(result.experience[0].company, "SkillBridge");
  assert.equal(result.experience[0].role, "Intern");
  assert.equal(result.experience[0].description, "Helped with testing.");
  assert.equal(result.projects[0].name, "Portfolio Website");
  assert.equal(result.projects[0].description, "Built a simple portfolio site.");
  assert.deepEqual(result.projects[0].technologies, ["HTML", "CSS"]);
});

test("removes duplicate skills case-insensitively while keeping a readable version", () => {
  const result = normalizeManualProfile({
    skills: ["React", " react ", "REACT", "JavaScript"],
  });

  assert.deepEqual(result.skills, ["React", "JavaScript"]);
});

test("removes empty and whitespace-only skill values", () => {
  const result = normalizeManualProfile({
    skills: ["", "   ", "React", "  JavaScript  "],
  });

  assert.deepEqual(result.skills, ["React", "JavaScript"]);
});

test("converts empty optional personal information strings to null", () => {
  const result = normalizeManualProfile({
    personalInfo: {
      name: "Nour",
      email: "",
      phone: "   ",
      location: "",
    },
  });

  assert.equal(result.personalInfo.email, null);
  assert.equal(result.personalInfo.phone, null);
  assert.equal(result.personalInfo.location, null);
});

test("throws for invalid top-level manual profile input values", () => {
  assert.throws(() => normalizeManualProfile(null));
  assert.throws(() => normalizeManualProfile([]));
  assert.throws(() => normalizeManualProfile("profile"));
  assert.throws(() => normalizeManualProfile(42));
});

test("throws when list fields are not arrays", () => {
  assert.throws(() => normalizeManualProfile({ skills: "React" }));
  assert.throws(() => normalizeManualProfile({ education: {} }));
  assert.throws(() => normalizeManualProfile({ experience: "none" }));
  assert.throws(() => normalizeManualProfile({ projects: 1 }));
});

test("throws for invalid nested entries in education, experience, and projects", () => {
  assert.throws(() => normalizeManualProfile({ education: ["invalid"] }));
  assert.throws(() => normalizeManualProfile({ experience: [5] }));
  assert.throws(() => normalizeManualProfile({ projects: [true] }));
});

test("keeps an explicitly empty experience array unchanged", () => {
  const result = normalizeManualProfile({
    experience: [],
  });

  assert.deepEqual(result.experience, []);
});

test("does not mutate the original input object", () => {
  const input = {
    personalInfo: {
      name: "  Salma  ",
      email: "  salma@example.com  ",
    },
    skills: ["React", " react "],
    education: [
      {
        institution: "  Tech University  ",
        degree: "  BSc  ",
        field: "  Computer Science  ",
        startDate: "  2021  ",
        endDate: "  2025  ",
      },
    ],
    experience: [],
    projects: [
      {
        name: "  Portfolio  ",
        description: "  Simple site  ",
        technologies: ["  HTML  ", " CSS "],
      },
    ],
  };

  const originalClone = structuredClone(input);

  normalizeManualProfile(input);

  assert.deepEqual(input, originalClone);
});
