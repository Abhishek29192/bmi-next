import { ApolloServer } from "apollo-server";
import dotenv from "dotenv";

dotenv.config();
import gateway from "./gateway";

const server = new ApolloServer({
  gateway: gateway,
  engine: false,
  subscriptions: false,
  introspection: true,
  playground: true
});

const PORT = process.env.PORT || 4000;
server.listen({ port: PORT }).then(({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`🚀 Intouch API ready at ${url}`);
});
