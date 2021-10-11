import { handler } from "../../../pages/api/invitation";

const mockQuery = jest.fn();
jest.mock("../../../lib/apolloClient", () => ({
  initializeApollo: () =>
    Promise.resolve({
      query: mockQuery
    })
}));

const mockGetSession = jest.fn();
jest.mock("../../../lib/auth0", () => ({
  getAuth0Instance: () => ({
    getSession: mockGetSession
  })
}));

const mockCompleteAccountInvitation = jest.fn();
const mockCreateDoceboUser = jest.fn();
jest.mock("../../../lib/account", () => {
  const mockedModule = jest.requireActual("../../../lib/account");

  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        ...mockedModule,
        completeAccountInvitation: mockCompleteAccountInvitation,
        createDoceboUser: mockCreateDoceboUser
      };
    })
  };
});

describe("Invitation api", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      logger: () => ({
        info: () => {},
        error: () => {}
      }),
      query: {
        company_id: 1
      }
    };
    res = {
      writeHead: jest.fn(),
      end: jest.fn()
    };
  });

  it("Should redirect to login if there is no session", async () => {
    mockGetSession.mockImplementationOnce(() => null);
    await handler(req, res);

    expect(res.writeHead).toHaveBeenCalledWith(302, {
      Location: "/api/auth/login?returnTo=/api/invitation?company_id=1"
    });
    expect(res.end).toHaveBeenCalledTimes(1);
  });
  it("Should complete the invitation and redirect to silent-login", async () => {
    mockGetSession.mockImplementationOnce(() => ({
      user: {
        id: 1
      }
    }));

    mockCompleteAccountInvitation.mockImplementationOnce(() =>
      Promise.resolve({
        completeInvitation: {
          id: 1
        }
      })
    );

    await handler(req, res);

    expect(mockCreateDoceboUser).toHaveBeenCalledWith({
      id: 1
    });
    expect(res.writeHead).toHaveBeenCalledWith(302, {
      Location: "/api/silent-login"
    });
    expect(res.end).toHaveBeenCalledTimes(1);
  });
});
