import dotenv from "dotenv";
import { WinstonLogger } from "@bmi/logger";

dotenv.config();

import express from "express";
import { ApolloServer } from "apollo-server-express";
import expressPlayground from "graphql-playground-middleware-express";

import gatewayService from "./gateway";
import config from "./config";

const { PORT = 4000 } = process.env;

(async () => {
  try {
    const gateway = await gatewayService();
    const app = express();

    app.use(express.json());
    app.use(WinstonLogger);
    if (process.env.NODE_ENV === "development") {
      app.get("/playground", expressPlayground({ endpoint: "/graphql" }));
    }
    const server = new ApolloServer({
      gateway,
      playground: false,
      context: ({ req }) => {
        const { headers } = req;

        /**
         * https://cloud.google.com/api-gateway/docs/authenticate-service-account
         *
         * The Api gateway return an header called x-apigateway-api-userinfo with
         * with a string in base64 with the content of the jwt token
         *
         * x-request-id is a random uuid usefull to track the request through all
         * the different services
         * */
        return {
          "x-request-id": headers["x-request-id"],
          "x-apigateway-api-userinfo": headers["x-apigateway-api-userinfo"]
        };
      },
      ...config.apolloServer
    });

    server.applyMiddleware({ app });
    app.use((err, req, res, next) => {
      // TODO: better error handling and logging
      return res.status(err.status).send({
        error: "Something went wrong"
      });
    });
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
