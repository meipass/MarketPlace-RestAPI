export const errorMap = {
  INVALID_CREDENTIALS: 401,
};

export type ErrorCode = keyof typeof errorMap;

export class AppError extends Error {
  public statusCode: number;
  public code: string;

  constructor(code: ErrorCode) {
    super(code);

    this.name = "AppError";
    this.code = code;
    this.statusCode = errorMap[code];

    Error.captureStackTrace(this, this.constructor);
  }
}
