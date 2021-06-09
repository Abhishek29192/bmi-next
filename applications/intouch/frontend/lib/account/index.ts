import axios from "axios";
import { ROLES } from "lib/config";
import { v4 } from "uuid";

export const queryAccount = `query Account($id: Int!) {
  account(id: $id) {
    id
    marketId
    market {
      language
      doceboCompanyAdminBranchId
      doceboInstallersBranchId
    }
  }
}`;
export const mutationCreateAccount = `mutation CreateAccount($input: CreateAccountInput!) {
  createAccount(input: $input) {
    account {
      id
      marketId
      market {
        language
        doceboCompanyAdminBranchId
        doceboInstallersBranchId
      }
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

const mutationCompleteInvitation = `mutation completeInvitation ($companyId: Int!) {
  completeInvitation (companyId: $companyId) {
    id
    marketId
    market {
      language
      doceboCompanyAdminBranchId
      doceboInstallersBranchId
    }
  }
}`;

export const getAccount = async (req, session) => {
  const { AUTH0_NAMESPACE } = process.env;
  const { user } = session;

  const userId = user[`${AUTH0_NAMESPACE}/intouch_user_id`];

  const body = {
    query: queryAccount,
    variables: {
      input: {
        id: userId
      }
    }
  };

  return requestHandler(req, session, body);
};

export const createAccount = async (req, session) => {
  const { AUTH0_NAMESPACE } = process.env;
  const { user } = session;

  const firstName = user[`${AUTH0_NAMESPACE}/firstname`];
  const lastName = user[`${AUTH0_NAMESPACE}/lastname`];
  const registrationType = user[`${AUTH0_NAMESPACE}/registrationType`];
  const marketCode = user[`${AUTH0_NAMESPACE}/market`] || "en";

  const body = {
    query: mutationCreateAccount,
    variables: {
      input: {
        firstName,
        lastName,
        email: user.email,
        role:
          registrationType === "company"
            ? ROLES.COMPANY_ADMIN
            : ROLES.INSTALLER,
        marketCode
      }
    }
  };

  return requestHandler(req, session, body);
};

export const createDoceboUser = async (req, session, account) => {
  const logger = req.logger("account:docebo");

  const REGULAR_USER_LEVEL = 6;
  const POWER_USER_LEVEL = 4;

  const { user } = session;
  const { AUTH0_NAMESPACE } = process.env;
  const { id, market } = account;

  const firstName = user[`${AUTH0_NAMESPACE}/firstname`];
  const lastName = user[`${AUTH0_NAMESPACE}/lastname`];
  const registrationType = user[`${AUTH0_NAMESPACE}/registrationType`];
  const intouch_user_id = id || user[`${AUTH0_NAMESPACE}/intouch_user_id`];

  user[`${AUTH0_NAMESPACE}/intouch_user_id`] = intouch_user_id;

  const branchId =
    registrationType === "company"
      ? market.doceboCompanyAdminBranchId
      : market.doceboInstallersBranchId;

  const language = market.language.toLowerCase() || "en";
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
    await updateAccount(
      req,
      session,
      intouch_user_id,
      createDoceboUser.user_id
    );
  }

  logger.info("Docebo account created", console);
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

export const completeAccountInvitation = async (req, session) => {
  const body = {
    query: mutationCompleteInvitation,
    variables: {
      companyId: parseInt(req.query.company_id)
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
  const logger = req.logger("account:requestHandler");

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
    console.log("data", data);
    return data;
  } catch (error) {
    logger.error("requestHandler", error.message);
    logger.error("requestHandler", error.response.data.errors);
    throw error;
  }
};
