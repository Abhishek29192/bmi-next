import { makeWrapResolversPlugin } from "graphile-utils";
import { updateCompany } from "../../services/company";
import { createAccount } from "../../services/account";

const WrapPlugin = makeWrapResolversPlugin({
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
        return createAccount(resolve, source, args, context, resolveInfo);
      }
    },
    updateCompany: {
      async resolve(resolve: any, source, args, context: any, resolveInfo) {
        return updateCompany(resolve, source, args, context, resolveInfo);
      }
    }
  }
});

export default WrapPlugin;
