import "dotenv/config";
import { readFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import {
  finalizeInterview,
  getNextInterviewQuestion,
  startInterview,
  submitInterviewAnswer,
} from "../src/services/interview-session-service.js";

async function main() {
  const rl = createInterface({ input, output });

  try {
    const fileContent = await readFile(
      new URL("../samples/sample-interview-profile.json", import.meta.url),
      "utf8",
    );
    const profile = JSON.parse(fileContent);
    let session = await startInterview({
      profile,
      targetRole: "Data Analyst",
      maxSkills: 3,
    });

    if (session.status === "no-claimed-skills") {
      console.log("No claimed matched skills were found for interview verification.");
      return;
    }

    while (true) {
      const nextQuestionResult = await getNextInterviewQuestion(session);

      if (!nextQuestionResult) {
        break;
      }

      session = nextQuestionResult.session;
      const question = nextQuestionResult.question;

      console.log(`\nSkill: ${question.skill}`);
      console.log(`Question source: ${question.questionSource}`);
      console.log(question.question);

      const answer = await rl.question("Your answer: ");
      const submitResult = await submitInterviewAnswer(session, {
        questionId: question.questionId,
        answer,
      });

      session = submitResult.session;
      console.log(`Evaluation status: ${submitResult.evaluation.evaluationStatus}`);
      console.log(`Score: ${submitResult.evaluation.score}`);
      console.log(`Level: ${submitResult.evaluation.demonstratedLevel}`);
      console.log(`Feedback: ${submitResult.evaluation.feedback}`);
    }

    const finalResult = await finalizeInterview(session);
    console.log(JSON.stringify(finalResult, null, 2));
  } catch (error) {
    console.error("حدث خطأ أثناء تشغيل المقابلة الذكية.");
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    rl.close();
  }
}

main();
