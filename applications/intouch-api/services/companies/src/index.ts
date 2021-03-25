import express from "express";
import { ApolloServer } from "apollo-server-express";
import { postgraphileApollo } from "./postgraphile";

const PORT = process.env.PORT || 4001;

async function main() {
  const { schema, plugin } = await postgraphileApollo();

  const app = express();
  const server = new ApolloServer({
    schema: schema,
    plugins: [plugin]
  });

  server.applyMiddleware({ app });

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
