import "dotenv/config";
import { analyzeCVFile } from "../src/ai/analyze-cv-file.js";
import { getAIErrorStatus } from "../src/utils/ai-errors.js";

async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.log('Usage: npm run test:cv:pdf -- "path-to-file.pdf"');
    return;
  }

  try {
    const result = await analyzeCVFile(filePath);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    const temporaryCode = getAIErrorStatus(error);

    if (temporaryCode) {
      console.error(`خطأ مؤقت من خدمة Gemini (${temporaryCode}).`);
      console.error("يرجى المحاولة لاحقاً عند توفر الخدمة أو الحصة.");
      return;
    }

    console.error("حدث خطأ أثناء تحليل ملف السيرة الذاتية PDF.");
    console.error(error.message);
    process.exitCode = 1;
  }
}

main();
