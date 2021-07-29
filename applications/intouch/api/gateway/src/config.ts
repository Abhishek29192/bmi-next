import { ApolloServerExpressConfig } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";

const NODE_ENV = process.env.NODE_ENV;

const apolloServer: ApolloServerExpressConfig =
  NODE_ENV === "production"
    ? {
        introspection: false
      }
    : {
        introspection: true,
        plugins: [
          ApolloServerPluginLandingPageGraphQLPlayground({
            settings: {
              "request.credentials": "include"
            }
          })
        ]
      };

export default {
  apolloServer
};
