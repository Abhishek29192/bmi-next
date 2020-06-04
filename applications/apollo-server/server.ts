import { ApolloServer } from "apollo-server";
import resolvers from "./src/resolvers";
// NOTE: import this from schema lib
import typeDefs from "./src/schema";

const server: ApolloServer = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`🚀  Server ready at ${url}`);
});
