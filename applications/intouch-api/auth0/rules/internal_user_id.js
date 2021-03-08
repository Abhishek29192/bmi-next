// eslint-disable-next-line strict, no-unused-vars
async function InternalUserIdRule(user, context, callback) {
  const axios = require("axios");

  const { stats } = context;
  // eslint-disable-next-line no-undef
  const { namespace, gatewayApiKey, apiGatewayUrl } = configuration;

  const count = stats && stats.loginsCount ? stats.loginsCount : 0;
  if (user.app_metadata && count > 1) {
    context.idToken = {
      ...context.idToken,
      [`${namespace}/internal_user_id`]: user.app_metadata.internal_user_id
    };
    context.accessToken = {
      ...context.accessToken,
      [`${namespace}/internal_user_id`]: user.app_metadata.internal_user_id
    };

    return callback(null, user, context);
  }

  // to be changed with accountByEmail
  const ACCUONT_BY_ID = `query {
    allAccounts(condition: { email: "${user.email}" }) {
      nodes {
        id
      }
    }
  }`;

  const CREATE_ACCOUNT = `mutation {
    createAccount(input: { account: {
        email: "${user.email}"
    } } ) { 
      account { id } 
    }
  }`;

  const fetchGateway = (query) =>
    axios({
      method: "post",
      url: apiGatewayUrl, // eslint-disable-line no-undef
      headers: {
        "Content-Type": "application/json",
        "x-api-key": gatewayApiKey
      },
      data: JSON.stringify({
        query: query,
        variables: {}
      })
    });

  let dbUserId;
  const {
    data: { data }
  } = await fetchGateway(ACCUONT_BY_ID);
  if (
    !data ||
    !data.allAccounts ||
    !data.allAccounts.nodes ||
    data.allAccounts.nodes.length === 0
  ) {
    const {
      data: { data }
    } = await fetchGateway(CREATE_ACCOUNT);
    dbUserId = data.createAccount.account.id;
  } else {
    dbUserId = data.allAccounts.nodes[0].id;
  }

  user.app_metadata = user.app_metadata || {};
  user.app_metadata.internal_user_id = dbUserId;

  // eslint-disable-next-line no-undef
  await auth0.users.updateAppMetadata(user.user_id, user.app_metadata);

  context.idToken = {
    ...context.idToken,
    [`${namespace}/internal_user_id`]: dbUserId
  };
  context.accessToken = {
    ...context.accessToken,
    [`${namespace}/internal_user_id`]: dbUserId
  };

  return callback(null, user, context);
}
