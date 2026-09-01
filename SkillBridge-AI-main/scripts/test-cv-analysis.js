import "dotenv/config";
import { readFile } from "node:fs/promises";
import { analyzeCVText } from "../src/ai/analyze-cv.js";

async function main() {
  try {
    const cvText = await readFile(new URL("../samples/sample-cv.txt", import.meta.url), "utf8");
    const result = await analyzeCVText(cvText);

    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("حدث خطأ أثناء تحليل السيرة الذاتية.");
    console.error(error.message);
    process.exitCode = 1;
  }
}

main();
