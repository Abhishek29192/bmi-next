/* This is an example for the purpose of testing Apollo Server */
import { ApolloServer } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";
import { resolvers } from "./resolvers";
import { typeDefs } from "./schema";

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ]),
  introspection: true,
  playground: true
});
const PORT = process.env.PORT || 8080;
server.listen({ port: PORT }).then(({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Product service ready at ${url}`);
});
