import { Buffer } from "buffer";
import dotenv from "dotenv";

dotenv.config();

import express from "express";
import { ApolloServer } from "apollo-server-express";
import expressPlayground from "graphql-playground-middleware-express";

import gatewayService from "./gateway";
import auth from "./middleware/auth";
import config from "./config";

const { PORT = 4000 } = process.env;

(async () => {
  try {
    const gateway = await gatewayService();
    const app = express();

    app.use(express.json());
    app.use(auth);
    if (process.env.NODE_ENV === "development") {
      app.get("/playground", expressPlayground({ endpoint: "/graphql" }));
    }
    const server = new ApolloServer({
      gateway,
      playground: false,
      context: ({ req }) => {
        const { user, headers } = req;
        let userInfo: string = "";

        try {
          userInfo = Buffer.from(JSON.stringify(user)).toString("base64");
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(
            `${headers["x-request-id"]}: error creating base64 from user object`
          );
        }

        // Using the approch used by gcp api gateway: https://cloud.google.com/api-gateway/docs/authenticate-service-account
        return {
          authorization: headers.authorization,
          "x-request-id": headers["x-request-id"],
          "x-apigateway-api-userinfo": userInfo
        };
      },
      ...config.apolloServer
    });

    server.applyMiddleware({ app });
    app.use((err, req, res, next) => {
      // TODO: better error handling and logging
      if (err.status === 401) {
        return res.status(err.status).send({
          error: "No authorization token was found"
        });
      }
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
