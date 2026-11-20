import { isNonEmptyString } from "./isNonEmptyString.validator.js";

export function isValidEmail(value: unknown): boolean {
  if (!isNonEmptyString(value)) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}
