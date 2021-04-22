import { makeExtendSchemaPlugin } from "graphile-utils";
import { publish, TOPICS } from "../../services/events";
import { getGuarantee } from "../../services/contentful";
import { guaranteeResolver } from "../../services/company/customResolvers";
import typeDefs from "./typeDefs";

const ExtendSchemaPlugin = makeExtendSchemaPlugin((build) => {
  const {
    graphql: { graphql }
  } = build;

  return {
    typeDefs,
    resolvers: {
      Guarantee: {
        guaranteeType: async (_query, args, context) => {
          const { guaranteeTypeId } = _query;
          const {
            data: { guaranteeType }
          } = await getGuarantee(guaranteeTypeId);

          return guaranteeType;
        }
      },

      Mutation: {
        publishMessage: async (_query, args, context, resolveInfo) => {
          const { input } = args;
          const { pubSub } = context;

          await publish(pubSub, TOPICS.TRANSACTIONAL_EMAIL, input);

          return input;
        },
        createGuaranteePdf: async (_query, args, context, resolverInfo) => {
          const { pubSub } = context;
          const data = await guaranteeResolver({
            graphql,
            args,
            context,
            resolverInfo
          });
          const messageId = await publish(pubSub, TOPICS.GUARANTEE_PDF, data);

          return {
            messageId: messageId
          };
        }
      }
    }
  };
});

export default ExtendSchemaPlugin;
