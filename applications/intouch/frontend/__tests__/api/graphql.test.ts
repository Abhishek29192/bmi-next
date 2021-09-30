import { handler } from "../../pages/api/graphql";

jest.mock("uuid", () => ({
  v4: () => "uuid"
}));
jest.mock("http-proxy-middleware", () => ({
  createProxyMiddleware: (req, res, next) => jest.fn()
}));
const mockGetSession = jest.fn();
jest.mock("../../lib/auth0", () => ({
  getAuth0Instance: () => ({
    getSession: mockGetSession
  })
}));

const ORIGINAL_FRONTEND_BASE_URL = process.env.FRONTEND_BASE_URL;

const createAccessToken = (claims = {}) => {
  const user = {
    "user/email": "user.email",
    iss: "user.iss",
    iat: "user.iat",
    exp: "user.exp",
    scope: "user.exp",
    sub: "user.sub",
    aud: "user.aud",
    user: {
      "https://intouch/intouch_market_code": "en"
    },
    ...claims
  };
  return `xx.${Buffer.from(JSON.stringify(user)).toString("base64")}.xx`;
};

describe("GraphQL proxy", () => {
  let req;
  let res;

  beforeEach(() => {
    process.env.FRONTEND_BASE_URL = "http://intouch";
    req = {
      logger: () => ({
        info: () => {},
        error: () => {}
      }),
      headers: {}
    };
    res = {
      writeHead: jest.fn(),
      end: jest.fn()
    };
  });

  afterEach(() => {
    process.env.FRONTEND_BASE_URL = ORIGINAL_FRONTEND_BASE_URL;
  });

  it("Should proxy the request after email verification without market sub domain", async () => {
    req.headers.host = "intouch";

    mockGetSession.mockImplementationOnce(() => ({
      accessToken: createAccessToken(),
      user: {
        "https://intouch/intouch_market_code": "en"
      }
    }));

    await handler(req, res, null);

    expect(req.headers).toMatchInlineSnapshot(`
      Object {
        "authorization": "Bearer xx.eyJ1c2VyL2VtYWlsIjoidXNlci5lbWFpbCIsImlzcyI6InVzZXIuaXNzIiwiaWF0IjoidXNlci5pYXQiLCJleHAiOiJ1c2VyLmV4cCIsInNjb3BlIjoidXNlci5leHAiLCJzdWIiOiJ1c2VyLnN1YiIsImF1ZCI6InVzZXIuYXVkIiwidXNlciI6eyJodHRwczovL2ludG91Y2gvaW50b3VjaF9tYXJrZXRfY29kZSI6ImVuIn19.xx",
        "host": "intouch",
        "x-request-id": "uuid",
        "x-request-market-domain": "en",
      }
    `);
  });

  it("Should proxy the request when market sub domain", async () => {
    req.headers.host = "no.intouch";

    mockGetSession.mockImplementationOnce(() => ({
      accessToken: createAccessToken(),
      user: {
        "https://intouch/intouch_market_code": "en"
      }
    }));

    await handler(req, res, null);

    expect(req.headers).toMatchInlineSnapshot(`
      Object {
        "authorization": "Bearer xx.eyJ1c2VyL2VtYWlsIjoidXNlci5lbWFpbCIsImlzcyI6InVzZXIuaXNzIiwiaWF0IjoidXNlci5pYXQiLCJleHAiOiJ1c2VyLmV4cCIsInNjb3BlIjoidXNlci5leHAiLCJzdWIiOiJ1c2VyLnN1YiIsImF1ZCI6InVzZXIuYXVkIiwidXNlciI6eyJodHRwczovL2ludG91Y2gvaW50b3VjaF9tYXJrZXRfY29kZSI6ImVuIn19.xx",
        "host": "no.intouch",
        "x-request-id": "uuid",
        "x-request-market-domain": "no",
      }
    `);
  });
});
