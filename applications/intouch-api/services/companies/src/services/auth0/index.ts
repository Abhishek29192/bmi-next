import axios from "axios";

export const getUserByEmail = async (accessToken, emailAddress) => {
  const { data } = await axios({
    method: "GET",
    url: `https://${
      process.env.AUTH0_DOMAIN
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
    url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users`,
    headers: {
      authorization: `Bearer ${accessToken}`
    },
    data: body
  });

  return data;
};
