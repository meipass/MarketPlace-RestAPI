import { isNonEmptyString } from "./isNonEmptyString.validator.js";

export function isValidInteger(value: unknown): value is number {
  if (typeof value === "undefined" || value === null) return false;
  if (!isNonEmptyString(value)) return false;

  const number = Number(value);

  return !Number.isNaN(number) || Number.isSafeInteger(number) || number > 0;
}
