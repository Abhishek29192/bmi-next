import postGraphileOpts from "../postGraphileOpts";

jest.mock("../../db", () => ({
  getDbPool: () => "pgRootPool"
}));
jest.mock("../../services/storage-client", () => {
  return function () {
    return {};
  };
});

describe("Postgraphile", () => {
  it("the context should have the user object", async () => {
    const req: any = {
      user: {
        id: "123",
        role: "installer",
        email: "email"
      },
      logger: "logger",
      pubSub: "pubSub"
    };
    const context = await postGraphileOpts.additionalGraphQLContextFromRequest(
      req,
      null
    );

    expect(context).toEqual({
      user: {
        id: "123",
        role: "installer",
        email: "email"
      },
      logger: "logger",
      pubSub: "pubSub",
      pgRootPool: "pgRootPool",
      storageClient: {}
    });
  });

  it("pgSetting should set the role and user id", async () => {
    const req: any = {
      user: {
        id: "123",
        role: "installer",
        email: "email"
      }
    };
    const pgSettings =
      typeof postGraphileOpts.pgSettings === "function"
        ? await postGraphileOpts.pgSettings(req)
        : postGraphileOpts.pgSettings;

    expect(pgSettings).toEqual({
      "app.current_account_id": "123",
      "app.current_account_email": "email",
      role: "installer"
    });
  });

  it("pgSetting should set role installer if role not in whitelist", async () => {
    const req: any = {
      user: {
        id: "123",
        role: "postgres",
        email: "email"
      }
    };
    const pgSettings =
      typeof postGraphileOpts.pgSettings === "function"
        ? await postGraphileOpts.pgSettings(req)
        : postGraphileOpts.pgSettings;

    expect(pgSettings).toEqual({
      "app.current_account_id": "123",
      "app.current_account_email": "email",
      role: "installer"
    });
  });

  it("pgSetting should not set user information if trustedConnection", async () => {
    const req: any = {
      user: {},
      trustedConnection: true
    };
    const pgSettings =
      typeof postGraphileOpts.pgSettings === "function"
        ? await postGraphileOpts.pgSettings(req)
        : postGraphileOpts.pgSettings;

    expect(pgSettings).toEqual({});
  });
});
