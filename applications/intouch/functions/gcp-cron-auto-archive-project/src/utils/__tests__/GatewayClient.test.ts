process.env.GATEWAY_API_URL = "http://localhost/";

import GatewayClient from "../GatewayClient";

const fetchSpy = jest.fn();
const requestSpy = jest.fn();
jest.mock("node-fetch", () => {
  const original = jest.requireActual("node-fetch");
  return {
    __esModule: true,
    ...original(),
    default: (...options: any[]) => fetchSpy(options),
    Request: jest.fn((...options: any[]) => requestSpy(options))
  };
});
const getSecretSpy = jest.fn();
jest.mock("@bmi-digital/functions-secret-client", () => ({
  getSecret: (key: any) => getSecretSpy(key)
}));

describe("GatewayClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    requestSpy.mockImplementation((options) => {
      const firstArg =
        typeof options[0] === "object"
          ? { ...options[0] }
          : { url: options[0] };
      return {
        ...firstArg,
        ...options[1]
      };
    });
  });

  describe("create", () => {
    it("normal case", async () => {
      const bearer = "bearer";
      getSecretSpy.mockReturnValueOnce(bearer);

      await GatewayClient.create();
      expect(getSecretSpy).toHaveBeenCalledWith("GATEWAY_API_KEY");
    });
  });

  describe("archiveGuarantee", () => {
    const raw = JSON.stringify({
      source: "archive-guarantee-function",
      sub: ""
    });
    const userinfo = Buffer.from(raw).toString("base64");
    const body = JSON.stringify({
      query: `mutation archiveProjects {
        archiveProjects
      }`
    });

    it("normal case", async () => {
      const bearer = "bearer";
      getSecretSpy.mockReturnValueOnce(bearer);
      const gateway = await GatewayClient.create();
      await gateway.archiveGuarantee();

      expect(requestSpy).toHaveBeenLastCalledWith([
        {
          url: process.env.GATEWAY_API_URL,
          headers: {
            "Content-Type": "application/json",
            authorization: "bearer undefined",
            "x-api-key": "bearer",
            "x-apigateway-api-userinfo": userinfo
          }
        },
        {
          method: "POST",
          body
        }
      ]);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
  });
});
