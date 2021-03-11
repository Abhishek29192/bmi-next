import { ApolloServer } from "apollo-server";
import dotenv from "dotenv";

dotenv.config();

import gatewayService from "./gateway";

(async () => {
  const gateway = await gatewayService();

  const server = new ApolloServer({
    gateway,
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
})();
