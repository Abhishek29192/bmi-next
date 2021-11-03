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
        checkUserValidatiy: async (_query, args, context, resolverInfo) => {
          const { username, email } = args;
          const client = await DoceboClient.create(context);
          const { data } = await client.checkUserValidatiy(username, email);

          return data;
        },
        userByEmail: async (_query, args, context, resolverInfo) => {
          const { email } = args;
          const client = await DoceboClient.create(context);
          return client.userByEmail(email);
        },
        token: async (_query, args, context, resolverInfo) => {
          const logger = context.logger("token");

          try {
            const { access_token } = await DoceboClient.getSuperAdminApiToken();

            return { access_token };
          } catch (error) {
            logger.error("Error fetching token: ", error.message);
            throw error;
          }
        },
        tokenByUsername: async (_query, args, context, resolverInfo) => {
          const logger = context.logger("tokenByUsername");

          try {
            const { username } = args;

            const { access_token } = await DoceboClient.getTokenByJWTPayload(
              username
            );
            return { access_token };
          } catch (error) {
            logger.error("Error fetching token by username:", error.message);
            throw error;
          }
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
          const logger = context.logger("createDoceboUser");

          try {
            const doceboClient = await DoceboClient.create(context);
            const { input } = args;

            const { data } = await doceboClient.createUser(input);
            return data;
          } catch (error) {
            logger.error("Error creating user", error.message);
            throw error;
          }
        },
        updateDoceboUser: async (_query, args, context, resolverInfo) => {
          const logger = context.logger("createDoceboUser");

          try {
            const doceboClient = await DoceboClient.create(context);
            const { input } = args;

            const { data } = await doceboClient.updateUser(input);
            return data;
          } catch (error) {
            logger.error("Error creating user", error.message);
            throw error;
          }
        }
      }
    }
  };
});

export default ExtendSchemaPlugin;
