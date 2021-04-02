async function InternalUserIdRule(user, context, callback) {
  if (!user.email_verified) {
    return callback(
      new UnauthorizedError("Please verify your email before logging in.")
    );
  }

  const axios = require("axios");

  const rolesMap = {
    company_admin: "COMPANY_ADMIN",
    installer: "INSTALLER"
  };

  const { stats } = context;
  const {
    namespace,
    gatewayClientId,
    gatewaySecret,
    apiGatewayUrl,
    audience
  } = configuration;

  const { user_metadata, email } = user;
  const { firstname, lastname, type } = user_metadata;
  const user_role =
    type === "company" ? rolesMap.company_admin : rolesMap.installer;

  // to be changed with accountByEmail
  const ACCOUNT_BY_ID = `query {
      allAccounts(condition: { email: "${email}" }) {
        nodes {
          id
        }
      }
  }`;

  const CREATE_ACCOUNT = `mutation {
      createAccount(input: { 
        account: {
          email: "${email}",
          firstName: "${firstname}",
          lastName: "${lastname}",
          role: ${user_role}
      } } ) { 
        account { id } 
      }
  }`;

  const DOCEBO_TOKEN = `query {
    tokenByJwtPayload(username: "chris.phippen+101@bmigroup.com") {
      access_token
    }
  }`;

  // Get an M2M token to comunicate with out API
  const { data: dataToken } = await axios({
    method: "POST",
    url: `https://${auth0.domain}/oauth/token`,
    headers: { "content-type": "application/json" },
    data: JSON.stringify({
      client_id: gatewayClientId,
      client_secret: gatewaySecret,
      audience: audience,
      grant_type: "client_credentials"
    })
  });

  // Helper function to send graphql requests
  const fetchGateway = async (query, token) => {
    try {
      const { data } = await axios({
        method: "post",
        url: apiGatewayUrl,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        data: JSON.stringify({
          query: query,
          variables: {}
        })
      });

      return data;
    } catch (error) {
      return callback(error);
    }
  };

  const addClaimsToToken = async () => {
    // Fetch the docebo token
    const {
      data: { tokenByJwtPayload }
    } = await fetchGateway(DOCEBO_TOKEN, dataToken.access_token);

    context.idToken = {
      ...context.idToken,
      [`${namespace}/internal_user_id`]: user.app_metadata.internal_user_id,
      [`${namespace}/role`]: user.app_metadata.role
    };
    context.accessToken = {
      ...context.accessToken,
      [`${namespace}/internal_user_id`]: user.app_metadata.internal_user_id,
      [`${namespace}/docebo_token`]: tokenByJwtPayload.access_token,
      [`${namespace}/role`]: user.app_metadata.role
    };
  };

  // If the user has already logged in skip all the requests to our api
  const count = stats && stats.loginsCount ? stats.loginsCount : 0;
  if (user.app_metadata && count > 1) {
    await addClaimsToToken();

    return callback(null, user, context);
  }

  let dbUserId;
  const { data } = await fetchGateway(ACCOUNT_BY_ID, dataToken.access_token);
  if (
    data &&
    data.allAccounts &&
    data.allAccounts.nodes &&
    data.allAccounts.nodes.length
  ) {
    dbUserId = data.allAccounts.nodes[0].id;
  } else {
    const { data } = await fetchGateway(CREATE_ACCOUNT, dataToken.access_token);
    dbUserId = data.createAccount.account.id;
  }

  user.app_metadata = user.app_metadata || {};
  user.app_metadata.internal_user_id = dbUserId;
  user.app_metadata.role = user_role;

  try {
    await auth0.users.updateAppMetadata(user.user_id, user.app_metadata);
  } catch (error) {
    return callback(error);
  }

  await addClaimsToToken();

  return callback(null, user, context);
}
