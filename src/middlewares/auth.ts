import type { RequestHandler } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized.js";
import { ErrorCode } from "../exceptions/root.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets.js";
import { prismaClient } from "../index.js";

const authMiddleware: RequestHandler = async (request, response, next) => {
  const token = request.headers.authorization;

  if (!token) {
    return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (typeof payload !== "object" || payload === null || typeof payload.userId !== "number") {
      return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
    }

    const user = await prismaClient.user.findFirst({ where: { id: payload.userId } });

    if (!user) {
      return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
    } 

    request.user = user;

    return next();
  } catch (error) {
    return next(new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
};

export default authMiddleware;
