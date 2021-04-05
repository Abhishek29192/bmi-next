import dotenv from "dotenv";

dotenv.config();

import { ApolloServer } from "apollo-server-express";
import express from "express";

import gatewayService from "./gateway";
import auth from "./middleware/auth";

const { AUTH0_NAMESPACE, PORT = 4000 } = process.env;

(async () => {
  try {
    const gateway = await gatewayService();
    const app = express();

    app.use(auth);
    const server = new ApolloServer({
      gateway,
      engine: false,
      subscriptions: false,
      introspection: true,
      playground: true,
      context: ({ req }) => {
        const { user, headers } = req;
        const userUuid = user?.sub?.split("|")?.[1];
        const role = user[`${AUTH0_NAMESPACE}/role`];
        const internalUserId = user[`${AUTH0_NAMESPACE}/internal_user_id`];
        const docebo_token = user[`${AUTH0_NAMESPACE}/docebo_token`];

        return {
          authorization: headers.authorization,
          "x-docebo-user-token": docebo_token,
          "x-authenticated-user-id": userUuid,
          "x-authenticated-role": role,
          "x-authenticated-internal-user-id": internalUserId
        };
      }
    });

    server.applyMiddleware({ app });
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`🚀 Intouch API ready at ${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  }
})();
