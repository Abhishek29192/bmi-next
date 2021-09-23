import { GraphQLUpload } from "graphql-upload";
import { makeExtendSchemaPlugin } from "graphile-utils";
import {
  ContentfulGuaranteeTemplatesCollection,
  ContentfulGuaranteeTypeCollection,
  EvidenceCategoryCollection
} from "@bmi/intouch-api-types";
import {
  invite,
  completeInvitation,
  resetPasswordImportedUsers
} from "../../services/account";
import { publish, TOPICS } from "../../services/events";
import {
  getGuaranteeTypeCollection,
  getEvidenceCategory,
  getGuaranteeTemplates
} from "../../services/contentful";
import {
  getCompanyCertifications,
  getCompanyIsProfileComplete,
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
        },
        // NOTE: this resolver currently requires the parent to have all the fields which are being check in the query
        // if the query doesn't include the necessary sub-fields, the resolver will return `false`
        isProfileComplete: (parent) => {
          return getCompanyIsProfileComplete(parent);
        }
      },
      Guarantee: {
        guaranteeType: async (_query, args, context) => {
          const { guaranteeReferenceCode, languageCode } = _query;

          if (!guaranteeReferenceCode) return null;

          const {
            data: { guaranteeTypeCollection }
          }: {
            data: {
              guaranteeTypeCollection: ContentfulGuaranteeTypeCollection;
            };
          } = await getGuaranteeTypeCollection(
            context.clientGateway,
            guaranteeReferenceCode
          );

          if ((guaranteeTypeCollection?.items?.length || 0) === 0) {
            return null;
          }
          return { ...guaranteeTypeCollection.items[0], languageCode };
        }
      },
      ContentfulGuaranteeType: {
        guaranteeTemplatesCollection: async (_query, args, context) => {
          const { technology, coverage, languageCode } = _query;

          if ([technology, coverage].filter(Boolean).length !== 2) return null;

          const {
            data: { guaranteeTemplateCollection }
          }: {
            data: {
              guaranteeTemplateCollection: ContentfulGuaranteeTemplatesCollection;
            };
          } = await getGuaranteeTemplates(
            context.clientGateway,
            technology,
            coverage,
            languageCode
          );

          return guaranteeTemplateCollection;
        }
      },
      EvidenceItem: {
        signedUrl: async (parent, args, { storageClient }) => {
          return await storageClient.getPrivateAssetSignedUrl(
            parent.attachment
          );
        },
        customEvidenceCategory: async (_query, args, context) => {
          const { customEvidenceCategoryKey } = _query;

          if (!customEvidenceCategoryKey) return null;

          const {
            data: { evidenceCategoryCollection }
          }: {
            data: { evidenceCategoryCollection: EvidenceCategoryCollection };
          } = await getEvidenceCategory(
            context.clientGateway,
            customEvidenceCategoryKey
          );

          return evidenceCategoryCollection?.items[0];
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
        resetPasswordImportedUsers: async (
          _query,
          args,
          context,
          resolveInfo
        ) => {
          const auth0 = await Auth0.init(context.logger);
          return resetPasswordImportedUsers(
            _query,
            args,
            context,
            resolveInfo,
            auth0
          );
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
