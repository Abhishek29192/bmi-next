import axios from "axios";
import { v4 } from "uuid";
import { ROLES } from "../../lib/config";

const { AUTH0_NAMESPACE } = process.env;

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

const mutationDoceboCreateSSOUrl = `mutation createSSOUrl ($username: String!,$path: String) {
  createSSOUrl(username:$username,path:$path){
    url
  }
}`;

export const parseAccount = (user) => ({
  intouchUserId: user[`${AUTH0_NAMESPACE}/intouch_user_id`],
  email: user[`${AUTH0_NAMESPACE}/email`],
  name: user[`name`],
  role: user[`${AUTH0_NAMESPACE}/intouch_role`],
  lastName: user[`${AUTH0_NAMESPACE}/last_name`],
  firstName: user[`${AUTH0_NAMESPACE}/first_name`],
  invited: user[`${AUTH0_NAMESPACE}/intouch_invited`],
  doceboId: user[`${AUTH0_NAMESPACE}/intouch_docebo_id`],
  registrationType: user[`${AUTH0_NAMESPACE}/registration_type`],
  marketCode: user[`${AUTH0_NAMESPACE}/intouch_market_code`],
  registrationToComplete: user[`${AUTH0_NAMESPACE}/registration_to_complete`],
  iss: user.iss,
  iat: user.iat,
  exp: user.exp,
  scope: user.exp,
  sub: user.sub,
  aud: user.aud
});

export const getAccount = async (req, session) => {
  const { user } = session;
  const logger = req.logger("account:get");
  const { intouchUserId } = parseAccount(user);

  const body = {
    query: queryAccount,
    variables: {
      input: {
        id: intouchUserId
      }
    }
  };

  const { data } = await requestHandler(req, session, body);

  logger.info(`Get account with id: ${data.id}`);

  return data;
};

export const createAccount = async (req, session) => {
  const { user } = session;
  const logger = req.logger("account:create");

  const { firstName, lastName, registrationType, marketCode, email } =
    parseAccount(user);

  const body = {
    query: mutationCreateAccount,
    variables: {
      input: {
        account: {
          firstName,
          lastName,
          email,
          role:
            registrationType === "company"
              ? ROLES.COMPANY_ADMIN
              : ROLES.INSTALLER
        },
        marketCode
      }
    }
  };

  const { data } = await requestHandler(req, session, body);
  const {
    createAccount: { account }
  } = data;

  logger.info(`Account with id: ${account.id} created`);

  return data;
};

export const createDoceboUser = async (req, session, account) => {
  const logger = req.logger("account:docebo");

  const REGULAR_USER_LEVEL = 6;
  const POWER_USER_LEVEL = 4;

  const { user } = session;
  const { id, market } = account;

  const { firstName, lastName, registrationType, intouchUserId } =
    parseAccount(user);

  const intouch_user_id = id || intouchUserId;

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

  logger.info(`Docebo account with id ${createDoceboUser.user_id} created`);
};
export const createDoceboSSOUrl = async (req, session): Promise<string> => {
  const logger = req.logger("account:docebo-sso");

  const { user } = session;
  const { name } = parseAccount(user);

  const path = req.query.path || "/learn/mycourses";
  const body = {
    query: mutationDoceboCreateSSOUrl,
    variables: {
      username: name,
      path
    }
  };

  const { data: { createSSOUrl: { url = null } = {} } = {} } =
    (await requestHandler(req, session, body)) || {};

  logger.info(`Docebo SSO url created`);

  return url;
};

export const updateAccount = async (req, session, accountId, doceboUserId) => {
  const logger = req.logger("account:update");

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

  const { data } = await requestHandler(req, session, body);
  const {
    updateAccount: { account }
  } = data;

  logger.info(`Account with id: ${account.id} updated`);

  return data;
};

export const completeAccountInvitation = async (req, session) => {
  const logger = req.logger("account:invitation");
  const body = {
    query: mutationCompleteInvitation,
    variables: {
      companyId: parseInt(req.query.company_id)
    }
  };

  const { data } = await requestHandler(req, session, body);

  logger.info(`Invitation for user: ${data.completeInvitation.id} completed`);

  return data;
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

    return data;
  } catch (error) {
    logger.error("requestHandler", error.message);
    logger.error("requestHandler", error.response.data.errors);
    throw error;
  }
};
