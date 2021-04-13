import { makeWrapResolversPlugin } from "graphile-utils";
import { createCompany } from "../../services/company";

const WrapPlugin = makeWrapResolversPlugin({
  Mutation: {
    createCompany: {
      requires: {
        childColumns: [{ column: "id", alias: "$company_id" }]
      },
      async resolve(resolve: any, source, args, context: any, resolveInfo) {
        return createCompany(resolve, source, args, context, resolveInfo);
      }
    }
  }
});

export default WrapPlugin;
