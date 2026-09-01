export const cvAnalysisSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "personalInfo",
    "skills",
    "education",
    "experience",
    "projects",
    "suggestedRoles",
    "summary",
  ],
  properties: {
    personalInfo: {
      type: "object",
      additionalProperties: false,
      required: ["name", "email", "phone", "location"],
      properties: {
        name: { type: ["string", "null"] },
        email: { type: ["string", "null"] },
        phone: { type: ["string", "null"] },
        location: { type: ["string", "null"] },
      },
    },
    skills: {
      type: "array",
      items: { type: "string" },
    },
    education: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "institution",
          "degree",
          "field",
          "startDate",
          "endDate",
        ],
        properties: {
          institution: { type: "string" },
          degree: { type: ["string", "null"] },
          field: { type: ["string", "null"] },
          startDate: { type: ["string", "null"] },
          endDate: { type: ["string", "null"] },
        },
      },
    },
    experience: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["company", "role", "startDate", "endDate", "description"],
        properties: {
          company: { type: "string" },
          role: { type: "string" },
          startDate: { type: ["string", "null"] },
          endDate: { type: ["string", "null"] },
          description: { type: ["string", "null"] },
        },
      },
    },
    projects: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "description", "technologies"],
        properties: {
          name: { type: "string" },
          description: { type: ["string", "null"] },
          technologies: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
    },
    suggestedRoles: {
      type: "array",
      items: { type: "string" },
    },
    summary: {
      type: "string",
    },
  },
};
