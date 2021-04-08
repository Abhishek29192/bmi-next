async function AddRoleToUser(user, context, callback) {
  const { namespace } = configuration;

  context.idToken = {
    ...context.idToken,
    [`${namespace}/internal_user_id`]: user.app_metadata.internal_user_id
  };
  context.accessToken = {
    ...context.accessToken,
    [`${namespace}/internal_user_id`]: user.app_metadata.internal_user_id
  };

  callback(null, user, context);
}
