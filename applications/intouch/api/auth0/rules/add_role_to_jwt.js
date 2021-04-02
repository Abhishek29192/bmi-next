async function AddRoleToUser(user, context, callback) {
  const { namespace } = configuration;

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
