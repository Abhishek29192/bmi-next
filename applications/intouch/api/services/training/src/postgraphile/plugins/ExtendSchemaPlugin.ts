import { makeExtendSchemaPlugin } from "graphile-utils";
import { DoceboClient } from "../../apis";
import typeDefs from "./typeDefs";
import { updateTrainingResolver } from "./resolverDefs";

const ExtendSchemaPlugin = makeExtendSchemaPlugin((build) => {
  const {
    graphql: { graphql }
  } = build;

  return {
    typeDefs,
    resolvers: {
      Query: {
        token: async (_query, args, context, resolverInfo) => {
          const { access_token } = await DoceboClient.getSuperAdminApiToken();

          return { access_token };
        },
        tokenByUsername: async (_query, args, context, resolverInfo) => {
          const { username } = args;

          const { access_token } = await DoceboClient.getTokenByJWTPayload(
            username
          );
          return { access_token };
        }
      },
      Mutation: {
        createSSOUrl: async (_query, args, context, resolverInfo) => {
          const { username, path } = args;

          const url = await DoceboClient.createSSOUrl(username, path);

          return { url };
        },
        updateTraining: async (_query, args, context, resolverInfo) => {
          await updateTrainingResolver({
            graphql,
            args,
            context,
            resolverInfo
          });

          return `Done`;
        },
        createDoceboUser: async (_query, args, context, resolverInfo) => {
          const doceboClient = await DoceboClient.create();
          const { input } = args;

          const { data } = await doceboClient.createUser(input);
          return data;
        }
      }
    }
  };
});

export default ExtendSchemaPlugin;
