import { AppError } from "#app/modules/appError/appError.class";
import type { RegisterData } from "#app/interfaces/registerData.type";
import { isObject } from "#app/validators/isObject.validator";
import { isValidEmail } from "#app/validators/isValidEmail.validator";
import { isNonEmptyString } from "#app/validators/isNonEmptyString.validator";
import { isValidPassword } from "#app/validators/isValidPassword.validator";
import { isValidLogin } from "#app/validators/isValidLogin.validator";
import type { LoginData } from "#app/interfaces/loginData.type";

export function validateRegistrationBody(body: unknown): RegisterData {
  if (!isObject(body)) {
    throw new AppError("Invalid body", 400);
  }

  const { login, email, password } = body;

  if (!isNonEmptyString(login)) {
    throw new AppError("login is required", 400);
  }

  if (!isNonEmptyString(email)) {
    throw new AppError("Email is required", 400);
  }

  if (!isNonEmptyString(password)) {
    throw new AppError("Password is required", 400);
  }

  if (!isValidLogin(login)) {
    throw new AppError("login must be longer than 3 symbols", 400);
  }

  if (!isValidPassword(password)) {
    throw new AppError("Password must be longer than 8 symbols", 400);
  }

  if (!isValidEmail(email)) {
    throw new AppError("Enter an valid email", 400);
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
    throw new AppError("Email is required", 400);
  }

  if (!isNonEmptyString(password)) {
    throw new AppError("Password is required", 400);
  }

  if (!isValidEmail(email)) {
    throw new AppError("Enter an valid email", 400);
  }

  return {
    email: email,
    password: password,
  };
}
