import { isNonEmptyString } from "./isNonEmptyString.validator.js";

const MIN_ALLOWED_LENGTH = 5; // 5 chars

export function isValidLogin(value: unknown): boolean {
  return isNonEmptyString(value) && value.length >= MIN_ALLOWED_LENGTH;
}
