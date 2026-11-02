import { ErrorCode, HttpException } from "./root.js";

export class InternalException extends HttpException {
  constructor(message: string, errors: any, errorCodes: number) {
    super(message, errorCodes, 500, errors);
  }
}
