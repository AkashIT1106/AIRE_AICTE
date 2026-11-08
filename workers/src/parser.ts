/**
 * RFC 4180 compliant CSV parser with support for quoted strings, escaped quotes,
 * commas inside quotes, multi-line entries, and UTF-8 BOM removal.
 */
export function parseCsv(csvText: string): Array<Record<string, unknown>> {
  const lines: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++; // Skip escaped double quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        currentRow.push(currentField.trim());
        currentField = "";
      } else if (char === "\r") {
        if (nextChar === "\n") i++;
        currentRow.push(currentField.trim());
        if (currentRow.some((f) => f.length > 0)) lines.push(currentRow);
        currentRow = [];
        currentField = "";
      } else if (char === "\n") {
        currentRow.push(currentField.trim());
        if (currentRow.some((f) => f.length > 0)) lines.push(currentRow);
        currentRow = [];
        currentField = "";
      } else {
        currentField += char;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((f) => f.length > 0)) lines.push(currentRow);
  }

  if (lines.length < 2) return [];

  const headers = lines[0].map((h) => h.replace(/^[\uFEFF]/, "").trim());
  const rows: Array<Record<string, unknown>> = [];

  for (let r = 1; r < lines.length; r++) {
    const rowObj: Record<string, unknown> = {};
    const values = lines[r];
    for (let c = 0; c < headers.length; c++) {
      rowObj[headers[c]] = values[c] !== undefined ? values[c] : "";
    }
    rows.push(rowObj);
  }

  return rows;
}
