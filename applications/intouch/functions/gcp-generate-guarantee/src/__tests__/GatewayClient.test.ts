process.env.FRONTEND_API_URL = "http://localhost/";
process.env.GATEWAY_API_KEY = "bearer";
process.env.DOUBLE_ACCEPTANCE_EXPIRY_AFTER = "1";

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

  const raw = JSON.stringify({
    source: "pdf-generator-function",
    market: "en"
  });

  it("updateGuaranteeFileStorage", async () => {
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

    const userinfo = Buffer.from(raw).toString("base64");
    const gateway = await GatewayClient.create("en");
    await gateway.updateGuaranteeFileStorage(1, "2");

    expect(requestSpy).toHaveBeenNthCalledWith(1, [
      process.env.FRONTEND_API_URL,
      {
        headers: {
          "Content-Type": "application/json",
          "x-apigateway-api-userinfo": userinfo,
          authorization: "bearer undefined",
          "x-api-key": "bearer",
          "x-request-market-domain": "en"
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
          "x-api-key": "bearer",
          "x-request-market-domain": "en"
        }
      },
      {
        method: "POST",
        body: JSON.stringify(body)
      }
    ]);
  });

  it("createDoubleAcceptance", async () => {
    const guaranteeId = 1;
    const body = {
      query: `mutation createDoubleAcceptance($guaranteeId: Int!, $expiryDate: Datetime!) {
        createDoubleAcceptance(input: { doubleAcceptance: { guaranteeId: $guaranteeId, expiryDate: $expiryDate }}) {
          doubleAcceptance {
            id
            tempToken
          }
        }
      }`,
      variables: {
        guaranteeId,
        expiryDate: new Date(
          new Date().setDate(
            new Date().getDate() +
              parseInt(process.env.DOUBLE_ACCEPTANCE_EXPIRY_AFTER as string)
          )
        )
          .toISOString()
          .replace("T", " ")
          .replace("Z", "")
          .toString()
      }
    };

    const userinfo = Buffer.from(raw).toString("base64");
    const gateway = await GatewayClient.create("en");
    await gateway.createDoubleAcceptance(1);

    expect(requestSpy).toHaveBeenNthCalledWith(1, [
      process.env.FRONTEND_API_URL,
      {
        headers: {
          "Content-Type": "application/json",
          "x-apigateway-api-userinfo": userinfo,
          authorization: "bearer undefined",
          "x-api-key": "bearer",
          "x-request-market-domain": "en"
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
          "x-api-key": "bearer",
          "x-request-market-domain": "en"
        }
      },
      {
        method: "POST",
        body: JSON.stringify(body)
      }
    ]);
  });

  it("updateGuaranteeStatus", async () => {
    const id = 1;
    const body = {
      query: `mutation updateGuaranteeStatus($id: Int!) {
        updateGuarantee(
          input: { id: $id, patch: { status: ISSUED } }
        ) {
          guarantee {
            id
          }
        }
      }`,
      variables: {
        id
      }
    };
    const userinfo = Buffer.from(raw).toString("base64");
    const gateway = await GatewayClient.create("en");
    await gateway.updateGuaranteeStatus(1);

    expect(requestSpy).toHaveBeenNthCalledWith(1, [
      process.env.FRONTEND_API_URL,
      {
        headers: {
          "Content-Type": "application/json",
          "x-apigateway-api-userinfo": userinfo,
          authorization: "bearer undefined",
          "x-api-key": "bearer",
          "x-request-market-domain": "en"
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
          "x-api-key": "bearer",
          "x-request-market-domain": "en"
        }
      },
      {
        method: "POST",
        body: JSON.stringify(body)
      }
    ]);
  });
});
