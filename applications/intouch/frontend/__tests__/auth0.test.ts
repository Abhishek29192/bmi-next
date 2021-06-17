process.env.AUTH0_NAMESPACE = "AUTH0_NAMESPACE";

import {
  getMarketFromReq,
  loginHandler,
  afterCallback
} from "../pages/api/auth/[...auth0]";

import { createAccount, createDoceboUser, getAccount } from "../lib/account";

const mockHandleLogin = jest.fn();

jest.mock("../lib/auth0", () => ({
  getAuth0Instance: () => ({
    handleLogin: () => mockHandleLogin
  })
}));

jest.mock("../lib/account", () => ({
  parseAccount: jest.requireActual("../lib/account").parseAccount,
  createAccount: jest.fn(),
  createDoceboUser: jest.fn(),
  getAccount: jest.fn()
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
      { ...req, headers: { host: "tf-frontend-rfwslk3zjq-nw.a.run.app" } },
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
    req.headers.host = "tf-frontend-rfwslk3zjq-nw.a.run.app";
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
  let session;
  let state;

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
    session = {};
    state = {};
  });

  it("should return immediately if invited", async () => {
    session = {
      user: {
        [`${process.env.AUTH0_NAMESPACE}/intouch_invited`]: 5
      }
    };

    const result = await afterCallback(req, res, session, state);

    expect(result).toEqual({
      user: {
        [`${process.env.AUTH0_NAMESPACE}/intouch_invited`]: 5
      }
    });
    expect(createAccount).toHaveBeenCalledTimes(0);
    expect(createDoceboUser).toHaveBeenCalledTimes(0);
  });

  it("should create a user is first login", async () => {
    session = {
      user: {}
    };

    (createAccount as jest.Mock).mockReturnValueOnce(
      Promise.resolve({
        createAccount: {
          account: {
            id: 1
          }
        }
      })
    );
    await afterCallback(req, res, session, state);

    expect(createAccount).toHaveBeenCalledWith(req, session);
    expect(createDoceboUser).toHaveBeenCalledWith(req, session, {
      id: 1
    });
    expect(state).toEqual({
      returnTo: "/api/silent-login"
    });
  });

  it("should create a docebo user if user exists but docebo id not", async () => {
    session = {
      user: {
        [`${process.env.AUTH0_NAMESPACE}/intouch_user_id`]: 123
      }
    };

    (getAccount as jest.Mock).mockReturnValueOnce(
      Promise.resolve({
        data: {
          id: 1
        }
      })
    );
    await afterCallback(req, res, session, state);

    expect(getAccount).toHaveBeenCalledWith(req, session);
    expect(createDoceboUser).toHaveBeenCalledWith(req, session, {
      id: 1
    });
    expect(state).toEqual({
      returnTo: "/api/silent-login"
    });
  });
});
