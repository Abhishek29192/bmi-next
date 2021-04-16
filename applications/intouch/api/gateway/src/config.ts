import { ApolloServerExpressConfig } from "apollo-server-express";

const NODE_ENV = process.env.NODE_ENV;

const apolloServer: ApolloServerExpressConfig =
  NODE_ENV === "production"
    ? {
        engine: false,
        subscriptions: false,
        introspection: false,
        playground: false
      }
    : {
        engine: false,
        subscriptions: false,
        introspection: true,
        playground: {
          settings: {
            "request.credentials": "include"
          }
        }
      };

export default {
  apolloServer
};
