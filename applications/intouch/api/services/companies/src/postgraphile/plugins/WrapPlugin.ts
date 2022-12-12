import { Source } from "graphql";
import { makeWrapResolversPlugin } from "graphile-utils";
import {
  CreateGuaranteeInput,
  CreateNoteInput,
  DeleteEvidenceItemInput,
  UpdateCompanyInput,
  UpdateGuaranteeInput,
  UpdateProjectMemberInput,
  CreateDoubleAcceptanceInput,
  UpdateDoubleAcceptanceInput,
  UpdateMerchandiseTiersByMarketInput,
  CreateRewardRequestInput
} from "@bmi/intouch-api-types";
import {
  createCompany,
  updateCompany,
  deleteCompanyMember
} from "../../services/company";
import { createAccount, updateAccount } from "../../services/account";
import {
  deleteEvidenceItem,
  evidenceItemsAdd
} from "../../services/evidenceItem";
import { createGuarantee, updateGuarantee } from "../../services/guarantee";
import * as projectMutations from "../../services/project/mutations";
import { PostGraphileContext } from "../../types";
import { updateProjectMember } from "../../services/projectMember";
import { createNote } from "../../services/note";
import Auth0 from "../../services/auth0";
import * as companyDocumentMutation from "../../services/companyDocument";
import * as doceboTierMutation from "../../services/doceboTier";
import * as doubleAcceptanceMutation from "../../services/doubleAcceptance";
import { updateMerchandiseTiersByMarket } from "../../services/merchandise";
import * as rewardRequestMutation from "../../services/rewardRequest";

const WrapPlugin = makeWrapResolversPlugin((build) => {
  return {
    Mutation: {
      createAccount: {
        requires: {
          childColumns: [
            { column: "email", alias: "$email" },
            { column: "id", alias: "$account_id" },
            { column: "market_id", alias: "$market_id" }
          ]
        },
        async resolve(resolve: any, source, args, context: any, resolveInfo) {
          return createAccount(resolve, source, args, context, resolveInfo);
        }
      },
      updateAccount: {
        requires: {
          childColumns: [
            { column: "docebo_user_id", alias: "$docebo_user_id" },
            { column: "first_name", alias: "$first_name" },
            { column: "email", alias: "$email" }
          ]
        },
        async resolve(
          resolve: any,
          source,
          args: any,
          context: any,
          resolveInfo
        ) {
          const auth0 = await Auth0.init(context.logger);

          return updateAccount(
            resolve,
            source,
            args,
            context,
            resolveInfo,
            auth0
          );
        }
      },
      createCompany: {
        resolve: createCompany
      },
      updateCompany: {
        requires: {
          childColumns: [
            { column: "name", alias: "$name" },
            {
              column: "registered_address_id",
              alias: "$registered_address_id"
            },
            { column: "business_type", alias: "$business_type" },
            { column: "tax_number", alias: "$tax_number" },
            { column: "status", alias: "$status" }
          ]
        },
        async resolve(
          resolve: any,
          source,
          args: { input: UpdateCompanyInput },
          context: any,
          resolveInfo
        ) {
          return updateCompany(resolve, source, args, context, resolveInfo);
        }
      },
      deleteCompanyMember: {
        async resolve(resolve: any, source, args, context: any, resolveInfo) {
          return deleteCompanyMember(
            resolve,
            source,
            args,
            context,
            resolveInfo
          );
        }
      },
      evidenceItemsAdd: {
        async resolve(resolve: any, source, args: any, context, resolveInfo) {
          return evidenceItemsAdd(resolve, source, args, context, resolveInfo);
        }
      },
      deleteEvidenceItem: {
        async resolve(
          resolve,
          source: Source | string,
          args: { input: DeleteEvidenceItemInput },
          context: PostGraphileContext,
          resolveInfo
        ) {
          return deleteEvidenceItem(
            resolve,
            source,
            args,
            context,
            resolveInfo
          );
        }
      },
      createGuarantee: {
        async resolve(
          resolve,
          source: Source | string,
          args: { input: CreateGuaranteeInput },
          context: PostGraphileContext,
          resolveInfo
        ) {
          return createGuarantee(resolve, source, args, context, resolveInfo);
        }
      },
      updateGuarantee: {
        async resolve(
          resolve,
          source: Source | string,
          args: { input: UpdateGuaranteeInput },
          context: PostGraphileContext,
          resolveInfo
        ) {
          return updateGuarantee(resolve, source, args, context, resolveInfo);
        }
      },
      updateProjectMember: {
        async resolve(
          resolve,
          source: Source | string,
          args: { input: UpdateProjectMemberInput },
          context: PostGraphileContext,
          resolveInfo
        ) {
          return updateProjectMember(
            resolve,
            source,
            args,
            context,
            resolveInfo
          );
        }
      },
      ...projectMutations,
      createNote: {
        async resolve(
          resolve,
          source: Source | string,
          args: { input: CreateNoteInput },
          context: PostGraphileContext,
          resolveInfo
        ) {
          return createNote(resolve, source, args, context, resolveInfo);
        }
      },
      ...companyDocumentMutation,
      ...doceboTierMutation,
      ...{
        ...doubleAcceptanceMutation,
        createDoubleAcceptance: {
          requires: {
            childColumns: [
              { column: "id", alias: "$id" },
              { column: "guarantee_id", alias: "$guaranteeId" },
              { column: "temp_token", alias: "$tempToken" }
            ]
          },
          async resolve(
            resolve,
            source: Source | string,
            args: { input: CreateDoubleAcceptanceInput },
            context: PostGraphileContext,
            resolveInfo
          ) {
            return doubleAcceptanceMutation.createDoubleAcceptance(
              resolve,
              source,
              args,
              context,
              resolveInfo
            );
          }
        },
        updateDoubleAcceptance: {
          async resolve(
            resolve,
            source: Source | string,
            args: { input: UpdateDoubleAcceptanceInput },
            context: PostGraphileContext,
            resolveInfo
          ) {
            return doubleAcceptanceMutation.updateDoubleAcceptance(
              resolve,
              source,
              args,
              context,
              resolveInfo
            );
          }
        }
      },
      updateMerchandiseTiersByMarket: {
        async resolve(
          resolve,
          source: Source | string,
          args: { input: UpdateMerchandiseTiersByMarketInput },
          context: PostGraphileContext
        ) {
          return updateMerchandiseTiersByMarket(resolve, source, args, context);
        }
      },
      createRewardRequest: {
        requires: {
          childColumns: [
            { column: "id", alias: "$id" },
            { column: "company_id", alias: "$companyId" },
            { column: "redemption_code", alias: "$redemptionCode" }
          ]
        },
        async resolve(
          resolve,
          source: Source | string,
          args: { input: CreateRewardRequestInput },
          context: PostGraphileContext,
          resolveInfo
        ) {
          return rewardRequestMutation.createRewardRequest(
            resolve,
            source,
            args,
            context,
            resolveInfo
          );
        }
      }
    }
  };
});

export default WrapPlugin;
