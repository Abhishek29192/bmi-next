import express from "express";
import dotenv from "dotenv";

dotenv.config();
import { WinstonLogger } from "@bmi/logger";
import { graphqlUploadExpress } from "graphql-upload";

import { setEnvFromSecrets } from "./services/secrets";
import { postgraphile } from "./postgraphile";
import parseUserInfo from "./middleware/parseUserInfo";
import pubsub from "./middleware/pubsub";

const PORT = process.env.PORT || 4001;

async function main() {
  await setEnvFromSecrets([
    { secret: "COMPANIES_DB_HOST", env: "PG_HOST" },
    { secret: "COMPANIES_DB_PASSWORD", env: "PG_PASSWORD" },
    { secret: "AUTH0_API_CLIENT_SECRET", env: "AUTH0_API_CLIENT_SECRET" }
  ]);

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
  app.use(WinstonLogger);

  // Parse header to get current user info
  app.use(parseUserInfo);

  // Init GCP PubSub service
  app.use(pubsub);

  // Init postgraphile
  app.use(postgraphile());

  app.use((err, req, res, next) => {
    // const logger = req.logger("index");
    // logger.error(err.stack);
    return res.send(err);
  });

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
