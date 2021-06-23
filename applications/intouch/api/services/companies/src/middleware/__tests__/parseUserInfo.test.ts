import * as userInfo from "../parseUserInfo";

process.env.AUTH0_NAMESPACE = "user";

const mockQuery = jest.fn();
jest.mock("../../db", () => ({
  getDbPool: () => ({
    query: mockQuery
  })
}));

const USER_INFO_HEADER =
  "ewogICJ1c2VyL2VtYWlsIjogInVzZXIuZW1haWwiLAogICJpc3MiOiAidXNlci5pc3MiLAogICJpYXQiOiAidXNlci5pYXQiLAogICJleHAiOiAidXNlci5leHAiLAogICJzY29wZSI6ICJ1c2VyLmV4cCIsCiAgInN1YiI6ICJ1c2VyLnN1YiIsCiAgImF1ZCI6ICJ1c2VyLmF1ZCIKfQ==";

describe("ParseUserInfo", () => {
  let logger = () => ({
    info: () => {},
    error: () => {}
  });
  let req = {
    logger,
    headers: {
      "x-apigateway-api-userinfo": USER_INFO_HEADER
    }
  };
  let res;
  let next = () => {};

  beforeEach(() => {});

  it("should parse the userinfo header", async () => {
    const user = await userInfo.parseHeaders(req);

    expect(user).toEqual({
      "user/email": "user.email",
      iss: "user.iss",
      iat: "user.iat",
      exp: "user.exp",
      scope: "user.exp",
      sub: "user.sub",
      aud: "user.aud"
    });
  });

  it("should appen the user object to the request", async () => {
    mockQuery
      .mockImplementationOnce(() =>
        Promise.resolve({
          rows: [
            {
              id: "id",
              role: "role",
              first_name: "first_name",
              last_name: "last_name",
              market_id: "market_id",
              market_domain: "market_domain",
              status: "status",
              docebo_user_id: "docebo_user_id",
              docebo_username: "docebo_username",
              migration_id: "migration_id"
            }
          ]
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          rows: [
            {
              id: 2,
              account_id: 1,
              company_id: 123
            }
          ]
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          rows: [
            {
              id: 2,
              name: "Company name"
            }
          ]
        })
      );

    await userInfo.default(req, res, next);

    expect(req).toEqual({
      logger,
      headers: {
        "x-apigateway-api-userinfo": USER_INFO_HEADER
      },
      user: {
        email: "user.email",
        iss: "user.iss",
        iat: "user.iat",
        exp: "user.exp",
        scope: "user.exp",
        sub: "user.sub",
        aud: "user.aud",
        id: "id",
        role: "role",
        firstName: "first_name",
        lastName: "last_name",
        marketId: "market_id",
        marketDomain: "market_domain",
        status: "status",
        doceboUserId: "docebo_user_id",
        doceboUsername: "docebo_username",
        migrationId: "migration_id",
        company: {
          id: 2,
          name: "Company name"
        }
      }
    });
  });
});
