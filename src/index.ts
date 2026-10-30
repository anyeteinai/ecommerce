import express, { type Express, type Request, type Response } from "express";

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
  res.send("Bitch ass nigga, I am a MOTHER");
});

app.listen(3000, () => {
  console.log("App STARted");
});
