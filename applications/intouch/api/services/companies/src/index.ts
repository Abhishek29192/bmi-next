import express from "express";
import dotenv from "dotenv";

dotenv.config();
import { WinstonLogger } from "@bmi-digital/logger";
import { graphqlUploadExpress } from "graphql-upload";

import { setEnvFromSecrets } from "./services/secrets";
import { postgraphile } from "./postgraphile";
import parseUserInfo from "./middleware/parseUserInfo";
import pubsub from "./middleware/pubsub";
import clientGateway from "./middleware/clientGateway";

const PORT = process.env.PORT || 4001;

// You cannot upload files larger than <MAX_FILE_SIZE> MB (It's megabyte)
const MAX_FILE_SIZE = 40;

async function main() {
  await setEnvFromSecrets([
    { secret: "COMPANIES_DB_HOST", env: "PG_HOST" },
    { secret: "COMPANIES_DB_PASSWORD", env: "PG_PASSWORD" },
    { secret: "AUTH0_API_CLIENT_SECRET", env: "AUTH0_API_CLIENT_SECRET" },
    { secret: "CONTENTFUL_TOKEN", env: "CONTENTFUL_TOKEN" },
    { secret: "PG_SSL_CLIENT_KEY", env: "PG_SSL_CLIENT_KEY" },
    { secret: "PG_SSL_CLIENT_CERT", env: "PG_SSL_CLIENT_CERT" },
    { secret: "PG_SSL_SERVER_CA", env: "PG_SSL_SERVER_CA" }
  ]);

  const app = express();
  app.use(WinstonLogger);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    graphqlUploadExpress({
      maxFileSize: MAX_FILE_SIZE * (1024 * 1024),
      maxFiles: 10
    })
  );

  // Parse header to get current user info
  app.use(parseUserInfo);

  // Append gateway client to the request object
  app.use(clientGateway);

  // Init GCP PubSub service
  app.use(pubsub);

  // Init postgraphile
  app.use(postgraphile());

  app.get("/health", (req, res) =>
    res.send({
      status: "up"
    })
  );

  app.use((err, req, res, next) => {
    const logger = req.logger("index");
    logger.error(err.stack);
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
