async function CompanyRegistration(user, context, callback) {
  const rolesMap = {
    company_admin: "COMPANY_ADMIN",
    installer: "INSTALLER"
  };

  user.app_metadata = user.app_metadata || {};

  // If not company admin let's go ahead
  if (user.app_metadata.role !== rolesMap.company_admin) {
    return callback(null, user, context);
  }
  // If the registration is completed go ahead
  if (user.app_metadata.reg_completed === "true") {
    return callback(null, user, context);
  }

  const axios = require("axios");
  const { namespace } = configuration;
  const {
    gatewayClientId,
    gatewaySecret,
    apiGatewayUrl,
    audience
  } = configuration;

  const COMPANY_USER = `
    query Query {
      allCompanyMembers(condition: {
        accountId: ${user.app_metadata.internal_user_id} 
      }) {
        totalCount
      }
    }
  `;

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

  const { data } = await fetchGateway(COMPANY_USER);
  const {
    allCompanyMembers: { totalCount }
  } = data;

  // If the user has alread a company set a flag in app_meta and go ahead
  if (totalCount > 0) {
    user.app_metadata.reg_completed = true;
    await auth0.users.updateAppMetadata(user.user_id, user.app_metadata);

    return callback(null, user, context);
  }

  // If the user does not have a company add a flag to the jwt token
  context.idToken = {
    ...context.idToken,
    [`${namespace}/reg_to_complete`]: true
  };
  context.accessToken = {
    ...context.accessToken,
    [`${namespace}/reg_to_complete`]: true
  };

  callback(null, user, context);
}
