import { Buffer } from "buffer";
import dotenv from "dotenv";
import { WinstonLogger } from "@bmi-digital/logger";
import { graphqlUploadExpress } from "graphql-upload";

dotenv.config();
import express from "express";
import { ApolloServer } from "apollo-server-express";

import gatewayService from "./gateway";
import config from "./config";

const { PORT = 4000 } = process.env;

(async () => {
  try {
    const gateway = await gatewayService();
    const app = express();
    app.use(WinstonLogger);
    app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

    const server = new ApolloServer({
      gateway,
      context: ({ req }) => {
        const { headers } = req;

        let userInfo;

        try {
          userInfo = JSON.parse(
            Buffer.from(
              headers["x-apigateway-api-userinfo"] as string,
              "base64"
            ).toString("ascii")
          );
        } catch (error) {
          // eslint-disable-next-line
          console.log(error.message);
        }

        /**
         * https://cloud.google.com/api-gateway/docs/authenticate-service-account
         *
         * The Api gateway return an header called x-apigateway-api-userinfo with
         * with a string in base64 with the content of the jwt token
         *
         *
         * x-request-id is a random uuid usefull to track the request through all
         * the different services
         * */
        return {
          "x-apigateway-api-userinfo": headers["x-apigateway-api-userinfo"],
          "x-authenticated-user-id": userInfo?.sub,
          "x-request-id": headers["x-request-id"],
          market: headers["x-request-market-domain"]
        };
      },
      ...config.apolloServer
    });

    await server.start();
    server.applyMiddleware({ app });

    app.get("/health", (req, res) =>
      res.send({
        status: "up"
      })
    );

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
