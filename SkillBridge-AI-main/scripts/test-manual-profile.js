import "dotenv/config";
import { readFile } from "node:fs/promises";
import { normalizeManualProfile } from "../src/manual/normalize-manual-profile.js";
import { enrichProfile } from "../src/ai/enrich-profile.js";

async function main() {
  try {
    const fileContent = await readFile(
      new URL("../samples/sample-manual-profile.json", import.meta.url),
      "utf8",
    );
    const input = JSON.parse(fileContent);
    const normalizedProfile = normalizeManualProfile(input);
    const result = await enrichProfile(normalizedProfile);

    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("حدث خطأ أثناء معالجة الملف الشخصي اليدوي.");
    console.error(error.message);
    process.exitCode = 1;
  }
}

main();
