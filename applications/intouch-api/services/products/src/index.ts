import express from "express";
import dotenv from "dotenv";

dotenv.config();

import postgraphile from "../../shared/postgraphile/";

const app = express();
app.use(postgraphile);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Product service started at http://localhost:${PORT}`);
});
