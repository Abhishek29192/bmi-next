async function DoceboTokenRule(user, context, callback) {
  const axios = require("axios");
  const {
    namespace,
    gatewayClientId,
    gatewaySecret,
    apiGatewayUrl,
    audience
  } = configuration;

  const DOCEBO_TOKEN = `query {
      tokenByJwtPayload(username: "<username>") {
        access_token
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

      console.log("dataToken", dataToken);

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

      console.log("data", data);

      return data;
    } catch (error) {
      callback(error);
    }
  };

  const {
    data: { tokenByJwtPayload }
  } = await fetchGateway(DOCEBO_TOKEN);

  context.idToken = {
    ...context.idToken,
    [`${namespace}/docebo_token`]: tokenByJwtPayload.access_token
  };
  context.accessToken = {
    ...context.accessToken,
    [`${namespace}/docebo_token`]: tokenByJwtPayload.access_token
  };

  return callback(null, user, context);
}
