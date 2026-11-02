import { type NextFunction, type Request, type Response } from "express";
import { prismaClient } from "../index.js";
import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets.js";
import { BadRequestsException } from "../exceptions/bad-requests.js";
import { ErrorCode } from "../exceptions/root.js";
import { UnprocessableEntity } from "../exceptions/validation.js";
import { SignUpSchema } from "../schema/users.js";
import { NotFoundException } from "../exceptions/not found.js";

export const signup = async (request: Request, response: Response, next: NextFunction) => {
  SignUpSchema.parse(request.body);
  const { email, password, name } = request.body;

  let user = await prismaClient.user.findFirst({ where: { email } });

  if (user) {
    throw new BadRequestsException("User already exists", ErrorCode.USER_ALREADY_EXISTS);
  }

  user = await prismaClient.user.create({
    data: { name, email, password: hashSync(password, 10) },
  });

  response.json(user);
};

export const login = async (request: Request, response: Response) => {
  const { email, password } = request.body;

  let user = await prismaClient.user.findFirst({ where: { email } });

  if (!user) {
    throw new NotFoundException("User Not Found", ErrorCode.USER_NOT_FOUND);
  }

  if (!compareSync(password, user.password)) {
    throw new BadRequestsException("Incorrect Password", ErrorCode.INCORRECT_PASSWORD);
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET);

  response.json({ user, token });
};

export const me = async (request: Request, response: Response) => {
  response.json(request.user);
};
