import express from "express";
import dotenv from "dotenv";

dotenv.config();

import { WinstonLogger } from "@bmi-digital/logger";
import { postgraphile } from "./postgraphile";
import docebo from "./middleware/docebo";
import parseUserInfo from "./middleware/parseUserInfo";

const PORT = process.env.PORT || 4003;

async function main() {
  const app = express();

  app.use(express.json());
  // add logger
  app.use(WinstonLogger);
  app.use(parseUserInfo);
  app.use("*", docebo);
  app.use(postgraphile());

  app.get("/health", (req, res) =>
    res.send({
      status: "up"
    })
  );

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Training service started at http://localhost:${PORT}`);
  });
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
