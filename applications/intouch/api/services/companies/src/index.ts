import express from "express";
import dotenv from "dotenv";

dotenv.config();

import { postgraphile } from "./postgraphile";

const PORT = process.env.PORT || 4001;

async function main() {
  const app = express();
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
