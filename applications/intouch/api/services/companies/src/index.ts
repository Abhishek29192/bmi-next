import express from "express";

import dotenv from "dotenv";

dotenv.config();

import { postgraphile } from "./postgraphile";
import parseUserInfo from "./middleware/parseUserInfo";
import pubsub from "./middleware/pubsub";

const PORT = process.env.PORT || 4001;

async function main() {
  const app = express();

  app.use(express.json());
  app.use(parseUserInfo);
  app.use(pubsub);
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
