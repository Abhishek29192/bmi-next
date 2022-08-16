process.env.AUTH0_NAMESPACE = "AUTH0_NAMESPACE";
process.env.GCP_SECRET_PROJECT = "PROJECT_ID";

import { getAuth0Instance } from "..";

jest.mock("axios");
const mockAccessSecretVersion = jest.fn();

jest.mock("@auth0/nextjs-auth0", () => ({
  initAuth0: jest.fn(() => ({
    getSession: jest.fn()
  }))
}));

describe("App", () => {
  let req;
  let res;
  let auth0Instance;

  beforeEach(() => {
    req = {
      url: "",
      headers: {
        host: "en.local.intouch"
      }
    };
    res = {
      writeHead: jest.fn(),
      end: () => {}
    };
    mockAccessSecretVersion.mockImplementationOnce(() =>
      Promise.resolve([
        {
          payload: { data: "" }
        }
      ])
    );
    mockAccessSecretVersion.mockImplementationOnce(() =>
      Promise.resolve([
        {
          payload: { data: "" }
        }
      ])
    );
  });
  afterEach(() => {
    jest.resetModules();
  });

  it("Should proceed if auth api", async () => {
    req.url = "/api/auth/callback";
    auth0Instance = await getAuth0Instance(req, res);
    expect(auth0Instance).not.toBeNull();
  });
});
