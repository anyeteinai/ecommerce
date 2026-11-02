import type { ErrorRequestHandler } from "express";
import { ErrorCode, HttpException } from "../exceptions/root.js";

export const errorMiddleware: ErrorRequestHandler = (error, request, response, next) => {
  if (response.headersSent) {
    return next(error);
  }

  if (error instanceof HttpException) {
    return response.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
      errors: error.errors,
    });
  }

  console.error(error);
  return response.status(500).json({
    message: "Internal server error",
    errorCode: ErrorCode.INTERNAL_EXCEPTION,
  });
};
