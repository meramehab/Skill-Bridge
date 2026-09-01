import "dotenv/config";
import { readFile } from "node:fs/promises";
import {
  finalizeAdaptiveAssessment,
  getNextAssessmentMessage,
  startAdaptiveAssessment,
  submitAssessmentAnswer,
} from "../src/services/adaptive-assessment-service.js";

function createDiscoveryAnswer(skill) {
  if (skill === "Power BI") {
    return "I studied Power BI in a university assignment and built a simple chart-based dashboard once.";
  }

  if (skill === "Excel") {
    return "I have heard of Excel, but I have not really practiced it in projects or coursework.";
  }

  return `I have limited exposure to ${skill}.`;
}

function createTechnicalAnswer(skill) {
  const answers = {
    SQL: "I would use SELECT with SUM and GROUP BY to calculate totals by category and compare the grouped results.",
    Python: "I would use Python functions to reuse logic and built-in tools like sum and len for basic data analysis tasks.",
    "Power BI": "I would create KPI cards and charts, then add filters so users can explore the dashboard clearly.",
    Excel: "I would use formulas and tables to clean and summarize data.",
  };

  return answers[skill] ?? `I would explain how I used ${skill} in a small student project.`;
}

async function main() {
  try {
    const fileContent = await readFile(
      new URL("../samples/sample-adaptive-assessment-profile.json", import.meta.url),
      "utf8",
    );
    const profile = JSON.parse(fileContent);
    let session = await startAdaptiveAssessment({
      profile,
      targetRole: "Data Analyst",
      config: {
        maxQuestionsPerSkill: 2,
      },
    });
    const questionSources = [];
    const evaluationStatuses = [];

    while (true) {
      const nextMessageResult = await getNextAssessmentMessage(session);
      session = nextMessageResult.session;

      if (!nextMessageResult.message) {
        break;
      }

      const message = nextMessageResult.message;
      questionSources.push({
        skill: message.skill,
        type: message.type,
        questionSource: message.questionSource,
      });

      const answer =
        message.type === "discovery"
          ? createDiscoveryAnswer(message.skill)
          : createTechnicalAnswer(message.skill);
      const submitResult = await submitAssessmentAnswer(session, { answer });
      session = submitResult.session;
      evaluationStatuses.push({
        skill: message.skill,
        type: message.type,
        evaluationStatus: submitResult.evaluation.evaluationStatus,
      });
    }

    const finalResult = await finalizeAdaptiveAssessment(session);
    console.log(
      JSON.stringify(
        {
          questionSources,
          evaluationStatuses,
          profileMatchScore: finalResult.profileMatchScore,
          verifiedReadinessScore: finalResult.verifiedReadinessScore,
          verificationCoverage: finalResult.verificationCoverage,
          verifiedSkills: finalResult.verifiedSkills,
          discoveredSkills: finalResult.discoveredSkills,
          missingSkills: finalResult.missingSkills,
          skillMap: finalResult.skillMap,
        },
        null,
        2,
      ),
    );
  } catch (error) {
    console.error("حدث خطأ أثناء تشغيل العرض التجريبي للتقييم التكيفي.");
    console.error(error.message);
    process.exitCode = 1;
  }
}

main();
