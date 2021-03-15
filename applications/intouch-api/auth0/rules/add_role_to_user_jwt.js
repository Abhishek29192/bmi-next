async function AddRoleToUser(user, context, callback) {
  const { namespace } = configuration;
  const { stats } = context;

  const DEFAULT_ROLE = "installer";

  const count = stats && stats.loginsCount ? stats.loginsCount : 0;

  // If already logged once I don't need to add any role
  if (count <= 1) {
    user.app_metadata.role = DEFAULT_ROLE;

    try {
      await auth0.users.updateAppMetadata(user.user_id, user.app_metadata);
    } catch (error) {
      callback(error);
    }
  }

  context.idToken = {
    ...context.idToken,
    [`${namespace}/role`]: user.app_metadata.role
  };
  context.accessToken = {
    ...context.accessToken,
    [`${namespace}/role`]: user.app_metadata.role
  };

  callback(null, user, context);
}
