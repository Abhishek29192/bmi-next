import * as userInfo from "../parseUserInfo";

process.env.AUTH0_NAMESPACE = "user";

const mockQuery = jest.fn();
jest.mock("../../db", () => ({
  getDbPool: () => ({
    query: mockQuery
  })
}));

jest.mock("../../permissions", () => ({
  INSTALLER: ["act-1"],
  COMPANY_ADMIN: ["act-2"],
  MARKET_ADMIN: [],
  SUPER_ADMIN: []
}));

const user = {
  "user/email": "user.email",
  iss: "user.iss",
  iat: "user.iat",
  exp: "user.exp",
  scope: "user.exp",
  sub: "user.sub",
  aud: "user.aud"
};
const USER_INFO_HEADER = Buffer.from(JSON.stringify(user)).toString("base64");

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

  it("should append the user object to the request", async () => {
    const mockCan = jest.fn();
    jest.spyOn(userInfo, "can").mockImplementationOnce(() => mockCan);

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
              domain: "market_domain",
              send_mailbox: "send_mailbox",
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
        market: {
          id: "market_id",
          domain: "market_domain",
          sendMailbox: "send_mailbox"
        },
        status: "status",
        doceboUserId: "docebo_user_id",
        doceboUsername: "docebo_username",
        migrationId: "migration_id",
        company: {
          id: 2,
          name: "Company name"
        },
        can: mockCan
      }
    });
  });

  describe("Can", () => {
    it("should return true if a use can perform an action", () => {
      expect(userInfo.can({ user: { role: "INSTALLER" } })("act-1")).toEqual(
        true
      );
    });
    it("should return true if a use can perform an action 1", () => {
      expect(
        userInfo.can({ user: { role: "COMPANY_ADMIN" } })("act-2")
      ).toEqual(true);
    });
    it("should return false if a use can't perform an action", () => {
      expect(userInfo.can({ user: { role: "INSTALLER" } })("act-2")).toEqual(
        false
      );
    });
  });
});
