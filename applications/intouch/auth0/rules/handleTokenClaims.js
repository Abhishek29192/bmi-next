async function handleTokenClaims(user, context, callback) {
  if (!user.email_verified) {
    return callback(new UnauthorizedError("email_not_verified"));
  }

  const { namespace } = configuration;
  const { app_metadata = {}, user_metadata = {} } = user;

  if (app_metadata.intouch_user_id) {
    context.accessToken = {
      ...context.accessToken,
      [`${namespace}/email`]: user.email
    };
  } else {
    // I need this data to complete the registration
    context.idToken = {
      ...context.idToken,
      [`${namespace}/intouch_role`]: user_metadata.intouch_role,
      [`${namespace}/intouch_invited`]: app_metadata.intouch_invited,
      [`${namespace}/intouch_market_code`]: user_metadata.market,
      [`${namespace}/first_name`]: user_metadata.first_name,
      [`${namespace}/last_name`]: user_metadata.last_name
    };

    context.accessToken = {
      ...context.accessToken,
      [`${namespace}/email`]: user.email
    };
  }

  return callback(null, user, context);
}
