import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { extractPDFText } from "../src/documents/extract-pdf-text.js";

async function withTempDir(run) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "skillbridge-pdf-test-"));

  try {
    await run(tempDir);
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

test("rejects an empty path", async () => {
  await assert.rejects(() => extractPDFText(""), /PDF file path is required/);
});

test("rejects a non-PDF extension", async () => {
  await withTempDir(async (tempDir) => {
    const filePath = path.join(tempDir, "cv.txt");
    await writeFile(filePath, "not a pdf");

    await assert.rejects(() => extractPDFText(filePath), /must be a PDF/);
  });
});

test("rejects a missing PDF file", async () => {
  await withTempDir(async (tempDir) => {
    const filePath = path.join(tempDir, "missing.pdf");

    await assert.rejects(() => extractPDFText(filePath), /does not exist/);
  });
});

test("rejects a directory path even if its name ends in .pdf", async () => {
  await withTempDir(async (tempDir) => {
    const directoryPath = path.join(tempDir, "folder.pdf");
    await mkdir(directoryPath);

    await assert.rejects(() => extractPDFText(directoryPath), /regular file/);
  });
});

test("rejects an invalid or corrupted PDF", async () => {
  await withTempDir(async (tempDir) => {
    const filePath = path.join(tempDir, "broken.pdf");
    await writeFile(filePath, "this is not a valid pdf");

    await assert.rejects(
      () => extractPDFText(filePath),
      /Failed to extract text from the PDF/,
    );
  });
});

test("does not expose only a raw low-level parsing error", async () => {
  await withTempDir(async (tempDir) => {
    const filePath = path.join(tempDir, "low-level-error.pdf");
    await writeFile(filePath, "%PDF-1.4\nbroken content");

    await assert.rejects(
      async () => {
        try {
          await extractPDFText(filePath);
        } catch (error) {
          assert.match(error.message, /Failed to extract text from the PDF/);
          assert.doesNotMatch(error.message, /InvalidPDFException|bad XRef|UnexpectedResponseException/);
          throw error;
        }
      },
      /Failed to extract text from the PDF/,
    );
  });
});
