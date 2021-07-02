import { GraphQLUpload } from "graphql-upload";
import { makeExtendSchemaPlugin } from "graphile-utils";
import { invite, completeInvitation } from "../../services/account";
import { publish, TOPICS } from "../../services/events";
import { getGuarantee, getEvidenceCategory } from "../../services/contentful";
<<<<<<< HEAD
import {
  getCompanyCertifications,
  guaranteeResolver
} from "../../services/company/customResolvers";
=======
import { guaranteeResolver } from "../../services/company/customResolvers";
>>>>>>> c23cd701 (feat(intouch-api): update custom guarantee resolver to get evidences)
import Auth0 from "../../services/auth0";
import { bulkImport } from "../../services/products/bulkImport";
import typeDefs from "./typeDefs";

const ExtendSchemaPlugin = makeExtendSchemaPlugin((build) => {
  const {
    graphql: { graphql }
  } = build;

  return {
    typeDefs,
    resolvers: {
      Upload: GraphQLUpload,
      Company: {
        certifications: async (parent, args, context, info) => {
          return getCompanyCertifications(parent, args, context);
        }
      },
      Guarantee: {
        guaranteeType: async (_query, args, context) => {
          const { guaranteeTypeId } = _query;
          const {
            data: { guaranteeType }
          } = await getGuarantee(guaranteeTypeId);

          return guaranteeType;
        }
      },
      EvidenceItem: {
        customEvidenceCategory: async (_query, args, context) => {
          const { customEvidenceCategoryId } = _query;

          if (!customEvidenceCategoryId) return null;

          const {
            data: { evidenceCategory }
          } = await getEvidenceCategory(customEvidenceCategoryId);

          return evidenceCategory;
        }
      },
      Mutation: {
        invite: async (_query, args, context, resolveInfo) => {
          const auth0 = await Auth0.init(context.logger);
          return invite(_query, args, context, resolveInfo, auth0);
        },
        completeInvitation: async (_query, args, context, resolveInfo) => {
          const auth0 = await Auth0.init(context.logger);
          return completeInvitation(_query, args, context, resolveInfo, auth0);
        },
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

          return { messageId };
        },
        bulkImport: async (query, args, context, resolveInfo) => {
          return bulkImport(args, context);
        }
      }
    }
  };
});

export default ExtendSchemaPlugin;
