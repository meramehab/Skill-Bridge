import { extractPDFText } from "../documents/extract-pdf-text.js";
import { analyzeCVText } from "./analyze-cv.js";

export async function analyzeCVFile(filePath) {
  const cvText = await extractPDFText(filePath);
  return analyzeCVText(cvText);
}
