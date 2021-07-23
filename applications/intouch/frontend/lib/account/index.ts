import { Logger } from "winston";
import { Account } from "@bmi/intouch-api-types";
import { ApolloClient, NormalizedCacheObject, gql } from "@apollo/client";
import { randomPassword } from "../utils/account";

const { AUTH0_NAMESPACE } = process.env;

export const queryAccountByEmail = gql`
  query accountByEmail($email: String!) {
    accountByEmail(email: $email) {
      id
      role
      marketId
      firstName
      lastName
      email
      doceboUserId
      market {
        domain
        language
        doceboCompanyAdminBranchId
        doceboInstallersBranchId
        projectsEnabled
      }
      companyMembers {
        nodes {
          company {
            id
            status
            name
            tier
          }
        }
      }
      # At the moment only interested in whether account is assigned to any projects at all
      projectMembers {
        totalCount
      }
    }
  }
`;
export const mutationCreateAccount = gql`
  mutation CreateAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      account {
        id
        role
        email
        firstName
        lastName
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
      role
      email
      firstName
      lastName
      marketId
      market {
        language
        domain
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

// TODO: Company can be partial... use generic or fallback to full company, or for Account in fact
export const findAccountCompany = (account: Account) => {
  return account?.companyMembers?.nodes?.[0]?.company;
};

// Account inherits tier from company.
// if not assigned to a company, fallback to T1.
export const findAccountTier = (account: Account) => {
  const company = findAccountCompany(account);

  if (company) {
    return company.tier;
  }

  return "T1";
};

export const hasProjects = (account: Account): boolean => {
  return !!account?.projectMembers?.totalCount;
};

// This user is coming from the idToken
export const parseAccount = (user) => ({
  intouch_role: user[`${AUTH0_NAMESPACE}/intouch_role`],
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

export default class AccountService {
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
    const { email } = parseAccount(user);

    const path = req.query.path || "/learn/mycourses";
    const { data: { createSSOUrl: { url = null } = {} } = {} } =
      await this.apolloClient.mutate({
        mutation: mutationDoceboCreateSSOUrl,
        variables: {
          username: email,
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

    const { firstName, lastName, intouch_role, marketCode, email } =
      parseAccount(user);

    const { data } = await this.apolloClient.mutate({
      mutation: mutationCreateAccount,
      variables: {
        input: {
          account: {
            role: intouch_role,
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

  completeAccountInvitation = async (req) => {
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

  updateAccount = async (accountId, patch) => {
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

  createDoceboUser = async (account) => {
    const POWER_USER_LEVEL = 4;
    const REGULAR_USER_LEVEL = 6;

    const { firstName, lastName, role, market, email } = account;
    const { doceboCompanyAdminBranchId, doceboInstallersBranchId } = market;

    this.logger.info(`Get user by email`);

    // Check if the user already exists in docebo
    const { data: doceboUser } = await this.apolloClient.query({
      query: userByEmailDocument,
      variables: {
        email: email
      }
    });

    let doceboUserId = doceboUser.userByEmail?.user_id
      ? parseInt(doceboUser.userByEmail?.user_id)
      : null;

    if (!doceboUser.userByEmail?.user_id) {
      const branchId =
        role === "COMPANY_ADMIN"
          ? doceboCompanyAdminBranchId
          : doceboInstallersBranchId;

      const language = market.language.toLowerCase() || "en";
      const level =
        role === "COMPANY_ADMIN" ? POWER_USER_LEVEL : REGULAR_USER_LEVEL;

      this.logger.info(`Creating docebo account for user ${account.id}`);

      const { data } = await this.apolloClient.mutate({
        mutation: mutationCreateDoceboUser,
        variables: {
          input: {
            userid: email,
            email: email,
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
      });
      const { createDoceboUser } = data;

      if (!createDoceboUser) {
        throw new Error("Error creating docebo user");
      }

      doceboUserId = createDoceboUser?.user_id;

      this.logger.info(`Docebo account with id ${doceboUserId} created`);
    }

    await this.updateAccount(account.id, {
      doceboUserId: doceboUserId,
      doceboUsername: email
    });

    this.logger.info(
      `Account with id ${account.id} udpated with docebo id: ${doceboUserId}`
    );
  };
}
