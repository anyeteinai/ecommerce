import express, { type Express } from "express";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PORT } from "./secrets.js";
import rootRouter from "./routes/index.js";
import { PrismaClient } from "./generated/prisma/client.js";
import { errorMiddleware } from "./middlewares/errors.js";

const app: Express = express();

app.use(express.json());

app.use("/api", rootRouter);

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!, {
  useTextProtocol: true,
});

export const prismaClient = new PrismaClient({
  adapter,
  log: ["query"],
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log("Here we fucking go");
});
