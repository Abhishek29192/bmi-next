import axios from "axios";

type Role = "installer" | "super_admin" | "company_admin";

const roleMap: Record<Role, string> = {
  installer: "rol_pWsuFDl8ZB1qp6tU",
  super_admin: "rol_MACCggpA28bL94N3",
  company_admin: "rol_LJd8lViuxAhPsG8v"
};

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

export const addRole = async (accessToken, userId, role) => {
  const { data } = await axios({
    method: "POST",
    url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}/roles`,
    headers: {
      authorization: `Bearer ${accessToken}`
    },
    data: {
      roles: [roleMap[role]]
    }
  });

  return data;
};
export const removeRole = async (accessToken, userId, role) => {
  const { data } = await axios({
    method: "DELETE",
    url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}/roles`,
    headers: {
      authorization: `Bearer ${accessToken}`
    },
    data: {
      roles: [roleMap[role]]
    }
  });

  return data;
};
