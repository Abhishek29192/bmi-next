async function InternalUserIdRule(user, context, callback) {
  const axios = require("axios");

  const INSTALLER = "installer";
  const COMPANY_ADMIN = "company_admin";

  const rolesMap = {
    company_admin: "COMPANY_ADMIN",
    installer: "INSTALLER"
  };

  const { stats } = context;
  const {
    gatewayClientId,
    gatewaySecret,
    apiGatewayUrl,
    audience
  } = configuration;

  const count = stats && stats.loginsCount ? stats.loginsCount : 0;
  if (user.app_metadata && count > 1) {
    return callback(null, user, context);
  }

  const { user_metadata, email } = user;
  const { firstname, lastname, type } = user_metadata;
  const user_role = type === "company" ? COMPANY_ADMIN : INSTALLER;

  // to be changed with accountByEmail
  const ACCOUNT_BY_ID = `query {
    allAccounts(condition: { email: "${email}" }) {
      nodes {
        id
      }
    }
  }`;

  const CREATE_ACCOUNT = `mutation {
    createAccount(input: { account: {
        email: "${email}",
        firstname: "${firstname}",
        lastname: "${lastname}",
        role: ${rolesMap[user_role]}
    } } ) { 
      account { id } 
    }
  }`;

  const fetchGateway = async (query) => {
    try {
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

      const { data } = await axios({
        method: "post",
        url: apiGatewayUrl,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${dataToken.access_token}`
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

  let dbUserId;
  const { data } = await fetchGateway(ACCOUNT_BY_ID);
  if (
    data &&
    data.allAccounts &&
    data.allAccounts.nodes &&
    data.allAccounts.nodes.length
  ) {
    dbUserId = data.allAccounts.nodes[0].id;
  } else {
    const { data } = await fetchGateway(CREATE_ACCOUNT);
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

  return callback(null, user, context);
}
