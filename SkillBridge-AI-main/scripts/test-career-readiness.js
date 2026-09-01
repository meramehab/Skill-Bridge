import "dotenv/config";
import { readFile } from "node:fs/promises";
import { analyzeCareerReadiness } from "../src/services/analyze-career-readiness.js";

async function main() {
  try {
    const fileContent = await readFile(
      new URL("../samples/sample-readiness-profile.json", import.meta.url),
      "utf8",
    );
    const profile = JSON.parse(fileContent);
    const result = await analyzeCareerReadiness({
      profile,
      targetRole: "Data Analyst",
    });

    console.log(`Enrichment status: ${result.enrichmentStatus}`);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("حدث خطأ أثناء تحليل الجاهزية المهنية.");
    console.error(error.message);
    process.exitCode = 1;
  }
}

main();
