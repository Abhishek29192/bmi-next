import { makeWrapResolversPlugin } from "graphile-utils";
import Auth0 from "../../services/auth0";
import { updateCompany } from "../../services/company";
import { createAccount, updateAccount } from "../../services/account";

const WrapPlugin = makeWrapResolversPlugin((build) => {
  return {
    Mutation: {
      createAccount: {
        requires: {
          childColumns: [
            { column: "id", alias: "$account_id" },
            { column: "market_id", alias: "$market_id" },
            { column: "role", alias: "$role" }
          ]
        },
        async resolve(resolve: any, source, args, context: any, resolveInfo) {
          const auth0 = await Auth0.init(context.logger);
          return createAccount(
            resolve,
            source,
            args,
            context,
            resolveInfo,
            auth0
          );
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
      }
    }
  };
});

export default WrapPlugin;
