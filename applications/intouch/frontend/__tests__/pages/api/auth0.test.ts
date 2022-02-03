import { Session } from "@auth0/nextjs-auth0";
import { NextApiResponse } from "next";
import { Request } from "../../../pages/api/auth/[...auth0]";

process.env.AUTH0_NAMESPACE = "AUTH0_NAMESPACE";

const mockGetAccount = jest.fn();
const mockCreateAccount = jest.fn();
const mockGetInvitation = jest.fn();
const mockCreateDoceboUser = jest.fn();
const mockIsSuperAdmin = jest.fn();

jest.mock("../../../lib/account", () => {
  const mockedModule = jest.requireActual("../../../lib/account");

  return {
    __esModule: true,
    isSuperAdmin: mockIsSuperAdmin,
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

  beforeEach(() => {
    req = {
      logger: jest.fn(),
      headers: {},
      query: {
        returnTo: "/return-to"
      }
    };
    jest.resetModules();
  });

  it("should return the right login options when in dev", async () => {
    const { getLoginOptions } = await import(
      "../../../pages/api/auth/[...auth0]"
    );

    req.headers.host = "dev-no.local.intouch:3000";

    const options = await getLoginOptions(req);

    expect(options).toMatchInlineSnapshot(`
      Object {
        "authorizationParams": Object {
          "market": "no",
        },
      }
    `);
  });

  it("should return the right login options when in uat", async () => {
    const { getLoginOptions } = await import(
      "../../../pages/api/auth/[...auth0]"
    );

    req.headers.host = "uat-no.local.intouch:3000";

    const options = await getLoginOptions(req);

    expect(options).toMatchInlineSnapshot(`
      Object {
        "authorizationParams": Object {
          "market": "no",
        },
      }
    `);
  });

  it("should return the right login options when in prod", async () => {
    const { getLoginOptions } = await import(
      "../../../pages/api/auth/[...auth0]"
    );

    req.headers.host = "no.intouch.bmiground.com";

    const options = await getLoginOptions(req);

    expect(options).toMatchInlineSnapshot(`
      Object {
        "authorizationParams": Object {
          "market": "no",
        },
      }
    `);
  });
});

describe("Auth0 callback", () => {
  let req: Partial<Request>;
  let res: Partial<NextApiResponse<any>>;
  let session: Partial<Session>;
  let state: any;
  const afterCallback = async (
    request: Partial<Request>,
    response: Partial<NextApiResponse<any>>,
    session: Partial<Session>,
    state: any
  ) =>
    (await import("../../../pages/api/auth/[...auth0]")).afterCallback(
      request as Request,
      response as NextApiResponse<any>,
      session as Session,
      state
    );

  const logger = () => ({
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
      status: () =>
        ({
          end: () => {}
        } as NextApiResponse<any>)
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
