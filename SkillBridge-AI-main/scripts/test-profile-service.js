import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createStudentProfile } from "../src/services/create-student-profile.js";
import { getAIErrorStatus } from "../src/utils/ai-errors.js";

async function readInputData(source, inputValue) {
  if (source === "manual") {
    const fileContent = await readFile(path.resolve(inputValue), "utf8");
    return JSON.parse(fileContent);
  }

  if (source === "cv-text") {
    return readFile(path.resolve(inputValue), "utf8");
  }

  if (source === "cv-pdf") {
    return inputValue;
  }

  return inputValue;
}

async function main() {
  const source = process.argv[2];
  const inputValue = process.argv[3];

  if (!source || !inputValue) {
    console.log('Usage: npm run test:profile -- <manual|cv-text|cv-pdf> "input-path"');
    return;
  }

  try {
    const data = await readInputData(source, inputValue);
    const result = await createStudentProfile({ source, data });

    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    const temporaryCode = getAIErrorStatus(error);

    if (temporaryCode) {
      console.error(`خطأ مؤقت من خدمة Gemini (${temporaryCode}).`);
      console.error("يرجى المحاولة لاحقاً عند توفر الخدمة أو الحصة.");
      return;
    }

    console.error("حدث خطأ أثناء تشغيل خدمة الملف الشخصي.");
    console.error(error.message);
    process.exitCode = 1;
  }
}

main();
