process.env.AUTH0_NAMESPACE = "AUTH0_NAMESPACE";
process.env.GRAPHQL_URL = "GRAPHQL_URL";

import { ROLES } from "../../constants";
import { generateAccount } from "../../tests/factories/account";
import Account, {
  findAccountTier,
  mutationCreateAccount,
  queryAccountByEmail,
  mutationCompleteInvitation,
  userByEmailDocument,
  mutationCreateDoceboUser
} from "../";

jest.mock("../../utils/account", () => ({
  randomPassword: () => "password"
}));

describe("Account", () => {
  let accountSrv;

  const mockQuery = jest.fn();
  const mockMutate = jest.fn();
  const session = {
    user: {}
  };
  const logger = () => ({
    info: () => {},
    error: () => {}
  });
  const apolloClient = {
    query: mockQuery,
    mutate: mockMutate
  };

  beforeEach(() => {
    accountSrv = new Account(logger, apolloClient, session);
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("should send the create mutation with the right values", async () => {
    mockMutate.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          createAccount: {
            account: {
              id: 1
            }
          }
        }
      })
    );
    await accountSrv.createAccount({
      user: {
        email: "emamil@email.com",
        [`${process.env.AUTH0_NAMESPACE}/intouch_role`]: "COMPANY_ADMIN",
        [`${process.env.AUTH0_NAMESPACE}/intouch_market_code`]: "en",
        [`${process.env.AUTH0_NAMESPACE}/first_name`]: "Name",
        [`${process.env.AUTH0_NAMESPACE}/last_name`]: "Lastname"
      }
    });
    expect(mockMutate).toHaveBeenCalledWith({
      mutation: mutationCreateAccount,
      variables: {
        input: {
          account: {
            firstName: "Name",
            lastName: "Lastname",
            email: "emamil@email.com",
            role: "COMPANY_ADMIN"
          },
          marketCode: "en"
        }
      }
    });
  });

  it("should get the user", async () => {
    mockQuery.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          accountByEmail: {
            id: 1
          }
        }
      })
    );
    await accountSrv.getAccount({
      user: {
        email: "emamil@email.com"
      }
    });
    expect(mockQuery).toHaveBeenCalledWith({
      query: queryAccountByEmail,
      variables: {
        email: "emamil@email.com"
      }
    });
  });

  it("should complete the invitation", async () => {
    mockMutate.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          completeInvitation: {
            id: 1
          }
        }
      })
    );
    await accountSrv.completeAccountInvitation({
      query: {
        company_id: "1"
      }
    });
    expect(mockMutate).toHaveBeenCalledWith({
      mutation: mutationCompleteInvitation,
      variables: {
        companyId: 1
      }
    });
  });

  it("should not create the docebo account if already exists", async () => {
    mockQuery.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          userByEmail: {
            user_id: 1
          }
        }
      })
    );
    jest.spyOn(accountSrv, "updateAccount").mockImplementationOnce(() => ({}));
    await accountSrv.createDoceboUser({
      firstName: "Name",
      lastName: "Name",
      role: "COMPANY_ADMIN",
      email: "email@email.com",
      market: {
        doceboCompanyAdminBranchId: 1,
        doceboInstallersBranchId: 2
      }
    });

    expect(mockQuery).toHaveBeenCalledWith({
      query: userByEmailDocument,
      variables: {
        email: "email@email.com"
      }
    });
    expect(mockMutate).toHaveBeenCalledTimes(0);
  });

  it("should create the docebo account if the intouch account exists but no docebo account are linked to it", async () => {
    mockQuery.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          userByEmail: null
        }
      })
    );
    mockMutate.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          createDoceboUser: {
            user_id: "1"
          }
        }
      })
    );

    jest.spyOn(accountSrv, "updateAccount").mockImplementationOnce(() => ({}));
    await accountSrv.createDoceboUser({
      firstName: "Name",
      lastName: "Name",
      role: "COMPANY_ADMIN",
      email: "email@email.com",
      market: {
        doceboCompanyAdminBranchId: 1,
        doceboInstallersBranchId: 2,
        language: "en"
      }
    });

    expect(mockQuery).toHaveBeenCalledWith({
      query: userByEmailDocument,
      variables: {
        email: "email@email.com"
      }
    });
    expect(mockMutate).toHaveBeenCalledWith({
      mutation: mutationCreateDoceboUser,
      variables: {
        input: {
          userid: "email@email.com",
          email: "email@email.com",
          password: "password",
          firstname: "Name",
          lastname: "Name",
          language: "en",
          level: 4,
          valid: 1,
          email_validation_status: 1,
          can_manage_subordinates: false,
          send_notification_email: false,
          select_orgchart: {
            branch_id: 1
          }
        }
      }
    });
  });

  describe("findAccountTier", () => {
    it("should default to T1 for users without a company", () => {
      expect(
        findAccountTier(
          generateAccount({
            hasCompany: false
          })
        )
      ).toEqual("T1");
    });

    // Companies should always have a tier (created as T1 by default)
    // but leaving this test for now
    it("should return T1 if company has no tier", () => {
      expect(
        findAccountTier(
          generateAccount({
            role: ROLES.COMPANY_ADMIN,
            hasCompany: true,
            companyTier: null,
            companyStatus: "ACTIVE"
          })
        )
      ).toEqual("T1");
    });

    it("should return company tier when company has a tier", () => {
      expect(
        findAccountTier(
          generateAccount({
            role: ROLES.COMPANY_ADMIN,
            hasCompany: true,
            companyTier: "T3",
            companyStatus: "ACTIVE"
          })
        )
      ).toEqual("T3");
    });

    // TODO: test case for company.status = DEACTIVATED?
  });
});
