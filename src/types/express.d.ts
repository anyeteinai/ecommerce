import type { User } from "../generated/prisma/client.ts";

declare module "express-serve-static-core" {
  export interface Request {
    user: User;
  }
}
