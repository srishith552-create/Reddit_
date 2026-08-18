import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Centralized error handler middleware.
 * Ensures consistent JSON response structure and proper HTTP status codes.
 */
export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = (err as AppError).statusCode || 500;
  const code = (err as AppError).code || 'INTERNAL_ERROR';
  const message = err.message || 'An unexpected error occurred. Please try again.';

  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    console.error('[ErrorHandler] Error details:', err);
  }

  res.status(statusCode).json({
    error: {
      code,
      message,
    },
  });
}
