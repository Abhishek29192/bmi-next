import { makeWrapResolversPlugin } from "graphile-utils";
import { updateCompany, deleteCompanyMember } from "../../services/company";
import { createAccount, updateAccount } from "../../services/account";
import { evidenceItemsAdd } from "../../services/evidenceItem";

const WrapPlugin = makeWrapResolversPlugin((build) => {
  return {
    Mutation: {
      createAccount: {
        requires: {
          childColumns: [{ column: "id", alias: "$account_id" }]
        },
        async resolve(resolve: any, source, args, context: any, resolveInfo) {
          return createAccount(resolve, source, args, context, resolveInfo);
        }
      },
      updateAccount: {
        requires: {
          childColumns: [{ column: "first_name", alias: "$first_name" }]
        },
        async resolve(
          resolve: any,
          source,
          args: any,
          context: any,
          resolveInfo
        ) {
          return updateAccount(resolve, source, args, context, resolveInfo);
        }
      },
      updateCompany: {
        async resolve(resolve: any, source, args, context: any, resolveInfo) {
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
      }
    }
  };
});

export default WrapPlugin;
