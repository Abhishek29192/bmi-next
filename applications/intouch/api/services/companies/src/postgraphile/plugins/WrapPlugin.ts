import { makeWrapResolversPlugin } from "graphile-utils";
import Auth0 from "../../services/auth0";
import { updateCompany, deleteCompanyMember } from "../../services/company";
import { createAccount, updateAccount } from "../../services/account";

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
      }
    }
  };
});

export default WrapPlugin;
