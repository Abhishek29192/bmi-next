import axios from "axios";

export const getAccessToken = async () => {
  const { data } = await axios({
    method: "POST",
    url: `https://${process.env.AUTH0_API_DOMAIN}/oauth/token`,
    headers: { "content-type": "application/json" },
    data: {
      grant_type: "client_credentials",
      client_id: process.env.AUTH0_API_CLIENT_ID,
      client_secret: process.env.AUTH0_API_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_API_DOMAIN}/api/v2/`
    }
  });

  return data;
};

export const getUserByEmail = async (accessToken, emailAddress) => {
  const { data } = await axios({
    method: "GET",
    url: `https://${
      process.env.AUTH0_API_DOMAIN
    }/api/v2/users-by-email?fields=user_id&email=${encodeURIComponent(
      emailAddress
    )}`,
    headers: {
      authorization: `Bearer ${accessToken}`
    }
  });

  return data;
};

export const createUser = async (accessToken, body) => {
  const { data } = await axios({
    method: "POST",
    url: `https://${process.env.AUTH0_API_DOMAIN}/api/v2/users`,
    headers: {
      authorization: `Bearer ${accessToken}`
    },
    data: body
  });

  return data;
};

export const updateUser = async (accessToken, id, body) => {
  const { data } = await axios({
    method: "PATCH",
    url: `https://${process.env.AUTH0_API_DOMAIN}/api/v2/users/${id}`,
    headers: {
      authorization: `Bearer ${accessToken}`
    },
    data: body
  });

  return data;
};
