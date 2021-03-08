import dotenv from "dotenv";

dotenv.config();

import { ApolloServer } from "apollo-server-express";
import express from "express";
import cors from "cors";

import gatewayService from "./gateway";
import auth from "./middleware/auth";

const PORT = process.env.PORT || 4000;

const { AUTH0_NAMESPACE } = process.env;

(async () => {
  try {
    const gateway = await gatewayService();
    const app = express();

    app.use(cors());
    app.use(auth);
    const server = new ApolloServer({
      gateway,
      engine: false,
      subscriptions: false,
      introspection: true,
      playground: true,
      context: ({ req }) => {
        const user = req["user"];
        const userUuid = user?.sub?.split("|")?.[1];
        const role = user[`${AUTH0_NAMESPACE}/role`];
        const internalUserId = user[`${AUTH0_NAMESPACE}/internal_user_id`];

        return {
          authorization: req.headers.authorization,
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
