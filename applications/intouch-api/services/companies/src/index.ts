import express from "express";
import dotenv from "dotenv";

dotenv.config();
import postgraphile from "./postgraphile";

const app = express();

app.use(postgraphile);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Company service started at http://localhost:${PORT}`);
});
