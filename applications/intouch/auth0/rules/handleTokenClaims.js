async function handleTokenClaims(user, context, callback) {
  if (!user.email_verified) {
    return callback(
      new UnauthorizedError("Please verify your email before logging in.")
    );
  }

  const { namespace } = configuration;
  const { app_metadata = {}, user_metadata = {} } = user;

  // The registration is completed
  if (app_metadata.intouch_user_id) {
    context.idToken = {
      ...context.idToken,
      [`${namespace}/firstname`]: user_metadata.firstname,
      [`${namespace}/lastname`]: user_metadata.lastname,
      [`${namespace}/intouch_market_code`]: app_metadata.intouch_market_code,
      [`${namespace}/intouch_user_id`]: app_metadata.intouch_user_id,
      [`${namespace}/intouch_role`]: app_metadata.intouch_role,
      [`${namespace}/intouch_docebo_id`]: app_metadata.intouch_docebo_id
    };

    if (app_metadata.registration_to_complete === true) {
      context.idToken = {
        ...context.idToken,
        [`${namespace}/registration_to_complete`]:
          app_metadata.registration_to_complete
      };
    }

    context.accessToken = {
      ...context.accessToken,
      [`${namespace}/intouch_market_code`]: app_metadata.intouch_market_code,
      [`${namespace}/intouch_user_id`]: app_metadata.intouch_user_id,
      [`${namespace}/intouch_role`]: app_metadata.intouch_role,
      [`${namespace}/email`]: user.email // the access token doesn't have the email by default
    };
  }
  // The user just signup but the registration is not completed
  else {
    context.idToken = {
      ...context.idToken,
      [`${namespace}/intouch_invitation`]: app_metadata.intouch_invitation,
      [`${namespace}/firstname`]: user_metadata.firstname,
      [`${namespace}/lastname`]: user_metadata.lastname,
      [`${namespace}/market`]: user_metadata.market,
      [`${namespace}/type`]: user_metadata.type
    };

    context.accessToken = {
      ...context.accessToken,
      [`${namespace}/intouch_invitation`]: app_metadata.intouch_invitation,
      [`${namespace}/email`]: user.email // the access token doesn't have the email by default
    };
  }

  return callback(null, user, context);
}
