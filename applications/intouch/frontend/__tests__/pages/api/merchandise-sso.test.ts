import { handler } from "../../../pages/api/merchandise-sso";

const mockCompleteMerchandiseSso = jest.fn();
jest.mock("../../../lib/merchandise", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        completeMerchandiseSso: mockCompleteMerchandiseSso
      };
    })
  };
});

const mockGetSession = jest.fn();
jest.mock("../../../lib/auth0", () => ({
  getAuth0Instance: () => ({
    getSession: mockGetSession
  })
}));

describe("Merchandise SSO API", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      logger: () => ({
        info: () => {},
        error: () => {}
      })
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
      Location: "/api/auth/login"
    });
    expect(res.end).toHaveBeenCalledTimes(1);
  });

  it("Should generate Merchandise SSO url", async () => {
    const mockUrl = "some.url";
    mockGetSession.mockImplementationOnce(() => ({
      user: {
        id: 1
      }
    }));

    mockCompleteMerchandiseSso.mockImplementationOnce(() =>
      Promise.resolve({
        performMerchandiseSso: mockUrl
      })
    );

    await handler(req, res);

    expect(res.writeHead).toHaveBeenCalledWith(302, {
      Location: mockUrl
    });
    expect(res.end).toHaveBeenCalledTimes(1);
  });
});
