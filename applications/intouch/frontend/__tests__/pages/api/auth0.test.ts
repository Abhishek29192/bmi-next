process.env.AUTH0_NAMESPACE = "AUTH0_NAMESPACE";

import {
  getMarketFromReq,
  loginHandler,
  afterCallback
} from "../../../pages/api/auth/[...auth0]";

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

describe("Market", () => {
  let req = {
    logger: jest.fn()
  };
  let res = {};

  it("should return the en market if localhost", () => {
    const market = getMarketFromReq(
      { ...req, headers: { host: "localhost:3000" } },
      res
    );

    expect(market).toEqual("en");
  });

  it("should return es market when es the subdmin", () => {
    const market = getMarketFromReq(
      { ...req, headers: { host: "es.local.intouch:3000" } },
      res
    );

    expect(market).toEqual("es");
  });

  it("should return en market when en the subdmin", () => {
    const market = getMarketFromReq(
      { ...req, headers: { host: "en.local.intouch:3000" } },
      res
    );

    expect(market).toEqual("en");
  });

  it("should return en when the online dev domain", () => {
    const market = getMarketFromReq(
      { ...req, headers: { host: "intouch.dddev.io" } },
      res
    );

    expect(market).toEqual("en");
  });
});

describe("Auth0 Handler", () => {
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
  });

  it("should redirect to login with the market when localhost", async () => {
    req.headers.host = "localhost:3000";
    await loginHandler(req, res, auth0, logger);

    expect(auth0.handleLogin.mock.calls[0][2]).toEqual({
      authorizationParams: { market: "en" },
      returnTo: "/return-to"
    });
  });

  it("should redirect to login with the market when es.local.intouch", async () => {
    req.headers.host = "es.local.intouch:3000";
    await loginHandler(req, res, auth0, logger);

    expect(auth0.handleLogin.mock.calls[0][2]).toEqual({
      authorizationParams: { market: "es" },
      returnTo: "/return-to"
    });
  });

  it("should redirect to login with the market when online", async () => {
    req.headers.host = "intouch.dddev.io";
    await loginHandler(req, res, auth0, logger);

    expect(auth0.handleLogin.mock.calls[0][2]).toEqual({
      authorizationParams: { market: "en" },
      returnTo: "/return-to"
    });
  });

  it("should return to home if param not present", async () => {
    req.headers.host = "es.local.intouch:3000";
    delete req.query.returnTo;
    await loginHandler(req, res, auth0, logger);

    expect(auth0.handleLogin.mock.calls[0][2]).toEqual({
      authorizationParams: { market: "es" },
      returnTo: "/"
    });
  });
});

describe("Auth0 callback", () => {
  let req;
  let res;
  let state;
  let session;

  let logger = () => ({
    info: () => {},
    error: () => {}
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
    expect(mockCreateDoceboUser).toHaveBeenCalledWith({
      id: 1
    });
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
