export {}; // silences --isolatedModules warning

process.env.AUTH0_NAMESPACE = "AUTH0_NAMESPACE";

const mockGetAccount = jest.fn();
const mockCreateAccount = jest.fn();
const mockGetInvitation = jest.fn();
const mockCreateDoceboUser = jest.fn();

jest.mock("../../../lib/account", () => {
  const mockedModule = jest.requireActual("../../../lib/account");

  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        ...mockedModule,
        getAccount: mockGetAccount,
        createAccount: mockCreateAccount,
        getInvitation: mockGetInvitation,
        createDoceboUser: mockCreateDoceboUser
      };
    })
  };
});

const mockHandleLogin = jest.fn();
jest.mock("../../../lib/auth0", () => ({
  getAuth0Instance: () => ({
    handleLogin: () => mockHandleLogin
  })
}));

const mockQuery = jest.fn();
jest.mock("../../../lib/apolloClient", () => ({
  initializeApollo: () =>
    Promise.resolve({
      query: mockQuery
    })
}));

describe("Login Handler", () => {
  let req;
  let res;
  let auth0;
  let logger;

  beforeEach(() => {
    req = {
      logger: jest.fn(),
      headers: {},
      query: {
        returnTo: "/return-to"
      }
    };
    res = {
      status: () => ({
        end: () => {}
      })
    };
    auth0 = { handleLogin: jest.fn() };
    logger = { info: jest.fn(), error: jest.fn() };
    jest.resetModules();
  });

  it("should return the right login options when in dev", async () => {
    const { getLoginOptions } = require("../../../pages/api/auth/[...auth0]");

    req.headers.host = "dev-no.local.intouch:3000";

    const options = await getLoginOptions(req);

    expect(options).toMatchInlineSnapshot(`
      Object {
        "authorizationParams": Object {
          "market": "no",
        },
        "loginState": Object {
          "currentHost": "dev-no.local.intouch:3000",
          "returnTo": "/api/redirector?current=http%3A%2F%2Fdev-no.local.intouch%3A3000",
        },
      }
    `);
  });

  it("should return the right login options when in uat", async () => {
    const { getLoginOptions } = require("../../../pages/api/auth/[...auth0]");

    req.headers.host = "uat-no.local.intouch:3000";

    const options = await getLoginOptions(req);

    expect(options).toMatchInlineSnapshot(`
      Object {
        "authorizationParams": Object {
          "market": "no",
        },
        "loginState": Object {
          "currentHost": "uat-no.local.intouch:3000",
          "returnTo": "/api/redirector?current=http%3A%2F%2Fuat-no.local.intouch%3A3000",
        },
      }
    `);
  });

  it("should return the right login options when in prod", async () => {
    const { getLoginOptions } = require("../../../pages/api/auth/[...auth0]");

    req.headers.host = "no.intouch.bmiground.com";

    const options = await getLoginOptions(req);

    expect(options).toMatchInlineSnapshot(`
      Object {
        "authorizationParams": Object {
          "market": "no",
        },
        "loginState": Object {
          "currentHost": "no.intouch.bmiground.com",
          "returnTo": "/api/redirector?current=http%3A%2F%2Fno.intouch.bmiground.com",
        },
      }
    `);
  });
});

describe("Auth0 callback", () => {
  let req;
  let res;
  let state;
  let session;
  let afterCallback;

  let logger = () => ({
    info: () => {},
    error: () => {}
  });

  beforeAll(() => {
    afterCallback = require("../../../pages/api/auth/[...auth0]").afterCallback;
  });

  beforeEach(() => {
    req = {
      logger,
      headers: {},
      query: {
        returnTo: "/return-to"
      }
    };
    res = {
      status: () => ({
        end: () => {}
      })
    };
    session = {};
    state = {};
  });

  it("should create the user and the docebo user if first login", async () => {
    session = {
      user: {}
    };

    mockGetAccount.mockImplementation(() => Promise.resolve(null));
    mockGetInvitation.mockImplementation(() => Promise.resolve(null));
    mockCreateAccount.mockImplementation(() => Promise.resolve({ id: 1 }));

    await afterCallback(req, res, session, state);

    expect(mockCreateAccount).toHaveBeenCalledWith(session);
    expect(mockCreateDoceboUser).toHaveBeenCalledWith({ id: 1 });
    expect(state).toEqual({
      returnTo: "/api/silent-login"
    });
  });

  it("should create the docebo user if it doesn exists", async () => {
    session = {
      user: {}
    };

    mockGetAccount.mockImplementation(() => Promise.resolve({ id: 1 }));
    mockGetInvitation.mockImplementation(() => Promise.resolve(null));

    await afterCallback(req, res, session, state);

    expect(mockCreateDoceboUser).toHaveBeenCalledWith({
      id: 1
    });
    expect(state).toEqual({
      returnTo: "/api/silent-login"
    });
  });

  it("should continue if user and docebo user alread exists", async () => {
    session = {
      user: {
        foo: "bar"
      }
    };

    mockGetAccount.mockImplementation(() =>
      Promise.resolve({ id: 1, doceboUserId: 1 })
    );
    mockGetInvitation.mockImplementation(() => Promise.resolve(null));

    expect(await afterCallback(req, res, session, state)).toEqual({
      user: {
        foo: "bar"
      }
    });
  });

  it("should continue if the user is invited", async () => {
    session = {
      user: {
        foo: "bar"
      }
    };

    mockGetAccount.mockImplementation(() => Promise.resolve(null));
    mockGetInvitation.mockImplementation(() =>
      Promise.resolve([
        {
          id: "",
          status: "",
          invitee: "",
          senderAccountId: ""
        }
      ])
    );

    expect(await afterCallback(req, res, session, state)).toEqual({
      user: {
        foo: "bar"
      }
    });
  });
});
