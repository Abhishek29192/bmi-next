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
export const createAccount = async (req, session) => {
  const { AUTH0_NAMESPACE } = process.env;
  const { user } = session;

  const firstName = user[`${AUTH0_NAMESPACE}/firstname`];
  const lastName = user[`${AUTH0_NAMESPACE}/lastname`];
  const type = user[`${AUTH0_NAMESPACE}/type`];
  const market = user[`${AUTH0_NAMESPACE}/market`];

  const body = {
    query: mutationCreateAccount,
    variables: {
      input: {
        firstName,
        lastName,
        email: user.email,
        role: type === "company" ? "COMPANY_ADMIN" : "INSTALLER",
        marketCode: market
      }
    }
  };

  return requestHandler(req, session, body);
};

export const createDoceboUser = async (req, session) => {
  const { AUTH0_NAMESPACE } = process.env;
  const { user } = session;

  const firstName = user[`${AUTH0_NAMESPACE}/firstname`];
  const lastName = user[`${AUTH0_NAMESPACE}/lastname`];
  const type = user[`${AUTH0_NAMESPACE}/type`];
  const market = user[`${AUTH0_NAMESPACE}/market`];

  const body = {
    query: mutationCreateDoceboUser,
    variables: {
      input: {
        userid: user.email,
        email: user.email,
        password: randomPassword(),
        firstname: firstName,
        lastname: lastName,
        language: market,
        level: 6,
        //   #4:poweruser, 6:user
        //level: type === "company" ? 4 : 6,
        //Should we send email validation?
        email_validation_status: 1,
        send_notification_email: false,
        //TODO: We have to get branchid from market
        select_orgchart: {
          branch_id: "41"
        }
      }
    }
  };

  return requestHandler(req, session, body);
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
