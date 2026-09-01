import { extractPDFText } from "../src/documents/extract-pdf-text.js";

async function main() {
  const filePath = process.argv[2];

  if (!filePath) {
    console.log('Usage: npm run extract:pdf -- "path-to-file.pdf"');
    return;
  }

  try {
    const text = await extractPDFText(filePath);
    const preview = text.slice(0, 500);

    console.log("Extraction success");
    console.log(`Character count: ${text.length}`);
    console.log("Preview:");
    console.log(preview);
  } catch (error) {
    console.error("حدث خطأ أثناء استخراج نص ملف PDF.");
    console.error(error.message);
    process.exitCode = 1;
  }
}

main();
