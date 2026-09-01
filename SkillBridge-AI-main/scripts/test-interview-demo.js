import "dotenv/config";
import { readFile } from "node:fs/promises";
import {
  finalizeInterview,
  getNextInterviewQuestion,
  startInterview,
  submitInterviewAnswer,
} from "../src/services/interview-session-service.js";

function createDemoAnswer(skill) {
  const answers = {
    SQL: "I would use SELECT with SUM and GROUP BY category so I can total sales for each category.",
    Python: "I would use Python functions to reuse logic and built-in functions like sum and len to calculate values.",
    "Power BI": "I would build KPI cards and charts, then use filters so managers can explore monthly sales performance.",
    Excel: "I would clean data with tables and formulas, then summarize it with pivot tables.",
    Git: "Git helps me track changes and go back if something breaks.",
  };

  return answers[skill] ?? `I would explain the basics of ${skill} and show it in a small project example.`;
}

async function main() {
  try {
    const fileContent = await readFile(
      new URL("../samples/sample-interview-profile.json", import.meta.url),
      "utf8",
    );
    const profile = JSON.parse(fileContent);
    let session = await startInterview({
      profile,
      targetRole: "Data Analyst",
      maxSkills: 2,
    });
    const questionSources = [];
    const evaluationStatuses = [];

    while (true) {
      const nextQuestionResult = await getNextInterviewQuestion(session);

      if (!nextQuestionResult) {
        break;
      }

      session = nextQuestionResult.session;
      const question = nextQuestionResult.question;
      questionSources.push({
        skill: question.skill,
        questionSource: question.questionSource,
      });
      const submitResult = await submitInterviewAnswer(session, {
        questionId: question.questionId,
        answer: createDemoAnswer(question.skill),
      });

      session = submitResult.session;
      evaluationStatuses.push({
        skill: question.skill,
        evaluationStatus: submitResult.evaluation.evaluationStatus,
      });
    }

    const finalResult = await finalizeInterview(session);
    console.log(
      JSON.stringify(
        {
          questionSources,
          evaluationStatuses,
          finalResult,
        },
        null,
        2,
      ),
    );
  } catch (error) {
    console.error("حدث خطأ أثناء تشغيل العرض التجريبي للمقابلة.");
    console.error(error.message);
    process.exitCode = 1;
  }
}

main();
