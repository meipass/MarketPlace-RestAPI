import { isNonEmptyString } from "./isNonEmptyString.validator.js";

const EMAIL_TEST_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: unknown): boolean {
  return isNonEmptyString(value) && EMAIL_TEST_REGEX.test(value);
}
