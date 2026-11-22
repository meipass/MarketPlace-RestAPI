import { AppError } from "#app/modules/appError/appError.class";

import { isObject } from "#app/validators/isObject.validator";
import { isValidEmail } from "#app/validators/isValidEmail.validator";
import { isNonEmptyString } from "#app/validators/isNonEmptyString.validator";
import { isValidPassword } from "#app/validators/isValidPassword.validator";
import { isValidLogin } from "#app/validators/isValidLogin.validator";

import type { RegisterData } from "#app/interfaces/registerData.type";
import type { LoginData } from "#app/interfaces/loginData.type";

export function validateRegistrationBody(body: unknown): RegisterData {
  if (!isObject(body)) {
    throw new AppError("INVALID_BODY");
  }

  const { login, email, password } = body;

  if (!isNonEmptyString(login)) {
    throw new AppError("LOGIN_REQUIRED");
  }

  if (!isNonEmptyString(email)) {
    throw new AppError("EMAIL_REQUIRED");
  }

  if (!isNonEmptyString(password)) {
    throw new AppError("PASSWORD_REQUIRED");
  }

  if (!isValidLogin(login)) {
    throw new AppError("INVALID_LOGIN_LENGTH");
  }

  if (!isValidPassword(password)) {
    throw new AppError("INVALID_PASSWORD_LENGTH");
  }

  if (!isValidEmail(email)) {
    throw new AppError("INVALID_EMAIL");
  }

  return {
    email: email,
    login: login,
    password: password,
  };
}

export function validateLoginBody(body: unknown): LoginData {
  if (!isObject(body)) {
    throw new AppError("INVALID_BODY");
  }

  const { email, password } = body;

  if (!isNonEmptyString(email)) {
    throw new AppError("EMAIL_REQUIRED");
  }

  if (!isNonEmptyString(password)) {
    throw new AppError("PASSWORD_REQUIRED");
  }

  if (!isValidEmail(email)) {
    throw new AppError("INVALID_EMAIL");
  }

  return {
    email: email,
    password: password,
  };
}
