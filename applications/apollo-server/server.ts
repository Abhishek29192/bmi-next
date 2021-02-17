import { ApolloServer, makeExecutableSchema } from "apollo-server";
import typeDefs from "@bmi/schema-defs";
import resolvers from "./src/resolvers";

const runServer = async () => {
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server: ApolloServer = new ApolloServer({
    schema
  });

  server.listen().then(({ url }) => {
    // eslint-disable-next-line no-console
    console.log(`🚀  Server ready at ${url}`);
  });
};

try {
  runServer();
} catch (err) {
  // eslint-disable-next-line no-console
  console.error("Error running Apollo server:", err);
}
