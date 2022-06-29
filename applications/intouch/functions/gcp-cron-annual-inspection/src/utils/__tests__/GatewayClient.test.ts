process.env.FRONTEND_API_URL = "http://localhost/";
process.env.GATEWAY_API_KEY = "bearer";

import GatewayClient from "../GatewayClient";

const fetchSpy = jest.fn();
const requestSpy = jest.fn();
jest.mock("node-fetch", () => {
  const original = jest.requireActual("node-fetch");
  return {
    __esModule: true,
    ...original,
    default: (...options: any[]) => fetchSpy(options),
    Request: jest.fn((...options: any[]) => requestSpy(options))
  };
});

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
      await GatewayClient.create();
    });
  });

  describe("annualInspection", () => {
    const raw = JSON.stringify({
      source: "annual-inspection-function",
      sub: ""
    });
    const userinfo = Buffer.from(raw).toString("base64");
    const body = JSON.stringify({
      query: `mutation annualProjectsInspection {
        annualProjectsInspection
      }`
    });

    it("normal case", async () => {
      const gateway = await GatewayClient.create();
      await gateway.annualInspection();

      expect(requestSpy).toHaveBeenLastCalledWith([
        {
          url: process.env.FRONTEND_API_URL,
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
