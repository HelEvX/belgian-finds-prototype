export type CsvDelimiter = "," | ";";

export type ParsedDelimitedText = {
  delimiter: CsvDelimiter;
  rows: string[][];
  errors: string[];
};

export function detectCsvDelimiter(text: string): CsvDelimiter {
  let commaCount = 0;
  let semicolonCount = 0;
  let insideQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (character === '"') {
      if (insideQuotes && text[index + 1] === '"') {
        index += 1;
      } else {
        insideQuotes = !insideQuotes;
      }

      continue;
    }

    if (insideQuotes) {
      continue;
    }

    if (character === ",") {
      commaCount += 1;
    } else if (character === ";") {
      semicolonCount += 1;
    }
  }

  return semicolonCount > commaCount ? ";" : ",";
}

export function parseDelimitedText(text: string): ParsedDelimitedText {
  const delimiter = detectCsvDelimiter(text);

  const rows: string[][] = [];
  const errors: string[] = [];

  let row: string[] = [];
  let field = "";
  let insideQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (insideQuotes) {
      if (character === '"') {
        if (text[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          insideQuotes = false;
        }
      } else {
        field += character;
      }

      continue;
    }

    if (character === '"' && field.length === 0) {
      insideQuotes = true;
    } else if (character === delimiter) {
      row.push(field);
      field = "";
    } else if (character === "\n" || character === "\r") {
      if (character === "\r" && text[index + 1] === "\n") {
        index += 1;
      }

      row.push(field);
      rows.push(row);

      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (insideQuotes) {
    errors.push("The CSV contains an unclosed quoted value.");
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return {
    delimiter,
    rows,
    errors,
  };
}

export function normalizeCsvDecimal(value: string) {
  const compactValue = value.trim().replace(/[\s\u00A0\u202F]/g, "");

  if (!compactValue) {
    return "";
  }

  let normalizedValue: string;

  if (compactValue.includes(",") && compactValue.includes(".")) {
    const belgianGroupedNumber = /^\d{1,3}(?:\.\d{3})+,\d+$/;

    if (!belgianGroupedNumber.test(compactValue)) {
      return null;
    }

    normalizedValue = compactValue.replace(/\./g, "").replace(",", ".");
  } else if (compactValue.includes(",")) {
    if (!/^\d+(?:,\d+)?$/.test(compactValue)) {
      return null;
    }

    normalizedValue = compactValue.replace(",", ".");
  } else {
    if (!/^\d+(?:\.\d+)?$/.test(compactValue)) {
      return null;
    }

    normalizedValue = compactValue;
  }

  return Number.isFinite(Number(normalizedValue)) ? normalizedValue : null;
}
