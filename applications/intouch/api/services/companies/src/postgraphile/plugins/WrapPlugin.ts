import { makeWrapResolversPlugin } from "graphile-utils";

const WrapPlugin = makeWrapResolversPlugin({
  Mutation: {
    createCompany: {
      requires: {
        childColumns: [{ column: "id", alias: "$company_id" }]
      },
      async resolve(resolve: any, source, args, context: any, resolveInfo) {
        const { pgClient, user } = context;

        await pgClient.query("SAVEPOINT graphql_mutation");

        try {
          const result = await resolve(source, args, context, resolveInfo);

          await pgClient.query(
            "INSERT INTO company_member (account_id, company_id) VALUES($1,$2) RETURNING id",
            [user.id, result.data.$company_id]
          );

          return result;
        } catch (e) {
          await pgClient.query("ROLLBACK TO SAVEPOINT graphql_mutation");
          throw e;
        } finally {
          await pgClient.query("RELEASE SAVEPOINT graphql_mutation");
        }
      }
    }
  }
});

export default WrapPlugin;
