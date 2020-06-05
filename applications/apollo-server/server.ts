import { ApolloServer } from "apollo-server";
import resolvers from "./src/resolvers";
import typeDefs from "@bmi/schema-defs";

const server: ApolloServer = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`🚀  Server ready at ${url}`);
});
