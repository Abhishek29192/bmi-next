import postGraphileOpts from "../postGraphileOpts";

describe("Postgraphile", () => {
  it("the context should have the user object", async () => {
    const req: any = {
      user: {
        intouchUserId: "123",
        role: "installer",
        email: "email"
      }
    };
    const context = await postGraphileOpts.additionalGraphQLContextFromRequest(
      req,
      null
    );

    expect(context).toEqual({
      user: {
        intouchUserId: "123",
        role: "installer",
        email: "email"
      }
    });
  });

  it("pgSetting should set the role and user id", async () => {
    const req: any = {
      user: {
        intouchUserId: "123",
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
        intouchUserId: "123",
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
});
