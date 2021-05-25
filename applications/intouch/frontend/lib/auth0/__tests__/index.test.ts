import axios from "axios";
import { initAuth0 } from "@auth0/nextjs-auth0";

process.env.AUTH0_NAMESPACE = "AUTH0_NAMESPACE";
process.env.GCP_SECRET_PROJECT = "PROJECT_ID";

import { getAuth0Instance } from "..";

jest.mock("axios");
const mockAccessSecretVersion = jest.fn();
jest.mock("@google-cloud/secret-manager", () => ({
  SecretManagerServiceClient: jest.fn(() => ({
    accessSecretVersion: mockAccessSecretVersion
  }))
}));

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
    expect(mockAccessSecretVersion.mock.calls[0][0]).toEqual({
      name: `projects/PROJECT_ID/secrets/AUTH0_CLIENT_SECRET/versions/latest`
    });
    expect(mockAccessSecretVersion.mock.calls[1][0]).toEqual({
      name: `projects/PROJECT_ID/secrets/AUTH0_SECRET/versions/latest`
    });
  });

  it("Should proceed if registration_to_complete = false and valid session", async () => {
    auth0Instance.getSession.mockImplementationOnce(() => ({
      user: {
        [`${process.env.AUTH0_NAMESPACE}/registration_to_complete`]: false,
        [`${process.env.AUTH0_NAMESPACE}/intouch_market_code`]: "en"
      }
    }));
    axios.get = jest.fn().mockResolvedValueOnce({ data: {} });

    const resultProps = await getAuth0Instance(req, res);
    expect(typeof resultProps).toEqual(typeof initAuth0());
  });

  it("Should redirect if registration_to_complete = true", async () => {
    axios.get = jest.fn().mockResolvedValueOnce({ data: {} });
    auth0Instance.getSession.mockImplementationOnce(() => ({
      user: {
        [`${process.env.AUTH0_NAMESPACE}/registration_to_complete`]: true,
        [`${process.env.AUTH0_NAMESPACE}/intouch_market_code`]: "en"
      }
    }));

    await getAuth0Instance(req, res);

    expect(res.writeHead).toHaveBeenCalledWith(302, {
      Location: "/company-registration"
    });
  });
});
