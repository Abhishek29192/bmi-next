import express, { NextFunction, Request, Response } from "express";
import { PubSub } from "@google-cloud/pubsub";
import dotenv from "dotenv";

dotenv.config();

import { postgraphile } from "./postgraphile";

const PORT = process.env.PORT || 4001;

async function main() {
  const pubSub = new PubSub({
    projectId: process.env.GCP_PROJECT
  });

  const app = express();
  app.use((req: Request, res: Response, next: NextFunction) => {
    req.pubSub = pubSub;
    return next();
  });
  app.use(postgraphile);
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Companies service started at http://localhost:${PORT}`);
  });
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
