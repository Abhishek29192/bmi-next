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
  mutationCreateDoceboUser,
  isSuperAdmin,
  isSuperOrMarketAdmin,
  findAccountCompany,
  findAccountCompanyFromAccountQuery,
  hasProjects,
  mutationDoceboCreateSSOUrl,
  queryInvitation,
  mutationUpdateAccount
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
  it("should get the user with missing id", async () => {
    mockQuery.mockImplementationOnce(() =>
      Promise.resolve({
        data: {}
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
  it("getAccount exception", async () => {
    const error = { errorMessage: "error" };
    mockQuery.mockRejectedValueOnce(error);
    try {
      await accountSrv.getAccount({
        user: {
          email: "emamil@email.com"
        }
      });
    } catch (error) {
      expect(error.errorMessage).toEqual("error");
    }
  });
  it("createAccount exception", async () => {
    const error = { errorMessage: "error" };
    mockQuery.mockRejectedValueOnce(error);
    try {
      await accountSrv.createAccount({
        user: {
          email: "emamil@email.com"
        }
      });
    } catch (error) {
      expect(error.message).toBeDefined();
    }
  });
  it("completeAccountInvitation exception", async () => {
    const error = { errorMessage: "error" };
    mockMutate.mockRejectedValueOnce(error);
    try {
      await accountSrv.completeAccountInvitation({
        query: {
          company_id: "1"
        }
      });
    } catch (error) {
      expect(error.errorMessage).toEqual("error");
    }
  });
  it("createDoceboUser exception", async () => {
    const error = { errorMessage: "error" };
    mockQuery.mockImplementationOnce(() =>
      Promise.resolve({
        data: {}
      })
    );
    mockMutate.mockRejectedValueOnce(error);
    try {
      await accountSrv.createDoceboUser({
        firstName: "Name",
        lastName: "Name",
        role: "MARKET_ADMIN",
        email: "email@email.com",
        market: {
          doceboCompanyAdminBranchId: 1,
          doceboInstallersBranchId: 2
        }
      });
    } catch (error) {
      expect(error.errorMessage).toEqual("error");
    }
  });
  it("createDoceboUser exception 2", async () => {
    mockQuery.mockImplementationOnce(() =>
      Promise.resolve({
        data: {}
      })
    );
    mockMutate.mockImplementationOnce(() =>
      Promise.resolve({
        data: {}
      })
    );
    try {
      await accountSrv.createDoceboUser({
        firstName: "Name",
        lastName: "Name",
        role: "COMPANY_ADMIN",
        email: "email@email.com",
        market: {
          doceboCompanyAdminBranchId: 1,
          doceboInstallersBranchId: 2,
          language: "EN"
        }
      });
    } catch (error) {
      expect(error.errorMessage).toEqual("error");
    }
  });
  it("createDoceboUser missing Mutate user_id", async () => {
    mockQuery.mockImplementationOnce(() =>
      Promise.resolve({
        data: {}
      })
    );
    mockMutate.mockImplementationOnce(() =>
      Promise.resolve({
        data: {
          createDoceboUser: {}
        }
      })
    );
    try {
      await accountSrv.createDoceboUser({
        firstName: "Name",
        lastName: "Name",
        role: "COMPANY_ADMIN",
        email: "email@email.com",
        market: {
          doceboCompanyAdminBranchId: 1,
          doceboInstallersBranchId: 2,
          language: "EN"
        }
      });
    } catch (error) {
      expect(error.errorMessage).toEqual("error");
    }
  });
  describe("Docebo SSO", () => {
    it("should generate Docebo SSO url based on path query path", async () => {
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
      await accountSrv.createDoceboSSOUrl(
        {
          query: {
            path: "/learn/mycourses"
          }
        },
        {
          user: {
            email: "emamil@email.com",
            marketCode: "en"
          }
        }
      );
      expect(mockMutate).toBeCalledTimes(1);
    });
    it("should generate Docebo SSO url", async () => {
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
      await accountSrv.createDoceboSSOUrl(
        {
          query: {}
        },
        {
          user: {
            email: "emamil@email.com",
            marketCode: "en"
          }
        }
      );
      expect(mockMutate).toBeCalledTimes(1);
    });
    it("check if data from Docebo is available", async () => {
      mockMutate.mockImplementationOnce(() => Promise.resolve({}));
      await accountSrv.createDoceboSSOUrl(
        { query: {} },
        {
          user: {
            email: "emamil@email.com",
            marketCode: "en"
          }
        }
      );
      expect(mockMutate).toHaveBeenCalledWith({
        mutation: mutationDoceboCreateSSOUrl,
        variables: {
          username: "emamil@email.com",
          path: "/undefined/learn/mycourses"
        }
      });
    });
    it("createDoceboSSOUrl exception", async () => {
      const error = { errorMessage: "error" };
      mockMutate.mockRejectedValueOnce(error);
      try {
        await accountSrv.createDoceboSSOUrl(
          {
            query: {}
          },
          {
            user: {
              email: "emamil@email.com",
              marketCode: "en"
            }
          }
        );
      } catch (error) {
        expect(error.errorMessage).toEqual("error");
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
  describe("isSuperAdmin", () => {
    it("should return true if account has SUPER_ADMIN role", () => {
      expect(
        isSuperAdmin(
          generateAccount({
            role: ROLES.SUPER_ADMIN
          })
        )
      ).toEqual(true);
    });
    it("should return false if account is missing", () => {
      expect(isSuperAdmin(undefined)).toEqual(false);
    });
  });
  describe("isSuperOrMarketAdmin", () => {
    it("should return true if account has SUPER_ADMIN or MARKET_ADMIN role", () => {
      expect(
        isSuperOrMarketAdmin(
          generateAccount({
            role: ROLES.SUPER_ADMIN
          })
        )
      ).toEqual(true);
    });
    it("should return false if account is missing", () => {
      expect(isSuperOrMarketAdmin(undefined)).toEqual(false);
    });
  });
  describe("findAccountCompany", () => {
    it("should return undefined if account is missing", () => {
      expect(findAccountCompany(undefined)).toEqual(undefined);
    });
  });
  describe("findAccountCompanyFromAccountQuery", () => {
    it("should return company if account data is OK", () => {
      const account = generateAccount({
        hasCompany: true
      });
      expect(findAccountCompanyFromAccountQuery(account)).toMatchObject({
        id: 1,
        name: "Integrated Solutions Inc",
        status: "ACTIVE",
        tier: "T2"
      });
    });
    it("should return undefined if account is missing", () => {
      expect(findAccountCompanyFromAccountQuery(undefined)).toEqual(undefined);
    });
  });
  describe("hasProjects", () => {
    it("should return true if account data has projects", () => {
      expect(
        hasProjects(
          generateAccount({
            projectsCount: 1
          })
        )
      ).toEqual(true);
    });
    it("should return undefined if account is missing or has no projects", () => {
      expect(hasProjects(undefined)).toEqual(false);
    });
  });
  describe("getInvitation", () => {
    it("should get invitation", async () => {
      mockQuery.mockImplementationOnce(() =>
        Promise.resolve({
          data: {
            invitations: {
              nodes: [{}]
            }
          }
        })
      );
      await accountSrv.getInvitation({
        user: {
          email: "emamil@email.com"
        }
      });

      expect(mockQuery).toHaveBeenCalledWith({
        query: queryInvitation,
        variables: {
          invitee: "emamil@email.com"
        }
      });
    });
    it("should get invitation without data", async () => {
      mockQuery.mockImplementationOnce(() => Promise.resolve({}));
      await accountSrv.getInvitation({
        user: {
          email: "emamil@email.com"
        }
      });

      expect(mockQuery).toHaveBeenCalledWith({
        query: queryInvitation,
        variables: {
          invitee: "emamil@email.com"
        }
      });
    });
    it("getInvitation exception", async () => {
      const error = { errorMessage: "error" };
      mockQuery.mockRejectedValueOnce(error);
      try {
        await accountSrv.getInvitation({
          user: {
            email: "emamil@email.com"
          }
        });
      } catch (error) {
        expect(error.errorMessage).toEqual("error");
      }
    });
  });
  describe("updateAccount", () => {
    const patch = {
      user: {
        email: "emamil@email.com"
      }
    };
    it("should get invitation", async () => {
      mockMutate.mockImplementationOnce(() =>
        Promise.resolve({
          data: {
            updateAccount: {
              account: {
                id: 1
              }
            }
          }
        })
      );
      await accountSrv.updateAccount(1, patch);
      expect(mockMutate).toHaveBeenCalledWith({
        mutation: mutationUpdateAccount,
        variables: {
          input: {
            id: 1,
            patch
          }
        }
      });
    });
    it("should get invitation without data", async () => {
      mockMutate.mockImplementationOnce(() =>
        Promise.resolve({
          data: {
            updateAccount: {}
          }
        })
      );
      await accountSrv.updateAccount(1, patch);
      expect(mockMutate).toHaveBeenCalledTimes(1);
    });
    it("updateAccount exception", async () => {
      const error = { errorMessage: "error" };
      mockMutate.mockRejectedValueOnce(error);
      try {
        await accountSrv.updateAccount({
          mutation: mutationUpdateAccount,
          variables: {
            input: {
              id: 1,
              patch
            }
          }
        });
      } catch (error) {
        expect(error.errorMessage).toEqual("error");
      }
    });
  });
});
