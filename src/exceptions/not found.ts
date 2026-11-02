import { HttpException } from "./root.js";

export class NotFoundException extends HttpException {
  constructor(message: string, errorCode: number, errors?: any) {
    super(message, errorCode, 401, errors);
  }
}
