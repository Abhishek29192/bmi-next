import express from "express";
import dotenv from "dotenv";

dotenv.config();

import { postgraphile } from "./postgraphile";
import docebo from "./middleware/docebo";

const PORT = process.env.PORT || 4003;

async function main() {
  const app = express();

  app.use(express.json());
  app.use("*", docebo);
  app.use(postgraphile);
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
