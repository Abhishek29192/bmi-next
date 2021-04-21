import { Buffer } from "buffer";
import dotenv from "dotenv";

dotenv.config();

import { ApolloServer } from "apollo-server-express";
import express from "express";

import gatewayService from "./gateway";
import auth from "./middleware/auth";
import config from "./config";

const { PORT = 4000 } = process.env;

(async () => {
  try {
    const gateway = await gatewayService();
    const app = express();

    app.use(auth);
    const server = new ApolloServer({
      gateway,
      context: ({ req }) => {
        const { user, headers } = req;

        // Using the approch used by gcp api gateway: https://cloud.google.com/api-gateway/docs/authenticate-service-account
        return {
          authorization: headers.authorization,
          "x-request-id": headers["x-request-id"],
          "x-apigateway-api-userinfo": Buffer.from(
            JSON.stringify(user)
          ).toString("base64")
        };
      },
      ...config.apolloServer
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
