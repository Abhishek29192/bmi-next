import { updateUser, getAccessToken } from "../auth0";

export const updateCompany = async (
  resolve,
  source,
  args,
  context,
  resolveInfo
) => {
  const { pgClient, user } = context;

  await pgClient.query("SAVEPOINT graphql_mutation");

  try {
    const result = await resolve(source, args, context, resolveInfo);

    const { access_token } = await getAccessToken();

    await updateUser(access_token, user.auth0.sub, {
      app_metadata: {
        registration_to_complete: false
      }
    });

    return result;
  } catch (e) {
    await pgClient.query("ROLLBACK TO SAVEPOINT graphql_mutation");
    throw e;
  } finally {
    await pgClient.query("RELEASE SAVEPOINT graphql_mutation");
  }
};
