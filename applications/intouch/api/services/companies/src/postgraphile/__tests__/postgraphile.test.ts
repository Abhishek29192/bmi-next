import postGraphileOpts from "../postGraphileOpts";

describe("Postgraphile", () => {
  it("the context should have the user object", async () => {
    const req: any = {
      headers: {
        "x-authenticated-internal-user-id": "123",
        "x-authenticated-role": "installer"
      }
    };
    const context = await postGraphileOpts.additionalGraphQLContextFromRequest(
      req,
      null
    );

    expect(context).toEqual({
      user: {
        id: "123",
        role: "installer"
      }
    });
  });

  it("pgSetting should should set the role and user id", async () => {
    const req: any = {
      user: {
        id: "123",
        role: "installer"
      }
    };
    const pgSettings =
      typeof postGraphileOpts.pgSettings === "function"
        ? await postGraphileOpts.pgSettings(req)
        : postGraphileOpts.pgSettings;

    expect(pgSettings).toEqual({
      "app.current_account": "123",
      role: "installer"
    });
  });
});
