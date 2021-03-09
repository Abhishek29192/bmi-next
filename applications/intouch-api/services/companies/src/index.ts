import { ApolloServer } from "apollo-server";
import { postgraphileApollo } from "./postgraphile";

async function main() {
  const { schema, plugin } = await postgraphileApollo();

  const server = new ApolloServer({
    schema: schema,
    plugins: [plugin]
  });

  const PORT = process.env.PORT || 4001;
  await server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Companies service started at http://localhost:${PORT}`);
  });
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
