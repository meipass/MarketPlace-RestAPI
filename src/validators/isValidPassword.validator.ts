import { isNonEmptyString } from "./isNonEmptyString.validator.js";

const MIN_ALLOWED_LENGTH = 8; // 8 chars

export function isValidPassword(value: unknown): boolean {
  return isNonEmptyString(value) && value.length >= MIN_ALLOWED_LENGTH;
}
