import { AppError } from "../errors/AppError.js"
import type { RegisterData } from "../interfaces/registerData.interface.js";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateRegistrationBody(body: unknown): RegisterData {
  if (!isObject(body)) {
    throw new AppError("Invalid body", 400)
  }

  const { login, email, password } = body

  if (typeof(login) !== "string") {
    throw new AppError("login is required", 400)
  }

  if (typeof (email) !== "string") {
    throw new AppError("Email is required", 400)
  }

  if (typeof (password) !== "string") {
    throw new AppError("Password is required", 400)
  }

  if (login.length < 3) {
    throw new AppError("login must be longer than 3 symbols", 400)
  }

  if (password.length < 8) {
    throw new AppError("Password must be longer than 8 symbols", 400)
  }

  if (!isEmail(email)) {
    throw new AppError("Enter an valid email", 400)
  }

  return {
        email: email,
        login: login,
        password: password
    }
}
