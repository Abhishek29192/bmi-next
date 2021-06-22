import { Logger } from "winston";
import { ApolloClient, NormalizedCacheObject, gql } from "@apollo/client";
import { ROLES } from "../../lib/config";

const { AUTH0_NAMESPACE } = process.env;

export const queryAccountByEmail = gql`
  query accountByEmail($email: String!) {
    accountByEmail(email: $email) {
      id
      marketId
      doceboUserId
      market {
        language
        doceboCompanyAdminBranchId
        doceboInstallersBranchId
      }
      companyMembers {
        nodes {
          company {
            id
            status
          }
        }
      }
    }
  }
`;
export const mutationCreateAccount = gql`
  mutation CreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      account {
        id
        marketId
        market {
          language
          doceboCompanyAdminBranchId
          doceboInstallersBranchId
        }
        companyMembers {
          nodes {
            company {
              id
              status
            }
          }
        }
      }
    }
  }
`;
export const mutationCreateDoceboUser = gql`
  mutation createDoceboUser($input: UserCreateInput!) {
    createDoceboUser(input: $input) {
      success
      user_id
    }
  }
`;
export const mutationUpdateAccount = gql`
  mutation UpdateAccount($input: UpdateAccountInput!) {
    updateAccount(input: $input) {
      account {
        id
        doceboUserId
      }
    }
  }
`;

export const userByEmailDocument = gql`
  query userByEmail($email: String!) {
    userByEmail(email: $email) {
      user_id
    }
  }
`;

export const queryInvitation = gql`
  query invitations($invitee: String!) {
    invitations(condition: { invitee: $invitee, status: NEW }) {
      nodes {
        id
        status
        invitee
        senderAccountId
      }
    }
  }
`;

export const mutationCompleteInvitation = gql`
  mutation completeInvitation($companyId: Int!) {
    completeInvitation(companyId: $companyId) {
      id
      marketId
      market {
        language
        doceboCompanyAdminBranchId
        doceboInstallersBranchId
      }
    }
  }
`;

const mutationDoceboCreateSSOUrl = gql`
  mutation createSSOUrl($username: String!, $path: String) {
    createSSOUrl(username: $username, path: $path) {
      url
    }
  }
`;

// This user is coming from the idToken
export const parseAccount = (user) => ({
  name: user[`name`],
  intouchUserId: user[`${AUTH0_NAMESPACE}/intouch_user_id`],
  registrationType: user[`${AUTH0_NAMESPACE}/registration_type`],
  marketCode: user[`${AUTH0_NAMESPACE}/intouch_market_code`],
  firstName: user[`${AUTH0_NAMESPACE}/first_name`],
  lastName: user[`${AUTH0_NAMESPACE}/last_name`],
  email: user.email,
  scope: user.exp,
  exp: user.exp,
  iss: user.iss,
  iat: user.iat,
  sub: user.sub,
  aud: user.aud
});

const randomPassword = (length: number = 8) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  return [...new Array(length)]
    .map(() => charset.charAt(Math.floor(Math.random() * charset.length)))
    .join("");
};

export default class Account {
  session: any;
  logger: Logger;
  apolloClient: ApolloClient<NormalizedCacheObject>;

  constructor(logger, apolloClient, session) {
    this.logger = logger("account");
    this.apolloClient = apolloClient;
    this.session = session;
  }

  createDoceboSSOUrl = async (req, session): Promise<string> => {
    const { user } = session;
    const { name } = parseAccount(user);

    const path = req.query.path || "/learn/mycourses";
    const { data: { createSSOUrl: { url = null } = {} } = {} } =
      await this.apolloClient.mutate({
        mutation: mutationDoceboCreateSSOUrl,
        variables: {
          username: name,
          path
        }
      });

    this.logger.info(`Docebo SSO url created`);

    return url;
  };

  getAccount = async (session) => {
    const {
      user: { email }
    } = session;

    this.logger.info(`Getting account`);

    const {
      data: { accountByEmail }
    } = await this.apolloClient.query({
      query: queryAccountByEmail,
      variables: {
        email
      }
    });

    this.logger.info(`Get account with id: ${accountByEmail?.id}`);

    return accountByEmail;
  };

  createAccount = async (session) => {
    const { user } = session;

    this.logger.info(`Creating account`);

    const { firstName, lastName, registrationType, marketCode, email } =
      parseAccount(user);

    const role =
      registrationType === "company" ? ROLES.COMPANY_ADMIN : ROLES.INSTALLER;

    const { data } = await this.apolloClient.mutate({
      mutation: mutationCreateAccount,
      variables: {
        input: {
          account: {
            role,
            email,
            lastName,
            firstName
          },
          marketCode
        }
      }
    });

    const {
      createAccount: { account }
    } = data;

    this.logger.info(`Account with id: ${account.id} created`);

    return account;
  };

  completeAccountInvitation = async (req, session) => {
    this.logger.info(`Completing account invitation`);

    const { data } = await this.apolloClient.mutate({
      mutation: mutationCompleteInvitation,
      variables: {
        companyId: parseInt(req.query.company_id)
      }
    });

    this.logger.info(
      `Invitation for user: ${data.completeInvitation.id} completed`
    );

    return data;
  };

  updateAccount = async (session, accountId, patch) => {
    this.logger.info(`Updating account`);

    const body = {
      mutation: mutationUpdateAccount,
      variables: {
        input: {
          id: accountId,
          patch
        }
      }
    };

    this.logger.info(`Updating account with id: ${accountId}`);
    const { data } = await this.apolloClient.mutate(body);
    const {
      updateAccount: { account }
    } = data;

    this.logger.info(`Account with id: ${account.id} updated`);

    return data;
  };

  getInvitation = async (session) => {
    const {
      user: { email }
    } = session;

    this.logger.info(`Getting invitation`);

    const { data } = await this.apolloClient.query({
      query: queryInvitation,
      variables: {
        invitee: email
      }
    });

    this.logger.info(`Get invitation with id: ${data.id}`);

    return data?.invitations?.nodes?.[0];
  };

  createDoceboUser = async (session, account) => {
    const POWER_USER_LEVEL = 4;
    const REGULAR_USER_LEVEL = 6;

    const { user } = session;
    const { market } = account;
    const { firstName, lastName, registrationType } = parseAccount(user);

    this.logger.info(`Get user by email`);

    // Check if the user already exists
    const { data } = await this.apolloClient.query({
      query: userByEmailDocument,
      variables: {
        email: user.email
      }
    });

    let doceboUserId = data.userByEmail?.user_id
      ? parseInt(data.userByEmail?.user_id)
      : null;

    if (!data.userByEmail?.user_id) {
      const branchId =
        registrationType === "company"
          ? market.doceboCompanyAdminBranchId
          : market.doceboInstallersBranchId;

      const language = market.language.toLowerCase() || "en";
      const level =
        registrationType === "company" ? POWER_USER_LEVEL : REGULAR_USER_LEVEL;

      const body = {
        mutation: mutationCreateDoceboUser,
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

      this.logger.info(`Creating docebo account for user ${account.id}`);

      const { data } = await this.apolloClient.mutate(body);
      const { createDoceboUser } = data;

      if (!createDoceboUser) {
        throw new Error("Error creating docebo user");
      }

      doceboUserId = createDoceboUser?.user_id;

      this.logger.info(`Docebo account with id ${doceboUserId} created`);
    }

    await this.updateAccount(session, account.id, {
      doceboUserId: doceboUserId,
      doceboUsername: user.email
    });

    this.logger.info(
      `Account with id ${account.id} udpated with docebo id: ${doceboUserId}`
    );
  };
}
