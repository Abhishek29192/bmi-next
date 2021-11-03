async function handleTokenClaims(user, context, callback) {
  const { app_metadata = {}, user_metadata = {} } = user;
  const { namespace, appUrl, logoutUrl } = configuration;

  if (!user.email_verified) {
    context.redirect = {
      url: `${logoutUrl}?client_id=${context.clientID}&returnTo=https://${user_metadata.market}.${appUrl}/email-verification`
    };
    return callback(null, user, context);
  }

  // I need this data to complete the registration
  context.idToken = {
    ...context.idToken,
    [`${namespace}/intouch_role`]: user_metadata.intouch_role,
    [`${namespace}/intouch_market_code`]: user_metadata.market,
    [`${namespace}/first_name`]: user_metadata.first_name,
    [`${namespace}/last_name`]: user_metadata.last_name
  };

  context.accessToken = {
    ...context.accessToken,
    [`${namespace}/email`]: user.email,
    [`${namespace}/intouch_role`]: user_metadata.intouch_role,
    [`${namespace}/intouch_market_code`]: user_metadata.market
  };

  if (app_metadata.terms_to_accept) {
    context.idToken = {
      ...context.idToken,
      [`${namespace}/terms_to_accept`]: app_metadata.terms_to_accept
    };
    context.accessToken = {
      ...context.accessToken,
      [`${namespace}/terms_to_accept`]: app_metadata.terms_to_accept
    };
  }

  return callback(null, user, context);
}
