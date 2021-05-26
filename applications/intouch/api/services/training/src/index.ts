import express from "express";
import dotenv from "dotenv";
import { WinstonLogger } from "@bmi/logger";

dotenv.config();
import { getSecret } from "./services/secrets";
import { postgraphile } from "./postgraphile";
import docebo from "./middleware/docebo";
import parseUserInfo from "./middleware/parseUserInfo";

const PORT = process.env.PORT || 4003;

async function main() {
  const dbPassword = await getSecret("TRAINING_DB_PASSWORD");
  const dbHost = await getSecret("TRAINING_DB_HOST");

  const app = express();

  app.use(express.json());
  app.use(WinstonLogger);
  app.use(parseUserInfo);
  app.use("*", docebo);
  app.use(
    postgraphile({
      dbPassword: process.env.PG_PASSWORD || dbPassword,
      dbHost: process.env.PG_HOST || dbHost
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
