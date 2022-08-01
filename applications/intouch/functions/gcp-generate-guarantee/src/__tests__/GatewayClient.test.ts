process.env.FRONTEND_API_URL = "http://localhost/";

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

  describe("updateGuaranteeFileStorage", () => {
    it("normal case", async () => {
      const id = 1;
      const fileStorageId = "2";
      const body = {
        query: `mutation updateGuaranteeFileStorage($id: Int!, $fileStorageId: String!) {
        updateGuarantee(
          input: { id: $id, patch: { fileStorageId: $fileStorageId } }
        ) {
          guarantee {
            id
          }
        }
      }`,
        variables: {
          id,
          fileStorageId
        }
      };
      const raw = JSON.stringify({
        source: "pdf-generator-function"
      });
      const userinfo = Buffer.from(raw).toString("base64");
      const bearer = "bearer";
      getSecretSpy.mockReturnValueOnce(bearer);
      const gateway = await GatewayClient.create();
      await gateway.updateGuaranteeFileStorage(1, "2");

      expect(requestSpy).toHaveBeenNthCalledWith(1, [
        process.env.FRONTEND_API_URL,
        {
          headers: {
            "Content-Type": "application/json",
            "x-apigateway-api-userinfo": userinfo,
            authorization: "bearer undefined",
            "x-api-key": "bearer"
          }
        }
      ]);
      expect(requestSpy).toHaveBeenNthCalledWith(2, [
        {
          url: process.env.FRONTEND_API_URL,
          headers: {
            "Content-Type": "application/json",
            "x-apigateway-api-userinfo": userinfo,
            authorization: "bearer undefined",
            "x-api-key": "bearer"
          }
        },
        {
          method: "POST",
          body: JSON.stringify(body)
        }
      ]);
    });
  });
});
