import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { PDFParse } from "pdf-parse";

function normalizeExtractedText(text) {
  return text
    .replace(/\0/g, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

export async function extractPDFText(filePath) {
  if (typeof filePath !== "string" || filePath.trim() === "") {
    throw new Error("PDF file path is required.");
  }

  const resolvedPath = path.resolve(filePath.trim());

  if (path.extname(resolvedPath).toLowerCase() !== ".pdf") {
    throw new Error("The selected file must be a PDF.");
  }

  let fileStats;

  try {
    fileStats = await stat(resolvedPath);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      throw new Error("The PDF file does not exist.");
    }

    throw new Error("Could not access the PDF file.");
  }

  if (!fileStats.isFile()) {
    throw new Error("The provided PDF path must point to a regular file.");
  }

  const fileBuffer = await readFile(resolvedPath);
  const parser = new PDFParse({ data: fileBuffer });

  try {
    const result = await parser.getText();
    const cleanedText = normalizeExtractedText(result.text ?? "");

    if (!cleanedText) {
      throw new Error(
        "No usable text was found in this PDF. Scanned or image-only PDFs may require OCR.",
      );
    }

    return cleanedText;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "No usable text was found in this PDF. Scanned or image-only PDFs may require OCR."
    ) {
      throw error;
    }

    throw new Error(
      "Failed to extract text from the PDF. Please check that the file is a valid text-based PDF.",
    );
  } finally {
    await parser.destroy();
  }
}
