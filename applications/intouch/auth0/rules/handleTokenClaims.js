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
      [`${namespace}/first_name`]: user_metadata.first_name,
      [`${namespace}/last_name`]: user_metadata.last_name,
      [`${namespace}/intouch_market_code`]: app_metadata.intouch_market_code,
      [`${namespace}/intouch_docebo_id`]: app_metadata.intouch_docebo_id,
      [`${namespace}/intouch_user_id`]: app_metadata.intouch_user_id,
      [`${namespace}/intouch_role`]: app_metadata.intouch_role
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
      [`${namespace}/first_name`]: user_metadata.first_name,
      [`${namespace}/last_name`]: user_metadata.last_name,
      [`${namespace}/intouch_market_code`]: app_metadata.intouch_market_code,
      [`${namespace}/intouch_docebo_id`]: app_metadata.intouch_docebo_id,
      [`${namespace}/intouch_user_id`]: app_metadata.intouch_user_id,
      [`${namespace}/intouch_role`]: app_metadata.intouch_role,
      [`${namespace}/email`]: user.email // the access token doesn't have the email by default
    };
  }
  // The user just signup but the registration is not completed
  else {
    context.idToken = {
      ...context.idToken,
      [`${namespace}/first_name`]: user_metadata.first_name,
      [`${namespace}/last_name`]: user_metadata.last_name,
      [`${namespace}/intouch_invited`]: app_metadata.intouch_invited,
      [`${namespace}/intouch_market_code`]: user_metadata.market,
      [`${namespace}/registration_type`]: user_metadata.registration_type,
      [`${namespace}/type`]: user_metadata.registration_type // TODO REMOVE THIS
    };

    context.accessToken = {
      ...context.accessToken,
      [`${namespace}/first_name`]: user_metadata.first_name,
      [`${namespace}/last_name`]: user_metadata.last_name,
      [`${namespace}/intouch_invited`]: app_metadata.intouch_invited,
      [`${namespace}/intouch_market_code`]: user_metadata.market,
      [`${namespace}/registration_type`]: user_metadata.registration_type,
      [`${namespace}/type`]: user_metadata.registration_type, // TODO REMOVE THIS
      [`${namespace}/email`]: user.email
    };
  }

  return callback(null, user, context);
}
