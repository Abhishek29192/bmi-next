import express from "express";
import dotenv from "dotenv";

dotenv.config();

import { WinstonLogger } from "@bmi-digital/logger";
import { setEnvFromSecrets } from "./services/secrets";
import { postgraphile } from "./postgraphile";
import docebo from "./middleware/docebo";
import parseUserInfo from "./middleware/parseUserInfo";

const PORT = process.env.PORT || 4003;

async function main() {
  await setEnvFromSecrets([
    { secret: "TRAINING_DB_PASSWORD", env: "PG_PASSWORD" },
    { secret: "TRAINING_DB_HOST", env: "PG_HOST" },
    { secret: "DOCEBO_API_CLIENT_ID", env: "DOCEBO_API_CLIENT_ID" },
    { secret: "DOCEBO_API_CLIENT_SECRET", env: "DOCEBO_API_CLIENT_SECRET" },
    { secret: "DOCEBO_API_JWT_PASSPHRASE", env: "DOCEBO_API_JWT_PASSPHRASE" },
    { secret: "DOCEBO_API_USERNAME", env: "DOCEBO_API_USERNAME" },
    { secret: "DOCEBO_JWT_KEY", env: "DOCEBO_JWT_KEY" }
  ]);

  const app = express();

  app.use(express.json());
  // add logger
  app.use(WinstonLogger);
  app.use(parseUserInfo);
  app.use("*", docebo);
  app.use(postgraphile());
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
