import type { RequestHandler } from "express";
import { ErrorCode, HttpException } from "./exceptions/root.js";
import { InternalException } from "./exceptions/internal-exception.js";

export const errorHandler = (method: Function) => {
  const handler: RequestHandler = async (request, response, next) => {
    try {
      await method(request, response, next);
    } catch (error: any) {
      let exception: HttpException;
      if (error instanceof HttpException) {
        exception = error;
      } else {
        exception = new InternalException(
          "Something went wrong!",
          error,
          ErrorCode.INTERNAL_EXCEPTION,
        );
      }
      next(exception);
    }
  };

  return handler;
};
