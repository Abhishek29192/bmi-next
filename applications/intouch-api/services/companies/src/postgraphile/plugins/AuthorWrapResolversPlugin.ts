import { makeWrapResolversPlugin } from "graphile-utils";

/** This is an example to prove custom resolver capability with Postgraphile */
const AuthorWrapResolversPlugin = makeWrapResolversPlugin({
  Author: {
    async firstname(resolve, source, args, context, resolveInfo) {
      const result = await resolve(source, args, context, resolveInfo);
      return `Username: ${result.toLowerCase()}`;
    }
  }
});

export default AuthorWrapResolversPlugin;
