import { Role } from "@bmi/intouch-api-types";
import axios from "axios";
import { v4 } from "uuid";

export const mutationCreateAccount = `mutation CreateAccount($input: CreateAccountInput!) {
  createAccount(input: $input) {
    account {
      id
      marketId
    }
  }
}`;
export const mutationCreateDoceboUser = `mutation createDoceboUser($input: UserCreateInput!) {
  createDoceboUser(input: $input) {
    success
    user_id
  }
}`;
export const mutationUpdateAccount = `mutation UpdateAccount($input: UpdateAccountInput!) {
  updateAccount(input: $input) {
    account {
      id
      doceboUserId

    }
  }
}`;
const querymarketByDomain = `query marketByDomain($domain:String!) {
  marketByDomain(domain: $domain) {
    id
    language
    doceboCompanyAdminBranchId
    doceboInstallersBranchId
    domain
  }
} `;

export const createAccount = async (req, session) => {
  const { AUTH0_NAMESPACE } = process.env;
  const { user } = session;

  const firstName = user[`${AUTH0_NAMESPACE}/firstname`];
  const lastName = user[`${AUTH0_NAMESPACE}/lastname`];
  const registrationType = user[`${AUTH0_NAMESPACE}/type`];
  const marketCode = user[`${AUTH0_NAMESPACE}/market`] || "en";

  const body = {
    query: mutationCreateAccount,
    variables: {
      input: {
        firstName,
        lastName,
        email: user.email,
        role:
          registrationType === "company" ? Role.CompanyAdmin : Role.Installer,
        marketCode
      }
    }
  };

  return requestHandler(req, session, body);
};

export const createDoceboUser = async (req, session, userId?: null) => {
  const REGULAR_USER_LEVEL = 6;
  const POWER_USER_LEVEL = 4;

  const { AUTH0_NAMESPACE } = process.env;
  const { user } = session;

  const firstName = user[`${AUTH0_NAMESPACE}/firstname`];
  const lastName = user[`${AUTH0_NAMESPACE}/lastname`];
  const registrationType = user[`${AUTH0_NAMESPACE}/type`];
  const intouch_user_id = userId || user[`${AUTH0_NAMESPACE}/intouch_user_id`];

  user[`${AUTH0_NAMESPACE}/intouch_user_id`] = intouch_user_id;

  const { data: { marketByDomain = null } = {} } =
    (await getMarketByDomain(req, session)) || {};

  if (marketByDomain) {
    const branchId =
      registrationType === "company"
        ? marketByDomain?.doceboCompanyAdminBranchId
        : marketByDomain?.doceboInstallersBranchId;

    const language = marketByDomain?.language.toLowerCase() || "en";
    const level =
      registrationType === "company" ? POWER_USER_LEVEL : REGULAR_USER_LEVEL;

    const body = {
      query: mutationCreateDoceboUser,
      variables: {
        input: {
          userid: user.email,
          email: user.email,
          password: randomPassword(),
          firstname: firstName,
          lastname: lastName,
          language,
          level,
          email_validation_status: 1,
          send_notification_email: false,
          select_orgchart: {
            branch_id: branchId
          }
        }
      }
    };

    const { data: { createDoceboUser = null } = {} } =
      (await requestHandler(req, session, body)) || {};

    if (intouch_user_id && createDoceboUser?.user_id) {
      updateAccount(req, session, intouch_user_id, createDoceboUser.user_id);
    }
  }
};

export const updateAccount = async (req, session, accountId, doceboUserId) => {
  const { user } = session;
  const body = {
    query: mutationUpdateAccount,
    variables: {
      input: {
        id: accountId,
        patch: {
          doceboUserId: doceboUserId,
          doceboUsername: user.email
        }
      }
    }
  };

  return requestHandler(req, session, body);
};

export const getMarketByDomain = async (req, session) => {
  const { AUTH0_NAMESPACE } = process.env;
  const { user } = session;
  const marketCode = user[`${AUTH0_NAMESPACE}/intouch_market_code`] || "en";
  const body = {
    query: querymarketByDomain,
    variables: {
      domain: marketCode
    }
  };

  return requestHandler(req, session, body);
};

const randomPassword = (length: number = 8) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  return [...new Array(length)]
    .map(() => charset.charAt(Math.floor(Math.random() * charset.length)))
    .join("");
};
const requestHandler = async (req, session, body) => {
  const logger = req.logger("account");
  try {
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const { data } = await axios.post(
      `${protocol}://${req.headers.host}/api/graphql`,
      body,
      {
        headers: {
          authorization: `Bearer ${session.accessToken}`,
          "x-request-id": v4()
        }
      }
    );
    return data;
  } catch (error) {
    logger.error(error.message);
  }
};
