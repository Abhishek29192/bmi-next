import { makeExtendSchemaPlugin } from "graphile-utils";
import typeDefs from "./typeDefs";

const ExtendSchemaPlugin = makeExtendSchemaPlugin((build) => {
  return {
    typeDefs,
    resolvers: {
      Query: {
        token: async (_query, args, context, resolverInfo) => {
          const { docebo } = context;

          const {
            data: { access_token }
          } = await docebo.getTokenByUserInfo();

          return { access_token };
        },
        tokenByUsername: async (_query, args, context, resolverInfo) => {
          const { username } = args;
          const { docebo } = context;

          const { access_token } = await docebo.getTokenByJWTPayload(username);

          return { access_token };
        }
      },
      Mutation: {
        createSSOUrl: async (_query, args, context, resolverInfo) => {
          const { username, path } = args;
          const { docebo } = context;

          const url = await docebo.createSSOUrl(username, path);

          return { url };
        }
      }
    }
  };
});

export default ExtendSchemaPlugin;
