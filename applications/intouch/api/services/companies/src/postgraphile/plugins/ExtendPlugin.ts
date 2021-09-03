import { GraphQLUpload } from "graphql-upload";
import { makeExtendSchemaPlugin } from "graphile-utils";
import { invite, completeInvitation } from "../../services/account";
import { publish, TOPICS } from "../../services/events";
import { getGuarantee, getEvidenceCategory } from "../../services/contentful";
import {
  getCompanyCertifications,
  guaranteeResolver
} from "../../services/company/customResolvers";
import Auth0 from "../../services/auth0";
import { bulkImport } from "../../services/products/bulkImport";
import { resetPassword } from "../../services/account";
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
          } = await getGuarantee(context.clientGateway, guaranteeTypeId);

          return guaranteeType;
        }
      },
      EvidenceItem: {
        customEvidenceCategory: async (_query, args, context) => {
          const { customEvidenceCategoryId } = _query;

          if (!customEvidenceCategoryId) return null;

          const {
            data: { evidenceCategory }
          } = await getEvidenceCategory(
            context.clientGateway,
            customEvidenceCategoryId
          );

          return evidenceCategory;
        }
      },
      Account: {
        signedPhotoUrl: async (parent, _args, context) => {
          return context.storageClient.getPrivateAssetSignedUrl(parent.photo);
        },
        formattedRole: async (parent, args, context) => {
          const formattedRoles = {
            COMPANY_ADMIN: "Company Admin",
            INSTALLER: "Installer",
            MARKET_ADMIN: "Market Admin",
            SUPER_ADMIN: "Super Admin"
          };
          return formattedRoles[parent?.role || "INSTALLER"];
        }
      },
      Mutation: {
        invite: async (_query, args, context, resolveInfo) => {
          const auth0 = await Auth0.init(context.logger);
          return invite(_query, args, context, resolveInfo, auth0);
        },
        completeInvitation: async (_query, args, context, resolveInfo) => {
          const auth0 = await Auth0.init(context.logger);
          return completeInvitation(
            _query,
            args,
            context,
            resolveInfo,
            auth0,
            build
          );
        },
        publishMessage: async (_query, args, context, resolveInfo) => {
          const { input } = args;

          await publish(context, TOPICS.TRANSACTIONAL_EMAIL, input);

          return input;
        },
        createGuaranteePdf: async (_query, args, context, resolverInfo) => {
          const data = await guaranteeResolver({
            graphql,
            args,
            context,
            resolverInfo
          });
          const messageId = await publish(context, TOPICS.GUARANTEE_PDF, data);

          return { messageId };
        },
        bulkImport: async (query, args, context, resolveInfo) => {
          return bulkImport(args, context);
        },
        resetPassword: async (_query, args, context, resolveInfo) => {
          const auth0 = await Auth0.init(context.logger);
          return resetPassword(_query, args, context, resolveInfo, auth0);
        }
      }
    }
  };
});

export default ExtendSchemaPlugin;
