import Auth0 from "../auth0";

export const updateCompany = async (
  resolve,
  source,
  args,
  context,
  resolveInfo
) => {
  let result;
  const { pgClient, user } = context;
  const auth0 = await Auth0.init(context.logger);
  const logger = context.logger("service:company");

  await pgClient.query("SAVEPOINT graphql_mutation");

  try {
    result = await resolve(source, args, context, resolveInfo);

    await auth0.updateUser(user.sub, {
      app_metadata: {
        registration_to_complete: false
      }
    });

    logger.info(
      `Company ${result.data.$company_id} created by user ${user.id}`
    );

    return result;
  } catch (e) {
    await pgClient.query("ROLLBACK TO SAVEPOINT graphql_mutation");
    throw e;
  } finally {
    await pgClient.query("RELEASE SAVEPOINT graphql_mutation");
  }
};
