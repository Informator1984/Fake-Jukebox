import mammoth from "mammoth";

export interface ExtractResult {
  text: string;
  pageCount?: number;
}

export async function extractText(
  buffer: Buffer,
  mimeType: string
): Promise<ExtractResult> {
  if (mimeType === "application/pdf") {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse");
    const fn = typeof pdfParse === "function" ? pdfParse : pdfParse.default;
    const data = await fn(buffer);
    return { text: data.text, pageCount: data.numpages };
  }

  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/msword"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return { text: result.value };
  }

  if (mimeType === "text/plain" || mimeType === "text/markdown") {
    return { text: buffer.toString("utf-8") };
  }

  throw new Error(`Nicht unterstützter Dateityp: ${mimeType}`);
}
